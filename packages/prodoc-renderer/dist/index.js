import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createVNode as o, defineComponent as s, nextTick as c, normalizeClass as l, normalizeStyle as u, openBlock as d, ref as f, renderList as p, toDisplayString as m, unref as h, watch as ee, withCtx as te, withKeys as g, withModifiers as _ } from "vue";
import { NeumorphismCanvas as ne, NeumorphismThemeToggle as re } from "@echolab-auto/ui-frame";
import { DocFlowCanvas as ie, DocViewer as v, MarkdownEditor as ae, MarkdownRenderer as y, MarkdownRenderer as oe } from "@echolab-auto/ui-frame/doc";
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
function w(e) {
	return C(S(e).params.link);
}
function T(e) {
	return e === "" || e !== e.trim() || /[|,"]/.test(e) ? e.includes("\"") ? `'${e}'` : `"${e}"` : e;
}
function E(e, t) {
	let n = e.includes("\r\n") ? "\r\n" : "\n", r = S(e), i = t.length > 0 ? `link: [${t.map(T).join(", ")}]` : null;
	if (!r.hasFrame) return i === null ? e : `---${n}${i}${n}---${n}${e}`;
	let a = e.split(/\r?\n/), o = a.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (o === -1) return e;
	let s = a.slice(1, o).findIndex((e) => /^link\s*:/.test(e));
	return i === null ? s >= 0 && a.splice(s + 1, 1) : s >= 0 ? a[s + 1] = i : a.splice(o, 0, i), a.join(n);
}
function se(e, t) {
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
var D = 72, O = 48, k = /* @__PURE__ */ new Set([
	"id",
	"title",
	"x",
	"y",
	"w",
	"h",
	"link"
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
}, ce = /^([trbl_])>([trbl_])$/;
function N(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(ce);
		t ? (t[1] !== "_" && (n.fromSide = j[t[1]]), t[2] !== "_" && (n.toSide = j[t[2]])) : e !== "" && (n.label = e);
	}
	return n;
}
function le(e) {
	let t = e.ref;
	if (e.label && (t += ` | ${e.label}`), e.fromSide || e.toSide) {
		let n = e.fromSide ? M[e.fromSide] : "_", r = e.toSide ? M[e.toSide] : "_";
		t += ` | ${n}>${r}`;
	}
	return t;
}
function ue(e) {
	let t = e.match(/^#[ \t]+(.+)$/m);
	return t ? t[1].trim() : void 0;
}
function de(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
}
function P(e) {
	return e.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_~]/g, "").replace(/<[^>]+>/g, "").trim();
}
function fe(e) {
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
			let e = P(i[1]);
			e && t.push({
				anchor: de(e),
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
function pe(e, t) {
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
function me(e) {
	let t = Object.keys(e).sort(), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let a of t) {
		let { params: t, body: o } = S(e[a]), s = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : a.replace(/\.md$/, ""), c = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || ue(o) || s, l = fe(o), u = A(t.w) ?? 220, d = A(t.h) ?? 96, f = {};
		for (let [e, n] of Object.entries(t)) k.has(e) || (f[e] = n);
		let p = {
			id: s,
			title: c,
			docPath: a,
			depth: 0,
			blocks: l,
			x: A(t.x) ?? 0,
			y: A(t.y) ?? 0,
			w: u,
			h: d,
			attrs: f
		};
		i.set(s, {
			rawX: A(t.x),
			rawY: A(t.y)
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
			let { ref: n, label: r, fromSide: i, toSide: a } = N(e);
			n && u(t.id, n, {
				label: r,
				fromSide: i,
				toSide: a
			}, t.id + ".link");
		}
	}
	let d = F(a, s);
	for (let e of a) e.depth = d.get(e.id) ?? 0;
	return I(a, s, d, i), {
		boxes: a,
		relations: s,
		warnings: n
	};
}
//#endregion
//#region src/components/DocGraphViewer.vue?vue&type=script&setup=true&lang.ts
var he = { class: "pd-graph-viewer" }, ge = { class: "pd-graph-header" }, _e = {
	key: 0,
	class: "pd-graph-current"
}, ve = { class: "pd-graph-actions" }, ye = ["disabled"], be = { class: "pd-graph-main" }, xe = ["width", "height"], Se = ["d", "onClick"], Ce = ["d"], we = ["x", "y"], Te = ["d"], Ee = [
	"x1",
	"y1",
	"x2",
	"y2"
], De = {
	key: 1,
	class: "pd-edge-handles"
}, Oe = ["cx", "cy"], ke = ["cx", "cy"], Ae = ["aria-label"], je = [
	"aria-label",
	"onPointerdown",
	"onClick",
	"onKeydown",
	"onMouseenter"
], Me = { class: "pd-doc-box__head" }, Ne = { class: "pd-doc-box__title" }, Pe = [
	"aria-label",
	"onClick",
	"onKeydown"
], Fe = ["aria-label", "onPointerdown"], Ie = {
	class: "pd-doc-blocks-pop__card",
	role: "menu"
}, Le = [
	"title",
	"aria-label",
	"onClick",
	"onKeydown"
], Re = ["aria-label", "onClick"], ze = 30, Be = /* @__PURE__ */ s({
	__name: "DocGraphViewer",
	props: { files: {} },
	emits: ["navigate", "save"],
	setup(s, { emit: ie }) {
		let v = s, y = ie, b = t(() => me(v.files)), x = t(() => Object.fromEntries(Object.entries(v.files).map(([e, t]) => [e, S(t).body])));
		ee(() => b.value.warnings, (e) => e.forEach((e) => console.warn("[ProDoc]", e)), { immediate: !0 });
		let C = f(null), T = f(null), D = t(() => {
			let e = 0, t = 0;
			for (let n of I.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			return {
				w: Math.max(e, 640),
				h: Math.max(t, 480)
			};
		});
		function O(e, t) {
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
		function k(e, t) {
			let n = e.x + e.w / 2, r = e.y + e.h / 2, i = t.x + t.w / 2 - n, a = t.y + t.h / 2 - r;
			return Math.abs(a) >= Math.abs(i) ? {
				fs: a >= 0 ? "bottom" : "top",
				ts: a >= 0 ? "top" : "bottom"
			} : {
				fs: i >= 0 ? "right" : "left",
				ts: i >= 0 ? "left" : "right"
			};
		}
		function A(e, t, n, r) {
			let i = k(e, t), a = O(e, n ?? i.fs), o = O(t, r ?? i.ts), s = Math.hypot(o.x - a.x, o.y - a.y), c = Math.max(24, Math.min(s * .45, 96)), l = `M ${a.x} ${a.y} C ${a.x + a.nx * c} ${a.y + a.ny * c}, ${o.x + o.nx * c} ${o.y + o.ny * c}, ${o.x} ${o.y}`;
			return {
				x1: a.x,
				y1: a.y,
				x2: o.x,
				y2: o.y,
				d: l
			};
		}
		let j = t(() => {
			let e = new Map(I.value.map((e) => [e.id, e])), t = J.value;
			return b.value.relations.flatMap((n) => {
				let r = e.get(n.from), i = e.get(n.to);
				if (!r || !i) return [];
				let a = n.fromSide, o = n.toSide;
				t && t.edgeId === n.id && (t.which === "from" ? a = t.side : o = t.side);
				let { x1: s, y1: c, x2: l, y2: u, d } = A(r, i, a, o);
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
		function ce(e) {
			B.value || W.value || J.value || (M.value = e);
		}
		let ue = t(() => {
			if (!M.value) return /* @__PURE__ */ new Set();
			let e = /* @__PURE__ */ new Set([M.value]);
			for (let t of b.value.relations) t.from === M.value && e.add(t.to), t.to === M.value && e.add(t.from);
			return e;
		}), de = (e) => M.value !== null && !ue.value.has(e), P = (e) => M.value !== null && (e.fromId === M.value || e.toId === M.value), fe = (e) => M.value !== null && !P(e), F = f(null), I = t(() => b.value.boxes.map((e) => {
			let t = F.value?.get(e.id);
			return t ? {
				...e,
				x: t.x,
				y: t.y
			} : e;
		}));
		function Be(e, t) {
			let n = new Map(F.value ?? []);
			n.set(e, t), F.value = n;
		}
		function Ve() {
			F.value = F.value ? null : pe(b.value.boxes, b.value.relations);
		}
		let He = (e) => e.blocks.slice(0, 6), L = (e) => Math.max(0, e.blocks.length - 6), Ue = (e) => (He(e).length + +(L(e) > 0)) * ze + 12, We = (e, t) => e.y + e.h + 6 + Ue(e) > t, R = f(!1);
		function Ge() {
			R.value = !R.value, R.value || (K.value = null);
		}
		let Ke = f(null);
		function z(e, t) {
			let n = Ke.value;
			if (!n) return {
				x: 0,
				y: 0,
				scale: 1
			};
			let r = n.getBoundingClientRect(), i = r.width / D.value.w || 1;
			return {
				x: (e - r.left) / i,
				y: (t - r.top) / i,
				scale: i
			};
		}
		let B = f(null), V = f([]);
		function qe(e, t, n, r) {
			let i = I.value.find((t) => t.id === e);
			if (!i) return {
				x: t,
				y: n,
				guides: []
			};
			let a = Math.min(Math.max(8 / r, 4), 12), o = I.value.filter((t) => t.id !== e), s = t, c = n, l = [], u = null;
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
		let H = !1;
		function Je(e, t) {
			R.value && e.button === 0 && (e.target.closest("button") || (B.value = {
				id: t.id,
				path: t.docPath,
				startClientX: e.clientX,
				startClientY: e.clientY,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				scale: z(e.clientX, e.clientY).scale,
				baseX: t.x,
				baseY: t.y,
				moved: !1,
				raf: 0
			}, window.addEventListener("pointermove", Ye), window.addEventListener("pointerup", U), window.addEventListener("pointercancel", U), M.value = null));
		}
		function Ye(e) {
			let t = B.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Xe));
		}
		function Xe() {
			let e = B.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			e.moved = !0;
			let r = qe(e.id, e.baseX + t, e.baseY + n, e.scale);
			Be(e.id, {
				x: r.x,
				y: r.y
			}), V.value = r.guides;
		}
		function Ze() {
			let e = B.value;
			if (B.value = null, V.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			H = !0;
			let t = F.value?.get(e.id);
			if (!t) return;
			let n = v.files[e.path];
			n !== void 0 && y("save", e.path, se(n, t), n);
		}
		function U() {
			window.removeEventListener("pointermove", Ye), window.removeEventListener("pointerup", U), window.removeEventListener("pointercancel", U), Ze();
		}
		function Qe(e) {
			if (H) {
				H = !1;
				return;
			}
			R.value || Y(e);
		}
		let W = f(null);
		function $e(e, t) {
			if (!R.value || e.button !== 0) return;
			e.preventDefault();
			let n = z(e.clientX, e.clientY);
			W.value = {
				fromId: t.id,
				x: n.x,
				y: n.y,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", et), window.addEventListener("pointerup", it), window.addEventListener("pointercancel", rt), M.value = null;
		}
		function et(e) {
			let t = W.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(tt));
		}
		function tt() {
			let e = W.value;
			if (!e) return;
			e.raf = 0;
			let t = z(e.lastClientX, e.lastClientY);
			W.value = {
				...e,
				x: t.x,
				y: t.y
			};
		}
		function nt() {
			window.removeEventListener("pointermove", et), window.removeEventListener("pointerup", it), window.removeEventListener("pointercancel", rt);
		}
		function rt() {
			nt();
			let e = W.value;
			e?.raf && cancelAnimationFrame(e.raf), W.value = null;
		}
		function it(e) {
			nt();
			let t = W.value;
			if (t?.raf && cancelAnimationFrame(t.raf), W.value = null, !t) return;
			let n = z(e.clientX, e.clientY), r = I.value.find((e) => n.x >= e.x && n.x <= e.x + e.w && n.y >= e.y && n.y <= e.y + e.h);
			!r || r.id === t.fromId || b.value.relations.some((e) => e.from === t.fromId && e.to === r.id) || at(t.fromId, r.id);
		}
		function at(e, t) {
			let n = b.value.boxes.find((t) => t.id === e);
			if (!n) return;
			let r = v.files[n.docPath];
			r !== void 0 && y("save", n.docPath, E(r, [...w(r), t]), r);
		}
		let G = t(() => {
			let e = W.value;
			if (!e) return null;
			let t = I.value.find((t) => t.id === e.fromId);
			return t ? A(t, {
				x: e.x,
				y: e.y,
				w: 0,
				h: 0
			}).d : null;
		}), K = f(null), q = t(() => j.value.find((e) => e.id === K.value) ?? null);
		function ot(e) {
			R.value && (K.value = e.id);
		}
		let J = f(null);
		function st(e, t, n) {
			let r = t - (e.x + e.w / 2), i = n - (e.y + e.h / 2);
			return Math.abs(r) / (e.w / 2) >= Math.abs(i) / (e.h / 2) ? r >= 0 ? "right" : "left" : i >= 0 ? "bottom" : "top";
		}
		function ct(e, t, n) {
			if (e.button !== 0) return;
			e.preventDefault(), e.stopPropagation();
			let r = k(I.value.find((e) => e.id === t.fromId), I.value.find((e) => e.id === t.toId));
			J.value = {
				edgeId: t.id,
				which: n,
				side: (n === "from" ? t.fromSide : t.toSide) ?? (n === "from" ? r.fs : r.ts),
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", lt), window.addEventListener("pointerup", pt), window.addEventListener("pointercancel", ft), M.value = null;
		}
		function lt(e) {
			let t = J.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(ut));
		}
		function ut() {
			let e = J.value;
			if (!e) return;
			e.raf = 0;
			let t = j.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = I.value.find((n) => n.id === (e.which === "from" ? t.fromId : t.toId));
			if (!n) return;
			let r = z(e.lastClientX, e.lastClientY), i = st(n, r.x, r.y);
			i !== e.side && (J.value = {
				...e,
				side: i
			});
		}
		function dt() {
			window.removeEventListener("pointermove", lt), window.removeEventListener("pointerup", pt), window.removeEventListener("pointercancel", ft);
		}
		function ft() {
			dt();
			let e = J.value;
			e?.raf && cancelAnimationFrame(e.raf), J.value = null;
		}
		function pt() {
			dt();
			let e = J.value;
			if (e?.raf && cancelAnimationFrame(e.raf), J.value = null, !e) return;
			let t = j.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.which === "from" ? e.side : t.fromSide, r = e.which === "to" ? e.side : t.toSide;
			n === t.fromSide && r === t.toSide || mt(t, n, r);
		}
		function mt(e, t, n) {
			let r = b.value.boxes.find((t) => t.id === e.fromId);
			if (!r) return;
			let i = v.files[r.docPath];
			if (i === void 0) return;
			let a = w(i).map((r) => {
				let i = N(r);
				return ht(i.ref) === e.toId ? le({
					ref: i.ref,
					label: i.label,
					fromSide: t,
					toSide: n
				}) : r;
			});
			y("save", r.docPath, E(i, a), i);
		}
		function ht(e) {
			let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md", r = b.value.boxes;
			return (r.find((e) => e.id === t) ?? r.find((e) => e.docPath === t) ?? r.find((e) => e.docPath === n))?.id;
		}
		function gt() {
			let e = q.value;
			if (!e) return;
			let t = b.value.boxes.find((t) => t.id === e.fromId);
			if (!t) return;
			let n = v.files[t.docPath];
			if (n === void 0) return;
			let r = w(n).filter((t) => ht(N(t).ref) !== e.toId);
			y("save", t.docPath, E(n, r), n), K.value = null;
		}
		function _t(e) {
			C.value || !R.value || !K.value || (e.key === "Delete" || e.key === "Backspace") && (e.preventDefault(), gt());
		}
		typeof window < "u" && window.addEventListener("keydown", _t);
		let vt = t(() => C.value ? b.value.boxes.find((e) => e.docPath === C.value)?.title ?? C.value : "");
		function yt() {
			let e = C.value ? `#${encodeURIComponent(C.value)}` : "#";
			history.replaceState(null, "", e);
		}
		function Y(e) {
			v.files[e] && (Q.value = !1, C.value = e, y("navigate", e), yt());
		}
		function X(e) {
			document.querySelector(`.pd-doc-view [data-heading-id$="-${e}"]`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function Z(e, t) {
			if (C.value === e) {
				X(t);
				return;
			}
			Y(e), c(() => {
				setTimeout(() => X(t), 80), setTimeout(() => X(t), 320);
			});
		}
		function bt() {
			C.value = null, yt(), c(() => requestAnimationFrame(() => T.value?.fit?.()));
		}
		ee(() => v.files, (e) => {
			if (C.value && !e[C.value] && bt(), !F.value) return;
			let t = b.value.boxes, n = new Map(F.value);
			for (let [e, r] of n) {
				let i = t.find((t) => t.id === e);
				(!i || i.x === r.x && i.y === r.y) && n.delete(e);
			}
			F.value = n.size > 0 ? n : null;
		});
		let Q = f(!1), $ = f(""), xt = t(() => C.value !== null && $.value !== (v.files[C.value] ?? ""));
		function St() {
			C.value && ($.value = v.files[C.value] ?? "", Q.value = !0);
		}
		function Ct(e) {
			Y(e), St();
		}
		function wt() {
			Q.value = !1;
		}
		function Tt() {
			!C.value || !xt.value || y("save", C.value, $.value, v.files[C.value]);
		}
		function Et(e) {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), Tt());
		}
		function Dt(e, t) {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), Y(t));
		}
		function Ot(e, t) {
			if (/^(https?:|mailto:|#)/.test(t)) return null;
			let n = t.split("#")[0].trim();
			if (!n.endsWith(".md")) return null;
			let r = n.startsWith("/") ? n.split("/") : [...e.split("/").slice(0, -1), ...n.split("/")], i = [];
			for (let e of r) e === "" || e === "." || (e === ".." ? i.pop() : i.push(e));
			return i.join("/");
		}
		function kt(e) {
			if (!C.value) return;
			let t = Ot(C.value, e);
			t && Y(t);
		}
		if (typeof window < "u" && window.location.hash.length > 1) {
			let e = decodeURIComponent(window.location.hash.slice(1));
			v.files[e] && (C.value = e);
		}
		return (t, s) => (d(), i("div", he, [a("header", ge, [
			s[6] ||= a("span", { class: "pd-graph-brand" }, "📚 ProDoc", -1),
			C.value ? (d(), i("span", _e, m(vt.value), 1)) : r("", !0),
			a("div", ve, [
				C.value ? r("", !0) : (d(), i(e, { key: 0 }, [a("button", {
					class: l(["pd-back-btn", { "pd-back-btn--active": R.value }]),
					onClick: Ge
				}, m(R.value ? "✓ 完成" : "🛠 编辑图"), 3), a("button", {
					class: "pd-back-btn",
					onClick: Ve
				}, m(F.value ? "↩ 恢复坐标" : "🧭 分层重排"), 1)], 64)),
				C.value ? (d(), i(e, { key: 1 }, [Q.value ? (d(), i(e, { key: 1 }, [a("button", {
					class: "pd-back-btn",
					disabled: !xt.value,
					onClick: Tt
				}, "💾 保存", 8, ye), a("button", {
					class: "pd-back-btn",
					onClick: wt
				}, "👁 预览")], 64)) : (d(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: St
				}, "✏️ 编辑")), a("button", {
					class: "pd-back-btn",
					onClick: bt
				}, "🗺 返回图")], 64)) : r("", !0),
				o(h(re), { size: "small" })
			])
		]), a("div", be, [C.value ? (d(), i("div", {
			key: 1,
			class: l(["pd-doc-view", { "pd-doc-view--editing": Q.value }])
		}, [Q.value ? (d(), n(h(ae), {
			key: C.value,
			value: $.value,
			class: "pd-doc-editor",
			onChange: s[5] ||= (e) => $.value = e,
			onKeydown: Et
		}, null, 8, ["value"])) : (d(), n(h(oe), {
			key: C.value,
			content: x.value[C.value],
			"show-toc": !0,
			onDocLink: kt
		}, null, 8, ["content"]))], 2)) : (d(), n(h(ne), {
			key: 0,
			ref_key: "canvasRef",
			ref: T,
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
				ref: Ke,
				class: l(["pd-graph-stage", {
					"pd-graph-stage--dragging": B.value?.moved || W.value || J.value,
					"pd-graph-stage--editing": R.value
				}]),
				style: u({
					width: `${D.value.w}px`,
					height: `${D.value.h}px`
				}),
				onClick: s[4] ||= (e) => K.value = null
			}, [
				j.value.length || G.value ? (d(), i("svg", {
					key: 0,
					class: "pd-relation-layer",
					width: D.value.w,
					height: D.value.h,
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
							"pd-dim": fe(e),
							"pd-hot": P(e),
							"pd-selected": e.id === K.value
						}])
					}, [
						a("title", null, m(e.fromTitle) + " → " + m(e.toTitle) + m(e.label ? `（${e.label}）` : ""), 1),
						a("path", {
							class: "pd-relation-hit",
							d: e.d,
							fill: "none",
							onClick: _((t) => ot(e), ["stop"])
						}, null, 8, Se),
						a("path", {
							d: e.d,
							fill: "none",
							"marker-end": "url(#pd-relation-arrow)",
							"pointer-events": "none"
						}, null, 8, Ce),
						e.label ? (d(), i("text", {
							key: 0,
							x: e.labelX,
							y: e.labelY,
							"pointer-events": "none"
						}, m(e.label), 9, we)) : r("", !0)
					], 2))), 128)),
					G.value ? (d(), i("path", {
						key: 0,
						class: "pd-relation-draft",
						d: G.value,
						fill: "none"
					}, null, 8, Te)) : r("", !0),
					(d(!0), i(e, null, p(V.value, (e, t) => (d(), i("line", {
						key: "guide" + t,
						class: "pd-guide",
						x1: e.axis === "x" ? e.pos : e.start,
						y1: e.axis === "x" ? e.start : e.pos,
						x2: e.axis === "x" ? e.pos : e.end,
						y2: e.axis === "x" ? e.end : e.pos
					}, null, 8, Ee))), 128)),
					R.value && q.value ? (d(), i("g", De, [a("circle", {
						class: "pd-edge-handle",
						cx: q.value.x1,
						cy: q.value.y1,
						r: "6",
						onPointerdown: s[0] ||= _((e) => ct(e, q.value, "from"), ["stop"])
					}, [...s[7] ||= [a("title", null, "拖动调整源框连接边", -1)]], 40, Oe), a("circle", {
						class: "pd-edge-handle",
						cx: q.value.x2,
						cy: q.value.y2,
						r: "6",
						onPointerdown: s[1] ||= _((e) => ct(e, q.value, "to"), ["stop"])
					}, [...s[8] ||= [a("title", null, "拖动调整目标框连接边", -1)]], 40, ke)])) : r("", !0)
				], 8, xe)) : r("", !0),
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
					onClick: _(gt, ["stop"])
				}, "✕", 12, Ae)) : r("", !0),
				(d(!0), i(e, null, p(I.value, (t) => (d(), i("div", {
					key: t.id,
					class: l(["pd-doc-box", [`pd-doc-box--d${Math.min(t.depth, 3)}`, { "pd-dim": de(t.id) }]]),
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
					onPointerdown: (e) => Je(e, t),
					onClick: (e) => Qe(t.docPath),
					onKeydown: (e) => Dt(e, t.docPath),
					onMouseenter: (e) => ce(t.id),
					onMouseleave: s[3] ||= (e) => ce(null)
				}, [
					a("div", Me, [a("span", Ne, m(t.title), 1), s[10] ||= a("span", {
						class: "pd-doc-box__icon",
						"aria-hidden": "true"
					}, "↗", -1)]),
					a("button", {
						type: "button",
						class: "pd-doc-box__edit",
						"aria-label": `编辑 ${t.title}`,
						title: "编辑文档",
						onClick: _((e) => Ct(t.docPath), ["stop"]),
						onKeydown: [g(_((e) => Ct(t.docPath), ["stop"]), ["enter"]), g(_((e) => Ct(t.docPath), ["stop"]), ["space"])]
					}, "✏️", 40, Pe),
					R.value ? (d(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-box__link-handle",
						"aria-label": `从 ${t.title} 创建连线（拖到目标框）`,
						title: "拖到其他框创建连线",
						onPointerdown: _((e) => $e(e, t), ["stop"]),
						onClick: s[2] ||= _(() => {}, ["stop"])
					}, null, 40, Fe)) : r("", !0),
					t.blocks.length ? (d(), i("div", {
						key: 1,
						class: l(["pd-doc-blocks-pop", { "pd-doc-blocks-pop--above": We(t, D.value.h) }])
					}, [a("div", Ie, [(d(!0), i(e, null, p(He(t), (e) => (d(), i("button", {
						key: e.anchor,
						type: "button",
						class: "pd-doc-blocks-pop__item",
						title: e.title,
						"aria-label": `跳转到「${e.title}」分块`,
						onClick: _((n) => Z(t.docPath, e.anchor), ["stop"]),
						onKeydown: [g(_((n) => Z(t.docPath, e.anchor), ["stop"]), ["enter"]), g(_((n) => Z(t.docPath, e.anchor), ["stop"]), ["space"])]
					}, "▸ " + m(e.title), 41, Le))), 128)), L(t) > 0 ? (d(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more",
						"aria-label": `查看全部 ${t.blocks.length} 个分块`,
						onClick: _((e) => Y(t.docPath), ["stop"])
					}, "+" + m(L(t)) + " 更多分块…", 9, Re)) : r("", !0)])], 2)) : r("", !0)
				], 46, je))), 128))
			], 6)]),
			_: 1
		}, 512))])]));
	}
});
//#endregion
export { ie as DocFlowCanvas, Be as DocGraphViewer, v as DocViewer, y as MarkdownRenderer };

//# sourceMappingURL=index.js.map