<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
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
import MarkdownRenderer from './MarkdownRenderer.vue'

export interface DocViewerProps {
  /** 文档树根节点 */
  root: ProDocNode
  /** 初始选中的文档路径 */
  initialPath?: string
  /** 自定义样式类名 */
  className?: string
}

const props = withDefaults(defineProps<DocViewerProps>(), {
  className: '',
})

const emit = defineEmits<{
  (e: 'docLink', path: string): void
}>()

const selectedPath = ref(props.initialPath ?? props.root.children[0]?.path ?? '')
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

const selectedNode = computed<ProDocNode | undefined>(() => {
  if (!selectedPath.value) return undefined
  function find(node: ProDocNode): ProDocNode | undefined {
    if (node.path === selectedPath.value) return node
    for (const child of node.children) {
      const result = find(child)
      if (result) return result
    }
    return undefined
  }
  return find(props.root)
})

const displayNode = computed(() => selectedNode.value || props.root.children[0])

function handleTreeSelect(key: string) {
  selectedPath.value = key
}

function handleDocLink(path: string) {
  selectedPath.value = path
  emit('docLink', path)
}

watch(() => props.initialPath, (newPath) => {
  if (newPath) selectedPath.value = newPath
})
</script>

<template>
  <div :class="`prodoc-doc-viewer ${props.className}`">
    <NeumorphismLayout
      show-header
      show-sider
      :sider-width="280"
      collapsible
    >
      <!-- Header -->
      <template #header-left>
        <span class="prodoc-header-brand">📚 ProDoc</span>
      </template>

      <template #header-right>
        <NeumorphismThemeToggle v-model="themeModel" size="small" />
      </template>

      <!-- Sider -->
      <template #sider="{ collapsed }">
        <div v-if="!collapsed" class="prodoc-sider-content">
          <NeumorphismTree
            :data="treeData"
            v-model:selected-keys="selectedKeys"
            v-model:expanded-keys="expandedKeys"
            show-search
            search-placeholder="搜索文档..."
            @node-select="handleTreeSelect"
          />
        </div>
        <div v-else class="prodoc-sider-collapsed">📚</div>
      </template>

      <!-- Main Content -->
      <template #default>
        <NeumorphismContainer no-padding class="prodoc-main-container">
          <NeumorphismCard :elevation="-3" no-padding class="prodoc-content-card">
            <template v-if="displayNode">
              <!-- Doc Header -->
              <div class="prodoc-doc-header">
                <h1 class="prodoc-doc-title">{{ displayNode.title }}</h1>
                <div class="prodoc-doc-meta">
                  <NeumorphismTag
                    v-if="displayNode.path"
                    variant="primary"
                    size="small"
                    rounded
                  >
                    {{ displayNode.path }}
                  </NeumorphismTag>
                  <NeumorphismTag
                    v-if="displayNode.children.length > 0"
                    variant="info"
                    size="small"
                    rounded
                  >
                    📁 {{ displayNode.children.length }} 个子项
                  </NeumorphismTag>
                </div>
              </div>

              <NeumorphismDivider />

              <!-- Document Body -->
              <div class="prodoc-doc-body">
                <Transition name="prodoc-doc-switch" mode="out-in">
                  <MarkdownRenderer
                    :key="displayNode.path"
                    :content="displayNode.body"
                    @doc-link="handleDocLink"
                  />
                </Transition>
              </div>
            </template>

            <template v-else>
              <div class="prodoc-empty-state">
                <NeumorphismCard :elevation="2" hoverable="bulge" class="prodoc-empty-icon">
                  <span class="prodoc-empty-emoji">📂</span>
                </NeumorphismCard>
                <p>请从左侧选择一篇文档</p>
                <NeumorphismButton
                  variant="raised"
                  size="small"
                  @click="selectedPath = treeData[0]?.key ?? ''"
                >
                  打开第一篇
                </NeumorphismButton>
              </div>
            </template>
          </NeumorphismCard>
        </NeumorphismContainer>
      </template>
    </NeumorphismLayout>
  </div>
</template>

<style scoped>
.prodoc-doc-viewer {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* Header */
.prodoc-header-brand {
  font-weight: 700;
  font-size: 17px;
}

/* Sider */
.prodoc-sider-content {
  padding: 12px;
}

.prodoc-sider-collapsed {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-top: 16px;
  font-size: 20px;
}

/* Main Content */
.prodoc-main-container {
  padding: 24px 20px;
}

.prodoc-content-card {
  min-height: 100%;
}

/* Document Header */
.prodoc-doc-header {
  padding: 20px 28px 0;
}

.prodoc-doc-title {
  margin: 0 0 12px;
  font-size: 28px;
  font-weight: 700;
  color: var(--nm-text-primary);
}

.prodoc-doc-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Document Body */
.prodoc-doc-body {
  padding: 32px 28px;
}

/* Empty State */
.prodoc-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 400px;
  text-align: center;
  color: var(--nm-text-placeholder);
}

.prodoc-empty-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prodoc-empty-emoji {
  font-size: 40px;
}

/* Document switch transition */
.prodoc-doc-switch-enter-active,
.prodoc-doc-switch-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.prodoc-doc-switch-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.prodoc-doc-switch-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Responsive */
@media (max-width: 768px) {
  .prodoc-main-container {
    padding: 16px 12px;
  }

  .prodoc-doc-header {
    padding: 16px 20px 0;
  }

  .prodoc-doc-title {
    font-size: 22px;
  }

  .prodoc-doc-body {
    padding: 20px;
  }
}

/* prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .prodoc-doc-switch-enter-active,
  .prodoc-doc-switch-leave-active {
    transition: none !important;
  }

  .prodoc-doc-switch-enter-from,
  .prodoc-doc-switch-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
