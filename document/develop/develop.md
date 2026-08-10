---
id: develop
title: "开发指南"
x: 362
y: 508
link: ["interaction-design | 交互设计"]
---

# 开发指南

## 环境准备

```bash
npm install      # 安装依赖（npm workspaces）
npm run build    # 构建全部包（core / renderer / editor / cli）
```

## 本地验证

```bash
npm run view -- ./document   # 渲染本仓库自带的文档群
npm run dev:view ./document  # 开发模式：tsx 直跑源码，HMR 热更新
```

开发模式通过 `PRODOC_DEV=1` + `tsx` 直接运行 TypeScript 源码，无需预先构建。

`./document` 目录同时是框架的自演示文档群：查看器支持文档热更新——修改其中任意 `.md`（正文或参数区），页面原地更新，适合调试布局与连线效果。

## 包结构

| 包 | 职责 |
|------|------|
| `@prodoc/core` | 框架参数区解析（frame）、文档图构建（graph） |
| `@prodoc/renderer` | 查看器 DocGraphViewer（图画布 + 正文渲染） |
| `@prodoc/editor` | 编辑器 DocEditor（edit 模式） |
| `@prodoc/cli` | `echo-prodoc` 命令行（view / edit 服务器） |

> UI 组件统一来自 `@echolab-auto/ui-frame`（新拟态设计系统）；核心逻辑只存在于 ui-frame/doc，各包仅做重新导出，不重复实现。

## 深入

- [交互设计](./interaction-design/interaction-design.md) — 查看器完整交互逻辑的流程图
- [ProDoc 规则定义](./prodoc-rule/prodoc.md) — 文档图模型、参数区语法、渲染规则的权威定义
