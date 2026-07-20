---
title: 开发调试
order: 3
---

# 开发调试

## 开发模式

开发模式下直接运行 TypeScript 源码，无需预先构建。Vite 开发服务器提供 HMR（热模块替换），修改 Vue 组件和样式后浏览器自动刷新。

### 启动开发服务器

```bash
# 查看模式（开发）
npm run dev:view ./docs

# 编辑模式（开发）
npm run dev:edit ./docs

# 指定端口
npm run dev:view ./docs -- --port 8080
```

| 命令 | 说明 | 模式 |
|------|------|------|
| `npm run view ./docs` | 使用构建产物启动（需先 `npm run build`） | 生产 |
| `npm run dev:view ./docs` | 使用源码启动，HMR 热更新 | 开发 |

### 工作原理

`dev:view` / `dev:edit` 底层做了两件事：

1. **`PRODOC_DEV=1`** — 让 Vite 服务器将 `@prodoc/core`、`@prodoc/renderer`、`@prodoc/editor` 的别名解析为源码（`.ts` / `.vue`），而非构建产物（`dist/*.js`）
2. **`tsx`** — 直接运行 CLI 源码 `packages/prodoc-cli/src/index.ts`，无需先构建 CLI 包

## 热更新范围

| 修改内容 | 是否自动更新 | 说明 |
|----------|-------------|------|
| Vue 组件 (`.vue`) | ✅ HMR 热更新 | Vite 开发服务器自动处理 |
| 样式 (`.css`) | ✅ HMR 热更新 | 即时注入，无需刷新 |
| `@prodoc/*` 源码 (`.ts`) | ✅ 自动刷新 | Vite 检测到依赖变化后重新加载 |
| ui-frame 组件样式 | ✅ 自动刷新 | 通过 Vite 优化依赖管道处理 |
| CLI 逻辑 (`index.ts`, `server.ts`) | ❌ 需手动重启 | CLI 运行在 Node.js 进程，不在 Vite 管辖范围 |

## 调试技巧

### 查看 Vite 解析的实际文件

启动后观察终端输出中的 `resolve.alias` 映射，确认是否命中了源码而非 dist。

### 手动验证源码路径

```bash
# 对比生产模式和开发模式的入口解析
npm run build && npm run view docs       # 使用 dist/ 产物
npm run dev:view docs                    # 使用 src/ 源码
```

### 类型检查

开发过程中可单独运行类型检查，无需完整构建：

```bash
npm run type-check
```

### 仅构建单个包

```bash
npm run build -w @prodoc/core
npm run build -w @prodoc/renderer
npm run build -w @prodoc/editor
```

## 依赖切换

如需在本地修改 `@echolab-auto/ui-frame` 源码并联合调试：

```bash
# 切换到本地构建（从 GitHub 拉取并构建到 vendor/）
npm run use-local-ui-frame

# 切换回 npm registry 版本
npm run use-npm-ui-frame
```
