#!/usr/bin/env node
import e from "path";
import t from "fs/promises";
import n from "fs";
import { createServer as r } from "vite";
import i from "@vitejs/plugin-vue";
import { createRequire as a } from "module";
import { buildDocGraph as o, parseFrameBlock as s, writeFramePosition as c } from "@prodoc/core/pure";
//#region src/server.ts
var l = a(import.meta.url);
function u(t) {
	try {
		let n = l.resolve(`${t}/package.json`);
		return e.dirname(n);
	} catch {
		let r = l.resolve(t), i = e.dirname(r);
		for (; i !== e.dirname(i);) {
			if (n.existsSync(e.join(i, "package.json"))) return i;
			i = e.dirname(i);
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
	let r = e.join(u(t), "dist", "style.css").replace(/\\/g, "/");
	if (!n.existsSync(r)) throw Error(`CSS file not found for ${t}: ${r}. Please ensure @echolab-auto/ui-frame is installed.`);
	return r;
}
function _() {
	let t = e.join(u("@echolab-auto/ui-frame"), "dist", "index.css").replace(/\\/g, "/");
	return n.existsSync(t) ? t : null;
}
function v(t) {
	let r = u(t), i = e.join(r, "src", "index.ts"), a = e.join(r, "dist", "index.js");
	return process.env.PRODOC_DEV === "1" && n.existsSync(i) ? i.replace(/\\/g, "/") : a.replace(/\\/g, "/");
}
function y() {
	return "async (filePath, content, base) => {\n            try {\n              const res = await fetch('/__prodoc_api/save', {\n                method: 'POST',\n                headers: { 'Content-Type': 'application/json' },\n                body: JSON.stringify({ path: filePath, content, base }),\n              });\n              const data = await res.json();\n              if (data.success) {\n                console.log('[ProDoc] saved:', filePath);\n                // 乐观同步本地基准：磁盘内容现在就是 content，\n                // 后续编辑/保存以它为基准，不再依赖热更新推送的时序\n                state.files[filePath] = content;\n                return true;\n              }\n              if (res.status === 409) {\n                alert('[ProDoc] 保存被拒绝：' + filePath + ' 在磁盘上已被其他程序修改。\\n你的修改仍保留在画布暂存中；请刷新页面同步最新内容后重试（或点「↩ 放弃更改」丢弃）。');\n                return false;\n              }\n              alert('[ProDoc] 保存失败：' + filePath + ' — ' + (data.error || '未知错误'));\n              return false;\n            } catch (e) {\n              alert('[ProDoc] 保存请求出错：' + filePath + ' — ' + e);\n              return false;\n            }\n          }";
}
function b(t) {
	let n = `{ files: state.files, saveHandler: ${y()} }`;
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
async function x(n, a = {}) {
	let o = a.port ?? d;
	console.log(`📂 Loading documents from: ${e.resolve(n)}`);
	let s = await m(n), c = Object.keys(s).length;
	if (c === 0) throw Error(`No .md files found in: ${n}`);
	console.log(`✅ Loaded ${c} document(s)`);
	let l = await h(n, s);
	l.length > 0 && console.log(`📍 Wrote auto-layout coordinates to ${l.length} document(s)`);
	let u = await r({
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
			i(),
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
					let r = e.resolve(n);
					t.watcher.add(r);
					let i = null, a = async () => {
						let e = await m(r), n = await h(r, e);
						s = e, t.ws.send("prodoc:docs-update", s), console.log(`🔄 Documents reloaded (${Object.keys(s).length} file(s)` + (n.length > 0 ? `, wrote coordinates to ${n.length}` : "") + ")");
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
						if (r.url === "/__prodoc_api/save" && r.method === "POST") {
							try {
								let a = "", o = 0;
								r.on("data", (e) => {
									if (o += e.length, o > f) {
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
	await u.listen();
	let g = u.resolvedUrls ?? {
		local: [],
		network: []
	}, _ = g.local[0] ?? `http://localhost:${o}`;
	return console.log("\n🚀 Echo-ProDoc server is running!\n"), console.log(`   Docs:    ${e.resolve(n)}`), console.log(`   Local:   ${_}`), g.network.length > 0 && console.log(`   Network: ${g.network[0]}`), console.log(""), u;
}
//#endregion
//#region src/index.ts
var S = "echo-prodoc", C = (() => {
	try {
		let e = new URL("data:application/json;base64,ewogICJuYW1lIjogIkBlY2hvbGFiLWF1dG8vZWNoby1wcm9kb2MiLAogICJ2ZXJzaW9uIjogIjAuMS4xIiwKICAiZGVzY3JpcHRpb24iOiAiUHJvRG9jIC0g5paH5qGj5riy5p+T5LiO57yW6L6R5qGG5p62IiwKICAid29ya3NwYWNlcyI6IFsKICAgICJwYWNrYWdlcy8qIgogIF0sCiAgImJpbiI6IHsKICAgICJlY2hvLXByb2RvYyI6ICIuL2Jpbi9lY2hvLXByb2RvYy5qcyIKICB9LAogICJmaWxlcyI6IFsKICAgICJiaW4vIiwKICAgICJwYWNrYWdlcy8qL2Rpc3QvKioiLAogICAgInBhY2thZ2VzLyovcGFja2FnZS5qc29uIiwKICAgICJzY3JpcHRzLyIsCiAgICAidmVuZG9yL2ZzZXZlbnRzLXN0dWIvKioiCiAgXSwKICAic2NyaXB0cyI6IHsKICAgICJidWlsZCI6ICJucG0gcnVuIGJ1aWxkIC0td29ya3NwYWNlcyIsCiAgICAiYnVpbGQ6dWktZnJhbWUiOiAibm9kZSBzY3JpcHRzL2luc3RhbGwtdWktZnJhbWUuanMiLAogICAgInR5cGUtY2hlY2siOiAibnBtIHJ1biB0eXBlLWNoZWNrIC0td29ya3NwYWNlcyIsCiAgICAiY2xlYW4iOiAibnBtIHJ1biBjbGVhbiAtLXdvcmtzcGFjZXMiLAogICAgInZpZXciOiAibm9kZSAuL3BhY2thZ2VzL3Byb2RvYy1jbGkvZGlzdC9pbmRleC5qcyB2aWV3IiwKICAgICJkZXY6dmlldyI6ICJQUk9ET0NfREVWPTEgdHN4IHBhY2thZ2VzL3Byb2RvYy1jbGkvc3JjL2luZGV4LnRzIHZpZXciLAogICAgInByZXBhY2siOiAibm9kZSBzY3JpcHRzL3B1Ymxpc2gtcGFja2FnZS5qcyBhcHBseSIsCiAgICAicG9zdHBhY2siOiAibm9kZSBzY3JpcHRzL3B1Ymxpc2gtcGFja2FnZS5qcyByZXN0b3JlIiwKICAgICJwcmVwdWJsaXNoT25seSI6ICJucG0gcnVuIGJ1aWxkIiwKICAgICJ1c2UtbG9jYWwtdWktZnJhbWUiOiAibm9kZSBzY3JpcHRzL3N3aXRjaC11aS1mcmFtZS5qcyBsb2NhbCIsCiAgICAidXNlLW5wbS11aS1mcmFtZSI6ICJub2RlIHNjcmlwdHMvc3dpdGNoLXVpLWZyYW1lLmpzIG5wbSIKICB9LAogICJkZXZEZXBlbmRlbmNpZXMiOiB7CiAgICAiQHR5cGVzL25vZGUiOiAiXjIyLjAuMCIsCiAgICAidHN4IjogIl40LjE5LjAiLAogICAgInR5cGVzY3JpcHQiOiAiXjUuNy4wIiwKICAgICJ2aXRlIjogIl44LjAuMTYiLAogICAgInZ1ZS10c2MiOiAiXjIuMi4xMiIKICB9LAogICJlbmdpbmVzIjogewogICAgIm5vZGUiOiAiPj0xOC4wLjAiCiAgfSwKICAiZGVwZW5kZW5jaWVzIjogewogICAgIkBlY2hvbGFiLWF1dG8vdWktZnJhbWUiOiAiXjEuMy4wIiwKICAgICJAcHJvZG9jL2NvcmUiOiAiZmlsZTpwYWNrYWdlcy9wcm9kb2MtY29yZSIsCiAgICAiQHByb2RvYy9yZW5kZXJlciI6ICJmaWxlOnBhY2thZ2VzL3Byb2RvYy1yZW5kZXJlciIsCiAgICAiQHZpdGVqcy9wbHVnaW4tdnVlIjogIl42LjAuNyIsCiAgICAibWFya2VkIjogIl4xOC4wLjUiLAogICAgIm1lcm1haWQiOiAiXjExLjAuMCIsCiAgICAidnVlIjogIl4zLjUuMzUiCiAgfSwKICAib3ZlcnJpZGVzIjogewogICAgImZzZXZlbnRzIjogImZpbGU6dmVuZG9yL2ZzZXZlbnRzLXN0dWIiCiAgfQp9Cg==", "" + import.meta.url);
		return JSON.parse(n.readFileSync(e, "utf-8")).version ?? "0.1.1";
	} catch {
		return "0.1.1";
	}
})();
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