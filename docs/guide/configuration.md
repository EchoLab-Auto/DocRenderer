---
title: 配置指南
order: 2
---

# 配置指南

## 主题配置

ProDoc 支持三种主题模式，通过 `ThemeProvider` 控制：

| 模式 | 说明 |
|------|------|
| `light` | 亮色主题 |
| `dark` | 暗色主题 |
| `auto` | 跟随系统偏好（默认） |

CLI 启动的页面已内置 `ThemeProvider`，用户可通过界面上的主题切换按钮选择。

## CSS 变量覆盖

在项目的全局 CSS 中覆盖以下变量即可定制外观，无需修改组件源码：

```css
:root {
  --nm-primary-color: #6c7ae0;       /* 主色调 */
  --nm-bg-color: #e0e0e0;            /* 背景色 */
  --nm-border-radius-md: 16px;       /* 中等圆角 */
  --nm-shadow-dark: rgba(0,0,0,0.15); /* 暗阴影强度 */
}

[data-theme="dark"] {
  --nm-bg-color: #1a1a2e;
  --nm-primary-color: #858ae0;
}
```

常用可覆盖变量参见 [API 参考](../reference/ui-layout.md#7-css-变量布局相关)。

## 全局组件配置

在应用入口通过 `app.use()` 设置组件默认值，避免逐个传参：

```ts
app.use(uiFrame, {
  button: { size: 'medium', variant: 'raised' },
  input: { size: 'medium' },
  select: { size: 'medium', clearable: true },
  modal: { maskClosable: true },
  table: { size: 'medium', striped: true, hoverable: true },
})
```

优先级：显式 prop > 全局配置 > 组件默认值。
