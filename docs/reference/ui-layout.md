---
title: UI 布局定义
order: 3
---

# UI 布局定义

本文档汇总 ProDoc 项目中所有组件的布局参数，涵盖容器尺寸、Flexbox/Grid 结构、定位、间距、溢出控制及响应式断点。

---

## 1. 全局页面骨架（DocViewer / DocEditor 共用）

两个主页面组件均基于 `NeumorphismLayout` 构建，骨架结构完全一致。

### 1.1 根容器

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-doc-viewer` | `height` | `100vh` |
| `.neumorphism-doc-viewer` | `width` | `100vw` |
| `.neumorphism-doc-viewer` | `overflow` | `hidden` |
| `.neumorphism-doc-editor` | `height` | `100vh` |
| `.neumorphism-doc-editor` | `width` | `100vw` |
| `.neumorphism-doc-editor` | `overflow` | `hidden` |

### 1.2 Sider（侧边栏）

| 选择器 | 属性 | 值 | 说明 |
|--------|------|-----|------|
| `NeumorphismLayout` | `sider-width` | `280px` | 组件属性，非 CSS |
| `NeumorphismLayout` | `collapsible` | `true` | 可折叠 |
| `.neumorphism-sider-content` | `padding` | `12px` | Viewer 侧边栏内边距 |
| `.neumorphism-editor-sider` | `padding` | `12px` | Editor 侧边栏内边距 |
| `.neumorphism-sider-collapsed` | `display` | `flex` | 收起态 |
| `.neumorphism-sider-collapsed` | `align-items` | `center` | — |
| `.neumorphism-sider-collapsed` | `justify-content` | `center` | — |
| `.neumorphism-sider-collapsed` | `height` | `100%` | — |
| `.neumorphism-sider-collapsed` | `padding-top` | `16px` | — |

### 1.3 Header（顶部栏）

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-header-brand` | `font-weight` | `700` |
| `.neumorphism-header-brand` | `font-size` | `17px` |
| `.neumorphism-editor-brand` | `font-weight` | `700` |
| `.neumorphism-editor-brand` | `font-size` | `17px` |
| `.neumorphism-editor-actions` | `display` | `flex` |
| `.neumorphism-editor-actions` | `align-items` | `center` |
| `.neumorphism-editor-actions` | `gap` | `14px` |

### 1.4 主内容容器

**DocViewer：**

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-main-container` | `padding` | `24px 20px` |
| `.neumorphism-content-card` | `min-height` | `100%` |

**DocEditor：**

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-editor-container` | `padding` | `20px` |
| `.neumorphism-editor-card` | `height` | `100%` |

---

## 2. DocViewer 内部布局

### 2.1 文档头部（Doc Header）

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-doc-header` | `padding` | `20px 28px 0` |
| `.neumorphism-doc-title` | `margin` | `0 0 12px` |
| `.neumorphism-doc-title` | `font-size` | `28px` |
| `.neumorphism-doc-title` | `font-weight` | `700` |
| `.neumorphism-doc-meta` | `display` | `flex` |
| `.neumorphism-doc-meta` | `align-items` | `center` |
| `.neumorphism-doc-meta` | `gap` | `8px` |
| `.neumorphism-doc-meta` | `flex-wrap` | `wrap` |

### 2.2 文档正文

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-doc-body` | `padding` | `32px 28px` |

### 2.3 空状态

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-empty-state` | `display` | `flex` |
| `.neumorphism-empty-state` | `flex-direction` | `column` |
| `.neumorphism-empty-state` | `align-items` | `center` |
| `.neumorphism-empty-state` | `justify-content` | `center` |
| `.neumorphism-empty-state` | `gap` | `16px` |
| `.neumorphism-empty-state` | `min-height` | `400px` |
| `.neumorphism-empty-state` | `text-align` | `center` |
| `.neumorphism-empty-icon` | `width` | `80px` |
| `.neumorphism-empty-icon` | `height` | `80px` |
| `.neumorphism-empty-icon` | `display` | `flex` |
| `.neumorphism-empty-icon` | `align-items` | `center` |
| `.neumorphism-empty-icon` | `justify-content` | `center` |
| `.neumorphism-empty-emoji` | `font-size` | `40px` |

---

## 3. DocEditor 内部布局

### 3.1 编辑器头部

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-editor-layout` | `display` | `flex` |
| `.neumorphism-editor-layout` | `flex-direction` | `column` |
| `.neumorphism-editor-layout` | `height` | `100%` |
| `.neumorphism-editor-header` | `display` | `flex` |
| `.neumorphism-editor-header` | `align-items` | `flex-start` |
| `.neumorphism-editor-header` | `justify-content` | `space-between` |
| `.neumorphism-editor-header` | `gap` | `16px` |
| `.neumorphism-editor-header` | `flex-wrap` | `wrap` |
| `.neumorphism-editor-header` | `padding` | `20px 24px 16px` |
| `.neumorphism-editor-title` | `margin` | `0 0 10px` |
| `.neumorphism-editor-title` | `font-size` | `22px` |
| `.neumorphism-editor-title` | `font-weight` | `700` |
| `.neumorphism-editor-meta` | `display` | `flex` |
| `.neumorphism-editor-meta` | `align-items` | `center` |
| `.neumorphism-editor-meta` | `gap` | `8px` |
| `.neumorphism-editor-meta` | `flex-wrap` | `wrap` |

### 3.2 编辑器主体

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-editor-body` | `flex` | `1` |
| `.neumorphism-editor-body` | `overflow` | `hidden` |
| `.neumorphism-editor-body` | `display` | `flex` |
| `.neumorphism-editor-body` | `flex-direction` | `column` |
| `.neumorphism-editor-body` | `min-height` | `0` |

### 3.3 空状态

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-editor-empty` | `display` | `flex` |
| `.neumorphism-editor-empty` | `flex-direction` | `column` |
| `.neumorphism-editor-empty` | `align-items` | `center` |
| `.neumorphism-editor-empty` | `justify-content` | `center` |
| `.neumorphism-editor-empty` | `gap` | `16px` |
| `.neumorphism-editor-empty` | `min-height` | `400px` |
| `.neumorphism-editor-empty` | `text-align` | `center` |
| `.neumorphism-editor-empty-icon` | `width` | `80px` |
| `.neumorphism-editor-empty-icon` | `height` | `80px` |
| `.neumorphism-editor-empty-icon` | `display` | `flex` |
| `.neumorphism-editor-empty-icon` | `align-items` | `center` |
| `.neumorphism-editor-empty-icon` | `justify-content` | `center` |
| `.neumorphism-editor-empty-emoji` | `font-size` | `40px` |

---

## 4. MarkdownEditor 布局

### 4.1 根容器

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-markdown-editor` | `display` | `flex` |
| `.neumorphism-markdown-editor` | `flex-direction` | `column` |
| `.neumorphism-markdown-editor` | `height` | `100%` |
| `.neumorphism-markdown-editor` | `min-height` | `0` |

### 4.2 工具栏（Toolbar）

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-editor-toolbar` | `display` | `flex` |
| `.neumorphism-editor-toolbar` | `align-items` | `center` |
| `.neumorphism-editor-toolbar` | `justify-content` | `space-between` |
| `.neumorphism-editor-toolbar` | `padding` | `10px 16px` |
| `.neumorphism-editor-toolbar` | `flex-shrink` | `0` |
| `.neumorphism-editor-mode-tabs` | `max-width` | `280px` |
| `.editor-stat` | `font-size` | `12px` |

### 4.3 编辑/预览面板（Panels）

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-editor-panels` | `flex` | `1` |
| `.neumorphism-editor-panels` | `display` | `flex` |
| `.neumorphism-editor-panels` | `overflow` | `hidden` |
| `.neumorphism-editor-panels` | `min-height` | `0` |
| `.neumorphism-editor-panels` | `gap` | `16px` |
| `.neumorphism-editor-panels` | `padding` | `16px` |

### 4.4 单个面板

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-editor-panel` | `flex` | `1` |
| `.neumorphism-editor-panel` | `min-width` | `0` |
| `.neumorphism-editor-panel` | `display` | `flex` |
| `.neumorphism-editor-panel` | `flex-direction` | `column` |
| `.neumorphism-editor-panel.hidden` | `display` | `none` |

### 4.5 卡片容器

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.edit-card`, `.preview-card` | `flex` | `1` |
| `.edit-card`, `.preview-card` | `overflow` | `hidden` |
| `.edit-card`, `.preview-card` | `display` | `flex` |
| `.edit-card`, `.preview-card` | `flex-direction` | `column` |
| `.preview-card` | `padding` | `24px` |
| `.preview-card` | `overflow-y` | `auto` |

### 4.6 文本编辑区

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-editor-textarea :deep(.nm-textarea__field)` | `font-size` | `14px` |
| `.neumorphism-editor-textarea :deep(.nm-textarea__field)` | `line-height` | `1.65` |
| `.neumorphism-editor-textarea :deep(.nm-textarea__field)` | `resize` | `none` |
| `.neumorphism-editor-textarea :deep(.nm-textarea__field)` | `height` | `100%` |

### 4.7 单模式调整

| 选择器 | 属性 | 值 | 说明 |
|--------|------|-----|------|
| `.neumorphism-mode-edit .neumorphism-editor-panel--edit` | `max-width` | `100%` | 仅编辑 |
| `.neumorphism-mode-preview .neumorphism-editor-panel--preview` | `max-width` | `100%` | 仅预览 |

---

## 5. MarkdownRenderer 布局

### 5.1 根容器

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-markdown` | `display` | `flex` |
| `.neumorphism-markdown` | `gap` | `28px` |

### 5.2 内容主体

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-markdown-body` | `flex` | `1` |
| `.neumorphism-markdown-body` | `min-width` | `0` |

### 5.3 目录侧边栏（TOC）

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-toc` | `width` | `220px` |
| `.neumorphism-toc` | `min-width` | `200px` |
| `.neumorphism-toc` | `max-height` | `calc(100vh - 180px)` |
| `.neumorphism-toc` | `position` | `sticky` |
| `.neumorphism-toc` | `top` | `16px` |
| `.neumorphism-toc` | `align-self` | `flex-start` |

### 5.4 TOC 头部

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-toc-header` | `display` | `flex` |
| `.neumorphism-toc-header` | `align-items` | `center` |
| `.neumorphism-toc-header` | `justify-content` | `space-between` |
| `.neumorphism-toc-header` | `padding` | `0 16px 10px 16px` |
| `.neumorphism-toc-header` | `font-size` | `10px` |

### 5.5 TOC 列表

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-toc-list` | `list-style` | `none` |
| `.neumorphism-toc-list` | `margin` | `0` |
| `.neumorphism-toc-list` | `padding` | `0` |

### 5.6 TOC 项（含层级缩进）

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-toc-item a` | `display` | `block` |
| `.neumorphism-toc-item a` | `padding` | `5px 16px` |
| `.neumorphism-toc-item a` | `font-size` | `13px` |
| `.neumorphism-toc-item a` | `border-left` | `2px solid transparent` |
| `.neumorphism-toc-item a` | `white-space` | `nowrap` |
| `.neumorphism-toc-item a` | `overflow` | `hidden` |
| `.neumorphism-toc-item a` | `text-overflow` | `ellipsis` |
| `.neumorphism-toc-item.level-1 a` | `padding-left` | `16px` |
| `.neumorphism-toc-item.level-2 a` | `padding-left` | `32px` |
| `.neumorphism-toc-item.level-3 a` | `padding-left` | `48px` |
| `.neumorphism-toc-item.level-4 a` | `padding-left` | `64px` |
| `.neumorphism-toc-item.level-5 a` | `padding-left` | `80px` |
| `.neumorphism-toc-item.level-6 a` | `padding-left` | `96px` |

### 5.7 Markdown 内容区

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-markdown-content` | `line-height` | `1.75` |
| `.neumorphism-markdown-content` | `font-size` | `15px` |

### 5.8 标题

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-markdown-content h1~h6` | `margin-top` | `36px` |
| `.neumorphism-markdown-content h1~h6` | `margin-bottom` | `16px` |
| `.neumorphism-markdown-content h1~h6` | `line-height` | `1.25` |
| `.neumorphism-markdown-content h1~h6` | `position` | `relative` |
| `.neumorphism-markdown-content h1` | `font-size` | `26px` |
| `.neumorphism-markdown-content h2` | `font-size` | `22px` |
| `.neumorphism-markdown-content h3` | `font-size` | `18px` |
| `.neumorphism-markdown-content h4` | `font-size` | `16px` |
| `.neumorphism-markdown-content h5` | `font-size` | `15px` |
| `.neumorphism-markdown-content h6` | `font-size` | `14px` |

### 5.9 标题锚点

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.heading-anchor` | `position` | `absolute` |
| `.heading-anchor` | `right` | `-22px` |
| `.heading-anchor` | `top` | `50%` |
| `.heading-anchor` | `transform` | `translateY(-50%)` |
| `.heading-anchor` | `font-size` | `16px` |
| `.heading-anchor` | `opacity` | `0` |

### 5.10 段落与列表

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-markdown-content p` | `margin` | `0 0 16px 0` |
| `.neumorphism-markdown-content ul, ol` | `margin` | `0 0 16px 0` |
| `.neumorphism-markdown-content ul, ol` | `padding-left` | `24px` |
| `.neumorphism-markdown-content li` | `margin-bottom` | `6px` |

### 5.11 任务列表

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.task-list-item` | `list-style` | `none` |
| `.task-list-item` | `padding-left` | `0` |
| `.task-list-item` | `margin-left` | `-4px` |
| `.task-checkbox` | `display` | `flex` |
| `.task-checkbox` | `align-items` | `center` |
| `.task-checkbox` | `gap` | `10px` |
| `.checkmark` | `display` | `flex` |
| `.checkmark` | `align-items` | `center` |
| `.checkmark` | `justify-content` | `center` |
| `.checkmark` | `width` | `20px` |
| `.checkmark` | `height` | `20px` |
| `.checkmark` | `flex-shrink` | `0` |

### 5.12 行内代码

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.inline-code` | `padding` | `3px 8px` |
| `.inline-code` | `font-size` | `0.88em` |

### 5.13 代码块

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.code-block-wrapper` | `margin` | `0 0 20px 0` |
| `.code-block-wrapper` | `overflow` | `hidden` |
| `.code-block-header` | `display` | `flex` |
| `.code-block-header` | `align-items` | `center` |
| `.code-block-header` | `justify-content` | `space-between` |
| `.code-block-header` | `padding` | `10px 20px` |
| `.code-copy-btn` | `padding` | `4px 10px` |
| `.code-copy-btn` | `border` | `none` |
| `.code-copy-btn` | `font-size` | `11px` |
| `.code-block-body` | `display` | `flex` |
| `.code-block-body` | `overflow-x` | `auto` |
| `.line-numbers` | `display` | `flex` |
| `.line-numbers` | `flex-direction` | `column` |
| `.line-numbers` | `padding` | `14px 0 14px 14px` |
| `.line-numbers` | `flex-shrink` | `0` |
| `.line-num` | `font-size` | `12px` |
| `.line-num` | `line-height` | `1.65` |
| `.line-num` | `text-align` | `right` |
| `.line-num` | `padding-right` | `14px` |
| `.line-num` | `min-width` | `28px` |
| `.code-block-body pre` | `flex` | `1` |
| `.code-block-body pre` | `margin` | `0` |
| `.code-block-body pre` | `padding` | `14px 20px` |
| `.code-block-body pre` | `overflow-x` | `auto` |
| `.code-block-body pre code` | `display` | `block` |
| `.code-block-body pre code` | `font-size` | `13px` |
| `.code-block-body pre code` | `line-height` | `1.65` |
| `.code-block-body pre code` | `padding` | `0` |

### 5.14 引用块

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-markdown-content blockquote` | `margin` | `0 0 18px 0` |
| `.neumorphism-markdown-content blockquote` | `padding` | `16px 22px` |
| `.neumorphism-markdown-content blockquote` | `border-radius` | `0 var(--nm-border-radius-lg) var(--nm-border-radius-lg) 0` |

### 5.15 表格

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-markdown-content table` | `width` | `100%` |
| `.neumorphism-markdown-content table` | `border-collapse` | `separate` |
| `.neumorphism-markdown-content table` | `border-spacing` | `0` |
| `.neumorphism-markdown-content table` | `margin` | `0 0 18px 0` |
| `.neumorphism-markdown-content table` | `overflow` | `hidden` |
| `.neumorphism-markdown-content th, td` | `padding` | `12px 16px` |
| `.neumorphism-markdown-content th, td` | `text-align` | `left` |
| `.neumorphism-markdown-content th` | `font-size` | `12px` |
| `.neumorphism-markdown-content td` | `font-size` | `14px` |

### 5.16 图片与分割线

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-markdown-content img` | `max-width` | `100%` |
| `.neumorphism-markdown-content img` | `height` | `auto` |
| `.neumorphism-markdown-content hr` | `margin` | `32px 0` |

---

## 6. 响应式断点

### 6.1 移动端（≤ 768px）

**DocViewer：**

| 选择器 | 属性 | 值（移动端）|
|--------|------|------------|
| `.neumorphism-main-container` | `padding` | `16px 12px` |
| `.neumorphism-doc-header` | `padding` | `16px 20px 0` |
| `.neumorphism-doc-title` | `font-size` | `22px` |
| `.neumorphism-doc-body` | `padding` | `20px` |

**DocEditor：**

| 选择器 | 属性 | 值（移动端）|
|--------|------|------------|
| `.neumorphism-editor-container` | `padding` | `12px` |
| `.neumorphism-editor-header` | `padding` | `16px` |
| `.neumorphism-editor-title` | `font-size` | `20px` |

**MarkdownEditor（Split 模式）：**

| 选择器 | 属性 | 值（移动端）|
|--------|------|------------|
| `.neumorphism-editor-panels.neumorphism-mode-split` | `flex-direction` | `column` |
| `.neumorphism-editor-panels.neumorphism-mode-split .neumorphism-editor-panel` | `flex` | `none` |
| `.neumorphism-editor-panels.neumorphism-mode-split .neumorphism-editor-panel` | `height` | `50%` |
| `.neumorphism-editor-toolbar` | `flex-wrap` | `wrap` |
| `.neumorphism-editor-toolbar` | `gap` | `8px` |

### 6.2 目录隐藏（≤ 1100px）

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-toc` | `display` | `none` |

---

## 7. CSS 变量（布局相关）

### 7.1 ProDoc 自定义变量

定义于 `packages/prodoc-renderer/src/styles/index.css`：

| 变量 | 值 | 用途 |
|------|-----|------|
| `--pd-border-subtle` | `color-mix(in srgb, var(--nm-text-placeholder) 12%, transparent)` | 细边框色 |
| `--pd-border-medium` | `color-mix(in srgb, var(--nm-text-placeholder) 15%, transparent)` | 中等边框色 |
| `--pd-selection-bg` | `color-mix(in srgb, var(--nm-primary-color) 30%, transparent)` | 文本选中背景色 |
| `--pd-transition-fast` | `0.2s ease` | 快速过渡 |
| `--pd-transition-medium` | `0.25s ease` | 中等过渡 |
| `--pd-font-mono` | `'SF Mono', 'Cascadia Code', Monaco, 'Fira Code', 'Cousine', monospace` | 等宽字体栈 |

### 7.2 依赖 ui-frame 的变量

布局中引用的外部变量（来自 `@echolab/ui-frame`）：

| 变量 | 用途 |
|------|------|
| `--nm-primary-color` | 主题主色 |
| `--nm-bg-color` | 背景色 |
| `--nm-surface-color` | 表面色 |
| `--nm-surface-raised` | 凸起表面色 |
| `--nm-text-primary` | 主文字色 |
| `--nm-text-secondary` | 次要文字色 |
| `--nm-text-placeholder` | 占位文字色 |
| `--nm-border-radius-sm` | 小圆角 |
| `--nm-border-radius-lg` | 大圆角 |
| `--nm-transition-slow` | 慢速过渡 |

---

## 8. 滚动条样式

### 8.1 DocViewer 滚动条

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-doc-viewer .nm-layout__content::-webkit-scrollbar` | `width` | `5px` |
| `.neumorphism-doc-viewer .nm-layout__content::-webkit-scrollbar-track` | `background` | `transparent` |
| `.neumorphism-doc-viewer .nm-layout__content::-webkit-scrollbar-thumb` | `border-radius` | `3px` |

### 8.2 DocEditor 滚动条

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-doc-editor .nm-layout__content::-webkit-scrollbar` | `width` | `5px` |
| `.neumorphism-editor-textarea::-webkit-scrollbar` | `width` | `5px` |

### 8.3 TOC 滚动条

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-toc::-webkit-scrollbar` | `width` | `5px` |

### 8.4 平滑滚动

| 选择器 | 属性 | 值 |
|--------|------|-----|
| `.neumorphism-doc-viewer .nm-layout__content` | `scroll-behavior` | `smooth` |

---

## 9. 布局层级关系速查

```
NeumorphismLayout (全局骨架)
  ├── Header (固定高度)
  │     ├── 左侧：品牌 Logo
  │     ├── 中间：主题切换 (Editor)
  │     └── 右侧：主题切换 / 操作按钮
  ├── Sider (280px, 可折叠)
  │     └── NeumorphismTree (文档树 + 搜索)
  └── Main Content (flex: 1)
        └── NeumorphismContainer
              └── NeumorphismCard (内容卡片)
                    ├── Doc Header (标题 + meta 标签)
                    ├── NeumorphismDivider
                    └── Doc Body
                          ├── [Viewer] MarkdownRenderer
                          │       ├── TOC Sidebar (sticky, 220px)
                          │       └── Markdown Content (flex: 1)
                          └── [Editor] MarkdownEditor
                                  ├── Toolbar (Tabs + 统计)
                                  └── Panels (Edit / Preview / Split)
                                        ├── Edit Panel
                                        │     └── NeumorphismTextarea
                                        └── Preview Panel
                                              └── MarkdownRenderer (showToc=false)
```

---

## 10. 源文件位置

| 模块 | 文件路径 |
|------|----------|
| DocViewer 实现 | `@echolab/ui-frame` → `dist/doc/DocViewer.js`（源码见 ui-frame 仓库 `src/doc/DocViewer.vue`） |
| DocEditor 实现 | `@echolab/ui-frame` → `dist/doc/DocEditor.js`（源码见 ui-frame 仓库 `src/doc/DocEditor.vue`） |
| MarkdownRenderer 实现 | `@echolab/ui-frame` → `dist/doc/MarkdownRenderer.js`（源码见 ui-frame 仓库 `src/doc/MarkdownRenderer.vue`） |
| MarkdownEditor 实现 | `@echolab/ui-frame` → `dist/doc/MarkdownEditor.js`（源码见 ui-frame 仓库 `src/doc/MarkdownEditor.vue`） |
| DocViewer 重新导出 | `packages/prodoc-renderer/src/index.ts` |
| DocEditor 重新导出 | `packages/prodoc-editor/src/index.ts` |
| MarkdownRenderer 重新导出 | `packages/prodoc-renderer/src/index.ts` |
| MarkdownEditor 重新导出 | `packages/prodoc-editor/src/index.ts` |
| Renderer 定制样式 | `packages/prodoc-renderer/src/styles/index.css` |
| Editor 定制样式 | `packages/prodoc-editor/src/styles/index.css` |
| 文档解析工具 | `packages/prodoc-core/src/index.ts` (从 `@echolab/ui-frame/doc` 重新导出) |
