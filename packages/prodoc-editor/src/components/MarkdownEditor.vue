<script setup lang="ts">
import { ref, computed } from 'vue'
import { MarkdownRenderer } from '@prodoc/renderer'
import {
  NeumorphismButton,
  NeumorphismCard,
  NeumorphismRow,
  NeumorphismCol,
  NeumorphismTooltip,
  NeumorphismBadge,
} from '@echolab/ui-frame'

export interface MarkdownEditorProps {
  /** Markdown 内容 */
  value: string
  /** 内容变化回调 */
  onChange?: (value: string) => void
  /** 文档链接点击回调 */
  onDocLink?: (path: string) => void
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

function handleChange(e: Event) {
  const target = e.target as HTMLTextAreaElement
  emit('change', target.value)
}

function handleDocLink(path: string) {
  emit('docLink', path)
}

const modeButtons = [
  { key: 'edit' as const, label: '✏️ 编辑', tip: '纯编辑模式' },
  { key: 'split' as const, label: '⬌ 分栏', tip: '左右分栏预览' },
  { key: 'preview' as const, label: '👁 预览', tip: '纯预览模式' },
]

/** 内容字数统计 */
const charCount = computed(() => props.value.length)
const lineCount = computed(() => props.value.split('\n').length)
</script>

<template>
  <div :class="`prodoc-markdown-editor ${props.className}`">
    <!-- Mode toolbar -->
    <div class="prodoc-editor-toolbar">
      <div class="prodoc-editor-toolbar__left">
        <NeumorphismRow :gutter="4" class="mode-row">
          <NeumorphismCol v-for="btn in modeButtons" :key="btn.key" :span="8">
            <NeumorphismTooltip :content="btn.tip" position="bottom">
              <NeumorphismButton
                :variant="mode === btn.key ? 'raised' : 'flat'"
                size="small"
                class="mode-btn"
                @click="mode = btn.key"
              >
                {{ btn.label }}
              </NeumorphismButton>
            </NeumorphismTooltip>
          </NeumorphismCol>
        </NeumorphismRow>
      </div>

      <div class="prodoc-editor-toolbar__right">
        <NeumorphismBadge
          :value="`${lineCount} 行`"
          variant="info"
          size="small"
        />
        <NeumorphismBadge
          :value="`${charCount} 字`"
          variant="info"
          size="small"
        />
      </div>
    </div>

    <!-- Editor panels -->
    <div class="prodoc-editor-panels" :class="`prodoc-mode-${mode}`">
      <!-- Edit panel -->
      <div
        class="prodoc-editor-panel prodoc-editor-panel--edit"
        :class="{ hidden: mode === 'preview' }"
      >
        <NeumorphismCard :elevation="-3" class="edit-card">
          <textarea
            class="prodoc-editor-textarea"
            :value="props.value"
            @input="handleChange"
            placeholder="在此输入 Markdown..."
            spellcheck="false"
          />
        </NeumorphismCard>
      </div>

      <!-- Preview panel -->
      <div
        class="prodoc-editor-panel prodoc-editor-panel--preview"
        :class="{ hidden: mode === 'edit' }"
      >
        <NeumorphismCard :elevation="-2" class="preview-card">
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
  border-bottom: 1px solid rgba(128, 128, 128, 0.12);
  box-shadow: inset 0 -2px 4px var(--nm-shadow-dark);
}

.prodoc-editor-toolbar__left {
  flex: 1;
  max-width: 320px;
}

.prodoc-editor-toolbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-row {
  margin: 0 !important;
}

.mode-btn {
  width: 100%;
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

.edit-card :deep(.nm-card__body) {
  height: 100%;
  padding: 0;
  background-color: var(--nm-surface-raised);
}

.preview-card :deep(.nm-card__body) {
  height: 100%;
  padding: 24px;
  overflow-y: auto;
  background-color: var(--nm-surface-raised);
}

.prodoc-editor-textarea {
  width: 100%;
  height: 100%;
  padding: 20px;
  border: none;
  border-radius: var(--nm-border-radius-lg);
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  font-size: 14px;
  line-height: 1.65;
  resize: none;
  outline: none;
  background-color: transparent;
  color: var(--nm-text-primary);
  caret-color: var(--nm-primary-color);
  box-sizing: border-box;
}

.prodoc-editor-textarea::placeholder {
  color: var(--nm-text-placeholder);
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

  .prodoc-editor-toolbar__left {
    max-width: 100%;
  }
}
</style>
