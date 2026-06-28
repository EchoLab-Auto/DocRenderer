---
title: "UI 开发标准流程"
order: 5
---

# UI 开发标准流程

本文档规定在 ProDoc 项目中新增或修改 UI 时必须遵循的标准流程。所有界面实现都必须复用 `@echolab-auto/ui-frame` 提供的组件、构建能力和页面模板，禁止在 `prodoc-*` 包内重复实现组件逻辑。

## 一、核心原则

1. **组件来源唯一**：所有 UI 组件必须来自 `@echolab-auto/ui-frame`，禁止手写自定义按钮、输入框、表格、弹窗等基础组件。
2. **文档能力复用**：文档树解析、渲染、编辑能力必须来自 `@echolab-auto/ui-frame/doc`，`prodoc-core` / `prodoc-renderer` / `prodoc-editor` 只做重新导出。
3. **样式覆盖而非重写**：视觉定制通过 CSS 变量和少量覆盖样式完成，不替换 ui-frame 组件。
4. **页面模板优先**：页面结构优先使用 ui-frame 提供的标准模板（Layout + Container + Card + 内容组件）。

## 二、标准开发流程

### 步骤 1：确认需求是否已被 ui-frame 覆盖

在动手写代码前，先对照 `@echolab-auto/ui-frame` 的能力清单：

- **基础组件**：按钮、输入框、选择器、开关、复选框、单选框、滑块、日期选择等
- **数据展示**：卡片、表格、列表、树、虚拟列表、骨架屏、进度条等
- **反馈组件**：弹窗、抽屉、Toast、Tooltip、Popover、Alert、Empty 等
- **导航组件**：菜单、导航栏、标签页、面包屑、分页、步骤条等
- **布局组件**：Layout、Container、Row/Col、Divider 等
- **文档模块**：`@echolab-auto/ui-frame/doc` 提供 `DocViewer`、`DocEditor`、`MarkdownRenderer`、`MarkdownEditor`
- **Headless Composables**：`useSelect`、`useTable`、`useTree`、`usePagination` 等纯逻辑钩子

如果 ui-frame 已经提供，直接复用；如果只有行为逻辑没有合适 UI，使用对应的 Headless Composable 自定义渲染。

### 步骤 2：选择合适的导入源

根据功能归属选择正确的导入路径：

| 能力类型 | 导入源 | 示例 |
|----------|--------|------|
| 通用 UI 组件 | `@echolab-auto/ui-frame` | `import { NeumorphismButton } from '@echolab-auto/ui-frame'` |
| 文档渲染/编辑 | `@echolab-auto/ui-frame/doc` | `import { DocViewer } from '@echolab-auto/ui-frame/doc'` |
| 文档解析与树构建 | `@prodoc/core` | `import { buildDocTree } from '@prodoc/core'` |
| 渲染组件封装 | `@prodoc/renderer` | `import { DocViewer } from '@prodoc/renderer'` |
| 编辑组件封装 | `@prodoc/editor` | `import { DocEditor } from '@prodoc/editor'` |

> 注意：`@prodoc/core` / `@prodoc/renderer` / `@prodoc/editor` 本身不维护实现，只是 re-export。新增功能时如果 ui-frame/doc 没有，应优先去 ui-frame 侧扩展，而不是在 prodoc 包里新写。

### 步骤 3：搭建页面骨架

所有页面级别的 UI 都应优先使用 `NeumorphismLayout` 作为外壳：

```vue
<template>
  <NeumorphismLayout show-header show-sider :sider-width="280" collapsible>
    <template #header-left>
      <span>📚 ProDoc</span>
    </template>
    <template #header-right>
      <NeumorphismThemeToggle v-model="theme" size="small" />
    </template>

    <template #sider>
      <NeumorphismMenu :items="menuItems" selectable />
    </template>

    <template #default>
      <NeumorphismContainer>
        <!-- 页面内容 -->
      </NeumorphismContainer>
    </template>
  </NeumorphismLayout>
</template>
```

如果是文档站点，直接使用 `DocViewer`：

```vue
<script setup>
import { DocViewer } from '@echolab-auto/ui-frame/doc'
import { buildDocTree } from '@prodoc/core'

const docRoot = buildDocTree(files)
</script>

<template>
  <DocViewer :root="docRoot" />
</template>
```

### 步骤 4：用 Card 组织内容层级

内容区域使用 `NeumorphismCard`，通过 `elevation` 控制视觉层级：

```vue
<NeumorphismCard :elevation="-3" no-padding>
  <!-- 凹陷背景层，作为内容底座 -->
  <NeumorphismCard :elevation="2" hoverable="bulge">
    <!-- 凸起的内容卡片 -->
  </NeumorphismCard>
</NeumorphismCard>
```

常用层级对照：

| elevation | 效果 | 用途 |
|-----------|------|------|
| -3 ~ -4 | 强凹陷 | 页面底座、背景容器 |
| -1 ~ -2 | 轻微凹陷 | 表单输入区、内嵌面板 |
| 0 | 平齐 | 分割线、分隔带 |
| 1 ~ 2 | 凸起 | 普通内容卡片 |
| 3 ~ 4 | 强凸起 | 强调卡片、悬浮操作 |

### 步骤 5：接入主题系统

在应用根节点包裹 `ThemeProvider`，并在需要的地方使用 `NeumorphismThemeToggle`：

```ts
import { createApp, h } from 'vue'
import uiFrame, { ThemeProvider } from '@echolab-auto/ui-frame'
import '@echolab-auto/ui-frame/dist/style.css'

const app = createApp({
  render: () => h(ThemeProvider, { defaultTheme: 'auto' }, {
    default: () => h(App),
  }),
})

app.use(uiFrame)
app.mount('#app')
```

CLI 场景下，入口由 `prodoc-cli/src/server.ts` 动态生成，已经默认包含 `ThemeProvider`。

### 步骤 6：全局配置减少重复传参

通过 `app.use(uiFrame, config)` 统一设置组件默认值，不要在每个实例上重复写 props：

```ts
app.use(uiFrame, {
  button: { size: 'medium', variant: 'raised' },
  input: { size: 'medium' },
  select: { size: 'medium', clearable: true },
  modal: { maskClosable: true },
  toast: { position: 'top-right', maxCount: 5 },
  pagination: { size: 'medium', showTotal: true },
  table: { size: 'medium', striped: true, hoverable: true },
})
```

### 步骤 7：样式定制

全局样式引入一次：

```ts
import '@echolab-auto/ui-frame/dist/style.css'
```

视觉微调通过覆盖 CSS 变量实现：

```css
:root {
  --nm-primary-color: #6c7ae0;
  --nm-bg-color: #e0e0e0;
  --nm-border-radius-md: 16px;
}

[data-theme="dark"] {
  --nm-bg-color: #121212;
}
```

ProDoc 特有的覆盖（滚动条、主题过渡、选中色）放在各自包的 `src/styles/index.css` 中，不要侵入 ui-frame 的 token 定义。

## 三、典型页面模板速查

### 文档查看页

```vue
<script setup>
import { DocViewer } from '@prodoc/renderer'
import { buildDocTree } from '@prodoc/core'

const docRoot = buildDocTree(files)
</script>

<template>
  <DocViewer :root="docRoot" initial-path="/guide" />
</template>
```

### 表单页

```vue
<template>
  <NeumorphismCard :elevation="2" radius="large">
    <template #header>用户信息</template>
    <NeumorphismForm :model="form" :rules="rules" @submit="onSubmit">
      <NeumorphismFormItem label="用户名" prop="name" required>
        <NeumorphismInput v-model="form.name" />
      </NeumorphismFormItem>
      <NeumorphismFormItem label="状态" prop="status">
        <NeumorphismSelect v-model="form.status" :options="statusOptions" />
      </NeumorphismFormItem>
      <NeumorphismButton type="submit" variant="raised">提交</NeumorphismButton>
    </NeumorphismForm>
  </NeumorphismCard>
</template>
```

### 数据列表页

```vue
<template>
  <NeumorphismCard :elevation="1" no-padding>
    <NeumorphismTable :columns="columns" :data="list" striped hoverable size="medium" />
    <template #footer>
      <NeumorphismPagination v-model:current="page" :total="total" :page-size="10" />
    </template>
  </NeumorphismCard>
</template>
```

## 四、禁止事项

- 禁止在 `prodoc-*` 包内创建新的按钮、输入框、弹窗等基础组件
- 禁止复制 ui-frame 的组件源码到本仓库进行修改
- 禁止绕过 `@prodoc/core` / `@prodoc/renderer` / `@prodoc/editor` 直接依赖 ui-frame 的文档能力（除非在 ui-frame 扩展场景）
- 禁止在 README 中写组件用法示例（README 只允许四个部分，详见 [README 内容范围](./readme-scope.md)）

## 五、验证步骤

UI 改动完成后，必须运行以下命令验证 CLI 可用：

```bash
npm run build
npm run view -- ./docs
```

如果涉及编辑功能，同时验证：

```bash
npm run edit -- ./docs
```

确认页面正常渲染、主题切换生效、文档树可交互、无控制台报错后再提交。

## 六、相关文档

- [文档组织规则](./doc-organization.md) — 本项目文档体系的结构与维护规范
- [README 内容范围](./readme-scope.md) — README 内容限制
- [安装方式](./installation.md) — 项目安装与本地开发 setup
- [API 参考](../reference/ui-layout.md) — UI 布局与组件 API
