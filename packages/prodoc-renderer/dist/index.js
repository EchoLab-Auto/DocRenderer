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
//#region ../prodoc-core/dist/tree-zDMnN1rT.js
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
function he(e, t, n) {
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!T(e).hasFrame) return n === null ? e : `---${r}${n}${r}---${r}${e}`;
	let i = e.split(/\r?\n/), a = i.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (a === -1) return e;
	let o = RegExp(`^${t}\\s*:`), s = i.slice(1, a).findIndex((e) => o.test(e));
	return n === null ? s >= 0 && i.splice(s + 1, 1) : s >= 0 ? i[s + 1] = n : i.splice(a, 0, n), i.join(r);
}
function ge(e, t) {
	return he(e, "link", t.length > 0 ? `link: [${t.map(D).join(", ")}]` : null);
}
function _e(e, t) {
	return he(e, "group", t === null ? null : `group: ${D(t)}`);
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
var ye = 72, O = 48, k = /* @__PURE__ */ new Set([
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
function A(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
var be = {
	t: "top",
	r: "right",
	b: "bottom",
	l: "left"
}, xe = {
	top: "t",
	right: "r",
	bottom: "b",
	left: "l"
}, j = /^([trbl_])>([trbl_])$/;
function Se(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(j);
		t ? (t[1] !== "_" && (n.fromSide = be[t[1]]), t[2] !== "_" && (n.toSide = be[t[2]])) : e !== "" && (n.label = e);
	}
	return n;
}
function Ce(e) {
	let t = e.ref;
	if (e.label && (t += ` | ${e.label}`), e.fromSide || e.toSide) {
		let n = e.fromSide ? xe[e.fromSide] : "_", r = e.toSide ? xe[e.toSide] : "_";
		t += ` | ${n}>${r}`;
	}
	return t;
}
var M = /^(.*)\s*@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
function we(e) {
	let t = e.match(M);
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
function Te(e) {
	let { name: t, x: n, y: r, w: i, h: a } = e;
	return [
		n,
		r,
		i,
		a
	].every((e) => typeof e == "number" && Number.isFinite(e)) ? `${t} @ ${n}, ${r}, ${i}, ${a}` : t;
}
function Ee(e, t) {
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
function De(e) {
	let t = e.match(/^#[ \t]+(.+)$/m);
	return t ? t[1].trim() : void 0;
}
function Oe(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
}
function ke(e) {
	return e.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_~]/g, "").replace(/<[^>]+>/g, "").trim();
}
function Ae(e) {
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
			let e = ke(i[1]);
			e && t.push({
				anchor: Oe(e),
				title: e
			});
		}
	}
	return t.length >= 2 ? t : [];
}
function N(e, t) {
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
function P(e, t, n, r) {
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
			m === a && (u += f + ye, f = 0, p = O, m = 0);
			let t = r.get(e.id);
			t.rawX === void 0 && (e.x = p), t.rawY === void 0 && (e.y = u), s.set(e.id, o(e)), p += e.w + 64, f = Math.max(f, e.h), m++;
		}
		d = u + f + ye;
	}
}
function je(e, t) {
	let n = e.map((e) => ({
		...e,
		x: 0,
		y: 0
	}));
	return P(n, t, N(n, t), new Map(n.map((e) => [e.id, {}]))), new Map(n.map((e) => [e.id, {
		x: e.x,
		y: e.y
	}]));
}
function Me(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let e of t) e.type === "parent" && (r.has(e.from) || (r.set(e.from, e.to), i.has(e.to) || i.set(e.to, []), i.get(e.to).push(e.from)));
	let a = new Map(e.map((e) => [e.id, e])), o = (e) => a.get(e)?.title ?? e;
	for (let e of i.values()) e.sort((e, t) => o(e).localeCompare(o(t)));
	let s = /* @__PURE__ */ new Map(), c = e.filter((e) => !r.has(e.id)), l = 48, u = /* @__PURE__ */ new Map();
	function d(e) {
		let t = u.get(e);
		if (t !== void 0) return t;
		let n = r.get(e), i = n ? d(n) + 1 : 0;
		return u.set(e, i), i;
	}
	for (let t of e) d(t.id);
	let f = 0;
	function p(e, t) {
		let n = a.get(e);
		if (!n) return {
			x: l,
			y: 48 + t * 72
		};
		let r = i.get(e) ?? [], o;
		if (r.length === 0) o = l, l += n.w + 64, f += 1;
		else {
			let e = r.map((e) => p(e, t + 1).x);
			o = (e[0] + e[e.length - 1]) / 2;
		}
		let c = 48 + t * 72;
		return s.set(e, {
			x: o,
			y: c
		}), {
			x: o,
			y: c
		};
	}
	for (let e of c) p(e.id, 0);
	return s;
}
function Ne(e) {
	let t = Object.keys(e).sort(), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let o of t) {
		let { params: t, body: s } = T(e[o]), c = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : o.replace(/\.md$/, ""), l = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || De(s) || c, u = Ae(s), d = A(t.w) ?? 220, f = A(t.h) ?? 96, p = {};
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
			if (e.length > 1 && n.push(`文档 "${c}" 声明了多个 group，仅取第一个 "${we(e[0]).name || e[0]}"`), e.length > 0) {
				let { name: t, geo: n } = we(e[0]);
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
			let { ref: n, label: r, fromSide: i, toSide: a } = Se(e);
			n && d(t.id, n, {
				label: r,
				fromSide: i,
				toSide: a
			}, t.id + ".link");
		}
		let r = n.parent;
		typeof r == "string" && r.trim() !== "" && d(t.id, r, {}, t.id + ".parent", "parent");
	}
	let f = N(o, c);
	for (let e of o) e.depth = f.get(e.id) ?? 0;
	P(o, c, f, i);
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
			...Ee(t.members, t.geo),
			explicit: t.geo !== void 0,
			holder: t.holder ?? t.members[0].docPath
		})),
		warnings: n
	};
}
function Pe(e, t) {
	let n = T(e), r = n.params.title;
	if (typeof r == "string" && r.trim()) return r.trim();
	let i = n.body.match(/^#\s+(.+)$/m);
	return i ? i[1].trim() : (t.split("/").pop() ?? t).replace(/\.md$/, "");
}
function Fe(e) {
	let t = [], n = [], r = /* @__PURE__ */ new Map();
	for (let i of e) {
		let e = T(i.content).params, a = typeof e.id == "string" && e.id.trim() ? e.id.trim() : i.path.replace(/\.md$/, ""), o = typeof e.order == "number" ? e.order : typeof e.order == "string" && Number(e.order) || 0, s = typeof e.parent == "string" && e.parent.trim() ? e.parent.trim() : void 0;
		n.push({
			path: i.path,
			id: a,
			title: Pe(i.content, i.path),
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
function Ie(e) {
	let t = [], n = (e) => {
		t.push(e);
		for (let t of e.children) n(t);
	};
	return n(e), t;
}
//#endregion
//#region src/components/DocGraphViewer.vue?vue&type=script&setup=true&lang.ts
var Le = { class: "pd-graph-viewer" }, Re = { class: "pd-graph-header" }, ze = {
	key: 0,
	class: "pd-graph-current"
}, Be = { class: "pd-graph-actions" }, Ve = ["disabled"], He = ["disabled"], Ue = ["disabled"], We = { class: "pd-tree-sidebar__head" }, Ge = ["aria-label"], Ke = {
	key: 0,
	class: "pd-tree-sidebar__nav",
	"aria-label": "文档索引树"
}, qe = { class: "pd-tree" }, Je = { class: "pd-graph-main" }, Ye = ["title", "onPointerdown"], Xe = ["aria-label", "onPointerdown"], Ze = ["width", "height"], Qe = ["d", "onClick"], $e = ["d"], et = ["x", "y"], tt = ["d"], nt = [
	"x1",
	"y1",
	"x2",
	"y2"
], rt = {
	key: 1,
	class: "pd-edge-handles"
}, it = ["cx", "cy"], at = ["cx", "cy"], ot = ["aria-label"], st = [
	"aria-label",
	"onPointerdown",
	"onClick",
	"onKeydown",
	"onMouseenter"
], ct = { class: "pd-doc-box__head" }, lt = { class: "pd-doc-box__title" }, ut = [
	"aria-label",
	"onClick",
	"onKeydown"
], dt = ["aria-label", "onPointerdown"], ft = {
	class: "pd-doc-blocks-pop__card",
	role: "menu"
}, pt = [
	"title",
	"aria-label",
	"onClick",
	"onKeydown"
], mt = ["aria-label", "onClick"], ht = 30, gt = /* @__PURE__ */ s({
	__name: "DocGraphViewer",
	props: { files: {} },
	emits: ["navigate", "save"],
	setup(s, { emit: ee }) {
		let v = s, y = ee, b = p(/* @__PURE__ */ new Map()), x = t(() => b.value.size > 0), le = t(() => b.value.size ? {
			...v.files,
			...Object.fromEntries(b.value)
		} : v.files), S = t(() => Ne(le.value)), ue = t(() => Object.fromEntries(Object.entries(v.files).map(([e, t]) => [e, T(t).body])));
		ne(() => S.value.warnings, (e) => e.forEach((e) => console.warn("[ProDoc]", e)), { immediate: !0 });
		let C = p(null), w = t(() => Fe(Object.entries(le.value).map(([e, t]) => ({
			path: e,
			content: t
		}))).root), fe = t(() => Ie(w.value)), pe = t(() => {
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
			Pe();
			for (let e of w.value.children) e.isDir && (D.value[e.path] = !0);
		});
		function he(e) {
			(e.isDir || e.children.length) && (D.value[e.path] = !D.value[e.path]);
		}
		function ye(e) {
			e.isDir ? he(e) : Z(e.path);
		}
		let O = p(null), k = t(() => {
			let e = 0, t = 0;
			for (let n of F.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			for (let n of I.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
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
		function be(e, t) {
			let n = e.x + e.w / 2, r = e.y + e.h / 2, i = t.x + t.w / 2 - n, a = t.y + t.h / 2 - r;
			return Math.abs(a) >= Math.abs(i) ? {
				fs: a >= 0 ? "bottom" : "top",
				ts: a >= 0 ? "top" : "bottom"
			} : {
				fs: i >= 0 ? "right" : "left",
				ts: i >= 0 ? "left" : "right"
			};
		}
		function xe(e, t, n, r) {
			let i = be(e, t), a = A(e, n ?? i.fs), o = A(t, r ?? i.ts), s = Math.hypot(o.x - a.x, o.y - a.y), c = Math.max(24, Math.min(s * .45, 96)), l = `M ${a.x} ${a.y} C ${a.x + a.nx * c} ${a.y + a.ny * c}, ${o.x + o.nx * c} ${o.y + o.ny * c}, ${o.x} ${o.y}`;
			return {
				x1: a.x,
				y1: a.y,
				x2: o.x,
				y2: o.y,
				d: l
			};
		}
		let j = t(() => {
			let e = new Map(F.value.map((e) => [e.id, e])), t = J.value;
			return S.value.relations.flatMap((n) => {
				let r = e.get(n.from), i = e.get(n.to);
				if (!r || !i) return [];
				let a = n.type, o = n.fromSide, s = n.toSide;
				t && t.edgeId === n.id && (t.which === "from" ? o = t.side : s = t.side);
				let { x1: c, y1: l, x2: u, y2: d, d: f } = xe(r, i, o, s);
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
		}), M = p(null);
		function we(e) {
			H.value || G.value || J.value || (M.value = e);
		}
		let De = t(() => {
			if (!M.value) return /* @__PURE__ */ new Set();
			let e = /* @__PURE__ */ new Set([M.value]);
			for (let t of S.value.relations) t.from === M.value && e.add(t.to), t.to === M.value && e.add(t.from);
			return e;
		}), Oe = (e) => M.value !== null && !De.value.has(e), ke = (e) => M.value !== null && (e.fromId === M.value || e.toId === M.value), Ae = (e) => M.value !== null && !ke(e), N = p(null), P = p("tree");
		function Pe() {
			P.value = "tree", N.value = Me(S.value.boxes, S.value.relations);
		}
		function gt() {
			P.value = "layered", N.value = je(S.value.boxes, S.value.relations);
		}
		function _t() {
			P.value = "file", N.value = null;
		}
		let F = t(() => S.value.boxes.map((e) => {
			let t = N.value?.get(e.id);
			return t ? {
				...e,
				x: t.x,
				y: t.y
			} : e;
		}));
		function vt(e, t) {
			let n = new Map(N.value ?? []);
			n.set(e, t), N.value = n;
		}
		let I = t(() => {
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
				let r = n.members.map((e) => F.value.find((t) => t.id === e)).filter((e) => !!e);
				return {
					...n,
					...Ee(r)
				};
			});
		}), yt = (e) => M.value !== null && !e.members.some((e) => De.value.has(e)), bt = (e) => e.blocks.slice(0, 6), xt = (e) => Math.max(0, e.blocks.length - 6), St = (e) => (bt(e).length + +(xt(e) > 0)) * ht + 12, Ct = (e, t) => e.y + e.h + 6 + St(e) > t, L = p(!1);
		function R(e) {
			return b.value.get(e) ?? v.files[e];
		}
		function z(e, t) {
			let n = new Map(b.value);
			t === v.files[e] ? n.delete(e) : n.set(e, t), b.value = n;
		}
		let B = p(!1);
		function wt() {
			if (!(!x.value || B.value)) {
				B.value = !0;
				for (let [e, t] of b.value) y("save", e, t, v.files[e]);
			}
		}
		function Tt() {
			if (!x.value) return;
			let e = new Set([...b.value.keys()].map((e) => S.value.boxes.find((t) => t.docPath === e)?.id).filter((e) => !!e));
			if (b.value = /* @__PURE__ */ new Map(), N.value) {
				let t = new Map(N.value);
				e.forEach((e) => t.delete(e)), N.value = t.size > 0 ? t : null;
			}
			K.value = null, L.value = !1;
		}
		function Et() {
			if (L.value) {
				if (x.value) return;
				K.value = null, L.value = !1;
			} else L.value = !0;
		}
		let Dt = p(null);
		function V(e, t) {
			let n = Dt.value;
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
		let H = p(null), U = p([]), Ot = {
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
		}, kt = {
			x: ["end"],
			y: ["end"]
		};
		function W(e, t) {
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
		function At(e, t, n, r) {
			let i = Math.min(Math.max(8 / n, 4), 12), a = {};
			for (let n of ["x", "y"]) {
				let o = W(e, n), s = r[n].map((e) => o[e]), c = null;
				for (let e of t) for (let t of Object.values(W(e, n))) for (let e of s) {
					let n = t - e;
					Math.abs(n) <= i && (c === null || Math.abs(n) < Math.abs(c)) && (c = n);
				}
				c !== null && (a[n === "x" ? "dx" : "dy"] = c);
			}
			return a;
		}
		function jt(e, t, n) {
			let r = [], i = /* @__PURE__ */ new Set();
			for (let a of ["x", "y"]) {
				let o = W(e, a), s = n[a].map((e) => o[e]);
				for (let n of t) for (let t of Object.values(W(n, a))) {
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
		function Mt(e, t, n, r) {
			let i = F.value.find((t) => t.id === e);
			if (!i) return {
				x: t,
				y: n,
				guides: []
			};
			let a = F.value.filter((t) => t.id !== e), o = At({
				x: t,
				y: n,
				w: i.w,
				h: i.h
			}, a, r, Ot), s = Math.round(t + (o.dx ?? 0)), c = Math.round(n + (o.dy ?? 0));
			return {
				x: s,
				y: c,
				guides: o.dx !== void 0 || o.dy !== void 0 ? jt({
					x: s,
					y: c,
					w: i.w,
					h: i.h
				}, a, Ot) : []
			};
		}
		let Nt = !1;
		function Pt(e, t) {
			L.value && e.button === 0 && (e.target.closest("button") || (H.value = {
				id: t.id,
				path: t.docPath,
				startClientX: e.clientX,
				startClientY: e.clientY,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				scale: V(e.clientX, e.clientY).scale,
				baseX: t.x,
				baseY: t.y,
				moved: !1,
				raf: 0
			}, window.addEventListener("pointermove", Ft), window.addEventListener("pointerup", Rt), window.addEventListener("pointercancel", Rt), M.value = null));
		}
		function Ft(e) {
			let t = H.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(It));
		}
		function It() {
			let e = H.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			e.moved = !0;
			let r = Mt(e.id, e.baseX + t, e.baseY + n, e.scale);
			vt(e.id, {
				x: r.x,
				y: r.y
			}), U.value = r.guides;
		}
		function Lt() {
			let e = H.value;
			if (H.value = null, U.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			Nt = !0;
			let t = N.value?.get(e.id);
			if (!t) return;
			let n = R(e.path);
			n !== void 0 && z(e.path, ve(n, t));
		}
		function Rt() {
			window.removeEventListener("pointermove", Ft), window.removeEventListener("pointerup", Rt), window.removeEventListener("pointercancel", Rt), Lt();
		}
		function zt(e) {
			if (Nt) {
				Nt = !1;
				return;
			}
			L.value || Z(e);
		}
		let G = p(null);
		function Bt(e, t) {
			if (!L.value || e.button !== 0) return;
			e.preventDefault();
			let n = V(e.clientX, e.clientY);
			G.value = {
				fromId: t.id,
				x: n.x,
				y: n.y,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", Vt), window.addEventListener("pointerup", Gt), window.addEventListener("pointercancel", Wt), M.value = null;
		}
		function Vt(e) {
			let t = G.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Ht));
		}
		function Ht() {
			let e = G.value;
			if (!e) return;
			e.raf = 0;
			let t = V(e.lastClientX, e.lastClientY);
			G.value = {
				...e,
				x: t.x,
				y: t.y
			};
		}
		function Ut() {
			window.removeEventListener("pointermove", Vt), window.removeEventListener("pointerup", Gt), window.removeEventListener("pointercancel", Wt);
		}
		function Wt() {
			Ut();
			let e = G.value;
			e?.raf && cancelAnimationFrame(e.raf), G.value = null;
		}
		function Gt(e) {
			Ut();
			let t = G.value;
			if (t?.raf && cancelAnimationFrame(t.raf), G.value = null, !t) return;
			let n = V(e.clientX, e.clientY), r = F.value.find((e) => n.x >= e.x && n.x <= e.x + e.w && n.y >= e.y && n.y <= e.y + e.h);
			!r || r.id === t.fromId || S.value.relations.some((e) => e.from === t.fromId && e.to === r.id) || Kt(t.fromId, r.id);
		}
		function Kt(e, t) {
			let n = S.value.boxes.find((t) => t.id === e);
			if (!n) return;
			let r = R(n.docPath);
			r !== void 0 && z(n.docPath, ge(r, [...me(r), t]));
		}
		let qt = t(() => {
			let e = G.value;
			if (!e) return null;
			let t = F.value.find((t) => t.id === e.fromId);
			return t ? xe(t, {
				x: e.x,
				y: e.y,
				w: 0,
				h: 0
			}).d : null;
		}), K = p(null), q = t(() => j.value.find((e) => e.id === K.value) ?? null);
		function Jt(e) {
			L.value && (K.value = e.id);
		}
		let J = p(null);
		function Yt(e, t, n) {
			let r = t - (e.x + e.w / 2), i = n - (e.y + e.h / 2);
			return Math.abs(r) / (e.w / 2) >= Math.abs(i) / (e.h / 2) ? r >= 0 ? "right" : "left" : i >= 0 ? "bottom" : "top";
		}
		function Xt(e, t, n) {
			if (e.button !== 0) return;
			e.preventDefault(), e.stopPropagation();
			let r = be(F.value.find((e) => e.id === t.fromId), F.value.find((e) => e.id === t.toId));
			J.value = {
				edgeId: t.id,
				which: n,
				side: (n === "from" ? t.fromSide : t.toSide) ?? (n === "from" ? r.fs : r.ts),
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", Zt), window.addEventListener("pointerup", tn), window.addEventListener("pointercancel", en), M.value = null;
		}
		function Zt(e) {
			let t = J.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Qt));
		}
		function Qt() {
			let e = J.value;
			if (!e) return;
			e.raf = 0;
			let t = j.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = F.value.find((n) => n.id === (e.which === "from" ? t.fromId : t.toId));
			if (!n) return;
			let r = V(e.lastClientX, e.lastClientY), i = Yt(n, r.x, r.y);
			i !== e.side && (J.value = {
				...e,
				side: i
			});
		}
		function $t() {
			window.removeEventListener("pointermove", Zt), window.removeEventListener("pointerup", tn), window.removeEventListener("pointercancel", en);
		}
		function en() {
			$t();
			let e = J.value;
			e?.raf && cancelAnimationFrame(e.raf), J.value = null;
		}
		function tn() {
			$t();
			let e = J.value;
			if (e?.raf && cancelAnimationFrame(e.raf), J.value = null, !e) return;
			let t = j.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.which === "from" ? e.side : t.fromSide, r = e.which === "to" ? e.side : t.toSide;
			n === t.fromSide && r === t.toSide || nn(t, n, r);
		}
		function nn(e, t, n) {
			let r = S.value.boxes.find((t) => t.id === e.fromId);
			if (!r) return;
			let i = R(r.docPath);
			if (i === void 0) return;
			let a = me(i).map((r) => {
				let i = Se(r);
				return rn(i.ref) === e.toId ? Ce({
					ref: i.ref,
					label: i.label,
					fromSide: t,
					toSide: n
				}) : r;
			});
			z(r.docPath, ge(i, a));
		}
		function rn(e) {
			let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md", r = S.value.boxes;
			return (r.find((e) => e.id === t) ?? r.find((e) => e.docPath === t) ?? r.find((e) => e.docPath === n))?.id;
		}
		function an() {
			let e = q.value;
			if (!e) return;
			let t = S.value.boxes.find((t) => t.id === e.fromId);
			if (!t) return;
			let n = R(t.docPath);
			if (n === void 0) return;
			let r = me(n).filter((t) => rn(Se(t).ref) !== e.toId);
			z(t.docPath, ge(n, r)), K.value = null;
		}
		let Y = p(null), X = p(null);
		function on(e, t) {
			if (!L.value || e.button !== 0) return;
			e.preventDefault();
			let n = I.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = /* @__PURE__ */ new Map();
			for (let e of t.members) {
				let t = F.value.find((t) => t.id === e);
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
				scale: V(e.clientX, e.clientY).scale,
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
			}, window.addEventListener("pointermove", sn), window.addEventListener("pointerup", ln), window.addEventListener("pointercancel", ln), M.value = null;
		}
		function sn(e) {
			let t = Y.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(cn));
		}
		function cn() {
			let e = Y.value;
			if (!e) return;
			e.raf = 0;
			let t = Math.round((e.lastClientX - e.startClientX) / e.scale), n = Math.round((e.lastClientY - e.startClientY) / e.scale);
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = [...F.value.filter((t) => !e.basePositions.has(t.id)), ...I.value.filter((t) => t.name !== e.name)], i = At({
				x: e.baseRegion.x + t,
				y: e.baseRegion.y + n,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, e.scale, Ot), a = t + (i.dx ?? 0), o = n + (i.dy ?? 0);
			Y.value = {
				...e,
				dx: a,
				dy: o,
				moved: !0
			};
			for (let [t, n] of e.basePositions) vt(t, {
				x: n.x + a,
				y: n.y + o
			});
			U.value = i.dx !== void 0 || i.dy !== void 0 ? jt({
				x: e.baseRegion.x + a,
				y: e.baseRegion.y + o,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, Ot) : [];
		}
		function ln() {
			window.removeEventListener("pointermove", sn), window.removeEventListener("pointerup", ln), window.removeEventListener("pointercancel", ln);
			let e = Y.value;
			if (Y.value = null, U.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = S.value.groups.find((t) => t.name === e.name);
			if (t) {
				for (let n of t.members) {
					let t = S.value.boxes.find((e) => e.id === n), r = e.basePositions.get(n);
					if (!t || !r) continue;
					let i = R(t.docPath);
					i !== void 0 && z(t.docPath, ve(i, {
						x: r.x + e.dx,
						y: r.y + e.dy
					}));
				}
				if (t.explicit) {
					let n = R(t.holder);
					n !== void 0 && z(t.holder, _e(n, Te({
						name: t.name,
						x: e.baseRegion.x + e.dx,
						y: e.baseRegion.y + e.dy,
						w: e.baseRegion.w,
						h: e.baseRegion.h
					})));
				}
			}
		}
		function un(e, t) {
			if (!L.value || e.button !== 0) return;
			e.preventDefault();
			let n = I.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = t.members.map((e) => F.value.find((t) => t.id === e)).filter((e) => !!e), i = Math.max(...r.map((e) => e.x + e.w)), a = Math.max(...r.map((e) => e.y + e.h));
			X.value = {
				name: t.name,
				startClientX: e.clientX,
				startClientY: e.clientY,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				scale: V(e.clientX, e.clientY).scale,
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
			}, window.addEventListener("pointermove", dn), window.addEventListener("pointerup", pn), window.addEventListener("pointercancel", pn), M.value = null;
		}
		function dn(e) {
			let t = X.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(fn));
		}
		function fn() {
			let e = X.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = Math.round(e.baseRegion.w + t), i = Math.round(e.baseRegion.h + n), a = [...F.value.filter((t) => !e.memberIds.has(t.id)), ...I.value.filter((t) => t.name !== e.name)], o = At({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: r,
				h: i
			}, a, e.scale, kt), s = Math.max(e.minW, Math.round(r + (o.dx ?? 0))), c = Math.max(e.minH, Math.round(i + (o.dy ?? 0)));
			X.value = {
				...e,
				curW: s,
				curH: c,
				moved: !0
			}, U.value = o.dx !== void 0 || o.dy !== void 0 ? jt({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: s,
				h: c
			}, a, kt) : [];
		}
		function pn() {
			window.removeEventListener("pointermove", dn), window.removeEventListener("pointerup", pn), window.removeEventListener("pointercancel", pn);
			let e = X.value;
			if (X.value = null, U.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = S.value.groups.find((t) => t.name === e.name);
			if (!t) return;
			let n = R(t.holder);
			n !== void 0 && z(t.holder, _e(n, Te({
				name: t.name,
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: e.curW,
				h: e.curH
			})));
		}
		function mn(e) {
			C.value || !L.value || !K.value || (e.key === "Delete" || e.key === "Backspace") && (e.preventDefault(), an());
		}
		typeof window < "u" && window.addEventListener("keydown", mn);
		let hn = t(() => C.value ? S.value.boxes.find((e) => e.docPath === C.value)?.title ?? C.value : "");
		function gn() {
			let e = C.value ? `#${encodeURIComponent(C.value)}` : "#";
			history.replaceState(null, "", e);
		}
		function Z(e) {
			v.files[e] && (Q.value = !1, C.value = e, y("navigate", e), gn());
		}
		function _n(e) {
			document.querySelector(`.pd-doc-view [data-heading-id$="-${e}"]`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function vn(e, t) {
			if (C.value === e) {
				_n(t);
				return;
			}
			Z(e), c(() => {
				setTimeout(() => _n(t), 80), setTimeout(() => _n(t), 320);
			});
		}
		function yn() {
			C.value = null, gn(), c(() => requestAnimationFrame(() => O.value?.fit?.()));
		}
		ne(() => v.files, (e) => {
			if (B.value = !1, C.value && !e[C.value] && yn(), b.value.size) {
				let t = new Map(b.value);
				for (let [n, r] of t) (e[n] === r || e[n] === void 0) && t.delete(n);
				b.value = t;
			}
			if (!N.value) return;
			let t = S.value.boxes, n = new Map(N.value);
			for (let [e, r] of n) {
				let i = t.find((t) => t.id === e);
				(!i || i.x === r.x && i.y === r.y) && n.delete(e);
			}
			N.value = n.size > 0 ? n : null;
		});
		let Q = p(!1), $ = p(""), bn = t(() => C.value !== null && $.value !== (v.files[C.value] ?? ""));
		function xn() {
			C.value && ($.value = v.files[C.value] ?? "", Q.value = !0);
		}
		function Sn(e) {
			Z(e), xn();
		}
		function Cn() {
			Q.value = !1;
		}
		function wn() {
			!C.value || !bn.value || y("save", C.value, $.value, v.files[C.value]);
		}
		function Tn(e) {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), wn());
		}
		function En(e, t) {
			L.value || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), Z(t));
		}
		function Dn(e, t) {
			if (/^(https?:|mailto:|#)/.test(t)) return null;
			let n = t.split("#")[0].trim();
			if (!n.endsWith(".md")) return null;
			let r = n.startsWith("/") ? n.split("/") : [...e.split("/").slice(0, -1), ...n.split("/")], i = [];
			for (let e of r) e === "" || e === "." || (e === ".." ? i.pop() : i.push(e));
			return i.join("/");
		}
		function On(e) {
			if (!C.value) return;
			let t = Dn(C.value, e);
			t && Z(t);
		}
		function kn(e) {
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
		return (t, s) => (f(), i("div", Le, [
			a("header", Re, [
				s[7] ||= a("span", { class: "pd-graph-brand" }, "📚 ProDoc", -1),
				C.value ? (f(), i("span", ze, h(hn.value), 1)) : r("", !0),
				a("div", Be, [
					C.value ? r("", !0) : (f(), i(e, { key: 0 }, [
						L.value ? (f(), i(e, { key: 1 }, [a("button", {
							class: "pd-back-btn",
							disabled: !x.value || B.value,
							onClick: wt
						}, "💾 保存", 8, Ve), x.value ? (f(), i("button", {
							key: 0,
							class: "pd-back-btn",
							disabled: B.value,
							onClick: Tt
						}, "↩ 放弃更改", 8, He)) : (f(), i("button", {
							key: 1,
							class: "pd-back-btn pd-back-btn--active",
							onClick: Et
						}, "✓ 完成"))], 64)) : (f(), i("button", {
							key: 0,
							class: "pd-back-btn",
							onClick: Et
						}, "🛠 编辑图")),
						a("button", {
							class: l(["pd-back-btn", { "pd-back-btn--active": P.value === "tree" }]),
							onClick: Pe
						}, " 🌳 树状排列 ", 2),
						a("button", {
							class: l(["pd-back-btn", { "pd-back-btn--active": P.value === "layered" }]),
							onClick: gt
						}, " 🕸 分层排列 ", 2),
						a("button", {
							class: l(["pd-back-btn", { "pd-back-btn--active": P.value === "file" }]),
							onClick: _t
						}, " 📄 文件坐标 ", 2)
					], 64)),
					C.value ? (f(), i(e, { key: 1 }, [Q.value ? (f(), i(e, { key: 1 }, [a("button", {
						class: "pd-back-btn",
						disabled: !bn.value,
						onClick: wn
					}, "💾 保存", 8, Ue), a("button", {
						class: "pd-back-btn",
						onClick: Cn
					}, "👁 预览")], 64)) : (f(), i("button", {
						key: 0,
						class: "pd-back-btn",
						onClick: xn
					}, "✏️ 编辑")), a("button", {
						class: "pd-back-btn",
						onClick: yn
					}, "🗺 返回图")], 64)) : r("", !0),
					o(te(ae), { size: "small" })
				])
			]),
			a("aside", { class: l(["pd-tree-sidebar", { "pd-tree-sidebar--hidden": C.value !== "" }]) }, [a("div", We, [s[8] ||= a("span", null, "文档索引", -1), a("button", {
				type: "button",
				class: "pd-tree-sidebar__collapse",
				"aria-label": E.value ? "收起索引" : "展开索引",
				onClick: s[0] ||= (e) => E.value = !E.value
			}, h(E.value ? "⟨" : "⟩"), 9, Ge)]), E.value ? (f(), i("nav", Ke, [a("ul", qe, [(f(!0), i(e, null, m(w.value.children, (e) => (f(), i("li", { key: e.path || e.id }, [o(de, {
				node: e,
				expanded: D.value,
				"current-path": C.value ?? "",
				onToggle: he,
				onOpen: ye
			}, null, 8, [
				"node",
				"expanded",
				"current-path"
			])]))), 128))])])) : r("", !0)], 2),
			a("div", Je, [C.value ? (f(), i("div", {
				key: 1,
				class: l(["pd-doc-view", { "pd-doc-view--editing": Q.value }])
			}, [Q.value ? (f(), n(te(oe), {
				key: C.value,
				value: $.value,
				class: "pd-doc-editor",
				onChange: s[6] ||= (e) => $.value = e,
				onKeydown: Tn
			}, null, 8, ["value"])) : (f(), n(te(se), {
				key: C.value,
				content: ue.value[C.value],
				"show-toc": !0,
				"flow-editable": !0,
				onDocLink: On,
				onFlowNodeMove: kn
			}, null, 8, ["content"]))], 2)) : (f(), n(te(ie), {
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
				default: re(() => [a("div", {
					ref_key: "stageEl",
					ref: Dt,
					class: l(["pd-graph-stage", {
						"pd-graph-stage--dragging": H.value?.moved || G.value || J.value || Y.value?.moved || X.value?.moved,
						"pd-graph-stage--editing": L.value
					}]),
					style: u({
						width: `${k.value.w}px`,
						height: `${k.value.h}px`
					}),
					onClick: s[5] ||= (e) => K.value = null
				}, [
					(f(!0), i(e, null, m(I.value, (e) => (f(), i("div", {
						key: "group-" + e.name,
						class: l(["pd-doc-group", { "pd-dim": yt(e) }]),
						style: u({
							left: `${e.x}px`,
							top: `${e.y}px`,
							width: `${e.w}px`,
							height: `${e.h}px`
						})
					}, [a("span", {
						class: "pd-doc-group__label",
						title: L.value ? `拖动移动整组「${e.name}」` : e.name,
						"data-nm-no-pan": "",
						onPointerdown: (t) => on(t, e)
					}, h(e.name), 41, Ye), L.value ? (f(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-group__resize",
						"aria-label": `调整组「${e.name}」的区域尺寸`,
						title: "拖动调整区域尺寸",
						"data-nm-no-pan": "",
						onPointerdown: _((t) => un(t, e), ["stop"])
					}, null, 40, Xe)) : r("", !0)], 6))), 128)),
					j.value.length || qt.value ? (f(), i("svg", {
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
						(f(!0), i(e, null, m(j.value, (e) => (f(), i("g", {
							key: e.id,
							class: l(["pd-relation", {
								"pd-relation--parent": e.kind === "parent",
								"pd-dim": Ae(e),
								"pd-hot": ke(e),
								"pd-selected": e.id === K.value
							}])
						}, [
							a("title", null, h(e.fromTitle) + " → " + h(e.toTitle) + h(e.label ? `（${e.label}）` : ""), 1),
							a("path", {
								class: "pd-relation-hit",
								d: e.d,
								fill: "none",
								onClick: _((t) => Jt(e), ["stop"])
							}, null, 8, Qe),
							a("path", {
								d: e.d,
								fill: "none",
								"marker-end": "url(#pd-relation-arrow)",
								"pointer-events": "none"
							}, null, 8, $e),
							e.label ? (f(), i("text", {
								key: 0,
								x: e.labelX,
								y: e.labelY,
								"pointer-events": "none"
							}, h(e.label), 9, et)) : r("", !0)
						], 2))), 128)),
						qt.value ? (f(), i("path", {
							key: 0,
							class: "pd-relation-draft",
							d: qt.value,
							fill: "none"
						}, null, 8, tt)) : r("", !0),
						(f(!0), i(e, null, m(U.value, (e, t) => (f(), i("line", {
							key: "guide" + t,
							class: "pd-guide",
							x1: e.axis === "x" ? e.pos : e.start,
							y1: e.axis === "x" ? e.start : e.pos,
							x2: e.axis === "x" ? e.pos : e.end,
							y2: e.axis === "x" ? e.end : e.pos
						}, null, 8, nt))), 128)),
						L.value && q.value ? (f(), i("g", rt, [a("circle", {
							class: "pd-edge-handle",
							cx: q.value.x1,
							cy: q.value.y1,
							r: "6",
							onPointerdown: s[1] ||= _((e) => Xt(e, q.value, "from"), ["stop"])
						}, [...s[9] ||= [a("title", null, "拖动调整源框连接边", -1)]], 40, it), a("circle", {
							class: "pd-edge-handle",
							cx: q.value.x2,
							cy: q.value.y2,
							r: "6",
							onPointerdown: s[2] ||= _((e) => Xt(e, q.value, "to"), ["stop"])
						}, [...s[10] ||= [a("title", null, "拖动调整目标框连接边", -1)]], 40, at)])) : r("", !0)
					], 8, Ze)) : r("", !0),
					L.value && q.value ? (f(), i("button", {
						key: 1,
						type: "button",
						class: "pd-edge-delete",
						style: u({
							left: `${q.value.labelX}px`,
							top: `${q.value.labelY}px`
						}),
						"aria-label": `删除连线 ${q.value.fromTitle} → ${q.value.toTitle}`,
						title: "删除连线（Delete）",
						onClick: _(an, ["stop"])
					}, "✕", 12, ot)) : r("", !0),
					(f(!0), i(e, null, m(F.value, (t) => (f(), i("div", {
						key: t.id,
						class: l(["pd-doc-box", [`pd-doc-box--d${Math.min(t.depth, 3)}`, { "pd-dim": Oe(t.id) }]]),
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
						onPointerdown: (e) => Pt(e, t),
						onClick: (e) => zt(t.docPath),
						onKeydown: (e) => En(e, t.docPath),
						onMouseenter: (e) => we(t.id),
						onMouseleave: s[4] ||= (e) => we(null)
					}, [
						a("div", ct, [a("span", lt, h(t.title), 1), s[12] ||= a("span", {
							class: "pd-doc-box__icon",
							"aria-hidden": "true"
						}, "↗", -1)]),
						L.value ? r("", !0) : (f(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-box__edit",
							"aria-label": `编辑 ${t.title}`,
							title: "编辑文档",
							onClick: _((e) => Sn(t.docPath), ["stop"]),
							onKeydown: [g(_((e) => Sn(t.docPath), ["stop"]), ["enter"]), g(_((e) => Sn(t.docPath), ["stop"]), ["space"])]
						}, "✏️", 40, ut)),
						L.value ? (f(), i("button", {
							key: 1,
							type: "button",
							class: "pd-doc-box__link-handle",
							"aria-label": `从 ${t.title} 创建连线（拖到目标框）`,
							title: "拖到其他框创建连线",
							onPointerdown: _((e) => Bt(e, t), ["stop"]),
							onClick: s[3] ||= _(() => {}, ["stop"])
						}, null, 40, dt)) : r("", !0),
						t.blocks.length && !L.value ? (f(), i("div", {
							key: 2,
							class: l(["pd-doc-blocks-pop", { "pd-doc-blocks-pop--above": Ct(t, k.value.h) }])
						}, [a("div", ft, [(f(!0), i(e, null, m(bt(t), (e) => (f(), i("button", {
							key: e.anchor,
							type: "button",
							class: "pd-doc-blocks-pop__item",
							title: e.title,
							"aria-label": `跳转到「${e.title}」分块`,
							onClick: _((n) => vn(t.docPath, e.anchor), ["stop"]),
							onKeydown: [g(_((n) => vn(t.docPath, e.anchor), ["stop"]), ["enter"]), g(_((n) => vn(t.docPath, e.anchor), ["stop"]), ["space"])]
						}, "▸ " + h(e.title), 41, pt))), 128)), xt(t) > 0 ? (f(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more",
							"aria-label": `查看全部 ${t.blocks.length} 个分块`,
							onClick: _((e) => Z(t.docPath), ["stop"])
						}, "+" + h(xt(t)) + " 更多分块…", 9, mt)) : r("", !0)])], 2)) : r("", !0)
					], 46, st))), 128))
				], 6)]),
				_: 1
			}, 512))])
		]));
	}
});
//#endregion
export { v as DocFlowCanvas, gt as DocGraphViewer, y as DocViewer, b as MarkdownRenderer };

//# sourceMappingURL=index.js.map