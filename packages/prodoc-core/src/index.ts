/**
 * ProDoc Core - 文档解析与数据模型
 *
 * ProDoc 模型（文档图）的实现位于本包：
 * - frame.ts  框架参数区解析（--- 夹住的区域，渲染时剥离）
 * - graph.ts  文档图构建（每个 md 文件 = 图上一个框）
 *
 * prodoc-flow 流程图的解析与布局从 @echolab-auto/ui-frame/doc 重新导出。
 */

// ============ 框架参数区 + 文档图 ============
export { parseFrameBlock, writeFramePosition, readFrameLinks, writeFrameLinks, writeFrameGroup, asRefs } from './frame.js';
export type { FrameBlock, FramePosition } from './frame.js';
export {
  buildDocGraph,
  computeLayeredLayout,
  computeTreeLayout,
  computeGroupRegion,
  BOX_DEFAULT_W,
  BOX_DEFAULT_H,
  MAX_BLOCK_SLOTS,
  GROUP_PAD,
  GROUP_LABEL_H,
  parseLinkEntry,
  buildLinkEntry,
  parseGroupEntry,
  buildGroupEntry,
} from './graph.js';
export type { DocBlock, DocBox, DocGraph, DocGroup, DocRelation, GroupGeometry, LinkSide } from './graph.js';

// ============ 流程图（prodoc-flow）类型导出 ============
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

// 流程图解析与布局导出
export {
  parseProDocFlow,
  extractFlowBlocks,
  layoutProDocFlow,
  resolveCanvasGraph,
  buildHierarchyGraph,
} from '@echolab-auto/ui-frame/doc'

export { buildDocTree, flattenTree, ancestorsOf } from './tree.js';
export type { DocTreeNode, DocTreeBuildResult } from './tree.js';
