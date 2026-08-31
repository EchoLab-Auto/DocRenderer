---
title: "API 文档"
x: 332
y: 48
---

# API 文档

## @prodoc/core

### 框架参数区（frame）

| 函数 | 描述 |
|------|------|
| `parseFrameBlock(content)` | 解析文件最前方的框架参数区，返回参数与剥离后的正文 |
| `writeFramePosition(content, pos)` | 把画布坐标写回参数区（`x` / `y`） |
| `readFrameLinks(content)` | 读取参数区的 `link` 连线条目 |
| `writeFrameLinks(content, links)` | 重写参数区的 `link` 连线条目 |
| `writeFrameGroup(content, group)` | 写回参数区的 `group` 分组条目（`null` 移除） |

### 文档图（graph）

| 函数 | 描述 |
|------|------|
| `buildDocGraph(files)` | 从「相对路径 → 文件内容」映射构建文档图（框 + 连线 + 分组 + 警告） |
| `computeLayeredLayout(boxes, relations)` | 忽略文件坐标，按连线层级计算分层布局 |
| `parseLinkEntry(entry)` | 解析单条 link 条目（引用 / 标签 / 连接边） |
| `buildLinkEntry({ ref, label, fromSide, toSide })` | 组装 link 条目字符串 |
| `parseGroupEntry(entry)` | 解析 group 条目（组名 / 显式区域几何 `@ x, y, w, h`） |
| `buildGroupEntry({ name, x, y, w, h })` | 组装 group 条目字符串 |
| `computeGroupRegion(members, explicit?)` | 计算分组区域几何（成员包围盒 + 内边距，或显式声明值） |

### 流程图（prodoc-flow，重新导出）

| 函数 | 描述 |
|------|------|
| `parseProDocFlow(source)` | 解析 prodoc-flow 代码块为流程图模型 |
| `extractFlowBlocks(content)` | 提取正文中的全部 prodoc-flow 代码块 |
| `layoutProDocFlow(graph)` | 流程图自动布局 |

## @prodoc/renderer

### 组件

| 组件 | 描述 |
|------|------|
| `<DocGraphViewer />` | 文档图查看器：图画布 + 正文渲染 + 内置编辑一体化 |

> 💡 UI 组件与流程图的实现源码位于 `@echolab-auto/ui-frame` 的 `dist/doc/` 目录，`@prodoc/core` 对流程图部分仅做重新导出。
