<script setup lang="ts">
import type { TreeNode } from './TreeNav.vue'

interface Props {
  node: TreeNode
  level?: number
  isExpandedFn: (key: string) => boolean
  isSelectedFn: (key: string) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
})

const emit = defineEmits<{
  toggle: [key: string]
  select: [key: string]
}>()

const expanded = () => props.isExpandedFn(props.node.key)
const selected = () => props.isSelectedFn(props.node.key)
const hasChild = () => !!props.node.children && props.node.children.length > 0

function onToggle(e: MouseEvent) {
  e.stopPropagation()
  emit('toggle', props.node.key)
}

function onSelect() {
  if (!props.node.disabled) {
    emit('select', props.node.key)
  }
}
</script>

<template>
  <li class="tree-nav__item" role="treeitem" :aria-expanded="hasChild() ? expanded() : undefined">
    <div
      class="tree-nav__row"
      :class="{ 'tree-nav__row--selected': selected(), 'tree-nav__row--disabled': node.disabled }"
      :style="{ paddingLeft: `${level * 16 + 8}px` }"
      @click="onSelect"
    >
      <button
        v-if="hasChild()"
        type="button"
        class="tree-nav__toggle"
        :class="{ 'tree-nav__toggle--expanded': expanded() }"
        @click="onToggle"
      >
        <svg class="tree-nav__chevron" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <span v-else class="tree-nav__spacer" />
      <span v-if="node.icon" class="tree-nav__icon">{{ node.icon }}</span>
      <span class="tree-nav__label">{{ node.label }}</span>
    </div>

    <ul v-if="hasChild() && expanded()" class="tree-nav__children" role="group">
      <TreeNavItem
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :level="level + 1"
        :is-expanded-fn="isExpandedFn"
        :is-selected-fn="isSelectedFn"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
      />
    </ul>
  </li>
</template>
