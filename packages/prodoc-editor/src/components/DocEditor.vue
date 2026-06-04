<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ProDocNode } from '@prodoc/core'
import { nodeToTreeData } from '@prodoc/core'
import type { TreeNodeData } from '@echolab/ui-frame'
import {
  NeumorphismLayout,
  NeumorphismButton,
  NeumorphismCard,
  NeumorphismThemeToggle,
  NeumorphismTree,
  NeumorphismDivider,
  NeumorphismTag,
  NeumorphismTooltip,
  useTheme,
} from '@echolab/ui-frame'
import MarkdownEditor from './MarkdownEditor.vue'

export interface DocEditorProps {
  /** 文档树根节点 */
  root: ProDocNode
  /** 初始选中的文档路径 */
  initialPath?: string
  /** 保存回调 */
  onSave?: (path: string, content: string) => void
  /** 文档链接点击回调 */
  onDocLink?: (path: string) => void
  /** 自定义样式类名 */
  className?: string
}

const props = withDefaults(defineProps<DocEditorProps>(), {
  className: '',
})

const emit = defineEmits<{
  (e: 'save', path: string, content: string): void
  (e: 'docLink', path: string): void
}>()

const selectedPath = ref(props.initialPath ?? '')
const editedContent = ref<Record<string, string>>({})
const expandedKeys = ref<string[]>([])

const { setTheme } = useTheme()

const treeData = computed(() => props.root.children.map(nodeToTreeData) as TreeNodeData[])

const selectedKeys = ref<string[]>(selectedPath.value ? [selectedPath.value] : [])

watch(selectedPath, (path) => {
  selectedKeys.value = path ? [path] : []
})

/** 查找当前节点 */
function findNode(path: string, node: ProDocNode = props.root): ProDocNode | undefined {
  if (node.path === path) return node
  for (const child of node.children) {
    const result = findNode(path, child)
    if (result) return result
  }
  return undefined
}

const selectedNode = computed(() => selectedPath.value ? findNode(selectedPath.value) : undefined)
const displayNode = computed(() => selectedNode.value || props.root.children[0])

/** 获取当前编辑内容 */
function getCurrentContent(node: ProDocNode): string {
  return editedContent.value[node.path] ?? node.content
}

/** 处理内容变化 */
function handleContentChange(value: string) {
  if (!displayNode.value) return
  editedContent.value[displayNode.value.path] = value
}

/** 处理保存 */
function handleSave() {
  if (!displayNode.value) return
  emit('save', displayNode.value.path, getCurrentContent(displayNode.value))
}

/** 处理树节点选择 */
function handleTreeSelect(key: string) {
  selectedPath.value = key
}

/** 处理文档链接 */
function handleDocLink(path: string) {
  selectedPath.value = path
  emit('docLink', path)
}

/** 是否有未保存的更改 */
const hasChanges = computed(() => {
  if (!displayNode.value) return false
  const edited = editedContent.value[displayNode.value.path]
  return edited !== undefined && edited !== displayNode.value.content
})

/** 键盘快捷键 */
function handleKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    handleSave()
  }
}
</script>

<template>
  <div :class="`prodoc-doc-editor ${props.className}`" @keydown="handleKeyDown">
    <NeumorphismLayout
      show-header
      show-sider
      :sider-width="280"
      collapsible
      class="prodoc-editor-layout"
    >
      <!-- Header -->
      <template #header-left>
        <div class="prodoc-editor-brand">
          <span class="prodoc-editor-brand__logo">📝</span>
          <span class="prodoc-editor-brand__title">ProDoc Editor</span>
        </div>
      </template>

      <template #header-center>
        <NeumorphismThemeToggle size="small" @change="setTheme" />
      </template>

      <template #header-right>
        <div class="prodoc-editor-actions">
          <NeumorphismTag
            v-if="hasChanges"
            variant="warning"
            size="small"
          >
            未保存
          </NeumorphismTag>
          <NeumorphismTooltip content="保存 (Ctrl+S)" position="bottom">
            <NeumorphismButton
              variant="raised"
              size="small"
              :disabled="!hasChanges"
              @click="handleSave"
            >
              💾 保存
            </NeumorphismButton>
          </NeumorphismTooltip>
        </div>
      </template>

      <!-- Sider -->
      <template #sider="{ collapsed }">
        <div v-if="!collapsed" class="prodoc-editor-sider">
          <NeumorphismTree
            :data="treeData"
            v-model:selected-keys="selectedKeys"
            v-model:expanded-keys="expandedKeys"
            show-search
            search-placeholder="搜索文档..."
            @node-select="handleTreeSelect"
          />
        </div>
        <div v-else class="prodoc-editor-sider--collapsed">📝</div>
      </template>

      <!-- Main editing area -->
      <template #default>
        <main class="prodoc-editor-content">
          <NeumorphismCard :elevation="-3" no-padding class="prodoc-editor-content-card">
            <div v-if="displayNode" class="prodoc-editor-workspace">
              <header class="prodoc-editor-doc-header">
                <div class="prodoc-editor-doc-header__main">
                  <h1 class="prodoc-editor-doc-header__title">{{ displayNode.title }}</h1>
                  <div class="prodoc-editor-doc-header__meta">
                    <NeumorphismTag
                      v-if="displayNode.path"
                      variant="primary"
                      size="small"
                      rounded
                    >
                      {{ displayNode.path }}
                    </NeumorphismTag>
                    <NeumorphismTag
                      v-if="hasChanges"
                      variant="warning"
                      size="small"
                    >
                      已修改
                    </NeumorphismTag>
                  </div>
                </div>
                <div class="prodoc-editor-doc-header__actions">
                  <NeumorphismTooltip content="保存 (Ctrl+S)" position="bottom">
                    <NeumorphismButton
                      variant="raised"
                      size="small"
                      :disabled="!hasChanges"
                      @click="handleSave"
                    >
                      💾 保存
                    </NeumorphismButton>
                  </NeumorphismTooltip>
                </div>
              </header>

              <NeumorphismDivider />

              <div class="prodoc-editor-body">
                <MarkdownEditor
                  :value="getCurrentContent(displayNode)"
                  @change="handleContentChange"
                  @doc-link="handleDocLink"
                />
              </div>
            </div>

            <div v-else class="prodoc-editor-empty__content">
              <NeumorphismCard :elevation="2" hoverable="bulge" class="prodoc-empty-icon-card">
                <span class="prodoc-editor-empty__icon">📂</span>
              </NeumorphismCard>
              <p>请从左侧选择一篇文档进行编辑</p>
              <NeumorphismButton
                variant="raised"
                size="small"
                @click="selectedPath = treeData[0]?.key ?? ''"
              >
                打开第一篇
              </NeumorphismButton>
            </div>
          </NeumorphismCard>
        </main>
      </template>
    </NeumorphismLayout>
  </div>
</template>

<style scoped>
.prodoc-doc-editor {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--nm-bg-color);
  color: var(--nm-text-primary);
}

/* Layout */
.prodoc-editor-layout {
  background-color: var(--nm-bg-color);
}

.prodoc-editor-layout :deep(.nm-layout__content) {
  overflow-y: auto;
}

/* Brand */
.prodoc-editor-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prodoc-editor-brand__logo {
  font-size: 22px;
  line-height: 1;
}

.prodoc-editor-brand__title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: var(--nm-text-primary);
}

/* Header actions */
.prodoc-editor-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* Sider: 极简样式，由 ui-frame Tree 处理内部搜索和外观 */
.prodoc-editor-sider {
  padding: 12px;
}

.prodoc-editor-sider--collapsed {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-top: 16px;
  font-size: 20px;
}

/* Content */
.prodoc-editor-content {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

@media (min-width: 992px) {
  .prodoc-editor-content {
    padding: 28px 32px 40px;
  }
}

.prodoc-editor-content-card {
  flex: 1;
}

/* Card padding controlled by noPadding prop */

.prodoc-editor-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Doc header */
.prodoc-editor-doc-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 20px 24px 16px;
}

.prodoc-editor-doc-header__title {
  margin: 0 0 10px 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--nm-text-primary);
  letter-spacing: -0.3px;
}

.prodoc-editor-doc-header__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.prodoc-editor-doc-header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

/* Editor body */
.prodoc-editor-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Empty state */
.prodoc-editor-empty__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 400px;
  padding: 48px;
  text-align: center;
  color: var(--nm-text-placeholder);
}

.prodoc-empty-icon-card {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prodoc-editor-empty__icon {
  font-size: 40px;
}

.prodoc-editor-empty__content p {
  margin: 0;
  font-size: 15px;
}
</style>
