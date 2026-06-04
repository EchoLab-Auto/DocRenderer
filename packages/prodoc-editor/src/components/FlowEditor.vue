<script setup lang="ts">
import { ref, computed } from 'vue'
import { FlowRenderer } from '@prodoc/renderer'
import { exportFlowDsl, parseFlowDsl } from '@prodoc/core'
import type { FlowGraph, FlowNode } from '@prodoc/core'
import {
  NeumorphismButton,
  NeumorphismInput,
  NeumorphismCard,
  NeumorphismDivider,
  NeumorphismTooltip,
  NeumorphismTag,
  NeumorphismBadge,
} from '@echolab/ui-frame'

export interface FlowEditorProps {
  /** 流程图 DSL 内容 */
  dsl: string
  /** DSL 变化回调 */
  onChange?: (dsl: string) => void
  /** 文档链接点击回调 */
  onDocLink?: (path: string) => void
  /** 自定义样式类名 */
  className?: string
}

const props = withDefaults(defineProps<FlowEditorProps>(), {
  className: '',
})

const emit = defineEmits<{
  (e: 'change', dsl: string): void
  (e: 'docLink', path: string): void
}>()

const graph = ref<FlowGraph>({
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
})

try {
  graph.value = parseFlowDsl(props.dsl)
} catch {
  // use default empty graph
}

const selectedNodeId = ref<string | null>(null)

const selectedNode = computed(() =>
  graph.value.nodes.find(n => n.id === selectedNodeId.value)
)

/** 添加新节点 */
function addNode(shape: FlowNode['shape']) {
  const id = `node${graph.value.nodes.length + 1}`
  const offset = graph.value.nodes.length * 30
  const newNode: FlowNode = {
    id,
    label: '新节点',
    shape,
    x: 180 + offset,
    y: 120 + offset,
    width: shape === 'diamond' ? 100 : 120,
    height: shape === 'diamond' ? 80 : 44,
  }
  graph.value = { ...graph.value, nodes: [...graph.value.nodes, newNode] }
  selectedNodeId.value = id
  emitChange()
}

/** 删除选中节点 */
function deleteSelectedNode() {
  if (!selectedNodeId.value) return
  graph.value = {
    ...graph.value,
    nodes: graph.value.nodes.filter(n => n.id !== selectedNodeId.value),
    edges: graph.value.edges.filter(
      e => e.from !== selectedNodeId.value && e.to !== selectedNodeId.value
    ),
  }
  selectedNodeId.value = null
  emitChange()
}

/** 处理节点点击 */
function handleNodeClick(node: FlowNode) {
  selectedNodeId.value = node.id
  if (node.docPath) {
    emit('docLink', node.docPath)
  }
}

/** 更新节点标签 */
function updateNodeLabel(label: string) {
  if (!selectedNodeId.value) return
  graph.value = {
    ...graph.value,
    nodes: graph.value.nodes.map(n =>
      n.id === selectedNodeId.value ? { ...n, label } : n
    ),
  }
  emitChange()
}

/** 更新节点文档路径 */
function updateNodeDocPath(path: string) {
  if (!selectedNodeId.value) return
  graph.value = {
    ...graph.value,
    nodes: graph.value.nodes.map(n =>
      n.id === selectedNodeId.value ? { ...n, docPath: path || undefined } : n
    ),
  }
  emitChange()
}

function emitChange() {
  try {
    emit('change', exportFlowDsl(graph.value))
  } catch { /* ignore */ }
}

const shapeButtons = [
  { shape: 'rect' as const, label: '⬜ 矩形', tip: '添加矩形节点' },
  { shape: 'diamond' as const, label: '◆ 菱形', tip: '添加菱形节点' },
  { shape: 'circle' as const, label: '○ 圆形', tip: '添加圆形节点' },
  { shape: 'round-rect' as const, label: '▢ 圆角', tip: '添加圆角矩形节点' },
]
</script>

<template>
  <div :class="`prodoc-flow-editor ${props.className}`">
    <!-- Toolbar -->
    <div class="prodoc-flow-toolbar">
      <div class="prodoc-flow-toolbar__group">
        <NeumorphismTag variant="info" size="small">添加节点</NeumorphismTag>
        <NeumorphismTooltip
          v-for="btn in shapeButtons"
          :key="btn.shape"
          :content="btn.tip"
          position="bottom"
        >
          <NeumorphismButton
            variant="flat"
            size="small"
            @click="addNode(btn.shape)"
          >
            {{ btn.label }}
          </NeumorphismButton>
        </NeumorphismTooltip>
      </div>

      <template v-if="selectedNode">
        <NeumorphismDivider direction="vertical" />
        <div class="prodoc-flow-toolbar__group">
          <NeumorphismTag variant="primary" size="small">
            {{ selectedNode.label }}
          </NeumorphismTag>
          <NeumorphismTooltip content="删除选中节点" position="bottom">
            <NeumorphismButton
              variant="pressed"
              size="small"
              @click="deleteSelectedNode"
            >
              🗑 删除
            </NeumorphismButton>
          </NeumorphismTooltip>
        </div>
      </template>

      <div class="prodoc-flow-toolbar__stats">
        <NeumorphismBadge
          v-if="graph.nodes.length"
          :value="`${graph.nodes.length} 节点`"
          variant="info"
          size="small"
        />
        <NeumorphismBadge
          v-if="graph.edges.length"
          :value="`${graph.edges.length} 连线`"
          variant="info"
          size="small"
        />
      </div>
    </div>

    <!-- Canvas -->
    <div class="prodoc-flow-editor-canvas">
      <FlowRenderer
        :graph="graph"
        @node-click="handleNodeClick"
      />
    </div>

    <!-- Properties panel -->
    <NeumorphismCard
      v-if="selectedNode"
      :elevation="-2"
      class="prodoc-flow-properties"
    >
      <div class="prodoc-flow-properties__header">
        <h4 class="prodoc-flow-properties__title">节点属性</h4>
        <NeumorphismTag
          v-if="selectedNode.docPath"
          variant="success"
          size="small"
          rounded
        >
          已关联文档
        </NeumorphismTag>
      </div>
      <div class="prodoc-flow-properties__fields">
        <label class="prodoc-field">
          <span class="prodoc-field__label">标签</span>
          <NeumorphismInput
            :model-value="selectedNode.label"
            size="small"
            @update:model-value="updateNodeLabel"
          />
        </label>
        <label class="prodoc-field">
          <span class="prodoc-field__label">文档路径</span>
          <NeumorphismInput
            :model-value="selectedNode.docPath || ''"
            placeholder="/path/to/doc.md"
            size="small"
            @update:model-value="updateNodeDocPath"
          />
        </label>
      </div>
    </NeumorphismCard>
  </div>
</template>

<style scoped>
.prodoc-flow-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background-color: var(--nm-bg-color);
}

.prodoc-flow-toolbar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  flex-wrap: wrap;
  background-color: var(--nm-surface-color);
  border-bottom: 1px solid rgba(128, 128, 128, 0.12);
  box-shadow:
    inset 0 -2px 4px var(--nm-shadow-dark);
}

.prodoc-flow-toolbar__group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.prodoc-flow-toolbar__stats {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.prodoc-flow-editor-canvas {
  flex: 1;
  min-height: 0;
  position: relative;
  padding: 16px;
  overflow: hidden;
}

.prodoc-flow-properties {
  border-top: 1px solid rgba(128, 128, 128, 0.12);
  flex-shrink: 0;
}

.prodoc-flow-properties :deep(.nm-card__body) {
  padding: 16px 20px;
  background-color: var(--nm-surface-raised);
}

.prodoc-flow-properties__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.prodoc-flow-properties__title {
  margin: 0;
  font-size: 14px;
  color: var(--nm-text-primary);
  font-weight: 600;
}

.prodoc-flow-properties__fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.prodoc-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.prodoc-field__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--nm-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
