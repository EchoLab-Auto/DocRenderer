import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createVNode as o, defineComponent as s, nextTick as c, normalizeClass as l, normalizeStyle as u, openBlock as d, ref as f, renderList as p, resolveComponent as m, toDisplayString as h, unref as g, watch as ee, withCtx as te, withKeys as _, withModifiers as v } from "vue";
import { NeumorphismCanvas as ne, NeumorphismThemeToggle as re } from "@echolab-auto/ui-frame";
import { DocFlowCanvas as y, DocViewer as b, MarkdownEditor as ie, MarkdownRenderer as x, MarkdownRenderer as ae, writeFlowNodePosition as oe } from "@echolab-auto/ui-frame/doc";
import "@echolab-auto/ui-frame/dist/style.css";
//#region src/components/DocTreeItem.vue?vue&type=script&setup=true&lang.ts
var S = { class: "pd-tree-node" }, se = ["title"], C = {
	class: "pd-tree-icon",
	"aria-hidden": "true"
}, ce = { class: "pd-tree-title" }, le = {
	key: 0,
	class: "pd-tree-order"
}, ue = {
	key: 0,
	class: "pd-tree pd-tree--nested"
}, de = /*#__PURE__*/ ((e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
})(/* @__PURE__ */ s({
	__name: "DocTreeItem",
	props: {
		node: {},
		expanded: {},
		currentPath: {}
	},
	emits: ["toggle", "open"],
	setup(t, { emit: o }) {
		let s = o;
		return (o, c) => {
			let u = m("DocTreeItem", !0);
			return d(), i("li", S, [a("div", {
				class: l(["pd-tree-row", {
					"pd-tree-row--dir": t.node.isDir,
					"pd-tree-row--active": t.node.path === t.currentPath
				}]),
				title: t.node.path || t.node.title,
				onClick: c[0] ||= (e) => t.node.children.length ? s("toggle", t.node) : s("open", t.node),
				onKeydown: c[1] ||= _(v((e) => t.node.children.length ? s("toggle", t.node) : s("open", t.node), ["self"]), ["enter"]),
				tabindex: "0"
			}, [
				a("span", {
					class: l(["pd-tree-caret", { "pd-tree-caret--open": t.expanded[t.node.path] }]),
					"aria-hidden": "true"
				}, h(t.node.children.length ? t.expanded[t.node.path] ? "▾" : "▸" : "·"), 3),
				a("span", C, h(t.node.isDir ? "📁" : "📄"), 1),
				a("span", ce, h(t.node.title), 1),
				t.node.order ? (d(), i("span", le, "#" + h(t.node.order), 1)) : r("", !0)
			], 42, se), t.node.children.length && t.expanded[t.node.path] ? (d(), i("ul", ue, [(d(!0), i(e, null, p(t.node.children, (e) => (d(), n(u, {
				key: e.path || e.id,
				node: e,
				expanded: t.expanded,
				"current-path": t.currentPath,
				onToggle: c[2] ||= (e) => s("toggle", e),
				onOpen: c[3] ||= (e) => s("open", e)
			}, null, 8, [
				"node",
				"expanded",
				"current-path"
			]))), 128))])) : r("", !0)]);
		};
	}
}), [["__scopeId", "data-v-2ae1524a"]]);
//#endregion
//#region ../prodoc-core/dist/tree-BskcCljG.js
function w(e) {
	let t = [], n = "", r = null;
	for (let i of e) r ? (n += i, i === r && (r = null)) : i === "\"" || i === "'" ? (r = i, n += i) : i === "," ? (t.push(n), n = "") : n += i;
	return t.push(n), t;
}
function T(e) {
	let t = e.trim();
	if (t === "") return "";
	if (t.startsWith("[") && t.endsWith("]")) return w(t.slice(1, -1)).map((e) => T(e)).filter((e) => e !== "");
	if (t === "true") return !0;
	if (t === "false") return !1;
	if (/^-?\d+$/.test(t)) return parseInt(t, 10);
	if (/^-?\d*\.\d+$/.test(t)) return parseFloat(t);
	let n = t.match(/^(["'])([\s\S]*)\1$/);
	return n ? n[2] : t;
}
function E(e) {
	let t = e.indexOf("\n");
	if ((t === -1 ? e : e.slice(0, t)).trim() !== "---") return {
		params: {},
		body: e,
		hasFrame: !1
	};
	let n = (t === -1 ? "" : e.slice(t + 1)).split("\n"), r = -1;
	for (let e = 0; e < n.length; e++) if (n[e].trim() === "---") {
		r = e;
		break;
	}
	if (r === -1) return {
		params: {},
		body: e,
		hasFrame: !1
	};
	let i = {};
	for (let e of n.slice(0, r)) {
		if (e.trim() === "") continue;
		let t = e.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*([\s\S]*)$/);
		t && (i[t[1]] = T(t[2]));
	}
	return {
		params: i,
		body: n.slice(r + 1).join("\n"),
		hasFrame: !0
	};
}
function fe(e) {
	return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).filter((e) => typeof e == "string").map((e) => e.trim()).filter(Boolean);
}
function pe(e) {
	return fe(E(e).params.link);
}
function me(e) {
	return e === "" || e !== e.trim() || /[|,"]/.test(e) ? e.includes("\"") ? `'${e}'` : `"${e}"` : e;
}
function he(e, t, n) {
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!E(e).hasFrame) return n === null ? e : `---${r}${n}${r}---${r}${e}`;
	let i = e.split(/\r?\n/), a = i.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (a === -1) return e;
	let o = RegExp(`^${t}\\s*:`), s = i.slice(1, a).findIndex((e) => o.test(e));
	return n === null ? s >= 0 && i.splice(s + 1, 1) : s >= 0 ? i[s + 1] = n : i.splice(a, 0, n), i.join(r);
}
function ge(e, t) {
	return he(e, "link", t.length > 0 ? `link: [${t.map(me).join(", ")}]` : null);
}
function _e(e, t) {
	return he(e, "group", t === null ? null : `group: ${me(t)}`);
}
function ve(e, t) {
	let n = Object.entries(t).filter((e) => (e[0] === "x" || e[0] === "y") && typeof e[1] == "number" && Number.isFinite(e[1]));
	if (n.length === 0) return e;
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!E(e).hasFrame) return `---${r}${n.map(([e, t]) => `${e}: ${t}`).join(r)}${r}---${r}${e}`;
	let i = e.split(/\r?\n/), a = i.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (a === -1) return e;
	let o = a;
	for (let [e, t] of n) {
		let n = RegExp(`^${e}\\s*:`), r = i.slice(1, o).findIndex((e) => n.test(e));
		r >= 0 ? i[r + 1] = `${e}: ${t}` : (i.splice(o, 0, `${e}: ${t}`), o++);
	}
	return i.join(r);
}
var D = 72, O = 48, k = /* @__PURE__ */ new Set([
	"id",
	"title",
	"x",
	"y",
	"w",
	"h",
	"link",
	"group"
]);
function A(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
var j = {
	t: "top",
	r: "right",
	b: "bottom",
	l: "left"
}, M = {
	top: "t",
	right: "r",
	bottom: "b",
	left: "l"
}, N = /^([trbl_])>([trbl_])$/;
function ye(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(N);
		t ? (t[1] !== "_" && (n.fromSide = j[t[1]]), t[2] !== "_" && (n.toSide = j[t[2]])) : e !== "" && (n.label = e);
	}
	return n;
}
function be(e) {
	let t = e.ref;
	if (e.label && (t += ` | ${e.label}`), e.fromSide || e.toSide) {
		let n = e.fromSide ? M[e.fromSide] : "_", r = e.toSide ? M[e.toSide] : "_";
		t += ` | ${n}>${r}`;
	}
	return t;
}
var P = /^(.*)\s*@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
function xe(e) {
	let t = e.match(P);
	return !t || !t[1].trim() ? { name: e.trim() } : {
		name: t[1].trim(),
		geo: {
			x: Number(t[2]),
			y: Number(t[3]),
			w: Number(t[4]),
			h: Number(t[5])
		}
	};
}
function Se(e) {
	let { name: t, x: n, y: r, w: i, h: a } = e;
	return [
		n,
		r,
		i,
		a
	].every((e) => typeof e == "number" && Number.isFinite(e)) ? `${t} @ ${n}, ${r}, ${i}, ${a}` : t;
}
function Ce(e, t) {
	if (t) return { ...t };
	if (e.length === 0) return {
		x: 0,
		y: 0,
		w: 0,
		h: 0
	};
	let n = Infinity, r = Infinity, i = -Infinity, a = -Infinity;
	for (let t of e) n = Math.min(n, t.x), r = Math.min(r, t.y), i = Math.max(i, t.x + t.w), a = Math.max(a, t.y + t.h);
	return {
		x: n - 24,
		y: r - 34,
		w: i - n + 48,
		h: a - r + 34 + 24
	};
}
function we(e) {
	let t = e.match(/^#[ \t]+(.+)$/m);
	return t ? t[1].trim() : void 0;
}
function Te(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
}
function Ee(e) {
	return e.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_~]/g, "").replace(/<[^>]+>/g, "").trim();
}
function De(e) {
	let t = [], n = null;
	for (let r of e.split("\n")) {
		let e = r.match(/^\s*(`{3,}|~{3,})/);
		if (e) {
			n === null ? n = e[1][0] : e[1][0] === n && (n = null);
			continue;
		}
		if (n !== null) continue;
		let i = r.match(/^##[ \t]+(.+?)\s*#*\s*$/);
		if (i) {
			let e = Ee(i[1]);
			e && t.push({
				anchor: Te(e),
				title: e
			});
		}
	}
	return t.length >= 2 ? t : [];
}
function F(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = n.get(e.to);
		t ? t.push(e.from) : n.set(e.to, [e.from]);
	}
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
	function a(e) {
		let t = r.get(e);
		if (t !== void 0) return t;
		if (i.has(e)) return -1;
		i.add(e);
		let o = 0;
		for (let t of n.get(e) ?? []) {
			let e = a(t);
			e >= 0 && (o = Math.max(o, e + 1));
		}
		return i.delete(e), r.set(e, o), o;
	}
	for (let t of e) a(t.id);
	return r;
}
function I(e, t, n, r) {
	let i = e.filter((e) => {
		let t = r.get(e.id);
		return t.rawX === void 0 || t.rawY === void 0;
	}).map((e) => ({
		box: e,
		depth: n.get(e.id) ?? 0
	}));
	if (i.length === 0) return;
	let a = Math.max(2, Math.ceil(Math.sqrt(i.length))), o = (e) => e.x + e.w / 2, s = /* @__PURE__ */ new Map();
	for (let t of e) r.get(t.id).rawX !== void 0 && s.set(t.id, o(t));
	let c = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = c.get(e.to);
		t ? t.push(e.from) : c.set(e.to, [e.from]);
	}
	let l = /* @__PURE__ */ new Map();
	for (let e of i) {
		let t = l.get(e.depth);
		t ? t.push(e) : l.set(e.depth, [e]);
	}
	let u = [...l.keys()].sort((e, t) => e - t), d = O;
	for (let e of u) {
		let t = l.get(e), n = t.map((e, n) => {
			let r = (c.get(e.box.id) ?? []).map((e) => s.get(e)).filter((e) => e !== void 0);
			return {
				auto: e,
				bary: r.length ? r.reduce((e, t) => e + t, 0) / r.length : 2 ** 53 - 1 - (t.length - n)
			};
		});
		n.sort((e, t) => e.bary - t.bary);
		let i = n.map((e) => e.auto), u = d, f = 0, p = O, m = 0;
		for (let { box: e } of i) {
			m === a && (u += f + D, f = 0, p = O, m = 0);
			let t = r.get(e.id);
			t.rawX === void 0 && (e.x = p), t.rawY === void 0 && (e.y = u), s.set(e.id, o(e)), p += e.w + 64, f = Math.max(f, e.h), m++;
		}
		d = u + f + D;
	}
}
function Oe(e, t) {
	let n = e.map((e) => ({
		...e,
		x: 0,
		y: 0
	}));
	return I(n, t, F(n, t), new Map(n.map((e) => [e.id, {}]))), new Map(n.map((e) => [e.id, {
		x: e.x,
		y: e.y
	}]));
}
function ke(e) {
	let t = Object.keys(e).sort(), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let o of t) {
		let { params: t, body: s } = E(e[o]), c = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : o.replace(/\.md$/, ""), l = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || we(s) || c, u = De(s), d = A(t.w) ?? 220, f = A(t.h) ?? 96, p = {};
		for (let [e, n] of Object.entries(t)) k.has(e) || (p[e] = n);
		let m = {
			id: c,
			title: l,
			docPath: o,
			depth: 0,
			blocks: u,
			x: A(t.x) ?? 0,
			y: A(t.y) ?? 0,
			w: d,
			h: f,
			attrs: p
		};
		if (i.set(c, {
			rawX: A(t.x),
			rawY: A(t.y)
		}), t.group !== void 0) {
			let e = (Array.isArray(t.group) ? t.group : [t.group]).map((e) => typeof e == "string" ? e : typeof e == "number" ? String(e) : "").filter((e) => e.trim() !== "");
			if (e.length > 1 && n.push(`文档 "${c}" 声明了多个 group，仅取第一个 "${xe(e[0]).name || e[0]}"`), e.length > 0) {
				let { name: t, geo: n } = xe(e[0]);
				t && a.set(c, {
					name: t,
					geo: n
				});
			}
		}
		r.has(c) && n.push(`重复 id "${c}"：${r.get(c).docPath} 被 ${o} 覆盖`), r.set(c, m);
	}
	let o = [...r.values()], s = new Map(o.map((e) => [e.docPath, e])), c = [], l = /* @__PURE__ */ new Set();
	function u(e) {
		let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md";
		return r.get(t) ?? s.get(t) ?? s.get(n);
	}
	function d(e, t, r, i) {
		let a = u(e), o = u(t);
		if (!a || !o) {
			let r = a ? t : e;
			n.push("连线 " + i + " 引用了不存在的文档 \"" + r + "\"");
			return;
		}
		if (a.id === o.id) {
			n.push("文档 \"" + a.id + "\" 不能连线自身");
			return;
		}
		let s = a.id + "->" + o.id;
		l.has(s) || (l.add(s), c.push({
			id: s,
			type: "link",
			from: a.id,
			to: o.id,
			label: r.label,
			fromSide: r.fromSide,
			toSide: r.toSide
		}));
	}
	for (let t of o) {
		let { params: n } = E(e[t.docPath]);
		for (let e of fe(n.link)) {
			let { ref: n, label: r, fromSide: i, toSide: a } = ye(e);
			n && d(t.id, n, {
				label: r,
				fromSide: i,
				toSide: a
			}, t.id + ".link");
		}
	}
	let f = F(o, c);
	for (let e of o) e.depth = f.get(e.id) ?? 0;
	I(o, c, f, i);
	let p = /* @__PURE__ */ new Map();
	for (let e of o) {
		let t = a.get(e.id);
		if (!t) continue;
		let r = p.get(t.name);
		r || (r = { members: [] }, p.set(t.name, r)), r.members.push(e), t.geo && (r.geo ? (r.geo.x !== t.geo.x || r.geo.y !== t.geo.y || r.geo.w !== t.geo.w || r.geo.h !== t.geo.h) && n.push(`组 "${t.name}" 的显式几何被多个成员声明且不一致，取 ${r.holder} 的声明`) : (r.geo = t.geo, r.holder = e.docPath));
	}
	return {
		boxes: o,
		relations: c,
		groups: [...p.entries()].map(([e, t]) => ({
			name: e,
			members: t.members.map((e) => e.id),
			...Ce(t.members, t.geo),
			explicit: t.geo !== void 0,
			holder: t.holder ?? t.members[0].docPath
		})),
		warnings: n
	};
}
function Ae(e, t) {
	let n = E(e), r = n.params.title;
	if (typeof r == "string" && r.trim()) return r.trim();
	let i = n.body.match(/^#\s+(.+)$/m);
	return i ? i[1].trim() : (t.split("/").pop() ?? t).replace(/\.md$/, "");
}
function je(e) {
	let t = [], n = [], r = /* @__PURE__ */ new Map();
	for (let i of e) {
		let e = E(i.content).params, a = typeof e.id == "string" && e.id.trim() ? e.id.trim() : i.path.replace(/\.md$/, ""), o = typeof e.order == "number" ? e.order : typeof e.order == "string" && Number(e.order) || 0, s = typeof e.parent == "string" && e.parent.trim() ? e.parent.trim() : void 0;
		n.push({
			path: i.path,
			id: a,
			title: Ae(i.content, i.path),
			order: o,
			parent: s
		}), r.has(a) && t.push(`duplicate id "${a}" in tree (${r.get(a)} / ${i.path})`), r.set(a, i.path);
	}
	let i = (e) => {
		if (!e.parent) return;
		let i = r.get(e.parent), a = e.parent.endsWith(".md") ? e.parent : `${e.parent}.md`;
		if (i) return i;
		if (n.some((e) => e.path === a)) return a;
		t.push(`parent "${e.parent}" of ${e.path} not found; falling back to directory level`);
	}, a = /* @__PURE__ */ new Map(), o = (e) => {
		if (a.has(e)) return a.get(e);
		let t = {
			id: e || "___root___",
			title: e ? e.split("/").pop() : "根",
			path: e,
			isDir: !0,
			order: 0,
			children: []
		};
		return a.set(e, t), t;
	}, s = {
		id: "___root___",
		title: "文档",
		path: "",
		isDir: !0,
		order: 0,
		children: []
	};
	a.set("", s);
	for (let e of n) {
		let t = {
			id: e.id,
			title: e.title,
			path: e.path,
			isDir: !1,
			order: e.order,
			parent: e.parent,
			children: []
		};
		a.set(e.path, t);
	}
	for (let e of n) {
		let t = a.get(e.path), n = i(e);
		if (n) {
			let e = n, r = a.get(e);
			if (r) {
				r.children.push(t);
				continue;
			}
			o(e).children.push(t);
			continue;
		}
		let r = e.path.lastIndexOf("/");
		o(r === -1 ? "" : e.path.slice(0, r)).children.push(t);
	}
	for (let e of [...a.keys()]) {
		if (e === "" || e === "___root___") continue;
		let t = a.get(e);
		if (!t.isDir) continue;
		if (t.children.some((t) => t.path === `${e}/index.md`)) {
			let n = e.lastIndexOf("/"), r = n === -1 ? "" : e.slice(0, n), i = a.get(r) ?? s, o = t.children.find((t) => t.path === `${e}/index.md`);
			o && (a.delete(e), i.children = i.children.filter((e) => e !== t), o.isDir = !0, o.children = t.children.filter((e) => e !== o), i.children.push(o), a.set(e, o));
			continue;
		}
		let n = e.lastIndexOf("/"), r = n === -1 ? "" : e.slice(0, n);
		(a.get(r) ?? s).children.push(t);
	}
	let c = (e) => {
		e.children.sort((e, t) => e.isDir === t.isDir ? e.order === t.order ? e.title.localeCompare(t.title) : e.order - t.order : e.isDir ? -1 : 1);
		for (let t of e.children) c(t);
	};
	return c(s), {
		root: s,
		nodeMap: a,
		warnings: t
	};
}
function Me(e) {
	let t = [], n = (e) => {
		t.push(e);
		for (let t of e.children) n(t);
	};
	return n(e), t;
}
//#endregion
//#region src/components/DocGraphViewer.vue?vue&type=script&setup=true&lang.ts
var Ne = { class: "pd-graph-viewer" }, Pe = { class: "pd-graph-header" }, Fe = {
	key: 0,
	class: "pd-graph-current"
}, Ie = { class: "pd-graph-actions" }, Le = ["disabled"], Re = ["disabled"], ze = ["disabled"], Be = { class: "pd-tree-sidebar__head" }, Ve = ["aria-label"], He = {
	key: 0,
	class: "pd-tree-sidebar__nav",
	"aria-label": "文档索引树"
}, Ue = { class: "pd-tree" }, We = { class: "pd-graph-main" }, Ge = ["title", "onPointerdown"], Ke = ["aria-label", "onPointerdown"], qe = ["width", "height"], Je = ["d", "onClick"], Ye = ["d"], Xe = ["x", "y"], Ze = ["d"], Qe = [
	"x1",
	"y1",
	"x2",
	"y2"
], $e = {
	key: 1,
	class: "pd-edge-handles"
}, et = ["cx", "cy"], tt = ["cx", "cy"], nt = ["aria-label"], rt = [
	"aria-label",
	"onPointerdown",
	"onClick",
	"onKeydown",
	"onMouseenter"
], it = { class: "pd-doc-box__head" }, at = { class: "pd-doc-box__title" }, ot = [
	"aria-label",
	"onClick",
	"onKeydown"
], st = ["aria-label", "onPointerdown"], ct = {
	class: "pd-doc-blocks-pop__card",
	role: "menu"
}, lt = [
	"title",
	"aria-label",
	"onClick",
	"onKeydown"
], ut = ["aria-label", "onClick"], dt = 30, L = /* @__PURE__ */ s({
	__name: "DocGraphViewer",
	props: { files: {} },
	emits: ["navigate", "save"],
	setup(s, { emit: m }) {
		let y = s, b = m, x = f(/* @__PURE__ */ new Map()), S = t(() => x.value.size > 0), se = t(() => x.value.size ? {
			...y.files,
			...Object.fromEntries(x.value)
		} : y.files), C = t(() => ke(se.value)), ce = t(() => je(Object.entries(se.value).map(([e, t]) => ({
			path: e,
			content: t
		}))).root), le = t(() => Me(ce.value)), ue = t(() => {
			if (!D.value) return [];
			let e = le.value.find((e) => e.path === D.value && !e.isDir);
			if (!e) return [];
			let t = [], n = (r, i) => {
				if (r === e) return t.push(...i, r), !0;
				for (let e of r.children) if (n(e, [...i, r])) return !0;
				return !1;
			};
			return n(ce.value, []), t;
		}), w = f(!0), T = f({});
		ee(ue, (e) => {
			for (let t of e) t.isDir && (T.value[t.path] = !0);
		}, { immediate: !0 });
		function fe(e) {
			(e.isDir || e.children.length) && (T.value[e.path] = !T.value[e.path]);
		}
		function me(e) {
			e.isDir ? fe(e) : Z(e.path);
		}
		let he = t(() => Object.fromEntries(Object.entries(y.files).map(([e, t]) => [e, E(t).body])));
		ee(() => C.value.warnings, (e) => e.forEach((e) => console.warn("[ProDoc]", e)), { immediate: !0 });
		let D = f(null), O = f(null), k = t(() => {
			let e = 0, t = 0;
			for (let n of I.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			for (let n of L.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			return {
				w: Math.max(e, 640),
				h: Math.max(t, 480)
			};
		});
		function A(e, t) {
			switch (t) {
				case "top": return {
					x: e.x + e.w / 2,
					y: e.y,
					nx: 0,
					ny: -1
				};
				case "bottom": return {
					x: e.x + e.w / 2,
					y: e.y + e.h,
					nx: 0,
					ny: 1
				};
				case "left": return {
					x: e.x,
					y: e.y + e.h / 2,
					nx: -1,
					ny: 0
				};
				default: return {
					x: e.x + e.w,
					y: e.y + e.h / 2,
					nx: 1,
					ny: 0
				};
			}
		}
		function j(e, t) {
			let n = e.x + e.w / 2, r = e.y + e.h / 2, i = t.x + t.w / 2 - n, a = t.y + t.h / 2 - r;
			return Math.abs(a) >= Math.abs(i) ? {
				fs: a >= 0 ? "bottom" : "top",
				ts: a >= 0 ? "top" : "bottom"
			} : {
				fs: i >= 0 ? "right" : "left",
				ts: i >= 0 ? "left" : "right"
			};
		}
		function M(e, t, n, r) {
			let i = j(e, t), a = A(e, n ?? i.fs), o = A(t, r ?? i.ts), s = Math.hypot(o.x - a.x, o.y - a.y), c = Math.max(24, Math.min(s * .45, 96)), l = `M ${a.x} ${a.y} C ${a.x + a.nx * c} ${a.y + a.ny * c}, ${o.x + o.nx * c} ${o.y + o.ny * c}, ${o.x} ${o.y}`;
			return {
				x1: a.x,
				y1: a.y,
				x2: o.x,
				y2: o.y,
				d: l
			};
		}
		let N = t(() => {
			let e = new Map(I.value.map((e) => [e.id, e])), t = J.value;
			return C.value.relations.flatMap((n) => {
				let r = e.get(n.from), i = e.get(n.to);
				if (!r || !i) return [];
				let a = n.fromSide, o = n.toSide;
				t && t.edgeId === n.id && (t.which === "from" ? a = t.side : o = t.side);
				let { x1: s, y1: c, x2: l, y2: u, d } = M(r, i, a, o);
				return [{
					id: n.id,
					fromId: r.id,
					toId: i.id,
					fromTitle: r.title,
					toTitle: i.title,
					label: n.label,
					fromSide: n.fromSide,
					toSide: n.toSide,
					d,
					x1: s,
					y1: c,
					x2: l,
					y2: u,
					labelX: (s + l) / 2,
					labelY: (c + u) / 2 - 7
				}];
			});
		}), P = f(null);
		function xe(e) {
			U.value || G.value || J.value || (P.value = e);
		}
		let we = t(() => {
			if (!P.value) return /* @__PURE__ */ new Set();
			let e = /* @__PURE__ */ new Set([P.value]);
			for (let t of C.value.relations) t.from === P.value && e.add(t.to), t.to === P.value && e.add(t.from);
			return e;
		}), Te = (e) => P.value !== null && !we.value.has(e), Ee = (e) => P.value !== null && (e.fromId === P.value || e.toId === P.value), De = (e) => P.value !== null && !Ee(e), F = f(null), I = t(() => C.value.boxes.map((e) => {
			let t = F.value?.get(e.id);
			return t ? {
				...e,
				x: t.x,
				y: t.y
			} : e;
		}));
		function Ae(e, t) {
			let n = new Map(F.value ?? []);
			n.set(e, t), F.value = n;
		}
		let L = t(() => {
			let e = Y.value, t = X.value;
			return C.value.groups.map((n) => {
				if (t && t.moved && t.name === n.name) return {
					...n,
					x: t.baseRegion.x,
					y: t.baseRegion.y,
					w: t.curW,
					h: t.curH
				};
				if (n.explicit) return e && e.moved && e.name === n.name ? {
					...n,
					x: e.baseRegion.x + e.dx,
					y: e.baseRegion.y + e.dy
				} : n;
				let r = n.members.map((e) => I.value.find((t) => t.id === e)).filter((e) => !!e);
				return {
					...n,
					...Ce(r)
				};
			});
		}), ft = (e) => P.value !== null && !e.members.some((e) => we.value.has(e));
		function pt() {
			F.value = F.value ? null : Oe(C.value.boxes, C.value.relations);
		}
		let mt = (e) => e.blocks.slice(0, 6), ht = (e) => Math.max(0, e.blocks.length - 6), gt = (e) => (mt(e).length + +(ht(e) > 0)) * dt + 12, _t = (e, t) => e.y + e.h + 6 + gt(e) > t, R = f(!1);
		function z(e) {
			return x.value.get(e) ?? y.files[e];
		}
		function B(e, t) {
			let n = new Map(x.value);
			t === y.files[e] ? n.delete(e) : n.set(e, t), x.value = n;
		}
		let V = f(!1);
		function vt() {
			if (!(!S.value || V.value)) {
				V.value = !0;
				for (let [e, t] of x.value) b("save", e, t, y.files[e]);
			}
		}
		function yt() {
			if (!S.value) return;
			let e = new Set([...x.value.keys()].map((e) => C.value.boxes.find((t) => t.docPath === e)?.id).filter((e) => !!e));
			if (x.value = /* @__PURE__ */ new Map(), F.value) {
				let t = new Map(F.value);
				e.forEach((e) => t.delete(e)), F.value = t.size > 0 ? t : null;
			}
			K.value = null, R.value = !1;
		}
		function bt() {
			if (R.value) {
				if (S.value) return;
				K.value = null, R.value = !1;
			} else R.value = !0;
		}
		let xt = f(null);
		function H(e, t) {
			let n = xt.value;
			if (!n) return {
				x: 0,
				y: 0,
				scale: 1
			};
			let r = n.getBoundingClientRect(), i = r.width / k.value.w || 1;
			return {
				x: (e - r.left) / i,
				y: (t - r.top) / i,
				scale: i
			};
		}
		let U = f(null), W = f([]), St = {
			x: [
				"start",
				"center",
				"end"
			],
			y: [
				"start",
				"center",
				"end"
			]
		}, Ct = {
			x: ["end"],
			y: ["end"]
		};
		function wt(e, t) {
			return t === "x" ? {
				start: e.x,
				center: e.x + e.w / 2,
				end: e.x + e.w
			} : {
				start: e.y,
				center: e.y + e.h / 2,
				end: e.y + e.h
			};
		}
		function Tt(e, t, n, r) {
			let i = Math.min(Math.max(8 / n, 4), 12), a = {};
			for (let n of ["x", "y"]) {
				let o = wt(e, n), s = r[n].map((e) => o[e]), c = null;
				for (let e of t) for (let t of Object.values(wt(e, n))) for (let e of s) {
					let n = t - e;
					Math.abs(n) <= i && (c === null || Math.abs(n) < Math.abs(c)) && (c = n);
				}
				c !== null && (a[n === "x" ? "dx" : "dy"] = c);
			}
			return a;
		}
		function Et(e, t, n) {
			let r = [], i = /* @__PURE__ */ new Set();
			for (let a of ["x", "y"]) {
				let o = wt(e, a), s = n[a].map((e) => o[e]);
				for (let n of t) for (let t of Object.values(wt(n, a))) {
					if (!s.some((e) => Math.abs(e - t) < .5)) continue;
					let o = `${a}${t}`, c = a === "x" ? Math.min(e.y, n.y) : Math.min(e.x, n.x), l = a === "x" ? Math.max(e.y + e.h, n.y + n.h) : Math.max(e.x + e.w, n.x + n.w), u = i.has(o) ? r.find((e) => e.axis === a && e.pos === t) : void 0;
					u ? (u.start = Math.min(u.start, c), u.end = Math.max(u.end, l)) : (i.add(o), r.push({
						axis: a,
						pos: t,
						start: c,
						end: l
					}));
				}
			}
			return r;
		}
		function Dt(e, t, n, r) {
			let i = I.value.find((t) => t.id === e);
			if (!i) return {
				x: t,
				y: n,
				guides: []
			};
			let a = I.value.filter((t) => t.id !== e), o = Tt({
				x: t,
				y: n,
				w: i.w,
				h: i.h
			}, a, r, St), s = Math.round(t + (o.dx ?? 0)), c = Math.round(n + (o.dy ?? 0));
			return {
				x: s,
				y: c,
				guides: o.dx !== void 0 || o.dy !== void 0 ? Et({
					x: s,
					y: c,
					w: i.w,
					h: i.h
				}, a, St) : []
			};
		}
		let Ot = !1;
		function kt(e, t) {
			R.value && e.button === 0 && (e.target.closest("button") || (U.value = {
				id: t.id,
				path: t.docPath,
				startClientX: e.clientX,
				startClientY: e.clientY,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				scale: H(e.clientX, e.clientY).scale,
				baseX: t.x,
				baseY: t.y,
				moved: !1,
				raf: 0
			}, window.addEventListener("pointermove", At), window.addEventListener("pointerup", Nt), window.addEventListener("pointercancel", Nt), P.value = null));
		}
		function At(e) {
			let t = U.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(jt));
		}
		function jt() {
			let e = U.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			e.moved = !0;
			let r = Dt(e.id, e.baseX + t, e.baseY + n, e.scale);
			Ae(e.id, {
				x: r.x,
				y: r.y
			}), W.value = r.guides;
		}
		function Mt() {
			let e = U.value;
			if (U.value = null, W.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			Ot = !0;
			let t = F.value?.get(e.id);
			if (!t) return;
			let n = z(e.path);
			n !== void 0 && B(e.path, ve(n, t));
		}
		function Nt() {
			window.removeEventListener("pointermove", At), window.removeEventListener("pointerup", Nt), window.removeEventListener("pointercancel", Nt), Mt();
		}
		function Pt(e) {
			if (Ot) {
				Ot = !1;
				return;
			}
			R.value || Z(e);
		}
		let G = f(null);
		function Ft(e, t) {
			if (!R.value || e.button !== 0) return;
			e.preventDefault();
			let n = H(e.clientX, e.clientY);
			G.value = {
				fromId: t.id,
				x: n.x,
				y: n.y,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", It), window.addEventListener("pointerup", Bt), window.addEventListener("pointercancel", zt), P.value = null;
		}
		function It(e) {
			let t = G.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Lt));
		}
		function Lt() {
			let e = G.value;
			if (!e) return;
			e.raf = 0;
			let t = H(e.lastClientX, e.lastClientY);
			G.value = {
				...e,
				x: t.x,
				y: t.y
			};
		}
		function Rt() {
			window.removeEventListener("pointermove", It), window.removeEventListener("pointerup", Bt), window.removeEventListener("pointercancel", zt);
		}
		function zt() {
			Rt();
			let e = G.value;
			e?.raf && cancelAnimationFrame(e.raf), G.value = null;
		}
		function Bt(e) {
			Rt();
			let t = G.value;
			if (t?.raf && cancelAnimationFrame(t.raf), G.value = null, !t) return;
			let n = H(e.clientX, e.clientY), r = I.value.find((e) => n.x >= e.x && n.x <= e.x + e.w && n.y >= e.y && n.y <= e.y + e.h);
			!r || r.id === t.fromId || C.value.relations.some((e) => e.from === t.fromId && e.to === r.id) || Vt(t.fromId, r.id);
		}
		function Vt(e, t) {
			let n = C.value.boxes.find((t) => t.id === e);
			if (!n) return;
			let r = z(n.docPath);
			r !== void 0 && B(n.docPath, ge(r, [...pe(r), t]));
		}
		let Ht = t(() => {
			let e = G.value;
			if (!e) return null;
			let t = I.value.find((t) => t.id === e.fromId);
			return t ? M(t, {
				x: e.x,
				y: e.y,
				w: 0,
				h: 0
			}).d : null;
		}), K = f(null), q = t(() => N.value.find((e) => e.id === K.value) ?? null);
		function Ut(e) {
			R.value && (K.value = e.id);
		}
		let J = f(null);
		function Wt(e, t, n) {
			let r = t - (e.x + e.w / 2), i = n - (e.y + e.h / 2);
			return Math.abs(r) / (e.w / 2) >= Math.abs(i) / (e.h / 2) ? r >= 0 ? "right" : "left" : i >= 0 ? "bottom" : "top";
		}
		function Gt(e, t, n) {
			if (e.button !== 0) return;
			e.preventDefault(), e.stopPropagation();
			let r = j(I.value.find((e) => e.id === t.fromId), I.value.find((e) => e.id === t.toId));
			J.value = {
				edgeId: t.id,
				which: n,
				side: (n === "from" ? t.fromSide : t.toSide) ?? (n === "from" ? r.fs : r.ts),
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", Kt), window.addEventListener("pointerup", Xt), window.addEventListener("pointercancel", Yt), P.value = null;
		}
		function Kt(e) {
			let t = J.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(qt));
		}
		function qt() {
			let e = J.value;
			if (!e) return;
			e.raf = 0;
			let t = N.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = I.value.find((n) => n.id === (e.which === "from" ? t.fromId : t.toId));
			if (!n) return;
			let r = H(e.lastClientX, e.lastClientY), i = Wt(n, r.x, r.y);
			i !== e.side && (J.value = {
				...e,
				side: i
			});
		}
		function Jt() {
			window.removeEventListener("pointermove", Kt), window.removeEventListener("pointerup", Xt), window.removeEventListener("pointercancel", Yt);
		}
		function Yt() {
			Jt();
			let e = J.value;
			e?.raf && cancelAnimationFrame(e.raf), J.value = null;
		}
		function Xt() {
			Jt();
			let e = J.value;
			if (e?.raf && cancelAnimationFrame(e.raf), J.value = null, !e) return;
			let t = N.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.which === "from" ? e.side : t.fromSide, r = e.which === "to" ? e.side : t.toSide;
			n === t.fromSide && r === t.toSide || Zt(t, n, r);
		}
		function Zt(e, t, n) {
			let r = C.value.boxes.find((t) => t.id === e.fromId);
			if (!r) return;
			let i = z(r.docPath);
			if (i === void 0) return;
			let a = pe(i).map((r) => {
				let i = ye(r);
				return Qt(i.ref) === e.toId ? be({
					ref: i.ref,
					label: i.label,
					fromSide: t,
					toSide: n
				}) : r;
			});
			B(r.docPath, ge(i, a));
		}
		function Qt(e) {
			let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md", r = C.value.boxes;
			return (r.find((e) => e.id === t) ?? r.find((e) => e.docPath === t) ?? r.find((e) => e.docPath === n))?.id;
		}
		function $t() {
			let e = q.value;
			if (!e) return;
			let t = C.value.boxes.find((t) => t.id === e.fromId);
			if (!t) return;
			let n = z(t.docPath);
			if (n === void 0) return;
			let r = pe(n).filter((t) => Qt(ye(t).ref) !== e.toId);
			B(t.docPath, ge(n, r)), K.value = null;
		}
		let Y = f(null), X = f(null);
		function en(e, t) {
			if (!R.value || e.button !== 0) return;
			e.preventDefault();
			let n = L.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = /* @__PURE__ */ new Map();
			for (let e of t.members) {
				let t = I.value.find((t) => t.id === e);
				t && r.set(e, {
					x: t.x,
					y: t.y
				});
			}
			Y.value = {
				name: t.name,
				startClientX: e.clientX,
				startClientY: e.clientY,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				scale: H(e.clientX, e.clientY).scale,
				basePositions: r,
				baseRegion: {
					x: n.x,
					y: n.y,
					w: n.w,
					h: n.h
				},
				dx: 0,
				dy: 0,
				moved: !1,
				raf: 0
			}, window.addEventListener("pointermove", tn), window.addEventListener("pointerup", rn), window.addEventListener("pointercancel", rn), P.value = null;
		}
		function tn(e) {
			let t = Y.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(nn));
		}
		function nn() {
			let e = Y.value;
			if (!e) return;
			e.raf = 0;
			let t = Math.round((e.lastClientX - e.startClientX) / e.scale), n = Math.round((e.lastClientY - e.startClientY) / e.scale);
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = [...I.value.filter((t) => !e.basePositions.has(t.id)), ...L.value.filter((t) => t.name !== e.name)], i = Tt({
				x: e.baseRegion.x + t,
				y: e.baseRegion.y + n,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, e.scale, St), a = t + (i.dx ?? 0), o = n + (i.dy ?? 0);
			Y.value = {
				...e,
				dx: a,
				dy: o,
				moved: !0
			};
			for (let [t, n] of e.basePositions) Ae(t, {
				x: n.x + a,
				y: n.y + o
			});
			W.value = i.dx !== void 0 || i.dy !== void 0 ? Et({
				x: e.baseRegion.x + a,
				y: e.baseRegion.y + o,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, St) : [];
		}
		function rn() {
			window.removeEventListener("pointermove", tn), window.removeEventListener("pointerup", rn), window.removeEventListener("pointercancel", rn);
			let e = Y.value;
			if (Y.value = null, W.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = C.value.groups.find((t) => t.name === e.name);
			if (t) {
				for (let n of t.members) {
					let t = C.value.boxes.find((e) => e.id === n), r = e.basePositions.get(n);
					if (!t || !r) continue;
					let i = z(t.docPath);
					i !== void 0 && B(t.docPath, ve(i, {
						x: r.x + e.dx,
						y: r.y + e.dy
					}));
				}
				if (t.explicit) {
					let n = z(t.holder);
					n !== void 0 && B(t.holder, _e(n, Se({
						name: t.name,
						x: e.baseRegion.x + e.dx,
						y: e.baseRegion.y + e.dy,
						w: e.baseRegion.w,
						h: e.baseRegion.h
					})));
				}
			}
		}
		function an(e, t) {
			if (!R.value || e.button !== 0) return;
			e.preventDefault();
			let n = L.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = t.members.map((e) => I.value.find((t) => t.id === e)).filter((e) => !!e), i = Math.max(...r.map((e) => e.x + e.w)), a = Math.max(...r.map((e) => e.y + e.h));
			X.value = {
				name: t.name,
				startClientX: e.clientX,
				startClientY: e.clientY,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				scale: H(e.clientX, e.clientY).scale,
				baseRegion: {
					x: n.x,
					y: n.y,
					w: n.w,
					h: n.h
				},
				memberIds: new Set(t.members),
				minW: Math.max(48, i - n.x + 24),
				minH: Math.max(48, a - n.y + 24),
				curW: n.w,
				curH: n.h,
				moved: !1,
				raf: 0
			}, window.addEventListener("pointermove", on), window.addEventListener("pointerup", cn), window.addEventListener("pointercancel", cn), P.value = null;
		}
		function on(e) {
			let t = X.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(sn));
		}
		function sn() {
			let e = X.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = Math.round(e.baseRegion.w + t), i = Math.round(e.baseRegion.h + n), a = [...I.value.filter((t) => !e.memberIds.has(t.id)), ...L.value.filter((t) => t.name !== e.name)], o = Tt({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: r,
				h: i
			}, a, e.scale, Ct), s = Math.max(e.minW, Math.round(r + (o.dx ?? 0))), c = Math.max(e.minH, Math.round(i + (o.dy ?? 0)));
			X.value = {
				...e,
				curW: s,
				curH: c,
				moved: !0
			}, W.value = o.dx !== void 0 || o.dy !== void 0 ? Et({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: s,
				h: c
			}, a, Ct) : [];
		}
		function cn() {
			window.removeEventListener("pointermove", on), window.removeEventListener("pointerup", cn), window.removeEventListener("pointercancel", cn);
			let e = X.value;
			if (X.value = null, W.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = C.value.groups.find((t) => t.name === e.name);
			if (!t) return;
			let n = z(t.holder);
			n !== void 0 && B(t.holder, _e(n, Se({
				name: t.name,
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: e.curW,
				h: e.curH
			})));
		}
		function ln(e) {
			D.value || !R.value || !K.value || (e.key === "Delete" || e.key === "Backspace") && (e.preventDefault(), $t());
		}
		typeof window < "u" && window.addEventListener("keydown", ln);
		let un = t(() => D.value ? C.value.boxes.find((e) => e.docPath === D.value)?.title ?? D.value : "");
		function dn() {
			let e = D.value ? `#${encodeURIComponent(D.value)}` : "#";
			history.replaceState(null, "", e);
		}
		function Z(e) {
			y.files[e] && (Q.value = !1, D.value = e, b("navigate", e), dn());
		}
		function fn(e) {
			document.querySelector(`.pd-doc-view [data-heading-id$="-${e}"]`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function pn(e, t) {
			if (D.value === e) {
				fn(t);
				return;
			}
			Z(e), c(() => {
				setTimeout(() => fn(t), 80), setTimeout(() => fn(t), 320);
			});
		}
		function mn() {
			D.value = null, dn(), c(() => requestAnimationFrame(() => O.value?.fit?.()));
		}
		ee(() => y.files, (e) => {
			if (V.value = !1, D.value && !e[D.value] && mn(), x.value.size) {
				let t = new Map(x.value);
				for (let [n, r] of t) (e[n] === r || e[n] === void 0) && t.delete(n);
				x.value = t;
			}
			if (!F.value) return;
			let t = C.value.boxes, n = new Map(F.value);
			for (let [e, r] of n) {
				let i = t.find((t) => t.id === e);
				(!i || i.x === r.x && i.y === r.y) && n.delete(e);
			}
			F.value = n.size > 0 ? n : null;
		});
		let Q = f(!1), $ = f(""), hn = t(() => D.value !== null && $.value !== (y.files[D.value] ?? ""));
		function gn() {
			D.value && ($.value = y.files[D.value] ?? "", Q.value = !0);
		}
		function _n(e) {
			Z(e), gn();
		}
		function vn() {
			Q.value = !1;
		}
		function yn() {
			!D.value || !hn.value || b("save", D.value, $.value, y.files[D.value]);
		}
		function bn(e) {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), yn());
		}
		function xn(e, t) {
			R.value || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), Z(t));
		}
		function Sn(e, t) {
			if (/^(https?:|mailto:|#)/.test(t)) return null;
			let n = t.split("#")[0].trim();
			if (!n.endsWith(".md")) return null;
			let r = n.startsWith("/") ? n.split("/") : [...e.split("/").slice(0, -1), ...n.split("/")], i = [];
			for (let e of r) e === "" || e === "." || (e === ".." ? i.pop() : i.push(e));
			return i.join("/");
		}
		function Cn(e) {
			if (!D.value) return;
			let t = Sn(D.value, e);
			t && Z(t);
		}
		function wn(e) {
			if (!D.value) return;
			let t = y.files[D.value];
			if (t === void 0) return;
			let n = oe(t, e.source, e.id, e.x, e.y);
			n !== t && b("save", D.value, n, t);
		}
		if (typeof window < "u" && window.location.hash.length > 1) {
			let e = decodeURIComponent(window.location.hash.slice(1));
			y.files[e] && (D.value = e);
		}
		return (t, s) => (d(), i("div", Ne, [
			a("header", Pe, [
				s[7] ||= a("span", { class: "pd-graph-brand" }, "📚 ProDoc", -1),
				D.value ? (d(), i("span", Fe, h(un.value), 1)) : r("", !0),
				a("div", Ie, [
					D.value ? r("", !0) : (d(), i(e, { key: 0 }, [R.value ? (d(), i(e, { key: 1 }, [a("button", {
						class: "pd-back-btn",
						disabled: !S.value || V.value,
						onClick: vt
					}, "💾 保存", 8, Le), S.value ? (d(), i("button", {
						key: 0,
						class: "pd-back-btn",
						disabled: V.value,
						onClick: yt
					}, "↩ 放弃更改", 8, Re)) : (d(), i("button", {
						key: 1,
						class: "pd-back-btn pd-back-btn--active",
						onClick: bt
					}, "✓ 完成"))], 64)) : (d(), i("button", {
						key: 0,
						class: "pd-back-btn",
						onClick: bt
					}, "🛠 编辑图")), a("button", {
						class: "pd-back-btn",
						onClick: pt
					}, h(F.value ? "↩ 恢复坐标" : "🧭 分层重排"), 1)], 64)),
					D.value ? (d(), i(e, { key: 1 }, [Q.value ? (d(), i(e, { key: 1 }, [a("button", {
						class: "pd-back-btn",
						disabled: !hn.value,
						onClick: yn
					}, "💾 保存", 8, ze), a("button", {
						class: "pd-back-btn",
						onClick: vn
					}, "👁 预览")], 64)) : (d(), i("button", {
						key: 0,
						class: "pd-back-btn",
						onClick: gn
					}, "✏️ 编辑")), a("button", {
						class: "pd-back-btn",
						onClick: mn
					}, "🗺 返回图")], 64)) : r("", !0),
					o(g(re), { size: "small" })
				])
			]),
			a("aside", { class: l(["pd-tree-sidebar", { "pd-tree-sidebar--hidden": D.value !== "" }]) }, [a("div", Be, [s[8] ||= a("span", null, "文档索引", -1), a("button", {
				type: "button",
				class: "pd-tree-sidebar__collapse",
				"aria-label": w.value ? "收起索引" : "展开索引",
				onClick: s[0] ||= (e) => w.value = !w.value
			}, h(w.value ? "⟨" : "⟩"), 9, Ve)]), w.value ? (d(), i("nav", He, [a("ul", Ue, [(d(!0), i(e, null, p(ce.value.children, (e) => (d(), i("li", { key: e.path || e.id }, [o(de, {
				node: e,
				expanded: T.value,
				"current-path": D.value ?? "",
				onToggle: fe,
				onOpen: me
			}, null, 8, [
				"node",
				"expanded",
				"current-path"
			])]))), 128))])])) : r("", !0)], 2),
			a("div", We, [D.value ? (d(), i("div", {
				key: 1,
				class: l(["pd-doc-view", { "pd-doc-view--editing": Q.value }])
			}, [Q.value ? (d(), n(g(ie), {
				key: D.value,
				value: $.value,
				class: "pd-doc-editor",
				onChange: s[6] ||= (e) => $.value = e,
				onKeydown: bn
			}, null, 8, ["value"])) : (d(), n(g(ae), {
				key: D.value,
				content: he.value[D.value],
				"show-toc": !0,
				"flow-editable": !0,
				onDocLink: Cn,
				onFlowNodeMove: wn
			}, null, 8, ["content"]))], 2)) : (d(), n(g(ne), {
				key: 0,
				ref_key: "canvasRef",
				ref: O,
				width: "100%",
				height: "100%",
				"show-grid": "",
				"grid-variant": "dots",
				"show-fit": "",
				"min-zoom": .25,
				"max-zoom": 3
			}, {
				default: te(() => [a("div", {
					ref_key: "stageEl",
					ref: xt,
					class: l(["pd-graph-stage", {
						"pd-graph-stage--dragging": U.value?.moved || G.value || J.value || Y.value?.moved || X.value?.moved,
						"pd-graph-stage--editing": R.value
					}]),
					style: u({
						width: `${k.value.w}px`,
						height: `${k.value.h}px`
					}),
					onClick: s[5] ||= (e) => K.value = null
				}, [
					(d(!0), i(e, null, p(L.value, (e) => (d(), i("div", {
						key: "group-" + e.name,
						class: l(["pd-doc-group", { "pd-dim": ft(e) }]),
						style: u({
							left: `${e.x}px`,
							top: `${e.y}px`,
							width: `${e.w}px`,
							height: `${e.h}px`
						})
					}, [a("span", {
						class: "pd-doc-group__label",
						title: R.value ? `拖动移动整组「${e.name}」` : e.name,
						"data-nm-no-pan": "",
						onPointerdown: (t) => en(t, e)
					}, h(e.name), 41, Ge), R.value ? (d(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-group__resize",
						"aria-label": `调整组「${e.name}」的区域尺寸`,
						title: "拖动调整区域尺寸",
						"data-nm-no-pan": "",
						onPointerdown: v((t) => an(t, e), ["stop"])
					}, null, 40, Ke)) : r("", !0)], 6))), 128)),
					N.value.length || Ht.value ? (d(), i("svg", {
						key: 0,
						class: "pd-relation-layer",
						width: k.value.w,
						height: k.value.h,
						"aria-label": "文档连线"
					}, [
						s[11] ||= a("defs", null, [a("marker", {
							id: "pd-relation-arrow",
							markerWidth: "8",
							markerHeight: "8",
							refX: "7",
							refY: "4",
							orient: "auto",
							markerUnits: "strokeWidth"
						}, [a("path", {
							d: "M 0 0 L 8 4 L 0 8 z",
							class: "pd-relation-arrow"
						})])], -1),
						(d(!0), i(e, null, p(N.value, (e) => (d(), i("g", {
							key: e.id,
							class: l(["pd-relation", {
								"pd-dim": De(e),
								"pd-hot": Ee(e),
								"pd-selected": e.id === K.value
							}])
						}, [
							a("title", null, h(e.fromTitle) + " → " + h(e.toTitle) + h(e.label ? `（${e.label}）` : ""), 1),
							a("path", {
								class: "pd-relation-hit",
								d: e.d,
								fill: "none",
								onClick: v((t) => Ut(e), ["stop"])
							}, null, 8, Je),
							a("path", {
								d: e.d,
								fill: "none",
								"marker-end": "url(#pd-relation-arrow)",
								"pointer-events": "none"
							}, null, 8, Ye),
							e.label ? (d(), i("text", {
								key: 0,
								x: e.labelX,
								y: e.labelY,
								"pointer-events": "none"
							}, h(e.label), 9, Xe)) : r("", !0)
						], 2))), 128)),
						Ht.value ? (d(), i("path", {
							key: 0,
							class: "pd-relation-draft",
							d: Ht.value,
							fill: "none"
						}, null, 8, Ze)) : r("", !0),
						(d(!0), i(e, null, p(W.value, (e, t) => (d(), i("line", {
							key: "guide" + t,
							class: "pd-guide",
							x1: e.axis === "x" ? e.pos : e.start,
							y1: e.axis === "x" ? e.start : e.pos,
							x2: e.axis === "x" ? e.pos : e.end,
							y2: e.axis === "x" ? e.end : e.pos
						}, null, 8, Qe))), 128)),
						R.value && q.value ? (d(), i("g", $e, [a("circle", {
							class: "pd-edge-handle",
							cx: q.value.x1,
							cy: q.value.y1,
							r: "6",
							onPointerdown: s[1] ||= v((e) => Gt(e, q.value, "from"), ["stop"])
						}, [...s[9] ||= [a("title", null, "拖动调整源框连接边", -1)]], 40, et), a("circle", {
							class: "pd-edge-handle",
							cx: q.value.x2,
							cy: q.value.y2,
							r: "6",
							onPointerdown: s[2] ||= v((e) => Gt(e, q.value, "to"), ["stop"])
						}, [...s[10] ||= [a("title", null, "拖动调整目标框连接边", -1)]], 40, tt)])) : r("", !0)
					], 8, qe)) : r("", !0),
					R.value && q.value ? (d(), i("button", {
						key: 1,
						type: "button",
						class: "pd-edge-delete",
						style: u({
							left: `${q.value.labelX}px`,
							top: `${q.value.labelY}px`
						}),
						"aria-label": `删除连线 ${q.value.fromTitle} → ${q.value.toTitle}`,
						title: "删除连线（Delete）",
						onClick: v($t, ["stop"])
					}, "✕", 12, nt)) : r("", !0),
					(d(!0), i(e, null, p(I.value, (t) => (d(), i("div", {
						key: t.id,
						class: l(["pd-doc-box", [`pd-doc-box--d${Math.min(t.depth, 3)}`, { "pd-dim": Te(t.id) }]]),
						style: u({
							left: `${t.x}px`,
							top: `${t.y}px`,
							width: `${t.w}px`,
							height: `${t.h}px`
						}),
						role: "link",
						tabindex: "0",
						"aria-label": `${t.title}（跳转到文档）`,
						"data-nm-no-pan": "",
						onPointerdown: (e) => kt(e, t),
						onClick: (e) => Pt(t.docPath),
						onKeydown: (e) => xn(e, t.docPath),
						onMouseenter: (e) => xe(t.id),
						onMouseleave: s[4] ||= (e) => xe(null)
					}, [
						a("div", it, [a("span", at, h(t.title), 1), s[12] ||= a("span", {
							class: "pd-doc-box__icon",
							"aria-hidden": "true"
						}, "↗", -1)]),
						R.value ? r("", !0) : (d(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-box__edit",
							"aria-label": `编辑 ${t.title}`,
							title: "编辑文档",
							onClick: v((e) => _n(t.docPath), ["stop"]),
							onKeydown: [_(v((e) => _n(t.docPath), ["stop"]), ["enter"]), _(v((e) => _n(t.docPath), ["stop"]), ["space"])]
						}, "✏️", 40, ot)),
						R.value ? (d(), i("button", {
							key: 1,
							type: "button",
							class: "pd-doc-box__link-handle",
							"aria-label": `从 ${t.title} 创建连线（拖到目标框）`,
							title: "拖到其他框创建连线",
							onPointerdown: v((e) => Ft(e, t), ["stop"]),
							onClick: s[3] ||= v(() => {}, ["stop"])
						}, null, 40, st)) : r("", !0),
						t.blocks.length && !R.value ? (d(), i("div", {
							key: 2,
							class: l(["pd-doc-blocks-pop", { "pd-doc-blocks-pop--above": _t(t, k.value.h) }])
						}, [a("div", ct, [(d(!0), i(e, null, p(mt(t), (e) => (d(), i("button", {
							key: e.anchor,
							type: "button",
							class: "pd-doc-blocks-pop__item",
							title: e.title,
							"aria-label": `跳转到「${e.title}」分块`,
							onClick: v((n) => pn(t.docPath, e.anchor), ["stop"]),
							onKeydown: [_(v((n) => pn(t.docPath, e.anchor), ["stop"]), ["enter"]), _(v((n) => pn(t.docPath, e.anchor), ["stop"]), ["space"])]
						}, "▸ " + h(e.title), 41, lt))), 128)), ht(t) > 0 ? (d(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more",
							"aria-label": `查看全部 ${t.blocks.length} 个分块`,
							onClick: v((e) => Z(t.docPath), ["stop"])
						}, "+" + h(ht(t)) + " 更多分块…", 9, ut)) : r("", !0)])], 2)) : r("", !0)
					], 46, rt))), 128))
				], 6)]),
				_: 1
			}, 512))])
		]));
	}
});
//#endregion
export { y as DocFlowCanvas, L as DocGraphViewer, b as DocViewer, x as MarkdownRenderer };

//# sourceMappingURL=index.js.map