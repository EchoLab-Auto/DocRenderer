/**
 * ProDoc 核心类型定义
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

/** 流程图节点形状 */
export type FlowNodeShape = 'rect' | 'diamond' | 'circle' | 'round-rect';

/** 流程图节点 */
export interface FlowNode {
  /** 节点 ID */
  id: string;
  /** 显示文本 */
  label: string;
  /** 节点形状 */
  shape: FlowNodeShape;
  /** 节点位置（在画布坐标系中） */
  x: number;
  y: number;
  /** 节点尺寸 */
  width: number;
  height: number;
  /** 关联的文档路径（可选） */
  docPath?: string;
  /** 节点样式 */
  style?: FlowNodeStyle;
}

/** 流程图节点样式 */
export interface FlowNodeStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  textColor?: string;
}

/** 流程图边 */
export interface FlowEdge {
  /** 边 ID */
  id: string;
  /** 起始节点 ID */
  from: string;
  /** 目标节点 ID */
  to: string;
  /** 边标签 */
  label?: string;
  /** 边样式 */
  style?: FlowEdgeStyle;
}

/** 流程图边样式 */
export interface FlowEdgeStyle {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

/** 流程图数据 */
export interface FlowGraph {
  /** 流程图节点列表 */
  nodes: FlowNode[];
  /** 流程图边列表 */
  edges: FlowEdge[];
  /** 画布视口信息 */
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
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

/** ProDoc 配置选项 */
export interface ProDocOptions {
  /** 文档根目录路径 */
  docsRoot?: string;
  /** 首页路径 */
  indexPath?: string;
}
