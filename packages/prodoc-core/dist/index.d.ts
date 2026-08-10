/**
 * ProDoc Core - 文档解析与数据模型
 *
 * 新 ProDoc 模型（文档图）的实现位于本包：
 * - frame.ts  框架参数区解析（--- 夹住的区域，渲染时剥离）
 * - graph.ts  文档图构建（每个 md 文件 = 图上一个框）
 *
 * 旧的文档树模型仍从 @echolab-auto/ui-frame/doc 重新导出，
 * 供编辑模式（DocEditor）等旧路径使用。
 */
export { parseFrameBlock, writeFramePosition, readFrameLinks, writeFrameLinks, asRefs } from './frame.js';
export type { FrameBlock, FramePosition } from './frame.js';
export { buildDocGraph, computeLayeredLayout, BOX_DEFAULT_W, BOX_DEFAULT_H, MAX_BLOCK_SLOTS, parseLinkEntry, buildLinkEntry, } from './graph.js';
export type { DocBlock, DocBox, DocGraph, DocRelation, LinkSide } from './graph.js';
export type { ProDocNode, DocTree, ProDocOptions, } from '@echolab-auto/ui-frame/doc';
export type { ProDocFlowDirection, ProDocFlowNodeShape, ProDocFlowNode, ProDocFlowEdge, ProDocFlowError, ProDocFlowGraph, FlowLayoutNode, FlowLayoutEdge, FlowLayoutResult, } from '@echolab-auto/ui-frame/doc';
export { parseFrontmatter, pathToId, extractTitle, createNode, buildDocTree, } from '@echolab-auto/ui-frame/doc';
export { parseProDocFlow, extractFlowBlocks, layoutProDocFlow, resolveCanvasGraph, buildHierarchyGraph, } from '@echolab-auto/ui-frame/doc';
export { createDocTree, flattenDocTree, getAncestors, } from '@echolab-auto/ui-frame/doc';
export { getNodeIcon, nodeToTreeData, } from '@echolab-auto/ui-frame/doc';
export type { DocTreeNode } from '@echolab-auto/ui-frame/doc';
//# sourceMappingURL=index.d.ts.map