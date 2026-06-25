/**
 * Doc 模块核心类型定义
 *
 * 文档节点、文档树和配置选项的类型声明。
 */
/** 文档节点 */
export interface ProDocNode {
    /** 唯一标识符 */
    id: string;
    /** 文档标题 */
    title: string;
    /** 文档路径（相对于 docs 根目录） */
    path: string;
    /** Markdown 原始内容 */
    content: string;
    /** 解析后的内容（不含 frontmatter） */
    body: string;
    /** frontmatter 元数据 */
    meta: Record<string, unknown>;
    /** 子文档 */
    children: ProDocNode[];
    /** 排序权重 */
    order: number;
}
/** 文档树结构 */
export interface DocTree {
    /** 根节点 */
    root: ProDocNode;
    /** 所有节点映射（path -> node） */
    nodeMap: Map<string, ProDocNode>;
    /** 根据路径查找节点 */
    findByPath(path: string): ProDocNode | undefined;
    /** 根据 ID 查找节点 */
    findById(id: string): ProDocNode | undefined;
}
/** Doc 模块配置选项 */
export interface ProDocOptions {
    /** 文档根目录路径 */
    docsRoot?: string;
    /** 首页路径 */
    indexPath?: string;
}
