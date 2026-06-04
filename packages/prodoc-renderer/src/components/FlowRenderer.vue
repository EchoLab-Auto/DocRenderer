<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FlowGraph, FlowNode } from '@prodoc/core'
import {
  NeumorphismCard,
  NeumorphismButton,
  NeumorphismTooltip,
  NeumorphismTag,
  NeumorphismBadge,
} from '@echolab/ui-frame'

export interface FlowRendererProps {
  /** 流程图数据 */
  graph: FlowGraph
  /** 节点点击回调 */
  onNodeClick?: (node: FlowNode) => void
  /** 自定义样式类名 */
  className?: string
}

const props = withDefaults(defineProps<FlowRendererProps>(), {
  className: '',
})

const emit = defineEmits<{
  (e: 'nodeClick', node: FlowNode): void
}>()

/** 缩放控制 */
const zoom = ref(props.graph.viewport?.zoom ?? 1)
const showGrid = ref(true)

/** 计算画布边界 */
const viewBox = computed(() => {
  const padding = 60
  const nodes = props.graph.nodes
  if (nodes.length === 0) {
    return { x: 0, y: 0, w: 800, h: 400 }
  }
  const minX = Math.min(...nodes.map(n => n.x - n.width / 2)) - padding
  const minY = Math.min(...nodes.map(n => n.y - n.height / 2)) - padding
  const maxX = Math.max(...nodes.map(n => n.x + n.width / 2)) + padding
  const maxY = Math.max(...nodes.map(n => n.y + n.height / 2)) + padding
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
})

/** SVG 画布尺寸 */
const svgSize = computed(() => ({
  width: Math.max(viewBox.value.w, 800),
  height: Math.max(viewBox.value.h, 360),
}))

/** 处理节点点击 */
function handleNodeClick(node: FlowNode) {
  emit('nodeClick', node)
}

/** 滚轮缩放 */
function handleWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  const next = Math.max(0.25, Math.min(3, zoom.value + delta))
  zoom.value = Math.round(next * 10) / 10
}

/** 计算边的路径 */
function calculateEdgePath(from: FlowNode, to: FlowNode) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  let start: { x: number; y: number }
  let end: { x: number; y: number }

  if (absDx > absDy) {
    start = { x: dx > 0 ? from.x + from.width / 2 : from.x - from.width / 2, y: from.y }
    end = { x: dx > 0 ? to.x - to.width / 2 : to.x + to.width / 2, y: to.y }
  } else {
    start = { x: from.x, y: dy > 0 ? from.y + from.height / 2 : from.y - from.height / 2 }
    end = { x: to.x, y: dy > 0 ? to.y - to.height / 2 : to.y + to.height / 2 }
  }

  const midX = (start.x + end.x) / 2
  return `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`
}

/** 计算边标签位置 */
function calculateEdgeLabelPosition(from: FlowNode, to: FlowNode) {
  return {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2 - 10,
  }
}

/** 获取节点形状元素属性 */
function getNodeShape(node: FlowNode) {
  const { x, y, width, height, shape } = node
  const halfW = width / 2
  const halfH = height / 2

  switch (shape) {
    case 'rect':
      return { type: 'rect', x: x - halfW, y: y - halfH, width, height, rx: 0, ry: 0 }
    case 'round-rect':
      return { type: 'rect', x: x - halfW, y: y - halfH, width, height, rx: 10, ry: 10 }
    case 'circle':
      return { type: 'ellipse', cx: x, cy: y, rx: halfW, ry: halfH }
    case 'diamond':
      return {
        type: 'polygon',
        points: `${x},${y - halfH} ${x + halfW},${y} ${x},${y + halfH} ${x - halfW},${y}`,
      }
    default:
      return { type: 'rect', x: x - halfW, y: y - halfH, width, height, rx: 10, ry: 10 }
  }
}

function findNode(id: string) {
  return props.graph.nodes.find(n => n.id === id)
}
</script>

<template>
  <div :class="`prodoc-flow-renderer ${props.className}`">
    <NeumorphismCard :elevation="-3" class="prodoc-flow-card">
      <!-- 工具栏 -->
      <div class="prodoc-flow-toolbar">
        <div class="prodoc-flow-toolbar__left">
          <NeumorphismTag variant="info" size="small">流程图</NeumorphismTag>
          <NeumorphismBadge
            v-if="graph.nodes.length"
            :value="graph.nodes.length"
            size="small"
          />
        </div>
        <div class="prodoc-flow-toolbar__actions">
          <NeumorphismTooltip content="切换网格" position="bottom">
            <NeumorphismButton
              :variant="showGrid ? 'pressed' : 'flat'"
              size="small"
              @click="showGrid = !showGrid"
            >
              ⊞ 网格
            </NeumorphismButton>
          </NeumorphismTooltip>
          <NeumorphismTooltip content="重置缩放" position="bottom">
            <NeumorphismButton
              variant="flat"
              size="small"
              @click="zoom = 1"
            >
              ⟲ 重置
            </NeumorphismButton>
          </NeumorphismTooltip>
        </div>
      </div>

      <!-- 画布 -->
      <div
        class="prodoc-flow-canvas"
        style="height: 420px;"
        @wheel.prevent="handleWheel"
      >
        <svg
          class="prodoc-flow-svg"
          :width="svgSize.width"
          :height="svgSize.height"
          :viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.w * zoom} ${viewBox.h * zoom}`"
        >
          <defs>
            <!-- Arrow marker -->
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--nm-text-secondary)" />
            </marker>

            <!-- Soft shadow filter -->
            <filter id="nm-flow-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="3" stdDeviation="4" flood-color="var(--nm-shadow-dark)" />
            </filter>
          </defs>

          <!-- Edges -->
          <g class="prodoc-flow-edges">
            <path
              v-for="edge in props.graph.edges"
              :key="edge.id"
              class="prodoc-flow-edge"
              :d="calculateEdgePath(
                findNode(edge.from)!,
                findNode(edge.to)!
              )"
              fill="none"
              stroke="var(--nm-text-secondary)"
              stroke-width="1.5"
              :stroke-dasharray="edge.style?.strokeDasharray"
              marker-end="url(#arrowhead)"
            />

            <!-- Edge labels -->
            <text
              v-for="edge in props.graph.edges.filter(e => e.label)"
              :key="`label-${edge.id}`"
              class="prodoc-flow-edge-label"
              :x="calculateEdgeLabelPosition(findNode(edge.from)!, findNode(edge.to)!).x"
              :y="calculateEdgeLabelPosition(findNode(edge.from)!, findNode(edge.to)!).y"
              text-anchor="middle"
              fill="var(--nm-primary-color)"
              font-size="12"
              font-family="system-ui, sans-serif"
            >
              {{ edge.label }}
            </text>
          </g>

          <!-- Nodes -->
          <g
            v-for="node in props.graph.nodes"
            :key="node.id"
            class="prodoc-flow-node"
            :class="{ 'has-link': node.docPath }"
            :style="{ cursor: node.docPath ? 'pointer' : 'default' }"
            @click="handleNodeClick(node)"
          >
            <rect
              v-if="getNodeShape(node).type === 'rect'"
              v-bind="getNodeShape(node) as any"
              :fill="node.style?.fill ?? 'var(--nm-surface-raised)'"
              :stroke="node.style?.stroke ?? 'var(--nm-primary-color)'"
              :stroke-width="node.style?.strokeWidth ?? 2"
              filter="url(#nm-flow-shadow)"
            />
            <ellipse
              v-else-if="getNodeShape(node).type === 'ellipse'"
              v-bind="getNodeShape(node) as any"
              :fill="node.style?.fill ?? 'var(--nm-surface-raised)'"
              :stroke="node.style?.stroke ?? 'var(--nm-primary-color)'"
              :stroke-width="node.style?.strokeWidth ?? 2"
              filter="url(#nm-flow-shadow)"
            />
            <polygon
              v-else-if="getNodeShape(node).type === 'polygon'"
              v-bind="getNodeShape(node) as any"
              :fill="node.style?.fill ?? 'var(--nm-surface-raised)'"
              :stroke="node.style?.stroke ?? 'var(--nm-primary-color)'"
              :stroke-width="node.style?.strokeWidth ?? 2"
              filter="url(#nm-flow-shadow)"
            />

            <text
              :x="node.x"
              :y="node.y"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="var(--nm-text-primary)"
              font-size="13"
              font-family="system-ui, sans-serif"
              font-weight="500"
            >
              {{ node.label }}
            </text>

            <!-- Document link indicator -->
            <g v-if="node.docPath" class="doc-link-indicator">
              <circle
                :cx="node.x + node.width / 2 - 8"
                :cy="node.y - node.height / 2 + 8"
                r="5"
                fill="var(--nm-primary-color)"
              />
              <text
                :x="node.x + node.width / 2 - 8"
                :y="node.y - node.height / 2 + 8"
                text-anchor="middle"
                dominant-baseline="central"
                fill="#fff"
                font-size="6"
              >
                ↗
              </text>
            </g>
          </g>
        </svg>
      </div>
    </NeumorphismCard>
  </div>
</template>

<style scoped>
.prodoc-flow-renderer {
  width: 100%;
}

.prodoc-flow-card :deep(.nm-card__body) {
  padding: 0;
  overflow: hidden;
  background-color: var(--nm-surface-raised);
}

.prodoc-flow-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--nm-surface-color);
  border-bottom: 1px solid rgba(128, 128, 128, 0.12);
  box-shadow:
    inset 0 -2px 4px var(--nm-shadow-dark);
}

.prodoc-flow-toolbar__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prodoc-flow-toolbar__actions {
  display: flex;
  gap: 8px;
}

.prodoc-flow-canvas {
  overflow: auto;
  background-color: var(--nm-surface-raised);
  cursor: grab;
}

.prodoc-flow-canvas:active {
  cursor: grabbing;
}

.prodoc-flow-svg {
  display: block;
  min-width: 100%;
  min-height: 100%;
}

.prodoc-flow-edge {
  transition: stroke 0.2s ease;
}

.prodoc-flow-node {
  transition: filter 0.2s ease;
}

.prodoc-flow-node:hover {
  filter: brightness(1.15) drop-shadow(0 0 8px color-mix(in srgb, var(--nm-primary-color) 30%, transparent));
}

.prodoc-flow-node.has-link:hover rect,
.prodoc-flow-node.has-link:hover ellipse,
.prodoc-flow-node.has-link:hover polygon {
  stroke-width: 3;
}

.prodoc-flow-edge-label {
  pointer-events: none;
  font-weight: 500;
}

.doc-link-indicator {
  pointer-events: none;
}
</style>
