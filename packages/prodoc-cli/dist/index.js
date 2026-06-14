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
var c = 3344, l = "<!DOCTYPE html>\n<html lang=\"zh-CN\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>ProDoc</title>\n    <style>\n      html, body {\n        margin: 0;\n        padding: 0;\n        height: 100%;\n        background: var(--nm-bg-color, #e0e0e0);\n      }\n    </style>\n  </head>\n  <body>\n    <div id=\"app\"></div>\n    <script type=\"module\" src=\"/@prodoc/entry\"><\/script>\n  </body>\n</html>";
async function u(n) {
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
function d(t) {
	return e.join(s(t), "dist", "style.css").replace(/\\/g, "/");
}
function f() {
	return "async (filePath, content) => {\n            try {\n              const res = await fetch('/__prodoc_api/save', {\n                method: 'POST',\n                headers: { 'Content-Type': 'application/json' },\n                body: JSON.stringify({ path: filePath, content }),\n              });\n              const data = await res.json();\n              if (data.success) {\n                console.log('[ProDoc] saved:', filePath);\n              } else {\n                console.error('[ProDoc] save failed:', data.error);\n              }\n            } catch (e) {\n              console.error('[ProDoc] save error:', e);\n            }\n          }";
}
function p(t, n) {
	let r = t === "view" ? "DocViewer" : "DocEditor", i = `import { ${r} } from '@prodoc/${t === "view" ? "renderer" : "editor"}';`, a = [`import '${d("@echolab/ui-frame")}';`, `import '${e.join(s("@prodoc/renderer"), "dist", "index.css").replace(/\\/g, "/")}'`];
	t === "edit" && a.push(`import '${e.join(s("@prodoc/editor"), "dist", "index.css").replace(/\\/g, "/")}'`);
	let o = ["onDocLink: (p) => console.log('[ProDoc] navigate to:', p)"];
	return t === "edit" && o.push(`onSave: ${f()}`), `
import { createApp, h } from 'vue';
import uiFrame, { ThemeProvider } from '@echolab/ui-frame';
import { buildDocTree } from '@prodoc/core';
${i}
${a.join("\n")};

const files = ${JSON.stringify(n)};
const docTree = buildDocTree(files);

const app = createApp({
  render() {
    return h('div', { style: { height: '100vh', width: '100vw' } }, [
      h(ThemeProvider, { defaultTheme: 'auto', storageKey: 'prodoc-theme', followSystem: true }, {
        default: () => h(${r}, {
          root: docTree,
          ${o.join(",\n          ")},
        }),
      }),
    ]);
  },
});

app.use(uiFrame);
app.mount('#app');
`;
}
async function m(i, a, o = {}) {
	let d = o.port ?? c;
	console.log(`📂 Loading documents from: ${e.resolve(a)}`);
	let f = await u(a), m = Object.keys(f).length;
	if (m === 0) throw Error(`No .md files found in: ${a}`);
	console.log(`✅ Loaded ${m} document(s)`);
	let h = await n({
		root: process.cwd(),
		configFile: !1,
		server: {
			port: d,
			open: o.open ?? !0,
			host: !0
		},
		resolve: { alias: [
			{
				find: "@prodoc/core",
				replacement: e.join(s("@prodoc/core"), "src", "index.ts").replace(/\\/g, "/")
			},
			{
				find: "@prodoc/renderer",
				replacement: e.join(s("@prodoc/renderer"), "src", "index.ts").replace(/\\/g, "/")
			},
			{
				find: "@prodoc/editor",
				replacement: e.join(s("@prodoc/editor"), "src", "index.ts").replace(/\\/g, "/")
			}
		] },
		optimizeDeps: { include: ["marked"] },
		plugins: [
			r(),
			{
				name: "prodoc-html",
				configureServer(e) {
					e.middlewares.use((e, t, n) => {
						if (e.url === "/" || e.url === "/index.html") {
							t.setHeader("content-type", "text/html; charset=utf-8"), t.end(l);
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
					if (e === "\0prodoc-entry") return p(i, f);
				}
			},
			...i === "edit" ? [{
				name: "prodoc-save-api",
				configureServer(n) {
					n.middlewares.use(async (n, r, i) => {
						if (n.url === "/__prodoc_api/save" && n.method === "POST") {
							try {
								let i = "";
								n.on("data", (e) => i += e.toString()), n.on("end", async () => {
									try {
										let { path: n, content: o } = JSON.parse(i), s = e.resolve(a, n), c = e.resolve(a);
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
	await h.listen();
	let g = h.resolvedUrls ?? {
		local: [],
		network: []
	}, _ = g.local[0] ?? `http://localhost:${d}`;
	return console.log("\n🚀 Echo-ProDoc server is running!\n"), console.log(`   Mode:    ${i === "view" ? "👁  View" : "✏️  Edit"}`), console.log(`   Docs:    ${e.resolve(a)}`), console.log(`   Local:   ${_}`), g.network.length > 0 && console.log(`   Network: ${g.network[0]}`), console.log(""), i === "edit" && console.log("   Press Ctrl+S in the editor to save changes.\n"), h;
}
//#endregion
//#region src/index.ts
var h = "echo-prodoc", g = "0.1.0";
function _() {
	console.log(`
${h} v${g}

Usage:
  ${h} view <document-path>   Start a rendering server for the document directory
  ${h} edit <document-path>   Start an editing server for the document directory
  ${h} --help                 Show this help message
  ${h} --version              Show version

Options:
  --port, -p <number>    Server port (default: 3344)
  --no-open              Do not open browser automatically

Examples:
  ${h} view ./docs
  ${h} edit ./docs --port 8080
`);
}
function v(e) {
	let t = e.slice(2), n = {
		open: !0,
		help: !1,
		version: !1
	};
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		r === "--help" || r === "-h" ? n.help = !0 : r === "--version" || r === "-v" ? n.version = !0 : r === "--port" || r === "-p" ? n.port = parseInt(t[++e], 10) : r === "--no-open" ? n.open = !1 : r.startsWith("-") || (n.command ? n.docPath ||= r : r === "view" || r === "edit" ? n.command = r : (console.error(`Unknown command: ${r}`), process.exit(1)));
	}
	return n;
}
async function y(n) {
	let r = e.resolve(n);
	try {
		if (!(await t.stat(r)).isDirectory()) throw Error(`Path is not a directory: ${r}`);
	} catch (e) {
		throw e.code === "ENOENT" ? Error(`Directory not found: ${r}`) : e;
	}
	return r;
}
async function b() {
	let e = v(process.argv);
	e.help && (_(), process.exit(0)), e.version && (console.log(`${h} v${g}`), process.exit(0)), e.command || (console.error("Error: No command specified. Use \"view\" or \"edit\"."), console.error(`\nRun "${h} --help" for usage information.`), process.exit(1)), e.docPath || (console.error("Error: No document path specified."), console.error(`\nRun "${h} --help" for usage information.`), process.exit(1));
	try {
		let t = await y(e.docPath), n = await m(e.command, t, {
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
b();
//#endregion

//# sourceMappingURL=index.js.map