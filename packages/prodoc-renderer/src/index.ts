/**
 * ProDoc Renderer - Vue 3 渲染组件库
 */

export { default as DocViewer, type DocViewerProps } from './components/DocViewer.vue'
export { default as MarkdownRenderer, type MarkdownRendererProps } from './components/MarkdownRenderer.vue'

// 引入 ui-frame 全局样式（CSS 变量 + 组件基础样式）
import '@echolab/ui-frame/dist/style.css'
// 引入 ProDoc 自定义样式
import './styles/index.css'
