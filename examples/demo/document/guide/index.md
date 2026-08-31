---
title: "使用指南"
group: 指南
x: 48
y: 216
link: ["guide/getting-started | 快速入门", "guide/flow-chart | 流程图"]
---

# 使用指南

本章节介绍如何使用 ProDoc。

## 安装

```bash
npm install @prodoc/core @prodoc/renderer
```

## 基本用法

```ts
import { createApp, h } from 'vue'
import uiFrame, { ThemeProvider } from '@echolab-auto/ui-frame'
import { DocGraphViewer } from '@prodoc/renderer'

const app = createApp({
  render() {
    return h(ThemeProvider, { defaultTheme: 'auto' }, {
      default: () => h(DocGraphViewer, { files: { 'index.md': '# 首页' } }),
    })
  },
})

app.use(uiFrame)
app.mount('#app')
```
