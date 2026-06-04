---
title: "API 文档"
order: 3
---

# API 文档

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

## @prodoc/editor

### 组件

| 组件 | 描述 |
|------|------|
| `<DocEditor />` | 完整文档编辑器 |
| `<MarkdownEditor />` | Markdown 编辑器 |
| `<FlowEditor />` | 流程图编辑器 |
