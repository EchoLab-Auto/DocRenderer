---
title: "安装方式"
order: 3
---

# 安装方式

ProDoc 目前支持以下两种安装方式，文档和 README 中不应出现其他安装方式。

## 一、npm registry 全局安装（推荐终端用户）

发布到 npm 后，直接全局安装：

```bash
npm install -g @echolab-auto/echo-prodoc
```

安装完成后，如果 `echo-prodoc` 命令无法直接运行（通常因为 npm 全局 bin 目录不在 PATH 中），可以使用项目自带的脚本创建系统级软链接：

```bash
sudo -E env "PATH=$PATH" node "$(npm root -g)/@echolab-auto/echo-prodoc/scripts/link-system-bin.js"
```

或者手动将 npm 全局 bin 目录加入 PATH：

```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

之后即可使用：

```bash
echo-prodoc view ./docs
echo-prodoc edit ./docs
```

## 二、源码安装（推荐开发者和贡献者）

从 GitHub clone 仓库后，在本地安装依赖并构建：

```bash
git clone https://github.com/EchoLab-Auto/DocRenderer.git
cd DocRenderer
npm install && npm run build
npm link
echo-prodoc view ./examples/demo/document
# 或本地运行：npm run view -- ./examples/demo/document
```

默认情况下，`@echolab/ui-frame` 从 npm registry 安装（`@echolab-auto/ui-frame`），无需本地构建。

如果需要对 ui-frame 本身进行二次开发，可切换到本地构建模式：

```bash
npm run use-local-ui-frame   # 从 GitHub 源码构建 ui-frame 并切换为 file: 协议
npm install && npm run build
```

切回 npm registry 模式：

```bash
node scripts/switch-ui-frame.js npm
npm install
```

### 开发时本地测试

源码安装后，推荐使用以下方式验证改动：

**workspace scripts（无需全局安装）**

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

**日常开发循环：**

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

**验证清单：**

修改 UI 相关代码后，至少确认以下项：

- [ ] 页面正常渲染，无白屏或报错
- [ ] 亮色/暗色主题切换正常
- [ ] 左侧文档树可展开、搜索、点击跳转
- [ ] 编辑模式下可修改内容并 Ctrl+S 保存
- [ ] 浏览器控制台无未捕获异常

## 三、不支持的安装方式

### `npm install -g echo-prodoc`

`echo-prodoc` **不是**发布到 npm registry 的包名。发布后的包名是作用域包 `@echolab-auto/echo-prodoc`，因此以下命令不可用：

```bash
# 错误，请勿使用
npm install -g echo-prodoc
```

所有面向用户的安装说明都必须使用本节列出的正确方式之一。
