---
title: "安装方式"
order: 1
---

# 安装方式

ProDoc 目前**只支持以下两种安装方式**，文档和 README 中不应出现第三种安装方式。

## 一、源码安装（推荐开发者和贡献者）

从 GitHub clone 仓库后，在本地安装依赖并构建：

```bash
git clone https://github.com/EchoLab-Auto/DocRenderer.git
cd DocRenderer
npm install && npm run build
npm link
echo-prodoc view ./examples/demo/document
# 或本地运行：npm run view -- ./examples/demo/document
```

这种方式会完整安装工作区依赖、构建 `@echolab/ui-frame` 以及所有 `packages/*` 包，适合需要二次开发或调试的用户。

## 二、GitHub 全局安装（推荐终端用户）

由于 `npm install -g github:...` 会直接软链接到临时克隆目录，全局安装后经常出现命令找不到或链接断裂的问题，推荐先打包再安装：

```bash
TARBALL=$(npm pack github:EchoLab-Auto/DocRenderer | tail -1) && npm install -g "$TARBALL" && rm -f "$TARBALL"
```

安装完成后，如果 `echo-prodoc` 命令无法直接运行（通常因为 npm 全局 bin 目录不在 PATH 中），可以使用项目自带的脚本创建系统级软链接：

```bash
sudo node "$(npm root -g)/echo-prodoc/scripts/link-system-bin.js"
```

或者手动将 npm 全局 bin 目录加入 PATH：

```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

安装完成后即可使用 `echo-prodoc` 命令：

```bash
echo-prodoc view ./docs
echo-prodoc edit ./docs
```

## 三、不支持的安装方式

### `npm install -g echo-prodoc`

`echo-prodoc` **不是**发布到 npm registry 的包名，当前也没有对应的 npm 发布产物。因此以下命令不可用：

```bash
# 错误，请勿使用
npm install -g echo-prodoc
```

所有面向用户的安装说明都必须使用本节列出的两种正确方式之一。
