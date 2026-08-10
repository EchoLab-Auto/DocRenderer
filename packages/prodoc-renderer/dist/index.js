import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createVNode as o, defineComponent as s, nextTick as c, normalizeClass as l, normalizeStyle as u, openBlock as d, ref as f, renderList as p, toDisplayString as m, unref as h, watch as ee, withCtx as te, withKeys as g, withModifiers as _ } from "vue";
import { NeumorphismCanvas as ne, NeumorphismThemeToggle as re } from "@echolab-auto/ui-frame";
import { DocFlowCanvas as ie, DocViewer as v, MarkdownEditor as ae, MarkdownRenderer as y, MarkdownRenderer as oe } from "@echolab-auto/ui-frame/doc";
import "@echolab-auto/ui-frame/dist/style.css";
//#region ../prodoc-core/dist/graph-CepZYFyQ.js
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
}, ce = /^([trbl])>([trbl])$/;
function N(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(ce);
		t ? (n.fromSide = j[t[1]], n.toSide = j[t[2]]) : e !== "" && (n.label = e);
	}
	return n;
}
function le(e) {
	let t = e.ref;
	return e.label && (t += ` | ${e.label}`), e.fromSide && e.toSide && (t += ` | ${M[e.fromSide]}>${M[e.toSide]}`), t;
}
function ue(e) {
	let t = e.match(/^#[ \t]+(.+)$/m);
	return t ? t[1].trim() : void 0;
}
function P(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
}
function de(e) {
	return e.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_~]/g, "").replace(/<[^>]+>/g, "").trim();
}
function F(e) {
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
			let e = de(i[1]);
			e && t.push({
				anchor: P(e),
				title: e
			});
		}
	}
	return t.length >= 2 ? t : [];
}
function I(e, t) {
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
function L(e, t, n, r) {
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
function fe(e, t) {
	let n = e.map((e) => ({
		...e,
		x: 0,
		y: 0
	}));
	return L(n, t, I(n, t), new Map(n.map((e) => [e.id, {}]))), new Map(n.map((e) => [e.id, {
		x: e.x,
		y: e.y
	}]));
}
function pe(e) {
	let t = Object.keys(e).sort(), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let a of t) {
		let { params: t, body: o } = S(e[a]), s = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : a.replace(/\.md$/, ""), c = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || ue(o) || s, l = F(o), u = A(t.w) ?? 220, d = A(t.h) ?? 96, f = {};
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
	let d = I(a, s);
	for (let e of a) e.depth = d.get(e.id) ?? 0;
	return L(a, s, d, i), {
		boxes: a,
		relations: s,
		warnings: n
	};
}
//#endregion
//#region src/components/DocGraphViewer.vue?vue&type=script&setup=true&lang.ts
var me = { class: "pd-graph-viewer" }, he = { class: "pd-graph-header" }, ge = {
	key: 0,
	class: "pd-graph-current"
}, _e = { class: "pd-graph-actions" }, ve = ["disabled"], ye = { class: "pd-graph-main" }, be = ["width", "height"], xe = ["d", "onClick"], Se = ["d"], Ce = ["x", "y"], we = ["d"], Te = { class: "pd-edge-card__row" }, Ee = ["onClick"], De = { class: "pd-edge-card__row" }, Oe = ["onClick"], ke = [
	"aria-label",
	"onPointerdown",
	"onClick",
	"onKeydown",
	"onMouseenter"
], Ae = { class: "pd-doc-box__head" }, je = { class: "pd-doc-box__title" }, Me = [
	"aria-label",
	"onClick",
	"onKeydown"
], Ne = ["aria-label", "onPointerdown"], Pe = {
	class: "pd-doc-blocks-pop__card",
	role: "menu"
}, Fe = [
	"title",
	"aria-label",
	"onClick",
	"onKeydown"
], Ie = ["aria-label", "onClick"], Le = 30, Re = /* @__PURE__ */ s({
	__name: "DocGraphViewer",
	props: { files: {} },
	emits: ["navigate", "save"],
	setup(s, { emit: ie }) {
		let v = s, y = ie, b = t(() => pe(v.files)), x = t(() => Object.fromEntries(Object.entries(v.files).map(([e, t]) => [e, S(t).body])));
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
		function k(e, t, n, r) {
			let i = e.x + e.w / 2, a = e.y + e.h / 2, o = t.x + t.w / 2 - i, s = t.y + t.h / 2 - a, c = Math.abs(s) >= Math.abs(o), l = n ?? (c ? s >= 0 ? "bottom" : "top" : o >= 0 ? "right" : "left"), u = r ?? (c ? s >= 0 ? "top" : "bottom" : o >= 0 ? "left" : "right"), d = O(e, l), f = O(t, u), p = Math.hypot(f.x - d.x, f.y - d.y), m = Math.max(24, Math.min(p * .45, 96)), h = `M ${d.x} ${d.y} C ${d.x + d.nx * m} ${d.y + d.ny * m}, ${f.x + f.nx * m} ${f.y + f.ny * m}, ${f.x} ${f.y}`;
			return {
				x1: d.x,
				y1: d.y,
				x2: f.x,
				y2: f.y,
				d: h
			};
		}
		let A = t(() => {
			let e = new Map(I.value.map((e) => [e.id, e]));
			return b.value.relations.flatMap((t) => {
				let n = e.get(t.from), r = e.get(t.to);
				if (!n || !r) return [];
				let { x1: i, y1: a, x2: o, y2: s, d: c } = k(n, r, t.fromSide, t.toSide);
				return [{
					id: t.id,
					fromId: n.id,
					toId: r.id,
					fromTitle: n.title,
					toTitle: r.title,
					label: t.label,
					fromSide: t.fromSide,
					toSide: t.toSide,
					d: c,
					labelX: (i + o) / 2,
					labelY: (a + s) / 2 - 7
				}];
			});
		}), j = f(null);
		function M(e) {
			V.value || W.value || (j.value = e);
		}
		let ce = t(() => {
			if (!j.value) return /* @__PURE__ */ new Set();
			let e = /* @__PURE__ */ new Set([j.value]);
			for (let t of b.value.relations) t.from === j.value && e.add(t.to), t.to === j.value && e.add(t.from);
			return e;
		}), ue = (e) => j.value !== null && !ce.value.has(e), P = (e) => j.value !== null && (e.fromId === j.value || e.toId === j.value), de = (e) => j.value !== null && !P(e), F = f(null), I = t(() => b.value.boxes.map((e) => {
			let t = F.value?.get(e.id);
			return t ? {
				...e,
				x: t.x,
				y: t.y
			} : e;
		}));
		function L(e, t) {
			let n = new Map(F.value ?? []);
			n.set(e, t), F.value = n;
		}
		function Re() {
			F.value = F.value ? null : fe(b.value.boxes, b.value.relations);
		}
		let ze = (e) => e.blocks.slice(0, 6), R = (e) => Math.max(0, e.blocks.length - 6), Be = (e) => (ze(e).length + +(R(e) > 0)) * Le + 12, Ve = (e, t) => e.y + e.h + 6 + Be(e) > t, z = f(!1);
		function He() {
			z.value = !z.value, z.value || (K.value = null);
		}
		let Ue = f(null);
		function B(e, t) {
			let n = Ue.value;
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
		let V = f(null), H = !1;
		function We(e, t) {
			z.value && e.button === 0 && (e.target.closest("button") || (V.value = {
				id: t.id,
				path: t.docPath,
				startClientX: e.clientX,
				startClientY: e.clientY,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				scale: B(e.clientX, e.clientY).scale,
				baseX: t.x,
				baseY: t.y,
				moved: !1,
				raf: 0
			}, window.addEventListener("pointermove", Ge), window.addEventListener("pointerup", U), window.addEventListener("pointercancel", U), j.value = null));
		}
		function Ge(e) {
			let t = V.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Ke));
		}
		function Ke() {
			let e = V.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			!e.moved && Math.hypot(t, n) < 3 || (e.moved = !0, L(e.id, {
				x: Math.round(e.baseX + t),
				y: Math.round(e.baseY + n)
			}));
		}
		function qe() {
			let e = V.value;
			if (V.value = null, !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			H = !0;
			let t = F.value?.get(e.id);
			if (!t) return;
			let n = v.files[e.path];
			n !== void 0 && y("save", e.path, se(n, t));
		}
		function U() {
			window.removeEventListener("pointermove", Ge), window.removeEventListener("pointerup", U), window.removeEventListener("pointercancel", U), qe();
		}
		function Je(e) {
			if (H) {
				H = !1;
				return;
			}
			z.value || J(e);
		}
		let W = f(null);
		function Ye(e, t) {
			if (!z.value || e.button !== 0) return;
			e.preventDefault();
			let n = B(e.clientX, e.clientY);
			W.value = {
				fromId: t.id,
				x: n.x,
				y: n.y,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", Xe), window.addEventListener("pointerup", et), window.addEventListener("pointercancel", $e), j.value = null;
		}
		function Xe(e) {
			let t = W.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Ze));
		}
		function Ze() {
			let e = W.value;
			if (!e) return;
			e.raf = 0;
			let t = B(e.lastClientX, e.lastClientY);
			W.value = {
				...e,
				x: t.x,
				y: t.y
			};
		}
		function Qe() {
			window.removeEventListener("pointermove", Xe), window.removeEventListener("pointerup", et), window.removeEventListener("pointercancel", $e);
		}
		function $e() {
			Qe();
			let e = W.value;
			e?.raf && cancelAnimationFrame(e.raf), W.value = null;
		}
		function et(e) {
			Qe();
			let t = W.value;
			if (t?.raf && cancelAnimationFrame(t.raf), W.value = null, !t) return;
			let n = B(e.clientX, e.clientY), r = I.value.find((e) => n.x >= e.x && n.x <= e.x + e.w && n.y >= e.y && n.y <= e.y + e.h);
			!r || r.id === t.fromId || b.value.relations.some((e) => e.from === t.fromId && e.to === r.id) || tt(t.fromId, r.id);
		}
		function tt(e, t) {
			let n = b.value.boxes.find((t) => t.id === e);
			if (!n) return;
			let r = v.files[n.docPath];
			r !== void 0 && y("save", n.docPath, E(r, [...w(r), t]));
		}
		let G = t(() => {
			let e = W.value;
			if (!e) return null;
			let t = I.value.find((t) => t.id === e.fromId);
			return t ? k(t, {
				x: e.x,
				y: e.y,
				w: 0,
				h: 0
			}).d : null;
		}), K = f(null), q = t(() => A.value.find((e) => e.id === K.value) ?? null), nt = [
			{
				value: null,
				text: "自动"
			},
			{
				value: "top",
				text: "上"
			},
			{
				value: "right",
				text: "右"
			},
			{
				value: "bottom",
				text: "下"
			},
			{
				value: "left",
				text: "左"
			}
		];
		function rt(e) {
			z.value && (K.value = e.id);
		}
		function it(e) {
			let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md", r = b.value.boxes;
			return (r.find((e) => e.id === t) ?? r.find((e) => e.docPath === t) ?? r.find((e) => e.docPath === n))?.id;
		}
		function at(e, t) {
			let n = q.value;
			if (!n) return;
			let r = e === "from" ? t : n.fromSide ?? null, i = e === "to" ? t : n.toSide ?? null, a = b.value.boxes.find((e) => e.id === n.fromId);
			if (!a) return;
			let o = v.files[a.docPath];
			if (o === void 0) return;
			let s = w(o).map((e) => {
				let t = N(e);
				return it(t.ref) === n.toId ? le({
					ref: t.ref,
					label: t.label,
					fromSide: r ?? void 0,
					toSide: i ?? void 0
				}) : e;
			});
			y("save", a.docPath, E(o, s));
		}
		function ot() {
			let e = q.value;
			if (!e) return;
			let t = b.value.boxes.find((t) => t.id === e.fromId);
			if (!t) return;
			let n = v.files[t.docPath];
			if (n === void 0) return;
			let r = w(n).filter((t) => it(N(t).ref) !== e.toId);
			y("save", t.docPath, E(n, r)), K.value = null;
		}
		function st(e) {
			C.value || !z.value || !K.value || (e.key === "Delete" || e.key === "Backspace") && (e.preventDefault(), ot());
		}
		typeof window < "u" && window.addEventListener("keydown", st);
		let ct = t(() => C.value ? b.value.boxes.find((e) => e.docPath === C.value)?.title ?? C.value : "");
		function lt() {
			let e = C.value ? `#${encodeURIComponent(C.value)}` : "#";
			history.replaceState(null, "", e);
		}
		function J(e) {
			v.files[e] && (Z.value = !1, C.value = e, y("navigate", e), lt());
		}
		function Y(e) {
			document.querySelector(`.pd-doc-view [data-heading-id$="-${e}"]`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function X(e, t) {
			if (C.value === e) {
				Y(t);
				return;
			}
			J(e), c(() => {
				setTimeout(() => Y(t), 80), setTimeout(() => Y(t), 320);
			});
		}
		function ut() {
			C.value = null, lt(), c(() => requestAnimationFrame(() => T.value?.fit?.()));
		}
		ee(() => v.files, (e) => {
			if (C.value && !e[C.value] && ut(), !F.value) return;
			let t = b.value.boxes, n = new Map(F.value);
			for (let [e, r] of n) {
				let i = t.find((t) => t.id === e);
				(!i || i.x === r.x && i.y === r.y) && n.delete(e);
			}
			F.value = n.size > 0 ? n : null;
		});
		let Z = f(!1), Q = f(""), dt = t(() => C.value !== null && Q.value !== (v.files[C.value] ?? ""));
		function ft() {
			C.value && (Q.value = v.files[C.value] ?? "", Z.value = !0);
		}
		function $(e) {
			J(e), ft();
		}
		function pt() {
			Z.value = !1;
		}
		function mt() {
			!C.value || !dt.value || y("save", C.value, Q.value);
		}
		function ht(e) {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), mt());
		}
		function gt(e, t) {
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), J(t));
		}
		function _t(e, t) {
			if (/^(https?:|mailto:|#)/.test(t)) return null;
			let n = t.split("#")[0].trim();
			if (!n.endsWith(".md")) return null;
			let r = n.startsWith("/") ? n.split("/") : [...e.split("/").slice(0, -1), ...n.split("/")], i = [];
			for (let e of r) e === "" || e === "." || (e === ".." ? i.pop() : i.push(e));
			return i.join("/");
		}
		function vt(e) {
			if (!C.value) return;
			let t = _t(C.value, e);
			t && J(t);
		}
		if (typeof window < "u" && window.location.hash.length > 1) {
			let e = decodeURIComponent(window.location.hash.slice(1));
			v.files[e] && (C.value = e);
		}
		return (t, s) => (d(), i("div", me, [a("header", he, [
			s[5] ||= a("span", { class: "pd-graph-brand" }, "📚 ProDoc", -1),
			C.value ? (d(), i("span", ge, m(ct.value), 1)) : r("", !0),
			a("div", _e, [
				C.value ? r("", !0) : (d(), i(e, { key: 0 }, [a("button", {
					class: l(["pd-back-btn", { "pd-back-btn--active": z.value }]),
					onClick: He
				}, m(z.value ? "✓ 完成" : "🛠 编辑图"), 3), a("button", {
					class: "pd-back-btn",
					onClick: Re
				}, m(F.value ? "↩ 恢复坐标" : "🧭 分层重排"), 1)], 64)),
				C.value ? (d(), i(e, { key: 1 }, [Z.value ? (d(), i(e, { key: 1 }, [a("button", {
					class: "pd-back-btn",
					disabled: !dt.value,
					onClick: mt
				}, "💾 保存", 8, ve), a("button", {
					class: "pd-back-btn",
					onClick: pt
				}, "👁 预览")], 64)) : (d(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: ft
				}, "✏️ 编辑")), a("button", {
					class: "pd-back-btn",
					onClick: ut
				}, "🗺 返回图")], 64)) : r("", !0),
				o(h(re), { size: "small" })
			])
		]), a("div", ye, [C.value ? (d(), i("div", {
			key: 1,
			class: l(["pd-doc-view", { "pd-doc-view--editing": Z.value }])
		}, [Z.value ? (d(), n(h(ae), {
			key: C.value,
			value: Q.value,
			class: "pd-doc-editor",
			onChange: s[4] ||= (e) => Q.value = e,
			onKeydown: ht
		}, null, 8, ["value"])) : (d(), n(h(oe), {
			key: C.value,
			content: x.value[C.value],
			"show-toc": !0,
			onDocLink: vt
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
				ref: Ue,
				class: l(["pd-graph-stage", {
					"pd-graph-stage--dragging": V.value?.moved || W.value,
					"pd-graph-stage--editing": z.value
				}]),
				style: u({
					width: `${D.value.w}px`,
					height: `${D.value.h}px`
				}),
				onClick: s[3] ||= (e) => K.value = null
			}, [
				A.value.length || G.value ? (d(), i("svg", {
					key: 0,
					class: "pd-relation-layer",
					width: D.value.w,
					height: D.value.h,
					"aria-label": "文档连线"
				}, [
					s[6] ||= a("defs", null, [a("marker", {
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
					(d(!0), i(e, null, p(A.value, (e) => (d(), i("g", {
						key: e.id,
						class: l(["pd-relation", {
							"pd-dim": de(e),
							"pd-hot": P(e),
							"pd-selected": e.id === K.value
						}])
					}, [
						a("title", null, m(e.fromTitle) + " → " + m(e.toTitle) + m(e.label ? `（${e.label}）` : ""), 1),
						a("path", {
							class: "pd-relation-hit",
							d: e.d,
							fill: "none",
							onClick: _((t) => rt(e), ["stop"])
						}, null, 8, xe),
						a("path", {
							d: e.d,
							fill: "none",
							"marker-end": "url(#pd-relation-arrow)",
							"pointer-events": "none"
						}, null, 8, Se),
						e.label ? (d(), i("text", {
							key: 0,
							x: e.labelX,
							y: e.labelY,
							"pointer-events": "none"
						}, m(e.label), 9, Ce)) : r("", !0)
					], 2))), 128)),
					G.value ? (d(), i("path", {
						key: 0,
						class: "pd-relation-draft",
						d: G.value,
						fill: "none"
					}, null, 8, we)) : r("", !0)
				], 8, be)) : r("", !0),
				q.value ? (d(), i("div", {
					key: 1,
					class: "pd-edge-card",
					style: u({
						left: `${q.value.labelX}px`,
						top: `${q.value.labelY + 14}px`
					}),
					"data-nm-no-pan": "",
					onClick: s[0] ||= _(() => {}, ["stop"])
				}, [
					a("div", Te, [s[7] ||= a("span", { class: "pd-edge-card__label" }, "源边", -1), (d(), i(e, null, p(nt, (e) => a("button", {
						key: "f" + e.value,
						type: "button",
						class: l(["pd-edge-card__side", { "pd-edge-card__side--active": (q.value.fromSide ?? null) === e.value }]),
						onClick: (t) => at("from", e.value)
					}, m(e.text), 11, Ee)), 64))]),
					a("div", De, [s[8] ||= a("span", { class: "pd-edge-card__label" }, "目标边", -1), (d(), i(e, null, p(nt, (e) => a("button", {
						key: "t" + e.value,
						type: "button",
						class: l(["pd-edge-card__side", { "pd-edge-card__side--active": (q.value.toSide ?? null) === e.value }]),
						onClick: (t) => at("to", e.value)
					}, m(e.text), 11, Oe)), 64))]),
					a("button", {
						type: "button",
						class: "pd-edge-card__delete",
						onClick: ot
					}, " ✕ 删除连线 ")
				], 4)) : r("", !0),
				(d(!0), i(e, null, p(I.value, (t) => (d(), i("div", {
					key: t.id,
					class: l(["pd-doc-box", [`pd-doc-box--d${Math.min(t.depth, 3)}`, { "pd-dim": ue(t.id) }]]),
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
					onPointerdown: (e) => We(e, t),
					onClick: (e) => Je(t.docPath),
					onKeydown: (e) => gt(e, t.docPath),
					onMouseenter: (e) => M(t.id),
					onMouseleave: s[2] ||= (e) => M(null)
				}, [
					a("div", Ae, [a("span", je, m(t.title), 1), s[9] ||= a("span", {
						class: "pd-doc-box__icon",
						"aria-hidden": "true"
					}, "↗", -1)]),
					a("button", {
						type: "button",
						class: "pd-doc-box__edit",
						"aria-label": `编辑 ${t.title}`,
						title: "编辑文档",
						onClick: _((e) => $(t.docPath), ["stop"]),
						onKeydown: [g(_((e) => $(t.docPath), ["stop"]), ["enter"]), g(_((e) => $(t.docPath), ["stop"]), ["space"])]
					}, "✏️", 40, Me),
					z.value ? (d(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-box__link-handle",
						"aria-label": `从 ${t.title} 创建连线（拖到目标框）`,
						title: "拖到其他框创建连线",
						onPointerdown: _((e) => Ye(e, t), ["stop"]),
						onClick: s[1] ||= _(() => {}, ["stop"])
					}, null, 40, Ne)) : r("", !0),
					t.blocks.length ? (d(), i("div", {
						key: 1,
						class: l(["pd-doc-blocks-pop", { "pd-doc-blocks-pop--above": Ve(t, D.value.h) }])
					}, [a("div", Pe, [(d(!0), i(e, null, p(ze(t), (e) => (d(), i("button", {
						key: e.anchor,
						type: "button",
						class: "pd-doc-blocks-pop__item",
						title: e.title,
						"aria-label": `跳转到「${e.title}」分块`,
						onClick: _((n) => X(t.docPath, e.anchor), ["stop"]),
						onKeydown: [g(_((n) => X(t.docPath, e.anchor), ["stop"]), ["enter"]), g(_((n) => X(t.docPath, e.anchor), ["stop"]), ["space"])]
					}, "▸ " + m(e.title), 41, Fe))), 128)), R(t) > 0 ? (d(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more",
						"aria-label": `查看全部 ${t.blocks.length} 个分块`,
						onClick: _((e) => J(t.docPath), ["stop"])
					}, "+" + m(R(t)) + " 更多分块…", 9, Ie)) : r("", !0)])], 2)) : r("", !0)
				], 46, ke))), 128))
			], 6)]),
			_: 1
		}, 512))])]));
	}
});
//#endregion
export { ie as DocFlowCanvas, Re as DocGraphViewer, v as DocViewer, y as MarkdownRenderer };

//# sourceMappingURL=index.js.map