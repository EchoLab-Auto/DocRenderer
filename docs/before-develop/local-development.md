---
title: "本地开发与测试"
order: 4
---

# 本地开发与测试

本文档介绍源码安装后的日常开发与测试流程。

## 一、ui-frame 依赖来源切换

默认情况下，`@echolab-auto/ui-frame` 从 npm registry 安装，无需本地构建。

如果需要对 ui-frame 本身进行二次开发，可切换到本地构建模式，从 GitHub 源码构建：

```bash
npm run use-local-ui-frame   # 从 GitHub 源码构建 ui-frame 并切换为 file: 协议
npm install && npm run build
```

切回 npm registry 模式：

```bash
node scripts/switch-ui-frame.js npm
npm install
```

## 二、workspace scripts（无需全局安装）

源码安装后，推荐使用以下方式验证改动：

```bash
# 查看模式 — 启动文档渲染服务器（默认端口 3344）
npm run view -- ./docs

# 编辑模式 — 启动文档编辑服务器
npm run edit -- ./docs

# 指定端口
npm run view -- ./docs --port 8080

# 不自动打开浏览器
npm run view -- ./docs --no-open

# 使用示例文档测试
npm run view -- ./examples/demo/document
```

`npm run view` 和 `npm run edit` 直接调用本地构建产物，无需 link，每次修改代码后重新构建即可生效。

## 三、日常开发循环

```bash
# 修改代码后
npm run build              # 重新构建所有包
npm run view -- ./docs     # 启动查看模式测试
# 浏览器访问 http://localhost:3344 确认页面正常
```

如果只改了某个子包，可以只构建该包以加快速度：

```bash
npm run build --workspace=packages/prodoc-renderer
npm run view -- ./docs
```

## 四、验证清单

修改 UI 相关代码后，至少确认以下项：

- [ ] 页面正常渲染，无白屏或报错
- [ ] 亮色/暗色主题切换正常
- [ ] 左侧文档树可展开、搜索、点击跳转
- [ ] 编辑模式下可修改内容并 Ctrl+S 保存
- [ ] 浏览器控制台无未捕获异常
