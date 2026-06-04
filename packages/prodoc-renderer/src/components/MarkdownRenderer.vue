<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUpdated, onBeforeUnmount, h, render } from 'vue'
import { marked } from 'marked'
import { parseFlowDsl, type FlowGraph } from '@prodoc/core'
import {
  NeumorphismCard,
  NeumorphismButton,
  NeumorphismTooltip,
  NeumorphismBadge,
} from '@echolab/ui-frame'
import FlowRenderer from './FlowRenderer.vue'

export interface MarkdownRendererProps {
  /** Markdown 内容 */
  content: string
  /** 点击文档链接时的回调 */
  onDocLink?: (path: string) => void
  /** 自定义样式类名 */
  className?: string
  /** 是否显示目录 */
  showToc?: boolean
}

const props = withDefaults(defineProps<MarkdownRendererProps>(), {
  className: '',
  showToc: true,
})

const emit = defineEmits<{
  (e: 'docLink', path: string): void
}>()

const contentRef = ref<HTMLDivElement | null>(null)
const activeHeading = ref('')

/** 简易代码高亮 */
function highlightCode(code: string, lang?: string): string {
  if (!lang || lang === 'text' || lang === 'plain') {
    return escapeHtml(code)
  }
  let html = escapeHtml(code)
  html = html.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/|#\s+.*$|--.*$)/gm, '<span class="token-comment">$1</span>')
  html = html.replace(/(&quot;.*?&quot;|\'.*?\'|`.*?`)/g, '<span class="token-string">$1</span>')
  const keywords = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|default|try|catch|finally|throw|new|this|typeof|instanceof|class|extends|import|export|from|async|await|yield|static|public|private|protected|interface|type|enum|namespace|module|declare|abstract|readonly|implements|void|number|string|boolean|any|never|unknown|null|undefined|true|false)\b/g
  html = html.replace(keywords, '<span class="token-keyword">$1</span>')
  html = html.replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="token-function">$1</span>')
  html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="token-number">$1</span>')
  html = html.replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="token-type">$1</span>')
  return html
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}

function extractTextFromTokens(tokens: any[]): string {
  return tokens.map((t) => {
    if (t.text) return t.text
    if (t.tokens) return extractTextFromTokens(t.tokens)
    return ''
  }).join('')
}

function extractToc(content: string): { level: number; text: string; id: string }[] {
  const headings: { level: number; text: string; id: string }[] = []
  const lines = content.split('\n')
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
        id: slugify(match[2].trim()),
      })
    }
  }
  return headings
}

/** 流程图 placeholder 状态 */
const flowBlocks = ref<{ id: string; graph: FlowGraph }[]>([])
const flowVnodeMap = new Map<string, ReturnType<typeof h>>()

/** 将 FlowRenderer 渲染到对应的 placeholder 位置 */
function mountFlowBlocks() {
  nextTick(() => {
    const container = contentRef.value
    if (!container) return

    // 清理已不存在 placeholder 的 vnode
    const existingIds = new Set<string>()
    flowBlocks.value.forEach((block) => {
      const placeholder = container.querySelector(`[data-flow-id="${block.id}"]`)
      if (placeholder) existingIds.add(block.id)
    })
    flowVnodeMap.forEach((vnode, id) => {
      if (!existingIds.has(id)) {
        flowVnodeMap.delete(id)
      }
    })

    // 渲染/更新每个 flow block
    flowBlocks.value.forEach((block) => {
      const placeholder = container.querySelector(`[data-flow-id="${block.id}"]`)
      if (!placeholder) return

      placeholder.innerHTML = ''
      const vnode = h(FlowRenderer, {
        graph: block.graph,
        className: 'prodoc-flow-block',
        onNodeClick: (node: any) => {
          if (node.docPath) emit('docLink', node.docPath)
        },
      })
      flowVnodeMap.set(block.id, vnode)
      render(vnode, placeholder as HTMLElement)
    })
  })
}

onMounted(mountFlowBlocks)
onUpdated(mountFlowBlocks)

/** 渲染后的 HTML */
const renderedHtml = computed(() => {
  const blocks: { id: string; graph: FlowGraph }[] = []
  let flowCounter = 0

  const processedContent = props.content.replace(
    /```prodoc-flow\n([\s\S]*?)\n```/g,
    (_match, dsl: string) => {
      const id = `prodoc-flow-${flowCounter++}`
      try {
        const graph = parseFlowDsl(dsl)
        blocks.push({ id, graph })
        return `<div class="prodoc-flow-placeholder" data-flow-id="${id}"></div>`
      } catch {
        return `<pre><code>Invalid flow DSL:\n${escapeHtml(dsl)}</code></pre>`
      }
    }
  )

  flowBlocks.value = blocks

  const renderer = new marked.Renderer()
  renderer.heading = ({ tokens, depth }) => {
    const text = extractTextFromTokens(tokens)
    const id = slugify(text)
    return `<h${depth} id="${id}"><a href="#${id}" class="heading-anchor" aria-hidden="true">#</a>${text}</h${depth}>`
  }
  renderer.code = ({ text, lang }) => {
    const language = lang || 'text'
    const highlighted = highlightCode(text, lang)
    const lines = text.split('\n').length
    const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1)
      .map(n => `<span class="line-num">${n}</span>`)
      .join('')
    return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-lang">${language}</span>
          <span class="code-lines">${lines} lines</span>
          <button class="code-copy-btn" data-code="${escapeHtml(text)}" onclick="navigator.clipboard.writeText(this.dataset.code).then(()=>{this.textContent='已复制!';setTimeout(()=>this.textContent='复制',1500)})">复制</button>
        </div>
        <div class="code-block-body">
          <div class="line-numbers">${lineNumbers}</div>
          <pre><code class="language-${language}">${highlighted}</code></pre>
        </div>
      </div>
    `
  }
  renderer.codespan = ({ text }) => {
    return `<code class="inline-code">${escapeHtml(text)}</code>`
  }
  renderer.listitem = ({ text, task, checked }) => {
    if (task) {
      return `
        <li class="task-list-item">
          <label class="task-checkbox">
            <input type="checkbox" ${checked ? 'checked' : ''} disabled />
            <span class="checkmark"></span>
            <span class="task-text">${text.replace(/^\[[ x]\]\s*/, '')}</span>
          </label>
        </li>
      `
    }
    return `<li>${text}</li>`
  }

  return marked.parse(processedContent, {
    async: false,
    gfm: true,
    breaks: false,
    renderer,
  }) as string
})

/** 目录 */
const toc = computed(() => extractToc(props.content))

/** 滚动到指定 heading */
function scrollToHeading(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/** 处理点击事件（拦截文档链接） */
function handleClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  const link = target.closest('a')
  if (link) {
    const href = link.getAttribute('href')
    if (href && (href.startsWith('/') || href.startsWith('.') || href.endsWith('.md'))) {
      e.preventDefault()
      emit('docLink', href)
    }
  }
}

/** 监听滚动，高亮当前目录项 */
function handleScroll() {
  const main = contentRef.value?.closest('.prodoc-layout .nm-layout__content') as HTMLElement | null
  if (!main) return
  const headings = contentRef.value?.querySelectorAll('h1, h2, h3')
  if (!headings) return
  let current = ''
  for (const h of headings) {
    const rect = h.getBoundingClientRect()
    const containerRect = main.getBoundingClientRect()
    if (rect.top - containerRect.top <= 120) {
      current = h.id
    } else {
      break
    }
  }
  activeHeading.value = current
}

// 挂载后监听滚动
let scrollContainer: HTMLElement | null = null

watch(contentRef, (el) => {
  if (el) {
    nextTick(() => {
      scrollContainer = el.closest('.prodoc-layout .nm-layout__content') as HTMLElement | null
      scrollContainer?.addEventListener('scroll', handleScroll)
    })
  }
})

// 卸载时清理
onBeforeUnmount(() => {
  scrollContainer?.removeEventListener('scroll', handleScroll)
  flowVnodeMap.forEach((vnode, id) => {
    const placeholder = document.querySelector(`[data-flow-id="${id}"]`)
    if (placeholder) render(null, placeholder as HTMLElement)
  })
  flowVnodeMap.clear()
})
</script>

<template>
  <div :class="`prodoc-markdown ${props.className}`">
    <!-- 目录侧边栏 -->
    <nav v-if="showToc && toc.length > 0" class="prodoc-toc">
      <NeumorphismCard :elevation="-2" no-padding class="prodoc-toc-card">
        <div class="prodoc-toc-header">
          <span>📑 目录</span>
          <NeumorphismBadge :value="toc.length" size="small" />
        </div>
        <ul class="prodoc-toc-list">
          <li
            v-for="item in toc"
            :key="item.id"
            :class="`prodoc-toc-item level-${item.level} ${activeHeading === item.id ? 'active' : ''}`"
          >
            <a href="#" @click.prevent="scrollToHeading(item.id)">
              {{ item.text }}
            </a>
          </li>
        </ul>
      </NeumorphismCard>
    </nav>

    <!-- Markdown 内容 -->
    <div class="prodoc-markdown-body">
      <div
        ref="contentRef"
        class="prodoc-markdown-content"
        v-html="renderedHtml"
        @click="handleClick"
      />
    </div>
  </div>
</template>

<style>
.prodoc-markdown {
  display: flex;
  gap: 28px;
}

.prodoc-markdown-body {
  flex: 1;
  min-width: 0;
}

/* TOC */
.prodoc-toc {
  width: 220px;
  min-width: 200px;
  max-height: calc(100vh - 180px);
  position: sticky;
  top: 16px;
  align-self: flex-start;
}

.prodoc-toc-card {
  background-color: var(--nm-surface-raised);
}

.prodoc-toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 10px 16px;
  font-size: 10px;
  font-weight: 700;
  color: var(--nm-text-placeholder);
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.12);
  margin-bottom: 8px;
}

.prodoc-toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.prodoc-toc-item a {
  display: block;
  padding: 5px 16px;
  font-size: 13px;
  color: var(--nm-text-secondary);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prodoc-toc-item.level-1 a { padding-left: 16px; }
.prodoc-toc-item.level-2 a { padding-left: 24px; }
.prodoc-toc-item.level-3 a { padding-left: 32px; }
.prodoc-toc-item.level-4 a { padding-left: 40px; }
.prodoc-toc-item.level-5 a { padding-left: 48px; }
.prodoc-toc-item.level-6 a { padding-left: 56px; }

.prodoc-toc-item a:hover {
  color: var(--nm-primary-color);
  border-left-color: color-mix(in srgb, var(--nm-primary-color) 15%, transparent);
}

.prodoc-toc-item.active a {
  color: var(--nm-primary-color);
  border-left-color: var(--nm-primary-color);
  background: color-mix(in srgb, var(--nm-primary-color) 12%, transparent);
}

/* Markdown content */
.prodoc-markdown-content {
  line-height: 1.75;
  color: var(--nm-text-primary);
  font-size: 15px;
}

.prodoc-markdown-content h1,
.prodoc-markdown-content h2,
.prodoc-markdown-content h3,
.prodoc-markdown-content h4,
.prodoc-markdown-content h5,
.prodoc-markdown-content h6 {
  margin-top: 36px;
  margin-bottom: 16px;
  font-weight: 600;
  color: var(--nm-text-primary);
  line-height: 1.25;
  letter-spacing: -0.3px;
  position: relative;
}

.prodoc-markdown-content h1 { font-size: 26px; }
.prodoc-markdown-content h2 { font-size: 22px; }
.prodoc-markdown-content h3 { font-size: 18px; }
.prodoc-markdown-content h4 { font-size: 16px; }
.prodoc-markdown-content h5 { font-size: 15px; }
.prodoc-markdown-content h6 { font-size: 14px; color: var(--nm-text-secondary); }

.heading-anchor {
  position: absolute;
  left: -22px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--nm-text-placeholder);
  text-decoration: none;
  font-size: 16px;
  font-weight: 400;
  opacity: 0;
  transition: opacity 0.2s ease, color 0.2s ease;
}

.prodoc-markdown-content h1:hover .heading-anchor,
.prodoc-markdown-content h2:hover .heading-anchor,
.prodoc-markdown-content h3:hover .heading-anchor,
.prodoc-markdown-content h4:hover .heading-anchor,
.prodoc-markdown-content h5:hover .heading-anchor,
.prodoc-markdown-content h6:hover .heading-anchor {
  opacity: 1;
}

.heading-anchor:hover {
  color: var(--nm-primary-color);
}

.prodoc-markdown-content p {
  margin: 0 0 16px 0;
  color: var(--nm-text-primary);
}

.prodoc-markdown-content a {
  color: var(--nm-primary-color);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.prodoc-markdown-content a:hover {
  text-decoration: underline;
  opacity: 0.85;
}

.prodoc-markdown-content ul,
.prodoc-markdown-content ol {
  margin: 0 0 16px 0;
  padding-left: 24px;
  color: var(--nm-text-primary);
}

.prodoc-markdown-content li {
  margin-bottom: 6px;
}

.prodoc-markdown-content li::marker {
  color: var(--nm-text-placeholder);
}

.task-list-item {
  list-style: none;
  padding-left: 0;
  margin-left: -4px;
}

.task-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: default;
}

.task-checkbox input {
  display: none;
}

.checkmark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: var(--nm-border-radius-sm);
  flex-shrink: 0;
  background-color: var(--nm-surface-color);
  border: 1px solid rgba(128, 128, 128, 0.15);
  transition: all 0.2s ease;
}

.task-checkbox input:checked + .checkmark {
  background-color: var(--nm-primary-color);
  border-color: var(--nm-primary-color);
}

.checkmark::after {
  content: '';
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translate(-1px, -1px);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-checkbox input:checked + .checkmark::after {
  opacity: 1;
}

.task-text {
  color: var(--nm-text-primary);
}

.task-checkbox input:checked ~ .task-text {
  text-decoration: line-through;
  color: var(--nm-text-placeholder);
}

.inline-code {
  background-color: var(--nm-surface-color);
  padding: 3px 8px;
  border-radius: var(--nm-border-radius-sm);
  font-size: 0.88em;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  color: var(--nm-primary-color);
  border: 1px solid rgba(128, 128, 128, 0.1);
}

.code-block-wrapper {
  margin: 0 0 20px 0;
  border-radius: var(--nm-border-radius-lg);
  overflow: hidden;
  background-color: var(--nm-surface-color);
  border: 1px solid rgba(128, 128, 128, 0.1);
}

.code-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.12);
}

.code-lang {
  font-size: 11px;
  font-weight: 700;
  color: var(--nm-primary-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'SF Mono', Monaco, monospace;
}

.code-lines {
  font-size: 11px;
  color: var(--nm-text-placeholder);
  font-family: 'SF Mono', Monaco, monospace;
  margin-left: auto;
  margin-right: 12px;
}

.code-copy-btn {
  padding: 4px 10px;
  border: none;
  border-radius: var(--nm-border-radius-sm);
  font-size: 11px;
  font-weight: 500;
  color: var(--nm-text-secondary);
  background-color: var(--nm-surface-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.code-copy-btn:hover {
  color: var(--nm-primary-color);
}

.code-block-body {
  display: flex;
  overflow-x: auto;
}

.line-numbers {
  display: flex;
  flex-direction: column;
  padding: 14px 0 14px 14px;
  flex-shrink: 0;
  user-select: none;
  border-right: 1px solid rgba(128, 128, 128, 0.12);
}

.line-num {
  font-size: 12px;
  line-height: 1.65;
  color: var(--nm-text-placeholder);
  font-family: 'SF Mono', Monaco, monospace;
  text-align: right;
  padding-right: 14px;
  min-width: 28px;
}

.code-block-body pre {
  flex: 1;
  margin: 0;
  padding: 14px 20px;
  background: transparent;
  overflow-x: auto;
  box-shadow: none;
}

.code-block-body pre code {
  display: block;
  font-size: 13px;
  line-height: 1.65;
  font-family: 'SF Mono', 'Cascadia Code', monospace;
  background: transparent;
  padding: 0;
  box-shadow: none;
}

.token-comment { color: #6a9955; font-style: italic; }
.token-string { color: #ce9178; }
.token-keyword { color: #569cd6; font-weight: 600; }
.token-function { color: #dcdcaa; }
.token-number { color: #b5cea8; }
.token-type { color: #4ec9b0; }
.token-operator { color: #d4d4d4; }
.token-punctuation { color: #808080; }

.prodoc-markdown-content blockquote {
  margin: 0 0 18px 0;
  padding: 16px 22px;
  border-left: 3px solid var(--nm-primary-color);
  background-color: var(--nm-surface-color);
  color: var(--nm-text-primary);
  border-radius: 0 var(--nm-border-radius-lg) var(--nm-border-radius-lg) 0;
}

.prodoc-markdown-content blockquote p:last-child {
  margin-bottom: 0;
}

.prodoc-markdown-content table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 0 0 18px 0;
  border-radius: var(--nm-border-radius-lg);
  overflow: hidden;
  background-color: var(--nm-surface-color);
  border: 1px solid rgba(128, 128, 128, 0.1);
}

.prodoc-markdown-content th,
.prodoc-markdown-content td {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.12);
  text-align: left;
}

.prodoc-markdown-content th {
  background-color: var(--nm-bg-color);
  font-weight: 600;
  color: var(--nm-text-primary);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.prodoc-markdown-content td {
  color: var(--nm-text-primary);
  font-size: 14px;
}

.prodoc-markdown-content tr:last-child td {
  border-bottom: none;
}

.prodoc-markdown-content tr:nth-child(even) td {
  background-color: rgba(128, 128, 128, 0.03);
}

.prodoc-markdown-content img {
  max-width: 100%;
  height: auto;
  border-radius: var(--nm-border-radius-lg);
}

.prodoc-markdown-content hr {
  border: none;
  border-top: 1px solid rgba(128, 128, 128, 0.12);
  margin: 32px 0;
}

.prodoc-markdown-content strong {
  color: var(--nm-text-primary);
  font-weight: 600;
}

.prodoc-markdown-content del,
.prodoc-markdown-content s {
  color: var(--nm-text-placeholder);
  text-decoration-color: var(--nm-text-secondary);
}

/* Flow block spacing */
.prodoc-flow-placeholder {
  margin: 24px 0;
  min-height: 420px;
  border-radius: var(--nm-border-radius-lg);
  overflow: hidden;
}

.prodoc-flow-block {
  margin: 24px 0;
}

@media (max-width: 1100px) {
  .prodoc-toc {
    display: none;
  }
}
</style>
