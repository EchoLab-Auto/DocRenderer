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
function b(t, n) {
	let r = t === "view" ? "DocGraphViewer" : "DocEditor", i = `import { ${r} } from '@prodoc/${t === "view" ? "renderer" : "editor"}';`, a = [
		`import '${g("@echolab-auto/ui-frame")}';`,
		..._() ? [`import '${_()}';`] : [],
		`import '${e.join(u("@prodoc/renderer"), "dist", "index.css").replace(/\\/g, "/")}'`
	];
	t === "edit" && a.push(`import '${e.join(u("@prodoc/editor"), "dist", "index.css").replace(/\\/g, "/")}'`);
	let o = t === "view" ? `{ files: state.files, onSave: ${y()} }` : `{
          root: docRoot,
          initialPath,
          onDocLink: (p) => { console.log('[ProDoc] navigate to:', p); history.replaceState(null, '', '#' + p); },
          onSave: ${y()},
        }`, s = t === "edit" ? "import { buildDocTree } from '@prodoc/core/pure';\nconst docRoot = buildDocTree(state.files);\nconst initialPath = window.location.hash ? window.location.hash.slice(1) : undefined;" : "", c = t === "view" ? "if (import.meta.hot) {\n  import.meta.hot.on('prodoc:docs-update', (updated) => {\n    state.files = updated;\n  });\n}" : "";
	return `
import { createApp, h, reactive } from 'vue';
import uiFrame, { ThemeProvider } from '@echolab-auto/ui-frame';
${i}
${a.join("\n")};

const state = reactive({ files: ${JSON.stringify(n)} });
${s}

const app = createApp({
  render() {
    return h('div', { style: { height: '100vh', width: '100vw', overflow: 'hidden' } }, [
      h(ThemeProvider, { defaultTheme: 'auto', storageKey: 'prodoc-theme', followSystem: true }, {
        default: () => h(${r}, ${o}),
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

${c}
`;
}
async function x(i, a, o = {}) {
	let s = o.port ?? d;
	console.log(`📂 Loading documents from: ${e.resolve(a)}`);
	let c = await m(a), l = Object.keys(c).length;
	if (l === 0) throw Error(`No .md files found in: ${a}`);
	if (console.log(`✅ Loaded ${l} document(s)`), i === "view") {
		let e = await h(a, c);
		e.length > 0 && console.log(`📍 Wrote auto-layout coordinates to ${e.length} document(s)`);
	}
	let u = await n({
		root: process.cwd(),
		configFile: !1,
		server: {
			port: s,
			open: o.open ?? !0,
			host: !0
		},
		resolve: { alias: [
			{
				find: "@prodoc/core",
				replacement: v("@prodoc/core")
			},
			{
				find: "@prodoc/renderer",
				replacement: v("@prodoc/renderer")
			},
			{
				find: "@prodoc/editor",
				replacement: v("@prodoc/editor")
			}
		] },
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
					if (e === "\0prodoc-entry") return b(i, c);
				}
			},
			...i === "view" ? [{
				name: "prodoc-docs-watch",
				configureServer(t) {
					let n = e.resolve(a);
					t.watcher.add(n);
					let r = null, i = async () => {
						let e = await m(n), r = await h(n, e);
						c = e, t.ws.send("prodoc:docs-update", c), console.log(`🔄 Documents reloaded (${Object.keys(c).length} file(s)` + (r.length > 0 ? `, wrote coordinates to ${r.length}` : "") + ")");
					}, o = (e) => {
						!e.startsWith(n) || !e.endsWith(".md") || (r && clearTimeout(r), r = setTimeout(() => {
							i().catch((e) => console.error("[ProDoc] reload failed:", e));
						}, 100));
					};
					t.watcher.on("add", o), t.watcher.on("change", o), t.watcher.on("unlink", o);
				}
			}] : [],
			{
				name: "prodoc-save-api",
				configureServer(n) {
					n.middlewares.use(async (n, r, i) => {
						if (n.url === "/__prodoc_api/save" && n.method === "POST") {
							try {
								let i = "", o = 0;
								n.on("data", (e) => {
									if (o += e.length, o > f) {
										r.statusCode = 413, r.setHeader("content-type", "application/json"), r.end(JSON.stringify({
											success: !1,
											error: "Payload Too Large"
										}));
										return;
									}
									i += e.toString();
								}), n.on("end", async () => {
									try {
										let { path: n, content: o, base: s } = JSON.parse(i), c = e.resolve(a, n), l = e.resolve(a) + e.sep;
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
						i();
					});
				}
			}
		]
	});
	await u.listen();
	let g = u.resolvedUrls ?? {
		local: [],
		network: []
	}, _ = g.local[0] ?? `http://localhost:${s}`;
	return console.log("\n🚀 Echo-ProDoc server is running!\n"), console.log(`   Mode:    ${i === "view" ? "👁  View" : "✏️  Edit"}`), console.log(`   Docs:    ${e.resolve(a)}`), console.log(`   Local:   ${_}`), g.network.length > 0 && console.log(`   Network: ${g.network[0]}`), console.log(""), i === "edit" && console.log("   Press Ctrl+S in the editor to save changes.\n"), u;
}
//#endregion
//#region src/index.ts
var S = "echo-prodoc", C = "0.1.0";
function w() {
	console.log(`
${S} v${C}

Usage:
  ${S} view <document-path>   Start a rendering server for the document directory
  ${S} edit <document-path>   Start an editing server for the document directory
  ${S} --help                 Show this help message
  ${S} --version              Show version

Options:
  --port, -p <number>    Server port (default: 3344)
  --no-open              Do not open browser automatically

Examples:
  ${S} view ./docs
  ${S} edit ./docs --port 8080
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
		r === "--help" || r === "-h" ? n.help = !0 : r === "--version" || r === "-v" ? n.version = !0 : r === "--port" || r === "-p" ? ((e + 1 >= t.length || isNaN(parseInt(t[e + 1], 10))) && (console.error("Error: --port requires a valid number"), process.exit(1)), n.port = parseInt(t[++e], 10)) : r === "--no-open" ? n.open = !1 : r.startsWith("-") || (n.command ? n.docPath ||= r : r === "view" || r === "edit" ? n.command = r : (console.error(`Unknown command: ${r}`), process.exit(1)));
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
	e.help && (w(), process.exit(0)), e.version && (console.log(`${S} v${C}`), process.exit(0)), e.command || (console.error("Error: No command specified. Use \"view\" or \"edit\"."), console.error(`\nRun "${S} --help" for usage information.`), process.exit(1)), e.docPath || (console.error("Error: No document path specified."), console.error(`\nRun "${S} --help" for usage information.`), process.exit(1));
	try {
		let t = await E(e.docPath), n = await x(e.command, t, {
			port: e.port,
			open: e.open
		}), r = () => {
			console.log("\n👋 Shutting down..."), n.close().then(() => {
				process.exit(0);
			});
		};
		process.on("SIGINT", r), process.on("SIGTERM", r);
	} catch (e) {
		console.error(`\n❌ Error: ${e.message}\n`), process.exit(1);
	}
}
D();
//#endregion

//# sourceMappingURL=index.js.map