import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createVNode as o, defineComponent as s, nextTick as c, normalizeClass as l, normalizeStyle as u, openBlock as d, ref as f, renderList as p, toDisplayString as m, unref as h, watch as ee, withCtx as te, withKeys as g, withModifiers as _ } from "vue";
import { NeumorphismCanvas as ne, NeumorphismThemeToggle as re } from "@echolab-auto/ui-frame";
import { DocFlowCanvas as ie, DocViewer as v, MarkdownEditor as ae, MarkdownRenderer as y, MarkdownRenderer as oe, writeFlowNodePosition as se } from "@echolab-auto/ui-frame/doc";
import "@echolab-auto/ui-frame/dist/style.css";
//#region ../prodoc-core/dist/graph-DfgBSDc2.js
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
		i[n] = x(r);
	}
	return {
		params: i,
		body: n.slice(r + 1).join("\n"),
		hasFrame: !0
	};
}
function ce(e) {
	return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).filter((e) => typeof e == "string").map((e) => e.trim()).filter(Boolean);
}
function le(e) {
	return ce(S(e).params.link);
}
function C(e) {
	return e === "" || e !== e.trim() || /[|,"]/.test(e) ? e.includes("\"") ? `'${e}'` : `"${e}"` : e;
}
function ue(e, t, n) {
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!S(e).hasFrame) return n === null ? e : `---${r}${n}${r}---${r}${e}`;
	let i = e.split(/\r?\n/), a = i.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (a === -1) return e;
	let o = RegExp(`^${t}\\s*:`), s = i.slice(1, a).findIndex((e) => o.test(e));
	return n === null ? s >= 0 && i.splice(s + 1, 1) : s >= 0 ? i[s + 1] = n : i.splice(a, 0, n), i.join(r);
}
function de(e, t) {
	return ue(e, "link", t.length > 0 ? `link: [${t.map(C).join(", ")}]` : null);
}
function fe(e, t) {
	return ue(e, "group", t === null ? null : `group: ${C(t)}`);
}
function pe(e, t) {
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
var w = 72, T = 48, E = /* @__PURE__ */ new Set([
	"id",
	"title",
	"x",
	"y",
	"w",
	"h",
	"link",
	"group"
]);
function D(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
var O = {
	t: "top",
	r: "right",
	b: "bottom",
	l: "left"
}, k = {
	top: "t",
	right: "r",
	bottom: "b",
	left: "l"
}, A = /^([trbl_])>([trbl_])$/;
function me(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(A);
		t ? (t[1] !== "_" && (n.fromSide = O[t[1]]), t[2] !== "_" && (n.toSide = O[t[2]])) : e !== "" && (n.label = e);
	}
	return n;
}
function he(e) {
	let t = e.ref;
	if (e.label && (t += ` | ${e.label}`), e.fromSide || e.toSide) {
		let n = e.fromSide ? k[e.fromSide] : "_", r = e.toSide ? k[e.toSide] : "_";
		t += ` | ${n}>${r}`;
	}
	return t;
}
var j = /^(.*)\s*@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
function ge(e) {
	let t = e.match(j);
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
function _e(e) {
	let { name: t, x: n, y: r, w: i, h: a } = e;
	return [
		n,
		r,
		i,
		a
	].every((e) => typeof e == "number" && Number.isFinite(e)) ? `${t} @ ${n}, ${r}, ${i}, ${a}` : t;
}
function ve(e, t) {
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
function ye(e) {
	let t = e.match(/^#[ \t]+(.+)$/m);
	return t ? t[1].trim() : void 0;
}
function be(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
}
function xe(e) {
	return e.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_~]/g, "").replace(/<[^>]+>/g, "").trim();
}
function Se(e) {
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
			let e = xe(i[1]);
			e && t.push({
				anchor: be(e),
				title: e
			});
		}
	}
	return t.length >= 2 ? t : [];
}
function M(e, t) {
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
	let u = [...l.keys()].sort((e, t) => e - t), d = T;
	for (let e of u) {
		let t = l.get(e), n = t.map((e, n) => {
			let r = (c.get(e.box.id) ?? []).map((e) => s.get(e)).filter((e) => e !== void 0);
			return {
				auto: e,
				bary: r.length ? r.reduce((e, t) => e + t, 0) / r.length : 2 ** 53 - 1 - (t.length - n)
			};
		});
		n.sort((e, t) => e.bary - t.bary);
		let i = n.map((e) => e.auto), u = d, f = 0, p = T, m = 0;
		for (let { box: e } of i) {
			m === a && (u += f + w, f = 0, p = T, m = 0);
			let t = r.get(e.id);
			t.rawX === void 0 && (e.x = p), t.rawY === void 0 && (e.y = u), s.set(e.id, o(e)), p += e.w + 64, f = Math.max(f, e.h), m++;
		}
		d = u + f + w;
	}
}
function Ce(e, t) {
	let n = e.map((e) => ({
		...e,
		x: 0,
		y: 0
	}));
	return N(n, t, M(n, t), new Map(n.map((e) => [e.id, {}]))), new Map(n.map((e) => [e.id, {
		x: e.x,
		y: e.y
	}]));
}
function we(e) {
	let t = Object.keys(e).sort(), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let o of t) {
		let { params: t, body: s } = S(e[o]), c = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : o.replace(/\.md$/, ""), l = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || ye(s) || c, u = Se(s), d = D(t.w) ?? 220, f = D(t.h) ?? 96, p = {};
		for (let [e, n] of Object.entries(t)) E.has(e) || (p[e] = n);
		let m = {
			id: c,
			title: l,
			docPath: o,
			depth: 0,
			blocks: u,
			x: D(t.x) ?? 0,
			y: D(t.y) ?? 0,
			w: d,
			h: f,
			attrs: p
		};
		if (i.set(c, {
			rawX: D(t.x),
			rawY: D(t.y)
		}), t.group !== void 0) {
			let e = (Array.isArray(t.group) ? t.group : [t.group]).map((e) => typeof e == "string" ? e : typeof e == "number" ? String(e) : "").filter((e) => e.trim() !== "");
			if (e.length > 1 && n.push(`文档 "${c}" 声明了多个 group，仅取第一个 "${ge(e[0]).name || e[0]}"`), e.length > 0) {
				let { name: t, geo: n } = ge(e[0]);
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
		let { params: n } = S(e[t.docPath]);
		for (let e of ce(n.link)) {
			let { ref: n, label: r, fromSide: i, toSide: a } = me(e);
			n && d(t.id, n, {
				label: r,
				fromSide: i,
				toSide: a
			}, t.id + ".link");
		}
	}
	let f = M(o, c);
	for (let e of o) e.depth = f.get(e.id) ?? 0;
	N(o, c, f, i);
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
			...ve(t.members, t.geo),
			explicit: t.geo !== void 0,
			holder: t.holder ?? t.members[0].docPath
		})),
		warnings: n
	};
}
//#endregion
//#region src/components/DocGraphViewer.vue?vue&type=script&setup=true&lang.ts
var Te = { class: "pd-graph-viewer" }, Ee = { class: "pd-graph-header" }, De = {
	key: 0,
	class: "pd-graph-current"
}, Oe = { class: "pd-graph-actions" }, ke = ["disabled"], Ae = ["disabled"], je = ["disabled"], Me = { class: "pd-graph-main" }, Ne = ["title", "onPointerdown"], Pe = ["aria-label", "onPointerdown"], Fe = ["width", "height"], Ie = ["d", "onClick"], Le = ["d"], Re = ["x", "y"], ze = ["d"], Be = [
	"x1",
	"y1",
	"x2",
	"y2"
], Ve = {
	key: 1,
	class: "pd-edge-handles"
}, He = ["cx", "cy"], Ue = ["cx", "cy"], We = ["aria-label"], Ge = [
	"aria-label",
	"onPointerdown",
	"onClick",
	"onKeydown",
	"onMouseenter"
], Ke = { class: "pd-doc-box__head" }, qe = { class: "pd-doc-box__title" }, Je = [
	"aria-label",
	"onClick",
	"onKeydown"
], Ye = ["aria-label", "onPointerdown"], Xe = {
	class: "pd-doc-blocks-pop__card",
	role: "menu"
}, Ze = [
	"title",
	"aria-label",
	"onClick",
	"onKeydown"
], Qe = ["aria-label", "onClick"], $e = 30, et = /* @__PURE__ */ s({
	__name: "DocGraphViewer",
	props: { files: {} },
	emits: ["navigate", "save"],
	setup(s, { emit: ie }) {
		let v = s, y = ie, b = f(/* @__PURE__ */ new Map()), x = t(() => b.value.size > 0), ce = t(() => b.value.size ? {
			...v.files,
			...Object.fromEntries(b.value)
		} : v.files), C = t(() => we(ce.value)), ue = t(() => Object.fromEntries(Object.entries(v.files).map(([e, t]) => [e, S(t).body])));
		ee(() => C.value.warnings, (e) => e.forEach((e) => console.warn("[ProDoc]", e)), { immediate: !0 });
		let w = f(null), T = f(null), E = t(() => {
			let e = 0, t = 0;
			for (let n of N.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			for (let n of P.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			return {
				w: Math.max(e, 640),
				h: Math.max(t, 480)
			};
		});
		function D(e, t) {
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
		function O(e, t) {
			let n = e.x + e.w / 2, r = e.y + e.h / 2, i = t.x + t.w / 2 - n, a = t.y + t.h / 2 - r;
			return Math.abs(a) >= Math.abs(i) ? {
				fs: a >= 0 ? "bottom" : "top",
				ts: a >= 0 ? "top" : "bottom"
			} : {
				fs: i >= 0 ? "right" : "left",
				ts: i >= 0 ? "left" : "right"
			};
		}
		function k(e, t, n, r) {
			let i = O(e, t), a = D(e, n ?? i.fs), o = D(t, r ?? i.ts), s = Math.hypot(o.x - a.x, o.y - a.y), c = Math.max(24, Math.min(s * .45, 96)), l = `M ${a.x} ${a.y} C ${a.x + a.nx * c} ${a.y + a.ny * c}, ${o.x + o.nx * c} ${o.y + o.ny * c}, ${o.x} ${o.y}`;
			return {
				x1: a.x,
				y1: a.y,
				x2: o.x,
				y2: o.y,
				d: l
			};
		}
		let A = t(() => {
			let e = new Map(N.value.map((e) => [e.id, e])), t = J.value;
			return C.value.relations.flatMap((n) => {
				let r = e.get(n.from), i = e.get(n.to);
				if (!r || !i) return [];
				let a = n.fromSide, o = n.toSide;
				t && t.edgeId === n.id && (t.which === "from" ? a = t.side : o = t.side);
				let { x1: s, y1: c, x2: l, y2: u, d } = k(r, i, a, o);
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
		}), j = f(null);
		function ge(e) {
			B.value || G.value || J.value || (j.value = e);
		}
		let ye = t(() => {
			if (!j.value) return /* @__PURE__ */ new Set();
			let e = /* @__PURE__ */ new Set([j.value]);
			for (let t of C.value.relations) t.from === j.value && e.add(t.to), t.to === j.value && e.add(t.from);
			return e;
		}), be = (e) => j.value !== null && !ye.value.has(e), xe = (e) => j.value !== null && (e.fromId === j.value || e.toId === j.value), Se = (e) => j.value !== null && !xe(e), M = f(null), N = t(() => C.value.boxes.map((e) => {
			let t = M.value?.get(e.id);
			return t ? {
				...e,
				x: t.x,
				y: t.y
			} : e;
		}));
		function et(e, t) {
			let n = new Map(M.value ?? []);
			n.set(e, t), M.value = n;
		}
		let P = t(() => {
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
				let r = n.members.map((e) => N.value.find((t) => t.id === e)).filter((e) => !!e);
				return {
					...n,
					...ve(r)
				};
			});
		}), tt = (e) => j.value !== null && !e.members.some((e) => ye.value.has(e));
		function nt() {
			M.value = M.value ? null : Ce(C.value.boxes, C.value.relations);
		}
		let rt = (e) => e.blocks.slice(0, 6), it = (e) => Math.max(0, e.blocks.length - 6), at = (e) => (rt(e).length + +(it(e) > 0)) * $e + 12, ot = (e, t) => e.y + e.h + 6 + at(e) > t, F = f(!1);
		function I(e) {
			return b.value.get(e) ?? v.files[e];
		}
		function L(e, t) {
			let n = new Map(b.value);
			t === v.files[e] ? n.delete(e) : n.set(e, t), b.value = n;
		}
		let R = f(!1);
		function st() {
			if (!(!x.value || R.value)) {
				R.value = !0;
				for (let [e, t] of b.value) y("save", e, t, v.files[e]);
				b.value = /* @__PURE__ */ new Map(), R.value = !1;
			}
		}
		function ct() {
			if (!x.value) return;
			let e = new Set([...b.value.keys()].map((e) => C.value.boxes.find((t) => t.docPath === e)?.id).filter((e) => !!e));
			if (b.value = /* @__PURE__ */ new Map(), M.value) {
				let t = new Map(M.value);
				e.forEach((e) => t.delete(e)), M.value = t.size > 0 ? t : null;
			}
			K.value = null, F.value = !1;
		}
		function lt() {
			if (F.value) {
				if (x.value) return;
				K.value = null, F.value = !1;
			} else F.value = !0;
		}
		let ut = f(null);
		function z(e, t) {
			let n = ut.value;
			if (!n) return {
				x: 0,
				y: 0,
				scale: 1
			};
			let r = n.getBoundingClientRect(), i = r.width / E.value.w || 1;
			return {
				x: (e - r.left) / i,
				y: (t - r.top) / i,
				scale: i
			};
		}
		let B = f(null), V = f([]), H = {
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
		}, dt = {
			x: ["end"],
			y: ["end"]
		};
		function U(e, t) {
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
		function ft(e, t, n, r) {
			let i = Math.min(Math.max(8 / n, 4), 12), a = {};
			for (let n of ["x", "y"]) {
				let o = U(e, n), s = r[n].map((e) => o[e]), c = null;
				for (let e of t) for (let t of Object.values(U(e, n))) for (let e of s) {
					let n = t - e;
					Math.abs(n) <= i && (c === null || Math.abs(n) < Math.abs(c)) && (c = n);
				}
				c !== null && (a[n === "x" ? "dx" : "dy"] = c);
			}
			return a;
		}
		function pt(e, t, n) {
			let r = [], i = /* @__PURE__ */ new Set();
			for (let a of ["x", "y"]) {
				let o = U(e, a), s = n[a].map((e) => o[e]);
				for (let n of t) for (let t of Object.values(U(n, a))) {
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
		function mt(e, t, n, r) {
			let i = N.value.find((t) => t.id === e);
			if (!i) return {
				x: t,
				y: n,
				guides: []
			};
			let a = N.value.filter((t) => t.id !== e), o = ft({
				x: t,
				y: n,
				w: i.w,
				h: i.h
			}, a, r, H), s = Math.round(t + (o.dx ?? 0)), c = Math.round(n + (o.dy ?? 0));
			return {
				x: s,
				y: c,
				guides: o.dx !== void 0 || o.dy !== void 0 ? pt({
					x: s,
					y: c,
					w: i.w,
					h: i.h
				}, a, H) : []
			};
		}
		let ht = !1;
		function gt(e, t) {
			F.value && e.button === 0 && (e.target.closest("button") || (B.value = {
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
			}, window.addEventListener("pointermove", _t), window.addEventListener("pointerup", W), window.addEventListener("pointercancel", W), j.value = null));
		}
		function _t(e) {
			let t = B.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(vt));
		}
		function vt() {
			let e = B.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			e.moved = !0;
			let r = mt(e.id, e.baseX + t, e.baseY + n, e.scale);
			et(e.id, {
				x: r.x,
				y: r.y
			}), V.value = r.guides;
		}
		function yt() {
			let e = B.value;
			if (B.value = null, V.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			ht = !0;
			let t = M.value?.get(e.id);
			if (!t) return;
			let n = I(e.path);
			n !== void 0 && L(e.path, pe(n, t));
		}
		function W() {
			window.removeEventListener("pointermove", _t), window.removeEventListener("pointerup", W), window.removeEventListener("pointercancel", W), yt();
		}
		function bt(e) {
			if (ht) {
				ht = !1;
				return;
			}
			F.value || Z(e);
		}
		let G = f(null);
		function xt(e, t) {
			if (!F.value || e.button !== 0) return;
			e.preventDefault();
			let n = z(e.clientX, e.clientY);
			G.value = {
				fromId: t.id,
				x: n.x,
				y: n.y,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", St), window.addEventListener("pointerup", Et), window.addEventListener("pointercancel", Tt), j.value = null;
		}
		function St(e) {
			let t = G.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Ct));
		}
		function Ct() {
			let e = G.value;
			if (!e) return;
			e.raf = 0;
			let t = z(e.lastClientX, e.lastClientY);
			G.value = {
				...e,
				x: t.x,
				y: t.y
			};
		}
		function wt() {
			window.removeEventListener("pointermove", St), window.removeEventListener("pointerup", Et), window.removeEventListener("pointercancel", Tt);
		}
		function Tt() {
			wt();
			let e = G.value;
			e?.raf && cancelAnimationFrame(e.raf), G.value = null;
		}
		function Et(e) {
			wt();
			let t = G.value;
			if (t?.raf && cancelAnimationFrame(t.raf), G.value = null, !t) return;
			let n = z(e.clientX, e.clientY), r = N.value.find((e) => n.x >= e.x && n.x <= e.x + e.w && n.y >= e.y && n.y <= e.y + e.h);
			!r || r.id === t.fromId || C.value.relations.some((e) => e.from === t.fromId && e.to === r.id) || Dt(t.fromId, r.id);
		}
		function Dt(e, t) {
			let n = C.value.boxes.find((t) => t.id === e);
			if (!n) return;
			let r = I(n.docPath);
			r !== void 0 && L(n.docPath, de(r, [...le(r), t]));
		}
		let Ot = t(() => {
			let e = G.value;
			if (!e) return null;
			let t = N.value.find((t) => t.id === e.fromId);
			return t ? k(t, {
				x: e.x,
				y: e.y,
				w: 0,
				h: 0
			}).d : null;
		}), K = f(null), q = t(() => A.value.find((e) => e.id === K.value) ?? null);
		function kt(e) {
			F.value && (K.value = e.id);
		}
		let J = f(null);
		function At(e, t, n) {
			let r = t - (e.x + e.w / 2), i = n - (e.y + e.h / 2);
			return Math.abs(r) / (e.w / 2) >= Math.abs(i) / (e.h / 2) ? r >= 0 ? "right" : "left" : i >= 0 ? "bottom" : "top";
		}
		function jt(e, t, n) {
			if (e.button !== 0) return;
			e.preventDefault(), e.stopPropagation();
			let r = O(N.value.find((e) => e.id === t.fromId), N.value.find((e) => e.id === t.toId));
			J.value = {
				edgeId: t.id,
				which: n,
				side: (n === "from" ? t.fromSide : t.toSide) ?? (n === "from" ? r.fs : r.ts),
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", Mt), window.addEventListener("pointerup", It), window.addEventListener("pointercancel", Ft), j.value = null;
		}
		function Mt(e) {
			let t = J.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Nt));
		}
		function Nt() {
			let e = J.value;
			if (!e) return;
			e.raf = 0;
			let t = A.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = N.value.find((n) => n.id === (e.which === "from" ? t.fromId : t.toId));
			if (!n) return;
			let r = z(e.lastClientX, e.lastClientY), i = At(n, r.x, r.y);
			i !== e.side && (J.value = {
				...e,
				side: i
			});
		}
		function Pt() {
			window.removeEventListener("pointermove", Mt), window.removeEventListener("pointerup", It), window.removeEventListener("pointercancel", Ft);
		}
		function Ft() {
			Pt();
			let e = J.value;
			e?.raf && cancelAnimationFrame(e.raf), J.value = null;
		}
		function It() {
			Pt();
			let e = J.value;
			if (e?.raf && cancelAnimationFrame(e.raf), J.value = null, !e) return;
			let t = A.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.which === "from" ? e.side : t.fromSide, r = e.which === "to" ? e.side : t.toSide;
			n === t.fromSide && r === t.toSide || Lt(t, n, r);
		}
		function Lt(e, t, n) {
			let r = C.value.boxes.find((t) => t.id === e.fromId);
			if (!r) return;
			let i = I(r.docPath);
			if (i === void 0) return;
			let a = le(i).map((r) => {
				let i = me(r);
				return Rt(i.ref) === e.toId ? he({
					ref: i.ref,
					label: i.label,
					fromSide: t,
					toSide: n
				}) : r;
			});
			L(r.docPath, de(i, a));
		}
		function Rt(e) {
			let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md", r = C.value.boxes;
			return (r.find((e) => e.id === t) ?? r.find((e) => e.docPath === t) ?? r.find((e) => e.docPath === n))?.id;
		}
		function zt() {
			let e = q.value;
			if (!e) return;
			let t = C.value.boxes.find((t) => t.id === e.fromId);
			if (!t) return;
			let n = I(t.docPath);
			if (n === void 0) return;
			let r = le(n).filter((t) => Rt(me(t).ref) !== e.toId);
			L(t.docPath, de(n, r)), K.value = null;
		}
		let Y = f(null), X = f(null);
		function Bt(e, t) {
			if (!F.value || e.button !== 0) return;
			e.preventDefault();
			let n = P.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = /* @__PURE__ */ new Map();
			for (let e of t.members) {
				let t = N.value.find((t) => t.id === e);
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
			}, window.addEventListener("pointermove", Vt), window.addEventListener("pointerup", Ut), window.addEventListener("pointercancel", Ut), j.value = null;
		}
		function Vt(e) {
			let t = Y.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Ht));
		}
		function Ht() {
			let e = Y.value;
			if (!e) return;
			e.raf = 0;
			let t = Math.round((e.lastClientX - e.startClientX) / e.scale), n = Math.round((e.lastClientY - e.startClientY) / e.scale);
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = [...N.value.filter((t) => !e.basePositions.has(t.id)), ...P.value.filter((t) => t.name !== e.name)], i = ft({
				x: e.baseRegion.x + t,
				y: e.baseRegion.y + n,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, e.scale, H), a = t + (i.dx ?? 0), o = n + (i.dy ?? 0);
			Y.value = {
				...e,
				dx: a,
				dy: o,
				moved: !0
			};
			for (let [t, n] of e.basePositions) et(t, {
				x: n.x + a,
				y: n.y + o
			});
			V.value = i.dx !== void 0 || i.dy !== void 0 ? pt({
				x: e.baseRegion.x + a,
				y: e.baseRegion.y + o,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, H) : [];
		}
		function Ut() {
			window.removeEventListener("pointermove", Vt), window.removeEventListener("pointerup", Ut), window.removeEventListener("pointercancel", Ut);
			let e = Y.value;
			if (Y.value = null, V.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = C.value.groups.find((t) => t.name === e.name);
			if (t) {
				for (let n of t.members) {
					let t = C.value.boxes.find((e) => e.id === n), r = e.basePositions.get(n);
					if (!t || !r) continue;
					let i = I(t.docPath);
					i !== void 0 && L(t.docPath, pe(i, {
						x: r.x + e.dx,
						y: r.y + e.dy
					}));
				}
				if (t.explicit) {
					let n = I(t.holder);
					n !== void 0 && L(t.holder, fe(n, _e({
						name: t.name,
						x: e.baseRegion.x + e.dx,
						y: e.baseRegion.y + e.dy,
						w: e.baseRegion.w,
						h: e.baseRegion.h
					})));
				}
			}
		}
		function Wt(e, t) {
			if (!F.value || e.button !== 0) return;
			e.preventDefault();
			let n = P.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = t.members.map((e) => N.value.find((t) => t.id === e)).filter((e) => !!e), i = Math.max(...r.map((e) => e.x + e.w)), a = Math.max(...r.map((e) => e.y + e.h));
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
			}, window.addEventListener("pointermove", Gt), window.addEventListener("pointerup", qt), window.addEventListener("pointercancel", qt), j.value = null;
		}
		function Gt(e) {
			let t = X.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Kt));
		}
		function Kt() {
			let e = X.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = Math.round(e.baseRegion.w + t), i = Math.round(e.baseRegion.h + n), a = [...N.value.filter((t) => !e.memberIds.has(t.id)), ...P.value.filter((t) => t.name !== e.name)], o = ft({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: r,
				h: i
			}, a, e.scale, dt), s = Math.max(e.minW, Math.round(r + (o.dx ?? 0))), c = Math.max(e.minH, Math.round(i + (o.dy ?? 0)));
			X.value = {
				...e,
				curW: s,
				curH: c,
				moved: !0
			}, V.value = o.dx !== void 0 || o.dy !== void 0 ? pt({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: s,
				h: c
			}, a, dt) : [];
		}
		function qt() {
			window.removeEventListener("pointermove", Gt), window.removeEventListener("pointerup", qt), window.removeEventListener("pointercancel", qt);
			let e = X.value;
			if (X.value = null, V.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = C.value.groups.find((t) => t.name === e.name);
			if (!t) return;
			let n = I(t.holder);
			n !== void 0 && L(t.holder, fe(n, _e({
				name: t.name,
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: e.curW,
				h: e.curH
			})));
		}
		function Jt(e) {
			w.value || !F.value || !K.value || (e.key === "Delete" || e.key === "Backspace") && (e.preventDefault(), zt());
		}
		typeof window < "u" && window.addEventListener("keydown", Jt);
		let Yt = t(() => w.value ? C.value.boxes.find((e) => e.docPath === w.value)?.title ?? w.value : "");
		function Xt() {
			let e = w.value ? `#${encodeURIComponent(w.value)}` : "#";
			history.replaceState(null, "", e);
		}
		function Z(e) {
			v.files[e] && (Q.value = !1, w.value = e, y("navigate", e), Xt());
		}
		function Zt(e) {
			document.querySelector(`.pd-doc-view [data-heading-id$="-${e}"]`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function Qt(e, t) {
			if (w.value === e) {
				Zt(t);
				return;
			}
			Z(e), c(() => {
				setTimeout(() => Zt(t), 80), setTimeout(() => Zt(t), 320);
			});
		}
		function $t() {
			w.value = null, Xt(), c(() => requestAnimationFrame(() => T.value?.fit?.()));
		}
		ee(() => v.files, (e) => {
			if (R.value = !1, w.value && !e[w.value] && $t(), b.value.size) {
				let t = new Map(b.value);
				for (let [n, r] of t) (e[n] === r || e[n] === void 0) && t.delete(n);
				b.value = t;
			}
			if (!M.value) return;
			let t = C.value.boxes, n = new Map(M.value);
			for (let [e, r] of n) {
				let i = t.find((t) => t.id === e);
				(!i || i.x === r.x && i.y === r.y) && n.delete(e);
			}
			M.value = n.size > 0 ? n : null;
		});
		let Q = f(!1), $ = f(""), en = t(() => w.value !== null && $.value !== (v.files[w.value] ?? ""));
		function tn() {
			w.value && ($.value = v.files[w.value] ?? "", Q.value = !0);
		}
		function nn(e) {
			Z(e), tn();
		}
		function rn() {
			Q.value = !1;
		}
		function an() {
			!w.value || !en.value || y("save", w.value, $.value, v.files[w.value]);
		}
		function on(e) {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), an());
		}
		function sn(e, t) {
			F.value || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), Z(t));
		}
		function cn(e, t) {
			if (/^(https?:|mailto:|#)/.test(t)) return null;
			let n = t.split("#")[0].trim();
			if (!n.endsWith(".md")) return null;
			let r = n.startsWith("/") ? n.split("/") : [...e.split("/").slice(0, -1), ...n.split("/")], i = [];
			for (let e of r) e === "" || e === "." || (e === ".." ? i.pop() : i.push(e));
			return i.join("/");
		}
		function ln(e) {
			if (!w.value) return;
			let t = cn(w.value, e);
			t && Z(t);
		}
		function un(e) {
			if (!w.value) return;
			let t = v.files[w.value];
			if (t === void 0) return;
			let n = se(t, e.source, e.id, e.x, e.y);
			n !== t && y("save", w.value, n, t);
		}
		if (typeof window < "u" && window.location.hash.length > 1) {
			let e = decodeURIComponent(window.location.hash.slice(1));
			v.files[e] && (w.value = e);
		}
		return (t, s) => (d(), i("div", Te, [a("header", Ee, [
			s[6] ||= a("span", { class: "pd-graph-brand" }, "📚 ProDoc", -1),
			w.value ? (d(), i("span", De, m(Yt.value), 1)) : r("", !0),
			a("div", Oe, [
				w.value ? r("", !0) : (d(), i(e, { key: 0 }, [F.value ? (d(), i(e, { key: 1 }, [a("button", {
					class: "pd-back-btn",
					disabled: !x.value || R.value,
					onClick: st
				}, "💾 保存", 8, ke), x.value ? (d(), i("button", {
					key: 0,
					class: "pd-back-btn",
					disabled: R.value,
					onClick: ct
				}, "↩ 放弃更改", 8, Ae)) : (d(), i("button", {
					key: 1,
					class: "pd-back-btn pd-back-btn--active",
					onClick: lt
				}, "✓ 完成"))], 64)) : (d(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: lt
				}, "🛠 编辑图")), a("button", {
					class: "pd-back-btn",
					onClick: nt
				}, m(M.value ? "↩ 恢复坐标" : "🧭 分层重排"), 1)], 64)),
				w.value ? (d(), i(e, { key: 1 }, [Q.value ? (d(), i(e, { key: 1 }, [a("button", {
					class: "pd-back-btn",
					disabled: !en.value,
					onClick: an
				}, "💾 保存", 8, je), a("button", {
					class: "pd-back-btn",
					onClick: rn
				}, "👁 预览")], 64)) : (d(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: tn
				}, "✏️ 编辑")), a("button", {
					class: "pd-back-btn",
					onClick: $t
				}, "🗺 返回图")], 64)) : r("", !0),
				o(h(re), { size: "small" })
			])
		]), a("div", Me, [w.value ? (d(), i("div", {
			key: 1,
			class: l(["pd-doc-view", { "pd-doc-view--editing": Q.value }])
		}, [Q.value ? (d(), n(h(ae), {
			key: w.value,
			value: $.value,
			class: "pd-doc-editor",
			onChange: s[5] ||= (e) => $.value = e,
			onKeydown: on
		}, null, 8, ["value"])) : (d(), n(h(oe), {
			key: w.value,
			content: ue.value[w.value],
			"show-toc": !0,
			"flow-editable": !0,
			onDocLink: ln,
			onFlowNodeMove: un
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
				ref: ut,
				class: l(["pd-graph-stage", {
					"pd-graph-stage--dragging": B.value?.moved || G.value || J.value || Y.value?.moved || X.value?.moved,
					"pd-graph-stage--editing": F.value
				}]),
				style: u({
					width: `${E.value.w}px`,
					height: `${E.value.h}px`
				}),
				onClick: s[4] ||= (e) => K.value = null
			}, [
				(d(!0), i(e, null, p(P.value, (e) => (d(), i("div", {
					key: "group-" + e.name,
					class: l(["pd-doc-group", { "pd-dim": tt(e) }]),
					style: u({
						left: `${e.x}px`,
						top: `${e.y}px`,
						width: `${e.w}px`,
						height: `${e.h}px`
					})
				}, [a("span", {
					class: "pd-doc-group__label",
					title: F.value ? `拖动移动整组「${e.name}」` : e.name,
					"data-nm-no-pan": "",
					onPointerdown: (t) => Bt(t, e)
				}, m(e.name), 41, Ne), F.value ? (d(), i("button", {
					key: 0,
					type: "button",
					class: "pd-doc-group__resize",
					"aria-label": `调整组「${e.name}」的区域尺寸`,
					title: "拖动调整区域尺寸",
					"data-nm-no-pan": "",
					onPointerdown: _((t) => Wt(t, e), ["stop"])
				}, null, 40, Pe)) : r("", !0)], 6))), 128)),
				A.value.length || Ot.value ? (d(), i("svg", {
					key: 0,
					class: "pd-relation-layer",
					width: E.value.w,
					height: E.value.h,
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
					(d(!0), i(e, null, p(A.value, (e) => (d(), i("g", {
						key: e.id,
						class: l(["pd-relation", {
							"pd-dim": Se(e),
							"pd-hot": xe(e),
							"pd-selected": e.id === K.value
						}])
					}, [
						a("title", null, m(e.fromTitle) + " → " + m(e.toTitle) + m(e.label ? `（${e.label}）` : ""), 1),
						a("path", {
							class: "pd-relation-hit",
							d: e.d,
							fill: "none",
							onClick: _((t) => kt(e), ["stop"])
						}, null, 8, Ie),
						a("path", {
							d: e.d,
							fill: "none",
							"marker-end": "url(#pd-relation-arrow)",
							"pointer-events": "none"
						}, null, 8, Le),
						e.label ? (d(), i("text", {
							key: 0,
							x: e.labelX,
							y: e.labelY,
							"pointer-events": "none"
						}, m(e.label), 9, Re)) : r("", !0)
					], 2))), 128)),
					Ot.value ? (d(), i("path", {
						key: 0,
						class: "pd-relation-draft",
						d: Ot.value,
						fill: "none"
					}, null, 8, ze)) : r("", !0),
					(d(!0), i(e, null, p(V.value, (e, t) => (d(), i("line", {
						key: "guide" + t,
						class: "pd-guide",
						x1: e.axis === "x" ? e.pos : e.start,
						y1: e.axis === "x" ? e.start : e.pos,
						x2: e.axis === "x" ? e.pos : e.end,
						y2: e.axis === "x" ? e.end : e.pos
					}, null, 8, Be))), 128)),
					F.value && q.value ? (d(), i("g", Ve, [a("circle", {
						class: "pd-edge-handle",
						cx: q.value.x1,
						cy: q.value.y1,
						r: "6",
						onPointerdown: s[0] ||= _((e) => jt(e, q.value, "from"), ["stop"])
					}, [...s[7] ||= [a("title", null, "拖动调整源框连接边", -1)]], 40, He), a("circle", {
						class: "pd-edge-handle",
						cx: q.value.x2,
						cy: q.value.y2,
						r: "6",
						onPointerdown: s[1] ||= _((e) => jt(e, q.value, "to"), ["stop"])
					}, [...s[8] ||= [a("title", null, "拖动调整目标框连接边", -1)]], 40, Ue)])) : r("", !0)
				], 8, Fe)) : r("", !0),
				F.value && q.value ? (d(), i("button", {
					key: 1,
					type: "button",
					class: "pd-edge-delete",
					style: u({
						left: `${q.value.labelX}px`,
						top: `${q.value.labelY}px`
					}),
					"aria-label": `删除连线 ${q.value.fromTitle} → ${q.value.toTitle}`,
					title: "删除连线（Delete）",
					onClick: _(zt, ["stop"])
				}, "✕", 12, We)) : r("", !0),
				(d(!0), i(e, null, p(N.value, (t) => (d(), i("div", {
					key: t.id,
					class: l(["pd-doc-box", [`pd-doc-box--d${Math.min(t.depth, 3)}`, { "pd-dim": be(t.id) }]]),
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
					onPointerdown: (e) => gt(e, t),
					onClick: (e) => bt(t.docPath),
					onKeydown: (e) => sn(e, t.docPath),
					onMouseenter: (e) => ge(t.id),
					onMouseleave: s[3] ||= (e) => ge(null)
				}, [
					a("div", Ke, [a("span", qe, m(t.title), 1), s[10] ||= a("span", {
						class: "pd-doc-box__icon",
						"aria-hidden": "true"
					}, "↗", -1)]),
					F.value ? r("", !0) : (d(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-box__edit",
						"aria-label": `编辑 ${t.title}`,
						title: "编辑文档",
						onClick: _((e) => nn(t.docPath), ["stop"]),
						onKeydown: [g(_((e) => nn(t.docPath), ["stop"]), ["enter"]), g(_((e) => nn(t.docPath), ["stop"]), ["space"])]
					}, "✏️", 40, Je)),
					F.value ? (d(), i("button", {
						key: 1,
						type: "button",
						class: "pd-doc-box__link-handle",
						"aria-label": `从 ${t.title} 创建连线（拖到目标框）`,
						title: "拖到其他框创建连线",
						onPointerdown: _((e) => xt(e, t), ["stop"]),
						onClick: s[2] ||= _(() => {}, ["stop"])
					}, null, 40, Ye)) : r("", !0),
					t.blocks.length && !F.value ? (d(), i("div", {
						key: 2,
						class: l(["pd-doc-blocks-pop", { "pd-doc-blocks-pop--above": ot(t, E.value.h) }])
					}, [a("div", Xe, [(d(!0), i(e, null, p(rt(t), (e) => (d(), i("button", {
						key: e.anchor,
						type: "button",
						class: "pd-doc-blocks-pop__item",
						title: e.title,
						"aria-label": `跳转到「${e.title}」分块`,
						onClick: _((n) => Qt(t.docPath, e.anchor), ["stop"]),
						onKeydown: [g(_((n) => Qt(t.docPath, e.anchor), ["stop"]), ["enter"]), g(_((n) => Qt(t.docPath, e.anchor), ["stop"]), ["space"])]
					}, "▸ " + m(e.title), 41, Ze))), 128)), it(t) > 0 ? (d(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more",
						"aria-label": `查看全部 ${t.blocks.length} 个分块`,
						onClick: _((e) => Z(t.docPath), ["stop"])
					}, "+" + m(it(t)) + " 更多分块…", 9, Qe)) : r("", !0)])], 2)) : r("", !0)
				], 46, Ge))), 128))
			], 6)]),
			_: 1
		}, 512))])]));
	}
});
//#endregion
export { ie as DocFlowCanvas, et as DocGraphViewer, v as DocViewer, y as MarkdownRenderer };

//# sourceMappingURL=index.js.map