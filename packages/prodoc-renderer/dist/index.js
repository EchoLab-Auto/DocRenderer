import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createVNode as o, defineComponent as s, nextTick as c, normalizeClass as l, normalizeStyle as u, openBlock as d, ref as f, renderList as p, toDisplayString as m, unref as h, vModelText as ee, watch as te, withCtx as ne, withDirectives as re, withKeys as g, withModifiers as _ } from "vue";
import { NeumorphismCanvas as ie, NeumorphismThemeToggle as ae } from "@echolab-auto/ui-frame";
import { DocFlowCanvas as oe, DocViewer as v, MarkdownEditor as se, MarkdownRenderer as y, MarkdownRenderer as ce, writeFlowNodePosition as le } from "@echolab-auto/ui-frame/doc";
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
function ue(e) {
	return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).filter((e) => typeof e == "string").map((e) => e.trim()).filter(Boolean);
}
function de(e) {
	return ue(S(e).params.link);
}
function C(e) {
	return e === "" || e !== e.trim() || /[|,"]/.test(e) ? e.includes("\"") ? `'${e}'` : `"${e}"` : e;
}
function fe(e, t, n) {
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!S(e).hasFrame) return n === null ? e : `---${r}${n}${r}---${r}${e}`;
	let i = e.split(/\r?\n/), a = i.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (a === -1) return e;
	let o = RegExp(`^${t}\\s*:`), s = i.slice(1, a).findIndex((e) => o.test(e));
	return n === null ? s >= 0 && i.splice(s + 1, 1) : s >= 0 ? i[s + 1] = n : i.splice(a, 0, n), i.join(r);
}
function pe(e, t) {
	return fe(e, "link", t.length > 0 ? `link: [${t.map(C).join(", ")}]` : null);
}
function me(e, t) {
	return fe(e, "group", t === null ? null : `group: ${C(t)}`);
}
function he(e, t) {
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
var ge = {
	t: "top",
	r: "right",
	b: "bottom",
	l: "left"
}, O = {
	top: "t",
	right: "r",
	bottom: "b",
	left: "l"
}, k = /^([trbl_])>([trbl_])$/;
function A(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(k);
		t ? (t[1] !== "_" && (n.fromSide = ge[t[1]]), t[2] !== "_" && (n.toSide = ge[t[2]])) : e !== "" && (n.label = e);
	}
	return n;
}
function _e(e) {
	let t = e.ref;
	if (e.label && (t += ` | ${e.label}`), e.fromSide || e.toSide) {
		let n = e.fromSide ? O[e.fromSide] : "_", r = e.toSide ? O[e.toSide] : "_";
		t += ` | ${n}>${r}`;
	}
	return t;
}
var j = /^(.*)\s*@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
function M(e) {
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
function ve(e) {
	let { name: t, x: n, y: r, w: i, h: a } = e;
	return [
		n,
		r,
		i,
		a
	].every((e) => typeof e == "number" && Number.isFinite(e)) ? `${t} @ ${n}, ${r}, ${i}, ${a}` : t;
}
function ye(e, t) {
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
function be(e) {
	let t = e.match(/^#[ \t]+(.+)$/m);
	return t ? t[1].trim() : void 0;
}
function xe(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
}
function Se(e) {
	return e.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_~]/g, "").replace(/<[^>]+>/g, "").trim();
}
function Ce(e) {
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
			let e = Se(i[1]);
			e && t.push({
				anchor: xe(e),
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
function we(e, t) {
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
function Te(e) {
	let t = Object.keys(e).sort(), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let o of t) {
		let { params: t, body: s } = S(e[o]), c = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : o.replace(/\.md$/, ""), l = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || be(s) || c, u = Ce(s), d = D(t.w) ?? 220, f = D(t.h) ?? 96, p = {};
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
			if (e.length > 1 && n.push(`文档 "${c}" 声明了多个 group，仅取第一个 "${M(e[0]).name || e[0]}"`), e.length > 0) {
				let { name: t, geo: n } = M(e[0]);
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
		for (let e of ue(n.link)) {
			let { ref: n, label: r, fromSide: i, toSide: a } = A(e);
			n && d(t.id, n, {
				label: r,
				fromSide: i,
				toSide: a
			}, t.id + ".link");
		}
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
			...ye(t.members, t.geo),
			explicit: t.geo !== void 0,
			holder: t.holder ?? t.members[0].docPath
		})),
		warnings: n
	};
}
//#endregion
//#region src/components/DocGraphViewer.vue?vue&type=script&setup=true&lang.ts
var Ee = { class: "pd-graph-viewer" }, De = { class: "pd-graph-header" }, Oe = {
	key: 0,
	class: "pd-graph-current"
}, ke = { class: "pd-graph-actions" }, Ae = ["disabled"], je = ["disabled"], Me = ["disabled"], Ne = { class: "pd-graph-main" }, Pe = ["title", "onPointerdown"], Fe = ["aria-label", "onPointerdown"], Ie = ["width", "height"], Le = [
	"d",
	"onClick",
	"onDblclick"
], Re = ["d"], ze = ["x", "y"], Be = ["d"], Ve = [
	"x1",
	"y1",
	"x2",
	"y2"
], He = {
	key: 1,
	class: "pd-edge-handles"
}, Ue = ["cx", "cy"], We = ["cx", "cy"], Ge = ["aria-label"], Ke = ["aria-label", "onKeydown"], qe = [
	"aria-label",
	"onPointerdown",
	"onClick",
	"onKeydown",
	"onMouseenter"
], Je = { class: "pd-doc-box__head" }, Ye = { class: "pd-doc-box__title" }, Xe = [
	"aria-label",
	"onClick",
	"onKeydown"
], Ze = ["aria-label", "onPointerdown"], Qe = {
	class: "pd-doc-blocks-pop__card",
	role: "menu"
}, $e = [
	"title",
	"aria-label",
	"onClick",
	"onKeydown"
], et = ["aria-label", "onClick"], tt = 30, nt = /* @__PURE__ */ s({
	__name: "DocGraphViewer",
	props: { files: {} },
	emits: ["navigate", "save"],
	setup(s, { emit: oe }) {
		let v = s, y = oe, b = f(/* @__PURE__ */ new Map()), x = t(() => b.value.size > 0), ue = t(() => b.value.size ? {
			...v.files,
			...Object.fromEntries(b.value)
		} : v.files), C = t(() => Te(ue.value)), fe = t(() => Object.fromEntries(Object.entries(v.files).map(([e, t]) => [e, S(t).body])));
		te(() => C.value.warnings, (e) => e.forEach((e) => console.warn("[ProDoc]", e)), { immediate: !0 });
		let w = f(null), T = f(null), E = t(() => {
			let e = 0, t = 0;
			for (let n of P.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			for (let n of F.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
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
		function ge(e, t) {
			let n = e.x + e.w / 2, r = e.y + e.h / 2, i = t.x + t.w / 2 - n, a = t.y + t.h / 2 - r;
			return Math.abs(a) >= Math.abs(i) ? {
				fs: a >= 0 ? "bottom" : "top",
				ts: a >= 0 ? "top" : "bottom"
			} : {
				fs: i >= 0 ? "right" : "left",
				ts: i >= 0 ? "left" : "right"
			};
		}
		function O(e, t, n, r) {
			let i = ge(e, t), a = D(e, n ?? i.fs), o = D(t, r ?? i.ts), s = Math.hypot(o.x - a.x, o.y - a.y), c = Math.max(24, Math.min(s * .45, 96)), l = `M ${a.x} ${a.y} C ${a.x + a.nx * c} ${a.y + a.ny * c}, ${o.x + o.nx * c} ${o.y + o.ny * c}, ${o.x} ${o.y}`;
			return {
				x1: a.x,
				y1: a.y,
				x2: o.x,
				y2: o.y,
				d: l
			};
		}
		let k = t(() => {
			let e = new Map(P.value.map((e) => [e.id, e])), t = J.value;
			return C.value.relations.flatMap((n) => {
				let r = e.get(n.from), i = e.get(n.to);
				if (!r || !i) return [];
				let a = n.fromSide, o = n.toSide;
				t && t.edgeId === n.id && (t.which === "from" ? a = t.side : o = t.side);
				let { x1: s, y1: c, x2: l, y2: u, d } = O(r, i, a, o);
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
		function M(e) {
			V.value || W.value || J.value || (j.value = e);
		}
		let be = t(() => {
			if (!j.value) return /* @__PURE__ */ new Set();
			let e = /* @__PURE__ */ new Set([j.value]);
			for (let t of C.value.relations) t.from === j.value && e.add(t.to), t.to === j.value && e.add(t.from);
			return e;
		}), xe = (e) => j.value !== null && !be.value.has(e), Se = (e) => j.value !== null && (e.fromId === j.value || e.toId === j.value), Ce = (e) => j.value !== null && !Se(e), N = f(null), P = t(() => C.value.boxes.map((e) => {
			let t = N.value?.get(e.id);
			return t ? {
				...e,
				x: t.x,
				y: t.y
			} : e;
		}));
		function nt(e, t) {
			let n = new Map(N.value ?? []);
			n.set(e, t), N.value = n;
		}
		let F = t(() => {
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
				let r = n.members.map((e) => P.value.find((t) => t.id === e)).filter((e) => !!e);
				return {
					...n,
					...ye(r)
				};
			});
		}), rt = (e) => j.value !== null && !e.members.some((e) => be.value.has(e));
		function it() {
			N.value = N.value ? null : we(C.value.boxes, C.value.relations);
		}
		let at = (e) => e.blocks.slice(0, 6), ot = (e) => Math.max(0, e.blocks.length - 6), st = (e) => (at(e).length + +(ot(e) > 0)) * tt + 12, ct = (e, t) => e.y + e.h + 6 + st(e) > t, I = f(!1);
		function L(e) {
			return b.value.get(e) ?? v.files[e];
		}
		function R(e, t) {
			let n = new Map(b.value);
			t === v.files[e] ? n.delete(e) : n.set(e, t), b.value = n;
		}
		let z = f(!1);
		function lt() {
			if (!(!x.value || z.value)) {
				z.value = !0;
				for (let [e, t] of b.value) y("save", e, t, v.files[e]);
				b.value = /* @__PURE__ */ new Map(), z.value = !1;
			}
		}
		function ut() {
			if (!x.value) return;
			let e = new Set([...b.value.keys()].map((e) => C.value.boxes.find((t) => t.docPath === e)?.id).filter((e) => !!e));
			if (b.value = /* @__PURE__ */ new Map(), N.value) {
				let t = new Map(N.value);
				e.forEach((e) => t.delete(e)), N.value = t.size > 0 ? t : null;
			}
			G.value = null, I.value = !1;
		}
		function dt() {
			if (I.value) {
				if (x.value) return;
				G.value = null, I.value = !1;
			} else I.value = !0;
		}
		let ft = f(null);
		function B(e, t) {
			let n = ft.value;
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
		let V = f(null), H = f([]), U = {
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
		}, pt = {
			x: ["end"],
			y: ["end"]
		};
		function mt(e, t) {
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
		function ht(e, t, n, r) {
			let i = Math.min(Math.max(8 / n, 4), 12), a = {};
			for (let n of ["x", "y"]) {
				let o = mt(e, n), s = r[n].map((e) => o[e]), c = null;
				for (let e of t) for (let t of Object.values(mt(e, n))) for (let e of s) {
					let n = t - e;
					Math.abs(n) <= i && (c === null || Math.abs(n) < Math.abs(c)) && (c = n);
				}
				c !== null && (a[n === "x" ? "dx" : "dy"] = c);
			}
			return a;
		}
		function gt(e, t, n) {
			let r = [], i = /* @__PURE__ */ new Set();
			for (let a of ["x", "y"]) {
				let o = mt(e, a), s = n[a].map((e) => o[e]);
				for (let n of t) for (let t of Object.values(mt(n, a))) {
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
		function _t(e, t, n, r) {
			let i = P.value.find((t) => t.id === e);
			if (!i) return {
				x: t,
				y: n,
				guides: []
			};
			let a = P.value.filter((t) => t.id !== e), o = ht({
				x: t,
				y: n,
				w: i.w,
				h: i.h
			}, a, r, U), s = Math.round(t + (o.dx ?? 0)), c = Math.round(n + (o.dy ?? 0));
			return {
				x: s,
				y: c,
				guides: o.dx !== void 0 || o.dy !== void 0 ? gt({
					x: s,
					y: c,
					w: i.w,
					h: i.h
				}, a, U) : []
			};
		}
		let vt = !1;
		function yt(e, t) {
			I.value && e.button === 0 && (e.target.closest("button") || (V.value = {
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
			}, window.addEventListener("pointermove", bt), window.addEventListener("pointerup", Ct), window.addEventListener("pointercancel", Ct), j.value = null));
		}
		function bt(e) {
			let t = V.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(xt));
		}
		function xt() {
			let e = V.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			e.moved = !0;
			let r = _t(e.id, e.baseX + t, e.baseY + n, e.scale);
			nt(e.id, {
				x: r.x,
				y: r.y
			}), H.value = r.guides;
		}
		function St() {
			let e = V.value;
			if (V.value = null, H.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			vt = !0;
			let t = N.value?.get(e.id);
			if (!t) return;
			let n = L(e.path);
			n !== void 0 && R(e.path, he(n, t));
		}
		function Ct() {
			window.removeEventListener("pointermove", bt), window.removeEventListener("pointerup", Ct), window.removeEventListener("pointercancel", Ct), St();
		}
		function wt(e) {
			if (vt) {
				vt = !1;
				return;
			}
			I.value || Z(e);
		}
		let W = f(null);
		function Tt(e, t) {
			if (!I.value || e.button !== 0) return;
			e.preventDefault();
			let n = B(e.clientX, e.clientY);
			W.value = {
				fromId: t.id,
				x: n.x,
				y: n.y,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", Et), window.addEventListener("pointerup", At), window.addEventListener("pointercancel", kt), j.value = null;
		}
		function Et(e) {
			let t = W.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Dt));
		}
		function Dt() {
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
		function Ot() {
			window.removeEventListener("pointermove", Et), window.removeEventListener("pointerup", At), window.removeEventListener("pointercancel", kt);
		}
		function kt() {
			Ot();
			let e = W.value;
			e?.raf && cancelAnimationFrame(e.raf), W.value = null;
		}
		function At(e) {
			Ot();
			let t = W.value;
			if (t?.raf && cancelAnimationFrame(t.raf), W.value = null, !t) return;
			let n = B(e.clientX, e.clientY), r = P.value.find((e) => n.x >= e.x && n.x <= e.x + e.w && n.y >= e.y && n.y <= e.y + e.h);
			!r || r.id === t.fromId || C.value.relations.some((e) => e.from === t.fromId && e.to === r.id) || jt(t.fromId, r.id);
		}
		function jt(e, t) {
			let n = C.value.boxes.find((t) => t.id === e);
			if (!n) return;
			let r = L(n.docPath);
			r !== void 0 && R(n.docPath, pe(r, [...de(r), t]));
		}
		let Mt = t(() => {
			let e = W.value;
			if (!e) return null;
			let t = P.value.find((t) => t.id === e.fromId);
			return t ? O(t, {
				x: e.x,
				y: e.y,
				w: 0,
				h: 0
			}).d : null;
		}), G = f(null), K = t(() => k.value.find((e) => e.id === G.value) ?? null);
		function Nt(e) {
			I.value && (G.value = e.id);
		}
		let q = f(null), Pt = f(null);
		function Ft(e) {
			I.value && (G.value = e.id, q.value = {
				edgeId: e.id,
				value: e.label ?? ""
			}, c(() => {
				Pt.value?.focus(), Pt.value?.select();
			}));
		}
		function It() {
			let e = q.value;
			if (q.value = null, !e) return;
			let t = k.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.value.trim();
			if (n === (t.label ?? "")) return;
			let r = C.value.boxes.find((e) => e.id === t.fromId);
			if (!r) return;
			let i = L(r.docPath);
			if (i === void 0) return;
			let a = de(i).map((e) => {
				let r = A(e);
				return Kt(r.ref) === t.toId ? _e({
					ref: r.ref,
					label: n || void 0,
					fromSide: r.fromSide,
					toSide: r.toSide
				}) : e;
			});
			R(r.docPath, pe(i, a));
		}
		function Lt() {
			q.value = null;
		}
		let J = f(null);
		function Rt(e, t, n) {
			let r = t - (e.x + e.w / 2), i = n - (e.y + e.h / 2);
			return Math.abs(r) / (e.w / 2) >= Math.abs(i) / (e.h / 2) ? r >= 0 ? "right" : "left" : i >= 0 ? "bottom" : "top";
		}
		function zt(e, t, n) {
			if (e.button !== 0) return;
			e.preventDefault(), e.stopPropagation();
			let r = ge(P.value.find((e) => e.id === t.fromId), P.value.find((e) => e.id === t.toId));
			J.value = {
				edgeId: t.id,
				which: n,
				side: (n === "from" ? t.fromSide : t.toSide) ?? (n === "from" ? r.fs : r.ts),
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0
			}, window.addEventListener("pointermove", Bt), window.addEventListener("pointerup", Wt), window.addEventListener("pointercancel", Ut), j.value = null;
		}
		function Bt(e) {
			let t = J.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Vt));
		}
		function Vt() {
			let e = J.value;
			if (!e) return;
			e.raf = 0;
			let t = k.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = P.value.find((n) => n.id === (e.which === "from" ? t.fromId : t.toId));
			if (!n) return;
			let r = B(e.lastClientX, e.lastClientY), i = Rt(n, r.x, r.y);
			i !== e.side && (J.value = {
				...e,
				side: i
			});
		}
		function Ht() {
			window.removeEventListener("pointermove", Bt), window.removeEventListener("pointerup", Wt), window.removeEventListener("pointercancel", Ut);
		}
		function Ut() {
			Ht();
			let e = J.value;
			e?.raf && cancelAnimationFrame(e.raf), J.value = null;
		}
		function Wt() {
			Ht();
			let e = J.value;
			if (e?.raf && cancelAnimationFrame(e.raf), J.value = null, !e) return;
			let t = k.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.which === "from" ? e.side : t.fromSide, r = e.which === "to" ? e.side : t.toSide;
			n === t.fromSide && r === t.toSide || Gt(t, n, r);
		}
		function Gt(e, t, n) {
			let r = C.value.boxes.find((t) => t.id === e.fromId);
			if (!r) return;
			let i = L(r.docPath);
			if (i === void 0) return;
			let a = de(i).map((r) => {
				let i = A(r);
				return Kt(i.ref) === e.toId ? _e({
					ref: i.ref,
					label: i.label,
					fromSide: t,
					toSide: n
				}) : r;
			});
			R(r.docPath, pe(i, a));
		}
		function Kt(e) {
			let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md", r = C.value.boxes;
			return (r.find((e) => e.id === t) ?? r.find((e) => e.docPath === t) ?? r.find((e) => e.docPath === n))?.id;
		}
		function qt() {
			let e = K.value;
			if (!e) return;
			let t = C.value.boxes.find((t) => t.id === e.fromId);
			if (!t) return;
			let n = L(t.docPath);
			if (n === void 0) return;
			let r = de(n).filter((t) => Kt(A(t).ref) !== e.toId);
			R(t.docPath, pe(n, r)), G.value = null;
		}
		let Y = f(null), X = f(null);
		function Jt(e, t) {
			if (!I.value || e.button !== 0) return;
			e.preventDefault();
			let n = F.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = /* @__PURE__ */ new Map();
			for (let e of t.members) {
				let t = P.value.find((t) => t.id === e);
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
				scale: B(e.clientX, e.clientY).scale,
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
			}, window.addEventListener("pointermove", Yt), window.addEventListener("pointerup", Zt), window.addEventListener("pointercancel", Zt), j.value = null;
		}
		function Yt(e) {
			let t = Y.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Xt));
		}
		function Xt() {
			let e = Y.value;
			if (!e) return;
			e.raf = 0;
			let t = Math.round((e.lastClientX - e.startClientX) / e.scale), n = Math.round((e.lastClientY - e.startClientY) / e.scale);
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = [...P.value.filter((t) => !e.basePositions.has(t.id)), ...F.value.filter((t) => t.name !== e.name)], i = ht({
				x: e.baseRegion.x + t,
				y: e.baseRegion.y + n,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, e.scale, U), a = t + (i.dx ?? 0), o = n + (i.dy ?? 0);
			Y.value = {
				...e,
				dx: a,
				dy: o,
				moved: !0
			};
			for (let [t, n] of e.basePositions) nt(t, {
				x: n.x + a,
				y: n.y + o
			});
			H.value = i.dx !== void 0 || i.dy !== void 0 ? gt({
				x: e.baseRegion.x + a,
				y: e.baseRegion.y + o,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, r, U) : [];
		}
		function Zt() {
			window.removeEventListener("pointermove", Yt), window.removeEventListener("pointerup", Zt), window.removeEventListener("pointercancel", Zt);
			let e = Y.value;
			if (Y.value = null, H.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = C.value.groups.find((t) => t.name === e.name);
			if (t) {
				for (let n of t.members) {
					let t = C.value.boxes.find((e) => e.id === n), r = e.basePositions.get(n);
					if (!t || !r) continue;
					let i = L(t.docPath);
					i !== void 0 && R(t.docPath, he(i, {
						x: r.x + e.dx,
						y: r.y + e.dy
					}));
				}
				if (t.explicit) {
					let n = L(t.holder);
					n !== void 0 && R(t.holder, me(n, ve({
						name: t.name,
						x: e.baseRegion.x + e.dx,
						y: e.baseRegion.y + e.dy,
						w: e.baseRegion.w,
						h: e.baseRegion.h
					})));
				}
			}
		}
		function Qt(e, t) {
			if (!I.value || e.button !== 0) return;
			e.preventDefault();
			let n = F.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = t.members.map((e) => P.value.find((t) => t.id === e)).filter((e) => !!e), i = Math.max(...r.map((e) => e.x + e.w)), a = Math.max(...r.map((e) => e.y + e.h));
			X.value = {
				name: t.name,
				startClientX: e.clientX,
				startClientY: e.clientY,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				scale: B(e.clientX, e.clientY).scale,
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
			}, window.addEventListener("pointermove", $t), window.addEventListener("pointerup", tn), window.addEventListener("pointercancel", tn), j.value = null;
		}
		function $t(e) {
			let t = X.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(en));
		}
		function en() {
			let e = X.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = Math.round(e.baseRegion.w + t), i = Math.round(e.baseRegion.h + n), a = [...P.value.filter((t) => !e.memberIds.has(t.id)), ...F.value.filter((t) => t.name !== e.name)], o = ht({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: r,
				h: i
			}, a, e.scale, pt), s = Math.max(e.minW, Math.round(r + (o.dx ?? 0))), c = Math.max(e.minH, Math.round(i + (o.dy ?? 0)));
			X.value = {
				...e,
				curW: s,
				curH: c,
				moved: !0
			}, H.value = o.dx !== void 0 || o.dy !== void 0 ? gt({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: s,
				h: c
			}, a, pt) : [];
		}
		function tn() {
			window.removeEventListener("pointermove", $t), window.removeEventListener("pointerup", tn), window.removeEventListener("pointercancel", tn);
			let e = X.value;
			if (X.value = null, H.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = C.value.groups.find((t) => t.name === e.name);
			if (!t) return;
			let n = L(t.holder);
			n !== void 0 && R(t.holder, me(n, ve({
				name: t.name,
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: e.curW,
				h: e.curH
			})));
		}
		function nn(e) {
			w.value || !I.value || !G.value || q.value || (e.key === "Delete" || e.key === "Backspace") && (e.preventDefault(), qt());
		}
		typeof window < "u" && window.addEventListener("keydown", nn);
		let rn = t(() => w.value ? C.value.boxes.find((e) => e.docPath === w.value)?.title ?? w.value : "");
		function an() {
			let e = w.value ? `#${encodeURIComponent(w.value)}` : "#";
			history.replaceState(null, "", e);
		}
		function Z(e) {
			v.files[e] && (Q.value = !1, w.value = e, y("navigate", e), an());
		}
		function on(e) {
			document.querySelector(`.pd-doc-view [data-heading-id$="-${e}"]`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function sn(e, t) {
			if (w.value === e) {
				on(t);
				return;
			}
			Z(e), c(() => {
				setTimeout(() => on(t), 80), setTimeout(() => on(t), 320);
			});
		}
		function cn() {
			w.value = null, an(), c(() => requestAnimationFrame(() => T.value?.fit?.()));
		}
		te(() => v.files, (e) => {
			if (z.value = !1, w.value && !e[w.value] && cn(), b.value.size) {
				let t = new Map(b.value);
				for (let [n, r] of t) (e[n] === r || e[n] === void 0) && t.delete(n);
				b.value = t;
			}
			if (!N.value) return;
			let t = C.value.boxes, n = new Map(N.value);
			for (let [e, r] of n) {
				let i = t.find((t) => t.id === e);
				(!i || i.x === r.x && i.y === r.y) && n.delete(e);
			}
			N.value = n.size > 0 ? n : null;
		});
		let Q = f(!1), $ = f(""), ln = t(() => w.value !== null && $.value !== (v.files[w.value] ?? ""));
		function un() {
			w.value && ($.value = v.files[w.value] ?? "", Q.value = !0);
		}
		function dn(e) {
			Z(e), un();
		}
		function fn() {
			Q.value = !1;
		}
		function pn() {
			!w.value || !ln.value || y("save", w.value, $.value, v.files[w.value]);
		}
		function mn(e) {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), pn());
		}
		function hn(e, t) {
			I.value || (e.key === "Enter" || e.key === " ") && (e.preventDefault(), Z(t));
		}
		function gn(e, t) {
			if (/^(https?:|mailto:|#)/.test(t)) return null;
			let n = t.split("#")[0].trim();
			if (!n.endsWith(".md")) return null;
			let r = n.startsWith("/") ? n.split("/") : [...e.split("/").slice(0, -1), ...n.split("/")], i = [];
			for (let e of r) e === "" || e === "." || (e === ".." ? i.pop() : i.push(e));
			return i.join("/");
		}
		function _n(e) {
			if (!w.value) return;
			let t = gn(w.value, e);
			t && Z(t);
		}
		function vn(e) {
			if (!w.value) return;
			let t = v.files[w.value];
			if (t === void 0) return;
			let n = le(t, e.source, e.id, e.x, e.y);
			n !== t && y("save", w.value, n, t);
		}
		if (typeof window < "u" && window.location.hash.length > 1) {
			let e = decodeURIComponent(window.location.hash.slice(1));
			v.files[e] && (w.value = e);
		}
		return (t, s) => (d(), i("div", Ee, [a("header", De, [
			s[8] ||= a("span", { class: "pd-graph-brand" }, "📚 ProDoc", -1),
			w.value ? (d(), i("span", Oe, m(rn.value), 1)) : r("", !0),
			a("div", ke, [
				w.value ? r("", !0) : (d(), i(e, { key: 0 }, [I.value ? (d(), i(e, { key: 1 }, [a("button", {
					class: "pd-back-btn",
					disabled: !x.value || z.value,
					onClick: lt
				}, "💾 保存", 8, Ae), x.value ? (d(), i("button", {
					key: 0,
					class: "pd-back-btn",
					disabled: z.value,
					onClick: ut
				}, "↩ 放弃更改", 8, je)) : (d(), i("button", {
					key: 1,
					class: "pd-back-btn pd-back-btn--active",
					onClick: dt
				}, "✓ 完成"))], 64)) : (d(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: dt
				}, "🛠 编辑图")), a("button", {
					class: "pd-back-btn",
					onClick: it
				}, m(N.value ? "↩ 恢复坐标" : "🧭 分层重排"), 1)], 64)),
				w.value ? (d(), i(e, { key: 1 }, [Q.value ? (d(), i(e, { key: 1 }, [a("button", {
					class: "pd-back-btn",
					disabled: !ln.value,
					onClick: pn
				}, "💾 保存", 8, Me), a("button", {
					class: "pd-back-btn",
					onClick: fn
				}, "👁 预览")], 64)) : (d(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: un
				}, "✏️ 编辑")), a("button", {
					class: "pd-back-btn",
					onClick: cn
				}, "🗺 返回图")], 64)) : r("", !0),
				o(h(ae), { size: "small" })
			])
		]), a("div", Ne, [w.value ? (d(), i("div", {
			key: 1,
			class: l(["pd-doc-view", { "pd-doc-view--editing": Q.value }])
		}, [Q.value ? (d(), n(h(se), {
			key: w.value,
			value: $.value,
			class: "pd-doc-editor",
			onChange: s[7] ||= (e) => $.value = e,
			onKeydown: mn
		}, null, 8, ["value"])) : (d(), n(h(ce), {
			key: w.value,
			content: fe.value[w.value],
			"show-toc": !0,
			"flow-editable": !0,
			onDocLink: _n,
			onFlowNodeMove: vn
		}, null, 8, ["content"]))], 2)) : (d(), n(h(ie), {
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
			default: ne(() => [a("div", {
				ref_key: "stageEl",
				ref: ft,
				class: l(["pd-graph-stage", {
					"pd-graph-stage--dragging": V.value?.moved || W.value || J.value || Y.value?.moved || X.value?.moved,
					"pd-graph-stage--editing": I.value
				}]),
				style: u({
					width: `${E.value.w}px`,
					height: `${E.value.h}px`
				}),
				onClick: s[6] ||= (e) => G.value = null
			}, [
				(d(!0), i(e, null, p(F.value, (e) => (d(), i("div", {
					key: "group-" + e.name,
					class: l(["pd-doc-group", { "pd-dim": rt(e) }]),
					style: u({
						left: `${e.x}px`,
						top: `${e.y}px`,
						width: `${e.w}px`,
						height: `${e.h}px`
					})
				}, [a("span", {
					class: "pd-doc-group__label",
					title: I.value ? `拖动移动整组「${e.name}」` : e.name,
					"data-nm-no-pan": "",
					onPointerdown: (t) => Jt(t, e)
				}, m(e.name), 41, Pe), I.value ? (d(), i("button", {
					key: 0,
					type: "button",
					class: "pd-doc-group__resize",
					"aria-label": `调整组「${e.name}」的区域尺寸`,
					title: "拖动调整区域尺寸",
					"data-nm-no-pan": "",
					onPointerdown: _((t) => Qt(t, e), ["stop"])
				}, null, 40, Fe)) : r("", !0)], 6))), 128)),
				k.value.length || Mt.value ? (d(), i("svg", {
					key: 0,
					class: "pd-relation-layer",
					width: E.value.w,
					height: E.value.h,
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
					(d(!0), i(e, null, p(k.value, (e) => (d(), i("g", {
						key: e.id,
						class: l(["pd-relation", {
							"pd-dim": Ce(e),
							"pd-hot": Se(e),
							"pd-selected": e.id === G.value
						}])
					}, [
						a("title", null, m(e.fromTitle) + " → " + m(e.toTitle) + m(e.label ? `（${e.label}）` : ""), 1),
						a("path", {
							class: "pd-relation-hit",
							d: e.d,
							fill: "none",
							onClick: _((t) => Nt(e), ["stop"]),
							onDblclick: _((t) => Ft(e), ["stop"])
						}, null, 40, Le),
						a("path", {
							d: e.d,
							fill: "none",
							"marker-end": "url(#pd-relation-arrow)",
							"pointer-events": "none"
						}, null, 8, Re),
						e.label ? (d(), i("text", {
							key: 0,
							x: e.labelX,
							y: e.labelY,
							"pointer-events": "none"
						}, m(e.label), 9, ze)) : r("", !0)
					], 2))), 128)),
					Mt.value ? (d(), i("path", {
						key: 0,
						class: "pd-relation-draft",
						d: Mt.value,
						fill: "none"
					}, null, 8, Be)) : r("", !0),
					(d(!0), i(e, null, p(H.value, (e, t) => (d(), i("line", {
						key: "guide" + t,
						class: "pd-guide",
						x1: e.axis === "x" ? e.pos : e.start,
						y1: e.axis === "x" ? e.start : e.pos,
						x2: e.axis === "x" ? e.pos : e.end,
						y2: e.axis === "x" ? e.end : e.pos
					}, null, 8, Ve))), 128)),
					I.value && K.value ? (d(), i("g", He, [a("circle", {
						class: "pd-edge-handle",
						cx: K.value.x1,
						cy: K.value.y1,
						r: "6",
						onPointerdown: s[0] ||= _((e) => zt(e, K.value, "from"), ["stop"])
					}, [...s[9] ||= [a("title", null, "拖动调整源框连接边", -1)]], 40, Ue), a("circle", {
						class: "pd-edge-handle",
						cx: K.value.x2,
						cy: K.value.y2,
						r: "6",
						onPointerdown: s[1] ||= _((e) => zt(e, K.value, "to"), ["stop"])
					}, [...s[10] ||= [a("title", null, "拖动调整目标框连接边", -1)]], 40, We)])) : r("", !0)
				], 8, Ie)) : r("", !0),
				I.value && K.value && !q.value ? (d(), i("button", {
					key: 1,
					type: "button",
					class: "pd-edge-delete",
					style: u({
						left: `${K.value.labelX}px`,
						top: `${K.value.labelY}px`
					}),
					"aria-label": `删除连线 ${K.value.fromTitle} → ${K.value.toTitle}`,
					title: "删除连线（Delete）",
					onClick: _(qt, ["stop"])
				}, "✕", 12, Ge)) : r("", !0),
				I.value && K.value && q.value && q.value.edgeId === K.value.id ? re((d(), i("input", {
					key: 2,
					ref_key: "labelInputEl",
					ref: Pt,
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
					onKeydown: [g(_(It, ["prevent"]), ["enter"]), g(_(Lt, ["prevent"]), ["esc"])],
					onBlur: It,
					onClick: s[3] ||= _(() => {}, ["stop"])
				}, null, 44, Ke)), [[ee, q.value.value]]) : r("", !0),
				(d(!0), i(e, null, p(P.value, (t) => (d(), i("div", {
					key: t.id,
					class: l(["pd-doc-box", [`pd-doc-box--d${Math.min(t.depth, 3)}`, { "pd-dim": xe(t.id) }]]),
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
					onPointerdown: (e) => yt(e, t),
					onClick: (e) => wt(t.docPath),
					onKeydown: (e) => hn(e, t.docPath),
					onMouseenter: (e) => M(t.id),
					onMouseleave: s[5] ||= (e) => M(null)
				}, [
					a("div", Je, [a("span", Ye, m(t.title), 1), s[12] ||= a("span", {
						class: "pd-doc-box__icon",
						"aria-hidden": "true"
					}, "↗", -1)]),
					I.value ? r("", !0) : (d(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-box__edit",
						"aria-label": `编辑 ${t.title}`,
						title: "编辑文档",
						onClick: _((e) => dn(t.docPath), ["stop"]),
						onKeydown: [g(_((e) => dn(t.docPath), ["stop"]), ["enter"]), g(_((e) => dn(t.docPath), ["stop"]), ["space"])]
					}, "✏️", 40, Xe)),
					I.value ? (d(), i("button", {
						key: 1,
						type: "button",
						class: "pd-doc-box__link-handle",
						"aria-label": `从 ${t.title} 创建连线（拖到目标框）`,
						title: "拖到其他框创建连线",
						onPointerdown: _((e) => Tt(e, t), ["stop"]),
						onClick: s[4] ||= _(() => {}, ["stop"])
					}, null, 40, Ze)) : r("", !0),
					t.blocks.length && !I.value ? (d(), i("div", {
						key: 2,
						class: l(["pd-doc-blocks-pop", { "pd-doc-blocks-pop--above": ct(t, E.value.h) }])
					}, [a("div", Qe, [(d(!0), i(e, null, p(at(t), (e) => (d(), i("button", {
						key: e.anchor,
						type: "button",
						class: "pd-doc-blocks-pop__item",
						title: e.title,
						"aria-label": `跳转到「${e.title}」分块`,
						onClick: _((n) => sn(t.docPath, e.anchor), ["stop"]),
						onKeydown: [g(_((n) => sn(t.docPath, e.anchor), ["stop"]), ["enter"]), g(_((n) => sn(t.docPath, e.anchor), ["stop"]), ["space"])]
					}, "▸ " + m(e.title), 41, $e))), 128)), ot(t) > 0 ? (d(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more",
						"aria-label": `查看全部 ${t.blocks.length} 个分块`,
						onClick: _((e) => Z(t.docPath), ["stop"])
					}, "+" + m(ot(t)) + " 更多分块…", 9, et)) : r("", !0)])], 2)) : r("", !0)
				], 46, qe))), 128))
			], 6)]),
			_: 1
		}, 512))])]));
	}
});
//#endregion
export { oe as DocFlowCanvas, nt as DocGraphViewer, v as DocViewer, y as MarkdownRenderer };

//# sourceMappingURL=index.js.map