/**
 * Markdown 和 frontmatter 解析器
 */

import type { ProDocNode } from './types.js';

const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*\n?/;

/** 解析 frontmatter 为对象 */
export function parseFrontmatter(content: string): { meta: Record<string, unknown>; body: string } {
  const match = content.match(FRONTMATTER_REGEX);
  if (!match) {
    return { meta: {}, body: content };
  }

  const raw = match[1];
  const body = content.slice(match[0].length);
  const meta: Record<string, unknown> = {};

  for (const line of raw.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: unknown = line.slice(colonIdx + 1).trim();

    // 尝试解析数字
    if (/^-?\d+$/.test(value as string)) {
      value = parseInt(value as string, 10);
    } else if (/^-?\d+\.\d+$/.test(value as string)) {
      value = parseFloat(value as string);
    } else if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    } else if ((value as string).startsWith('"') && (value as string).endsWith('"')) {
      value = (value as string).slice(1, -1);
    } else if ((value as string).startsWith("'") && (value as string).endsWith("'")) {
      value = (value as string).slice(1, -1);
    }

    meta[key] = value;
  }

  return { meta, body };
}

/** 从文件路径生成文档 ID */
export function pathToId(filePath: string): string {
  return filePath
    .replace(/\.md$/i, '')
    .replace(/\//g, '-')
    .replace(/\\/g, '-');
}

/** 从文件内容解析出标题（H1 或 frontmatter title） */
export function extractTitle(body: string, meta: Record<string, unknown>): string {
  if (meta.title && typeof meta.title === 'string') {
    return meta.title;
  }
  const h1Match = body.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  return 'Untitled';
}

/** 创建单个 ProDocNode */
export function createNode(filePath: string, content: string): ProDocNode {
  const { meta, body } = parseFrontmatter(content);
  const title = extractTitle(body, meta);
  const order = typeof meta.order === 'number' ? meta.order : 9999;

  return {
    id: pathToId(filePath),
    title,
    path: filePath,
    content,
    body,
    meta,
    children: [],
    order,
  };
}

/** 从文件结构构建文档树 */
export function buildDocTree(files: Record<string, string>): ProDocNode {
  const nodes = new Map<string, ProDocNode>();

  // 先创建所有节点
  for (const [path, content] of Object.entries(files)) {
    if (!path.endsWith('.md')) continue;
    const node = createNode(path, content);
    nodes.set(path, node);
  }

  // 建立父子关系
  const rootPaths: string[] = [];
  const pathEntries = Array.from(nodes.keys()).sort();

  for (const path of pathEntries) {
    const parts = path.split('/');
    if (parts.length === 1) {
      rootPaths.push(path);
      continue;
    }

    // 查找父节点：同一目录下的 index.md，或者上一级目录
    let parentPath: string | null = null;

    // 尝试上级目录的 index.md
    const parentDir = parts.slice(0, -1).join('/');
    const parentIndex = `${parentDir}/index.md`;
    if (nodes.has(parentIndex) && parentIndex !== path) {
      parentPath = parentIndex;
    } else {
      // 尝试直接上级文件
      const parentFile = parts.slice(0, -1).join('/') + '.md';
      if (nodes.has(parentFile)) {
        parentPath = parentFile;
      }
    }

    if (parentPath && nodes.has(parentPath)) {
      const parent = nodes.get(parentPath)!;
      const child = nodes.get(path)!;
      parent.children.push(child);
    } else {
      rootPaths.push(path);
    }
  }

  // 对子节点排序
  for (const node of nodes.values()) {
    node.children.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  }

  // 创建虚拟根节点
  const rootChildren = rootPaths
    .map(p => nodes.get(p)!)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  const root: ProDocNode = {
    id: 'root',
    title: 'Root',
    path: '',
    content: '',
    body: '',
    meta: {},
    children: rootChildren,
    order: 0,
  };

  return root;
}
