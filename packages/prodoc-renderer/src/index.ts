/**
 * ProDoc Renderer - Vue 3 渲染组件库
 *
 * 新 ProDoc 模型（文档图）的查看器为 DocGraphViewer（本包实现）。
 * 旧文档树组件仍从 @echolab-auto/ui-frame/doc 重新导出，供旧路径使用。
 */

// 新模型：文档图查看器
export { default as DocGraphViewer } from './components/DocGraphViewer.vue';

// 旧模型（legacy，重新导出）
export { DocViewer, type DocViewerProps } from '@echolab-auto/ui-frame/doc'
export { MarkdownRenderer, type MarkdownRendererProps } from '@echolab-auto/ui-frame/doc'
export { DocFlowCanvas, type DocFlowCanvasProps } from '@echolab-auto/ui-frame/doc'

// 引入 ui-frame 全局样式（CSS 变量 + 组件基础样式）
import '@echolab-auto/ui-frame/dist/style.css'
// 引入 ProDoc 自定义样式
import './styles/index.css'
