/**
 * ProDoc Core - 文档解析与数据模型
 */

// 类型导出
export type {
  ProDocNode,
  FlowNode,
  FlowEdge,
  FlowGraph,
  FlowNodeShape,
  FlowNodeStyle,
  FlowEdgeStyle,
  DocTree,
  ProDocOptions,
} from './types.js';

// 解析器导出
export {
  parseFrontmatter,
  pathToId,
  extractTitle,
  createNode,
  buildDocTree,
} from './parser.js';

// 流程图导出
export {
  parseFlowDsl,
  exportFlowDsl,
} from './flow-parser.js';

// 文档树工具导出
export {
  createDocTree,
  flattenDocTree,
  getAncestors,
  findFlowNodes,
} from './doc-tree.js';

// 树节点转换工具
export {
  getNodeIcon,
  nodeToTreeData,
} from './tree-utils.js';
export type { DocTreeNode } from './tree-utils.js';
