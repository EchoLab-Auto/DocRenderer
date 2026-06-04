/**
 * ProDoc Editor - Vue 3 编辑器组件库
 *
 * 注意：ui-frame 的全局样式由 @prodoc/renderer 引入，
 * editor 作为 renderer 的下游包，无需重复导入。
 */

export { default as DocEditor, type DocEditorProps } from './components/DocEditor.vue'
export { default as MarkdownEditor, type MarkdownEditorProps } from './components/MarkdownEditor.vue'
export { default as FlowEditor, type FlowEditorProps } from './components/FlowEditor.vue'

// 引入 ProDoc 自定义样式
import './styles/index.css'
