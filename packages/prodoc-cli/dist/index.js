#!/usr/bin/env node
import e from "path";
import t from "fs/promises";
import n from "fs";
import { fileURLToPath as r } from "url";
import { createServer as i } from "vite";
import a from "@vitejs/plugin-vue";
import { createRequire as o } from "module";
import { buildDocGraph as s, parseFrameBlock as c, writeFramePosition as l } from "@prodoc/core/pure";
//#region src/server.ts
var u = o(import.meta.url);
function d(t) {
	try {
		let n = u.resolve(`${t}/package.json`);
		return e.dirname(n);
	} catch {
		let r = u.resolve(t), i = e.dirname(r);
		for (; i !== e.dirname(i);) {
			if (n.existsSync(e.join(i, "package.json"))) return i;
			i = e.dirname(i);
		}
		throw Error(`Cannot find package directory for ${t}`);
	}
}
var f = 3344, p = 10 * 1024 * 1024, m = "<!DOCTYPE html>\n<html lang=\"zh-CN\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>ProDoc</title>\n    <style>\n      html, body {\n        margin: 0;\n        padding: 0;\n        height: 100%;\n        overflow: hidden;\n        background: var(--nm-bg-color, #e0e0e0);\n      }\n    </style>\n  </head>\n  <body>\n    <div id=\"app\"></div>\n    <script type=\"module\" src=\"/@prodoc/entry\"><\/script>\n  </body>\n</html>";
async function h(n) {
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
async function g(n, r) {
	let i = s(r), a = [];
	for (let o of i.boxes) {
		let i = r[o.docPath], { params: s } = c(i), u = typeof s.x == "number" && Number.isFinite(s.x), d = typeof s.y == "number" && Number.isFinite(s.y);
		if (u && d) continue;
		let f = l(i, {
			...!u && { x: o.x },
			...!d && { y: o.y }
		});
		await t.writeFile(e.join(n, o.docPath), f, "utf-8"), r[o.docPath] = f, a.push(o.docPath);
	}
	return a;
}
function _(t) {
	let r = e.join(d(t), "dist", "style.css").replace(/\\/g, "/");
	if (!n.existsSync(r)) throw Error(`CSS file not found for ${t}: ${r}. Please ensure @echolab-auto/ui-frame is installed.`);
	return r;
}
function v() {
	let t = e.join(d("@echolab-auto/ui-frame"), "dist", "index.css").replace(/\\/g, "/");
	return n.existsSync(t) ? t : null;
}
function y(t) {
	let r = d(t), i = e.join(r, "src", "index.ts"), a = e.join(r, "dist", "index.js");
	return process.env.PRODOC_DEV === "1" && n.existsSync(i) ? i.replace(/\\/g, "/") : a.replace(/\\/g, "/");
}
function b() {
	return "async (filePath, content, base) => {\n            try {\n              const res = await fetch('/__prodoc_api/save', {\n                method: 'POST',\n                headers: { 'Content-Type': 'application/json' },\n                body: JSON.stringify({ path: filePath, content, base }),\n              });\n              const data = await res.json();\n              if (data.success) {\n                console.log('[ProDoc] saved:', filePath);\n                // 乐观同步本地基准：磁盘内容现在就是 content，\n                // 后续编辑/保存以它为基准，不再依赖热更新推送的时序\n                state.files[filePath] = content;\n                return { ok: true };\n              }\n              return { ok: false, status: res.status, error: data.error };\n            } catch (e) {\n              return { ok: false, error: String(e) };\n            }\n          }";
}
function x() {
	return "async (filePath, base) => {\n            try {\n              const res = await fetch('/__prodoc_api/delete', {\n                method: 'POST',\n                headers: { 'Content-Type': 'application/json' },\n                body: JSON.stringify({ path: filePath, base }),\n              });\n              const data = await res.json();\n              if (data.success) {\n                console.log('[ProDoc] deleted:', filePath);\n                return { ok: true };\n              }\n              return { ok: false, status: res.status, error: data.error };\n            } catch (e) {\n              return { ok: false, error: String(e) };\n            }\n          }";
}
function S(t) {
	let n = `{ files: state.files, saveHandler: ${b()}, deleteHandler: ${x()} }`;
	return `
import { createApp, h, reactive } from 'vue';
import uiFrame, { ThemeProvider } from '@echolab-auto/ui-frame';
import { DocGraphViewer } from '@prodoc/renderer';
${[
		`import '${_("@echolab-auto/ui-frame")}';`,
		...v() ? [`import '${v()}';`] : [],
		`import '${e.join(d("@prodoc/renderer"), "dist", "index.css").replace(/\\/g, "/")}'`
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
async function C(n, o = {}) {
	let s = o.port ?? f;
	console.log(`📂 Loading documents from: ${e.resolve(n)}`);
	let c = await h(n), l = Object.keys(c).length;
	if (l === 0) throw Error(`No .md files found in: ${n}`);
	console.log(`✅ Loaded ${l} document(s)`);
	let _ = await g(n, c);
	_.length > 0 && console.log(`📍 Wrote auto-layout coordinates to ${_.length} document(s)`);
	let v = d("@prodoc/cli"), b = (e) => {
		try {
			return r(import.meta.resolve(e)).replace(/\\/g, "/");
		} catch {
			return u.resolve(e).replace(/\\/g, "/");
		}
	}, x = await i({
		root: process.cwd(),
		configFile: !1,
		cacheDir: e.join(v, "node_modules", ".vite"),
		server: {
			port: s,
			open: o.open ?? !0,
			host: !0,
			fs: { allow: [
				process.cwd(),
				v,
				d("@prodoc/renderer"),
				d("@echolab-auto/ui-frame")
			] },
			watch: { ignored: [
				"**/node_modules/**",
				"**/.git/**",
				"**/target/**",
				"**/dist/**",
				"**/build/**",
				"**/.cache/**"
			] }
		},
		resolve: { alias: [
			{
				find: /^@prodoc\/core$/,
				replacement: y("@prodoc/core")
			},
			{
				find: /^@prodoc\/renderer$/,
				replacement: y("@prodoc/renderer")
			},
			{
				find: /^vue$/,
				replacement: e.join(d("vue"), "dist", "vue.runtime.esm-bundler.js").replace(/\\/g, "/")
			},
			{
				find: /^marked$/,
				replacement: b("marked")
			},
			{
				find: /^mermaid$/,
				replacement: b("mermaid")
			},
			{
				find: /^dompurify$/,
				replacement: b("dompurify")
			},
			{
				find: /^@echolab-auto\/ui-frame\/doc$/,
				replacement: b("@echolab-auto/ui-frame/doc")
			},
			{
				find: /^@echolab-auto\/ui-frame$/,
				replacement: b("@echolab-auto/ui-frame")
			},
			{
				find: "@echolab-auto/ui-frame",
				replacement: d("@echolab-auto/ui-frame")
			}
		] },
		optimizeDeps: {
			entries: [],
			include: [
				"marked",
				"mermaid",
				"@echolab-auto/ui-frame/doc"
			]
		},
		plugins: [
			a(),
			{
				name: "prodoc-html",
				configureServer(e) {
					e.middlewares.use((e, t, n) => {
						if (e.url === "/" || e.url === "/index.html") {
							t.setHeader("content-type", "text/html; charset=utf-8"), t.end(m);
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
					if (e === "\0prodoc-entry") return S(c);
				}
			},
			{
				name: "prodoc-docs-watch",
				configureServer(t) {
					let r = e.resolve(n);
					t.watcher.add(r);
					let i = null, a = async () => {
						let e = await h(r), n = await g(r, e);
						c = e, t.ws.send("prodoc:docs-update", c), console.log(`🔄 Documents reloaded (${Object.keys(c).length} file(s)` + (n.length > 0 ? `, wrote coordinates to ${n.length}` : "") + ")");
					}, o = (e) => {
						!e.startsWith(r) || !e.endsWith(".md") || (i && clearTimeout(i), i = setTimeout(() => {
							a().catch((e) => console.error("[ProDoc] reload failed:", e));
						}, 100));
					};
					t.watcher.on("add", o), t.watcher.on("change", o), t.watcher.on("unlink", o);
				}
			},
			{
				name: "prodoc-save-api",
				configureServer(r) {
					r.middlewares.use(async (r, i, a) => {
						if (r.url === "/__prodoc_api/delete" && r.method === "POST") {
							try {
								let a = "";
								r.on("data", (e) => {
									a += e.toString();
								}), r.on("end", async () => {
									try {
										let { path: r, base: o } = JSON.parse(a), s = e.resolve(n, r), c = e.resolve(n) + e.sep;
										if (!e.resolve(s).startsWith(c)) {
											i.statusCode = 403, i.setHeader("content-type", "application/json"), i.end(JSON.stringify({
												success: !1,
												error: "Forbidden: path outside doc root"
											}));
											return;
										}
										if (typeof o == "string") {
											let e = null;
											try {
												e = await t.readFile(s, "utf-8");
											} catch {
												e = null;
											}
											if (e !== o) {
												i.statusCode = 409, i.setHeader("content-type", "application/json"), i.end(JSON.stringify({
													success: !1,
													error: "Conflict: file changed on disk"
												}));
												return;
											}
										}
										try {
											await t.unlink(s);
										} catch (e) {
											if (e.code !== "ENOENT") throw e;
										}
										i.setHeader("content-type", "application/json"), i.end(JSON.stringify({ success: !0 }));
									} catch (e) {
										i.statusCode = 500, i.setHeader("content-type", "application/json"), i.end(JSON.stringify({
											success: !1,
											error: e.message
										}));
									}
								});
							} catch (e) {
								i.statusCode = 500, i.setHeader("content-type", "application/json"), i.end(JSON.stringify({
									success: !1,
									error: e.message
								}));
							}
							return;
						}
						if (r.url === "/__prodoc_api/save" && r.method === "POST") {
							try {
								let a = "", o = 0;
								r.on("data", (e) => {
									if (o += e.length, o > p) {
										i.statusCode = 413, i.setHeader("content-type", "application/json"), i.end(JSON.stringify({
											success: !1,
											error: "Payload Too Large"
										}));
										return;
									}
									a += e.toString();
								}), r.on("end", async () => {
									try {
										let { path: r, content: o, base: s } = JSON.parse(a), c = e.resolve(n, r), l = e.resolve(n) + e.sep;
										if (!e.resolve(c).startsWith(l)) {
											i.statusCode = 403, i.setHeader("content-type", "application/json"), i.end(JSON.stringify({
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
												i.statusCode = 409, i.setHeader("content-type", "application/json"), i.end(JSON.stringify({
													success: !1,
													error: "Conflict: file changed on disk"
												}));
												return;
											}
										}
										await t.writeFile(c, o, "utf-8"), i.setHeader("content-type", "application/json"), i.end(JSON.stringify({ success: !0 }));
									} catch (e) {
										i.statusCode = 500, i.setHeader("content-type", "application/json"), i.end(JSON.stringify({
											success: !1,
											error: e.message
										}));
									}
								});
							} catch (e) {
								i.statusCode = 500, i.setHeader("content-type", "application/json"), i.end(JSON.stringify({
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
	await x.listen();
	let C = x.resolvedUrls ?? {
		local: [],
		network: []
	}, w = C.local[0] ?? `http://localhost:${s}`;
	return console.log("\n🚀 Echo-ProDoc server is running!\n"), console.log(`   Docs:    ${e.resolve(n)}`), console.log(`   Local:   ${w}`), C.network.length > 0 && console.log(`   Network: ${C.network[0]}`), console.log(""), x;
}
//#endregion
//#region src/index.ts
var w = "echo-prodoc", T = (() => {
	try {
		let t = e.resolve(e.dirname(r(import.meta.url)), "../../../package.json");
		return JSON.parse(n.readFileSync(t, "utf-8")).version ?? "0.1.1";
	} catch {
		return "0.1.1";
	}
})();
function E() {
	console.log(`
${w} v${T}

Usage:
  ${w} view <document-path>   Start a rendering server for the document directory
  ${w} --help                 Show this help message
  ${w} --version              Show version

Options:
  --port, -p <number>    Server port (default: 3344)
  --no-open              Do not open browser automatically

Examples:
  ${w} view ./docs
  ${w} view ./docs --port 8080
`);
}
function D(e) {
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
async function O(n) {
	let r = e.resolve(n);
	try {
		if (!(await t.stat(r)).isDirectory()) throw Error(`Path is not a directory: ${r}`);
	} catch (e) {
		throw e.code === "ENOENT" ? Error(`Directory not found: ${r}`) : e;
	}
	return r;
}
async function k() {
	let e = D(process.argv);
	e.help && (E(), process.exit(0)), e.version && (console.log(`${w} v${T}`), process.exit(0)), e.command || (console.error("Error: No command specified. Use \"view\"."), console.error(`\nRun "${w} --help" for usage information.`), process.exit(1)), e.docPath || (console.error("Error: No document path specified."), console.error(`\nRun "${w} --help" for usage information.`), process.exit(1));
	try {
		let t = await C(await O(e.docPath), {
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
k();
//#endregion

//# sourceMappingURL=index.js.map