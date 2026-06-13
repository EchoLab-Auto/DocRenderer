---
title: "API 参考"
order: 4
---

# API 参考

> 📐 [UI 布局定义](./ui-layout.md) — 所有组件的 CSS 布局参数速查表
>
> 💡 所有组件和工具函数的实现源码位于 `@echolab/ui-frame` 的 `src/doc/` 目录。
> `@prodoc/core`、`@prodoc/renderer`、`@prodoc/editor` 均为从 `@echolab/ui-frame/doc` 重新导出的薄封装层。

## @prodoc/core

### 类型定义

```ts
// 来源：@echolab/ui-frame/doc
interface ProDocNode {
  id: string;
  title: string;
  path: string;
  content: string;
  body: string;
  meta: Record<string, unknown>;
  children: ProDocNode[];
  order: number;
}
```

### 函数

| 函数 | 描述 |
|------|------|
| `buildDocTree(files)` | 从文件映射构建文档树 |
| `createDocTree(root)` | 从根节点创建 DocTree 索引 |
| `flattenDocTree(root)` | 扁平化文档树为列表 |
| `getAncestors(node, root)` | 获取节点的祖先路径 |
| `parseFrontmatter(content)` | 解析 YAML frontmatter |
| `pathToId(filePath)` | 文件路径 → 文档 ID |
| `extractTitle(body, meta)` | 提取文档标题 |
| `createNode(filePath, content)` | 创建单个 ProDocNode |
| `getNodeIcon(node)` | 根据路径推断图标 |
| `nodeToTreeData(node)` | ProDocNode → 树节点数据 |

## @prodoc/renderer

> 从 `@echolab/ui-frame/doc` 重新导出，实现源码位于 ui-frame 的 `src/doc/`。

### 组件

| 组件 | 描述 |
|------|------|
| `<DocViewer />` | 完整文档查看器（布局 + 树导航 + 渲染） |
| `<MarkdownRenderer />` | 独立 Markdown 渲染器（TOC、代码高亮） |

### DocViewer Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `root` | `ProDocNode` | 必填 | 文档树根节点 |
| `initialPath` | `string` | — | 初始选中路径 |
| `className` | `string` | `''` | 自定义样式类名 |

### DocViewer 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `docLink` | `path: string` | 文档链接点击时触发 |

### MarkdownRenderer Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `content` | `string` | 必填 | Markdown 内容 |
| `showToc` | `boolean` | `true` | 是否显示目录 |
| `className` | `string` | `''` | 自定义样式类名 |
| `scrollContainer` | `HTMLElement \| string` | — | 滚动容器 |

### MarkdownRenderer 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `docLink` | `path: string` | 文档链接点击时触发 |

## @prodoc/editor

> 从 `@echolab/ui-frame/doc` 重新导出，实现源码位于 ui-frame 的 `src/doc/`。

### 组件

| 组件 | 描述 |
|------|------|
| `<DocEditor />` | 完整文档编辑器（布局 + 树导航 + 编辑区） |
| `<MarkdownEditor />` | 独立 Markdown 编辑器（编辑/分栏/预览模式） |

### DocEditor Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `root` | `ProDocNode` | 必填 | 文档树根节点 |
| `initialPath` | `string` | — | 初始选中路径 |
| `className` | `string` | `''` | 自定义样式类名 |

### DocEditor 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `save` | `path: string, content: string` | 保存文档时触发 |
| `docLink` | `path: string` | 文档链接点击时触发 |

### MarkdownEditor Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string` | 必填 | Markdown 内容 |
| `className` | `string` | `''` | 自定义样式类名 |

### MarkdownEditor 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `change` | `value: string` | 内容变化时触发 |
| `docLink` | `path: string` | 文档链接点击时触发 |
