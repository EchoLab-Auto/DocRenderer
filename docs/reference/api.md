---
title: API 参考
order: 1
---

# API 参考

## DocViewer

文档查看器组件。

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `root` | `ProDocNode` | 必填 | 文档树根节点 |
| `initialPath` | `string` | - | 初始选中路径 |

### 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `docLink` | `path: string` | 文档链接点击 |

## DocEditor

文档编辑器组件。

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `root` | `ProDocNode` | 必填 | 文档树根节点 |
| `initialPath` | `string` | - | 初始选中路径 |

### 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `save` | `path: string, content: string` | 保存文档 |
| `docLink` | `path: string` | 文档链接点击 |
