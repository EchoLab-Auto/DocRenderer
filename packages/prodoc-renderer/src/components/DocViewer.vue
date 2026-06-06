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
        <span style="font-weight: 700; font-size: 17px;">📚 ProDoc</span>
      </template>

      <template #header-right>
        <NeumorphismThemeToggle v-model="themeModel" size="small" />
      </template>

      <!-- Sider -->
      <template #sider="{ collapsed }">
        <div v-if="!collapsed" style="padding: 12px;">
          <NeumorphismTree
            :data="treeData"
            v-model:selected-keys="selectedKeys"
            v-model:expanded-keys="expandedKeys"
            show-search
            search-placeholder="搜索文档..."
            @node-select="handleTreeSelect"
          />
        </div>
        <div v-else style="display: flex; align-items: center; justify-content: center; height: 100%; padding-top: 16px; font-size: 20px;">📚</div>
      </template>

      <!-- Main Content -->
      <template #default>
        <NeumorphismContainer no-padding style="padding: 24px 20px;">
          <NeumorphismCard :elevation="-3" no-padding>
            <template v-if="displayNode">
              <!-- Doc Header -->
              <div style="padding: 20px 28px 0;">
                <h1 style="margin: 0 0 12px; font-size: 28px; font-weight: 700; color: var(--nm-text-primary);">{{ displayNode.title }}</h1>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
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
              <div style="padding: 32px 28px;">
                <MarkdownRenderer
                  :content="displayNode.body"
                  @doc-link="handleDocLink"
                />
              </div>
            </template>

            <template v-else>
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; min-height: 400px; text-align: center; color: var(--nm-text-placeholder);">
                <NeumorphismCard :elevation="2" hoverable="bulge" style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 40px;">📂</span>
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
</style>
