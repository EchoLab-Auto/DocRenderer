---
title: "API 参考"
order: 4
---

# API 参考

> 📐 [UI 布局定义](./ui-layout.md) — 所有组件的布局参数速查表

## @prodoc/core

### 类型定义

```ts
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
| `parseFlowDsl(dsl)` | 解析流程图 DSL |
| `exportFlowDsl(graph)` | 导出流程图为 DSL |

## @prodoc/renderer

### 组件

| 组件 | 描述 |
|------|------|
| `<DocViewer />` | 完整文档查看器 |
| `<TreeNavigator />` | 树状文档导航 |
| `<MarkdownRenderer />` | Markdown 渲染 |
| `<FlowRenderer />` | 流程图渲染 |

### DocViewer Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `root` | `ProDocNode` | 必填 | 文档树根节点 |
| `initialPath` | `string` | — | 初始选中路径 |

### DocViewer 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `docLink` | `path: string` | 文档链接点击 |

## @prodoc/editor

### 组件

| 组件 | 描述 |
|------|------|
| `<DocEditor />` | 完整文档编辑器 |
| `<MarkdownEditor />` | Markdown 编辑器 |
| `<FlowEditor />` | 流程图编辑器 |

### DocEditor Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `root` | `ProDocNode` | 必填 | 文档树根节点 |
| `initialPath` | `string` | — | 初始选中路径 |

### DocEditor 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `save` | `path: string, content: string` | 保存文档 |
| `docLink` | `path: string` | 文档链接点击 |
