# ProDoc — 文档渲染与编辑框架

> 基于 [**@echolab-auto/ui-frame**](https://github.com/EchoLab-Auto/ui-frame) 新拟态设计系统构建的 Markdown 文档框架。

ProDoc 是一个文档渲染与编辑框架，采用 **新拟态（Neumorphism / Soft UI）** 设计语言。

## 快速开始

### 安装

```bash
# 从 npm 全局安装 CLI 工具（推荐）
npm install -g @echolab-auto/echo-prodoc
```

### 使用

```bash
# 渲染文档目录
echo-prodoc view ./docs

# 编辑文档目录
echo-prodoc edit ./docs

# 指定端口
echo-prodoc view ./docs --port 8080
```

## 技术栈

- **TypeScript** — 完整的类型定义
- **Vue 3** — 组件库
- **Vite** — Library Mode 构建
- **marked** — Markdown 解析
- **@echolab-auto/ui-frame** — 新拟态设计系统

## 许可证

MIT
