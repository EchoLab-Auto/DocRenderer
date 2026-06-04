<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ProDocNode } from '@prodoc/core'
import { nodeToTreeData } from '@prodoc/core'
import type { TreeNode } from './TreeNav.vue'
import {
  NeumorphismLayout,
  NeumorphismButton,
  NeumorphismCard,
  NeumorphismDivider,
  NeumorphismTag,
  NeumorphismTooltip,
} from '@echolab/ui-frame'
import MarkdownRenderer from './MarkdownRenderer.vue'
import TreeNav from './TreeNav.vue'
import ThemeToggle from './ThemeToggle.vue'

export interface DocViewerProps {
  /** 文档树根节点 */
  root: ProDocNode
  /** 初始选中的文档路径 */
  initialPath?: string
  /** 文档链接点击回调 */
  onDocLink?: (path: string) => void
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

const treeData = computed<TreeNode[]>(() => props.root.children.map(nodeToTreeData))
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
      class="prodoc-layout"
    >
      <!-- Header -->
      <template #header-left>
        <div class="prodoc-brand">
          <span class="prodoc-brand__logo">📚</span>
          <span class="prodoc-brand__title">ProDoc</span>
        </div>
      </template>

      <template #header-right>
        <ThemeToggle />
      </template>

      <!-- Sider -->
      <template #sider="{ collapsed }">
        <div v-if="!collapsed" class="prodoc-sider">
          <TreeNav
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
        <main class="prodoc-content">
          <div class="prodoc-content-inner">
            <NeumorphismCard :elevation="-3" class="prodoc-content-card">
              <template v-if="displayNode">
                <!-- Doc Header -->
                <header class="prodoc-doc-header">
                  <div class="prodoc-doc-header__main">
                    <h1 class="prodoc-doc-header__title">{{ displayNode.title }}</h1>
                    <div class="prodoc-doc-header__meta">
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
                </header>

                <NeumorphismDivider />

                <!-- Document Body -->
                <div class="prodoc-doc-body">
                  <MarkdownRenderer
                    :content="displayNode.body"
                    @doc-link="handleDocLink"
                  />
                </div>
              </template>

              <template v-else>
                <div class="prodoc-empty-content">
                  <NeumorphismCard :elevation="2" hoverable="bulge" class="prodoc-empty-icon-card">
                    <span class="prodoc-empty-icon">📂</span>
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
          </div>
        </main>
      </template>
    </NeumorphismLayout>
  </div>
</template>

<style scoped>
.prodoc-doc-viewer {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--nm-bg-color);
  color: var(--nm-text-primary);
}

/* Layout overrides */
.prodoc-layout :deep(.nm-layout__body) {
  overflow: hidden;
}

.prodoc-layout :deep(.nm-layout__content) {
  overflow-y: auto;
  background-color: var(--nm-bg-color);
}

.prodoc-layout :deep(.nm-layout__sider) {
  border-right: none;
  background-color: var(--nm-surface-color);
}

/* Brand */
.prodoc-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prodoc-brand__logo {
  font-size: 22px;
  line-height: 1;
}

.prodoc-brand__title {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: var(--nm-text-primary);
}

/* Sider: 极简样式，由 ui-frame Tree 处理内部搜索和外观 */
.prodoc-sider {
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

/* Doc Header */
.prodoc-doc-header {
  padding: 12px 0 20px;
}

.prodoc-doc-header__title {
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--nm-text-primary);
  line-height: 1.2;
}

@media (min-width: 768px) {
  .prodoc-doc-header__title {
    font-size: 32px;
  }
}

@media (min-width: 1200px) {
  .prodoc-doc-header__title {
    font-size: 36px;
    letter-spacing: -0.8px;
  }
}

.prodoc-doc-header__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Content area: flex column so card fills available space */
.prodoc-content {
  display: flex;
  flex-direction: column;
}

.prodoc-content-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 24px 20px 64px;
  max-width: 1200px;
  width: 100%;
}

@media (min-width: 992px) {
  .prodoc-content-inner {
    padding: 32px 32px 72px;
  }
}

@media (min-width: 1400px) {
  .prodoc-content-inner {
    padding: 40px 48px 80px;
  }
}

.prodoc-content-card {
  flex: 1;
}

/* Card body: keep padding 0 but let root bg + inset shadow show through */
.prodoc-content-card :deep(.nm-card__body) {
  padding: 0;
}

/* Doc Body */
.prodoc-doc-body {
  padding: 32px 28px;
}

@media (min-width: 768px) {
  .prodoc-doc-body {
    padding: 40px 36px;
  }
}

@media (min-width: 1200px) {
  .prodoc-doc-body {
    padding: 48px 44px;
  }
}

/* Empty state */
.prodoc-empty-content {
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

.prodoc-empty-icon {
  font-size: 40px;
}

.prodoc-empty-content p {
  margin: 0;
  font-size: 15px;
}
</style>
