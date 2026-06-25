# ProDoc — 文档渲染与编辑框架

> 基于 [**@echolab/ui-frame**](https://github.com/EchoLab-Auto/ui-frame) 新拟态设计系统构建的 Markdown 文档框架。

ProDoc 是一个文档渲染与编辑框架，采用 **新拟态（Neumorphism / Soft UI）** 设计语言。

## 快速开始

### 安装

```bash
# 从 npm 全局安装 CLI 工具（推荐）
npm install -g @echolab-auto/echo-prodoc

# 或从 GitHub 打包后全局安装
TARBALL=$(npm pack github:EchoLab-Auto/DocRenderer | tail -1) && npm install -g "$TARBALL" && rm -f "$TARBALL"

# 如果安装后命令不在 PATH 中，可创建系统级软链接
sudo -E env "PATH=$PATH" node "$(npm root -g)/@echolab-auto/echo-prodoc/scripts/link-system-bin.js"
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

也可以通过源码安装：

```bash
git clone https://github.com/EchoLab-Auto/DocRenderer.git
cd DocRenderer
npm install && npm run build
npm link
echo-prodoc view ./examples/demo/document
# 或本地运行：npm run view -- ./examples/demo/document
```

## 技术栈

- **TypeScript** — 完整的类型定义
- **Vue 3** — 组件库
- **Vite** — Library Mode 构建
- **marked** — Markdown 解析
- **@echolab/ui-frame** — 新拟态设计系统

## 许可证

MIT
