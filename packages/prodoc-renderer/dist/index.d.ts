/**
 * ProDoc Renderer - Vue 3 渲染组件库
 *
 * 新 ProDoc 模型（文档图）的查看器为 DocGraphViewer（本包实现）。
 * 旧文档树组件仍从 @echolab-auto/ui-frame/doc 重新导出，供旧路径使用。
 */
export { default as DocGraphViewer } from './components/DocGraphViewer.vue';
export { DocViewer, type DocViewerProps } from '@echolab-auto/ui-frame/doc';
export { MarkdownRenderer, type MarkdownRendererProps } from '@echolab-auto/ui-frame/doc';
export { DocFlowCanvas, type DocFlowCanvasProps } from '@echolab-auto/ui-frame/doc';
import '@echolab-auto/ui-frame/dist/style.css';
import './styles/index.css';
//# sourceMappingURL=index.d.ts.map