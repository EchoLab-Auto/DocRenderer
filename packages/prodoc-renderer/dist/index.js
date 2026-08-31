import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createVNode as o, defineComponent as s, nextTick as c, normalizeClass as l, normalizeStyle as u, onMounted as d, openBlock as f, ref as p, renderList as m, resolveComponent as ee, toDisplayString as h, unref as g, watch as te, withCtx as ne, withKeys as _, withModifiers as v } from "vue";
import { NeumorphismCanvas as re, NeumorphismThemeToggle as ie } from "@echolab-auto/ui-frame";
import { DocFlowCanvas as y, DocViewer as b, MarkdownEditor as ae, MarkdownRenderer as x, MarkdownRenderer as oe, writeFlowNodePosition as se } from "@echolab-auto/ui-frame/doc";
import "@echolab-auto/ui-frame/dist/style.css";
//#region src/components/DocTreeItem.vue?vue&type=script&setup=true&lang.ts
var S = { class: "pd-tree-node" }, ce = ["title"], C = {
	class: "pd-tree-icon",
	"aria-hidden": "true"
}, w = { class: "pd-tree-title" }, le = {
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
			let u = ee("DocTreeItem", !0);
			return f(), i("li", S, [a("div", {
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
				a("span", w, h(t.node.title), 1),
				t.node.order ? (f(), i("span", le, "#" + h(t.node.order), 1)) : r("", !0)
			], 42, ce), t.node.children.length && t.expanded[t.node.path] ? (f(), i("ul", ue, [(f(!0), i(e, null, m(t.node.children, (e) => (f(), n(u, {
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
function T(e) {
	let t = [], n = "", r = null;
	for (let i of e) r ? (n += i, i === r && (r = null)) : i === "\"" || i === "'" ? (r = i, n += i) : i === "," ? (t.push(n), n = "") : n += i;
	return t.push(n), t;
}
function E(e) {
	let t = e.trim();
	if (t === "") return "";
	if (t.startsWith("[") && t.endsWith("]")) return T(t.slice(1, -1)).map((e) => E(e)).filter((e) => e !== "");
	if (t === "true") return !0;
	if (t === "false") return !1;
	if (/^-?\d+$/.test(t)) return parseInt(t, 10);
	if (/^-?\d*\.\d+$/.test(t)) return parseFloat(t);
	let n = t.match(/^(["'])([\s\S]*)\1$/);
	return n ? n[2] : t;
}
function D(e) {
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
		t && (i[t[1]] = E(t[2]));
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
	return fe(D(e).params.link);
}
function me(e) {
	return e === "" || e !== e.trim() || /[|,"]/.test(e) ? e.includes("\"") ? `'${e}'` : `"${e}"` : e;
}
function he(e, t, n) {
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!D(e).hasFrame) return n === null ? e : `---${r}${n}${r}---${r}${e}`;
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
	if (!D(e).hasFrame) return `---${r}${n.map(([e, t]) => `${e}: ${t}`).join(r)}${r}---${r}${e}`;
	let i = e.split(/\r?\n/), a = i.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (a === -1) return e;
	let o = a;
	for (let [e, t] of n) {
		let n = RegExp(`^${e}\\s*:`), r = i.slice(1, o).findIndex((e) => n.test(e));
		r >= 0 ? i[r + 1] = `${e}: ${t}` : (i.splice(o, 0, `${e}: ${t}`), o++);
	}
	return i.join(r);
}
var O = 72, k = 48, A = /* @__PURE__ */ new Set([
	"id",
	"title",
	"x",
	"y",
	"w",
	"h",
	"link",
	"group"
]);
function j(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
var ye = {
	t: "top",
	r: "right",
	b: "bottom",
	l: "left"
}, be = {
	top: "t",
	right: "r",
	bottom: "b",
	left: "l"
}, M = /^([trbl_])>([trbl_])$/;
function xe(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(M);
		t ? (t[1] !== "_" && (n.fromSide = ye[t[1]]), t[2] !== "_" && (n.toSide = ye[t[2]])) : e !== "" && (n.label = e);
	}
	return n;
}
function Se(e) {
	let t = e.ref;
	if (e.label && (t += ` | ${e.label}`), e.fromSide || e.toSide) {
		let n = e.fromSide ? be[e.fromSide] : "_", r = e.toSide ? be[e.toSide] : "_";
		t += ` | ${n}>${r}`;
	}
	return t;
}
var N = /^(.*)\s*@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
function P(e) {
	let t = e.match(N);
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
function Ce(e) {
	let { name: t, x: n, y: r, w: i, h: a } = e;
	return [
		n,
		r,
		i,
		a
	].every((e) => typeof e == "number" && Number.isFinite(e)) ? `${t} @ ${n}, ${r}, ${i}, ${a}` : t;
}
function we(e, t) {
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
function Te(e) {
	let t = e.match(/^#[ \t]+(.+)$/m);
	return t ? t[1].trim() : void 0;
}
function Ee(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
}
function De(e) {
	return e.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_~]/g, "").replace(/<[^>]+>/g, "").trim();
}
function Oe(e) {
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
			let e = De(i[1]);
			e && t.push({
				anchor: Ee(e),
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
	let u = [...l.keys()].sort((e, t) => e - t), d = k;
	for (let e of u) {
		let t = l.get(e), n = t.map((e, n) => {
			let r = (c.get(e.box.id) ?? []).map((e) => s.get(e)).filter((e) => e !== void 0);
			return {
				auto: e,
				bary: r.length ? r.reduce((e, t) => e + t, 0) / r.length : 2 ** 53 - 1 - (t.length - n)
			};
		});
		n.sort((e, t) => e.bary - t.bary);
		let i = n.map((e) => e.auto), u = d, f = 0, p = k, m = 0;
		for (let { box: e } of i) {
			m === a && (u += f + O, f = 0, p = k, m = 0);
			let t = r.get(e.id);
			t.rawX === void 0 && (e.x = p), t.rawY === void 0 && (e.y = u), s.set(e.id, o(e)), p += e.w + 64, f = Math.max(f, e.h), m++;
		}
		d = u + f + O;
	}
}
function ke(e, t) {
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
function Ae(e) {
	let t = Object.keys(e).sort(), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let o of t) {
		let { params: t, body: s } = D(e[o]), c = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : o.replace(/\.md$/, ""), l = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || Te(s) || c, u = Oe(s), d = j(t.w) ?? 220, f = j(t.h) ?? 96, p = {};
		for (let [e, n] of Object.entries(t)) A.has(e) || (p[e] = n);
		let m = {
			id: c,
			title: l,
			docPath: o,
			depth: 0,
			blocks: u,
			x: j(t.x) ?? 0,
			y: j(t.y) ?? 0,
			w: d,
			h: f,
			attrs: p
		};
		if (i.set(c, {
			rawX: j(t.x),
			rawY: j(t.y)
		}), t.group !== void 0) {
			let e = (Array.isArray(t.group) ? t.group : [t.group]).map((e) => typeof e == "string" ? e : typeof e == "number" ? String(e) : "").filter((e) => e.trim() !== "");
			if (e.length > 1 && n.push(`文档 "${c}" 声明了多个 group，仅取第一个 "${P(e[0]).name || e[0]}"`), e.length > 0) {
				let { name: t, geo: n } = P(e[0]);
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
		let { params: n } = D(e[t.docPath]);
		for (let e of fe(n.link)) {
			let { ref: n, label: r, fromSide: i, toSide: a } = xe(e);
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
			...we(t.members, t.geo),
			explicit: t.geo !== void 0,
			holder: t.holder ?? t.members[0].docPath
		})),
		warnings: n
	};
}
function je(e, t) {
	let n = D(e), r = n.params.title;
	if (typeof r == "string" && r.trim()) return r.trim();
	let i = n.body.match(/^#\s+(.+)$/m);
	return i ? i[1].trim() : (t.split("/").pop() ?? t).replace(/\.md$/, "");
}
function Me(e) {
	let t = [], n = [], r = /* @__PURE__ */ new Map();
	for (let i of e) {
		let e = D(i.content).params, a = typeof e.id == "string" && e.id.trim() ? e.id.trim() : i.path.replace(/\.md$/, ""), o = typeof e.order == "number" ? e.order : typeof e.order == "string" && Number(e.order) || 0, s = typeof e.parent == "string" && e.parent.trim() ? e.parent.trim() : void 0;
		n.push({
			path: i.path,
			id: a,
			title: je(i.content, i.path),
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
function Ne(e) {
	let t = [], n = (e) => {
		t.push(e);
		for (let t of e.children) n(t);
	};
	return n(e), t;
}
//#endregion
//#region src/components/DocGraphViewer.vue?vue&type=script&setup=true&lang.ts
var Pe = { class: "pd-graph-viewer" }, Fe = { class: "pd-graph-header" }, Ie = {
	key: 0,
	class: "pd-graph-current"
}, Le = { class: "pd-graph-actions" }, Re = ["disabled"], ze = ["disabled"], Be = ["disabled"], Ve = { class: "pd-tree-sidebar__head" }, He = ["aria-label"], Ue = {
	key: 0,
	class: "pd-tree-sidebar__nav",
	"aria-label": "文档索引树"
}, We = { class: "pd-tree" }, Ge = { class: "pd-graph-main" }, Ke = ["title", "onPointerdown"], qe = ["aria-label", "onPointerdown"], Je = ["width", "height"], Ye = ["d", "onClick"], Xe = ["d"], Ze = ["x", "y"], Qe = ["d"], $e = [
	"x1",
	"y1",
	"x2",
	"y2"
], et = {
	key: 1,
	class: "pd-edge-handles"
}, tt = ["cx", "cy"], nt = ["cx", "cy"], rt = ["aria-label"], it = [
	"aria-label",
	"onPointerdown",
	"onClick",
	"onKeydown",
	"onMouseenter"
], at = { class: "pd-doc-box__head" }, ot = { class: "pd-doc-box__title" }, st = [
	"aria-label",
	"onClick",
	"onKeydown"
], ct = ["aria-label", "onPointerdown"], lt = {
	class: "pd-doc-blocks-pop__card",
	role: "menu"
}, ut = [
	"title",
	"aria-label",
	"onClick",
	"onKeydown"
], dt = ["aria-label", "onClick"], ft = 30, L = /* @__PURE__ */ s({
	__name: "DocGraphViewer",
	props: { files: {} },
	emits: ["navigate", "save"],
	setup(s, { emit: ee }) {
		let y = s, b = ee, x = p(/* @__PURE__ */ new Map()), S = t(() => x.value.size > 0), ce = t(() => x.value.size ? {
			...y.files,
			...Object.fromEntries(x.value)
		} : y.files), C = t(() => Ae(ce.value)), w = t(() => Me(Object.entries(ce.value).map(([e, t]) => ({
			path: e,
			content: t
		}))).root), le = t(() => Ne(w.value)), ue = t(() => {
			if (!O.value) return [];
			let e = le.value.find((e) => e.path === O.value && !e.isDir);
			if (!e) return [];
			let t = [], n = (r, i) => {
				if (r === e) return t.push(...i, r), !0;
				for (let e of r.children) if (n(e, [...i, r])) return !0;
				return !1;
			};
			return n(w.value, []), t;
		}), T = p(!0), E = p({});
		te(() => O.value, () => {
			for (let e of ue.value) e.isDir && (E.value[e.path] = !0);
		}), d(() => {
			for (let e of w.value.children) e.isDir && (E.value[e.path] = !0);
		});
		function fe(e) {
			(e.isDir || e.children.length) && (E.value[e.path] = !E.value[e.path]);
		}
		function me(e) {
			e.isDir ? fe(e) : Z(e.path);
		}
		let he = t(() => Object.fromEntries(Object.entries(y.files).map(([e, t]) => [e, D(t).body])));
		te(() => C.value.warnings, (e) => e.forEach((e) => console.warn("[ProDoc]", e)), { immediate: !0 });
		let O = p(null), k = p(null), A = t(() => {
			let e = 0, t = 0;
			for (let n of I.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			for (let n of L.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			return {
				w: Math.max(e, 640),
				h: Math.max(t, 480)
			};
		});
		function j(e, t) {
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
		function ye(e, t) {
			let n = e.x + e.w / 2, r = e.y + e.h / 2, i = t.x + t.w / 2 - n, a = t.y + t.h / 2 - r;
			return Math.abs(a) >= Math.abs(i) ? {
				fs: a >= 0 ? "bottom" : "top",
				ts: a >= 0 ? "top" : "bottom"
			} : {
				fs: i >= 0 ? "right" : "left",
				ts: i >= 0 ? "left" : "right"
			};
		}
		function be(e, t, n, r) {
			let i = ye(e, t), a = j(e, n ?? i.fs), o = j(t, r ?? i.ts), s = Math.hypot(o.x - a.x, o.y - a.y), c = Math.max(24, Math.min(s * .45, 96)), l = `M ${a.x} ${a.y} C ${a.x + a.nx * c} ${a.y + a.ny * c}, ${o.x + o.nx * c} ${o.y + o.ny * c}, ${o.x} ${o.y}`;
			return {
				x1: a.x,
				y1: a.y,
				x2: o.x,
				y2: o.y,
				d: l
			};
		}
		let M = t(() => {
			let e = new Map(I.value.map((e) => [e.id, e])), t = J.value;
			return C.value.relations.flatMap((n) => {
				let r = e.get(n.from), i = e.get(n.to);
				if (!r || !i) return [];
				let a = n.fromSide, o = n.toSide;
				t && t.edgeId === n.id && (t.which === "from" ? a = t.side : o = t.side);
				let { x1: s, y1: c, x2: l, y2: u, d } = be(r, i, a, o);
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
		}), N = p(null);
		function P(e) {
			U.value || G.value || J.value || (N.value = e);
		}
		let Te = t(() => {
			if (!N.value) return /* @__PURE__ */ new Set();
			let e = /* @__PURE__ */ new Set([N.value]);
			for (let t of C.value.relations) t.from === N.value && e.add(t.to), t.to === N.value && e.add(t.from);
			return e;
		}), Ee = (e) => N.value !== null && !Te.value.has(e), De = (e) => N.value !== null && (e.fromId === N.value || e.toId === N.value), Oe = (e) => N.value !== null && !De(e), F = p(null), I = t(() => C.value.boxes.map((e) => {
			let t = F.value?.get(e.id);
			return t ? {
				...e,
				x: t.x,
				y: t.y
			} : e;
		}));
		function je(e, t) {
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
					...we(r)
				};
			});
		}), pt = (e) => N.value !== null && !e.members.some((e) => Te.value.has(e));
		function mt() {
			F.value = F.value ? null : ke(C.value.boxes, C.value.relations);
		}
		let ht = (e) => e.blocks.slice(0, 6), gt = (e) => Math.max(0, e.blocks.length - 6), _t = (e) => (ht(e).length + +(gt(e) > 0)) * ft + 12, vt = (e, t) => e.y + e.h + 6 + _t(e) > t, R = p(!1);
		function z(e) {
			return x.value.get(e) ?? y.files[e];
		}
		function B(e, t) {
			let n = new Map(x.value);
			t === y.files[e] ? n.delete(e) : n.set(e, t), x.value = n;
		}
		let V = p(!1);
		function yt() {
			if (!(!S.value || V.value)) {
				V.value = !0;
				for (let [e, t] of x.value) b("save", e, t, y.files[e]);
			}
		}
		function bt() {
			if (!S.value) return;
			let e = new Set([...x.value.keys()].map((e) => C.value.boxes.find((t) => t.docPath === e)?.id).filter((e) => !!e));
			if (x.value = /* @__PURE__ */ new Map(), F.value) {
				let t = new Map(F.value);
				e.forEach((e) => t.delete(e)), F.value = t.size > 0 ? t : null;
			}
			K.value = null, R.value = !1;
		}
		function xt() {
			if (R.value) {
				if (S.value) return;
				K.value = null, R.value = !1;
			} else R.value = !0;
		}
		let St = p(null);
		function H(e, t) {
			let n = St.value;
			if (!n) return {
				x: 0,
				y: 0,
				scale: 1
			};
			let r = n.getBoundingClientRect(), i = r.width / A.value.w || 1;
			return {
				x: (e - r.left) / i,
				y: (t - r.top) / i,
				scale: i
			};
		}
		let U = p(null), W = p([]), Ct = {
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
		}, wt = {
			x: ["end"],
			y: ["end"]
		};
		function Tt(e, t) {
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
		function Et(e, t, n, r) {
			let i = Math.min(Math.max(8 / n, 4), 12), a = {};
			for (let n of ["x", "y"]) {
				let o = Tt(e, n), s = r[n].map((e) => o[e]), c = null;
				for (let e of t) for (let t of Object.values(Tt(e, n))) for (let e of s) {
					let n = t - e;
					Math.abs(n) <= i && (c === null || Math.abs(n) < Math.abs(c)) && (c = n);
				}
				c !== null && (a[n === "x" ? "dx" : "dy"] = c);
			}
			return a;
		}
		function Dt(e, t, n) {
			let r = [], i = /* @__PURE__ */ new Set();
			for (let a of ["x", "y"]) {
				let o = Tt(e, a), s = n[a].map((e) => o[e]);
				for (let n of t) for (let t of Object.values(Tt(n, a))) {
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
		function Ot(e, t, n, r) {
			let i = I.value.find((t) => t.id === e);
			if (!i) return {
				x: t,
				y: n,
				guides: []
			};
			let a = I.value.filter((t) => t.id !== e), o = Et({
				x: t,
				y: n,
				w: i.w,
				h: i.h
			}, a, r, Ct), s = Math.round(t + (o.dx ?? 0)), c = Math.round(n + (o.dy ?? 0));
			return {
				x: s,
				y: c,
				guides: o.dx !== void 0 || o.dy !== void 0 ? Dt({
					x: s,
					y: c,
					w: i.w,
					h: i.h
				}, a, Ct) : []
			};
		}
		let kt = !1;
		function At(e, t) {
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
			}, window.addEventListener("pointermove", jt), window.addEventListener("pointerup", Pt), window.addEventListener("pointercancel", Pt), N.value = null));
		}
		function jt(e) {
			let t = U.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Mt));
		}
		function Mt() {
			let e = U.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			e.moved = !0;
			let r = Ot(e.id, e.baseX + t, e.baseY + n, e.scale);
			je(e.id, {
				x: r.x,
				y: r.y
			}), W.value = r.guides;
		}
		function Nt() {
			let e = U.value;
			if (U.value = null, W.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			kt = !0;
			let t = F.value?.get(e.id);
			if (!t) return;
			let n = z(e.path);
			n !== void 0 && B(e.path, ve(n, t));
		}
		function Pt() {
			window.removeEventListener("pointermove", jt), window.removeEventListener("pointerup", Pt), window.removeEventListener("pointercancel", Pt), Nt();
		}
		function Ft(e) {
			if (kt) {
				kt = !1;
				return;
			}
			R.value || Z(e);
		}
		let G = p(null);
		function It(e, t) {
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
			}, window.addEventListener("pointermove", Lt), window.addEventListener("pointerup", Vt), window.addEventListener("pointercancel", Bt), N.value = null;
		}
		function Lt(e) {
			let t = G.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Rt));
		}
		function Rt() {
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
		function zt() {
			window.removeEventListener("pointermove", Lt), window.removeEventListener("pointerup", Vt), window.removeEventListener("pointercancel", Bt);
		}
		function Bt() {
			zt();
			let e = G.value;
			e?.raf && cancelAnimationFrame(e.raf), G.value = null;
		}
		function Vt(e) {
			zt();
			let t = G.value;
			if (t?.raf && cancelAnimationFrame(t.raf), G.value = null, !t) return;
			let n = H(e.clientX, e.clientY), r = I.value.find((e) => n.x >= e.x && n.x <= e.x + e.w && n.y >= e.y && n.y <= e.y + e.h);
			!r || r.id === t.fromId || C.value.relations.some((e) => e.from === t.fromId && e.to === r.id) || Ht(t.fromId, r.id);
		}
		function Ht(e, t) {
			let n = C.value.boxes.find((t) => t.id === e);
			if (!n) return;
			let r = z(n.docPath);
			r !== void 0 && B(n.docPath, ge(r, [...pe(r), t]));
		}
		let Ut = t(() => {
			let e = G.value;
			if (!e) return null;
			let t = I.value.find((t) => t.id === e.fromId);
			return t ? be(t, {
				x: e.x,
				y: e.y,
				w: 0,
				h: 0
			}).d : null;
		}), K = p(null), q = t(() => M.value.find((e) => e.id === K.value) ?? null);
		function Wt(e) {
			R.value && (K.value = e.id);
		}
		let J = p(null);
		function Gt(e, t, n) {
			let r = t - (e.x + e.w / 2), i = n - (e.y + e.h / 2);
			return Math.abs(r) / (e.w / 2) >= Math.abs(i) / (e.h / 2) ? r >= 0 ? "right" : "left" : i >= 0 ? "bottom" : "top";
		}
		function Kt(e, t, n) {
			if (e.button !== 0) return;
			e.preventDefault(), e.stopPropagation();
			let r = ye(I.value.find((e) => e.id === t.fromId), I.value.find((e) => e.id === t.toId));
			J.value = {
				edgeId: t.id,
				which: n,
				side: (n === "from" ? t.fromSide : t.toSide) ?? (n === "from" ? r.fs : r.ts),
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", qt), window.addEventListener("pointerup", Zt), window.addEventListener("pointercancel", Xt), N.value = null;
		}
		function qt(e) {
			let t = J.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Jt));
		}
		function Jt() {
			let e = J.value;
			if (!e) return;
			e.raf = 0;
			let t = M.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = I.value.find((n) => n.id === (e.which === "from" ? t.fromId : t.toId));
			if (!n) return;
			let r = H(e.lastClientX, e.lastClientY), i = Gt(n, r.x, r.y);
			i !== e.side && (J.value = {
				...e,
				side: i
			});
		}
		function Yt() {
			window.removeEventListener("pointermove", qt), window.removeEventListener("pointerup", Zt), window.removeEventListener("pointercancel", Xt);
		}
		function Xt() {
			Yt();
			let e = J.value;
			e?.raf && cancelAnimationFrame(e.raf), J.value = null;
		}
		function Zt() {
			Yt();
			let e = J.value;
			if (e?.raf && cancelAnimationFrame(e.raf), J.value = null, !e) return;
			let t = M.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.which === "from" ? e.side : t.fromSide, r = e.which === "to" ? e.side : t.toSide;
			n === t.fromSide && r === t.toSide || Qt(t, n, r);
		}
		function Qt(e, t, n) {
			let r = C.value.boxes.find((t) => t.id === e.fromId);
			if (!r) return;
			let i = z(r.docPath);
			if (i === void 0) return;
			let a = pe(i).map((r) => {
				let i = xe(r);
				return $t(i.ref) === e.toId ? Se({
					ref: i.ref,
					label: i.label,
					fromSide: t,
					toSide: n
				}) : r;
			});
			B(r.docPath, ge(i, a));
		}
		function $t(e) {
			let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md", r = C.value.boxes;
			return (r.find((e) => e.id === t) ?? r.find((e) => e.docPath === t) ?? r.find((e) => e.docPath === n))?.id;
		}
		function en() {
			let e = q.value;
			if (!e) return;
			let t = C.value.boxes.find((t) => t.id === e.fromId);
			if (!t) return;
			let n = z(t.docPath);
			if (n === void 0) return;
			let r = pe(n).filter((t) => $t(xe(t).ref) !== e.toId);
			B(t.docPath, ge(n, r)), K.value = null;
		}
		let Y = p(null), X = p(null);
		function tn(e, t) {
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
			}, window.addEventListener("pointermove", nn), window.addEventListener("pointerup", an), window.addEventListener("pointercancel", an), N.value = null;
		}
		function nn(e) {
			let t = Y.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(rn));
		}
		function rn() {
			let e = Y.value;
			if (!e) return;
			e.raf = 0;
			let t = Math.round((e.lastClientX - e.startClientX) / e.scale), n = Math.round((e.lastClientY - e.startClientY) / e.scale);
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = [...I.value.filter((t) => !e.basePositions.has(t.id)), ...L.value.filter((t) => t.name !== e.name)], i = Et({
				x: e.baseRegion.x + t,
				y: e.baseRegion.y + n,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, e.scale, Ct), a = t + (i.dx ?? 0), o = n + (i.dy ?? 0);
			Y.value = {
				...e,
				dx: a,
				dy: o,
				moved: !0
			};
			for (let [t, n] of e.basePositions) je(t, {
				x: n.x + a,
				y: n.y + o
			});
			W.value = i.dx !== void 0 || i.dy !== void 0 ? Dt({
				x: e.baseRegion.x + a,
				y: e.baseRegion.y + o,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, Ct) : [];
		}
		function an() {
			window.removeEventListener("pointermove", nn), window.removeEventListener("pointerup", an), window.removeEventListener("pointercancel", an);
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
					n !== void 0 && B(t.holder, _e(n, Ce({
						name: t.name,
						x: e.baseRegion.x + e.dx,
						y: e.baseRegion.y + e.dy,
						w: e.baseRegion.w,
						h: e.baseRegion.h
					})));
				}
			}
		}
		function on(e, t) {
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
			}, window.addEventListener("pointermove", sn), window.addEventListener("pointerup", ln), window.addEventListener("pointercancel", ln), N.value = null;
		}
		function sn(e) {
			let t = X.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(cn));
		}
		function cn() {
			let e = X.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = Math.round(e.baseRegion.w + t), i = Math.round(e.baseRegion.h + n), a = [...I.value.filter((t) => !e.memberIds.has(t.id)), ...L.value.filter((t) => t.name !== e.name)], o = Et({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: r,
				h: i
			}, a, e.scale, wt), s = Math.max(e.minW, Math.round(r + (o.dx ?? 0))), c = Math.max(e.minH, Math.round(i + (o.dy ?? 0)));
			X.value = {
				...e,
				curW: s,
				curH: c,
				moved: !0
			}, W.value = o.dx !== void 0 || o.dy !== void 0 ? Dt({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: s,
				h: c
			}, a, wt) : [];
		}
		function ln() {
			window.removeEventListener("pointermove", sn), window.removeEventListener("pointerup", ln), window.removeEventListener("pointercancel", ln);
			let e = X.value;
			if (X.value = null, W.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = C.value.groups.find((t) => t.name === e.name);
			if (!t) return;
			let n = z(t.holder);
			n !== void 0 && B(t.holder, _e(n, Ce({
				name: t.name,
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: e.curW,
				h: e.curH
			})));
		}
		function un(e) {
			O.value || !R.value || !K.value || (e.key === "Delete" || e.key === "Backspace") && (e.preventDefault(), en());
		}
		typeof window < "u" && window.addEventListener("keydown", un);
		let dn = t(() => O.value ? C.value.boxes.find((e) => e.docPath === O.value)?.title ?? O.value : "");
		function fn() {
			let e = O.value ? `#${encodeURIComponent(O.value)}` : "#";
			history.replaceState(null, "", e);
		}
		function Z(e) {
			y.files[e] && (Q.value = !1, O.value = e, b("navigate", e), fn());
		}
		function pn(e) {
			document.querySelector(`.pd-doc-view [data-heading-id$="-${e}"]`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function mn(e, t) {
			if (O.value === e) {
				pn(t);
				return;
			}
			Z(e), c(() => {
				setTimeout(() => pn(t), 80), setTimeout(() => pn(t), 320);
			});
		}
		function hn() {
			O.value = null, fn(), c(() => requestAnimationFrame(() => k.value?.fit?.()));
		}
		te(() => y.files, (e) => {
			if (V.value = !1, O.value && !e[O.value] && hn(), x.value.size) {
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
		let Q = p(!1), $ = p(""), gn = t(() => O.value !== null && $.value !== (y.files[O.value] ?? ""));
		function _n() {
			O.value && ($.value = y.files[O.value] ?? "", Q.value = !0);
		}
		function vn(e) {
			Z(e), _n();
		}
		function yn() {
			Q.value = !1;
		}
		function bn() {
			!O.value || !gn.value || b("save", O.value, $.value, y.files[O.value]);
		}
		function xn(e) {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), bn());
		}
		function Sn(e, t) {
			R.value || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), Z(t));
		}
		function Cn(e, t) {
			if (/^(https?:|mailto:|#)/.test(t)) return null;
			let n = t.split("#")[0].trim();
			if (!n.endsWith(".md")) return null;
			let r = n.startsWith("/") ? n.split("/") : [...e.split("/").slice(0, -1), ...n.split("/")], i = [];
			for (let e of r) e === "" || e === "." || (e === ".." ? i.pop() : i.push(e));
			return i.join("/");
		}
		function wn(e) {
			if (!O.value) return;
			let t = Cn(O.value, e);
			t && Z(t);
		}
		function Tn(e) {
			if (!O.value) return;
			let t = y.files[O.value];
			if (t === void 0) return;
			let n = se(t, e.source, e.id, e.x, e.y);
			n !== t && b("save", O.value, n, t);
		}
		if (typeof window < "u" && window.location.hash.length > 1) {
			let e = decodeURIComponent(window.location.hash.slice(1));
			y.files[e] && (O.value = e);
		}
		return (t, s) => (f(), i("div", Pe, [
			a("header", Fe, [
				s[7] ||= a("span", { class: "pd-graph-brand" }, "📚 ProDoc", -1),
				O.value ? (f(), i("span", Ie, h(dn.value), 1)) : r("", !0),
				a("div", Le, [
					O.value ? r("", !0) : (f(), i(e, { key: 0 }, [R.value ? (f(), i(e, { key: 1 }, [a("button", {
						class: "pd-back-btn",
						disabled: !S.value || V.value,
						onClick: yt
					}, "💾 保存", 8, Re), S.value ? (f(), i("button", {
						key: 0,
						class: "pd-back-btn",
						disabled: V.value,
						onClick: bt
					}, "↩ 放弃更改", 8, ze)) : (f(), i("button", {
						key: 1,
						class: "pd-back-btn pd-back-btn--active",
						onClick: xt
					}, "✓ 完成"))], 64)) : (f(), i("button", {
						key: 0,
						class: "pd-back-btn",
						onClick: xt
					}, "🛠 编辑图")), a("button", {
						class: "pd-back-btn",
						onClick: mt
					}, h(F.value ? "↩ 恢复坐标" : "🧭 分层重排"), 1)], 64)),
					O.value ? (f(), i(e, { key: 1 }, [Q.value ? (f(), i(e, { key: 1 }, [a("button", {
						class: "pd-back-btn",
						disabled: !gn.value,
						onClick: bn
					}, "💾 保存", 8, Be), a("button", {
						class: "pd-back-btn",
						onClick: yn
					}, "👁 预览")], 64)) : (f(), i("button", {
						key: 0,
						class: "pd-back-btn",
						onClick: _n
					}, "✏️ 编辑")), a("button", {
						class: "pd-back-btn",
						onClick: hn
					}, "🗺 返回图")], 64)) : r("", !0),
					o(g(ie), { size: "small" })
				])
			]),
			a("aside", { class: l(["pd-tree-sidebar", { "pd-tree-sidebar--hidden": O.value !== "" }]) }, [a("div", Ve, [s[8] ||= a("span", null, "文档索引", -1), a("button", {
				type: "button",
				class: "pd-tree-sidebar__collapse",
				"aria-label": T.value ? "收起索引" : "展开索引",
				onClick: s[0] ||= (e) => T.value = !T.value
			}, h(T.value ? "⟨" : "⟩"), 9, He)]), T.value ? (f(), i("nav", Ue, [a("ul", We, [(f(!0), i(e, null, m(w.value.children, (e) => (f(), i("li", { key: e.path || e.id }, [o(de, {
				node: e,
				expanded: E.value,
				"current-path": O.value ?? "",
				onToggle: fe,
				onOpen: me
			}, null, 8, [
				"node",
				"expanded",
				"current-path"
			])]))), 128))])])) : r("", !0)], 2),
			a("div", Ge, [O.value ? (f(), i("div", {
				key: 1,
				class: l(["pd-doc-view", { "pd-doc-view--editing": Q.value }])
			}, [Q.value ? (f(), n(g(ae), {
				key: O.value,
				value: $.value,
				class: "pd-doc-editor",
				onChange: s[6] ||= (e) => $.value = e,
				onKeydown: xn
			}, null, 8, ["value"])) : (f(), n(g(oe), {
				key: O.value,
				content: he.value[O.value],
				"show-toc": !0,
				"flow-editable": !0,
				onDocLink: wn,
				onFlowNodeMove: Tn
			}, null, 8, ["content"]))], 2)) : (f(), n(g(re), {
				key: 0,
				ref_key: "canvasRef",
				ref: k,
				width: "100%",
				height: "100%",
				"show-grid": "",
				"grid-variant": "dots",
				"show-fit": "",
				"min-zoom": .25,
				"max-zoom": 3
			}, {
				default: ne(() => [a("div", {
					ref_key: "stageEl",
					ref: St,
					class: l(["pd-graph-stage", {
						"pd-graph-stage--dragging": U.value?.moved || G.value || J.value || Y.value?.moved || X.value?.moved,
						"pd-graph-stage--editing": R.value
					}]),
					style: u({
						width: `${A.value.w}px`,
						height: `${A.value.h}px`
					}),
					onClick: s[5] ||= (e) => K.value = null
				}, [
					(f(!0), i(e, null, m(L.value, (e) => (f(), i("div", {
						key: "group-" + e.name,
						class: l(["pd-doc-group", { "pd-dim": pt(e) }]),
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
						onPointerdown: (t) => tn(t, e)
					}, h(e.name), 41, Ke), R.value ? (f(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-group__resize",
						"aria-label": `调整组「${e.name}」的区域尺寸`,
						title: "拖动调整区域尺寸",
						"data-nm-no-pan": "",
						onPointerdown: v((t) => on(t, e), ["stop"])
					}, null, 40, qe)) : r("", !0)], 6))), 128)),
					M.value.length || Ut.value ? (f(), i("svg", {
						key: 0,
						class: "pd-relation-layer",
						width: A.value.w,
						height: A.value.h,
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
						(f(!0), i(e, null, m(M.value, (e) => (f(), i("g", {
							key: e.id,
							class: l(["pd-relation", {
								"pd-dim": Oe(e),
								"pd-hot": De(e),
								"pd-selected": e.id === K.value
							}])
						}, [
							a("title", null, h(e.fromTitle) + " → " + h(e.toTitle) + h(e.label ? `（${e.label}）` : ""), 1),
							a("path", {
								class: "pd-relation-hit",
								d: e.d,
								fill: "none",
								onClick: v((t) => Wt(e), ["stop"])
							}, null, 8, Ye),
							a("path", {
								d: e.d,
								fill: "none",
								"marker-end": "url(#pd-relation-arrow)",
								"pointer-events": "none"
							}, null, 8, Xe),
							e.label ? (f(), i("text", {
								key: 0,
								x: e.labelX,
								y: e.labelY,
								"pointer-events": "none"
							}, h(e.label), 9, Ze)) : r("", !0)
						], 2))), 128)),
						Ut.value ? (f(), i("path", {
							key: 0,
							class: "pd-relation-draft",
							d: Ut.value,
							fill: "none"
						}, null, 8, Qe)) : r("", !0),
						(f(!0), i(e, null, m(W.value, (e, t) => (f(), i("line", {
							key: "guide" + t,
							class: "pd-guide",
							x1: e.axis === "x" ? e.pos : e.start,
							y1: e.axis === "x" ? e.start : e.pos,
							x2: e.axis === "x" ? e.pos : e.end,
							y2: e.axis === "x" ? e.end : e.pos
						}, null, 8, $e))), 128)),
						R.value && q.value ? (f(), i("g", et, [a("circle", {
							class: "pd-edge-handle",
							cx: q.value.x1,
							cy: q.value.y1,
							r: "6",
							onPointerdown: s[1] ||= v((e) => Kt(e, q.value, "from"), ["stop"])
						}, [...s[9] ||= [a("title", null, "拖动调整源框连接边", -1)]], 40, tt), a("circle", {
							class: "pd-edge-handle",
							cx: q.value.x2,
							cy: q.value.y2,
							r: "6",
							onPointerdown: s[2] ||= v((e) => Kt(e, q.value, "to"), ["stop"])
						}, [...s[10] ||= [a("title", null, "拖动调整目标框连接边", -1)]], 40, nt)])) : r("", !0)
					], 8, Je)) : r("", !0),
					R.value && q.value ? (f(), i("button", {
						key: 1,
						type: "button",
						class: "pd-edge-delete",
						style: u({
							left: `${q.value.labelX}px`,
							top: `${q.value.labelY}px`
						}),
						"aria-label": `删除连线 ${q.value.fromTitle} → ${q.value.toTitle}`,
						title: "删除连线（Delete）",
						onClick: v(en, ["stop"])
					}, "✕", 12, rt)) : r("", !0),
					(f(!0), i(e, null, m(I.value, (t) => (f(), i("div", {
						key: t.id,
						class: l(["pd-doc-box", [`pd-doc-box--d${Math.min(t.depth, 3)}`, { "pd-dim": Ee(t.id) }]]),
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
						onPointerdown: (e) => At(e, t),
						onClick: (e) => Ft(t.docPath),
						onKeydown: (e) => Sn(e, t.docPath),
						onMouseenter: (e) => P(t.id),
						onMouseleave: s[4] ||= (e) => P(null)
					}, [
						a("div", at, [a("span", ot, h(t.title), 1), s[12] ||= a("span", {
							class: "pd-doc-box__icon",
							"aria-hidden": "true"
						}, "↗", -1)]),
						R.value ? r("", !0) : (f(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-box__edit",
							"aria-label": `编辑 ${t.title}`,
							title: "编辑文档",
							onClick: v((e) => vn(t.docPath), ["stop"]),
							onKeydown: [_(v((e) => vn(t.docPath), ["stop"]), ["enter"]), _(v((e) => vn(t.docPath), ["stop"]), ["space"])]
						}, "✏️", 40, st)),
						R.value ? (f(), i("button", {
							key: 1,
							type: "button",
							class: "pd-doc-box__link-handle",
							"aria-label": `从 ${t.title} 创建连线（拖到目标框）`,
							title: "拖到其他框创建连线",
							onPointerdown: v((e) => It(e, t), ["stop"]),
							onClick: s[3] ||= v(() => {}, ["stop"])
						}, null, 40, ct)) : r("", !0),
						t.blocks.length && !R.value ? (f(), i("div", {
							key: 2,
							class: l(["pd-doc-blocks-pop", { "pd-doc-blocks-pop--above": vt(t, A.value.h) }])
						}, [a("div", lt, [(f(!0), i(e, null, m(ht(t), (e) => (f(), i("button", {
							key: e.anchor,
							type: "button",
							class: "pd-doc-blocks-pop__item",
							title: e.title,
							"aria-label": `跳转到「${e.title}」分块`,
							onClick: v((n) => mn(t.docPath, e.anchor), ["stop"]),
							onKeydown: [_(v((n) => mn(t.docPath, e.anchor), ["stop"]), ["enter"]), _(v((n) => mn(t.docPath, e.anchor), ["stop"]), ["space"])]
						}, "▸ " + h(e.title), 41, ut))), 128)), gt(t) > 0 ? (f(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more",
							"aria-label": `查看全部 ${t.blocks.length} 个分块`,
							onClick: v((e) => Z(t.docPath), ["stop"])
						}, "+" + h(gt(t)) + " 更多分块…", 9, dt)) : r("", !0)])], 2)) : r("", !0)
					], 46, it))), 128))
				], 6)]),
				_: 1
			}, 512))])
		]));
	}
});
//#endregion
export { y as DocFlowCanvas, L as DocGraphViewer, b as DocViewer, x as MarkdownRenderer };

//# sourceMappingURL=index.js.map