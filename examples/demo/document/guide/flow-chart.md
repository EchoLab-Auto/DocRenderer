---
title: "流程图语法"
order: 3
---

# 流程图语法

> ⚠️ 流程图渲染功能当前尚未实现。本文档仅作为语法约定参考，实际渲染时 `prodoc-flow` 代码块会按普通代码块显示。

ProDoc 支持一种特殊的 Markdown 代码块来定义流程图。

## 基本语法

使用 ```prodoc-flow``` 代码块：

```prodoc-flow
graph LR
  A[开始] --> B{判断}
  B -->|是| C[处理1]
  B -->|否| D[处理2]
  C --> E[结束]
  D --> E
```

## 节点类型

- `[文本]` - 矩形节点
- `{文本}` - 菱形节点
- `(文本)` - 圆形节点
- `[/文本/]` - 圆角矩形节点

## 文档链接

节点可以关联到文档：

```prodoc-flow
graph LR
  A[首页|/index.md] --> B{有权限?}
  B -->|是| C[用户中心|/api/user.md]
  B -->|否| D[登录页]
```

## 交互式示例

下面是一个完整的流程图示例，点击节点可以跳转到对应文档：

```prodoc-flow
graph LR
  Start[开始使用|/index.md] --> Guide[使用指南|/guide/index.md]
  Guide --> QuickStart[快速入门|/guide/getting-started.md]
  Guide --> FlowChart[流程图语法|/guide/flow-chart.md]
  QuickStart --> API[API 文档|/api/index.md]
  FlowChart --> API
  API --> End[完成]
```
