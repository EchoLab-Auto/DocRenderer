/**
 * ProDoc CLI 服务器启动逻辑
 *
 * 使用 Vite 的 createServer API 启动一个本地开发服务器，
 * 通过虚拟模块注入文档内容和运行模式，实现零文件系统依赖。
 */

import { createServer, type ViteDevServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import fsSync from 'fs';
import { buildDocGraph, parseFrameBlock, writeFramePosition } from '@prodoc/core/pure';

const require = createRequire(import.meta.url);

/** 解析 npm 包的根目录 */
function resolvePkgDir(pkgName: string): string {
  try {
    const pkgJsonPath = require.resolve(`${pkgName}/package.json`);
    return path.dirname(pkgJsonPath);
  } catch {
    // fallback: 从入口文件路径向上回溯找到包含 package.json 的目录
    const entryPath = require.resolve(pkgName);
    let dir = path.dirname(entryPath);
    while (dir !== path.dirname(dir)) {
      if (fsSync.existsSync(path.join(dir, 'package.json'))) {
        return dir;
      }
      dir = path.dirname(dir);
    }
    throw new Error(`Cannot find package directory for ${pkgName}`);
  }
}

/** 默认服务器端口 */
const DEFAULT_PORT = 3344;
const MAX_SAVE_BODY_SIZE = 10 * 1024 * 1024; // 10 MB

/** HTML 入口模板 — 完全内联，无需文件系统 */
const INDEX_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ProDoc</title>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
        background: var(--nm-bg-color, #e0e0e0);
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/@prodoc/entry"></script>
  </body>
</html>`;

/** 加载目录中的所有 Markdown 文件 */
async function loadMarkdownFiles(dir: string): Promise<Record<string, string>> {
  const files: Record<string, string> = {};

  async function walk(currentDir: string, relativePrefix = '') {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const relativePath = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath, relativePath);
      } else if (entry.name.endsWith('.md')) {
        files[relativePath] = await fs.readFile(fullPath, 'utf-8');
      }
    }
  }

  await walk(dir);
  return files;
}

/** 将自动布局产生的坐标固化到各 Markdown 文件的框架参数区。 */
async function persistAutoLayout(
  docRoot: string,
  files: Record<string, string>,
): Promise<string[]> {
  const graph = buildDocGraph(files);
  const written: string[] = [];

  for (const box of graph.boxes) {
    const content = files[box.docPath];
    const { params } = parseFrameBlock(content);
    const hasX = typeof params.x === 'number' && Number.isFinite(params.x);
    const hasY = typeof params.y === 'number' && Number.isFinite(params.y);
    if (hasX && hasY) continue;

    const updated = writeFramePosition(content, {
      ...(!hasX && { x: box.x }),
      ...(!hasY && { y: box.y }),
    });
    await fs.writeFile(path.join(docRoot, box.docPath), updated, 'utf-8');
    files[box.docPath] = updated;
    written.push(box.docPath);
  }

  return written;
}

/** 解析 CSS 文件的绝对路径（替换反斜杠为正斜杠） */
function resolveCssPath(pkgName: string): string {
  const cssPath = path.join(resolvePkgDir(pkgName), 'dist', 'style.css').replace(/\\/g, '/');
  if (!fsSync.existsSync(cssPath)) {
    throw new Error(`CSS file not found for ${pkgName}: ${cssPath}. Please ensure @echolab-auto/ui-frame is installed.`);
  }
  return cssPath;
}

/**
 * 解析 ui-frame 文档模块样式（dist/index.css —— doc 子入口独立产物，
 * 含 DocViewer / MarkdownRenderer / DocFlowCanvas 的组件样式；
 * 主样式 style.css 不含 doc 模块，缺失时文档查看器无组件级样式）
 */
function resolveDocCssPath(): string | null {
  const cssPath = path.join(resolvePkgDir('@echolab-auto/ui-frame'), 'dist', 'index.css').replace(/\\/g, '/');
  return fsSync.existsSync(cssPath) ? cssPath : null;
}

/** 解析 ProDoc workspace 包的入口文件 */
function resolveProDocEntry(pkgName: string): string {
  const pkgDir = resolvePkgDir(pkgName);
  // 开发模式可通过 PRODOC_DEV=1 使用源码，默认使用构建产物以确保发布包可用
  const devSrc = path.join(pkgDir, 'src', 'index.ts');
  const distEntry = path.join(pkgDir, 'dist', 'index.js');
  if (process.env.PRODOC_DEV === '1' && fsSync.existsSync(devSrc)) {
    return devSrc.replace(/\\/g, '/');
  }
  return distEntry.replace(/\\/g, '/');
}

/** 构建保存处理函数代码（base 为客户端依据的磁盘内容，服务端据此做冲突检测；
 *  返回结构化结果 {ok, status?, error?}——失败原因交给查看器以 toast 展示；
 *  成功即同步本地基准，后续编辑不必等待热更新推送） */
function buildSaveHandler(): string {
  return `async (filePath, content, base) => {
            try {
              const res = await fetch('/__prodoc_api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: filePath, content, base }),
              });
              const data = await res.json();
              if (data.success) {
                console.log('[ProDoc] saved:', filePath);
                // 乐观同步本地基准：磁盘内容现在就是 content，
                // 后续编辑/保存以它为基准，不再依赖热更新推送的时序
                state.files[filePath] = content;
                return { ok: true };
              }
              return { ok: false, status: res.status, error: data.error };
            } catch (e) {
              return { ok: false, error: String(e) };
            }
          }`;
}

/** 构建删除处理函数代码（与保存 API 同构：路径安全校验 + 可选基准冲突检测；
 *  文件已不存在视为删除目标达成，返回成功） */
function buildDeleteHandler(): string {
  return `async (filePath, base) => {
            try {
              const res = await fetch('/__prodoc_api/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: filePath, base }),
              });
              const data = await res.json();
              if (data.success) {
                console.log('[ProDoc] deleted:', filePath);
                return { ok: true };
              }
              return { ok: false, status: res.status, error: data.error };
            } catch (e) {
              return { ok: false, error: String(e) };
            }
          }`;
}

/** 生成客户端入口代码 */
function generateClientEntry(files: Record<string, string>): string {
  // 文档图模型：DocGraphViewer 直接消费文件映射，
  // 框架参数区解析、图构建、正文剥离都在 @prodoc/core + 组件内完成；
  // 浏览与编辑一体化，内置编辑器通过 saveHandler 走保存 API 写回源文件，
  // 画布节点删除通过 deleteHandler 走删除 API（均携带基准做冲突检测）
  const componentProps = `{ files: state.files, saveHandler: ${buildSaveHandler()}, deleteHandler: ${buildDeleteHandler()} }`;

  // 使用绝对路径导入 CSS，避免 Vite alias 对 CSS 解析问题
  const cssImports = [
    `import '${resolveCssPath('@echolab-auto/ui-frame')}';`,
    // ui-frame doc 子入口样式（DocViewer / MarkdownRenderer / DocFlowCanvas）
    ...(resolveDocCssPath() ? [`import '${resolveDocCssPath()}';`] : []),
    `import '${path.join(resolvePkgDir('@prodoc/renderer'), 'dist', 'index.css').replace(/\\/g, '/')}'`,
  ];

  return `
import { createApp, h, reactive } from 'vue';
import uiFrame, { ThemeProvider } from '@echolab-auto/ui-frame';
import { DocGraphViewer } from '@prodoc/renderer';
${cssImports.join('\n')};

const state = reactive({ files: ${JSON.stringify(files)} });

const app = createApp({
  render() {
    return h('div', { style: { height: '100vh', width: '100vw', overflow: 'hidden' } }, [
      h(ThemeProvider, { defaultTheme: 'auto', storageKey: 'prodoc-theme', followSystem: true }, {
        default: () => h(DocGraphViewer, ${componentProps}),
      }),
    ]);
  },
});

app.use(uiFrame, {
  button: { size: 'medium' },
  input: { size: 'medium' },
  select: { size: 'medium', clearable: true },
  modal: { maskClosable: true },
  toast: { position: 'top-right', maxCount: 5 },
  pagination: { showTotal: false },
});
app.mount('#app');

// 文档热更新 —— 服务器通过 WS 推送最新文件映射，原地替换 state.files
// （不刷新页面，保留画布平移/缩放与当前打开的文档）
if (import.meta.hot) {
  import.meta.hot.on('prodoc:docs-update', (updated) => {
    state.files = updated;
  });
}
`;
}

/** 启动 ProDoc 服务器 */
export async function startProDocServer(
  docRoot: string,
  options: { port?: number; open?: boolean } = {}
): Promise<ViteDevServer> {
  const port = options.port ?? DEFAULT_PORT;

  // 1. 加载文档文件（会被目录监听的热更新重新赋值）
  console.log(`📂 Loading documents from: ${path.resolve(docRoot)}`);
  let files = await loadMarkdownFiles(docRoot);
  const fileCount = Object.keys(files).length;
  if (fileCount === 0) {
    throw new Error(`No .md files found in: ${docRoot}`);
  }
  console.log(`✅ Loaded ${fileCount} document(s)`);

  const positionedFiles = await persistAutoLayout(docRoot, files);
  if (positionedFiles.length > 0) {
    console.log(`📍 Wrote auto-layout coordinates to ${positionedFiles.length} document(s)`);
  }

  // 2. 创建 Vite 服务器
  // root 为调用者的 cwd（文档目录所在地），但全部框架依赖（vue/marked/mermaid/
  // ui-frame）都必须以 CLI 包自身为基准解析——否则在不含 node_modules 的目录
  // （如任意项目根）运行时依赖无法解析；文件监听也需忽略 cwd 下的重型目录，
  // 避免在大型项目中耗尽 inotify 上限
  const cliPkgDir = resolvePkgDir('@prodoc/cli');
  /** 以 CLI 包为基准解析依赖入口（与 cwd 无关；优先 import 条件——
      ui-frame 的 ./doc 等子路径仅声明 import 导出，require 解析会失败） */
  const resolveDep = (pkgName: string): string => {
    try {
      return fileURLToPath(import.meta.resolve(pkgName)).replace(/\\/g, '/');
    } catch {
      return require.resolve(pkgName).replace(/\\/g, '/');
    }
  };

  const server = await createServer({
    root: process.cwd(),
    configFile: false,
    // 依赖优化缓存写入 CLI 包内（cwd 可能是只读或无关项目目录）
    cacheDir: path.join(cliPkgDir, 'node_modules', '.vite'),
    server: {
      port,
      open: options.open ?? true,
      host: true,
      // 客户端要加载的 CSS/依赖入口在 CLI/ui-frame/renderer 包目录内（可能在 cwd 之外）
      fs: {
        allow: [
          process.cwd(),
          cliPkgDir,
          resolvePkgDir('@prodoc/renderer'),
          resolvePkgDir('@echolab-auto/ui-frame'),
        ],
      },
      watch: {
        // vite 默认监听整个 root（cwd）；忽略常见重型/产物目录，
        // 文档目录本身由 prodoc-docs-watch 插件显式监听（不受此忽略影响）
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/target/**',
          '**/dist/**',
          '**/build/**',
          '**/.cache/**',
        ],
      },
    },
    resolve: {
      alias: [
        { find: /^@prodoc\/core$/, replacement: resolveProDocEntry('@prodoc/core') },
        { find: /^@prodoc\/renderer$/, replacement: resolveProDocEntry('@prodoc/renderer') },
        // vue 必须显式指向浏览器 ESM 入口：import.meta.resolve 会命中
        // node 条件导出（index.mjs，SSR 构建），缺失部分浏览器运行时导出
        { find: /^vue$/, replacement: path.join(resolvePkgDir('vue'), 'dist', 'vue.runtime.esm-bundler.js').replace(/\\/g, '/') },
        { find: /^marked$/, replacement: resolveDep('marked') },
        { find: /^mermaid$/, replacement: resolveDep('mermaid') },
        { find: /^dompurify$/, replacement: resolveDep('dompurify') },
        { find: /^@echolab-auto\/ui-frame\/doc$/, replacement: resolveDep('@echolab-auto/ui-frame/doc') },
        { find: /^@echolab-auto\/ui-frame$/, replacement: resolveDep('@echolab-auto/ui-frame') },
        // ui-frame 的子路径导入（如 dist/style.css）按包目录前缀解析
        { find: '@echolab-auto/ui-frame', replacement: resolvePkgDir('@echolab-auto/ui-frame') },
      ],
    },
    optimizeDeps: {
      // 关闭入口扫描：root 是调用者的 cwd，若恰好是另一个 vite 项目
      // （如 ui-frame 仓库），默认扫描会爬进它的源码并因其自有路径别名
      // （如 @/…）解析失败而报噪音错误。所需依赖已由 include 显式声明。
      entries: [],
      include: ['marked', 'mermaid', '@echolab-auto/ui-frame/doc'],
    },
    plugins: [
      vue(),

      // 插件：提供 HTML 入口
      {
        name: 'prodoc-html',
        configureServer(s) {
          s.middlewares.use((req, res, next) => {
            if (req.url === '/' || req.url === '/index.html') {
              res.setHeader('content-type', 'text/html; charset=utf-8');
              res.end(INDEX_HTML);
              return;
            }
            next();
          });
        },
      },

      // 插件：提供客户端入口代码
      {
        name: 'prodoc-entry',
        enforce: 'pre',
        resolveId(id) {
          if (id === '/@prodoc/entry') return '\0prodoc-entry';
        },
        load(id) {
          if (id === '\0prodoc-entry') {
            return generateClientEntry(files);
          }
        },
      },

      // 插件：监听文档目录，变更时重载并通过 WS 推送最新文件映射
      //（persistAutoLayout 自身的坐标写回会再次触发 change，但二次重载
      //  不再产生写入，推送内容与上次一致，不会形成循环）
      {
        name: 'prodoc-docs-watch',
        configureServer(s: ViteDevServer) {
          const resolvedRoot = path.resolve(docRoot);
          s.watcher.add(resolvedRoot);

          let timer: ReturnType<typeof setTimeout> | null = null;
          const reload = async () => {
            const updated = await loadMarkdownFiles(resolvedRoot);
            const positioned = await persistAutoLayout(resolvedRoot, updated);
            files = updated;
            s.ws.send('prodoc:docs-update', files);
            console.log(
              `🔄 Documents reloaded (${Object.keys(files).length} file(s)` +
              (positioned.length > 0 ? `, wrote coordinates to ${positioned.length}` : '') +
              ')',
            );
          };
          const onDocEvent = (file: string) => {
            if (!file.startsWith(resolvedRoot) || !file.endsWith('.md')) return;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
              reload().catch((err) => console.error('[ProDoc] reload failed:', err));
            }, 100);
          };
          s.watcher.on('add', onDocEvent);
          s.watcher.on('change', onDocEvent);
          s.watcher.on('unlink', onDocEvent);
        },
      },

      // 插件：保存/删除 API（内置编辑器、画布编辑与节点删除共用）
      {
        name: 'prodoc-save-api',
        configureServer(s: ViteDevServer) {
          s.middlewares.use(async (req, res, next) => {
            if (req.url === '/__prodoc_api/delete' && req.method === 'POST') {
              try {
                let body = '';
                req.on('data', (chunk: Buffer) => {
                  body += chunk.toString();
                });
                req.on('end', async () => {
                  try {
                    const { path: filePath, base } = JSON.parse(body);
                    const fullPath = path.resolve(docRoot, filePath);
                    // 安全检查：确保文件在 docRoot 内（与保存 API 同一规则）
                    const resolvedDocRoot = path.resolve(docRoot) + path.sep;
                    const resolvedTarget = path.resolve(fullPath);
                    if (!resolvedTarget.startsWith(resolvedDocRoot)) {
                      res.statusCode = 403;
                      res.setHeader('content-type', 'application/json');
                      res.end(JSON.stringify({ success: false, error: 'Forbidden: path outside doc root' }));
                      return;
                    }
                    // 冲突检测：客户端声明了基准内容时，磁盘已偏离则拒绝删除
                    if (typeof base === 'string') {
                      let current: string | null = null;
                      try {
                        current = await fs.readFile(fullPath, 'utf-8');
                      } catch {
                        current = null;
                      }
                      if (current !== base) {
                        res.statusCode = 409;
                        res.setHeader('content-type', 'application/json');
                        res.end(JSON.stringify({ success: false, error: 'Conflict: file changed on disk' }));
                        return;
                      }
                    }
                    try {
                      await fs.unlink(fullPath);
                    } catch (err: any) {
                      // 文件本就不存在：删除目标已达成，视为成功
                      if (err.code !== 'ENOENT') throw err;
                    }
                    res.setHeader('content-type', 'application/json');
                    res.end(JSON.stringify({ success: true }));
                  } catch (err: any) {
                    res.statusCode = 500;
                    res.setHeader('content-type', 'application/json');
                    res.end(JSON.stringify({ success: false, error: err.message }));
                  }
                });
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('content-type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
              return;
            }
            if (req.url === '/__prodoc_api/save' && req.method === 'POST') {
              try {
                let body = '';
                let bodySize = 0;
                req.on('data', (chunk: Buffer) => {
                  bodySize += chunk.length;
                  if (bodySize > MAX_SAVE_BODY_SIZE) {
                    res.statusCode = 413;
                    res.setHeader('content-type', 'application/json');
                    res.end(JSON.stringify({ success: false, error: 'Payload Too Large' }));
                    return;
                  }
                  body += chunk.toString();
                });
                req.on('end', async () => {
                  try {
                    const { path: filePath, content, base } = JSON.parse(body);
                    const fullPath = path.resolve(docRoot, filePath);
                    // 安全检查：确保文件在 docRoot 内
                    const resolvedDocRoot = path.resolve(docRoot) + path.sep;
                    const resolvedTarget = path.resolve(fullPath);
                    if (!resolvedTarget.startsWith(resolvedDocRoot)) {
                      res.statusCode = 403;
                      res.setHeader('content-type', 'application/json');
                      res.end(JSON.stringify({ success: false, error: 'Forbidden: path outside doc root' }));
                      return;
                    }
                    // 冲突检测：客户端声明了基准内容时，磁盘已偏离则拒绝写入
                    //（过期页面/标签页的保存不会覆盖他人的修改）
                    if (typeof base === 'string') {
                      let current: string | null = null;
                      try {
                        current = await fs.readFile(fullPath, 'utf-8');
                      } catch {
                        current = null;
                      }
                      if (current !== base) {
                        res.statusCode = 409;
                        res.setHeader('content-type', 'application/json');
                        res.end(JSON.stringify({ success: false, error: 'Conflict: file changed on disk' }));
                        return;
                      }
                    }
                    await fs.writeFile(fullPath, content, 'utf-8');
                    res.setHeader('content-type', 'application/json');
                    res.end(JSON.stringify({ success: true }));
                  } catch (err: any) {
                    res.statusCode = 500;
                    res.setHeader('content-type', 'application/json');
                    res.end(JSON.stringify({ success: false, error: err.message }));
                  }
                });
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('content-type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
              return;
            }
            next();
          });
        },
      } as any,
    ],
  });

  // 3. 启动服务器
  await server.listen();

  const addresses = server.resolvedUrls ?? { local: [], network: [] };
  const localUrl = addresses.local[0] ?? `http://localhost:${port}`;

  console.log('\n🚀 Echo-ProDoc server is running!\n');
  console.log(`   Docs:    ${path.resolve(docRoot)}`);
  console.log(`   Local:   ${localUrl}`);
  if (addresses.network.length > 0) {
    console.log(`   Network: ${addresses.network[0]}`);
  }
  console.log('');

  return server;
}
