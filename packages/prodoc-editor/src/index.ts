/**
 * ProDoc Editor - Vue 3 编辑器组件库
 *
 * 组件实现来自 @echolab-auto/ui-frame/doc，此处只做重新导出。
 */

export { DocEditor, type DocEditorProps } from '@echolab-auto/ui-frame/doc'
export { MarkdownEditor, type MarkdownEditorProps } from '@echolab-auto/ui-frame/doc'

// 引入 ui-frame 全局样式（CSS 变量 + 组件基础样式）
import '@echolab-auto/ui-frame/dist/style.css'
// 引入 ProDoc 自定义样式
import './styles/index.css'
