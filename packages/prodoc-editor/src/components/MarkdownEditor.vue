<script setup lang="ts">
import { ref, computed } from 'vue'
import { MarkdownRenderer } from '@prodoc/renderer'
import {
  NeumorphismTabs,
  NeumorphismCard,
  NeumorphismTextarea,
} from '@echolab/ui-frame'

export interface MarkdownEditorProps {
  /** Markdown 内容 */
  value: string
  /** 自定义样式类名 */
  className?: string
}

const props = withDefaults(defineProps<MarkdownEditorProps>(), {
  className: '',
})

const emit = defineEmits<{
  (e: 'change', value: string): void
  (e: 'docLink', path: string): void
}>()

const mode = ref<'edit' | 'preview' | 'split'>('split')

function handleDocLink(path: string) {
  emit('docLink', path)
}

const tabs = [
  { key: 'edit', label: '✏️ 编辑' },
  { key: 'split', label: '⬌ 分栏' },
  { key: 'preview', label: '👁 预览' },
]

/** 内容字数统计 */
const charCount = computed(() => props.value.length)
const lineCount = computed(() => props.value.split('\n').length)
</script>

<template>
  <div :class="`prodoc-markdown-editor ${props.className}`">
    <!-- Mode toolbar -->
    <div class="prodoc-editor-toolbar">
      <NeumorphismTabs
        v-model="mode"
        :tabs="tabs"
        size="small"
        class="prodoc-editor-mode-tabs"
      />
      <span class="editor-stat">{{ lineCount }} 行 · {{ charCount }} 字</span>
    </div>

    <!-- Editor panels -->
    <div class="prodoc-editor-panels" :class="`prodoc-mode-${mode}`">
      <!-- Edit panel -->
      <div
        class="prodoc-editor-panel prodoc-editor-panel--edit"
        :class="{ hidden: mode === 'preview' }"
      >
        <NeumorphismCard :elevation="-3" no-padding class="edit-card">
          <NeumorphismTextarea
            class="prodoc-editor-textarea"
            :model-value="props.value"
            placeholder="在此输入 Markdown..."
            :auto-resize="false"
            :show-count="false"
            @update:model-value="(v: string) => emit('change', v)"
          />
        </NeumorphismCard>
      </div>

      <!-- Preview panel -->
      <div
        class="prodoc-editor-panel prodoc-editor-panel--preview"
        :class="{ hidden: mode === 'edit' }"
      >
        <NeumorphismCard :elevation="-2" no-padding class="preview-card">
          <MarkdownRenderer
            :content="props.value"
            :show-toc="false"
            @doc-link="handleDocLink"
          />
        </NeumorphismCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prodoc-markdown-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.prodoc-editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  flex-shrink: 0;
  background-color: var(--nm-surface-color);
  border-bottom: 1px solid var(--pd-border-subtle);
}

.prodoc-editor-mode-tabs {
  max-width: 280px;
}

.editor-stat {
  font-size: 12px;
  color: var(--nm-text-placeholder);
  font-family: 'SF Mono', Monaco, monospace;
}

.prodoc-editor-panels {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
  gap: 16px;
  padding: 16px;
  background-color: var(--nm-bg-color);
}

.prodoc-editor-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.prodoc-editor-panel.hidden {
  display: none;
}

.edit-card,
.preview-card {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.edit-card {
  background-color: var(--nm-surface-raised);
}

.preview-card {
  background-color: var(--nm-surface-raised);
  padding: 24px;
  overflow-y: auto;
}

/* Override NeumorphismTextarea to behave like a code editor */
.prodoc-editor-textarea :deep(.nm-textarea__field) {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  font-size: 14px;
  line-height: 1.65;
  resize: none;
  height: 100%;
}

/* Single mode adjustments */
.prodoc-mode-edit .prodoc-editor-panel--edit,
.prodoc-mode-preview .prodoc-editor-panel--preview {
  max-width: 100%;
}

@media (max-width: 768px) {
  .prodoc-editor-panels.prodoc-mode-split {
    flex-direction: column;
  }

  .prodoc-editor-panels.prodoc-mode-split .prodoc-editor-panel {
    flex: none;
    height: 50%;
  }

  .prodoc-editor-toolbar {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
