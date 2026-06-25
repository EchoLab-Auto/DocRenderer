---
title: 快速开始
order: 1
---

# 快速开始

## 安装

```bash
TARBALL=$(npm pack github:EchoLab-Auto/DocRenderer | tail -1) && npm install -g "$TARBALL" && rm -f "$TARBALL"
```

如果安装后 `echo-prodoc` 不在 PATH 中，可创建系统级软链接：

```bash
sudo node "$(npm root -g)/echo-prodoc/scripts/link-system-bin.js"
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
