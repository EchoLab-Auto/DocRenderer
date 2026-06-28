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
| `createNode(filePath, content)` | 创建单个 ProDocNode |
| `createDocTree(root)` | 从根节点创建 DocTree 索引 |
| `flattenDocTree(root)` | 扁平化文档树为列表 |
| `getAncestors(node, root)` | 获取节点的祖先路径 |
| `getNodeIcon(node)` | 根据路径推断图标 |
| `nodeToTreeData(node)` | ProDocNode → 树节点数据 |
| `parseFrontmatter(content)` | 解析 YAML frontmatter |
| `pathToId(filePath)` | 文件路径 → 文档 ID |
| `extractTitle(body, meta)` | 提取文档标题 |

## @prodoc/renderer

### 组件

| 组件 | 描述 |
|------|------|
| `<DocViewer />` | 完整文档查看器 |
| `<MarkdownRenderer />` | Markdown 渲染 |

## @prodoc/editor

### 组件

| 组件 | 描述 |
|------|------|
| `<DocEditor />` | 完整文档编辑器 |
| `<MarkdownEditor />` | Markdown 编辑器 |

> 💡 所有组件和工具函数的实现源码位于 `@echolab-auto/ui-frame` 的 `dist/doc/` 目录。
> `@prodoc/core`、 `@prodoc/renderer`、 `@prodoc/editor` 均为从 `@echolab-auto/ui-frame/doc` 重新导出的薄封装层。
