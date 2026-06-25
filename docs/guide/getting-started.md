---
title: 快速开始
order: 1
---

# 快速开始

## 安装

### 从 npm 全局安装（推荐）

```bash
npm install -g @echolab/echo-prodoc
```

### 从 GitHub 打包安装

```bash
TARBALL=$(npm pack github:EchoLab-Auto/DocRenderer | tail -1) && npm install -g "$TARBALL" && rm -f "$TARBALL"
```

如果安装后 `echo-prodoc` 不在 PATH 中，可创建系统级软链接：

```bash
sudo -E env "PATH=$PATH" node "$(npm root -g)/@echolab/echo-prodoc/scripts/link-system-bin.js"
```

## 使用

### 查看模式

```bash
echo-prodoc view ./docs
# 或临时使用 npx
npx echo-prodoc view ./docs
```

### 编辑模式

```bash
echo-prodoc edit ./docs
# 或临时使用 npx
npx echo-prodoc edit ./docs
```

## 配置

在 `package.json` 中配置：

```json
{
  "scripts": {
    "docs:view": "echo-prodoc view ./docs",
    "docs:edit": "echo-prodoc edit ./docs"
  }
}
```
