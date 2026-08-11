import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createVNode as o, defineComponent as s, nextTick as c, normalizeClass as l, normalizeStyle as u, openBlock as d, ref as f, renderList as p, toDisplayString as m, unref as h, watch as ee, withCtx as te, withKeys as g, withModifiers as _ } from "vue";
import { NeumorphismCanvas as ne, NeumorphismThemeToggle as re } from "@echolab-auto/ui-frame";
import { DocFlowCanvas as ie, DocViewer as v, MarkdownEditor as ae, MarkdownRenderer as y, MarkdownRenderer as oe, writeFlowNodePosition as se } from "@echolab-auto/ui-frame/doc";
import "@echolab-auto/ui-frame/dist/style.css";
//#region ../prodoc-core/dist/graph-BOtErvvM.js
function b(e) {
	let t = [], n = "", r = null;
	for (let i of e) r ? (n += i, i === r && (r = null)) : i === "\"" || i === "'" ? (r = i, n += i) : i === "," ? (t.push(n), n = "") : n += i;
	return t.push(n), t;
}
function x(e) {
	let t = e.trim();
	if (t === "") return "";
	if (t.startsWith("[") && t.endsWith("]")) return b(t.slice(1, -1)).map((e) => x(e)).filter((e) => e !== "");
	if (t === "true") return !0;
	if (t === "false") return !1;
	if (/^-?\d+$/.test(t)) return parseInt(t, 10);
	if (/^-?\d*\.\d+$/.test(t)) return parseFloat(t);
	let n = t.match(/^(["'])([\s\S]*)\1$/);
	return n ? n[2] : t;
}
function S(e) {
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
		t && (i[t[1]] = x(t[2]));
	}
	return {
		params: i,
		body: n.slice(r + 1).join("\n"),
		hasFrame: !0
	};
}
function C(e) {
	return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).filter((e) => typeof e == "string").map((e) => e.trim()).filter(Boolean);
}
function ce(e) {
	return C(S(e).params.link);
}
function w(e) {
	return e === "" || e !== e.trim() || /[|,"]/.test(e) ? e.includes("\"") ? `'${e}'` : `"${e}"` : e;
}
function T(e, t) {
	let n = e.includes("\r\n") ? "\r\n" : "\n", r = S(e), i = t.length > 0 ? `link: [${t.map(w).join(", ")}]` : null;
	if (!r.hasFrame) return i === null ? e : `---${n}${i}${n}---${n}${e}`;
	let a = e.split(/\r?\n/), o = a.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (o === -1) return e;
	let s = a.slice(1, o).findIndex((e) => /^link\s*:/.test(e));
	return i === null ? s >= 0 && a.splice(s + 1, 1) : s >= 0 ? a[s + 1] = i : a.splice(o, 0, i), a.join(n);
}
function le(e, t) {
	let n = Object.entries(t).filter((e) => (e[0] === "x" || e[0] === "y") && typeof e[1] == "number" && Number.isFinite(e[1]));
	if (n.length === 0) return e;
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!S(e).hasFrame) return `---${r}${n.map(([e, t]) => `${e}: ${t}`).join(r)}${r}---${r}${e}`;
	let i = e.split(/\r?\n/), a = i.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (a === -1) return e;
	let o = a;
	for (let [e, t] of n) {
		let n = RegExp(`^${e}\\s*:`), r = i.slice(1, o).findIndex((e) => n.test(e));
		r >= 0 ? i[r + 1] = `${e}: ${t}` : (i.splice(o, 0, `${e}: ${t}`), o++);
	}
	return i.join(r);
}
var E = 72, D = 48, ue = /* @__PURE__ */ new Set([
	"id",
	"title",
	"x",
	"y",
	"w",
	"h",
	"link"
]);
function O(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
var k = {
	t: "top",
	r: "right",
	b: "bottom",
	l: "left"
}, A = {
	top: "t",
	right: "r",
	bottom: "b",
	left: "l"
}, de = /^([trbl_])>([trbl_])$/;
function fe(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(de);
		t ? (t[1] !== "_" && (n.fromSide = k[t[1]]), t[2] !== "_" && (n.toSide = k[t[2]])) : e !== "" && (n.label = e);
	}
	return n;
}
function pe(e) {
	let t = e.ref;
	if (e.label && (t += ` | ${e.label}`), e.fromSide || e.toSide) {
		let n = e.fromSide ? A[e.fromSide] : "_", r = e.toSide ? A[e.toSide] : "_";
		t += ` | ${n}>${r}`;
	}
	return t;
}
function j(e) {
	let t = e.match(/^#[ \t]+(.+)$/m);
	return t ? t[1].trim() : void 0;
}
function M(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
}
function me(e) {
	return e.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_~]/g, "").replace(/<[^>]+>/g, "").trim();
}
function he(e) {
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
			let e = me(i[1]);
			e && t.push({
				anchor: M(e),
				title: e
			});
		}
	}
	return t.length >= 2 ? t : [];
}
function ge(e, t) {
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
function N(e, t, n, r) {
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
	let u = [...l.keys()].sort((e, t) => e - t), d = D;
	for (let e of u) {
		let t = l.get(e), n = t.map((e, n) => {
			let r = (c.get(e.box.id) ?? []).map((e) => s.get(e)).filter((e) => e !== void 0);
			return {
				auto: e,
				bary: r.length ? r.reduce((e, t) => e + t, 0) / r.length : 2 ** 53 - 1 - (t.length - n)
			};
		});
		n.sort((e, t) => e.bary - t.bary);
		let i = n.map((e) => e.auto), u = d, f = 0, p = D, m = 0;
		for (let { box: e } of i) {
			m === a && (u += f + E, f = 0, p = D, m = 0);
			let t = r.get(e.id);
			t.rawX === void 0 && (e.x = p), t.rawY === void 0 && (e.y = u), s.set(e.id, o(e)), p += e.w + 64, f = Math.max(f, e.h), m++;
		}
		d = u + f + E;
	}
}
function _e(e, t) {
	let n = e.map((e) => ({
		...e,
		x: 0,
		y: 0
	}));
	return N(n, t, ge(n, t), new Map(n.map((e) => [e.id, {}]))), new Map(n.map((e) => [e.id, {
		x: e.x,
		y: e.y
	}]));
}
function ve(e) {
	let t = Object.keys(e).sort(), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let a of t) {
		let { params: t, body: o } = S(e[a]), s = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : a.replace(/\.md$/, ""), c = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || j(o) || s, l = he(o), u = O(t.w) ?? 220, d = O(t.h) ?? 96, f = {};
		for (let [e, n] of Object.entries(t)) ue.has(e) || (f[e] = n);
		let p = {
			id: s,
			title: c,
			docPath: a,
			depth: 0,
			blocks: l,
			x: O(t.x) ?? 0,
			y: O(t.y) ?? 0,
			w: u,
			h: d,
			attrs: f
		};
		i.set(s, {
			rawX: O(t.x),
			rawY: O(t.y)
		}), r.has(s) && n.push(`重复 id "${s}"：${r.get(s).docPath} 被 ${a} 覆盖`), r.set(s, p);
	}
	let a = [...r.values()], o = new Map(a.map((e) => [e.docPath, e])), s = [], c = /* @__PURE__ */ new Set();
	function l(e) {
		let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md";
		return r.get(t) ?? o.get(t) ?? o.get(n);
	}
	function u(e, t, r, i) {
		let a = l(e), o = l(t);
		if (!a || !o) {
			let r = a ? t : e;
			n.push("连线 " + i + " 引用了不存在的文档 \"" + r + "\"");
			return;
		}
		if (a.id === o.id) {
			n.push("文档 \"" + a.id + "\" 不能连线自身");
			return;
		}
		let u = a.id + "->" + o.id;
		c.has(u) || (c.add(u), s.push({
			id: u,
			type: "link",
			from: a.id,
			to: o.id,
			label: r.label,
			fromSide: r.fromSide,
			toSide: r.toSide
		}));
	}
	for (let t of a) {
		let { params: n } = S(e[t.docPath]);
		for (let e of C(n.link)) {
			let { ref: n, label: r, fromSide: i, toSide: a } = fe(e);
			n && u(t.id, n, {
				label: r,
				fromSide: i,
				toSide: a
			}, t.id + ".link");
		}
	}
	let d = ge(a, s);
	for (let e of a) e.depth = d.get(e.id) ?? 0;
	return N(a, s, d, i), {
		boxes: a,
		relations: s,
		warnings: n
	};
}
//#endregion
//#region src/components/DocGraphViewer.vue?vue&type=script&setup=true&lang.ts
var ye = { class: "pd-graph-viewer" }, be = { class: "pd-graph-header" }, xe = {
	key: 0,
	class: "pd-graph-current"
}, Se = { class: "pd-graph-actions" }, Ce = ["disabled"], we = ["disabled"], Te = ["disabled"], Ee = { class: "pd-graph-main" }, De = ["width", "height"], Oe = ["d", "onClick"], ke = ["d"], Ae = ["x", "y"], je = ["d"], Me = [
	"x1",
	"y1",
	"x2",
	"y2"
], Ne = {
	key: 1,
	class: "pd-edge-handles"
}, Pe = ["cx", "cy"], Fe = ["cx", "cy"], Ie = ["aria-label"], Le = [
	"aria-label",
	"onPointerdown",
	"onClick",
	"onKeydown",
	"onMouseenter"
], Re = { class: "pd-doc-box__head" }, ze = { class: "pd-doc-box__title" }, Be = [
	"aria-label",
	"onClick",
	"onKeydown"
], Ve = ["aria-label", "onPointerdown"], He = {
	class: "pd-doc-blocks-pop__card",
	role: "menu"
}, Ue = [
	"title",
	"aria-label",
	"onClick",
	"onKeydown"
], We = ["aria-label", "onClick"], Ge = 30, Ke = /* @__PURE__ */ s({
	__name: "DocGraphViewer",
	props: { files: {} },
	emits: ["navigate", "save"],
	setup(s, { emit: ie }) {
		let v = s, y = ie, b = f(/* @__PURE__ */ new Map()), x = t(() => b.value.size > 0), C = t(() => b.value.size ? {
			...v.files,
			...Object.fromEntries(b.value)
		} : v.files), w = t(() => ve(C.value)), E = t(() => Object.fromEntries(Object.entries(v.files).map(([e, t]) => [e, S(t).body])));
		ee(() => w.value.warnings, (e) => e.forEach((e) => console.warn("[ProDoc]", e)), { immediate: !0 });
		let D = f(null), ue = f(null), O = t(() => {
			let e = 0, t = 0;
			for (let n of F.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			return {
				w: Math.max(e, 640),
				h: Math.max(t, 480)
			};
		});
		function k(e, t) {
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
		function A(e, t) {
			let n = e.x + e.w / 2, r = e.y + e.h / 2, i = t.x + t.w / 2 - n, a = t.y + t.h / 2 - r;
			return Math.abs(a) >= Math.abs(i) ? {
				fs: a >= 0 ? "bottom" : "top",
				ts: a >= 0 ? "top" : "bottom"
			} : {
				fs: i >= 0 ? "right" : "left",
				ts: i >= 0 ? "left" : "right"
			};
		}
		function de(e, t, n, r) {
			let i = A(e, t), a = k(e, n ?? i.fs), o = k(t, r ?? i.ts), s = Math.hypot(o.x - a.x, o.y - a.y), c = Math.max(24, Math.min(s * .45, 96)), l = `M ${a.x} ${a.y} C ${a.x + a.nx * c} ${a.y + a.ny * c}, ${o.x + o.nx * c} ${o.y + o.ny * c}, ${o.x} ${o.y}`;
			return {
				x1: a.x,
				y1: a.y,
				x2: o.x,
				y2: o.y,
				d: l
			};
		}
		let j = t(() => {
			let e = new Map(F.value.map((e) => [e.id, e])), t = X.value;
			return w.value.relations.flatMap((n) => {
				let r = e.get(n.from), i = e.get(n.to);
				if (!r || !i) return [];
				let a = n.fromSide, o = n.toSide;
				t && t.edgeId === n.id && (t.which === "from" ? a = t.side : o = t.side);
				let { x1: s, y1: c, x2: l, y2: u, d } = de(r, i, a, o);
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
		}), M = f(null);
		function me(e) {
			H.value || K.value || X.value || (M.value = e);
		}
		let he = t(() => {
			if (!M.value) return /* @__PURE__ */ new Set();
			let e = /* @__PURE__ */ new Set([M.value]);
			for (let t of w.value.relations) t.from === M.value && e.add(t.to), t.to === M.value && e.add(t.from);
			return e;
		}), ge = (e) => M.value !== null && !he.value.has(e), N = (e) => M.value !== null && (e.fromId === M.value || e.toId === M.value), Ke = (e) => M.value !== null && !N(e), P = f(null), F = t(() => w.value.boxes.map((e) => {
			let t = P.value?.get(e.id);
			return t ? {
				...e,
				x: t.x,
				y: t.y
			} : e;
		}));
		function qe(e, t) {
			let n = new Map(P.value ?? []);
			n.set(e, t), P.value = n;
		}
		function Je() {
			P.value = P.value ? null : _e(w.value.boxes, w.value.relations);
		}
		let Ye = (e) => e.blocks.slice(0, 6), I = (e) => Math.max(0, e.blocks.length - 6), Xe = (e) => (Ye(e).length + +(I(e) > 0)) * Ge + 12, Ze = (e, t) => e.y + e.h + 6 + Xe(e) > t, L = f(!1);
		function R(e) {
			return b.value.get(e) ?? v.files[e];
		}
		function z(e, t) {
			let n = new Map(b.value);
			t === v.files[e] ? n.delete(e) : n.set(e, t), b.value = n;
		}
		let B = f(!1);
		function Qe() {
			if (!(!x.value || B.value)) {
				B.value = !0;
				for (let [e, t] of b.value) y("save", e, t, v.files[e]);
			}
		}
		function $e() {
			if (!x.value) return;
			let e = new Set([...b.value.keys()].map((e) => w.value.boxes.find((t) => t.docPath === e)?.id).filter((e) => !!e));
			if (b.value = /* @__PURE__ */ new Map(), P.value) {
				let t = new Map(P.value);
				e.forEach((e) => t.delete(e)), P.value = t.size > 0 ? t : null;
			}
			J.value = null, L.value = !1;
		}
		function et() {
			if (L.value) {
				if (x.value) return;
				J.value = null, L.value = !1;
			} else L.value = !0;
		}
		let tt = f(null);
		function V(e, t) {
			let n = tt.value;
			if (!n) return {
				x: 0,
				y: 0,
				scale: 1
			};
			let r = n.getBoundingClientRect(), i = r.width / O.value.w || 1;
			return {
				x: (e - r.left) / i,
				y: (t - r.top) / i,
				scale: i
			};
		}
		let H = f(null), U = f([]);
		function nt(e, t, n, r) {
			let i = F.value.find((t) => t.id === e);
			if (!i) return {
				x: t,
				y: n,
				guides: []
			};
			let a = Math.min(Math.max(8 / r, 4), 12), o = F.value.filter((t) => t.id !== e), s = t, c = n, l = [], u = null;
			for (let e of o) for (let n of [
				e.x,
				e.x + e.w / 2,
				e.x + e.w
			]) for (let e of [
				t,
				t + i.w / 2,
				t + i.w
			]) {
				let t = n - e;
				Math.abs(t) <= a && (!u || Math.abs(t) < Math.abs(u.delta)) && (u = { delta: t });
			}
			u && (s = t + u.delta);
			let d = null;
			for (let e of o) for (let t of [
				e.y,
				e.y + e.h / 2,
				e.y + e.h
			]) for (let e of [
				n,
				n + i.h / 2,
				n + i.h
			]) {
				let n = t - e;
				Math.abs(n) <= a && (!d || Math.abs(n) < Math.abs(d.delta)) && (d = { delta: n });
			}
			d && (c = n + d.delta);
			let f = /* @__PURE__ */ new Set();
			for (let e of o) {
				for (let t of [
					e.x,
					e.x + e.w / 2,
					e.x + e.w
				]) {
					if (![
						s,
						s + i.w / 2,
						s + i.w
					].some((e) => Math.abs(e - t) < .5)) continue;
					let n = `x${t}`, r = Math.min(c, e.y), a = Math.max(c + i.h, e.y + e.h), o = f.has(n) ? l.find((e) => e.axis === "x" && e.pos === t) : void 0;
					o ? (o.start = Math.min(o.start, r), o.end = Math.max(o.end, a)) : (f.add(n), l.push({
						axis: "x",
						pos: t,
						start: r,
						end: a
					}));
				}
				for (let t of [
					e.y,
					e.y + e.h / 2,
					e.y + e.h
				]) {
					if (![
						c,
						c + i.h / 2,
						c + i.h
					].some((e) => Math.abs(e - t) < .5)) continue;
					let n = `y${t}`, r = Math.min(s, e.x), a = Math.max(s + i.w, e.x + e.w), o = f.has(n) ? l.find((e) => e.axis === "y" && e.pos === t) : void 0;
					o ? (o.start = Math.min(o.start, r), o.end = Math.max(o.end, a)) : (f.add(n), l.push({
						axis: "y",
						pos: t,
						start: r,
						end: a
					}));
				}
			}
			return {
				x: Math.round(s),
				y: Math.round(c),
				guides: l
			};
		}
		let W = !1;
		function rt(e, t) {
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
			}, window.addEventListener("pointermove", it), window.addEventListener("pointerup", G), window.addEventListener("pointercancel", G), M.value = null));
		}
		function it(e) {
			let t = H.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(at));
		}
		function at() {
			let e = H.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			e.moved = !0;
			let r = nt(e.id, e.baseX + t, e.baseY + n, e.scale);
			qe(e.id, {
				x: r.x,
				y: r.y
			}), U.value = r.guides;
		}
		function ot() {
			let e = H.value;
			if (H.value = null, U.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			W = !0;
			let t = P.value?.get(e.id);
			if (!t) return;
			let n = R(e.path);
			n !== void 0 && z(e.path, le(n, t));
		}
		function G() {
			window.removeEventListener("pointermove", it), window.removeEventListener("pointerup", G), window.removeEventListener("pointercancel", G), ot();
		}
		function st(e) {
			if (W) {
				W = !1;
				return;
			}
			L.value || Z(e);
		}
		let K = f(null);
		function ct(e, t) {
			if (!L.value || e.button !== 0) return;
			e.preventDefault();
			let n = V(e.clientX, e.clientY);
			K.value = {
				fromId: t.id,
				x: n.x,
				y: n.y,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", lt), window.addEventListener("pointerup", pt), window.addEventListener("pointercancel", ft), M.value = null;
		}
		function lt(e) {
			let t = K.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(ut));
		}
		function ut() {
			let e = K.value;
			if (!e) return;
			e.raf = 0;
			let t = V(e.lastClientX, e.lastClientY);
			K.value = {
				...e,
				x: t.x,
				y: t.y
			};
		}
		function dt() {
			window.removeEventListener("pointermove", lt), window.removeEventListener("pointerup", pt), window.removeEventListener("pointercancel", ft);
		}
		function ft() {
			dt();
			let e = K.value;
			e?.raf && cancelAnimationFrame(e.raf), K.value = null;
		}
		function pt(e) {
			dt();
			let t = K.value;
			if (t?.raf && cancelAnimationFrame(t.raf), K.value = null, !t) return;
			let n = V(e.clientX, e.clientY), r = F.value.find((e) => n.x >= e.x && n.x <= e.x + e.w && n.y >= e.y && n.y <= e.y + e.h);
			!r || r.id === t.fromId || w.value.relations.some((e) => e.from === t.fromId && e.to === r.id) || mt(t.fromId, r.id);
		}
		function mt(e, t) {
			let n = w.value.boxes.find((t) => t.id === e);
			if (!n) return;
			let r = R(n.docPath);
			r !== void 0 && z(n.docPath, T(r, [...ce(r), t]));
		}
		let q = t(() => {
			let e = K.value;
			if (!e) return null;
			let t = F.value.find((t) => t.id === e.fromId);
			return t ? de(t, {
				x: e.x,
				y: e.y,
				w: 0,
				h: 0
			}).d : null;
		}), J = f(null), Y = t(() => j.value.find((e) => e.id === J.value) ?? null);
		function ht(e) {
			L.value && (J.value = e.id);
		}
		let X = f(null);
		function gt(e, t, n) {
			let r = t - (e.x + e.w / 2), i = n - (e.y + e.h / 2);
			return Math.abs(r) / (e.w / 2) >= Math.abs(i) / (e.h / 2) ? r >= 0 ? "right" : "left" : i >= 0 ? "bottom" : "top";
		}
		function _t(e, t, n) {
			if (e.button !== 0) return;
			e.preventDefault(), e.stopPropagation();
			let r = A(F.value.find((e) => e.id === t.fromId), F.value.find((e) => e.id === t.toId));
			X.value = {
				edgeId: t.id,
				which: n,
				side: (n === "from" ? t.fromSide : t.toSide) ?? (n === "from" ? r.fs : r.ts),
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", vt), window.addEventListener("pointerup", St), window.addEventListener("pointercancel", xt), M.value = null;
		}
		function vt(e) {
			let t = X.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(yt));
		}
		function yt() {
			let e = X.value;
			if (!e) return;
			e.raf = 0;
			let t = j.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = F.value.find((n) => n.id === (e.which === "from" ? t.fromId : t.toId));
			if (!n) return;
			let r = V(e.lastClientX, e.lastClientY), i = gt(n, r.x, r.y);
			i !== e.side && (X.value = {
				...e,
				side: i
			});
		}
		function bt() {
			window.removeEventListener("pointermove", vt), window.removeEventListener("pointerup", St), window.removeEventListener("pointercancel", xt);
		}
		function xt() {
			bt();
			let e = X.value;
			e?.raf && cancelAnimationFrame(e.raf), X.value = null;
		}
		function St() {
			bt();
			let e = X.value;
			if (e?.raf && cancelAnimationFrame(e.raf), X.value = null, !e) return;
			let t = j.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.which === "from" ? e.side : t.fromSide, r = e.which === "to" ? e.side : t.toSide;
			n === t.fromSide && r === t.toSide || Ct(t, n, r);
		}
		function Ct(e, t, n) {
			let r = w.value.boxes.find((t) => t.id === e.fromId);
			if (!r) return;
			let i = R(r.docPath);
			if (i === void 0) return;
			let a = ce(i).map((r) => {
				let i = fe(r);
				return wt(i.ref) === e.toId ? pe({
					ref: i.ref,
					label: i.label,
					fromSide: t,
					toSide: n
				}) : r;
			});
			z(r.docPath, T(i, a));
		}
		function wt(e) {
			let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md", r = w.value.boxes;
			return (r.find((e) => e.id === t) ?? r.find((e) => e.docPath === t) ?? r.find((e) => e.docPath === n))?.id;
		}
		function Tt() {
			let e = Y.value;
			if (!e) return;
			let t = w.value.boxes.find((t) => t.id === e.fromId);
			if (!t) return;
			let n = R(t.docPath);
			if (n === void 0) return;
			let r = ce(n).filter((t) => wt(fe(t).ref) !== e.toId);
			z(t.docPath, T(n, r)), J.value = null;
		}
		function Et(e) {
			D.value || !L.value || !J.value || (e.key === "Delete" || e.key === "Backspace") && (e.preventDefault(), Tt());
		}
		typeof window < "u" && window.addEventListener("keydown", Et);
		let Dt = t(() => D.value ? w.value.boxes.find((e) => e.docPath === D.value)?.title ?? D.value : "");
		function Ot() {
			let e = D.value ? `#${encodeURIComponent(D.value)}` : "#";
			history.replaceState(null, "", e);
		}
		function Z(e) {
			v.files[e] && (Q.value = !1, D.value = e, y("navigate", e), Ot());
		}
		function kt(e) {
			document.querySelector(`.pd-doc-view [data-heading-id$="-${e}"]`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function At(e, t) {
			if (D.value === e) {
				kt(t);
				return;
			}
			Z(e), c(() => {
				setTimeout(() => kt(t), 80), setTimeout(() => kt(t), 320);
			});
		}
		function jt() {
			D.value = null, Ot(), c(() => requestAnimationFrame(() => ue.value?.fit?.()));
		}
		ee(() => v.files, (e) => {
			if (B.value = !1, D.value && !e[D.value] && jt(), b.value.size) {
				let t = new Map(b.value);
				for (let [n, r] of t) (e[n] === r || e[n] === void 0) && t.delete(n);
				b.value = t;
			}
			if (!P.value) return;
			let t = w.value.boxes, n = new Map(P.value);
			for (let [e, r] of n) {
				let i = t.find((t) => t.id === e);
				(!i || i.x === r.x && i.y === r.y) && n.delete(e);
			}
			P.value = n.size > 0 ? n : null;
		});
		let Q = f(!1), $ = f(""), Mt = t(() => D.value !== null && $.value !== (v.files[D.value] ?? ""));
		function Nt() {
			D.value && ($.value = v.files[D.value] ?? "", Q.value = !0);
		}
		function Pt(e) {
			Z(e), Nt();
		}
		function Ft() {
			Q.value = !1;
		}
		function It() {
			!D.value || !Mt.value || y("save", D.value, $.value, v.files[D.value]);
		}
		function Lt(e) {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), It());
		}
		function Rt(e, t) {
			L.value || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), Z(t));
		}
		function zt(e, t) {
			if (/^(https?:|mailto:|#)/.test(t)) return null;
			let n = t.split("#")[0].trim();
			if (!n.endsWith(".md")) return null;
			let r = n.startsWith("/") ? n.split("/") : [...e.split("/").slice(0, -1), ...n.split("/")], i = [];
			for (let e of r) e === "" || e === "." || (e === ".." ? i.pop() : i.push(e));
			return i.join("/");
		}
		function Bt(e) {
			if (!D.value) return;
			let t = zt(D.value, e);
			t && Z(t);
		}
		function Vt(e) {
			if (!D.value) return;
			let t = v.files[D.value];
			if (t === void 0) return;
			let n = se(t, e.source, e.id, e.x, e.y);
			n !== t && y("save", D.value, n, t);
		}
		if (typeof window < "u" && window.location.hash.length > 1) {
			let e = decodeURIComponent(window.location.hash.slice(1));
			v.files[e] && (D.value = e);
		}
		return (t, s) => (d(), i("div", ye, [a("header", be, [
			s[6] ||= a("span", { class: "pd-graph-brand" }, "📚 ProDoc", -1),
			D.value ? (d(), i("span", xe, m(Dt.value), 1)) : r("", !0),
			a("div", Se, [
				D.value ? r("", !0) : (d(), i(e, { key: 0 }, [L.value ? (d(), i(e, { key: 1 }, [a("button", {
					class: "pd-back-btn",
					disabled: !x.value || B.value,
					onClick: Qe
				}, "💾 保存", 8, Ce), x.value ? (d(), i("button", {
					key: 0,
					class: "pd-back-btn",
					disabled: B.value,
					onClick: $e
				}, "↩ 放弃更改", 8, we)) : (d(), i("button", {
					key: 1,
					class: "pd-back-btn pd-back-btn--active",
					onClick: et
				}, "✓ 完成"))], 64)) : (d(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: et
				}, "🛠 编辑图")), a("button", {
					class: "pd-back-btn",
					onClick: Je
				}, m(P.value ? "↩ 恢复坐标" : "🧭 分层重排"), 1)], 64)),
				D.value ? (d(), i(e, { key: 1 }, [Q.value ? (d(), i(e, { key: 1 }, [a("button", {
					class: "pd-back-btn",
					disabled: !Mt.value,
					onClick: It
				}, "💾 保存", 8, Te), a("button", {
					class: "pd-back-btn",
					onClick: Ft
				}, "👁 预览")], 64)) : (d(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: Nt
				}, "✏️ 编辑")), a("button", {
					class: "pd-back-btn",
					onClick: jt
				}, "🗺 返回图")], 64)) : r("", !0),
				o(h(re), { size: "small" })
			])
		]), a("div", Ee, [D.value ? (d(), i("div", {
			key: 1,
			class: l(["pd-doc-view", { "pd-doc-view--editing": Q.value }])
		}, [Q.value ? (d(), n(h(ae), {
			key: D.value,
			value: $.value,
			class: "pd-doc-editor",
			onChange: s[5] ||= (e) => $.value = e,
			onKeydown: Lt
		}, null, 8, ["value"])) : (d(), n(h(oe), {
			key: D.value,
			content: E.value[D.value],
			"show-toc": !0,
			"flow-editable": !0,
			onDocLink: Bt,
			onFlowNodeMove: Vt
		}, null, 8, ["content"]))], 2)) : (d(), n(h(ne), {
			key: 0,
			ref_key: "canvasRef",
			ref: ue,
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
				ref: tt,
				class: l(["pd-graph-stage", {
					"pd-graph-stage--dragging": H.value?.moved || K.value || X.value,
					"pd-graph-stage--editing": L.value
				}]),
				style: u({
					width: `${O.value.w}px`,
					height: `${O.value.h}px`
				}),
				onClick: s[4] ||= (e) => J.value = null
			}, [
				j.value.length || q.value ? (d(), i("svg", {
					key: 0,
					class: "pd-relation-layer",
					width: O.value.w,
					height: O.value.h,
					"aria-label": "文档连线"
				}, [
					s[9] ||= a("defs", null, [a("marker", {
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
					(d(!0), i(e, null, p(j.value, (e) => (d(), i("g", {
						key: e.id,
						class: l(["pd-relation", {
							"pd-dim": Ke(e),
							"pd-hot": N(e),
							"pd-selected": e.id === J.value
						}])
					}, [
						a("title", null, m(e.fromTitle) + " → " + m(e.toTitle) + m(e.label ? `（${e.label}）` : ""), 1),
						a("path", {
							class: "pd-relation-hit",
							d: e.d,
							fill: "none",
							onClick: _((t) => ht(e), ["stop"])
						}, null, 8, Oe),
						a("path", {
							d: e.d,
							fill: "none",
							"marker-end": "url(#pd-relation-arrow)",
							"pointer-events": "none"
						}, null, 8, ke),
						e.label ? (d(), i("text", {
							key: 0,
							x: e.labelX,
							y: e.labelY,
							"pointer-events": "none"
						}, m(e.label), 9, Ae)) : r("", !0)
					], 2))), 128)),
					q.value ? (d(), i("path", {
						key: 0,
						class: "pd-relation-draft",
						d: q.value,
						fill: "none"
					}, null, 8, je)) : r("", !0),
					(d(!0), i(e, null, p(U.value, (e, t) => (d(), i("line", {
						key: "guide" + t,
						class: "pd-guide",
						x1: e.axis === "x" ? e.pos : e.start,
						y1: e.axis === "x" ? e.start : e.pos,
						x2: e.axis === "x" ? e.pos : e.end,
						y2: e.axis === "x" ? e.end : e.pos
					}, null, 8, Me))), 128)),
					L.value && Y.value ? (d(), i("g", Ne, [a("circle", {
						class: "pd-edge-handle",
						cx: Y.value.x1,
						cy: Y.value.y1,
						r: "6",
						onPointerdown: s[0] ||= _((e) => _t(e, Y.value, "from"), ["stop"])
					}, [...s[7] ||= [a("title", null, "拖动调整源框连接边", -1)]], 40, Pe), a("circle", {
						class: "pd-edge-handle",
						cx: Y.value.x2,
						cy: Y.value.y2,
						r: "6",
						onPointerdown: s[1] ||= _((e) => _t(e, Y.value, "to"), ["stop"])
					}, [...s[8] ||= [a("title", null, "拖动调整目标框连接边", -1)]], 40, Fe)])) : r("", !0)
				], 8, De)) : r("", !0),
				L.value && Y.value ? (d(), i("button", {
					key: 1,
					type: "button",
					class: "pd-edge-delete",
					style: u({
						left: `${Y.value.labelX}px`,
						top: `${Y.value.labelY}px`
					}),
					"aria-label": `删除连线 ${Y.value.fromTitle} → ${Y.value.toTitle}`,
					title: "删除连线（Delete）",
					onClick: _(Tt, ["stop"])
				}, "✕", 12, Ie)) : r("", !0),
				(d(!0), i(e, null, p(F.value, (t) => (d(), i("div", {
					key: t.id,
					class: l(["pd-doc-box", [`pd-doc-box--d${Math.min(t.depth, 3)}`, { "pd-dim": ge(t.id) }]]),
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
					onPointerdown: (e) => rt(e, t),
					onClick: (e) => st(t.docPath),
					onKeydown: (e) => Rt(e, t.docPath),
					onMouseenter: (e) => me(t.id),
					onMouseleave: s[3] ||= (e) => me(null)
				}, [
					a("div", Re, [a("span", ze, m(t.title), 1), s[10] ||= a("span", {
						class: "pd-doc-box__icon",
						"aria-hidden": "true"
					}, "↗", -1)]),
					L.value ? r("", !0) : (d(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-box__edit",
						"aria-label": `编辑 ${t.title}`,
						title: "编辑文档",
						onClick: _((e) => Pt(t.docPath), ["stop"]),
						onKeydown: [g(_((e) => Pt(t.docPath), ["stop"]), ["enter"]), g(_((e) => Pt(t.docPath), ["stop"]), ["space"])]
					}, "✏️", 40, Be)),
					L.value ? (d(), i("button", {
						key: 1,
						type: "button",
						class: "pd-doc-box__link-handle",
						"aria-label": `从 ${t.title} 创建连线（拖到目标框）`,
						title: "拖到其他框创建连线",
						onPointerdown: _((e) => ct(e, t), ["stop"]),
						onClick: s[2] ||= _(() => {}, ["stop"])
					}, null, 40, Ve)) : r("", !0),
					t.blocks.length && !L.value ? (d(), i("div", {
						key: 2,
						class: l(["pd-doc-blocks-pop", { "pd-doc-blocks-pop--above": Ze(t, O.value.h) }])
					}, [a("div", He, [(d(!0), i(e, null, p(Ye(t), (e) => (d(), i("button", {
						key: e.anchor,
						type: "button",
						class: "pd-doc-blocks-pop__item",
						title: e.title,
						"aria-label": `跳转到「${e.title}」分块`,
						onClick: _((n) => At(t.docPath, e.anchor), ["stop"]),
						onKeydown: [g(_((n) => At(t.docPath, e.anchor), ["stop"]), ["enter"]), g(_((n) => At(t.docPath, e.anchor), ["stop"]), ["space"])]
					}, "▸ " + m(e.title), 41, Ue))), 128)), I(t) > 0 ? (d(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more",
						"aria-label": `查看全部 ${t.blocks.length} 个分块`,
						onClick: _((e) => Z(t.docPath), ["stop"])
					}, "+" + m(I(t)) + " 更多分块…", 9, We)) : r("", !0)])], 2)) : r("", !0)
				], 46, Le))), 128))
			], 6)]),
			_: 1
		}, 512))])]));
	}
});
//#endregion
export { ie as DocFlowCanvas, Ke as DocGraphViewer, v as DocViewer, y as MarkdownRenderer };

//# sourceMappingURL=index.js.map