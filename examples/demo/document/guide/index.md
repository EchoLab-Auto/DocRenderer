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

```ts
import { createApp, h } from 'vue'
import uiFrame, { ThemeProvider } from '@echolab-auto/ui-frame'
import { DocViewer } from '@prodoc/renderer'

const app = createApp({
  render() {
    return h(ThemeProvider, { defaultTheme: 'auto' }, {
      default: () => h(DocViewer, { root: docTree }),
    })
  },
})

app.use(uiFrame)
app.mount('#app')
```
