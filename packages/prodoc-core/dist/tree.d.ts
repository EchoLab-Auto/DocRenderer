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
/**
 * 从文件列表构建文档树。
 * @param files 文档列表：{ path, content }，path 相对文档根（如 guide/getting-started.md）
 */
export declare function buildDocTree(files: Array<{
    path: string;
    content: string;
}>): DocTreeBuildResult;
/** 扁平化树（先序），用于搜索/渲染高亮 */
export declare function flattenTree(root: DocTreeNode): DocTreeNode[];
/** 获取节点的祖先链（从根到父） */
export declare function ancestorsOf(root: DocTreeNode, target: DocTreeNode): DocTreeNode[];
//# sourceMappingURL=tree.d.ts.map