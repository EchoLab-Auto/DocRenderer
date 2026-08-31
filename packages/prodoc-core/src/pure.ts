/** Node-safe ProDoc frame and graph APIs without UI side effects. */
export { parseFrameBlock, writeFramePosition, readFrameLinks, writeFrameLinks, writeFrameGroup, asRefs } from './frame.js';
export type { FrameBlock, FramePosition } from './frame.js';
export {
  buildDocGraph,
  computeLayeredLayout,
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
export { buildDocTree, flattenTree, ancestorsOf } from './tree.js';
export type { DocTreeNode, DocTreeBuildResult } from './tree.js';
