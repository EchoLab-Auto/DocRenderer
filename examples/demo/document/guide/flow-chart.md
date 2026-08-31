---
title: "流程图语法"
group: 指南
x: 616
y: 216
---

# 流程图语法

ProDoc 支持用 `prodoc-flow` 代码块定义流程图。渲染时代码块呈现为**可交互的流程画布**（无边画板 UI：拖拽平移、Ctrl+滚轮缩放、一键适配），节点可关联文档，点击即跳转。

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
- `(文本)` - 体育场形节点
- `[/文本/]` - 圆角矩形节点

## 文档链接

节点可以关联到文档（路径以 `/` 开头、相对文档根）：

```prodoc-flow
graph LR
  A[首页|/index.md] --> B{有权限?}
  B -->|是| C[用户中心|/api/user.md]
  B -->|否| D[登录页]
```

带链接的节点渲染为主色描边 + ↗ 图标，点击（或 Enter/Space）即跳转。

## 交互式示例

下面是一个完整的流程图示例，点击带 ↗ 的节点可以跳转到对应文档：

```prodoc-flow
graph LR
  Start[开始使用|/index.md] --> Guide[使用指南|/guide/index.md]
  Guide --> QuickStart[快速入门|/guide/getting-started.md]
  Guide --> FlowChart[流程图语法|/guide/flow-chart.md]
  QuickStart --> API[API 文档|/api/index.md]
  FlowChart --> API
  API --> End[完成]
```

## 画布视图

点击查看器头部右侧的「🗺 画布」，可以把当前文档切换为**画布视图**：

- 文档内定义了 `prodoc-flow` 时，展示这张流程图（如本页）
- 没有流程定义的目录节点，会自动生成**层级地图**（子文档卡片），点击卡片钻取下一层

从章节目录到单篇文档，从抽象地图到具体正文 —— 你可以沿着链接一路钻取。
