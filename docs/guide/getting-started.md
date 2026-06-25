---
title: 快速开始
order: 1
---

# 快速开始

## 安装

```bash
npm install -g echo-prodoc
```

## 使用

### 查看模式

```bash
npx echo-prodoc view ./docs
```

### 编辑模式

```bash
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
