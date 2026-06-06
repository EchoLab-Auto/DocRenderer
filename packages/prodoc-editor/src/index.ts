/**
 * ProDoc Editor - Vue 3 编辑器组件库
 */

export { default as DocEditor, type DocEditorProps } from './components/DocEditor.vue'
export { default as MarkdownEditor, type MarkdownEditorProps } from './components/MarkdownEditor.vue'

// 引入 ui-frame 全局样式（CSS 变量 + 组件基础样式）
import '@echolab/ui-frame/dist/style.css'
// 引入 ProDoc 自定义样式
import './styles/index.css'
