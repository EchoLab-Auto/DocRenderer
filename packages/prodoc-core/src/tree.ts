/**
 * 文档树（DocTree）构建 —— 树状图自组织
 *
 * 文档图（DocGraph）表达导航关系（link 连线）；
 * 文档树表达**分级与包含关系**（目录层级 / parent / order），
 * 供渲染器左侧树状索引和"分级导航"使用。
 *
 * 自组织规则：
 * 1. 目录层级 = 默认父子关系（guide/getting-started.md 属于 guide 目录节点）
 * 2. 参数区 `parent` 显式声明父文档（id 或路径），覆盖目录推断（包含关系）
 * 3. 参数区 `order` 控制同级排序（缺省按文件名）
 * 4. 目录节点自动生成（无 index.md 时为 isDir 虚节点，标题 = 目录名）
 * 5. 根目录存在 index.md 时作为根节点（包裹其余节点），否则根为虚拟根
 */

import { parseFrameBlock } from './frame.js';

/** 树节点 */
export interface DocTreeNode {
  /** 唯一 id（参数 id，缺省为路径去 .md） */
  id: string;
  /** 显示标题 */
  title: string;
  /** 文档路径（相对文档根；目录节点为目录路径） */
  path: string;
  /** 是否为目录虚节点（目录下无自身文档） */
  isDir: boolean;
  /** 同级排序权重（参数 order，缺省按路径字典序） */
  order: number;
  /** 父文档 id/路径（参数 parent；覆盖目录推断） */
  parent?: string;
  /** 子节点 */
  children: DocTreeNode[];
}

/** 构建结果 */
export interface DocTreeBuildResult {
  root: DocTreeNode;
  /** path -> 节点 映射（含目录虚节点） */
  nodeMap: Map<string, DocTreeNode>;
  warnings: string[];
}

/** 读取文件标题：参数 title → 正文第一个 H1 → 文件名 */
function titleOf(content: string, path: string): string {
  const frame = parseFrameBlock(content);
  const t = frame.params['title'];
  if (typeof t === 'string' && t.trim()) return t.trim();
  const h1 = frame.body.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  const base = path.split('/').pop() ?? path;
  return base.replace(/\.md$/, '');
}

interface RawDoc {
  path: string;
  id: string;
  title: string;
  order: number;
  parent?: string;
}

/** 目录 → 直属子文件名集合（用于识别目录虚节点） */
function dirChildrenMap(docs: RawDoc[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const d of docs) {
    const idx = d.path.lastIndexOf('/');
    const dir = idx === -1 ? '' : d.path.slice(0, idx);
    const name = d.path.slice(idx + 1);
    if (!map.has(dir)) map.set(dir, []);
    map.get(dir)!.push(name);
  }
  return map;
}

/**
 * 从文件列表构建文档树。
 * @param files 文档列表：{ path, content }，path 相对文档根（如 guide/getting-started.md）
 */
export function buildDocTree(files: Array<{ path: string; content: string }>): DocTreeBuildResult {
  const warnings: string[] = [];
  const docs: RawDoc[] = [];
  const idToPath = new Map<string, string>();

  for (const f of files) {
    const frame = parseFrameBlock(f.content);
    const params = frame.params;
    const id = typeof params['id'] === 'string' && params['id'].trim()
      ? params['id'].trim()
      : f.path.replace(/\.md$/, '');
    const order = typeof params['order'] === 'number'
      ? params['order']
      : typeof params['order'] === 'string'
        ? Number(params['order']) || 0
        : 0;
    const parent = typeof params['parent'] === 'string' && params['parent'].trim()
      ? params['parent'].trim()
      : undefined;
    docs.push({
      path: f.path,
      id,
      title: titleOf(f.content, f.path),
      order,
      parent,
    });
    if (idToPath.has(id)) {
      warnings.push(`duplicate id "${id}" in tree (${idToPath.get(id)} / ${f.path})`);
    }
    idToPath.set(id, f.path);
  }

  // id / parent 引用解析：parent 以 id 或路径命中
  const parentPathOf = (d: RawDoc): string | undefined => {
    if (!d.parent) return undefined;
    const byId = idToPath.get(d.parent);
    const asPath = d.parent.endsWith('.md') ? d.parent : `${d.parent}.md`;
    if (byId) return byId;
    if (docs.some((x) => x.path === asPath)) return asPath;
    warnings.push(`parent "${d.parent}" of ${d.path} not found; falling back to directory level`);
    return undefined;
  };

  // 节点构建：文档节点 + 目录虚节点
  const nodeMap = new Map<string, DocTreeNode>();
  const ensureDirNode = (dir: string): DocTreeNode => {
    if (nodeMap.has(dir)) return nodeMap.get(dir)!;
    const node: DocTreeNode = {
      id: dir || '___root___',
      title: dir ? dir.split('/').pop()! : '根',
      path: dir,
      isDir: true,
      order: 0,
      children: [],
    };
    nodeMap.set(dir, node);
    return node;
  };

  const root: DocTreeNode = {
    id: '___root___',
    title: '文档',
    path: '',
    isDir: true,
    order: 0,
    children: [],
  };
  nodeMap.set('', root);

  // 先建文档节点
  for (const d of docs) {
    const node: DocTreeNode = {
      id: d.id,
      title: d.title,
      path: d.path,
      isDir: false,
      order: d.order,
      parent: d.parent,
      children: [],
    };
    nodeMap.set(d.path, node);
  }

  // 挂接：parent 显式 > 目录层级
  for (const d of docs) {
    const node = nodeMap.get(d.path)!;
    const explicit = parentPathOf(d);
    if (explicit) {
      const parentPath = explicit;
      const parentNode = nodeMap.get(parentPath);
      if (parentNode) {
        parentNode.children.push(node);
        continue;
      }
      // 父是目录虚节点（parent 指向目录 id 的路径化）——尝试注释为目录
      const dirNode = ensureDirNode(parentPath);
      dirNode.children.push(node);
      continue;
    }
    // 目录层级
    const idx = d.path.lastIndexOf('/');
    const dir = idx === -1 ? '' : d.path.slice(0, idx);
    const dirNode = ensureDirNode(dir);
    dirNode.children.push(node);
  }

  // 目录虚节点挂到其父目录（层级链）
  for (const key of [...nodeMap.keys()]) {
    if (key === '' || key === '___root___') continue;
    const node = nodeMap.get(key)!;
    if (!node.isDir) continue;
    // 若该目录已有同名之子文档（index.md）则不作为虚节点——移除
    const hasIndex = node.children.some((c) => c.path === `${key}/index.md`);
    if (hasIndex) {
      // 目录虚节点由 index.md 文档节点呈现（index 作为该目录标题）
      // 将虚节点移除，index.md 的父改为上层
      const upper = key.lastIndexOf('/');
      const upperDir = upper === -1 ? '' : key.slice(0, upper);
      const upperNode = nodeMap.get(upperDir) ?? root;
      // 把 node.children 交给 index 节点？
      const idxNode = node.children.find((c) => c.path === `${key}/index.md`);
      if (idxNode) {
        // index.md 成为目录节点本身：移除虚节点，父重挂
        nodeMap.delete(key);
        upperNode.children = upperNode.children.filter((c) => c !== node);
        idxNode.isDir = true; // 表示"目录入口文档"
        idxNode.children = node.children.filter((c) => c !== idxNode);
        upperNode.children.push(idxNode);
        nodeMap.set(key, idxNode);
      }
      continue;
    }
    // 普通目录虚节点挂到上层
    const upper = key.lastIndexOf('/');
    const upperDir = upper === -1 ? '' : key.slice(0, upper);
    const upperNode = nodeMap.get(upperDir) ?? root;
    upperNode.children.push(node);
  }

  // 排序：order 升序（同值按标题），目录节点优先（isDir 在前）
  const sortChildren = (node: DocTreeNode) => {
    node.children.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
    for (const c of node.children) sortChildren(c);
  };
  sortChildren(root);

  return { root, nodeMap, warnings };
}

/** 扁平化树（先序），用于搜索/渲染高亮 */
export function flattenTree(root: DocTreeNode): DocTreeNode[] {
  const out: DocTreeNode[] = [];
  const walk = (node: DocTreeNode) => {
    out.push(node);
    for (const c of node.children) walk(c);
  };
  walk(root);
  return out;
}

/** 获取节点的祖先链（从根到父） */
export function ancestorsOf(root: DocTreeNode, target: DocTreeNode): DocTreeNode[] {
  const chain: DocTreeNode[] = [];
  const walk = (node: DocTreeNode): boolean => {
    if (node === target) return true;
    for (const c of node.children) {
      chain.push(node);
      if (walk(c)) return true;
      chain.pop();
    }
    return false;
  };
  walk(root);
  return chain;
}
