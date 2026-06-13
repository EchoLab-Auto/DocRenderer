/**
 * ProDoc Renderer - Vue 3 渲染组件库
 *
 * 组件实现来自 @echolab/ui-frame/doc，此处只做重新导出。
 * 保留 ProDoc 特有的样式定制（主题过渡、滚动条、选中颜色等）。
 */

export { DocViewer, type DocViewerProps } from '@echolab/ui-frame/doc'
export { MarkdownRenderer, type MarkdownRendererProps } from '@echolab/ui-frame/doc'

// 引入 ui-frame 全局样式（CSS 变量 + 组件基础样式）
import '@echolab/ui-frame/dist/style.css'
// 引入 ProDoc 自定义样式
import './styles/index.css'
