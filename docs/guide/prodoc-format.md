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

## 流程图（prodoc-flow）

ProDoc 支持用 ` ```prodoc-flow ` 代码块在文档中定义**流程图**。渲染时该代码块会呈现为**可交互的流程画布**（无边画板 UI，支持平移、缩放、适配），流程中的节点可以关联文档，点击节点即跳转——文档的组织由此从「目录树 + 正文」扩展为「空间地图」，逐层钻取、从抽象到具体。

### 方向声明

第一个有效行必须是方向声明：

```
graph LR
```

| 方向 | 含义 |
|------|------|
| `LR` | 从左到右（默认） |
| `RL` | 从右到左 |
| `TB` | 从上到下 |
| `BT` | 从下到上 |

缺少方向声明时按 `LR` 处理并记录一条解析警告。

### 节点

| 语法 | 形状 |
|------|------|
| `A[文本]` | 矩形 |
| `A[/文本/]` | 圆角矩形 |
| `A(文本)` | 体育场形 |
| `A{文本}` | 菱形 |
| `A` | 裸 id 引用（自动登记为矩形，显示文本为 id） |

- 节点 id 为裸标识符（字母/数字/下划线/连字符，字母开头），文本可含空格与中文
- 同一 id 的完整声明后出现时会**合并升级**先前的裸引用（后者优先）
- 独立一行的 `A[文本]` 是节点声明；节点也可在边行中内联声明

### 边与标签

```
A --> B          %% 基本边
A -->|是| B      %% 带标签的边
A --> B --> C    %% 链式（等价于 A --> B、B --> C）
```

完全相同的边（起点 + 终点 + 标签）重复声明时只保留一条。

### 文档链接

节点文本中以竖线附加文档路径，即把节点变为**可点击的文档链接**：

```
A[首页|/index.md] --> B[用户中心|/api/user.md]
```

- 路径必须以 `/`、`./` 或 `../` 开头并以 `.md` 结尾，相对文档根目录
- 带链接的节点渲染为主色描边 + ↗ 图标，点击（或 Enter/Space）在查看器内跳转
- 查看器的「🗺 画布」视图中，点击容器节点会继续展示下一层的流程/层级地图；点击叶子节点则落回正文——抽象到具体的终点是文档

### 注释

`%%` 之后的内容为注释（可整行或位于行尾）：

```
%% 整行注释
A --> B  %% 行尾注释
```

### 容错规则

- 无法识别的行不会中断解析，而是被跳过并记录到解析警告中
- 整个代码块没有任何有效节点时，按普通代码块原样显示源码
- 建议单张流程图节点数控制在 30 个以内，以保证自动布局的可读性

### 完整示例

````
```prodoc-flow
graph LR
  Start[开始使用|/index.md] --> Guide[使用指南|/guide/index.md]
  Guide --> QuickStart[快速入门|/guide/getting-started.md]
  Guide --> FlowChart[流程图语法|/guide/flow-chart.md]
  QuickStart --> API[API 文档|/api/index.md]
  FlowChart --> API
  API --> End[完成]
```
````

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
