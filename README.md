# ProDoc — 文档渲染与编辑框架

> 基于 [**@echolab-auto/ui-frame**](https://github.com/EchoLab-Auto/ui-frame) 新拟态设计系统构建的 Markdown 文档框架。

ProDoc 把一个 Markdown 文档目录渲染为一张可交互的**文档图画布**：每个 `.md` 文件是图上的一个框，`link` 声明的曲线箭头表达导航关系；框按连线层级自动分层排布，浏览与编辑一体化，采用 **新拟态（Neumorphism / Soft UI）** 设计语言。

## 快速开始

### 安装

```bash
# 从 npm 全局安装 CLI 工具（推荐）
npm install -g @echolab-auto/echo-prodoc
```

### 使用

```bash
# 渲染文档目录（浏览 + 编辑一体化）
echo-prodoc view ./document

# 指定端口
echo-prodoc view ./document --port 8080
```

在图画布上点击框阅读文档，悬停框查看分块与上下游链路；「✏️ 编辑」就地修改，Ctrl/Cmd+S 保存；磁盘上的文档变更自动热更新。完整说明见 [使用指南](document/user/user.md) 与 [命令行参考](document/user/cli.md)。

### 开发调试

```bash
# 开发模式（源码运行，HMR 热更新）
npm run dev:view ./document
```

开发模式通过 `PRODOC_DEV=1` + `tsx` 直接运行 TypeScript 源码，无需预先构建。详见 [开发指南](document/develop/develop.md)。

## 技术栈

- **TypeScript** — 完整的类型定义
- **Vue 3** — 组件库
- **Vite** — Library Mode 构建
- **marked** — Markdown 解析
- **@echolab-auto/ui-frame** — 新拟态设计系统

## 许可证

MIT
