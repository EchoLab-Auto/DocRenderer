/**
 * @echolab/ui-frame/doc — 文档渲染模块
 *
 * 提供 Markdown 渲染、文档查看器和编辑器组件，
 * 以及文档解析和树形结构工具。
 *
 * @example
 * ```ts
 * import { DocViewer, MarkdownRenderer, DocEditor, MarkdownEditor } from '@echolab/ui-frame/doc'
 * import type { ProDocNode, DocTree, DocViewerProps, MarkdownRendererProps } from '@echolab/ui-frame/doc'
 * ```
 */
export { default as DocViewer } from './DocViewer';
export type { DocViewerProps } from './DocViewer';
export { default as MarkdownRenderer } from './MarkdownRenderer';
export type { MarkdownRendererProps } from './MarkdownRenderer';
export { default as DocEditor } from './DocEditor';
export type { DocEditorProps } from './DocEditor';
export { default as MarkdownEditor } from './MarkdownEditor';
export type { MarkdownEditorProps } from './MarkdownEditor';
export type { ProDocNode, DocTree, ProDocOptions } from './types.js';
export { parseFrontmatter, pathToId, extractTitle, createNode, buildDocTree } from './parser.js';
export { createDocTree, flattenDocTree, getAncestors } from './doc-tree.js';
export { getNodeIcon, nodeToTreeData } from './tree-utils.js';
export type { DocTreeNode } from './tree-utils.js';
export { useDocLayout } from './useDocLayout';
export type { UseDocLayoutOptions, UseDocLayoutReturn } from './useDocLayout';
