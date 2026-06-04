<script setup lang="ts">
/**
 * 简化版树形导航组件
 *
 * 由于 ui-frame 移除了 NeumorphismTree，本项目自行实现一个极简树形导航，
 * 只保留核心功能：展开/折叠、选中、搜索过滤。
 */
import { ref, computed } from 'vue'
import TreeNavItem from './TreeNavItem.vue'

export interface TreeNode {
  key: string
  label: string
  icon?: string
  children?: TreeNode[]
  disabled?: boolean
}

export interface TreeNavProps {
  data: TreeNode[]
  selectedKeys?: string[]
  expandedKeys?: string[]
  showSearch?: boolean
  searchPlaceholder?: string
}

const props = withDefaults(defineProps<TreeNavProps>(), {
  selectedKeys: () => [],
  expandedKeys: () => [],
  showSearch: false,
  searchPlaceholder: '搜索...',
})

const emit = defineEmits<{
  'update:selectedKeys': [keys: string[]]
  'update:expandedKeys': [keys: string[]]
  'nodeSelect': [key: string]
}>()

const searchText = ref('')

/** 搜索过滤：节点自身或子树任一匹配即保留 */
function filterNode(node: TreeNode): TreeNode | null {
  const q = searchText.value.trim().toLowerCase()
  if (!q) return node

  const children = node.children?.map(filterNode).filter((n): n is TreeNode => n !== null)
  const selfMatch = node.label.toLowerCase().includes(q)
  if (selfMatch || (children && children.length > 0)) {
    return { ...node, children: children ?? [] }
  }
  return null
}

const filteredData = computed(() => {
  return props.data.map(filterNode).filter((n): n is TreeNode => n !== null)
})

function isExpanded(key: string) {
  return props.expandedKeys.includes(key)
}

function isSelected(key: string) {
  return props.selectedKeys.includes(key)
}

function toggleExpand(key: string) {
  const next = new Set(props.expandedKeys)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  emit('update:expandedKeys', Array.from(next))
}

function selectNode(key: string) {
  emit('update:selectedKeys', [key])
  emit('nodeSelect', key)
}
</script>

<template>
  <div class="tree-nav">
    <div v-if="showSearch" class="tree-nav__search">
      <input
        v-model="searchText"
        type="text"
        :placeholder="searchPlaceholder"
        class="tree-nav__search-input"
      />
    </div>
    <ul class="tree-nav__list" role="tree">
      <TreeNavItem
        v-for="node in filteredData"
        :key="node.key"
        :node="node"
        :level="0"
        :is-expanded-fn="isExpanded"
        :is-selected-fn="isSelected"
        @toggle="toggleExpand"
        @select="selectNode"
      />
    </ul>
  </div>
</template>

<style scoped>
.tree-nav {
  font-size: 14px;
  color: var(--nm-text-primary);
}

.tree-nav__search {
  padding: 8px 8px 12px;
}

.tree-nav__search-input {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: var(--nm-border-radius-md);
  font-size: 13px;
  background-color: var(--nm-surface-color);
  color: var(--nm-text-primary);
  box-shadow: inset 3px 3px 6px var(--nm-shadow-dark), inset -2px -2px 4px var(--nm-shadow-light);
  outline: none;
  box-sizing: border-box;
}

.tree-nav__search-input::placeholder {
  color: var(--nm-text-placeholder);
}

.tree-nav__search-input:focus {
  box-shadow: inset 4px 4px 8px var(--nm-shadow-dark), inset -2px -2px 4px var(--nm-shadow-light), 0 0 0 2px var(--nm-primary-color);
}

.tree-nav__list,
:deep(.tree-nav__children) {
  list-style: none;
  margin: 0;
  padding: 0;
}

:deep(.tree-nav__row) {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: var(--nm-border-radius-sm);
  cursor: pointer;
  transition: background-color 0.15s ease;
  user-select: none;
}

:deep(.tree-nav__row:hover) {
  background-color: color-mix(in srgb, var(--nm-primary-color) 8%, transparent);
}

:deep(.tree-nav__row--selected) {
  background-color: color-mix(in srgb, var(--nm-primary-color) 15%, transparent);
  color: var(--nm-primary-color);
  font-weight: 600;
}

:deep(.tree-nav__row--disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

:deep(.tree-nav__toggle) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--nm-text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: transform 0.2s ease, background-color 0.15s ease;
}

:deep(.tree-nav__toggle:hover) {
  background-color: color-mix(in srgb, var(--nm-primary-color) 10%, transparent);
}

:deep(.tree-nav__toggle--expanded .tree-nav__chevron) {
  transform: rotate(90deg);
}

:deep(.tree-nav__chevron) {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

:deep(.tree-nav__spacer) {
  display: inline-block;
  width: 18px;
  flex-shrink: 0;
}

:deep(.tree-nav__icon) {
  flex-shrink: 0;
  font-size: 14px;
  line-height: 1;
}

:deep(.tree-nav__label) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
