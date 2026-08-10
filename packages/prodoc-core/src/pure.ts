/** Node-safe ProDoc frame and graph APIs without UI side effects. */
export { parseFrameBlock, writeFramePosition, readFrameLinks, writeFrameLinks, asRefs } from './frame.js';
export type { FrameBlock, FramePosition } from './frame.js';
export {
  buildDocGraph,
  computeLayeredLayout,
  BOX_DEFAULT_W,
  BOX_DEFAULT_H,
  MAX_BLOCK_SLOTS,
  parseLinkEntry,
  buildLinkEntry,
} from './graph.js';
export type { DocBlock, DocBox, DocGraph, DocRelation, LinkSide } from './graph.js';
