---
title: "ProDoc 文档格式规范"
order: 3
---

# ProDoc 文档格式规范

ProDoc 是一种基于 Markdown 的文档组织约定，定义了如何将一组 Markdown 文件组织成可供 ProDoc 渲染器识别和渲染的文档结构。

## 文件格式

所有 ProDoc 文档必须是 **`.md` 扩展名** 的 Markdown 文件，使用 UTF-8 编码。

## 文件系统映射

ProDoc 的文档树由**文件系统目录结构**直接映射而来。目录层级关系即文档的父子关系。

### 基本结构示例

```
document/
├── index.md              # 文档首页
├── guide/
│   ├── index.md          # "使用指南" 目录节点
│   ├── getting-started.md
│   └── configuration.md
├── api/
│   └── index.md
└── reference/
    └── changelog.md
```

- 每个 `.md` 文件对应一个文档节点
- 目录本身不直接产生节点，而是通过目录内的文件产生

## 元数据（Frontmatter）

每个文档文件可以在开头使用 YAML frontmatter 定义元数据：

```yaml
---
title: "文档标题"
order: 1
---
```

### 内置字段

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `title` | `string` | 文档标题，用于导航树和页面显示 | 从正文第一个 H1 提取，否则为 `"Untitled"` |
| `order` | `number` | 排序权重，同级节点按此值升序排列 | `9999` |

### 自定义字段

Frontmatter 中除 `title` 和 `order` 以外的所有字段都会被解析并存入节点的 `meta` 对象中，可用于扩展。例如：

```yaml
---
title: "API 参考"
order: 3
author: "张三"
tags: ["api", "reference"]
---
```

### 值类型

Frontmatter 字段支持以下类型：

| 类型 | 示例 | 说明 |
|------|------|------|
| 整数 | `order: 1` | 纯数字，自动解析为 `number` |
| 浮点数 | `version: 1.5` | 带小数点的数字 |
| 布尔值 | `draft: true` | `true` 或 `false` |
| 字符串 | `title: "文档标题"` | 可带双引号或单引号 |
| 裸字符串 | `author: 张三` | 不带引号的字符串 |

## 文档树构建规则

### `index.md` 的作用

目录中的 `index.md` 文件充当**目录节点**，是该目录下其他文件的父节点。

例如，`guide/install.md` 的父节点优先匹配 `guide/index.md`（如果存在）。

### 父节点回退

如果目录中**没有 `index.md`**，则尝试将该目录的**同名 `.md` 文件**作为父节点：

- `guide/install.md` → 优先找 `guide/index.md`
- 若不存在，则尝试找 `guide.md`

### 根级文件

直接位于文档根目录下的文件（路径中不含 `/`）作为根节点的子节点。通常应包含一个 `index.md` 作为文档首页。

## 排序规则

同级节点按以下优先级排序：

1. **`order` 值升序** — 值越小越靠前
2. **`order` 相同时** — 按 `title` 字典序升序排列

建议为需要特定排序的文档显式设置 `order`，其他文档可省略（默认 `9999`）。

## 流程图 DSL

ProDoc 支持一种特殊的流程图语法，用于在 Markdown 中嵌入交互式流程图。

### 基本语法

使用 `prodoc-flow` 代码块：

````markdown
```prodoc-flow
graph LR
  A[开始] --> B{判断}
  B -->|是| C[处理1]
  B -->|否| D[处理2]
  C --> E[结束]
  D --> E
```
````

### 节点类型

| 语法 | 形状 | 示例 |
|------|------|------|
| `[文本]` | 矩形 | `A[开始]` |
| `{文本}` | 菱形（判断） | `B{判断}` |
| `(文本)` | 圆形 | `C(结束)` |
| `[/文本/]` | 圆角矩形 | `D[/处理/]` |

### 节点关联文档

节点文本后可通过 `|` 分隔符附加文档路径，点击节点即可跳转到对应文档：

```prodoc-flow
graph LR
  A[首页|/index.md] --> B{有权限?}
  B -->|是| C[用户中心|/api/user.md]
  B -->|否| D[登录页]
```

### 方向关键字

| 关键字 | 方向 |
|--------|------|
| `LR` | 从左到右 |
| `RL` | 从右到左 |
| `TB` | 从上到下 |
| `BT` | 从下到上 |

## 完整示例

以下是一个符合 ProDoc 规范的完整文档目录：

```
document/
├── index.md
├── guide/
│   ├── index.md
│   ├── getting-started.md
│   └── flow-chart.md
└── api/
    └── index.md
```

`document/index.md`：

```markdown
---
title: "ProDoc 文档系统"
order: 1
---

# ProDoc 文档系统

欢迎使用 ProDoc。
```

`document/guide/index.md`：

```markdown
---
title: "使用指南"
order: 2
---

# 使用指南

本章节介绍如何使用 ProDoc。
```

`document/guide/getting-started.md`：

```markdown
---
title: "快速入门"
order: 1
---

# 快速入门

创建 ProDoc 项目...
```
