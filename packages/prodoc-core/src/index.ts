/**
 * ProDoc Core - 文档解析与数据模型
 *
 * 所有实现来自 @echolab-auto/ui-frame/doc，此处只做重新导出。
 * 不维护独立的实现副本，确保行为与 ui-frame 完全一致。
 */

// 类型导出
export type {
  ProDocNode,
  DocTree,
  ProDocOptions,
} from '@echolab-auto/ui-frame/doc'

// 流程图（prodoc-flow）类型导出
export type {
  ProDocFlowDirection,
  ProDocFlowNodeShape,
  ProDocFlowNode,
  ProDocFlowEdge,
  ProDocFlowError,
  ProDocFlowGraph,
  FlowLayoutNode,
  FlowLayoutEdge,
  FlowLayoutResult,
} from '@echolab-auto/ui-frame/doc'

// 解析器导出
export {
  parseFrontmatter,
  pathToId,
  extractTitle,
  createNode,
  buildDocTree,
} from '@echolab-auto/ui-frame/doc'

// 流程图解析与布局导出
export {
  parseProDocFlow,
  extractFlowBlocks,
  layoutProDocFlow,
  resolveCanvasGraph,
  buildHierarchyGraph,
} from '@echolab-auto/ui-frame/doc'

// 文档树工具导出
export {
  createDocTree,
  flattenDocTree,
  getAncestors,
} from '@echolab-auto/ui-frame/doc'

// 树节点转换工具
export {
  getNodeIcon,
  nodeToTreeData,
} from '@echolab-auto/ui-frame/doc'
export type { DocTreeNode } from '@echolab-auto/ui-frame/doc'
