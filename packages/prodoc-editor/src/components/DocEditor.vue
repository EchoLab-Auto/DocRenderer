<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Theme } from '@echolab/ui-frame'
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
  NeumorphismContainer,
  useTheme,
} from '@echolab/ui-frame'
import MarkdownEditor from './MarkdownEditor.vue'

export interface DocEditorProps {
  /** 文档树根节点 */
  root: ProDocNode
  /** 初始选中的文档路径 */
  initialPath?: string
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

const { theme, setTheme } = useTheme()
const themeModel = computed<Theme>({
  get: () => theme.value,
  set: (val) => setTheme(val),
})

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
    >
      <!-- Header -->
      <template #header-left>
        <span class="prodoc-editor-brand">📝 ProDoc Editor</span>
      </template>

      <template #header-center>
        <NeumorphismThemeToggle v-model="themeModel" size="small" />
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
          <NeumorphismButton
            variant="raised"
            size="small"
            :disabled="!hasChanges"
            @click="handleSave"
          >
            💾 保存
          </NeumorphismButton>
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
        <div v-else class="prodoc-editor-sider-collapsed">📝</div>
      </template>

      <!-- Main editing area -->
      <template #default>
        <NeumorphismContainer no-padding class="prodoc-editor-container">
          <NeumorphismCard :elevation="-3" no-padding class="prodoc-editor-card">
            <div v-if="displayNode" class="prodoc-editor-layout">
              <header class="prodoc-editor-header">
                <div>
                  <h1 class="prodoc-editor-title">{{ displayNode.title }}</h1>
                  <div class="prodoc-editor-meta">
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
                <NeumorphismButton
                  variant="raised"
                  size="small"
                  :disabled="!hasChanges"
                  @click="handleSave"
                >
                  💾 保存
                </NeumorphismButton>
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

            <div v-else class="prodoc-editor-empty">
              <NeumorphismCard :elevation="2" hoverable="bulge" class="prodoc-editor-empty-icon">
                <span class="prodoc-editor-empty-emoji">📂</span>
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
        </NeumorphismContainer>
      </template>
    </NeumorphismLayout>
  </div>
</template>

<style scoped>
.prodoc-doc-editor {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* Header */
.prodoc-editor-brand {
  font-weight: 700;
  font-size: 17px;
}

.prodoc-editor-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* Sider */
.prodoc-editor-sider {
  padding: 12px;
}

.prodoc-editor-sider-collapsed {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-top: 16px;
  font-size: 20px;
}

/* Main Container */
.prodoc-editor-container {
  padding: 20px;
}

.prodoc-editor-card {
  height: 100%;
}

/* Editor Layout */
.prodoc-editor-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Editor Header */
.prodoc-editor-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 20px 24px 16px;
}

.prodoc-editor-title {
  margin: 0 0 10px;
  font-size: 22px;
  font-weight: 700;
  color: var(--nm-text-primary);
}

.prodoc-editor-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Editor Body */
.prodoc-editor-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* Empty State */
.prodoc-editor-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 400px;
  text-align: center;
  color: var(--nm-text-placeholder);
}

.prodoc-editor-empty-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prodoc-editor-empty-emoji {
  font-size: 40px;
}

/* Responsive */
@media (max-width: 768px) {
  .prodoc-editor-container {
    padding: 12px;
  }

  .prodoc-editor-header {
    padding: 16px;
  }

  .prodoc-editor-title {
    font-size: 20px;
  }
}
</style>
