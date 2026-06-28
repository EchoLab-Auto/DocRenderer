---
title: "安装方式"
order: 3
---

# 安装方式

ProDoc 目前支持以下两种安装方式，文档和 README 中不应出现其他安装方式。

## 一、npm registry 全局安装（推荐终端用户）

发布到 npm 后，直接全局安装：

```bash
npm install -g @echolab-auto/echo-prodoc
```

安装完成后，如果 `echo-prodoc` 命令无法直接运行（通常因为 npm 全局 bin 目录不在 PATH 中），可以使用项目自带的脚本创建系统级软链接：

```bash
sudo -E env "PATH=$PATH" node "$(npm root -g)/@echolab-auto/echo-prodoc/scripts/link-system-bin.js"
```

或者手动将 npm 全局 bin 目录加入 PATH：

```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

之后即可使用：

```bash
echo-prodoc view ./docs
echo-prodoc edit ./docs
```

## 二、源码安装（推荐开发者和贡献者）

从 GitHub clone 仓库后，在本地安装依赖并构建：

```bash
git clone https://github.com/EchoLab-Auto/DocRenderer.git
cd DocRenderer
npm install && npm run build
npm link
echo-prodoc view ./examples/demo/document
# 或本地运行：npm run view -- ./examples/demo/document
```

> 源码安装后的本地开发与测试流程（含 ui-frame 本地构建），请参阅 [本地开发与测试](./local-development.md)。

## 三、不支持的安装方式

### `npm install -g echo-prodoc`

`echo-prodoc` **不是**发布到 npm registry 的包名。发布后的包名是作用域包 `@echolab-auto/echo-prodoc`，因此以下命令不可用：

```bash
# 错误，请勿使用
npm install -g echo-prodoc
```

所有面向用户的安装说明都必须使用本节列出的正确方式之一。
