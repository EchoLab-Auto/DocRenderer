#!/usr/bin/env node
import e from "path";
import t from "fs/promises";
import { createServer as n } from "vite";
import r from "@vitejs/plugin-vue";
import { createRequire as i } from "module";
import a from "fs";
import { buildDocGraph as o, parseFrameBlock as s, writeFramePosition as c } from "@prodoc/core/pure";
//#region src/server.ts
var l = i(import.meta.url);
function u(t) {
	try {
		let n = l.resolve(`${t}/package.json`);
		return e.dirname(n);
	} catch {
		let n = l.resolve(t), r = e.dirname(n);
		for (; r !== e.dirname(r);) {
			if (a.existsSync(e.join(r, "package.json"))) return r;
			r = e.dirname(r);
		}
		throw Error(`Cannot find package directory for ${t}`);
	}
}
var d = 3344, f = 10 * 1024 * 1024, p = "<!DOCTYPE html>\n<html lang=\"zh-CN\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>ProDoc</title>\n    <style>\n      html, body {\n        margin: 0;\n        padding: 0;\n        height: 100%;\n        overflow: hidden;\n        background: var(--nm-bg-color, #e0e0e0);\n      }\n    </style>\n  </head>\n  <body>\n    <div id=\"app\"></div>\n    <script type=\"module\" src=\"/@prodoc/entry\"><\/script>\n  </body>\n</html>";
async function m(n) {
	let r = {};
	async function i(n, a = "") {
		let o = await t.readdir(n, { withFileTypes: !0 });
		for (let s of o) {
			let o = a ? `${a}/${s.name}` : s.name, c = e.join(n, s.name);
			s.isDirectory() ? await i(c, o) : s.name.endsWith(".md") && (r[o] = await t.readFile(c, "utf-8"));
		}
	}
	return await i(n), r;
}
async function h(n, r) {
	let i = o(r), a = [];
	for (let o of i.boxes) {
		let i = r[o.docPath], { params: l } = s(i), u = typeof l.x == "number" && Number.isFinite(l.x), d = typeof l.y == "number" && Number.isFinite(l.y);
		if (u && d) continue;
		let f = c(i, {
			...!u && { x: o.x },
			...!d && { y: o.y }
		});
		await t.writeFile(e.join(n, o.docPath), f, "utf-8"), r[o.docPath] = f, a.push(o.docPath);
	}
	return a;
}
function g(t) {
	let n = e.join(u(t), "dist", "style.css").replace(/\\/g, "/");
	if (!a.existsSync(n)) throw Error(`CSS file not found for ${t}: ${n}. Please ensure @echolab-auto/ui-frame is installed.`);
	return n;
}
function _() {
	let t = e.join(u("@echolab-auto/ui-frame"), "dist", "index.css").replace(/\\/g, "/");
	return a.existsSync(t) ? t : null;
}
function v(t) {
	let n = u(t), r = e.join(n, "src", "index.ts"), i = e.join(n, "dist", "index.js");
	return process.env.PRODOC_DEV === "1" && a.existsSync(r) ? r.replace(/\\/g, "/") : i.replace(/\\/g, "/");
}
function y() {
	return "async (filePath, content, base) => {\n            try {\n              const res = await fetch('/__prodoc_api/save', {\n                method: 'POST',\n                headers: { 'Content-Type': 'application/json' },\n                body: JSON.stringify({ path: filePath, content, base }),\n              });\n              const data = await res.json();\n              if (data.success) {\n                console.log('[ProDoc] saved:', filePath);\n              } else if (res.status === 409) {\n                console.warn('[ProDoc] save conflict:', filePath, '— 磁盘内容已被修改，本次保存被拒绝；请刷新页面后再操作');\n              } else {\n                console.error('[ProDoc] save failed:', data.error);\n              }\n            } catch (e) {\n              console.error('[ProDoc] save error:', e);\n            }\n          }";
}
function b(t) {
	let n = `{ files: state.files, onSave: ${y()} }`;
	return `
import { createApp, h, reactive } from 'vue';
import uiFrame, { ThemeProvider } from '@echolab-auto/ui-frame';
import { DocGraphViewer } from '@prodoc/renderer';
${[
		`import '${g("@echolab-auto/ui-frame")}';`,
		..._() ? [`import '${_()}';`] : [],
		`import '${e.join(u("@prodoc/renderer"), "dist", "index.css").replace(/\\/g, "/")}'`
	].join("\n")};

const state = reactive({ files: ${JSON.stringify(t)} });

const app = createApp({
  render() {
    return h('div', { style: { height: '100vh', width: '100vw', overflow: 'hidden' } }, [
      h(ThemeProvider, { defaultTheme: 'auto', storageKey: 'prodoc-theme', followSystem: true }, {
        default: () => h(DocGraphViewer, ${n}),
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
async function x(i, a = {}) {
	let o = a.port ?? d;
	console.log(`📂 Loading documents from: ${e.resolve(i)}`);
	let s = await m(i), c = Object.keys(s).length;
	if (c === 0) throw Error(`No .md files found in: ${i}`);
	console.log(`✅ Loaded ${c} document(s)`);
	let l = await h(i, s);
	l.length > 0 && console.log(`📍 Wrote auto-layout coordinates to ${l.length} document(s)`);
	let u = await n({
		root: process.cwd(),
		configFile: !1,
		server: {
			port: o,
			open: a.open ?? !0,
			host: !0
		},
		resolve: { alias: [{
			find: "@prodoc/core",
			replacement: v("@prodoc/core")
		}, {
			find: "@prodoc/renderer",
			replacement: v("@prodoc/renderer")
		}] },
		optimizeDeps: { include: [
			"marked",
			"mermaid",
			"@echolab-auto/ui-frame/doc"
		] },
		plugins: [
			r(),
			{
				name: "prodoc-html",
				configureServer(e) {
					e.middlewares.use((e, t, n) => {
						if (e.url === "/" || e.url === "/index.html") {
							t.setHeader("content-type", "text/html; charset=utf-8"), t.end(p);
							return;
						}
						n();
					});
				}
			},
			{
				name: "prodoc-entry",
				enforce: "pre",
				resolveId(e) {
					if (e === "/@prodoc/entry") return "\0prodoc-entry";
				},
				load(e) {
					if (e === "\0prodoc-entry") return b(s);
				}
			},
			{
				name: "prodoc-docs-watch",
				configureServer(t) {
					let n = e.resolve(i);
					t.watcher.add(n);
					let r = null, a = async () => {
						let e = await m(n), r = await h(n, e);
						s = e, t.ws.send("prodoc:docs-update", s), console.log(`🔄 Documents reloaded (${Object.keys(s).length} file(s)` + (r.length > 0 ? `, wrote coordinates to ${r.length}` : "") + ")");
					}, o = (e) => {
						!e.startsWith(n) || !e.endsWith(".md") || (r && clearTimeout(r), r = setTimeout(() => {
							a().catch((e) => console.error("[ProDoc] reload failed:", e));
						}, 100));
					};
					t.watcher.on("add", o), t.watcher.on("change", o), t.watcher.on("unlink", o);
				}
			},
			{
				name: "prodoc-save-api",
				configureServer(n) {
					n.middlewares.use(async (n, r, a) => {
						if (n.url === "/__prodoc_api/save" && n.method === "POST") {
							try {
								let a = "", o = 0;
								n.on("data", (e) => {
									if (o += e.length, o > f) {
										r.statusCode = 413, r.setHeader("content-type", "application/json"), r.end(JSON.stringify({
											success: !1,
											error: "Payload Too Large"
										}));
										return;
									}
									a += e.toString();
								}), n.on("end", async () => {
									try {
										let { path: n, content: o, base: s } = JSON.parse(a), c = e.resolve(i, n), l = e.resolve(i) + e.sep;
										if (!e.resolve(c).startsWith(l)) {
											r.statusCode = 403, r.setHeader("content-type", "application/json"), r.end(JSON.stringify({
												success: !1,
												error: "Forbidden: path outside doc root"
											}));
											return;
										}
										if (typeof s == "string") {
											let e = null;
											try {
												e = await t.readFile(c, "utf-8");
											} catch {
												e = null;
											}
											if (e !== s) {
												r.statusCode = 409, r.setHeader("content-type", "application/json"), r.end(JSON.stringify({
													success: !1,
													error: "Conflict: file changed on disk"
												}));
												return;
											}
										}
										await t.writeFile(c, o, "utf-8"), r.setHeader("content-type", "application/json"), r.end(JSON.stringify({ success: !0 }));
									} catch (e) {
										r.statusCode = 500, r.setHeader("content-type", "application/json"), r.end(JSON.stringify({
											success: !1,
											error: e.message
										}));
									}
								});
							} catch (e) {
								r.statusCode = 500, r.setHeader("content-type", "application/json"), r.end(JSON.stringify({
									success: !1,
									error: e.message
								}));
							}
							return;
						}
						a();
					});
				}
			}
		]
	});
	await u.listen();
	let g = u.resolvedUrls ?? {
		local: [],
		network: []
	}, _ = g.local[0] ?? `http://localhost:${o}`;
	return console.log("\n🚀 Echo-ProDoc server is running!\n"), console.log(`   Docs:    ${e.resolve(i)}`), console.log(`   Local:   ${_}`), g.network.length > 0 && console.log(`   Network: ${g.network[0]}`), console.log(""), u;
}
//#endregion
//#region src/index.ts
var S = "echo-prodoc", C = "0.1.0";
function w() {
	console.log(`
${S} v${C}

Usage:
  ${S} view <document-path>   Start a rendering server for the document directory
  ${S} --help                 Show this help message
  ${S} --version              Show version

Options:
  --port, -p <number>    Server port (default: 3344)
  --no-open              Do not open browser automatically

Examples:
  ${S} view ./docs
  ${S} view ./docs --port 8080
`);
}
function T(e) {
	let t = e.slice(2), n = {
		open: !0,
		help: !1,
		version: !1
	};
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		r === "--help" || r === "-h" ? n.help = !0 : r === "--version" || r === "-v" ? n.version = !0 : r === "--port" || r === "-p" ? ((e + 1 >= t.length || isNaN(parseInt(t[e + 1], 10))) && (console.error("Error: --port requires a valid number"), process.exit(1)), n.port = parseInt(t[++e], 10)) : r === "--no-open" ? n.open = !1 : r.startsWith("-") || (n.command ? n.docPath ||= r : r === "view" ? n.command = r : r === "edit" ? (console.error("Error: The \"edit\" command has been removed. Browsing and editing are integrated — use \"view\" instead."), process.exit(1)) : (console.error(`Unknown command: ${r}`), process.exit(1)));
	}
	return n;
}
async function E(n) {
	let r = e.resolve(n);
	try {
		if (!(await t.stat(r)).isDirectory()) throw Error(`Path is not a directory: ${r}`);
	} catch (e) {
		throw e.code === "ENOENT" ? Error(`Directory not found: ${r}`) : e;
	}
	return r;
}
async function D() {
	let e = T(process.argv);
	e.help && (w(), process.exit(0)), e.version && (console.log(`${S} v${C}`), process.exit(0)), e.command || (console.error("Error: No command specified. Use \"view\"."), console.error(`\nRun "${S} --help" for usage information.`), process.exit(1)), e.docPath || (console.error("Error: No document path specified."), console.error(`\nRun "${S} --help" for usage information.`), process.exit(1));
	try {
		let t = await x(await E(e.docPath), {
			port: e.port,
			open: e.open
		}), n = () => {
			console.log("\n👋 Shutting down..."), t.close().then(() => {
				process.exit(0);
			});
		};
		process.on("SIGINT", n), process.on("SIGTERM", n);
	} catch (e) {
		console.error(`\n❌ Error: ${e.message}\n`), process.exit(1);
	}
}
D();
//#endregion

//# sourceMappingURL=index.js.map