import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createVNode as o, defineComponent as s, nextTick as c, normalizeClass as l, normalizeStyle as u, onMounted as d, openBlock as f, ref as p, renderList as m, resolveComponent as ee, toDisplayString as h, unref as te, watch as ne, withCtx as re, withKeys as g, withModifiers as _ } from "vue";
import { NeumorphismCanvas as ie, NeumorphismThemeToggle as ae } from "@echolab-auto/ui-frame";
import { DocFlowCanvas as v, DocViewer as y, MarkdownEditor as oe, MarkdownRenderer as b, MarkdownRenderer as se, writeFlowNodePosition as ce } from "@echolab-auto/ui-frame/doc";
import "@echolab-auto/ui-frame/dist/style.css";
//#region src/components/DocTreeItem.vue?vue&type=script&setup=true&lang.ts
var x = { class: "pd-tree-node" }, le = ["title"], S = {
	class: "pd-tree-icon",
	"aria-hidden": "true"
}, ue = { class: "pd-tree-title" }, C = {
	key: 0,
	class: "pd-tree-order"
}, w = {
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
			return f(), i("li", x, [a("div", {
				class: l(["pd-tree-row", {
					"pd-tree-row--dir": t.node.isDir,
					"pd-tree-row--active": t.node.path === t.currentPath
				}]),
				title: t.node.path || t.node.title,
				onClick: c[0] ||= (e) => t.node.children.length ? s("toggle", t.node) : s("open", t.node),
				onKeydown: c[1] ||= g(_((e) => t.node.children.length ? s("toggle", t.node) : s("open", t.node), ["self"]), ["enter"]),
				tabindex: "0"
			}, [
				a("span", {
					class: l(["pd-tree-caret", { "pd-tree-caret--open": t.expanded[t.node.path] }]),
					"aria-hidden": "true"
				}, h(t.node.children.length ? t.expanded[t.node.path] ? "▾" : "▸" : "·"), 3),
				a("span", S, h(t.node.isDir ? "📁" : "📄"), 1),
				a("span", ue, h(t.node.title), 1),
				t.node.order ? (f(), i("span", C, "#" + h(t.node.order), 1)) : r("", !0)
			], 42, le), t.node.children.length && t.expanded[t.node.path] ? (f(), i("ul", w, [(f(!0), i(e, null, m(t.node.children, (e) => (f(), n(u, {
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
//#region ../prodoc-core/dist/tree-BlZcK4os.js
function fe(e) {
	let t = [], n = "", r = null;
	for (let i of e) r ? (n += i, i === r && (r = null)) : i === "\"" || i === "'" ? (r = i, n += i) : i === "," ? (t.push(n), n = "") : n += i;
	return t.push(n), t;
}
function pe(e) {
	let t = e.trim();
	if (t === "") return "";
	if (t.startsWith("[") && t.endsWith("]")) return fe(t.slice(1, -1)).map((e) => pe(e)).filter((e) => e !== "");
	if (t === "true") return !0;
	if (t === "false") return !1;
	if (/^-?\d+$/.test(t)) return parseInt(t, 10);
	if (/^-?\d*\.\d+$/.test(t)) return parseFloat(t);
	let n = t.match(/^(["'])([\s\S]*)\1$/);
	return n ? n[2] : t;
}
function T(e) {
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
	let i = {}, a = 0, o = n.slice(0, r);
	for (; a < o.length;) {
		let e = o[a];
		if (a += 1, e.trim() === "") continue;
		let t = e.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*([\s\S]*)$/);
		if (!t) continue;
		let n = t[1], r = t[2];
		if (r.trimStart().startsWith("[") && !/\]\s*$/.test(r)) {
			let e = [r];
			for (; a < o.length;) {
				let t = o[a];
				if (a += 1, e.push(t), /\]\s*$/.test(t)) break;
			}
			r = e.join("\n");
		}
		i[n] = pe(r);
	}
	return {
		params: i,
		body: n.slice(r + 1).join("\n"),
		hasFrame: !0
	};
}
function E(e) {
	return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).filter((e) => typeof e == "string").map((e) => e.trim()).filter(Boolean);
}
function me(e) {
	return E(T(e).params.link);
}
function D(e) {
	return e === "" || e !== e.trim() || /[|,"]/.test(e) ? e.includes("\"") ? `'${e}'` : `"${e}"` : e;
}
function O(e, t, n) {
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!T(e).hasFrame) return n === null ? e : `---${r}${n}${r}---${r}${e}`;
	let i = e.split(/\r?\n/), a = i.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (a === -1) return e;
	let o = RegExp(`^${t}\\s*:`), s = i.slice(1, a).findIndex((e) => o.test(e));
	return n === null ? s >= 0 && i.splice(s + 1, 1) : s >= 0 ? i[s + 1] = n : i.splice(a, 0, n), i.join(r);
}
function he(e, t) {
	return O(e, "link", t.length > 0 ? `link: [${t.map(D).join(", ")}]` : null);
}
function ge(e, t) {
	let n = t && t.trim() !== "" ? t.trim() : null;
	return O(e, "parent", n === null ? null : `parent: ${D(n)}`);
}
function _e(e, t) {
	return O(e, "group", t === null ? null : `group: ${D(t)}`);
}
function ve(e, t) {
	let n = Object.entries(t).filter((e) => (e[0] === "x" || e[0] === "y") && typeof e[1] == "number" && Number.isFinite(e[1]));
	if (n.length === 0) return e;
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!T(e).hasFrame) return `---${r}${n.map(([e, t]) => `${e}: ${t}`).join(r)}${r}---${r}${e}`;
	let i = e.split(/\r?\n/), a = i.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (a === -1) return e;
	let o = a;
	for (let [e, t] of n) {
		let n = RegExp(`^${e}\\s*:`), r = i.slice(1, o).findIndex((e) => n.test(e));
		r >= 0 ? i[r + 1] = `${e}: ${t}` : (i.splice(o, 0, `${e}: ${t}`), o++);
	}
	return i.join(r);
}
var ye = 72, k = 48, A = /* @__PURE__ */ new Set([
	"id",
	"title",
	"x",
	"y",
	"w",
	"h",
	"link",
	"group",
	"parent",
	"order"
]);
function j(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
var M = {
	t: "top",
	r: "right",
	b: "bottom",
	l: "left"
}, be = {
	top: "t",
	right: "r",
	bottom: "b",
	left: "l"
}, N = /^([trbl_])>([trbl_])$/;
function xe(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(N);
		t ? (t[1] !== "_" && (n.fromSide = M[t[1]]), t[2] !== "_" && (n.toSide = M[t[2]])) : e !== "" && (n.label = e);
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
var P = /^(.*)\s*@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
function Ce(e) {
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
function we(e) {
	let { name: t, x: n, y: r, w: i, h: a } = e;
	return [
		n,
		r,
		i,
		a
	].every((e) => typeof e == "number" && Number.isFinite(e)) ? `${t} @ ${n}, ${r}, ${i}, ${a}` : t;
}
function Te(e, t) {
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
function Ee(e) {
	let t = e.match(/^#[ \t]+(.+)$/m);
	return t ? t[1].trim() : void 0;
}
function De(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
}
function Oe(e) {
	return e.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_~]/g, "").replace(/<[^>]+>/g, "").trim();
}
function ke(e) {
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
			let e = Oe(i[1]);
			e && t.push({
				anchor: De(e),
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
			m === a && (u += f + ye, f = 0, p = k, m = 0);
			let t = r.get(e.id);
			t.rawX === void 0 && (e.x = p), t.rawY === void 0 && (e.y = u), s.set(e.id, o(e)), p += e.w + 64, f = Math.max(f, e.h), m++;
		}
		d = u + f + ye;
	}
}
function Ae(e, t) {
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
function je(e) {
	let t = Object.keys(e).sort(), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let o of t) {
		let { params: t, body: s } = T(e[o]), c = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : o.replace(/\.md$/, ""), l = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || Ee(s) || c, u = ke(s), d = j(t.w) ?? 220, f = j(t.h) ?? 96, p = {};
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
			if (e.length > 1 && n.push(`文档 "${c}" 声明了多个 group，仅取第一个 "${Ce(e[0]).name || e[0]}"`), e.length > 0) {
				let { name: t, geo: n } = Ce(e[0]);
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
	function d(e, t, r, i, a = "link") {
		let o = u(e), s = u(t);
		if (!o || !s) {
			let r = o ? t : e;
			n.push("连线 " + i + " 引用了不存在的文档 \"" + r + "\"");
			return;
		}
		if (o.id === s.id) {
			n.push("文档 \"" + o.id + "\" 不能连线自身");
			return;
		}
		let d = o.id + "->" + s.id;
		l.has(d) || (l.add(d), c.push({
			id: d,
			type: a,
			from: o.id,
			to: s.id,
			label: a === "parent" ? "包含" : r.label,
			fromSide: r.fromSide,
			toSide: r.toSide
		}));
	}
	for (let t of o) {
		let { params: n } = T(e[t.docPath]);
		for (let e of E(n.link)) {
			let { ref: n, label: r, fromSide: i, toSide: a } = xe(e);
			n && d(t.id, n, {
				label: r,
				fromSide: i,
				toSide: a
			}, t.id + ".link");
		}
		let r = n.parent;
		typeof r == "string" && r.trim() !== "" && d(t.id, r, {}, t.id + ".parent", "parent");
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
			...Te(t.members, t.geo),
			explicit: t.geo !== void 0,
			holder: t.holder ?? t.members[0].docPath
		})),
		warnings: n
	};
}
function Me(e, t) {
	let n = T(e), r = n.params.title;
	if (typeof r == "string" && r.trim()) return r.trim();
	let i = n.body.match(/^#\s+(.+)$/m);
	return i ? i[1].trim() : (t.split("/").pop() ?? t).replace(/\.md$/, "");
}
function Ne(e) {
	let t = [], n = [], r = /* @__PURE__ */ new Map();
	for (let i of e) {
		let e = T(i.content).params, a = typeof e.id == "string" && e.id.trim() ? e.id.trim() : i.path.replace(/\.md$/, ""), o = typeof e.order == "number" ? e.order : typeof e.order == "string" && Number(e.order) || 0, s = typeof e.parent == "string" && e.parent.trim() ? e.parent.trim() : void 0;
		n.push({
			path: i.path,
			id: a,
			title: Me(i.content, i.path),
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
function Pe(e) {
	let t = [], n = (e) => {
		t.push(e);
		for (let t of e.children) n(t);
	};
	return n(e), t;
}
//#endregion
//#region src/components/DocGraphViewer.vue?vue&type=script&setup=true&lang.ts
var Fe = { class: "pd-graph-viewer" }, Ie = { class: "pd-graph-header" }, Le = {
	key: 0,
	class: "pd-graph-current"
}, Re = { class: "pd-graph-actions" }, ze = ["disabled"], Be = ["disabled"], Ve = ["disabled"], He = { class: "pd-tree-sidebar__head" }, Ue = ["aria-label"], We = {
	key: 0,
	class: "pd-tree-sidebar__nav",
	"aria-label": "文档索引树"
}, Ge = { class: "pd-tree" }, Ke = { class: "pd-graph-main" }, qe = ["title", "onPointerdown"], Je = ["aria-label", "onPointerdown"], Ye = ["width", "height"], Xe = ["d", "onClick"], Ze = ["d"], Qe = ["x", "y"], $e = ["d"], et = [
	"x1",
	"y1",
	"x2",
	"y2"
], tt = {
	key: 1,
	class: "pd-edge-handles"
}, nt = ["cx", "cy"], rt = ["cx", "cy"], it = ["aria-label", "title"], at = [
	"aria-label",
	"onPointerdown",
	"onClick",
	"onKeydown",
	"onMouseenter"
], ot = { class: "pd-doc-box__head" }, st = { class: "pd-doc-box__title" }, ct = [
	"aria-label",
	"onClick",
	"onKeydown"
], lt = ["aria-label", "onPointerdown"], ut = {
	class: "pd-doc-blocks-pop__card",
	role: "menu"
}, dt = [
	"title",
	"aria-label",
	"onClick",
	"onKeydown"
], ft = ["aria-label", "onClick"], pt = 30, L = /* @__PURE__ */ s({
	__name: "DocGraphViewer",
	props: { files: {} },
	emits: ["navigate", "save"],
	setup(s, { emit: ee }) {
		let v = s, y = ee, b = p(/* @__PURE__ */ new Map()), x = t(() => b.value.size > 0), le = t(() => b.value.size ? {
			...v.files,
			...Object.fromEntries(b.value)
		} : v.files), S = t(() => je(le.value)), ue = t(() => Object.fromEntries(Object.entries(v.files).map(([e, t]) => [e, T(t).body])));
		ne(() => S.value.warnings, (e) => e.forEach((e) => console.warn("[ProDoc]", e)), { immediate: !0 });
		let C = p(null), w = t(() => Ne(Object.entries(le.value).map(([e, t]) => ({
			path: e,
			content: t
		}))).root), fe = t(() => Pe(w.value)), pe = t(() => {
			if (!C.value) return [];
			let e = fe.value.find((e) => e.path === C.value && !e.isDir);
			if (!e) return [];
			let t = [], n = (r, i) => {
				if (r === e) return t.push(...i, r), !0;
				for (let e of r.children) if (n(e, [...i, r])) return !0;
				return !1;
			};
			return n(w.value, []), t;
		}), E = p(!0), D = p({});
		ne(() => C.value, () => {
			for (let e of pe.value) e.isDir && (D.value[e.path] = !0);
		}), d(() => {
			for (let e of w.value.children) e.isDir && (D.value[e.path] = !0);
		});
		function O(e) {
			(e.isDir || e.children.length) && (D.value[e.path] = !D.value[e.path]);
		}
		function ye(e) {
			e.isDir ? O(e) : Z(e.path);
		}
		let k = p(null), A = t(() => {
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
		function M(e, t) {
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
			let i = M(e, t), a = j(e, n ?? i.fs), o = j(t, r ?? i.ts), s = Math.hypot(o.x - a.x, o.y - a.y), c = Math.max(24, Math.min(s * .45, 96)), l = `M ${a.x} ${a.y} C ${a.x + a.nx * c} ${a.y + a.ny * c}, ${o.x + o.nx * c} ${o.y + o.ny * c}, ${o.x} ${o.y}`;
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
			return S.value.relations.flatMap((n) => {
				let r = e.get(n.from), i = e.get(n.to);
				if (!r || !i) return [];
				let a = n.type, o = n.fromSide, s = n.toSide;
				t && t.edgeId === n.id && (t.which === "from" ? o = t.side : s = t.side);
				let { x1: c, y1: l, x2: u, y2: d, d: f } = be(r, i, o, s);
				return [{
					id: n.id,
					kind: a,
					fromId: r.id,
					toId: i.id,
					fromTitle: r.title,
					toTitle: i.title,
					label: n.label,
					fromSide: n.fromSide,
					toSide: n.toSide,
					d: f,
					x1: c,
					y1: l,
					x2: u,
					y2: d,
					labelX: (c + u) / 2,
					labelY: (l + d) / 2 - 7
				}];
			});
		}), P = p(null);
		function Ce(e) {
			U.value || G.value || J.value || (P.value = e);
		}
		let Ee = t(() => {
			if (!P.value) return /* @__PURE__ */ new Set();
			let e = /* @__PURE__ */ new Set([P.value]);
			for (let t of S.value.relations) t.from === P.value && e.add(t.to), t.to === P.value && e.add(t.from);
			return e;
		}), De = (e) => P.value !== null && !Ee.value.has(e), Oe = (e) => P.value !== null && (e.fromId === P.value || e.toId === P.value), ke = (e) => P.value !== null && !Oe(e), F = p(null), I = t(() => S.value.boxes.map((e) => {
			let t = F.value?.get(e.id);
			return t ? {
				...e,
				x: t.x,
				y: t.y
			} : e;
		}));
		function Me(e, t) {
			let n = new Map(F.value ?? []);
			n.set(e, t), F.value = n;
		}
		let L = t(() => {
			let e = Y.value, t = X.value;
			return S.value.groups.map((n) => {
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
					...Te(r)
				};
			});
		}), mt = (e) => P.value !== null && !e.members.some((e) => Ee.value.has(e));
		function ht() {
			F.value = F.value ? null : Ae(S.value.boxes, S.value.relations);
		}
		let gt = (e) => e.blocks.slice(0, 6), _t = (e) => Math.max(0, e.blocks.length - 6), vt = (e) => (gt(e).length + +(_t(e) > 0)) * pt + 12, yt = (e, t) => e.y + e.h + 6 + vt(e) > t, R = p(!1);
		function z(e) {
			return b.value.get(e) ?? v.files[e];
		}
		function B(e, t) {
			let n = new Map(b.value);
			t === v.files[e] ? n.delete(e) : n.set(e, t), b.value = n;
		}
		let V = p(!1);
		function bt() {
			if (!(!x.value || V.value)) {
				V.value = !0;
				for (let [e, t] of b.value) y("save", e, t, v.files[e]);
			}
		}
		function xt() {
			if (!x.value) return;
			let e = new Set([...b.value.keys()].map((e) => S.value.boxes.find((t) => t.docPath === e)?.id).filter((e) => !!e));
			if (b.value = /* @__PURE__ */ new Map(), F.value) {
				let t = new Map(F.value);
				e.forEach((e) => t.delete(e)), F.value = t.size > 0 ? t : null;
			}
			K.value = null, R.value = !1;
		}
		function St() {
			if (R.value) {
				if (x.value) return;
				K.value = null, R.value = !1;
			} else R.value = !0;
		}
		let Ct = p(null);
		function H(e, t) {
			let n = Ct.value;
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
		let U = p(null), W = p([]), wt = {
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
		}, Tt = {
			x: ["end"],
			y: ["end"]
		};
		function Et(e, t) {
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
		function Dt(e, t, n, r) {
			let i = Math.min(Math.max(8 / n, 4), 12), a = {};
			for (let n of ["x", "y"]) {
				let o = Et(e, n), s = r[n].map((e) => o[e]), c = null;
				for (let e of t) for (let t of Object.values(Et(e, n))) for (let e of s) {
					let n = t - e;
					Math.abs(n) <= i && (c === null || Math.abs(n) < Math.abs(c)) && (c = n);
				}
				c !== null && (a[n === "x" ? "dx" : "dy"] = c);
			}
			return a;
		}
		function Ot(e, t, n) {
			let r = [], i = /* @__PURE__ */ new Set();
			for (let a of ["x", "y"]) {
				let o = Et(e, a), s = n[a].map((e) => o[e]);
				for (let n of t) for (let t of Object.values(Et(n, a))) {
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
		function kt(e, t, n, r) {
			let i = I.value.find((t) => t.id === e);
			if (!i) return {
				x: t,
				y: n,
				guides: []
			};
			let a = I.value.filter((t) => t.id !== e), o = Dt({
				x: t,
				y: n,
				w: i.w,
				h: i.h
			}, a, r, wt), s = Math.round(t + (o.dx ?? 0)), c = Math.round(n + (o.dy ?? 0));
			return {
				x: s,
				y: c,
				guides: o.dx !== void 0 || o.dy !== void 0 ? Ot({
					x: s,
					y: c,
					w: i.w,
					h: i.h
				}, a, wt) : []
			};
		}
		let At = !1;
		function jt(e, t) {
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
			}, window.addEventListener("pointermove", Mt), window.addEventListener("pointerup", Ft), window.addEventListener("pointercancel", Ft), P.value = null));
		}
		function Mt(e) {
			let t = U.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Nt));
		}
		function Nt() {
			let e = U.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			e.moved = !0;
			let r = kt(e.id, e.baseX + t, e.baseY + n, e.scale);
			Me(e.id, {
				x: r.x,
				y: r.y
			}), W.value = r.guides;
		}
		function Pt() {
			let e = U.value;
			if (U.value = null, W.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			At = !0;
			let t = F.value?.get(e.id);
			if (!t) return;
			let n = z(e.path);
			n !== void 0 && B(e.path, ve(n, t));
		}
		function Ft() {
			window.removeEventListener("pointermove", Mt), window.removeEventListener("pointerup", Ft), window.removeEventListener("pointercancel", Ft), Pt();
		}
		function It(e) {
			if (At) {
				At = !1;
				return;
			}
			R.value || Z(e);
		}
		let G = p(null);
		function Lt(e, t) {
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
			}, window.addEventListener("pointermove", Rt), window.addEventListener("pointerup", Ht), window.addEventListener("pointercancel", Vt), P.value = null;
		}
		function Rt(e) {
			let t = G.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(zt));
		}
		function zt() {
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
		function Bt() {
			window.removeEventListener("pointermove", Rt), window.removeEventListener("pointerup", Ht), window.removeEventListener("pointercancel", Vt);
		}
		function Vt() {
			Bt();
			let e = G.value;
			e?.raf && cancelAnimationFrame(e.raf), G.value = null;
		}
		function Ht(e) {
			Bt();
			let t = G.value;
			if (t?.raf && cancelAnimationFrame(t.raf), G.value = null, !t) return;
			let n = H(e.clientX, e.clientY), r = I.value.find((e) => n.x >= e.x && n.x <= e.x + e.w && n.y >= e.y && n.y <= e.y + e.h);
			!r || r.id === t.fromId || S.value.relations.some((e) => e.from === t.fromId && e.to === r.id) || Ut(t.fromId, r.id);
		}
		function Ut(e, t) {
			let n = S.value.boxes.find((t) => t.id === e);
			if (!n) return;
			let r = z(n.docPath);
			r !== void 0 && B(n.docPath, he(r, [...me(r), t]));
		}
		let Wt = t(() => {
			let e = G.value;
			if (!e) return null;
			let t = I.value.find((t) => t.id === e.fromId);
			return t ? be(t, {
				x: e.x,
				y: e.y,
				w: 0,
				h: 0
			}).d : null;
		}), K = p(null), q = t(() => N.value.find((e) => e.id === K.value) ?? null);
		function Gt(e) {
			R.value && (K.value = e.id);
		}
		let J = p(null);
		function Kt(e, t, n) {
			let r = t - (e.x + e.w / 2), i = n - (e.y + e.h / 2);
			return Math.abs(r) / (e.w / 2) >= Math.abs(i) / (e.h / 2) ? r >= 0 ? "right" : "left" : i >= 0 ? "bottom" : "top";
		}
		function qt(e, t, n) {
			if (e.button !== 0) return;
			e.preventDefault(), e.stopPropagation();
			let r = M(I.value.find((e) => e.id === t.fromId), I.value.find((e) => e.id === t.toId));
			J.value = {
				edgeId: t.id,
				which: n,
				side: (n === "from" ? t.fromSide : t.toSide) ?? (n === "from" ? r.fs : r.ts),
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", Jt), window.addEventListener("pointerup", Qt), window.addEventListener("pointercancel", Zt), P.value = null;
		}
		function Jt(e) {
			let t = J.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Yt));
		}
		function Yt() {
			let e = J.value;
			if (!e) return;
			e.raf = 0;
			let t = N.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = I.value.find((n) => n.id === (e.which === "from" ? t.fromId : t.toId));
			if (!n) return;
			let r = H(e.lastClientX, e.lastClientY), i = Kt(n, r.x, r.y);
			i !== e.side && (J.value = {
				...e,
				side: i
			});
		}
		function Xt() {
			window.removeEventListener("pointermove", Jt), window.removeEventListener("pointerup", Qt), window.removeEventListener("pointercancel", Zt);
		}
		function Zt() {
			Xt();
			let e = J.value;
			e?.raf && cancelAnimationFrame(e.raf), J.value = null;
		}
		function Qt() {
			Xt();
			let e = J.value;
			if (e?.raf && cancelAnimationFrame(e.raf), J.value = null, !e) return;
			let t = N.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.which === "from" ? e.side : t.fromSide, r = e.which === "to" ? e.side : t.toSide;
			n === t.fromSide && r === t.toSide || $t(t, n, r);
		}
		function $t(e, t, n) {
			let r = S.value.boxes.find((t) => t.id === e.fromId);
			if (!r) return;
			let i = z(r.docPath);
			if (i === void 0) return;
			let a = me(i).map((r) => {
				let i = xe(r);
				return en(i.ref) === e.toId ? Se({
					ref: i.ref,
					label: i.label,
					fromSide: t,
					toSide: n
				}) : r;
			});
			B(r.docPath, he(i, a));
		}
		function en(e) {
			let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md", r = S.value.boxes;
			return (r.find((e) => e.id === t) ?? r.find((e) => e.docPath === t) ?? r.find((e) => e.docPath === n))?.id;
		}
		function tn() {
			let e = q.value;
			if (!e) return;
			if (e.kind === "parent") {
				let t = S.value.boxes.find((t) => t.id === e.fromId);
				if (!t) return;
				let n = z(t.docPath);
				if (n === void 0) return;
				B(t.docPath, ge(n, null)), K.value = null;
				return;
			}
			let t = S.value.boxes.find((t) => t.id === e.fromId);
			if (!t) return;
			let n = z(t.docPath);
			if (n === void 0) return;
			let r = me(n).filter((t) => en(xe(t).ref) !== e.toId);
			B(t.docPath, he(n, r)), K.value = null;
		}
		let Y = p(null), X = p(null);
		function nn(e, t) {
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
			}, window.addEventListener("pointermove", rn), window.addEventListener("pointerup", on), window.addEventListener("pointercancel", on), P.value = null;
		}
		function rn(e) {
			let t = Y.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(an));
		}
		function an() {
			let e = Y.value;
			if (!e) return;
			e.raf = 0;
			let t = Math.round((e.lastClientX - e.startClientX) / e.scale), n = Math.round((e.lastClientY - e.startClientY) / e.scale);
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = [...I.value.filter((t) => !e.basePositions.has(t.id)), ...L.value.filter((t) => t.name !== e.name)], i = Dt({
				x: e.baseRegion.x + t,
				y: e.baseRegion.y + n,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, e.scale, wt), a = t + (i.dx ?? 0), o = n + (i.dy ?? 0);
			Y.value = {
				...e,
				dx: a,
				dy: o,
				moved: !0
			};
			for (let [t, n] of e.basePositions) Me(t, {
				x: n.x + a,
				y: n.y + o
			});
			W.value = i.dx !== void 0 || i.dy !== void 0 ? Ot({
				x: e.baseRegion.x + a,
				y: e.baseRegion.y + o,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, wt) : [];
		}
		function on() {
			window.removeEventListener("pointermove", rn), window.removeEventListener("pointerup", on), window.removeEventListener("pointercancel", on);
			let e = Y.value;
			if (Y.value = null, W.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = S.value.groups.find((t) => t.name === e.name);
			if (t) {
				for (let n of t.members) {
					let t = S.value.boxes.find((e) => e.id === n), r = e.basePositions.get(n);
					if (!t || !r) continue;
					let i = z(t.docPath);
					i !== void 0 && B(t.docPath, ve(i, {
						x: r.x + e.dx,
						y: r.y + e.dy
					}));
				}
				if (t.explicit) {
					let n = z(t.holder);
					n !== void 0 && B(t.holder, _e(n, we({
						name: t.name,
						x: e.baseRegion.x + e.dx,
						y: e.baseRegion.y + e.dy,
						w: e.baseRegion.w,
						h: e.baseRegion.h
					})));
				}
			}
		}
		function sn(e, t) {
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
			}, window.addEventListener("pointermove", cn), window.addEventListener("pointerup", un), window.addEventListener("pointercancel", un), P.value = null;
		}
		function cn(e) {
			let t = X.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(ln));
		}
		function ln() {
			let e = X.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = Math.round(e.baseRegion.w + t), i = Math.round(e.baseRegion.h + n), a = [...I.value.filter((t) => !e.memberIds.has(t.id)), ...L.value.filter((t) => t.name !== e.name)], o = Dt({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: r,
				h: i
			}, a, e.scale, Tt), s = Math.max(e.minW, Math.round(r + (o.dx ?? 0))), c = Math.max(e.minH, Math.round(i + (o.dy ?? 0)));
			X.value = {
				...e,
				curW: s,
				curH: c,
				moved: !0
			}, W.value = o.dx !== void 0 || o.dy !== void 0 ? Ot({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: s,
				h: c
			}, a, Tt) : [];
		}
		function un() {
			window.removeEventListener("pointermove", cn), window.removeEventListener("pointerup", un), window.removeEventListener("pointercancel", un);
			let e = X.value;
			if (X.value = null, W.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = S.value.groups.find((t) => t.name === e.name);
			if (!t) return;
			let n = z(t.holder);
			n !== void 0 && B(t.holder, _e(n, we({
				name: t.name,
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: e.curW,
				h: e.curH
			})));
		}
		function dn(e) {
			C.value || !R.value || !K.value || (e.key === "Delete" || e.key === "Backspace") && (e.preventDefault(), tn());
		}
		typeof window < "u" && window.addEventListener("keydown", dn);
		let fn = t(() => C.value ? S.value.boxes.find((e) => e.docPath === C.value)?.title ?? C.value : "");
		function pn() {
			let e = C.value ? `#${encodeURIComponent(C.value)}` : "#";
			history.replaceState(null, "", e);
		}
		function Z(e) {
			v.files[e] && (Q.value = !1, C.value = e, y("navigate", e), pn());
		}
		function mn(e) {
			document.querySelector(`.pd-doc-view [data-heading-id$="-${e}"]`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function hn(e, t) {
			if (C.value === e) {
				mn(t);
				return;
			}
			Z(e), c(() => {
				setTimeout(() => mn(t), 80), setTimeout(() => mn(t), 320);
			});
		}
		function gn() {
			C.value = null, pn(), c(() => requestAnimationFrame(() => k.value?.fit?.()));
		}
		ne(() => v.files, (e) => {
			if (V.value = !1, C.value && !e[C.value] && gn(), b.value.size) {
				let t = new Map(b.value);
				for (let [n, r] of t) (e[n] === r || e[n] === void 0) && t.delete(n);
				b.value = t;
			}
			if (!F.value) return;
			let t = S.value.boxes, n = new Map(F.value);
			for (let [e, r] of n) {
				let i = t.find((t) => t.id === e);
				(!i || i.x === r.x && i.y === r.y) && n.delete(e);
			}
			F.value = n.size > 0 ? n : null;
		});
		let Q = p(!1), $ = p(""), _n = t(() => C.value !== null && $.value !== (v.files[C.value] ?? ""));
		function vn() {
			C.value && ($.value = v.files[C.value] ?? "", Q.value = !0);
		}
		function yn(e) {
			Z(e), vn();
		}
		function bn() {
			Q.value = !1;
		}
		function xn() {
			!C.value || !_n.value || y("save", C.value, $.value, v.files[C.value]);
		}
		function Sn(e) {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), xn());
		}
		function Cn(e, t) {
			R.value || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), Z(t));
		}
		function wn(e, t) {
			if (/^(https?:|mailto:|#)/.test(t)) return null;
			let n = t.split("#")[0].trim();
			if (!n.endsWith(".md")) return null;
			let r = n.startsWith("/") ? n.split("/") : [...e.split("/").slice(0, -1), ...n.split("/")], i = [];
			for (let e of r) e === "" || e === "." || (e === ".." ? i.pop() : i.push(e));
			return i.join("/");
		}
		function Tn(e) {
			if (!C.value) return;
			let t = wn(C.value, e);
			t && Z(t);
		}
		function En(e) {
			if (!C.value) return;
			let t = v.files[C.value];
			if (t === void 0) return;
			let n = ce(t, e.source, e.id, e.x, e.y);
			n !== t && y("save", C.value, n, t);
		}
		if (typeof window < "u" && window.location.hash.length > 1) {
			let e = decodeURIComponent(window.location.hash.slice(1));
			v.files[e] && (C.value = e);
		}
		return (t, s) => (f(), i("div", Fe, [
			a("header", Ie, [
				s[7] ||= a("span", { class: "pd-graph-brand" }, "📚 ProDoc", -1),
				C.value ? (f(), i("span", Le, h(fn.value), 1)) : r("", !0),
				a("div", Re, [
					C.value ? r("", !0) : (f(), i(e, { key: 0 }, [R.value ? (f(), i(e, { key: 1 }, [a("button", {
						class: "pd-back-btn",
						disabled: !x.value || V.value,
						onClick: bt
					}, "💾 保存", 8, ze), x.value ? (f(), i("button", {
						key: 0,
						class: "pd-back-btn",
						disabled: V.value,
						onClick: xt
					}, "↩ 放弃更改", 8, Be)) : (f(), i("button", {
						key: 1,
						class: "pd-back-btn pd-back-btn--active",
						onClick: St
					}, "✓ 完成"))], 64)) : (f(), i("button", {
						key: 0,
						class: "pd-back-btn",
						onClick: St
					}, "🛠 编辑图")), a("button", {
						class: "pd-back-btn",
						onClick: ht
					}, h(F.value ? "↩ 恢复坐标" : "🧭 分层重排"), 1)], 64)),
					C.value ? (f(), i(e, { key: 1 }, [Q.value ? (f(), i(e, { key: 1 }, [a("button", {
						class: "pd-back-btn",
						disabled: !_n.value,
						onClick: xn
					}, "💾 保存", 8, Ve), a("button", {
						class: "pd-back-btn",
						onClick: bn
					}, "👁 预览")], 64)) : (f(), i("button", {
						key: 0,
						class: "pd-back-btn",
						onClick: vn
					}, "✏️ 编辑")), a("button", {
						class: "pd-back-btn",
						onClick: gn
					}, "🗺 返回图")], 64)) : r("", !0),
					o(te(ae), { size: "small" })
				])
			]),
			a("aside", { class: l(["pd-tree-sidebar", { "pd-tree-sidebar--hidden": C.value !== "" }]) }, [a("div", He, [s[8] ||= a("span", null, "文档索引", -1), a("button", {
				type: "button",
				class: "pd-tree-sidebar__collapse",
				"aria-label": E.value ? "收起索引" : "展开索引",
				onClick: s[0] ||= (e) => E.value = !E.value
			}, h(E.value ? "⟨" : "⟩"), 9, Ue)]), E.value ? (f(), i("nav", We, [a("ul", Ge, [(f(!0), i(e, null, m(w.value.children, (e) => (f(), i("li", { key: e.path || e.id }, [o(de, {
				node: e,
				expanded: D.value,
				"current-path": C.value ?? "",
				onToggle: O,
				onOpen: ye
			}, null, 8, [
				"node",
				"expanded",
				"current-path"
			])]))), 128))])])) : r("", !0)], 2),
			a("div", Ke, [C.value ? (f(), i("div", {
				key: 1,
				class: l(["pd-doc-view", { "pd-doc-view--editing": Q.value }])
			}, [Q.value ? (f(), n(te(oe), {
				key: C.value,
				value: $.value,
				class: "pd-doc-editor",
				onChange: s[6] ||= (e) => $.value = e,
				onKeydown: Sn
			}, null, 8, ["value"])) : (f(), n(te(se), {
				key: C.value,
				content: ue.value[C.value],
				"show-toc": !0,
				"flow-editable": !0,
				onDocLink: Tn,
				onFlowNodeMove: En
			}, null, 8, ["content"]))], 2)) : (f(), n(te(ie), {
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
				default: re(() => [a("div", {
					ref_key: "stageEl",
					ref: Ct,
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
						class: l(["pd-doc-group", { "pd-dim": mt(e) }]),
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
						onPointerdown: (t) => nn(t, e)
					}, h(e.name), 41, qe), R.value ? (f(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-group__resize",
						"aria-label": `调整组「${e.name}」的区域尺寸`,
						title: "拖动调整区域尺寸",
						"data-nm-no-pan": "",
						onPointerdown: _((t) => sn(t, e), ["stop"])
					}, null, 40, Je)) : r("", !0)], 6))), 128)),
					N.value.length || Wt.value ? (f(), i("svg", {
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
						(f(!0), i(e, null, m(N.value, (e) => (f(), i("g", {
							key: e.id,
							class: l(["pd-relation", {
								"pd-relation--parent": e.kind === "parent",
								"pd-dim": ke(e),
								"pd-hot": Oe(e),
								"pd-selected": e.id === K.value
							}])
						}, [
							a("title", null, h(e.fromTitle) + " → " + h(e.toTitle) + h(e.label ? `（${e.label}）` : ""), 1),
							a("path", {
								class: "pd-relation-hit",
								d: e.d,
								fill: "none",
								onClick: _((t) => Gt(e), ["stop"])
							}, null, 8, Xe),
							a("path", {
								d: e.d,
								fill: "none",
								"marker-end": "url(#pd-relation-arrow)",
								"pointer-events": "none"
							}, null, 8, Ze),
							e.label ? (f(), i("text", {
								key: 0,
								x: e.labelX,
								y: e.labelY,
								"pointer-events": "none"
							}, h(e.label), 9, Qe)) : r("", !0)
						], 2))), 128)),
						Wt.value ? (f(), i("path", {
							key: 0,
							class: "pd-relation-draft",
							d: Wt.value,
							fill: "none"
						}, null, 8, $e)) : r("", !0),
						(f(!0), i(e, null, m(W.value, (e, t) => (f(), i("line", {
							key: "guide" + t,
							class: "pd-guide",
							x1: e.axis === "x" ? e.pos : e.start,
							y1: e.axis === "x" ? e.start : e.pos,
							x2: e.axis === "x" ? e.pos : e.end,
							y2: e.axis === "x" ? e.end : e.pos
						}, null, 8, et))), 128)),
						R.value && q.value ? (f(), i("g", tt, [a("circle", {
							class: "pd-edge-handle",
							cx: q.value.x1,
							cy: q.value.y1,
							r: "6",
							onPointerdown: s[1] ||= _((e) => qt(e, q.value, "from"), ["stop"])
						}, [...s[9] ||= [a("title", null, "拖动调整源框连接边", -1)]], 40, nt), a("circle", {
							class: "pd-edge-handle",
							cx: q.value.x2,
							cy: q.value.y2,
							r: "6",
							onPointerdown: s[2] ||= _((e) => qt(e, q.value, "to"), ["stop"])
						}, [...s[10] ||= [a("title", null, "拖动调整目标框连接边", -1)]], 40, rt)])) : r("", !0)
					], 8, Ye)) : r("", !0),
					R.value && q.value ? (f(), i("button", {
						key: 1,
						type: "button",
						class: "pd-edge-delete",
						style: u({
							left: `${q.value.labelX}px`,
							top: `${q.value.labelY}px`
						}),
						"aria-label": `删除${q.value.kind === "parent" ? "包含关系" : "连线"} ${q.value.fromTitle} → ${q.value.toTitle}`,
						title: `删除${q.value.kind === "parent" ? "包含关系" : "连线"}（Delete）`,
						onClick: _(tn, ["stop"])
					}, "✕", 12, it)) : r("", !0),
					(f(!0), i(e, null, m(I.value, (t) => (f(), i("div", {
						key: t.id,
						class: l(["pd-doc-box", [`pd-doc-box--d${Math.min(t.depth, 3)}`, { "pd-dim": De(t.id) }]]),
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
						onPointerdown: (e) => jt(e, t),
						onClick: (e) => It(t.docPath),
						onKeydown: (e) => Cn(e, t.docPath),
						onMouseenter: (e) => Ce(t.id),
						onMouseleave: s[4] ||= (e) => Ce(null)
					}, [
						a("div", ot, [a("span", st, h(t.title), 1), s[12] ||= a("span", {
							class: "pd-doc-box__icon",
							"aria-hidden": "true"
						}, "↗", -1)]),
						R.value ? r("", !0) : (f(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-box__edit",
							"aria-label": `编辑 ${t.title}`,
							title: "编辑文档",
							onClick: _((e) => yn(t.docPath), ["stop"]),
							onKeydown: [g(_((e) => yn(t.docPath), ["stop"]), ["enter"]), g(_((e) => yn(t.docPath), ["stop"]), ["space"])]
						}, "✏️", 40, ct)),
						R.value ? (f(), i("button", {
							key: 1,
							type: "button",
							class: "pd-doc-box__link-handle",
							"aria-label": `从 ${t.title} 创建连线（拖到目标框）`,
							title: "拖到其他框创建连线",
							onPointerdown: _((e) => Lt(e, t), ["stop"]),
							onClick: s[3] ||= _(() => {}, ["stop"])
						}, null, 40, lt)) : r("", !0),
						t.blocks.length && !R.value ? (f(), i("div", {
							key: 2,
							class: l(["pd-doc-blocks-pop", { "pd-doc-blocks-pop--above": yt(t, A.value.h) }])
						}, [a("div", ut, [(f(!0), i(e, null, m(gt(t), (e) => (f(), i("button", {
							key: e.anchor,
							type: "button",
							class: "pd-doc-blocks-pop__item",
							title: e.title,
							"aria-label": `跳转到「${e.title}」分块`,
							onClick: _((n) => hn(t.docPath, e.anchor), ["stop"]),
							onKeydown: [g(_((n) => hn(t.docPath, e.anchor), ["stop"]), ["enter"]), g(_((n) => hn(t.docPath, e.anchor), ["stop"]), ["space"])]
						}, "▸ " + h(e.title), 41, dt))), 128)), _t(t) > 0 ? (f(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more",
							"aria-label": `查看全部 ${t.blocks.length} 个分块`,
							onClick: _((e) => Z(t.docPath), ["stop"])
						}, "+" + h(_t(t)) + " 更多分块…", 9, ft)) : r("", !0)])], 2)) : r("", !0)
					], 46, at))), 128))
				], 6)]),
				_: 1
			}, 512))])
		]));
	}
});
//#endregion
export { v as DocFlowCanvas, L as DocGraphViewer, y as DocViewer, b as MarkdownRenderer };

//# sourceMappingURL=index.js.map