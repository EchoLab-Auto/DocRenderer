#!/usr/bin/env node
import e from "path";
import t from "fs/promises";
import { createServer as n } from "vite";
import r from "@vitejs/plugin-vue";
import { createRequire as i } from "module";
import a from "fs";
//#region src/server.ts
var o = i(import.meta.url);
function s(t) {
	try {
		let n = o.resolve(`${t}/package.json`);
		return e.dirname(n);
	} catch {
		let n = o.resolve(t), r = e.dirname(n);
		for (; r !== e.dirname(r);) {
			if (a.existsSync(e.join(r, "package.json"))) return r;
			r = e.dirname(r);
		}
		throw Error(`Cannot find package directory for ${t}`);
	}
}
var c = 3344, l = 10 * 1024 * 1024, u = "<!DOCTYPE html>\n<html lang=\"zh-CN\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>ProDoc</title>\n    <style>\n      html, body {\n        margin: 0;\n        padding: 0;\n        height: 100%;\n        background: var(--nm-bg-color, #e0e0e0);\n      }\n    </style>\n  </head>\n  <body>\n    <div id=\"app\"></div>\n    <script type=\"module\" src=\"/@prodoc/entry\"><\/script>\n  </body>\n</html>";
async function d(n) {
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
function f(t) {
	let n = e.join(s(t), "dist", "style.css").replace(/\\/g, "/");
	if (!a.existsSync(n)) throw Error(`CSS file not found for ${t}: ${n}. Please ensure @echolab-auto/ui-frame is installed.`);
	return n;
}
function p(t) {
	let n = s(t), r = e.join(n, "src", "index.ts"), i = e.join(n, "dist", "index.js");
	return process.env.PRODOC_DEV === "1" && a.existsSync(r) ? r.replace(/\\/g, "/") : i.replace(/\\/g, "/");
}
function m() {
	return "async (filePath, content) => {\n            try {\n              const res = await fetch('/__prodoc_api/save', {\n                method: 'POST',\n                headers: { 'Content-Type': 'application/json' },\n                body: JSON.stringify({ path: filePath, content }),\n              });\n              const data = await res.json();\n              if (data.success) {\n                console.log('[ProDoc] saved:', filePath);\n              } else {\n                console.error('[ProDoc] save failed:', data.error);\n              }\n            } catch (e) {\n              console.error('[ProDoc] save error:', e);\n            }\n          }";
}
function h(t, n) {
	let r = t === "view" ? "DocViewer" : "DocEditor", i = `import { ${r} } from '@prodoc/${t === "view" ? "renderer" : "editor"}';`, a = [`import '${f("@echolab-auto/ui-frame")}';`, `import '${e.join(s("@prodoc/renderer"), "dist", "index.css").replace(/\\/g, "/")}'`];
	t === "edit" && a.push(`import '${e.join(s("@prodoc/editor"), "dist", "index.css").replace(/\\/g, "/")}'`);
	let o = ["onDocLink: (p) => { console.log('[ProDoc] navigate to:', p); history.replaceState(null, '', '#' + p); }"];
	return t === "edit" && o.push(`onSave: ${m()}`), `
import { createApp, h } from 'vue';
import uiFrame, { ThemeProvider } from '@echolab-auto/ui-frame';
import { buildDocTree } from '@prodoc/core';
${i}
${a.join("\n")};

const files = ${JSON.stringify(n)};
const docRoot = buildDocTree(files);
const initialPath = window.location.hash ? window.location.hash.slice(1) : undefined;

const app = createApp({
  render() {
    return h('div', { style: { height: '100vh', width: '100vw', overflow: 'hidden' } }, [
      h(ThemeProvider, { defaultTheme: 'auto', storageKey: 'prodoc-theme', followSystem: true }, {
        default: () => h(${r}, {
          root: docRoot,
          initialPath,
          ${o.join(",\n          ")},
        }),
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
`;
}
async function g(i, a, o = {}) {
	let s = o.port ?? c;
	console.log(`📂 Loading documents from: ${e.resolve(a)}`);
	let f = await d(a), m = Object.keys(f).length;
	if (m === 0) throw Error(`No .md files found in: ${a}`);
	console.log(`✅ Loaded ${m} document(s)`);
	let g = await n({
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
				replacement: p("@prodoc/core")
			},
			{
				find: "@prodoc/renderer",
				replacement: p("@prodoc/renderer")
			},
			{
				find: "@prodoc/editor",
				replacement: p("@prodoc/editor")
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
							t.setHeader("content-type", "text/html; charset=utf-8"), t.end(u);
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
					if (e === "\0prodoc-entry") return h(i, f);
				}
			},
			...i === "edit" ? [{
				name: "prodoc-save-api",
				configureServer(n) {
					n.middlewares.use(async (n, r, i) => {
						if (n.url === "/__prodoc_api/save" && n.method === "POST") {
							try {
								let i = "", o = 0;
								n.on("data", (e) => {
									if (o += e.length, o > l) {
										r.statusCode = 413, r.setHeader("content-type", "application/json"), r.end(JSON.stringify({
											success: !1,
											error: "Payload Too Large"
										}));
										return;
									}
									i += e.toString();
								}), n.on("end", async () => {
									try {
										let { path: n, content: o } = JSON.parse(i), s = e.resolve(a, n), c = e.resolve(a) + e.sep;
										if (!e.resolve(s).startsWith(c)) {
											r.statusCode = 403, r.setHeader("content-type", "application/json"), r.end(JSON.stringify({
												success: !1,
												error: "Forbidden: path outside doc root"
											}));
											return;
										}
										await t.writeFile(s, o, "utf-8"), r.setHeader("content-type", "application/json"), r.end(JSON.stringify({ success: !0 }));
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
			}] : []
		]
	});
	await g.listen();
	let _ = g.resolvedUrls ?? {
		local: [],
		network: []
	}, v = _.local[0] ?? `http://localhost:${s}`;
	return console.log("\n🚀 Echo-ProDoc server is running!\n"), console.log(`   Mode:    ${i === "view" ? "👁  View" : "✏️  Edit"}`), console.log(`   Docs:    ${e.resolve(a)}`), console.log(`   Local:   ${v}`), _.network.length > 0 && console.log(`   Network: ${_.network[0]}`), console.log(""), i === "edit" && console.log("   Press Ctrl+S in the editor to save changes.\n"), g;
}
//#endregion
//#region src/index.ts
var _ = "echo-prodoc", v = "0.1.0";
function y() {
	console.log(`
${_} v${v}

Usage:
  ${_} view <document-path>   Start a rendering server for the document directory
  ${_} edit <document-path>   Start an editing server for the document directory
  ${_} --help                 Show this help message
  ${_} --version              Show version

Options:
  --port, -p <number>    Server port (default: 3344)
  --no-open              Do not open browser automatically

Examples:
  ${_} view ./docs
  ${_} edit ./docs --port 8080
`);
}
function b(e) {
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
async function x(n) {
	let r = e.resolve(n);
	try {
		if (!(await t.stat(r)).isDirectory()) throw Error(`Path is not a directory: ${r}`);
	} catch (e) {
		throw e.code === "ENOENT" ? Error(`Directory not found: ${r}`) : e;
	}
	return r;
}
async function S() {
	let e = b(process.argv);
	e.help && (y(), process.exit(0)), e.version && (console.log(`${_} v${v}`), process.exit(0)), e.command || (console.error("Error: No command specified. Use \"view\" or \"edit\"."), console.error(`\nRun "${_} --help" for usage information.`), process.exit(1)), e.docPath || (console.error("Error: No document path specified."), console.error(`\nRun "${_} --help" for usage information.`), process.exit(1));
	try {
		let t = await x(e.docPath), n = await g(e.command, t, {
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
S();
//#endregion

//# sourceMappingURL=index.js.map