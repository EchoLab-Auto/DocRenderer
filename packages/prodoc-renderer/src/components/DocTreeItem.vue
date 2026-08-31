<script setup lang="ts">
//! 文档树递归项：目录节点（可展开）+ 文档节点（点击打开）。
//! 表示分级与包含关系（目录层级 / parent / order 自组织）。

import type { DocTreeNode } from '@prodoc/core';

defineProps<{
  node: DocTreeNode;
  expanded: Record<string, boolean>;
  currentPath: string;
}>();

const emit = defineEmits<{
  toggle: [node: DocTreeNode];
  open: [node: DocTreeNode];
}>();
</script>

<template>
  <li class="pd-tree-node">
    <div
      class="pd-tree-row"
      :class="{
        'pd-tree-row--dir': node.isDir,
        'pd-tree-row--active': node.path === currentPath,
      }"
      :title="node.path || node.title"
      @click="node.children.length ? emit('toggle', node) : emit('open', node)"
      @keydown.enter.self="node.children.length ? emit('toggle', node) : emit('open', node)"
      tabindex="0"
    >
      <span class="pd-tree-caret" :class="{ 'pd-tree-caret--open': expanded[node.path] }" aria-hidden="true">
        {{ node.children.length ? (expanded[node.path] ? '▾' : '▸') : '·' }}
      </span>
      <span class="pd-tree-icon" aria-hidden="true">{{ node.isDir ? '📁' : '📄' }}</span>
      <span class="pd-tree-title">{{ node.title }}</span>
      <span v-if="node.order" class="pd-tree-order">#{{ node.order }}</span>
    </div>
    <ul v-if="node.children.length && expanded[node.path]" class="pd-tree pd-tree--nested">
      <DocTreeItem
        v-for="child in node.children"
        :key="child.path || child.id"
        :node="child"
        :expanded="expanded"
        :current-path="currentPath"
        @toggle="emit('toggle', $event)"
        @open="emit('open', $event)"
      />
    </ul>
  </li>
</template>

<style scoped>
.pd-tree {
  list-style: none;
  margin: 0;
  padding: 0;
}
.pd-tree--nested {
  padding-left: 14px;
}
.pd-tree-node {
  margin: 1px 0;
}
.pd-tree-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12.5px;
  color: var(--nm-text-primary, #333);
  user-select: none;
}
.pd-tree-row:hover {
  background: color-mix(in srgb, var(--nm-text-primary) 8%, transparent);
}
.pd-tree-row--active {
  background: color-mix(in srgb, #4c9aff 16%, transparent);
  font-weight: 600;
}
.pd-tree-row--dir .pd-tree-title {
  font-weight: 600;
}
.pd-tree-caret {
  flex: 0 0 auto;
  width: 12px;
  text-align: center;
  opacity: 0.7;
  transition: transform 0.12s ease;
}
.pd-tree-caret--open {
  transform: none;
}
.pd-tree-icon {
  flex: 0 0 auto;
  font-size: 12px;
  opacity: 0.85;
}
.pd-tree-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pd-tree-order {
  margin-left: auto;
  font-size: 10px;
  opacity: 0.5;
  font-family: var(--nm-font-mono, monospace);
}
</style>
