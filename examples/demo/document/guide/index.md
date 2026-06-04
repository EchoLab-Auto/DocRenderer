---
title: "使用指南"
order: 2
---

# 使用指南

本章节介绍如何使用 ProDoc。

## 安装

```bash
npm install @prodoc/core @prodoc/renderer @prodoc/editor
```

## 基本用法

```tsx
import { DocViewer } from '@prodoc/renderer';

function App() {
  return <DocViewer root={docTree} />;
}
```
