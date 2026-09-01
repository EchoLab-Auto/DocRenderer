import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createVNode as o, defineComponent as s, nextTick as c, normalizeClass as l, normalizeStyle as u, onBeforeUnmount as d, openBlock as f, ref as p, renderList as m, toDisplayString as h, unref as ee, vModelText as te, watch as ne, withCtx as re, withDirectives as ie, withKeys as g, withModifiers as _ } from "vue";
import { NeumorphismCanvas as ae, NeumorphismThemeToggle as oe } from "@echolab-auto/ui-frame";
import { DocFlowCanvas as se, DocViewer as v, MarkdownEditor as ce, MarkdownRenderer as le, MarkdownRenderer as ue, writeFlowNodePosition as de } from "@echolab-auto/ui-frame/doc";
import "@echolab-auto/ui-frame/dist/style.css";
//#region ../prodoc-core/dist/graph-AW9TabRY.js
function fe(e) {
	let t = [], n = "", r = null;
	for (let i of e) r ? (n += i, i === r && (r = null)) : i === "\"" || i === "'" ? (r = i, n += i) : i === "," ? (t.push(n), n = "") : n += i;
	return t.push(n), t;
}
function y(e) {
	let t = e.trim();
	if (t === "") return "";
	if (t.startsWith("[") && t.endsWith("]")) return fe(t.slice(1, -1)).map((e) => y(e)).filter((e) => e !== "");
	if (t === "true") return !0;
	if (t === "false") return !1;
	if (/^-?\d+$/.test(t)) return parseInt(t, 10);
	if (/^-?\d*\.\d+$/.test(t)) return parseFloat(t);
	let n = t.match(/^(["'])([\s\S]*)\1$/);
	return n ? n[2] : t;
}
function b(e) {
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
		if (r.trim() === "" && a < o.length && o[a].trimStart().startsWith("[") && (r = o[a], a += 1), r.trimStart().startsWith("[") && !/\]\s*$/.test(r)) {
			let e = [r];
			for (; a < o.length;) {
				let t = o[a];
				if (a += 1, e.push(t), /\]\s*$/.test(t)) break;
			}
			r = e.join("\n");
		}
		i[n] = y(r);
	}
	return {
		params: i,
		body: n.slice(r + 1).join("\n"),
		hasFrame: !0
	};
}
function x(e) {
	return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).filter((e) => typeof e == "string").map((e) => e.trim()).filter(Boolean);
}
function pe(e) {
	return x(b(e).params.link);
}
function me(e) {
	return e === "" || e !== e.trim() || /[|,"]/.test(e) ? e.includes("\"") ? `'${e}'` : `"${e}"` : e;
}
function S(e, t, n) {
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!b(e).hasFrame) return n === null ? e : `---${r}${n}${r}---${r}${e}`;
	let i = e.split(/\r?\n/), a = i.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (a === -1) return e;
	let o = RegExp(`^${t}\\s*:`), s = i.slice(1, a).findIndex((e) => o.test(e));
	if (s >= 0) {
		let e = s + 1, t = 1, r = e, c = i[e].replace(o, "");
		if (c.trim() === "" && e + 1 < a && i[e + 1].trimStart().startsWith("[") && (r = e + 1, c = i[r], t = 2), c.trimStart().startsWith("[") && !/\]\s*$/.test(c)) {
			let n = r + 1;
			for (; n < a && !/\]\s*$/.test(i[n]);) n++;
			n < a && (t = n - e + 1);
		}
		n === null ? i.splice(e, t) : i.splice(e, t, n);
	} else n !== null && i.splice(a, 0, n);
	return i.join(r);
}
function C(e, t) {
	return S(e, "link", t.length > 0 ? `link: [${t.map(me).join(", ")}]` : null);
}
function he(e, t) {
	return S(e, "group", t === null ? null : `group: ${me(t)}`);
}
function ge(e, t) {
	let n = Object.entries(t).filter((e) => (e[0] === "x" || e[0] === "y") && typeof e[1] == "number" && Number.isFinite(e[1]));
	if (n.length === 0) return e;
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!b(e).hasFrame) return `---${r}${n.map(([e, t]) => `${e}: ${t}`).join(r)}${r}---${r}${e}`;
	let i = e.split(/\r?\n/), a = i.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (a === -1) return e;
	let o = a;
	for (let [e, t] of n) {
		let n = RegExp(`^${e}\\s*:`), r = i.slice(1, o).findIndex((e) => n.test(e));
		r >= 0 ? i[r + 1] = `${e}: ${t}` : (i.splice(o, 0, `${e}: ${t}`), o++);
	}
	return i.join(r);
}
var _e = 72, w = 48, ve = /* @__PURE__ */ new Set([
	"id",
	"title",
	"x",
	"y",
	"w",
	"h",
	"link",
	"group"
]);
function T(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
var E = {
	t: "top",
	r: "right",
	b: "bottom",
	l: "left"
}, D = {
	top: "t",
	right: "r",
	bottom: "b",
	left: "l"
}, ye = /^([trbl_])>([trbl_])$/;
function be(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(ye);
		t ? (t[1] !== "_" && (n.fromSide = E[t[1]]), t[2] !== "_" && (n.toSide = E[t[2]])) : e !== "" && (n.label = e);
	}
	return n;
}
function xe(e) {
	let t = e.ref;
	if (e.label && (t += ` | ${e.label}`), e.fromSide || e.toSide) {
		let n = e.fromSide ? D[e.fromSide] : "_", r = e.toSide ? D[e.toSide] : "_";
		t += ` | ${n}>${r}`;
	}
	return t;
}
var O = /^(.*)\s*@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
function k(e) {
	let t = e.match(O);
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
function Oe(e, t) {
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
function A(e, t, n, r) {
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
	let u = [...l.keys()].sort((e, t) => e - t), d = w;
	for (let e of u) {
		let t = l.get(e), n = t.map((e, n) => {
			let r = (c.get(e.box.id) ?? []).map((e) => s.get(e)).filter((e) => e !== void 0);
			return {
				auto: e,
				bary: r.length ? r.reduce((e, t) => e + t, 0) / r.length : 2 ** 53 - 1 - (t.length - n)
			};
		});
		n.sort((e, t) => e.bary - t.bary);
		let i = n.map((e) => e.auto), u = d, f = 0, p = w, m = 0;
		for (let { box: e } of i) {
			m === a && (u += f + _e, f = 0, p = w, m = 0);
			let t = r.get(e.id);
			t.rawX === void 0 && (e.x = p), t.rawY === void 0 && (e.y = u), s.set(e.id, o(e)), p += e.w + 64, f = Math.max(f, e.h), m++;
		}
		d = u + f + _e;
	}
}
function ke(e, t) {
	let n = e.map((e) => ({
		...e,
		x: 0,
		y: 0
	}));
	return A(n, t, Oe(n, t), new Map(n.map((e) => [e.id, {}]))), new Map(n.map((e) => [e.id, {
		x: e.x,
		y: e.y
	}]));
}
function Ae(e) {
	let t = Object.keys(e).sort(), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let o of t) {
		let { params: t, body: s } = b(e[o]), c = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : o.replace(/\.md$/, ""), l = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || we(s) || c, u = De(s), d = T(t.w) ?? 220, f = T(t.h) ?? 96, p = {};
		for (let [e, n] of Object.entries(t)) ve.has(e) || (p[e] = n);
		let m = {
			id: c,
			title: l,
			docPath: o,
			depth: 0,
			blocks: u,
			x: T(t.x) ?? 0,
			y: T(t.y) ?? 0,
			w: d,
			h: f,
			attrs: p
		};
		if (i.set(c, {
			rawX: T(t.x),
			rawY: T(t.y)
		}), t.group !== void 0) {
			let e = (Array.isArray(t.group) ? t.group : [t.group]).map((e) => typeof e == "string" ? e : typeof e == "number" ? String(e) : "").filter((e) => e.trim() !== "");
			if (e.length > 1 && n.push(`文档 "${c}" 声明了多个 group，仅取第一个 "${k(e[0]).name || e[0]}"`), e.length > 0) {
				let { name: t, geo: n } = k(e[0]);
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
		let { params: n } = b(e[t.docPath]);
		for (let e of x(n.link)) {
			let { ref: n, label: r, fromSide: i, toSide: a } = be(e);
			n && d(t.id, n, {
				label: r,
				fromSide: i,
				toSide: a
			}, t.id + ".link");
		}
	}
	let f = Oe(o, c);
	for (let e of o) e.depth = f.get(e.id) ?? 0;
	A(o, c, f, i);
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
//#endregion
//#region src/components/DocGraphViewer.vue?vue&type=script&setup=true&lang.ts
var je = { class: "pd-graph-viewer" }, Me = { class: "pd-graph-header" }, Ne = {
	key: 0,
	class: "pd-graph-current"
}, Pe = { class: "pd-graph-actions" }, Fe = ["disabled"], Ie = ["disabled"], Le = ["disabled"], Re = { class: "pd-graph-main" }, ze = ["title", "onPointerdown"], Be = ["aria-label", "onPointerdown"], Ve = ["width", "height"], He = [
	"d",
	"onClick",
	"onDblclick"
], Ue = ["d"], We = ["x", "y"], Ge = ["d"], Ke = [
	"x1",
	"y1",
	"x2",
	"y2"
], qe = {
	key: 1,
	class: "pd-edge-handles"
}, Je = ["cx", "cy"], Ye = ["cx", "cy"], Xe = ["aria-label"], Ze = ["aria-label", "onKeydown"], Qe = [
	"aria-label",
	"onPointerdown",
	"onClick",
	"onKeydown",
	"onMouseenter"
], $e = { class: "pd-doc-box__head" }, et = { class: "pd-doc-box__title" }, tt = [
	"aria-label",
	"onClick",
	"onKeydown"
], nt = ["aria-label", "onPointerdown"], rt = {
	class: "pd-doc-blocks-pop__card",
	role: "menu"
}, it = [
	"title",
	"aria-label",
	"onClick",
	"onKeydown"
], at = ["aria-label", "onClick"], ot = {
	key: 2,
	class: "pd-edit-toolbar",
	role: "toolbar",
	"aria-label": "图编辑工具栏"
}, st = 30, j = /* @__PURE__ */ s({
	__name: "DocGraphViewer",
	props: {
		files: {},
		saveHandler: { type: Function }
	},
	emits: ["navigate", "save"],
	setup(s, { emit: se }) {
		let v = s, le = se;
		function fe(e, t, n) {
			return v.saveHandler ? v.saveHandler(e, t, n) : (le("save", e, t, n), Promise.resolve(!0));
		}
		let y = p(/* @__PURE__ */ new Map()), x = t(() => y.value.size > 0), me = t(() => y.value.size ? {
			...v.files,
			...Object.fromEntries(y.value)
		} : v.files), S = t(() => Ae(me.value)), _e = t(() => Object.fromEntries(Object.entries(v.files).map(([e, t]) => [e, b(t).body])));
		ne(() => S.value.warnings, (e) => e.forEach((e) => console.warn("[ProDoc]", e)), { immediate: !0 });
		let w = p(null), ve = p(null), T = t(() => {
			let e = 0, t = 0;
			for (let n of j.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			for (let n of M.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			return {
				w: Math.max(e, 640),
				h: Math.max(t, 480)
			};
		});
		function E(e, t) {
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
		function D(e, t) {
			let n = e.x + e.w / 2, r = e.y + e.h / 2, i = t.x + t.w / 2 - n, a = t.y + t.h / 2 - r;
			return Math.abs(a) >= Math.abs(i) ? {
				fs: a >= 0 ? "bottom" : "top",
				ts: a >= 0 ? "top" : "bottom"
			} : {
				fs: i >= 0 ? "right" : "left",
				ts: i >= 0 ? "left" : "right"
			};
		}
		function ye(e, t, n, r) {
			let i = D(e, t), a = E(e, n ?? i.fs), o = E(t, r ?? i.ts), s = Math.hypot(o.x - a.x, o.y - a.y), c = Math.max(24, Math.min(s * .45, 96)), l = `M ${a.x} ${a.y} C ${a.x + a.nx * c} ${a.y + a.ny * c}, ${o.x + o.nx * c} ${o.y + o.ny * c}, ${o.x} ${o.y}`;
			return {
				x1: a.x,
				y1: a.y,
				x2: o.x,
				y2: o.y,
				d: l
			};
		}
		let O = t(() => {
			let e = new Map(j.value.map((e) => [e.id, e])), t = J.value;
			return S.value.relations.flatMap((n) => {
				let r = e.get(n.from), i = e.get(n.to);
				if (!r || !i) return [];
				let a = n.fromSide, o = n.toSide;
				t && t.edgeId === n.id && (t.which === "from" ? a = t.side : o = t.side);
				let { x1: s, y1: c, x2: l, y2: u, d } = ye(r, i, a, o);
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
		}), k = p(null);
		function we(e) {
			B.value || U.value || J.value || (k.value = e);
		}
		let Te = t(() => {
			if (!k.value) return /* @__PURE__ */ new Set();
			let e = /* @__PURE__ */ new Set([k.value]);
			for (let t of S.value.relations) t.from === k.value && e.add(t.to), t.to === k.value && e.add(t.from);
			return e;
		}), Ee = (e) => k.value !== null && !Te.value.has(e), De = (e) => k.value !== null && (e.fromId === k.value || e.toId === k.value), Oe = (e) => k.value !== null && !De(e), A = p(null), j = t(() => S.value.boxes.map((e) => {
			let t = A.value?.get(e.id);
			return t ? {
				...e,
				x: t.x,
				y: t.y
			} : e;
		}));
		function ct(e, t) {
			let n = new Map(A.value ?? []);
			n.set(e, t), A.value = n;
		}
		let M = t(() => {
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
				let r = n.members.map((e) => j.value.find((t) => t.id === e)).filter((e) => !!e);
				return {
					...n,
					...Ce(r)
				};
			});
		}), lt = (e) => k.value !== null && !e.members.some((e) => Te.value.has(e));
		function ut() {
			A.value = A.value ? null : ke(S.value.boxes, S.value.relations);
		}
		let dt = (e) => e.blocks.slice(0, 6), ft = (e) => Math.max(0, e.blocks.length - 6), pt = (e) => (dt(e).length + +(ft(e) > 0)) * st + 12, mt = (e, t) => e.y + e.h + 6 + pt(e) > t, N = p(!1), P = p("select"), F = /* @__PURE__ */ new Set();
		function I(e) {
			return y.value.get(e) ?? v.files[e];
		}
		function L(e, t) {
			let n = new Map(y.value);
			t === v.files[e] ? (n.delete(e), F.delete(e)) : (n.set(e, t), e in v.files || F.add(e)), y.value = n;
		}
		let R = p(!1);
		async function ht() {
			if (!x.value || R.value) return;
			R.value = !0;
			let e = [];
			for (let [t, n] of y.value) await fe(t, n, v.files[t]) || e.push(t);
			if (e.length > 0) {
				let t = new Map(y.value);
				for (let n of t.keys()) e.includes(n) || (t.delete(n), F.delete(n));
				y.value = t;
			} else y.value = /* @__PURE__ */ new Map(), F.clear();
			R.value = !1;
		}
		function gt() {
			if (!x.value) return;
			let e = new Set([...y.value.keys()].map((e) => S.value.boxes.find((t) => t.docPath === e)?.id).filter((e) => !!e));
			if (y.value = /* @__PURE__ */ new Map(), A.value) {
				let t = new Map(A.value);
				e.forEach((e) => t.delete(e)), A.value = t.size > 0 ? t : null;
			}
			G.value = null, P.value = "select", F.clear(), N.value = !1;
		}
		function _t() {
			if (N.value) {
				if (x.value) return;
				G.value = null, P.value = "select", N.value = !1;
			} else N.value = !0;
		}
		let vt = p(null);
		function z(e, t) {
			let n = vt.value;
			if (!n) return {
				x: 0,
				y: 0,
				scale: 1
			};
			let r = n.getBoundingClientRect(), i = r.width / T.value.w || 1;
			return {
				x: (e - r.left) / i,
				y: (t - r.top) / i,
				scale: i
			};
		}
		let B = p(null), V = p([]), yt = {
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
		}, bt = {
			x: ["end"],
			y: ["end"]
		};
		function xt(e, t) {
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
		function St(e, t, n, r) {
			let i = Math.min(Math.max(8 / n, 4), 12), a = {};
			for (let n of ["x", "y"]) {
				let o = xt(e, n), s = r[n].map((e) => o[e]), c = null;
				for (let e of t) for (let t of Object.values(xt(e, n))) for (let e of s) {
					let n = t - e;
					Math.abs(n) <= i && (c === null || Math.abs(n) < Math.abs(c)) && (c = n);
				}
				c !== null && (a[n === "x" ? "dx" : "dy"] = c);
			}
			return a;
		}
		function Ct(e, t, n) {
			let r = [], i = /* @__PURE__ */ new Set();
			for (let a of ["x", "y"]) {
				let o = xt(e, a), s = n[a].map((e) => o[e]);
				for (let n of t) for (let t of Object.values(xt(n, a))) {
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
		function wt(e, t, n, r) {
			let i = j.value.find((t) => t.id === e);
			if (!i) return {
				x: t,
				y: n,
				guides: []
			};
			let a = j.value.filter((t) => t.id !== e), o = St({
				x: t,
				y: n,
				w: i.w,
				h: i.h
			}, a, r, yt), s = Math.round(t + (o.dx ?? 0)), c = Math.round(n + (o.dy ?? 0));
			return {
				x: s,
				y: c,
				guides: o.dx !== void 0 || o.dy !== void 0 ? Ct({
					x: s,
					y: c,
					w: i.w,
					h: i.h
				}, a, yt) : []
			};
		}
		let Tt = !1;
		function Et(e, t) {
			if (N.value && e.button === 0 && !e.target.closest("button")) {
				if (P.value === "link") {
					Nt(e, t);
					return;
				}
				P.value !== "node" && (B.value = {
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
				}, window.addEventListener("pointermove", Dt), window.addEventListener("pointerup", H), window.addEventListener("pointercancel", H), k.value = null);
			}
		}
		function Dt(e) {
			let t = B.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Ot));
		}
		function Ot() {
			let e = B.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			e.moved = !0;
			let r = wt(e.id, e.baseX + t, e.baseY + n, e.scale);
			ct(e.id, {
				x: r.x,
				y: r.y
			}), V.value = r.guides;
		}
		function kt() {
			let e = B.value;
			if (B.value = null, V.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			Tt = !0;
			let t = A.value?.get(e.id);
			if (!t) return;
			let n = I(e.path);
			n !== void 0 && L(e.path, ge(n, t));
		}
		function H() {
			window.removeEventListener("pointermove", Dt), window.removeEventListener("pointerup", H), window.removeEventListener("pointercancel", H), kt();
		}
		function At(e) {
			if (Tt) {
				Tt = !1;
				return;
			}
			N.value || Z(e);
		}
		let U = p(null), jt = p(null), W = null;
		function Mt(e, t) {
			let n = t.x - (e.x + e.w / 2), r = t.y - (e.y + e.h / 2);
			return Math.abs(n) * e.h > Math.abs(r) * e.w ? n >= 0 ? "right" : "left" : r >= 0 ? "bottom" : "top";
		}
		function Nt(e, t, n) {
			if (!N.value || e.button !== 0) return;
			e.preventDefault();
			let r = z(e.clientX, e.clientY);
			U.value = {
				fromId: t.id,
				fromSide: n ?? Mt(t, r),
				targetId: null,
				x: r.x,
				y: r.y,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", Ft), window.addEventListener("pointerup", zt), window.addEventListener("pointercancel", Rt), k.value = null;
		}
		function Pt(e, t, n) {
			Nt(e, t, n);
		}
		function Ft(e) {
			let t = U.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(It));
		}
		function It() {
			let e = U.value;
			if (!e) return;
			e.raf = 0;
			let t = z(e.lastClientX, e.lastClientY), n = j.value.find((e) => t.x >= e.x && t.x <= e.x + e.w && t.y >= e.y && t.y <= e.y + e.h);
			U.value = {
				...e,
				x: t.x,
				y: t.y,
				targetId: n?.id ?? null
			};
		}
		function Lt() {
			window.removeEventListener("pointermove", Ft), window.removeEventListener("pointerup", zt), window.removeEventListener("pointercancel", Rt);
		}
		function Rt() {
			Lt();
			let e = U.value;
			e?.raf && cancelAnimationFrame(e.raf), U.value = null;
		}
		function zt(e) {
			Lt();
			let t = U.value;
			if (t?.raf && cancelAnimationFrame(t.raf), U.value = null, !t) return;
			let n = z(e.clientX, e.clientY), r = j.value.find((e) => n.x >= e.x && n.x <= e.x + e.w && n.y >= e.y && n.y <= e.y + e.h);
			!r || r.id === t.fromId || S.value.relations.some((e) => e.from === t.fromId && e.to === r.id) || Bt(t.fromId, r.id, t.fromSide, Mt(r, n));
		}
		function Bt(e, t, n, r) {
			let i = S.value.boxes.find((t) => t.id === e);
			if (!i) return;
			let a = I(i.docPath);
			if (a === void 0) return;
			let o = xe({
				ref: t,
				fromSide: n,
				toSide: r
			});
			L(i.docPath, C(a, [...pe(a), o])), jt.value = `${e}->${t}`, W && clearTimeout(W), W = setTimeout(() => {
				jt.value = null, W = null;
			}, 700);
		}
		let Vt = t(() => {
			let e = U.value;
			if (!e) return null;
			let t = j.value.find((t) => t.id === e.fromId);
			if (!t) return null;
			let n = e.targetId ? j.value.find((t) => t.id === e.targetId) : void 0;
			if (n && n.id !== e.fromId) {
				let r = Mt(n, {
					x: e.x,
					y: e.y
				});
				return ye(t, n, e.fromSide, r).d;
			}
			return ye(t, {
				x: e.x,
				y: e.y,
				w: 0,
				h: 0
			}, e.fromSide).d;
		});
		function Ht(e) {
			let t = U.value;
			return !t || t.targetId !== e.id ? null : e.id === t.fromId || S.value.relations.some((n) => n.from === t.fromId && n.to === e.id) ? "invalid" : "valid";
		}
		d(() => {
			W && clearTimeout(W);
		});
		let Ut = null;
		function Wt(e) {
			!N.value || P.value !== "node" || e.button === 0 && e.target === vt.value && (Ut = {
				clientX: e.clientX,
				clientY: e.clientY
			}, window.addEventListener("pointerup", Gt));
		}
		function Gt(e) {
			window.removeEventListener("pointerup", Gt);
			let t = Ut;
			if (Ut = null, !t || Math.hypot(e.clientX - t.clientX, e.clientY - t.clientY) >= 3) return;
			let n = z(e.clientX, e.clientY);
			Kt(n.x, n.y);
		}
		function Kt(e, t) {
			let n = Math.round(e - 220 / 2), r = Math.round(t - 96 / 2), i = /* @__PURE__ */ new Set([...Object.keys(v.files), ...y.value.keys()]), a = 1;
			for (; i.has(`untitled-${a}.md`);) a++;
			let o = `untitled-${a}.md`, s = `未命名文档 ${a}`;
			L(o, `---\ntitle: "${s}"\nx: ${n}\ny: ${r}\n---\n\n# ${s}\n`);
		}
		let G = p(null), K = t(() => O.value.find((e) => e.id === G.value) ?? null);
		function qt(e) {
			N.value && (G.value = e.id);
		}
		let q = p(null), Jt = p(null);
		function Yt(e) {
			N.value && (G.value = e.id, q.value = {
				edgeId: e.id,
				value: e.label ?? ""
			}, c(() => {
				Jt.value?.focus(), Jt.value?.select();
			}));
		}
		function Xt() {
			let e = q.value;
			if (q.value = null, !e) return;
			let t = O.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.value.trim();
			if (n === (t.label ?? "")) return;
			let r = S.value.boxes.find((e) => e.id === t.fromId);
			if (!r) return;
			let i = I(r.docPath);
			if (i === void 0) return;
			let a = pe(i).map((e) => {
				let r = be(e);
				return sn(r.ref) === t.toId ? xe({
					ref: r.ref,
					label: n || void 0,
					fromSide: r.fromSide,
					toSide: r.toSide
				}) : e;
			});
			L(r.docPath, C(i, a));
		}
		function Zt() {
			q.value = null;
		}
		let J = p(null);
		function Qt(e, t, n) {
			let r = t - (e.x + e.w / 2), i = n - (e.y + e.h / 2);
			return Math.abs(r) / (e.w / 2) >= Math.abs(i) / (e.h / 2) ? r >= 0 ? "right" : "left" : i >= 0 ? "bottom" : "top";
		}
		function $t(e, t, n) {
			if (e.button !== 0) return;
			e.preventDefault(), e.stopPropagation();
			let r = D(j.value.find((e) => e.id === t.fromId), j.value.find((e) => e.id === t.toId));
			J.value = {
				edgeId: t.id,
				which: n,
				side: (n === "from" ? t.fromSide : t.toSide) ?? (n === "from" ? r.fs : r.ts),
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", en), window.addEventListener("pointerup", an), window.addEventListener("pointercancel", rn), k.value = null;
		}
		function en(e) {
			let t = J.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(tn));
		}
		function tn() {
			let e = J.value;
			if (!e) return;
			e.raf = 0;
			let t = O.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = j.value.find((n) => n.id === (e.which === "from" ? t.fromId : t.toId));
			if (!n) return;
			let r = z(e.lastClientX, e.lastClientY), i = Qt(n, r.x, r.y);
			i !== e.side && (J.value = {
				...e,
				side: i
			});
		}
		function nn() {
			window.removeEventListener("pointermove", en), window.removeEventListener("pointerup", an), window.removeEventListener("pointercancel", rn);
		}
		function rn() {
			nn();
			let e = J.value;
			e?.raf && cancelAnimationFrame(e.raf), J.value = null;
		}
		function an() {
			nn();
			let e = J.value;
			if (e?.raf && cancelAnimationFrame(e.raf), J.value = null, !e) return;
			let t = O.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.which === "from" ? e.side : t.fromSide, r = e.which === "to" ? e.side : t.toSide;
			n === t.fromSide && r === t.toSide || on(t, n, r);
		}
		function on(e, t, n) {
			let r = S.value.boxes.find((t) => t.id === e.fromId);
			if (!r) return;
			let i = I(r.docPath);
			if (i === void 0) return;
			let a = pe(i).map((r) => {
				let i = be(r);
				return sn(i.ref) === e.toId ? xe({
					ref: i.ref,
					label: i.label,
					fromSide: t,
					toSide: n
				}) : r;
			});
			L(r.docPath, C(i, a));
		}
		function sn(e) {
			let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md", r = S.value.boxes;
			return (r.find((e) => e.id === t) ?? r.find((e) => e.docPath === t) ?? r.find((e) => e.docPath === n))?.id;
		}
		function cn() {
			let e = K.value;
			if (!e) return;
			let t = S.value.boxes.find((t) => t.id === e.fromId);
			if (!t) return;
			let n = I(t.docPath);
			if (n === void 0) return;
			let r = pe(n).filter((t) => sn(be(t).ref) !== e.toId);
			L(t.docPath, C(n, r)), G.value = null;
		}
		let Y = p(null), X = p(null);
		function ln(e, t) {
			if (!N.value || e.button !== 0) return;
			e.preventDefault();
			let n = M.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = /* @__PURE__ */ new Map();
			for (let e of t.members) {
				let t = j.value.find((t) => t.id === e);
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
				scale: z(e.clientX, e.clientY).scale,
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
			}, window.addEventListener("pointermove", un), window.addEventListener("pointerup", fn), window.addEventListener("pointercancel", fn), k.value = null;
		}
		function un(e) {
			let t = Y.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(dn));
		}
		function dn() {
			let e = Y.value;
			if (!e) return;
			e.raf = 0;
			let t = Math.round((e.lastClientX - e.startClientX) / e.scale), n = Math.round((e.lastClientY - e.startClientY) / e.scale);
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = [...j.value.filter((t) => !e.basePositions.has(t.id)), ...M.value.filter((t) => t.name !== e.name)], i = St({
				x: e.baseRegion.x + t,
				y: e.baseRegion.y + n,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, e.scale, yt), a = t + (i.dx ?? 0), o = n + (i.dy ?? 0);
			Y.value = {
				...e,
				dx: a,
				dy: o,
				moved: !0
			};
			for (let [t, n] of e.basePositions) ct(t, {
				x: n.x + a,
				y: n.y + o
			});
			V.value = i.dx !== void 0 || i.dy !== void 0 ? Ct({
				x: e.baseRegion.x + a,
				y: e.baseRegion.y + o,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, yt) : [];
		}
		function fn() {
			window.removeEventListener("pointermove", un), window.removeEventListener("pointerup", fn), window.removeEventListener("pointercancel", fn);
			let e = Y.value;
			if (Y.value = null, V.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = S.value.groups.find((t) => t.name === e.name);
			if (t) {
				for (let n of t.members) {
					let t = S.value.boxes.find((e) => e.id === n), r = e.basePositions.get(n);
					if (!t || !r) continue;
					let i = I(t.docPath);
					i !== void 0 && L(t.docPath, ge(i, {
						x: r.x + e.dx,
						y: r.y + e.dy
					}));
				}
				if (t.explicit) {
					let n = I(t.holder);
					n !== void 0 && L(t.holder, he(n, Se({
						name: t.name,
						x: e.baseRegion.x + e.dx,
						y: e.baseRegion.y + e.dy,
						w: e.baseRegion.w,
						h: e.baseRegion.h
					})));
				}
			}
		}
		function pn(e, t) {
			if (!N.value || e.button !== 0) return;
			e.preventDefault();
			let n = M.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = t.members.map((e) => j.value.find((t) => t.id === e)).filter((e) => !!e), i = Math.max(...r.map((e) => e.x + e.w)), a = Math.max(...r.map((e) => e.y + e.h));
			X.value = {
				name: t.name,
				startClientX: e.clientX,
				startClientY: e.clientY,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				scale: z(e.clientX, e.clientY).scale,
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
			}, window.addEventListener("pointermove", mn), window.addEventListener("pointerup", gn), window.addEventListener("pointercancel", gn), k.value = null;
		}
		function mn(e) {
			let t = X.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(hn));
		}
		function hn() {
			let e = X.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = Math.round(e.baseRegion.w + t), i = Math.round(e.baseRegion.h + n), a = [...j.value.filter((t) => !e.memberIds.has(t.id)), ...M.value.filter((t) => t.name !== e.name)], o = St({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: r,
				h: i
			}, a, e.scale, bt), s = Math.max(e.minW, Math.round(r + (o.dx ?? 0))), c = Math.max(e.minH, Math.round(i + (o.dy ?? 0)));
			X.value = {
				...e,
				curW: s,
				curH: c,
				moved: !0
			}, V.value = o.dx !== void 0 || o.dy !== void 0 ? Ct({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: s,
				h: c
			}, a, bt) : [];
		}
		function gn() {
			window.removeEventListener("pointermove", mn), window.removeEventListener("pointerup", gn), window.removeEventListener("pointercancel", gn);
			let e = X.value;
			if (X.value = null, V.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = S.value.groups.find((t) => t.name === e.name);
			if (!t) return;
			let n = I(t.holder);
			n !== void 0 && L(t.holder, he(n, Se({
				name: t.name,
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: e.curW,
				h: e.curH
			})));
		}
		function _n(e) {
			if (!(w.value || !N.value)) {
				if (e.key === "Escape") {
					!q.value && P.value !== "select" && (P.value = "select");
					return;
				}
				G.value && (q.value || (e.key === "Delete" || e.key === "Backspace") && (e.preventDefault(), cn()));
			}
		}
		typeof window < "u" && window.addEventListener("keydown", _n);
		let vn = t(() => w.value ? S.value.boxes.find((e) => e.docPath === w.value)?.title ?? w.value : "");
		function yn() {
			let e = w.value ? `#${encodeURIComponent(w.value)}` : "#";
			history.replaceState(null, "", e);
		}
		function Z(e) {
			v.files[e] && (Q.value = !1, w.value = e, le("navigate", e), yn());
		}
		function bn(e) {
			document.querySelector(`.pd-doc-view [data-heading-id$="-${e}"]`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function xn(e, t) {
			if (w.value === e) {
				bn(t);
				return;
			}
			Z(e), c(() => {
				setTimeout(() => bn(t), 80), setTimeout(() => bn(t), 320);
			});
		}
		function Sn() {
			w.value = null, yn(), c(() => requestAnimationFrame(() => ve.value?.fit?.()));
		}
		ne(() => v.files, (e) => {
			if (R.value = !1, w.value && !e[w.value] && Sn(), y.value.size) {
				let t = new Map(y.value);
				for (let [n, r] of t) e[n] === r ? (t.delete(n), F.delete(n)) : e[n] === void 0 && !F.has(n) && t.delete(n);
				y.value = t;
			}
			if (!A.value) return;
			let t = S.value.boxes, n = new Map(A.value);
			for (let [e, r] of n) {
				let i = t.find((t) => t.id === e);
				(!i || i.x === r.x && i.y === r.y) && n.delete(e);
			}
			A.value = n.size > 0 ? n : null;
		});
		let Q = p(!1), $ = p(""), Cn = t(() => w.value !== null && $.value !== (v.files[w.value] ?? ""));
		function wn() {
			w.value && ($.value = v.files[w.value] ?? "", Q.value = !0);
		}
		function Tn(e) {
			Z(e), wn();
		}
		function En() {
			Q.value = !1;
		}
		function Dn() {
			!w.value || !Cn.value || fe(w.value, $.value, v.files[w.value]);
		}
		function On(e) {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), Dn());
		}
		function kn(e, t) {
			N.value || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), Z(t));
		}
		function An(e, t) {
			if (/^(https?:|mailto:|#)/.test(t)) return null;
			let n = t.split("#")[0].trim();
			if (!n.endsWith(".md")) return null;
			let r = n.startsWith("/") ? n.split("/") : [...e.split("/").slice(0, -1), ...n.split("/")], i = [];
			for (let e of r) e === "" || e === "." || (e === ".." ? i.pop() : i.push(e));
			return i.join("/");
		}
		function jn(e) {
			if (!w.value) return;
			let t = An(w.value, e);
			t && Z(t);
		}
		function Mn(e) {
			if (!w.value) return;
			let t = v.files[w.value];
			if (t === void 0) return;
			let n = de(t, e.source, e.id, e.x, e.y);
			n !== t && fe(w.value, n, t);
		}
		if (typeof window < "u" && window.location.hash.length > 1) {
			let e = decodeURIComponent(window.location.hash.slice(1));
			v.files[e] && (w.value = e);
		}
		return (t, s) => (f(), i("div", je, [a("header", Me, [
			s[11] ||= a("span", { class: "pd-graph-brand" }, "📚 ProDoc", -1),
			w.value ? (f(), i("span", Ne, h(vn.value), 1)) : r("", !0),
			a("div", Pe, [
				w.value ? r("", !0) : (f(), i(e, { key: 0 }, [N.value ? (f(), i(e, { key: 1 }, [a("button", {
					class: "pd-back-btn",
					disabled: !x.value || R.value,
					onClick: ht
				}, "💾 保存", 8, Fe), x.value ? (f(), i("button", {
					key: 0,
					class: "pd-back-btn",
					disabled: R.value,
					onClick: gt
				}, "↩ 放弃更改", 8, Ie)) : (f(), i("button", {
					key: 1,
					class: "pd-back-btn pd-back-btn--active",
					onClick: _t
				}, "✓ 完成"))], 64)) : (f(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: _t
				}, "🛠 编辑图")), a("button", {
					class: "pd-back-btn",
					onClick: ut
				}, h(A.value ? "↩ 恢复坐标" : "🧭 分层重排"), 1)], 64)),
				w.value ? (f(), i(e, { key: 1 }, [Q.value ? (f(), i(e, { key: 1 }, [a("button", {
					class: "pd-back-btn",
					disabled: !Cn.value,
					onClick: Dn
				}, "💾 保存", 8, Le), a("button", {
					class: "pd-back-btn",
					onClick: En
				}, "👁 预览")], 64)) : (f(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: wn
				}, "✏️ 编辑")), a("button", {
					class: "pd-back-btn",
					onClick: Sn
				}, "🗺 返回图")], 64)) : r("", !0),
				o(ee(oe), { size: "small" })
			])
		]), a("div", Re, [w.value ? (f(), i("div", {
			key: 1,
			class: l(["pd-doc-view", { "pd-doc-view--editing": Q.value }])
		}, [Q.value ? (f(), n(ee(ce), {
			key: w.value,
			value: $.value,
			class: "pd-doc-editor",
			onChange: s[7] ||= (e) => $.value = e,
			onKeydown: On
		}, null, 8, ["value"])) : (f(), n(ee(ue), {
			key: w.value,
			content: _e.value[w.value],
			"show-toc": !0,
			"flow-editable": !0,
			onDocLink: jn,
			onFlowNodeMove: Mn
		}, null, 8, ["content"]))], 2)) : (f(), n(ee(ae), {
			key: 0,
			ref_key: "canvasRef",
			ref: ve,
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
				ref: vt,
				class: l(["pd-graph-stage", {
					"pd-graph-stage--dragging": B.value?.moved || U.value || J.value || Y.value?.moved || X.value?.moved,
					"pd-graph-stage--editing": N.value,
					"pd-graph-stage--tool-link": N.value && P.value === "link",
					"pd-graph-stage--tool-node": N.value && P.value === "node"
				}]),
				style: u({
					width: `${T.value.w}px`,
					height: `${T.value.h}px`
				}),
				onPointerdown: Wt,
				onClick: s[6] ||= (e) => G.value = null
			}, [
				(f(!0), i(e, null, m(M.value, (e) => (f(), i("div", {
					key: "group-" + e.name,
					class: l(["pd-doc-group", { "pd-dim": lt(e) }]),
					style: u({
						left: `${e.x}px`,
						top: `${e.y}px`,
						width: `${e.w}px`,
						height: `${e.h}px`
					})
				}, [a("span", {
					class: "pd-doc-group__label",
					title: N.value ? `拖动移动整组「${e.name}」` : e.name,
					"data-nm-no-pan": "",
					onPointerdown: (t) => ln(t, e)
				}, h(e.name), 41, ze), N.value ? (f(), i("button", {
					key: 0,
					type: "button",
					class: "pd-doc-group__resize",
					"aria-label": `调整组「${e.name}」的区域尺寸`,
					title: "拖动调整区域尺寸",
					"data-nm-no-pan": "",
					onPointerdown: _((t) => pn(t, e), ["stop"])
				}, null, 40, Be)) : r("", !0)], 6))), 128)),
				O.value.length || Vt.value ? (f(), i("svg", {
					key: 0,
					class: "pd-relation-layer",
					width: T.value.w,
					height: T.value.h,
					"aria-label": "文档连线"
				}, [
					s[14] ||= a("defs", null, [a("marker", {
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
					(f(!0), i(e, null, m(O.value, (e) => (f(), i("g", {
						key: e.id,
						class: l(["pd-relation", {
							"pd-dim": Oe(e),
							"pd-hot": De(e),
							"pd-selected": e.id === G.value,
							"pd-relation--new": e.id === jt.value
						}])
					}, [
						a("title", null, h(e.fromTitle) + " → " + h(e.toTitle) + h(e.label ? `（${e.label}）` : ""), 1),
						a("path", {
							class: "pd-relation-hit",
							d: e.d,
							fill: "none",
							onClick: _((t) => qt(e), ["stop"]),
							onDblclick: _((t) => Yt(e), ["stop"])
						}, null, 40, He),
						a("path", {
							d: e.d,
							fill: "none",
							"marker-end": "url(#pd-relation-arrow)",
							"pointer-events": "none"
						}, null, 8, Ue),
						e.label ? (f(), i("text", {
							key: 0,
							x: e.labelX,
							y: e.labelY,
							"pointer-events": "none"
						}, h(e.label), 9, We)) : r("", !0)
					], 2))), 128)),
					Vt.value ? (f(), i("path", {
						key: 0,
						class: "pd-relation-draft",
						d: Vt.value,
						fill: "none"
					}, null, 8, Ge)) : r("", !0),
					(f(!0), i(e, null, m(V.value, (e, t) => (f(), i("line", {
						key: "guide" + t,
						class: "pd-guide",
						x1: e.axis === "x" ? e.pos : e.start,
						y1: e.axis === "x" ? e.start : e.pos,
						x2: e.axis === "x" ? e.pos : e.end,
						y2: e.axis === "x" ? e.end : e.pos
					}, null, 8, Ke))), 128)),
					N.value && K.value ? (f(), i("g", qe, [a("circle", {
						class: "pd-edge-handle",
						cx: K.value.x1,
						cy: K.value.y1,
						r: "6",
						onPointerdown: s[0] ||= _((e) => $t(e, K.value, "from"), ["stop"])
					}, [...s[12] ||= [a("title", null, "拖动调整源框连接边", -1)]], 40, Je), a("circle", {
						class: "pd-edge-handle",
						cx: K.value.x2,
						cy: K.value.y2,
						r: "6",
						onPointerdown: s[1] ||= _((e) => $t(e, K.value, "to"), ["stop"])
					}, [...s[13] ||= [a("title", null, "拖动调整目标框连接边", -1)]], 40, Ye)])) : r("", !0)
				], 8, Ve)) : r("", !0),
				N.value && K.value && !q.value ? (f(), i("button", {
					key: 1,
					type: "button",
					class: "pd-edge-delete",
					style: u({
						left: `${K.value.labelX}px`,
						top: `${K.value.labelY}px`
					}),
					"aria-label": `删除连线 ${K.value.fromTitle} → ${K.value.toTitle}`,
					title: "删除连线（Delete）",
					onClick: _(cn, ["stop"])
				}, "✕", 12, Xe)) : r("", !0),
				N.value && K.value && q.value && q.value.edgeId === K.value.id ? ie((f(), i("input", {
					key: 2,
					ref_key: "labelInputEl",
					ref: Jt,
					"onUpdate:modelValue": s[2] ||= (e) => q.value.value = e,
					type: "text",
					class: "pd-edge-label-input",
					style: u({
						left: `${K.value.labelX}px`,
						top: `${K.value.labelY}px`
					}),
					"aria-label": `编辑连线标签 ${K.value.fromTitle} → ${K.value.toTitle}`,
					placeholder: "连线标签（留空移除）",
					"data-nm-no-pan": "",
					onKeydown: [g(_(Xt, ["prevent"]), ["enter"]), g(_(Zt, ["prevent"]), ["esc"])],
					onBlur: Xt,
					onClick: s[3] ||= _(() => {}, ["stop"])
				}, null, 44, Ze)), [[te, q.value.value]]) : r("", !0),
				(f(!0), i(e, null, m(j.value, (t) => (f(), i("div", {
					key: t.id,
					class: l(["pd-doc-box", [`pd-doc-box--d${Math.min(t.depth, 3)}`, {
						"pd-dim": Ee(t.id),
						"pd-doc-box--link-target": Ht(t) === "valid",
						"pd-doc-box--link-invalid": Ht(t) === "invalid"
					}]]),
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
					onPointerdown: (e) => Et(e, t),
					onClick: (e) => At(t.docPath),
					onKeydown: (e) => kn(e, t.docPath),
					onMouseenter: (e) => we(t.id),
					onMouseleave: s[5] ||= (e) => we(null)
				}, [
					a("div", $e, [a("span", et, h(t.title), 1), s[15] ||= a("span", {
						class: "pd-doc-box__icon",
						"aria-hidden": "true"
					}, "↗", -1)]),
					N.value ? r("", !0) : (f(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-box__edit",
						"aria-label": `编辑 ${t.title}`,
						title: "编辑文档",
						onClick: _((e) => Tn(t.docPath), ["stop"]),
						onKeydown: [g(_((e) => Tn(t.docPath), ["stop"]), ["enter"]), g(_((e) => Tn(t.docPath), ["stop"]), ["space"])]
					}, "✏️", 40, tt)),
					N.value ? (f(), i(e, { key: 1 }, m([
						"top",
						"right",
						"bottom",
						"left"
					], (e) => a("button", {
						key: e,
						type: "button",
						class: l(["pd-doc-box__link-handle", `pd-doc-box__link-handle--${e}`]),
						"aria-label": `从 ${t.title} 的${{
							top: "上",
							right: "右",
							bottom: "下",
							left: "左"
						}[e]}边创建连线（拖到目标框）`,
						title: "拖到其他框创建连线",
						onPointerdown: _((n) => Pt(n, t, e), ["stop"]),
						onClick: s[4] ||= _(() => {}, ["stop"])
					}, null, 42, nt)), 64)) : r("", !0),
					t.blocks.length && !N.value ? (f(), i("div", {
						key: 2,
						class: l(["pd-doc-blocks-pop", { "pd-doc-blocks-pop--above": mt(t, T.value.h) }])
					}, [a("div", rt, [(f(!0), i(e, null, m(dt(t), (e) => (f(), i("button", {
						key: e.anchor,
						type: "button",
						class: "pd-doc-blocks-pop__item",
						title: e.title,
						"aria-label": `跳转到「${e.title}」分块`,
						onClick: _((n) => xn(t.docPath, e.anchor), ["stop"]),
						onKeydown: [g(_((n) => xn(t.docPath, e.anchor), ["stop"]), ["enter"]), g(_((n) => xn(t.docPath, e.anchor), ["stop"]), ["space"])]
					}, "▸ " + h(e.title), 41, it))), 128)), ft(t) > 0 ? (f(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more",
						"aria-label": `查看全部 ${t.blocks.length} 个分块`,
						onClick: _((e) => Z(t.docPath), ["stop"])
					}, "+" + h(ft(t)) + " 更多分块…", 9, at)) : r("", !0)])], 2)) : r("", !0)
				], 46, Qe))), 128))
			], 38)]),
			_: 1
		}, 512)), !w.value && N.value ? (f(), i("div", ot, [
			a("button", {
				type: "button",
				class: l(["pd-edit-toolbar__btn", { "pd-edit-toolbar__btn--active": P.value === "select" }]),
				title: "选择工具（Esc）",
				onClick: s[8] ||= (e) => P.value = "select"
			}, "🖱 选择", 2),
			a("button", {
				type: "button",
				class: l(["pd-edit-toolbar__btn", { "pd-edit-toolbar__btn--active": P.value === "link" }]),
				title: "连线工具：从任意框拖到目标框创建连线",
				onClick: s[9] ||= (e) => P.value = "link"
			}, "🔗 连线", 2),
			a("button", {
				type: "button",
				class: l(["pd-edit-toolbar__btn", { "pd-edit-toolbar__btn--active": P.value === "node" }]),
				title: "节点工具：点画布空白创建新文档框",
				onClick: s[10] ||= (e) => P.value = "node"
			}, "📄 节点", 2)
		])) : r("", !0)])]));
	}
});
//#endregion
export { se as DocFlowCanvas, j as DocGraphViewer, v as DocViewer, le as MarkdownRenderer };

//# sourceMappingURL=index.js.map