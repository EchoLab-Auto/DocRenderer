# ProDoc — 文档渲染与编辑框架

> 基于 [**@echolab/ui-frame**](https://github.com/EchoLab-Auto/ui-frame) 新拟态设计系统构建的 Markdown 文档框架。

ProDoc 是一个文档渲染与编辑框架，采用 **新拟态（Neumorphism / Soft UI）** 设计语言，通过统一的台阶高度模型营造真实的 3D 浮雕与凹陷效果。

## 特性

- 📚 **Markdown 渲染** — 标准 Markdown + GitHub Flavored Markdown 支持
- 🌳 **文档树导航** — 左侧树状文档索引，支持实时搜索过滤
- 🎨 **新拟态 UI** — 基于 [@echolab/ui-frame](https://github.com/EchoLab-Auto/ui-frame) 的统一台阶高度模型
- 🌙 **主题切换** — 亮色 / 暗色 / 自动跟随系统偏好
- ✏️ **在线编辑** — 浏览器中直接编辑 Markdown
- 📦 **npm 发布** — 支持作为 npm 包集成使用

---

## 设计系统

ProDoc 的 UI 基于 **@echolab/ui-frame** 新拟态组件库构建，遵循以下设计原则：

### 统一台阶高度模型

| Elevation | 效果 | 阴影强度 | 使用场景 |
|-----------|------|----------|----------|
| `+4` | 强凸起 | 16px/36px | 悬浮按钮、弹窗 |
| `+3` | 中强凸起 | 12px/28px | 卡片悬停 |
| `+2` | 默认凸起 | 8px/20px | 选中项、按钮 |
| `+1` | 轻微凸起 | 4px/10px |  subtle 交互 |
| `0` | 平齐 | 无 | 背景层 |
| `-1` | 轻微凹陷 | 4px/10px | 浅输入框 |
| `-2` | 默认凹陷 | 8px/20px | 侧边栏、面板 |
| `-3` | 中强凹陷 | 12px/28px | 代码块、画布 |
| `-4` | 强凹陷 | 16px/36px | 深容器 |

### 多层阴影

每个元素由三层阴影构成：
- **环境遮挡** — 柔和的底层阴影，锚定元素位置
- **定向暗影** — 模拟光源方向的阴影
- **边缘高光** — 对立面的高光，增强 3D 感

### 弹性缓动

所有交互过渡采用 `cubic-bezier(0.34, 1.56, 0.64, 1)` 弹性曲线：
- 悬停：微妙放大/缩小（`scale(1.015)` / `scale(0.985)`）
- 状态切换：无过冲回弹的临界阻尼效果

---

## 项目结构

```
packages/
  prodoc-core/      # 核心库 - 从 @echolab/ui-frame/doc 重新导出文档解析工具
  prodoc-renderer/  # 渲染器 - 从 @echolab/ui-frame/doc 重新导出 + ProDoc 定制样式
  prodoc-editor/    # 编辑器 - 从 @echolab/ui-frame/doc 重新导出 + ProDoc 定制样式
  prodoc-cli/       # CLI 工具 - echo-prodoc view / echo-prodoc edit
examples/
  demo/             # 演示项目（符合 ProDoc 标准）
```

---

## 快速开始

### 安装

#### 方式一：从 npm 安装（推荐）

```bash
# 安装渲染器和核心库
npm install @prodoc/core @prodoc/renderer

# 全局安装 CLI 工具
npm install -g echo-prodoc
```

安装后即可使用 `echo-prodoc` 命令：

```bash
# 渲染文档目录
echo-prodoc view ./docs

# 编辑文档目录
echo-prodoc edit ./docs

# 指定端口
echo-prodoc view ./docs --port 8080
```

#### 方式二：从 GitHub 全局安装（无需克隆）

```bash
# 直接从 GitHub 全局安装 CLI
npm install -g github:EchoLab-Auto/DocRenderer
```

安装后即可使用 `echo-prodoc` 命令。

#### 方式三：从 Git 仓库源码安装

```bash
# 克隆仓库
git clone https://github.com/EchoLab-Auto/DocRenderer.git
cd DocRenderer

# 安装依赖并构建
npm install
npm run build

# 将 CLI 链接到全局（可选）
npm link

# 运行
echo-prodoc view ./examples/demo/document
# 或直接运行构建产物
node ./packages/prodoc-cli/dist/index.js view ./examples/demo/document

```

---

## ProDoc 文件格式

ProDoc 使用 Markdown 文件组织文档，通过 frontmatter 定义元数据：

```yaml
---
title: "文档标题"
order: 1
---
```

---

## 渲染文档

```ts
import { createApp, h } from 'vue'
import uiFrame, { ThemeProvider } from '@echolab/ui-frame'
import { buildDocTree } from '@prodoc/core'
import { DocViewer } from '@prodoc/renderer'
import '@prodoc/renderer/style.css'

const files = {
  'index.md': '# 首页\n\n欢迎来到 ProDoc',
  'guide.md': '---\ntitle: 指南\n---\n\n# 使用指南',
}

const docTree = buildDocTree(files)

const app = createApp({
  render() {
    return h(ThemeProvider, { defaultTheme: 'auto' }, {
      default: () => h(DocViewer, { root: docTree }),
    })
  },
})

app.use(uiFrame)
app.mount('#app')
```

### 组件列表

| 组件 | 说明 | 来源 |
|------|------|------|
| `DocViewer` | 文档查看器（侧边栏 + 内容区） | `@echolab/ui-frame/doc` |
| `DocEditor` | 文档编辑器（侧边栏 + 编辑区） | `@echolab/ui-frame/doc` |
| `MarkdownRenderer` | Markdown 渲染器（TOC、代码高亮） | `@echolab/ui-frame/doc` |
| `MarkdownEditor` | Markdown 编辑器（编辑/分栏/预览） | `@echolab/ui-frame/doc` |

---

## 编辑文档

```ts
import { createApp, h } from 'vue'
import uiFrame, { ThemeProvider } from '@echolab/ui-frame'
import { DocEditor } from '@prodoc/editor'
import '@prodoc/editor/style.css'

const app = createApp({
  render() {
    return h(ThemeProvider, { defaultTheme: 'auto' }, {
      default: () => h(DocEditor, {
        root: docTree,
        onSave: (path, content) => console.log('保存:', path),
      }),
    })
  },
})

app.use(uiFrame)
app.mount('#app')
```

---

## 主题系统

ProDoc 支持三种主题模式：

| 模式 | 说明 |
|------|------|
| `light` | 亮色主题 — 浅灰背景，深灰文字 |
| `dark` | 暗色主题 — 深灰背景，浅灰文字 |
| `auto` | 自动跟随系统偏好（默认） |

主题状态通过 `data-theme` 属性应用到 `document.documentElement`（值为 `light` 或 `dark`），所有组件通过 CSS 变量自动响应主题变化。

### CSS 变量

ProDoc 的样式基于 CSS 自定义属性，可通过覆盖变量自定义外观：

```css
:root {
  /* 背景与表面 */
  --nm-bg-color: #e0e0e0;
  --nm-surface-color: #e0e0e0;
  --nm-surface-raised: #e5e5e5;

  /* 文字 */
  --nm-text-primary: #555555;
  --nm-text-secondary: #888888;
  --nm-text-placeholder: #aaaaaa;

  /* 强调色 */
  --nm-primary-color: #6c7ae0;

  /* 阴影 */
  --nm-shadow-dark: rgba(0, 0, 0, 0.15);
  --nm-shadow-light: rgba(255, 255, 255, 0.8);
}

[data-theme="dark"] {
  --nm-bg-color: #1c1c1c;
  --nm-surface-color: #1c1c1c;
  --nm-surface-raised: #222222;

  --nm-text-primary: #c0c0c0;
  --nm-text-secondary: #888888;

  --nm-shadow-dark: rgba(0, 0, 0, 0.5);
  --nm-shadow-light: rgba(255, 255, 255, 0.06);
}
```

---

## 开发

```bash
# 安装依赖
npm install

# 构建所有包
npm run build

# 类型检查
npm run type-check

# CLI 本地测试（需先构建）
npm run build
npm run view ./examples/demo/document
npm run edit ./examples/demo/document
```

---

## 技术栈

- **TypeScript** — 完整的类型定义
- **Vue 3** — 组件库
- **Vite** — Library Mode 构建
- **marked** — Markdown 解析
- **@echolab/ui-frame** — 新拟态设计系统

---

## 许可证

MIT
