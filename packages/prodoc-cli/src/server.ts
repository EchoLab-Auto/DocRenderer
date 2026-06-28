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
import fsSync from 'fs';

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

/** 解析 CSS 文件的绝对路径（替换反斜杠为正斜杠） */
function resolveCssPath(pkgName: string): string {
  const cssPath = path.join(resolvePkgDir(pkgName), 'dist', 'style.css').replace(/\\/g, '/');
  if (!fsSync.existsSync(cssPath)) {
    throw new Error(`CSS file not found for ${pkgName}: ${cssPath}. Please ensure @echolab-auto/ui-frame is installed.`);
  }
  return cssPath;
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

/** 构建保存处理函数代码 */
function buildSaveHandler(): string {
  return `async (filePath, content) => {
            try {
              const res = await fetch('/__prodoc_api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: filePath, content }),
              });
              const data = await res.json();
              if (data.success) {
                console.log('[ProDoc] saved:', filePath);
              } else {
                console.error('[ProDoc] save failed:', data.error);
              }
            } catch (e) {
              console.error('[ProDoc] save error:', e);
            }
          }`;
}

/** 生成客户端入口代码 */
function generateClientEntry(mode: 'view' | 'edit', files: Record<string, string>): string {
  const componentName = mode === 'view' ? 'DocViewer' : 'DocEditor';
  const componentImport = `import { ${componentName} } from '@prodoc/${mode === 'view' ? 'renderer' : 'editor'}';`;

  // 使用绝对路径导入 CSS，避免 Vite alias 对 CSS 解析问题
  const cssImports = [
    `import '${resolveCssPath('@echolab-auto/ui-frame')}';`,
    `import '${path.join(resolvePkgDir('@prodoc/renderer'), 'dist', 'index.css').replace(/\\/g, '/')}'`,
  ];
  if (mode === 'edit') {
    cssImports.push(`import '${path.join(resolvePkgDir('@prodoc/editor'), 'dist', 'index.css').replace(/\\/g, '/')}'`);
  }

  const eventProps = [
    'onDocLink: (p) => { console.log(\'[ProDoc] navigate to:\', p); history.replaceState(null, \'\', \'#\' + p); }',
  ];
  if (mode === 'edit') {
    eventProps.push(`onSave: ${buildSaveHandler()}`);
  }

  return `
import { createApp, h } from 'vue';
import uiFrame, { ThemeProvider } from '@echolab-auto/ui-frame';
import { buildDocTree } from '@prodoc/core';
${componentImport}
${cssImports.join('\n')};

const files = ${JSON.stringify(files)};
const docRoot = buildDocTree(files);
const initialPath = window.location.hash ? window.location.hash.slice(1) : undefined;

const app = createApp({
  render() {
    return h('div', { style: { height: '100vh', width: '100vw', overflow: 'hidden' } }, [
      h(ThemeProvider, { defaultTheme: 'auto', storageKey: 'prodoc-theme', followSystem: true }, {
        default: () => h(${componentName}, {
          root: docRoot,
          initialPath,
          ${eventProps.join(',\n          ')},
        }),
      }),
    ]);
  },
});

app.use(uiFrame);
app.mount('#app');
`;
}

/** 启动 ProDoc 服务器 */
export async function startProDocServer(
  mode: 'view' | 'edit',
  docRoot: string,
  options: { port?: number; open?: boolean } = {}
): Promise<ViteDevServer> {
  const port = options.port ?? DEFAULT_PORT;

  // 1. 加载文档文件
  console.log(`📂 Loading documents from: ${path.resolve(docRoot)}`);
  const files = await loadMarkdownFiles(docRoot);
  const fileCount = Object.keys(files).length;
  if (fileCount === 0) {
    throw new Error(`No .md files found in: ${docRoot}`);
  }
  console.log(`✅ Loaded ${fileCount} document(s)`);

  // 2. 创建 Vite 服务器
  const server = await createServer({
    root: process.cwd(),
    configFile: false,
    server: {
      port,
      open: options.open ?? true,
      host: true,
    },
    resolve: {
      alias: [
        { find: '@prodoc/core', replacement: resolveProDocEntry('@prodoc/core') },
        { find: '@prodoc/renderer', replacement: resolveProDocEntry('@prodoc/renderer') },
        { find: '@prodoc/editor', replacement: resolveProDocEntry('@prodoc/editor') },
      ],
    },
    optimizeDeps: {
      include: ['marked'],
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
            return generateClientEntry(mode, files);
          }
        },
      },

      // 插件：edit 模式下提供保存 API
      ...(mode === 'edit'
        ? [
            {
              name: 'prodoc-save-api',
              configureServer(s: ViteDevServer) {
                s.middlewares.use(async (req, res, next) => {
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
                          const { path: filePath, content } = JSON.parse(body);
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
          ]
        : []),
    ],
  });

  // 3. 启动服务器
  await server.listen();

  const addresses = server.resolvedUrls ?? { local: [], network: [] };
  const localUrl = addresses.local[0] ?? `http://localhost:${port}`;

  console.log('\n🚀 Echo-ProDoc server is running!\n');
  console.log(`   Mode:    ${mode === 'view' ? '👁  View' : '✏️  Edit'}`);
  console.log(`   Docs:    ${path.resolve(docRoot)}`);
  console.log(`   Local:   ${localUrl}`);
  if (addresses.network.length > 0) {
    console.log(`   Network: ${addresses.network[0]}`);
  }
  console.log('');

  if (mode === 'edit') {
    console.log('   Press Ctrl+S in the editor to save changes.\n');
  }

  return server;
}
