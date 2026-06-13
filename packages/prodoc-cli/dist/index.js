#!/usr/bin/env node
import n from "path";
import g from "fs/promises";
import { createServer as T } from "vite";
import E from "@vitejs/plugin-vue";
import { createRequire as j } from "module";
import N from "fs";
const $ = j(import.meta.url);
function h(o) {
  try {
    const r = $.resolve(`${o}/package.json`);
    return n.dirname(r);
  } catch {
    const r = $.resolve(o);
    let e = n.dirname(r);
    for (; e !== n.dirname(e); ) {
      if (N.existsSync(n.join(e, "package.json")))
        return e;
      e = n.dirname(e);
    }
    throw new Error(`Cannot find package directory for ${o}`);
  }
}
const x = 3344, O = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ProDoc</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/@prodoc/entry"><\/script>
  </body>
</html>`;
async function b(o) {
  const r = {};
  async function e(s, t = "") {
    const l = await g.readdir(s, { withFileTypes: !0 });
    for (const a of l) {
      const f = t ? `${t}/${a.name}` : a.name, m = n.join(s, a.name);
      a.isDirectory() ? await e(m, f) : a.name.endsWith(".md") && (r[f] = await g.readFile(m, "utf-8"));
    }
  }
  return await e(o), r;
}
function k(o) {
  return n.join(h(o), "dist", "style.css").replace(/\\/g, "/");
}
function C() {
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
function F(o, r) {
  const e = o === "view" ? "DocViewer" : "DocEditor", s = `import { ${e} } from '@prodoc/${o === "view" ? "renderer" : "editor"}';`, t = [
    `import '${k("@echolab/ui-frame")}';`,
    `import '${n.join(h("@prodoc/renderer"), "dist", "index.css").replace(/\\/g, "/")}'`
  ];
  o === "edit" && t.push(`import '${n.join(h("@prodoc/editor"), "dist", "index.css").replace(/\\/g, "/")}'`);
  const l = [
    "onDocLink: (p) => console.log('[ProDoc] navigate to:', p)"
  ];
  return o === "edit" && l.push(`onSave: ${C()}`), `
import { createApp, h } from 'vue';
import uiFrame, { ThemeProvider } from '@echolab/ui-frame';
import { buildDocTree } from '@prodoc/core';
${s}
${t.join(`
`)};

const files = ${JSON.stringify(r)};
const docTree = buildDocTree(files);

const app = createApp({
  render() {
    return h('div', { style: { height: '100vh', width: '100vw' } }, [
      h(ThemeProvider, { defaultTheme: 'auto', storageKey: 'prodoc-theme', followSystem: true }, {
        default: () => h(${e}, {
          root: docTree,
          ${l.join(`,
          `)},
        }),
      }),
    ]);
  },
});

app.use(uiFrame);
app.mount('#app');
`;
}
async function _(o, r, e = {}) {
  const s = e.port ?? x;
  console.log(`📂 Loading documents from: ${n.resolve(r)}`);
  const t = await b(r), l = Object.keys(t).length;
  if (l === 0)
    throw new Error(`No .md files found in: ${r}`);
  console.log(`✅ Loaded ${l} document(s)`);
  const a = await T({
    root: process.cwd(),
    configFile: !1,
    server: {
      port: s,
      open: e.open ?? !0,
      host: !0
    },
    resolve: {
      alias: [
        { find: "@prodoc/core", replacement: n.join(h("@prodoc/core"), "src", "index.ts").replace(/\\/g, "/") },
        { find: "@prodoc/renderer", replacement: n.join(h("@prodoc/renderer"), "src", "index.ts").replace(/\\/g, "/") },
        { find: "@prodoc/editor", replacement: n.join(h("@prodoc/editor"), "src", "index.ts").replace(/\\/g, "/") }
      ]
    },
    optimizeDeps: {
      include: ["marked"]
    },
    plugins: [
      E(),
      // 插件：提供 HTML 入口
      {
        name: "prodoc-html",
        configureServer(d) {
          d.middlewares.use((p, i, w) => {
            if (p.url === "/" || p.url === "/index.html") {
              i.setHeader("content-type", "text/html; charset=utf-8"), i.end(O);
              return;
            }
            w();
          });
        }
      },
      // 插件：提供客户端入口代码
      {
        name: "prodoc-entry",
        enforce: "pre",
        resolveId(d) {
          if (d === "/@prodoc/entry") return "\0prodoc-entry";
        },
        load(d) {
          if (d === "\0prodoc-entry")
            return F(o, t);
        }
      },
      // 插件：edit 模式下提供保存 API
      ...o === "edit" ? [
        {
          name: "prodoc-save-api",
          configureServer(d) {
            d.middlewares.use(async (p, i, w) => {
              if (p.url === "/__prodoc_api/save" && p.method === "POST") {
                try {
                  let v = "";
                  p.on("data", (u) => v += u.toString()), p.on("end", async () => {
                    try {
                      const { path: u, content: S } = JSON.parse(v), y = n.resolve(r, u), D = n.resolve(r);
                      if (!n.resolve(y).startsWith(D)) {
                        i.statusCode = 403, i.setHeader("content-type", "application/json"), i.end(JSON.stringify({ success: !1, error: "Forbidden: path outside doc root" }));
                        return;
                      }
                      await g.writeFile(y, S, "utf-8"), i.setHeader("content-type", "application/json"), i.end(JSON.stringify({ success: !0 }));
                    } catch (u) {
                      i.statusCode = 500, i.setHeader("content-type", "application/json"), i.end(JSON.stringify({ success: !1, error: u.message }));
                    }
                  });
                } catch (v) {
                  i.statusCode = 500, i.setHeader("content-type", "application/json"), i.end(JSON.stringify({ success: !1, error: v.message }));
                }
                return;
              }
              w();
            });
          }
        }
      ] : []
    ]
  });
  await a.listen();
  const f = a.resolvedUrls ?? { local: [], network: [] }, m = f.local[0] ?? `http://localhost:${s}`;
  return console.log(`
🚀 Echo-ProDoc server is running!
`), console.log(`   Mode:    ${o === "view" ? "👁  View" : "✏️  Edit"}`), console.log(`   Docs:    ${n.resolve(r)}`), console.log(`   Local:   ${m}`), f.network.length > 0 && console.log(`   Network: ${f.network[0]}`), console.log(""), o === "edit" && console.log(`   Press Ctrl+S in the editor to save changes.
`), a;
}
const c = "echo-prodoc", P = "0.1.0";
function I() {
  console.log(`
${c} v${P}

Usage:
  ${c} view <document-path>   Start a rendering server for the document directory
  ${c} edit <document-path>   Start an editing server for the document directory
  ${c} --help                 Show this help message
  ${c} --version              Show version

Options:
  --port, -p <number>    Server port (default: 3344)
  --no-open              Do not open browser automatically

Examples:
  ${c} view ./docs
  ${c} edit ./docs --port 8080
`);
}
function H(o) {
  const r = o.slice(2), e = { open: !0, help: !1, version: !1 };
  for (let s = 0; s < r.length; s++) {
    const t = r[s];
    t === "--help" || t === "-h" ? e.help = !0 : t === "--version" || t === "-v" ? e.version = !0 : t === "--port" || t === "-p" ? e.port = parseInt(r[++s], 10) : t === "--no-open" ? e.open = !1 : t.startsWith("-") || (e.command ? e.docPath || (e.docPath = t) : t === "view" || t === "edit" ? e.command = t : (console.error(`Unknown command: ${t}`), process.exit(1)));
  }
  return e;
}
async function J(o) {
  const r = n.resolve(o);
  try {
    if (!(await g.stat(r)).isDirectory())
      throw new Error(`Path is not a directory: ${r}`);
  } catch (e) {
    throw e.code === "ENOENT" ? new Error(`Directory not found: ${r}`) : e;
  }
  return r;
}
async function U() {
  const o = H(process.argv);
  o.help && (I(), process.exit(0)), o.version && (console.log(`${c} v${P}`), process.exit(0)), o.command || (console.error('Error: No command specified. Use "view" or "edit".'), console.error(`
Run "${c} --help" for usage information.`), process.exit(1)), o.docPath || (console.error("Error: No document path specified."), console.error(`
Run "${c} --help" for usage information.`), process.exit(1));
  try {
    const r = await J(o.docPath), e = await _(o.command, r, {
      port: o.port,
      open: o.open
    }), s = () => {
      console.log(`
👋 Shutting down...`), e.close().then(() => {
        process.exit(0);
      });
    };
    process.on("SIGINT", s), process.on("SIGTERM", s);
  } catch (r) {
    console.error(`
❌ Error: ${r.message}
`), process.exit(1);
  }
}
U();
//# sourceMappingURL=index.js.map
