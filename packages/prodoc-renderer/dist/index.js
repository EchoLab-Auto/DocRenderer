import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createTextVNode as o, createVNode as s, defineComponent as c, nextTick as l, normalizeClass as u, normalizeStyle as d, onBeforeUnmount as f, onMounted as p, openBlock as m, ref as h, renderList as g, toDisplayString as _, unref as v, vModelText as ee, watch as te, withCtx as ne, withDirectives as re, withKeys as ie, withModifiers as y } from "vue";
import { NeumorphismBadge as ae, NeumorphismCanvas as oe, NeumorphismModal as se, NeumorphismPopover as ce, NeumorphismThemeToggle as le, NeumorphismToastProvider as ue, useTouchDevice as de } from "@echolab-auto/ui-frame";
import { DocFlowCanvas as fe, DocViewer as b, MarkdownEditor as pe, MarkdownRenderer as me, MarkdownRenderer as he, writeFlowNodePosition as ge } from "@echolab-auto/ui-frame/doc";
import "@echolab-auto/ui-frame/dist/style.css";
//#region ../prodoc-core/dist/graph-Ca_M4mBM.js
function _e(e) {
	let t = [], n = "", r = null;
	for (let i of e) r ? (n += i, i === r && (r = null)) : i === "\"" || i === "'" ? (r = i, n += i) : i === "," ? (t.push(n), n = "") : n += i;
	return t.push(n), t;
}
function x(e) {
	let t = e.trim();
	if (t === "") return "";
	if (t.startsWith("[") && t.endsWith("]")) return _e(t.slice(1, -1)).map((e) => x(e)).filter((e) => e !== "");
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
		if (r.trim() === "" && a < o.length && o[a].trimStart().startsWith("[") && (r = o[a], a += 1), r.trimStart().startsWith("[") && !/\]\s*$/.test(r)) {
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
function ve(e) {
	return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).filter((e) => typeof e == "string").map((e) => e.trim()).filter(Boolean);
}
function ye(e) {
	return ve(S(e).params.link);
}
function be(e) {
	return e === "" || e !== e.trim() || /[|,"]/.test(e) ? e.includes("\"") ? `'${e}'` : `"${e}"` : e;
}
function xe(e, t, n) {
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!S(e).hasFrame) return n === null ? e : `---${r}${n}${r}---${r}${e}`;
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
function Se(e, t) {
	return xe(e, "link", t.length > 0 ? `link: [${t.map(be).join(", ")}]` : null);
}
function Ce(e, t) {
	return xe(e, "group", t === null ? null : `group: ${be(t)}`);
}
function we(e, t) {
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
var C = 72, w = 48, T = /* @__PURE__ */ new Set([
	"id",
	"title",
	"x",
	"y",
	"w",
	"h",
	"link",
	"group"
]);
function E(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
var D = {
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
function Te(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(k);
		t ? (t[1] !== "_" && (n.fromSide = D[t[1]]), t[2] !== "_" && (n.toSide = D[t[2]])) : e !== "" && (n.label = e);
	}
	return n;
}
function Ee(e) {
	let t = e.ref;
	if (e.label && (t += ` | ${e.label}`), e.fromSide || e.toSide) {
		let n = e.fromSide ? O[e.fromSide] : "_", r = e.toSide ? O[e.toSide] : "_";
		t += ` | ${n}>${r}`;
	}
	return t;
}
var De = /^(.*)\s*@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
function A(e) {
	let t = e.match(De);
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
function Oe(e) {
	let { name: t, x: n, y: r, w: i, h: a } = e;
	return [
		n,
		r,
		i,
		a
	].every((e) => typeof e == "number" && Number.isFinite(e)) ? `${t} @ ${n}, ${r}, ${i}, ${a}` : t;
}
function ke(e, t) {
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
function Ae(e) {
	let t = e.match(/^#[ \t]+(.+)$/m);
	return t ? t[1].trim() : void 0;
}
function je(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
}
function Me(e) {
	return e.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_~]/g, "").replace(/<[^>]+>/g, "").trim();
}
function Ne(e) {
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
			let e = Me(i[1]);
			e && t.push({
				anchor: je(e),
				title: e
			});
		}
	}
	return t.length >= 2 ? t : [];
}
function Pe(e, t) {
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
function Fe(e, t, n, r) {
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
			m === a && (u += f + C, f = 0, p = w, m = 0);
			let t = r.get(e.id);
			t.rawX === void 0 && (e.x = p), t.rawY === void 0 && (e.y = u), s.set(e.id, o(e)), p += e.w + 64, f = Math.max(f, e.h), m++;
		}
		d = u + f + C;
	}
}
function Ie(e, t) {
	let n = e.map((e) => ({
		...e,
		x: 0,
		y: 0
	}));
	return Fe(n, t, Pe(n, t), new Map(n.map((e) => [e.id, {}]))), new Map(n.map((e) => [e.id, {
		x: e.x,
		y: e.y
	}]));
}
function Le(e) {
	let t = Object.keys(e).sort(), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let o of t) {
		let { params: t, body: s } = S(e[o]), c = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : o.replace(/\.md$/, ""), l = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || Ae(s) || c, u = Ne(s), d = E(t.w) ?? 220, f = E(t.h) ?? 96, p = {};
		for (let [e, n] of Object.entries(t)) T.has(e) || (p[e] = n);
		let m = {
			id: c,
			title: l,
			docPath: o,
			depth: 0,
			blocks: u,
			x: E(t.x) ?? 0,
			y: E(t.y) ?? 0,
			w: d,
			h: f,
			attrs: p
		};
		if (i.set(c, {
			rawX: E(t.x),
			rawY: E(t.y)
		}), t.group !== void 0) {
			let e = (Array.isArray(t.group) ? t.group : [t.group]).map((e) => typeof e == "string" ? e : typeof e == "number" ? String(e) : "").filter((e) => e.trim() !== "");
			if (e.length > 1 && n.push(`文档 "${c}" 声明了多个 group，仅取第一个 "${A(e[0]).name || e[0]}"`), e.length > 0) {
				let { name: t, geo: n } = A(e[0]);
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
		for (let e of ve(n.link)) {
			let { ref: n, label: r, fromSide: i, toSide: a } = Te(e);
			n && d(t.id, n, {
				label: r,
				fromSide: i,
				toSide: a
			}, t.id + ".link");
		}
	}
	let f = Pe(o, c);
	for (let e of o) e.depth = f.get(e.id) ?? 0;
	Fe(o, c, f, i);
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
			...ke(t.members, t.geo),
			explicit: t.geo !== void 0,
			holder: t.holder ?? t.members[0].docPath
		})),
		warnings: n
	};
}
//#endregion
//#region src/components/DocGraphViewer.vue?vue&type=script&setup=true&lang.ts
var Re = { class: "pd-graph-viewer" }, ze = { class: "pd-graph-header" }, Be = {
	key: 0,
	class: "pd-graph-current"
}, Ve = { class: "pd-graph-actions" }, He = ["disabled"], Ue = ["disabled"], We = ["disabled"], Ge = ["disabled"], Ke = ["disabled"], qe = { class: "pd-warn-trigger" }, Je = { class: "pd-warn-list" }, Ye = { class: "pd-graph-main" }, Xe = ["title", "onPointerdown"], Ze = ["aria-label", "onPointerdown"], Qe = ["width", "height"], $e = [
	"d",
	"onClick",
	"onDblclick"
], et = ["d"], tt = ["x", "y"], nt = ["d"], rt = [
	"x1",
	"y1",
	"x2",
	"y2"
], it = [
	"aria-label",
	"onPointerdown",
	"onClick",
	"onKeydown",
	"onMouseenter"
], at = { class: "pd-doc-box__head" }, ot = ["title"], st = [
	"aria-label",
	"onClick",
	"onKeydown"
], ct = [
	"aria-label",
	"title",
	"onClick"
], lt = ["aria-label", "onPointerdown"], ut = {
	class: "pd-doc-blocks-pop__card",
	role: "menu"
}, dt = [
	"title",
	"aria-label",
	"onClick",
	"onKeydown"
], ft = ["aria-label", "onClick"], pt = ["aria-label"], mt = ["aria-label", "onKeydown"], ht = ["width", "height"], gt = { class: "pd-edge-handle-grp" }, _t = ["cx", "cy"], vt = ["cx", "cy"], yt = { class: "pd-edge-handle-grp" }, bt = ["cx", "cy"], xt = ["cx", "cy"], St = {
	key: 2,
	class: "pd-edit-toolbar",
	role: "toolbar",
	"aria-label": "图编辑工具栏"
}, Ct = 30, wt = /* @__PURE__ */ c({
	__name: "DocGraphViewer",
	props: {
		files: {},
		saveHandler: { type: Function },
		deleteHandler: { type: Function }
	},
	emits: ["navigate", "save"],
	setup(c, { emit: fe }) {
		let b = c, me = fe, _e = h(null);
		function x(e, t = "info", n = 4e3) {
			_e.value?.addToast({
				message: e,
				type: t,
				duration: n
			});
		}
		async function ve(e, t, n) {
			if (b.saveHandler) {
				let r = await b.saveHandler(e, t, n);
				return typeof r == "object" ? r : { ok: r };
			}
			return me("save", e, t, n), { ok: !0 };
		}
		async function be(e, t) {
			if (!b.deleteHandler) return {
				ok: !1,
				error: "当前环境不支持删除文档"
			};
			let n = await b.deleteHandler(e, t);
			return typeof n == "object" ? n : { ok: n };
		}
		function xe(e, t, n) {
			n.status === 409 ? x(`「${t}」${e === "保存" ? "与磁盘上的外部修改改到了同一区域，无法自动合并" : "在磁盘上已被其他程序修改"}，${e}被拒绝。该文件的暂存已保留，可刷新页面同步后重试（或「↩ 放弃更改」丢弃）。`, "error", 8e3) : x(`「${t}」${e}失败：${n.error ?? "未知错误"}`, "error", 6e3);
		}
		let C = h(/* @__PURE__ */ new Map()), w = h(/* @__PURE__ */ new Set()), T = /* @__PURE__ */ new Map(), E = t(() => C.value.size > 0 || w.value.size > 0), D = h([]), O = h([]);
		function k() {
			return {
				drafts: [...C.value],
				newPaths: [...z],
				deletes: [...w.value],
				overrides: P.value ? [...P.value] : null,
				bases: [...T]
			};
		}
		function De(e, t) {
			if (e.deletes.length !== t.deletes.length || e.newPaths.length !== t.newPaths.length || e.drafts.length !== t.drafts.length || (e.overrides?.length ?? 0) !== (t.overrides?.length ?? 0)) return !1;
			let n = new Map(e.drafts);
			if (!t.drafts.every(([e, t]) => n.get(e) === t) || !e.deletes.every((e) => t.deletes.includes(e)) || !e.newPaths.every((e) => t.newPaths.includes(e))) return !1;
			let r = new Map(e.overrides ?? []);
			return (t.overrides ?? []).every(([e, t]) => r.get(e)?.x === t.x && r.get(e)?.y === t.y);
		}
		function A(e) {
			De(e, k()) || (D.value = [...D.value, e], O.value = []);
		}
		function Ae(e) {
			C.value = new Map(e.drafts), z = new Set(e.newPaths), w.value = new Set(e.deletes), P.value = e.overrides ? new Map(e.overrides) : null, T.clear();
			for (let [t, n] of e.bases) T.set(t, n);
		}
		function Me() {
			let e = D.value[D.value.length - 1];
			e && (D.value = D.value.slice(0, -1), O.value = [...O.value, k()], Ae(e));
		}
		function Ne() {
			let e = O.value[O.value.length - 1];
			e && (O.value = O.value.slice(0, -1), D.value = [...D.value, k()], Ae(e));
		}
		let Pe = `prodoc-drafts:${typeof location < "u" ? location.origin : ""}`;
		function Fe() {
			try {
				if (!E.value) {
					localStorage.removeItem(Pe);
					return;
				}
				localStorage.setItem(Pe, JSON.stringify({
					v: 1,
					drafts: [...C.value].map(([e, t]) => ({
						path: e,
						base: T.get(e) ?? b.files[e] ?? null,
						content: t
					})),
					deletes: [...w.value].map((e) => ({
						path: e,
						base: b.files[e] ?? null
					}))
				}));
			} catch {}
		}
		function wt() {
			let e = null;
			try {
				e = localStorage.getItem(Pe), localStorage.removeItem(Pe);
			} catch {
				return 0;
			}
			if (!e) return 0;
			try {
				let t = JSON.parse(e), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
				for (let e of t.drafts ?? []) {
					let t = b.files[e.path];
					t !== e.content && (e.base !== null && t !== e.base || e.base === null && t !== void 0 || (n.set(e.path, e.content), T.set(e.path, e.base), t === void 0 && z.add(e.path)));
				}
				for (let e of t.deletes ?? []) {
					let t = b.files[e.path];
					t !== void 0 && (e.base !== null && t !== e.base || r.add(e.path));
				}
				let i = n.size + r.size;
				return i > 0 && (C.value = n, w.value = r), i;
			} catch {
				return 0;
			}
		}
		te([C, w], Fe);
		let Tt = t(() => C.value.size ? {
			...b.files,
			...Object.fromEntries(C.value)
		} : b.files), j = t(() => Le(Tt.value)), Et = t(() => Object.fromEntries(Object.entries(b.files).map(([e, t]) => [e, S(t).body])));
		te(() => j.value.warnings, (e) => e.forEach((e) => console.warn("[ProDoc]", e)), { immediate: !0 });
		let M = h(null), Dt = h(null), Ot = t(() => {
			let e = 0, t = 0;
			for (let n of F.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			for (let n of I.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			return {
				w: Math.max(e, 640),
				h: Math.max(t, 480)
			};
		}), kt = t(() => {
			let e = Infinity, t = Infinity, n = -Infinity, r = -Infinity;
			for (let i of F.value) e = Math.min(e, i.x), t = Math.min(t, i.y), n = Math.max(n, i.x + i.w), r = Math.max(r, i.y + i.h);
			for (let i of I.value) e = Math.min(e, i.x), t = Math.min(t, i.y), n = Math.max(n, i.x + i.w), r = Math.max(r, i.y + i.h);
			return Number.isFinite(e) ? {
				x: e - 48,
				y: t - 48,
				w: n - e + 96,
				h: r - t + 96
			} : {
				x: 0,
				y: 0,
				w: 640,
				h: 480
			};
		});
		function At(e, t) {
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
		function jt(e, t) {
			let n = e.x + e.w / 2, r = e.y + e.h / 2, i = t.x + t.w / 2 - n, a = t.y + t.h / 2 - r;
			return Math.abs(a) >= Math.abs(i) ? {
				fs: a >= 0 ? "bottom" : "top",
				ts: a >= 0 ? "top" : "bottom"
			} : {
				fs: i >= 0 ? "right" : "left",
				ts: i >= 0 ? "left" : "right"
			};
		}
		function Mt(e, t, n, r) {
			let i = jt(e, t), a = At(e, n ?? i.fs), o = At(t, r ?? i.ts), s = Math.hypot(o.x - a.x, o.y - a.y), c = Math.max(24, Math.min(s * .45, 96)), l = `M ${a.x} ${a.y} C ${a.x + a.nx * c} ${a.y + a.ny * c}, ${o.x + o.nx * c} ${o.y + o.ny * c}, ${o.x} ${o.y}`;
			return {
				x1: a.x,
				y1: a.y,
				x2: o.x,
				y2: o.y,
				d: l
			};
		}
		let Nt = t(() => {
			let e = new Map(F.value.map((e) => [e.id, e])), t = Y.value;
			return j.value.relations.flatMap((n) => {
				let r = e.get(n.from), i = e.get(n.to);
				if (!r || !i) return [];
				let a = n.fromSide, o = n.toSide;
				t && t.edgeId === n.id && (t.which === "from" ? a = t.side : o = t.side);
				let { x1: s, y1: c, x2: l, y2: u, d } = Mt(r, i, a, o), f = (s + l) / 2, p = (c + u) / 2 - 7, m = l - s, h = u - c, g = Math.hypot(m, h) || 1;
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
					labelX: f,
					labelY: p,
					delX: f + -h / g * 18,
					delY: p + 7 + m / g * 18
				}];
			});
		}), N = h(null);
		function Pt(e) {
			U.value || G.value || Y.value || (N.value = e);
		}
		let Ft = t(() => {
			if (!N.value) return /* @__PURE__ */ new Set();
			let e = /* @__PURE__ */ new Set([N.value]);
			for (let t of j.value.relations) t.from === N.value && e.add(t.to), t.to === N.value && e.add(t.from);
			return e;
		}), It = (e) => N.value !== null && !Ft.value.has(e), Lt = (e) => N.value !== null && (e.fromId === N.value || e.toId === N.value), Rt = (e) => N.value !== null && !Lt(e), P = h(null), F = t(() => j.value.boxes.map((e) => {
			let t = P.value?.get(e.id);
			return t ? {
				...e,
				x: t.x,
				y: t.y
			} : e;
		}));
		function zt(e, t) {
			let n = new Map(P.value ?? []);
			n.set(e, t), P.value = n;
		}
		let I = t(() => {
			let e = X.value, t = Z.value;
			return j.value.groups.map((n) => {
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
					...ke(r)
				};
			});
		}), Bt = (e) => N.value !== null && !e.members.some((e) => Ft.value.has(e));
		function Vt() {
			if (P.value) {
				P.value = null;
				return;
			}
			let e = Ie(j.value.boxes, j.value.relations);
			if (L.value) for (let t of C.value.keys()) {
				let n = j.value.boxes.find((e) => e.docPath === t);
				n && e.delete(n.id);
			}
			P.value = e;
		}
		let Ht = (e) => e.blocks.slice(0, 6), Ut = (e) => Math.max(0, e.blocks.length - 6), Wt = (e) => (Ht(e).length + +(Ut(e) > 0)) * Ct + 12, Gt = (e) => e.y + e.h + 6 + Wt(e) > kt.value.y + kt.value.h, L = h(!1), R = h("select"), z = /* @__PURE__ */ new Set(), Kt = h({
			title: "",
			message: "",
			action: null
		}), qt = h(!1);
		function Jt(e, t, n) {
			Kt.value = {
				title: e,
				message: t,
				action: n
			}, qt.value = !0;
		}
		function Yt() {
			qt.value = !1, Kt.value.action?.();
		}
		function B(e) {
			return C.value.get(e) ?? b.files[e];
		}
		function V(e, t) {
			let n = new Map(C.value);
			t === b.files[e] ? (n.delete(e), z.delete(e), T.delete(e)) : (n.has(e) || T.set(e, b.files[e] ?? null), n.set(e, t), e in b.files || z.add(e)), C.value = n;
		}
		let Xt = h(!1);
		async function Zt() {
			if (!E.value || Xt.value) return;
			Xt.value = !0;
			let e = [], t = [], n = 0;
			for (let [t, r] of C.value) {
				let i = await ve(t, r, (T.has(t) ? T.get(t) : b.files[t] ?? null) ?? void 0);
				i.ok ? i.merged && n++ : (e.push(t), xe("保存", t, i));
			}
			for (let e of w.value) {
				let n = await be(e, b.files[e]);
				n.ok || (t.push(e), xe("删除", e, n));
			}
			if (e.length > 0 || t.length > 0) {
				let n = new Map(C.value);
				for (let t of n.keys()) e.includes(t) || (n.delete(t), z.delete(t), T.delete(t));
				C.value = n, w.value = new Set([...w.value].filter((e) => t.includes(e)));
			} else C.value = /* @__PURE__ */ new Map(), w.value = /* @__PURE__ */ new Set(), z.clear(), T.clear(), D.value = [], O.value = [], x(n > 0 ? `图修改已保存（${n} 个文件已自动合并磁盘上的外部修改）` : "图修改已保存", "success", 3e3);
			Xt.value = !1;
		}
		function Qt() {
			if (!E.value) return;
			let e = new Set([...C.value.keys()].map((e) => j.value.boxes.find((t) => t.docPath === e)?.id).filter((e) => !!e));
			if (C.value = /* @__PURE__ */ new Map(), w.value = /* @__PURE__ */ new Set(), P.value) {
				let t = new Map(P.value);
				e.forEach((e) => t.delete(e)), P.value = t.size > 0 ? t : null;
			}
			K.value = null, R.value = "select", z.clear(), T.clear(), D.value = [], O.value = [], L.value = !1;
		}
		function $t() {
			if (L.value) {
				if (E.value) return;
				K.value = null, R.value = "select", D.value = [], O.value = [], L.value = !1;
			} else L.value = !0;
		}
		let en = h(null);
		function H(e, t) {
			let n = Dt.value?.toCanvasCoords?.(e, t);
			return n ? {
				x: n.x,
				y: n.y,
				scale: n.zoom
			} : {
				x: 0,
				y: 0,
				scale: 1
			};
		}
		let U = h(null);
		function tn(e, t, n) {
			let r = Dt.value?.getViewportRect?.();
			if (!r) return {
				px: 0,
				py: 0
			};
			let i = (e) => Math.max(0, Math.min(1, (40 - e) / 40)), a = 0, o = 0;
			return e < r.left + 40 ? a = -14 * i(e - r.left) : e > r.right - 40 && (a = 14 * i(r.right - e)), t < r.top + 40 ? o = -14 * i(t - r.top) : t > r.bottom - 40 && (o = 14 * i(r.bottom - t)), (a || o) && Dt.value?.panBy?.(-a, -o), {
				px: a / n,
				py: o / n
			};
		}
		let W = h([]), nn = {
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
		}, rn = {
			x: ["end"],
			y: ["end"]
		};
		function an(e, t) {
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
		function on(e, t, n, r) {
			let i = Math.min(Math.max(8 / n, 4), 12), a = {};
			for (let n of ["x", "y"]) {
				let o = an(e, n), s = r[n].map((e) => o[e]), c = null;
				for (let e of t) for (let t of Object.values(an(e, n))) for (let e of s) {
					let n = t - e;
					Math.abs(n) <= i && (c === null || Math.abs(n) < Math.abs(c)) && (c = n);
				}
				c !== null && (a[n === "x" ? "dx" : "dy"] = c);
			}
			return a;
		}
		function sn(e, t, n) {
			let r = [], i = /* @__PURE__ */ new Set();
			for (let a of ["x", "y"]) {
				let o = an(e, a), s = n[a].map((e) => o[e]);
				for (let n of t) for (let t of Object.values(an(n, a))) {
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
		function cn(e, t, n, r) {
			let i = F.value.find((t) => t.id === e);
			if (!i) return {
				x: Math.round(t),
				y: Math.round(n),
				guides: []
			};
			let a = F.value.filter((t) => t.id !== e), o = on({
				x: t,
				y: n,
				w: i.w,
				h: i.h
			}, a, r, nn), s = Math.round(t + (o.dx ?? 0)), c = Math.round(n + (o.dy ?? 0));
			return {
				x: s,
				y: c,
				guides: o.dx !== void 0 || o.dy !== void 0 ? sn({
					x: s,
					y: c,
					w: i.w,
					h: i.h
				}, a, nn) : []
			};
		}
		let ln = !1;
		function un(e, t) {
			if (L.value && e.button === 0 && !e.target.closest("button")) {
				if (R.value === "link") {
					xn(e, t);
					return;
				}
				R.value !== "node" && (U.value = {
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
					raf: 0,
					panX: 0,
					panY: 0,
					before: k()
				}, window.addEventListener("pointermove", dn), window.addEventListener("pointerup", mn), window.addEventListener("pointercancel", mn), N.value = null);
			}
		}
		function dn(e) {
			let t = U.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(fn));
		}
		function fn() {
			let e = U.value;
			if (!e) return;
			e.raf = 0;
			let t = tn(e.lastClientX, e.lastClientY, e.scale);
			e.panX += t.px, e.panY += t.py;
			let n = (e.lastClientX - e.startClientX) / e.scale + e.panX, r = (e.lastClientY - e.startClientY) / e.scale + e.panY;
			if (!e.moved && Math.hypot(n, r) < 3) return;
			e.moved = !0;
			let i = cn(e.id, e.baseX + n, e.baseY + r, e.scale);
			zt(e.id, {
				x: i.x,
				y: i.y
			}), W.value = i.guides;
		}
		function pn() {
			let e = U.value;
			if (U.value = null, W.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			ln = !0;
			let t = P.value?.get(e.id);
			if (!t) return;
			let n = B(e.path);
			n !== void 0 && (V(e.path, we(n, t)), A(e.before));
		}
		function mn() {
			window.removeEventListener("pointermove", dn), window.removeEventListener("pointerup", mn), window.removeEventListener("pointercancel", mn), pn();
		}
		let { isTouch: hn } = de(), gn = h(null);
		function _n(e) {
			if (ln) {
				ln = !1;
				return;
			}
			if (!L.value) {
				if (hn.value && e.blocks.length > 0 && gn.value !== e.id) {
					gn.value = e.id;
					return;
				}
				gn.value = null, ur(e.docPath);
			}
		}
		let G = h(null), vn = h(null), yn = null;
		function bn(e, t) {
			let n = t.x - (e.x + e.w / 2), r = t.y - (e.y + e.h / 2);
			return Math.abs(n) * e.h > Math.abs(r) * e.w ? n >= 0 ? "right" : "left" : r >= 0 ? "bottom" : "top";
		}
		function xn(e, t, n) {
			if (!L.value || e.button !== 0) return;
			e.preventDefault();
			let r = H(e.clientX, e.clientY);
			G.value = {
				fromId: t.id,
				fromSide: n ?? bn(t, r),
				targetId: null,
				x: r.x,
				y: r.y,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0,
				before: k()
			}, window.addEventListener("pointermove", Cn), window.addEventListener("pointerup", Dn), window.addEventListener("pointercancel", En), N.value = null;
		}
		function Sn(e, t, n) {
			xn(e, t, n);
		}
		function Cn(e) {
			let t = G.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(wn));
		}
		function wn() {
			let e = G.value;
			if (!e) return;
			e.raf = 0, tn(e.lastClientX, e.lastClientY, 1);
			let t = H(e.lastClientX, e.lastClientY), n = F.value.find((e) => t.x >= e.x && t.x <= e.x + e.w && t.y >= e.y && t.y <= e.y + e.h);
			G.value = {
				...e,
				x: t.x,
				y: t.y,
				targetId: n?.id ?? null
			};
		}
		function Tn() {
			window.removeEventListener("pointermove", Cn), window.removeEventListener("pointerup", Dn), window.removeEventListener("pointercancel", En);
		}
		function En() {
			Tn();
			let e = G.value;
			e?.raf && cancelAnimationFrame(e.raf), G.value = null;
		}
		function Dn(e) {
			Tn();
			let t = G.value;
			if (t?.raf && cancelAnimationFrame(t.raf), G.value = null, !t) return;
			let n = H(e.clientX, e.clientY), r = F.value.find((e) => n.x >= e.x && n.x <= e.x + e.w && n.y >= e.y && n.y <= e.y + e.h);
			!r || r.id === t.fromId || j.value.relations.some((e) => e.from === t.fromId && e.to === r.id) || On(t.fromId, r.id, t.fromSide, bn(r, n), t.before);
		}
		function On(e, t, n, r, i) {
			let a = j.value.boxes.find((t) => t.id === e);
			if (!a) return;
			let o = B(a.docPath);
			if (o === void 0) return;
			let s = Ee({
				ref: t,
				fromSide: n,
				toSide: r
			});
			V(a.docPath, Se(o, [...ye(o), s])), i && A(i), vn.value = `${e}->${t}`, yn && clearTimeout(yn), yn = setTimeout(() => {
				vn.value = null, yn = null;
			}, 700);
		}
		let kn = t(() => {
			let e = G.value;
			if (!e) return null;
			let t = F.value.find((t) => t.id === e.fromId);
			if (!t) return null;
			let n = e.targetId ? F.value.find((t) => t.id === e.targetId) : void 0;
			if (n && n.id !== e.fromId) {
				let r = bn(n, {
					x: e.x,
					y: e.y
				});
				return Mt(t, n, e.fromSide, r).d;
			}
			return Mt(t, {
				x: e.x,
				y: e.y,
				w: 0,
				h: 0
			}, e.fromSide).d;
		});
		function An(e) {
			let t = G.value;
			return !t || t.targetId !== e.id ? null : e.id === t.fromId || j.value.relations.some((n) => n.from === t.fromId && n.to === e.id) ? "invalid" : "valid";
		}
		p(() => {
			window.addEventListener("keydown", or), window.addEventListener("popstate", lr);
			let e = wt();
			e > 0 && (L.value = !0, l(() => x(`已恢复 ${e} 项上次未保存的图修改，可「💾 保存」或「↩ 放弃更改」`, "info", 6e3))), M.value || l(() => requestAnimationFrame(() => Dt.value?.fit?.()));
		}), f(() => {
			yn && clearTimeout(yn), window.removeEventListener("keydown", or), window.removeEventListener("popstate", lr);
		});
		let jn = null;
		function Mn(e) {
			!L.value || R.value !== "node" || e.button === 0 && e.target === en.value && (jn = {
				clientX: e.clientX,
				clientY: e.clientY
			}, window.addEventListener("pointerup", Nn));
		}
		function Nn(e) {
			window.removeEventListener("pointerup", Nn);
			let t = jn;
			if (jn = null, !t || Math.hypot(e.clientX - t.clientX, e.clientY - t.clientY) >= 3) return;
			let n = H(e.clientX, e.clientY);
			Pn(n.x, n.y);
		}
		function Pn(e, t) {
			let n = Math.round(e - 220 / 2), r = Math.round(t - 96 / 2), i = k(), a = /* @__PURE__ */ new Set([...Object.keys(b.files), ...C.value.keys()]), o = 1;
			for (; a.has(`untitled-${o}.md`);) o++;
			let s = `untitled-${o}.md`, c = `未命名文档 ${o}`;
			V(s, `---\ntitle: "${c}"\nx: ${n}\ny: ${r}\n---\n\n# ${c}\n`), A(i);
		}
		let K = h(null), q = t(() => Nt.value.find((e) => e.id === K.value) ?? null);
		function Fn(e) {
			L.value && (K.value = e.id);
		}
		let J = h(null), In = h(null);
		function Ln(e) {
			L.value && (K.value = e.id, J.value = {
				edgeId: e.id,
				value: e.label ?? ""
			}, l(() => {
				In.value?.focus(), In.value?.select();
			}));
		}
		function Rn() {
			let e = J.value;
			if (J.value = null, !e) return;
			let t = Nt.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.value.trim();
			if (n === (t.label ?? "")) return;
			let r = j.value.boxes.find((e) => e.id === t.fromId);
			if (!r) return;
			let i = B(r.docPath);
			if (i === void 0) return;
			let a = k(), o = ye(i).map((e) => {
				let r = Te(e);
				return Jn(r.ref) === t.toId ? Ee({
					ref: r.ref,
					label: n || void 0,
					fromSide: r.fromSide,
					toSide: r.toSide
				}) : e;
			});
			V(r.docPath, Se(i, o)), A(a);
		}
		function zn() {
			J.value = null;
		}
		let Y = h(null);
		function Bn(e, t, n) {
			let r = t - (e.x + e.w / 2), i = n - (e.y + e.h / 2);
			return Math.abs(r) / (e.w / 2) >= Math.abs(i) / (e.h / 2) ? r >= 0 ? "right" : "left" : i >= 0 ? "bottom" : "top";
		}
		function Vn(e, t, n) {
			if (e.button !== 0) return;
			e.preventDefault(), e.stopPropagation();
			let r = jt(F.value.find((e) => e.id === t.fromId), F.value.find((e) => e.id === t.toId));
			Y.value = {
				edgeId: t.id,
				which: n,
				side: (n === "from" ? t.fromSide : t.toSide) ?? (n === "from" ? r.fs : r.ts),
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0,
				before: k()
			}, window.addEventListener("pointermove", Hn), window.addEventListener("pointerup", Kn), window.addEventListener("pointercancel", Gn), N.value = null;
		}
		function Hn(e) {
			let t = Y.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Un));
		}
		function Un() {
			let e = Y.value;
			if (!e) return;
			e.raf = 0;
			let t = Nt.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = F.value.find((n) => n.id === (e.which === "from" ? t.fromId : t.toId));
			if (!n) return;
			let r = H(e.lastClientX, e.lastClientY), i = Bn(n, r.x, r.y);
			i !== e.side && (Y.value = {
				...e,
				side: i
			});
		}
		function Wn() {
			window.removeEventListener("pointermove", Hn), window.removeEventListener("pointerup", Kn), window.removeEventListener("pointercancel", Gn);
		}
		function Gn() {
			Wn();
			let e = Y.value;
			e?.raf && cancelAnimationFrame(e.raf), Y.value = null;
		}
		function Kn() {
			Wn();
			let e = Y.value;
			if (e?.raf && cancelAnimationFrame(e.raf), Y.value = null, !e) return;
			let t = Nt.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.which === "from" ? e.side : t.fromSide, r = e.which === "to" ? e.side : t.toSide;
			n === t.fromSide && r === t.toSide || (qn(t, n, r), A(e.before));
		}
		function qn(e, t, n) {
			let r = j.value.boxes.find((t) => t.id === e.fromId);
			if (!r) return;
			let i = B(r.docPath);
			if (i === void 0) return;
			let a = ye(i).map((r) => {
				let i = Te(r);
				return Jn(i.ref) === e.toId ? Ee({
					ref: i.ref,
					label: i.label,
					fromSide: t,
					toSide: n
				}) : r;
			});
			V(r.docPath, Se(i, a));
		}
		function Jn(e) {
			let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md", r = j.value.boxes;
			return (r.find((e) => e.id === t) ?? r.find((e) => e.docPath === t) ?? r.find((e) => e.docPath === n))?.id;
		}
		function Yn() {
			let e = q.value;
			if (!e) return;
			let t = j.value.boxes.find((t) => t.id === e.fromId);
			if (!t) return;
			let n = B(t.docPath);
			if (n === void 0) return;
			let r = k(), i = ye(n).filter((t) => Jn(Te(t).ref) !== e.toId);
			V(t.docPath, Se(n, i)), A(r), K.value = null;
		}
		let X = h(null), Z = h(null);
		function Xn(e, t) {
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
			X.value = {
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
				raf: 0,
				panX: 0,
				panY: 0,
				before: k()
			}, window.addEventListener("pointermove", Zn), window.addEventListener("pointerup", $n), window.addEventListener("pointercancel", $n), N.value = null;
		}
		function Zn(e) {
			let t = X.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Qn));
		}
		function Qn() {
			let e = X.value;
			if (!e) return;
			e.raf = 0;
			let t = tn(e.lastClientX, e.lastClientY, e.scale);
			e.panX += t.px, e.panY += t.py;
			let n = Math.round((e.lastClientX - e.startClientX) / e.scale + e.panX), r = Math.round((e.lastClientY - e.startClientY) / e.scale + e.panY);
			if (!e.moved && Math.hypot(n, r) < 3) return;
			let i = [...F.value.filter((t) => !e.basePositions.has(t.id)), ...I.value.filter((t) => t.name !== e.name)], a = on({
				x: e.baseRegion.x + n,
				y: e.baseRegion.y + r,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, i, e.scale, nn), o = n + (a.dx ?? 0), s = r + (a.dy ?? 0);
			X.value = {
				...e,
				dx: o,
				dy: s,
				moved: !0
			};
			for (let [t, n] of e.basePositions) zt(t, {
				x: n.x + o,
				y: n.y + s
			});
			W.value = a.dx !== void 0 || a.dy !== void 0 ? sn({
				x: e.baseRegion.x + o,
				y: e.baseRegion.y + s,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, i, nn) : [];
		}
		function $n() {
			window.removeEventListener("pointermove", Zn), window.removeEventListener("pointerup", $n), window.removeEventListener("pointercancel", $n);
			let e = X.value;
			if (X.value = null, W.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = j.value.groups.find((t) => t.name === e.name);
			if (t) {
				for (let n of t.members) {
					let t = j.value.boxes.find((e) => e.id === n), r = e.basePositions.get(n);
					if (!t || !r) continue;
					let i = B(t.docPath);
					i !== void 0 && V(t.docPath, we(i, {
						x: r.x + e.dx,
						y: r.y + e.dy
					}));
				}
				if (t.explicit) {
					let n = B(t.holder);
					n !== void 0 && V(t.holder, Ce(n, Oe({
						name: t.name,
						x: e.baseRegion.x + e.dx,
						y: e.baseRegion.y + e.dy,
						w: e.baseRegion.w,
						h: e.baseRegion.h
					})));
				}
				A(e.before);
			}
		}
		function er(e, t) {
			if (!L.value || e.button !== 0) return;
			e.preventDefault();
			let n = I.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = t.members.map((e) => F.value.find((t) => t.id === e)).filter((e) => !!e), i = Math.max(...r.map((e) => e.x + e.w)), a = Math.max(...r.map((e) => e.y + e.h));
			Z.value = {
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
				raf: 0,
				before: k()
			}, window.addEventListener("pointermove", tr), window.addEventListener("pointerup", rr), window.addEventListener("pointercancel", rr), N.value = null;
		}
		function tr(e) {
			let t = Z.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(nr));
		}
		function nr() {
			let e = Z.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = Math.round(e.baseRegion.w + t), i = Math.round(e.baseRegion.h + n), a = [...F.value.filter((t) => !e.memberIds.has(t.id)), ...I.value.filter((t) => t.name !== e.name)], o = on({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: r,
				h: i
			}, a, e.scale, rn), s = Math.max(e.minW, Math.round(r + (o.dx ?? 0))), c = Math.max(e.minH, Math.round(i + (o.dy ?? 0)));
			Z.value = {
				...e,
				curW: s,
				curH: c,
				moved: !0
			}, W.value = o.dx !== void 0 || o.dy !== void 0 ? sn({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: s,
				h: c
			}, a, rn) : [];
		}
		function rr() {
			window.removeEventListener("pointermove", tr), window.removeEventListener("pointerup", rr), window.removeEventListener("pointercancel", rr);
			let e = Z.value;
			if (Z.value = null, W.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = j.value.groups.find((t) => t.name === e.name);
			if (!t) return;
			let n = B(t.holder);
			n !== void 0 && (V(t.holder, Ce(n, Oe({
				name: t.name,
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: e.curW,
				h: e.curH
			}))), A(e.before));
		}
		function ir(e) {
			if (w.value.has(e.docPath)) {
				let t = k();
				w.value = new Set([...w.value].filter((t) => t !== e.docPath)), A(t);
				return;
			}
			if (z.has(e.docPath) && !(e.docPath in b.files)) {
				ar(e);
				return;
			}
			Jt("删除文档", `「${e.title}」（${e.docPath}）将在「💾 保存」后从磁盘删除，保存前可撤销。确定标记删除？`, () => ar(e));
		}
		function ar(e) {
			let t = k();
			if (C.value.has(e.docPath)) {
				let t = new Map(C.value);
				t.delete(e.docPath), C.value = t;
			}
			z.delete(e.docPath), T.delete(e.docPath), e.docPath in b.files && (w.value = /* @__PURE__ */ new Set([...w.value, e.docPath])), A(t);
		}
		function or(e) {
			if (!(M.value || !L.value) && !J.value) {
				if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z" || e.key === "y")) {
					e.preventDefault(), e.key === "y" || e.shiftKey ? Ne() : Me();
					return;
				}
				if (e.key === "Escape") {
					if (K.value) {
						K.value = null;
						return;
					}
					R.value !== "select" && (R.value = "select");
					return;
				}
				K.value && (e.key === "Delete" || e.key === "Backspace") && (e.preventDefault(), Yn());
			}
		}
		let sr = t(() => M.value ? j.value.boxes.find((e) => e.docPath === M.value)?.title ?? M.value : "");
		function cr() {
			let e = M.value ? `#${encodeURIComponent(M.value)}` : "#";
			if (window.location.hash === e) {
				history.replaceState(null, "", e);
				return;
			}
			history.pushState(null, "", e);
		}
		function lr() {
			let e = window.location.hash, t = null;
			if (e.length > 1) try {
				t = decodeURIComponent(e.slice(1));
			} catch {
				t = null;
			}
			Q.value = !1, M.value = t && b.files[t] ? t : null;
		}
		function ur(e) {
			if (b.files[e]) {
				if (M.value === e) {
					Q.value = !1;
					return;
				}
				Q.value = !1, M.value = e, me("navigate", e), cr();
			}
		}
		function dr(e) {
			document.querySelector(`.pd-doc-view [data-heading-id$="-${e}"]`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function fr(e, t) {
			if (M.value === e) {
				dr(t);
				return;
			}
			ur(e), l(() => {
				setTimeout(() => dr(t), 80), setTimeout(() => dr(t), 320);
			});
		}
		function pr() {
			if (Q.value && gr.value) {
				Jt("丢弃未保存的修改？", "正文有未保存的修改，返回图画布将丢弃这些修改。", mr);
				return;
			}
			mr();
		}
		function mr() {
			Q.value = !1, M.value = null, cr(), l(() => requestAnimationFrame(() => Dt.value?.fit?.()));
		}
		te(() => b.files, (e) => {
			if (Xt.value = !1, M.value && !e[M.value] && mr(), C.value.size) {
				let t = new Map(C.value);
				for (let [n, r] of t) e[n] === r ? (t.delete(n), z.delete(n), T.delete(n)) : e[n] === void 0 && !z.has(n) && (t.delete(n), T.delete(n));
				C.value = t;
			}
			if (w.value.size) {
				let t = new Set([...w.value].filter((t) => e[t] !== void 0));
				t.size !== w.value.size && (w.value = t);
			}
			if (!P.value) return;
			let t = j.value.boxes, n = new Map(P.value);
			for (let [e, r] of n) {
				let i = t.find((t) => t.id === e);
				(!i || i.x === r.x && i.y === r.y) && n.delete(e);
			}
			P.value = n.size > 0 ? n : null;
		});
		let Q = h(!1), $ = h(""), hr = h(""), gr = t(() => M.value !== null && $.value !== (b.files[M.value] ?? ""));
		function _r() {
			M.value && ($.value = b.files[M.value] ?? "", hr.value = $.value, Q.value = !0);
		}
		function vr(e) {
			ur(e), _r();
		}
		function yr() {
			Q.value = !1;
		}
		async function br() {
			if (!M.value || !gr.value) return;
			let e = await ve(M.value, $.value, hr.value);
			if (!e.ok) {
				xe("保存", M.value, e);
				return;
			}
			e.merged && typeof e.content == "string" ? ($.value = e.content, hr.value = e.content, x("已保存，并自动合并了磁盘上的外部修改", "success", 4e3)) : hr.value = $.value;
		}
		function xr(e) {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), br());
		}
		function Sr(e, t) {
			if (L.value) {
				if (R.value !== "select") return;
				let n = e.shiftKey ? 10 : 1, r = {
					ArrowLeft: [-n, 0],
					ArrowRight: [n, 0],
					ArrowUp: [0, -n],
					ArrowDown: [0, n]
				}[e.key];
				if (!r) return;
				e.preventDefault(), wr(t, r[0], r[1]);
				return;
			}
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), ur(t.docPath));
		}
		let Cr = null;
		function wr(e, t, n) {
			let r = Math.round(e.x + t), i = Math.round(e.y + n);
			if (r === e.x && i === e.y) return;
			let a = Date.now(), o = Cr?.id === e.id && a - Cr.time < 800 ? null : k();
			Cr = {
				id: e.id,
				time: a
			}, zt(e.id, {
				x: r,
				y: i
			});
			let s = B(e.docPath);
			s !== void 0 && (V(e.docPath, we(s, {
				x: r,
				y: i
			})), o && A(o));
		}
		function Tr(e, t) {
			if (/^(https?:|mailto:)/.test(t)) return null;
			let [n, r] = t.split("#"), i = n.trim(), a = r?.trim(), o;
			if (a) try {
				o = je(decodeURIComponent(a));
			} catch {
				o = je(a);
			}
			if (!i) return o ? {
				path: e,
				anchor: o
			} : null;
			if (!i.endsWith(".md")) return null;
			let s = i.startsWith("/") ? i.split("/") : [...e.split("/").slice(0, -1), ...i.split("/")], c = [];
			for (let e of s) e === "" || e === "." || (e === ".." ? c.pop() : c.push(e));
			return {
				path: c.join("/"),
				anchor: o
			};
		}
		function Er(e) {
			if (!M.value) return;
			let t = Tr(M.value, e);
			t && (t.anchor ? fr(t.path, t.anchor) : ur(t.path));
		}
		function Dr(e) {
			if (!M.value) return;
			let t = b.files[M.value];
			if (t === void 0) return;
			let n = ge(t, e.source, e.id, e.x, e.y);
			if (n === t) return;
			let r = M.value;
			ve(r, n, t).then((e) => {
				e.ok || xe("保存", r, e);
			});
		}
		if (typeof window < "u" && window.location.hash.length > 1) {
			let e = decodeURIComponent(window.location.hash.slice(1));
			b.files[e] && (M.value = e);
		}
		return (t, l) => (m(), i("div", Re, [a("header", ze, [
			l[16] ||= a("span", { class: "pd-graph-brand" }, "📚 ProDoc", -1),
			M.value ? (m(), i("span", Be, _(sr.value), 1)) : r("", !0),
			a("div", Ve, [
				M.value ? r("", !0) : (m(), i(e, { key: 0 }, [L.value ? (m(), i(e, { key: 1 }, [
					a("button", {
						class: "pd-back-btn",
						disabled: D.value.length === 0,
						title: "撤销（Ctrl+Z）",
						"aria-label": "撤销",
						onClick: Me
					}, "↶", 8, He),
					a("button", {
						class: "pd-back-btn",
						disabled: O.value.length === 0,
						title: "重做（Ctrl+Shift+Z / Ctrl+Y）",
						"aria-label": "重做",
						onClick: Ne
					}, "↷", 8, Ue),
					a("button", {
						class: "pd-back-btn",
						disabled: !E.value || Xt.value,
						onClick: Zt
					}, "💾 保存", 8, We),
					E.value ? (m(), i("button", {
						key: 0,
						class: "pd-back-btn",
						disabled: Xt.value,
						onClick: Qt
					}, "↩ 放弃更改", 8, Ge)) : (m(), i("button", {
						key: 1,
						class: "pd-back-btn pd-back-btn--active",
						onClick: $t
					}, "✓ 完成"))
				], 64)) : (m(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: $t
				}, "🛠 编辑图")), a("button", {
					class: "pd-back-btn",
					onClick: Vt
				}, _(P.value ? "↩ 恢复坐标" : "🧭 分层重排"), 1)], 64)),
				M.value ? (m(), i(e, { key: 1 }, [Q.value ? (m(), i(e, { key: 1 }, [a("button", {
					class: "pd-back-btn",
					disabled: !gr.value,
					onClick: br
				}, "💾 保存", 8, Ke), a("button", {
					class: "pd-back-btn",
					onClick: yr
				}, "👁 预览")], 64)) : (m(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: _r
				}, "✏️ 编辑")), a("button", {
					class: "pd-back-btn",
					onClick: pr
				}, "🗺 返回图")], 64)) : r("", !0),
				j.value.warnings.length ? (m(), n(v(ce), {
					key: 2,
					trigger: "click",
					position: "bottom",
					width: 360
				}, {
					default: ne(() => [a("span", qe, [s(v(ae), { value: j.value.warnings.length }, {
						default: ne(() => [...l[15] ||= [a("button", {
							class: "pd-back-btn",
							type: "button",
							title: "解析告警明细"
						}, "⚠️", -1)]]),
						_: 1
					}, 8, ["value"])])]),
					content: ne(() => [a("ul", Je, [(m(!0), i(e, null, g(j.value.warnings, (e) => (m(), i("li", { key: e }, _(e), 1))), 128))])]),
					_: 1
				})) : r("", !0),
				s(v(le), { size: "small" })
			])
		]), a("div", Ye, [
			M.value ? (m(), i("div", {
				key: 1,
				class: u(["pd-doc-view", { "pd-doc-view--editing": Q.value }])
			}, [Q.value ? (m(), n(v(pe), {
				key: M.value,
				value: $.value,
				class: "pd-doc-editor",
				onChange: l[10] ||= (e) => $.value = e,
				onKeydown: xr
			}, null, 8, ["value"])) : (m(), n(v(he), {
				key: M.value,
				content: Et.value[M.value],
				"show-toc": !0,
				"flow-editable": !0,
				onDocLink: Er,
				onFlowNodeMove: Dr
			}, null, 8, ["content"]))], 2)) : (m(), n(v(oe), {
				key: 0,
				ref_key: "canvasRef",
				ref: Dt,
				width: "100%",
				height: "100%",
				"show-grid": "",
				"grid-variant": "dots",
				"show-fit": "",
				infinite: "",
				"content-bounds": kt.value,
				"min-zoom": .25,
				"max-zoom": 3
			}, {
				default: ne(() => [a("div", {
					ref_key: "stageEl",
					ref: en,
					class: u(["pd-graph-stage", {
						"pd-graph-stage--dragging": U.value?.moved || G.value || Y.value || X.value?.moved || Z.value?.moved,
						"pd-graph-stage--editing": L.value,
						"pd-graph-stage--tool-link": L.value && R.value === "link",
						"pd-graph-stage--tool-node": L.value && R.value === "node"
					}]),
					style: d({
						width: `${Ot.value.w}px`,
						height: `${Ot.value.h}px`
					}),
					onPointerdown: Mn,
					onClick: l[9] ||= (e) => {
						K.value = null, gn.value = null;
					}
				}, [
					(m(!0), i(e, null, g(I.value, (e) => (m(), i("div", {
						key: "group-" + e.name,
						class: u(["pd-doc-group", { "pd-dim": Bt(e) }]),
						style: d({
							left: `${e.x}px`,
							top: `${e.y}px`,
							width: `${e.w}px`,
							height: `${e.h}px`
						})
					}, [a("span", {
						class: "pd-doc-group__label",
						title: L.value ? `拖动移动整组「${e.name}」` : e.name,
						"data-nm-no-pan": "",
						onPointerdown: (t) => Xn(t, e)
					}, _(e.name), 41, Xe), L.value ? (m(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-group__resize",
						"aria-label": `调整组「${e.name}」的区域尺寸`,
						title: "拖动调整区域尺寸",
						"data-nm-no-pan": "",
						onPointerdown: y((t) => er(t, e), ["stop"])
					}, null, 40, Ze)) : r("", !0)], 6))), 128)),
					Nt.value.length || kn.value ? (m(), i("svg", {
						key: 0,
						class: "pd-relation-layer",
						width: Ot.value.w,
						height: Ot.value.h,
						"aria-label": "文档连线"
					}, [
						l[17] ||= a("defs", null, [a("marker", {
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
						(m(!0), i(e, null, g(Nt.value, (e) => (m(), i("g", {
							key: e.id,
							class: u(["pd-relation", {
								"pd-dim": Rt(e),
								"pd-hot": Lt(e),
								"pd-selected": e.id === K.value,
								"pd-relation--new": e.id === vn.value
							}])
						}, [
							a("title", null, _(e.fromTitle) + " → " + _(e.toTitle) + _(e.label ? `（${e.label}）` : ""), 1),
							a("path", {
								class: "pd-relation-hit",
								d: e.d,
								fill: "none",
								onClick: y((t) => Fn(e), ["stop"]),
								onDblclick: y((t) => Ln(e), ["stop"])
							}, null, 40, $e),
							a("path", {
								d: e.d,
								fill: "none",
								"marker-end": "url(#pd-relation-arrow)",
								"pointer-events": "none"
							}, null, 8, et),
							e.label ? (m(), i("text", {
								key: 0,
								x: e.labelX,
								y: e.labelY,
								"pointer-events": "none"
							}, _(e.label), 9, tt)) : r("", !0)
						], 2))), 128)),
						kn.value ? (m(), i("path", {
							key: 0,
							class: "pd-relation-draft",
							d: kn.value,
							fill: "none"
						}, null, 8, nt)) : r("", !0),
						(m(!0), i(e, null, g(W.value, (e, t) => (m(), i("line", {
							key: "guide" + t,
							class: "pd-guide",
							x1: e.axis === "x" ? e.pos : e.start,
							y1: e.axis === "x" ? e.start : e.pos,
							x2: e.axis === "x" ? e.pos : e.end,
							y2: e.axis === "x" ? e.end : e.pos
						}, null, 8, rt))), 128))
					], 8, Qe)) : r("", !0),
					(m(!0), i(e, null, g(F.value, (t) => (m(), i("div", {
						key: t.id,
						class: u(["pd-doc-box", [`pd-doc-box--d${Math.min(t.depth, 3)}`, {
							"pd-dim": It(t.id),
							"pd-doc-box--link-target": An(t) === "valid",
							"pd-doc-box--link-invalid": An(t) === "invalid",
							"pd-doc-box--deleting": w.value.has(t.docPath)
						}]]),
						style: d({
							left: `${t.x}px`,
							top: `${t.y}px`,
							width: `${t.w}px`,
							height: `${t.h}px`
						}),
						role: "link",
						tabindex: "0",
						"aria-label": `${t.title}（跳转到文档）`,
						"data-nm-no-pan": "",
						onPointerdown: (e) => un(e, t),
						onClick: (e) => _n(t),
						onKeydown: (e) => Sr(e, t),
						onMouseenter: (e) => Pt(t.id),
						onMouseleave: l[2] ||= (e) => Pt(null)
					}, [
						a("div", at, [a("span", {
							class: "pd-doc-box__title",
							title: t.title
						}, _(t.title), 9, ot), l[18] ||= a("span", {
							class: "pd-doc-box__icon",
							"aria-hidden": "true"
						}, "↗", -1)]),
						L.value ? r("", !0) : (m(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-box__edit",
							"aria-label": `编辑 ${t.title}`,
							title: "编辑文档",
							onClick: y((e) => vr(t.docPath), ["stop"]),
							onKeydown: [ie(y((e) => vr(t.docPath), ["stop"]), ["enter"]), ie(y((e) => vr(t.docPath), ["stop"]), ["space"])]
						}, "✏️", 40, st)),
						L.value && c.deleteHandler ? (m(), i("button", {
							key: 1,
							type: "button",
							class: u(["pd-doc-box__delete", { "pd-doc-box__delete--armed": w.value.has(t.docPath) }]),
							"aria-label": w.value.has(t.docPath) ? `撤销删除 ${t.title}` : `删除 ${t.title}`,
							title: w.value.has(t.docPath) ? "撤销删除标记" : "标记删除（💾 保存后生效）",
							onClick: y((e) => ir(t), ["stop"]),
							onPointerdown: l[0] ||= y(() => {}, ["stop"])
						}, _(w.value.has(t.docPath) ? "↩" : "✕"), 43, ct)) : r("", !0),
						L.value ? (m(), i(e, { key: 2 }, g([
							"top",
							"right",
							"bottom",
							"left"
						], (e) => a("button", {
							key: e,
							type: "button",
							class: u(["pd-doc-box__link-handle", `pd-doc-box__link-handle--${e}`]),
							"aria-label": `从 ${t.title} 的${{
								top: "上",
								right: "右",
								bottom: "下",
								left: "左"
							}[e]}边创建连线（拖到目标框）`,
							title: "拖到其他框创建连线",
							onPointerdown: y((n) => Sn(n, t, e), ["stop"]),
							onClick: l[1] ||= y(() => {}, ["stop"])
						}, null, 42, lt)), 64)) : r("", !0),
						t.blocks.length && !L.value ? (m(), i("div", {
							key: 3,
							class: u(["pd-doc-blocks-pop", {
								"pd-doc-blocks-pop--above": Gt(t),
								"pd-doc-blocks-pop--force": gn.value === t.id
							}])
						}, [a("div", ut, [(m(!0), i(e, null, g(Ht(t), (e) => (m(), i("button", {
							key: e.anchor,
							type: "button",
							class: "pd-doc-blocks-pop__item",
							title: e.title,
							"aria-label": `跳转到「${e.title}」分块`,
							onClick: y((n) => fr(t.docPath, e.anchor), ["stop"]),
							onKeydown: [ie(y((n) => fr(t.docPath, e.anchor), ["stop"]), ["enter"]), ie(y((n) => fr(t.docPath, e.anchor), ["stop"]), ["space"])]
						}, "▸ " + _(e.title), 41, dt))), 128)), Ut(t) > 0 ? (m(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more",
							"aria-label": `查看全部 ${t.blocks.length} 个分块`,
							onClick: y((e) => ur(t.docPath), ["stop"])
						}, "+" + _(Ut(t)) + " 更多分块…", 9, ft)) : r("", !0)])], 2)) : r("", !0)
					], 46, it))), 128)),
					L.value && q.value && !J.value ? (m(), i("button", {
						key: 1,
						type: "button",
						class: "pd-edge-delete",
						style: d({
							left: `${q.value.delX}px`,
							top: `${q.value.delY}px`
						}),
						"aria-label": `删除连线 ${q.value.fromTitle} → ${q.value.toTitle}`,
						title: "删除连线（Delete）",
						onClick: y(Yn, ["stop"])
					}, "✕", 12, pt)) : r("", !0),
					L.value && q.value && J.value && J.value.edgeId === q.value.id ? re((m(), i("input", {
						key: 2,
						ref_key: "labelInputEl",
						ref: In,
						"onUpdate:modelValue": l[3] ||= (e) => J.value.value = e,
						type: "text",
						class: "pd-edge-label-input",
						style: d({
							left: `${q.value.labelX}px`,
							top: `${q.value.labelY}px`
						}),
						"aria-label": `编辑连线标签 ${q.value.fromTitle} → ${q.value.toTitle}`,
						placeholder: "连线标签（留空移除）",
						"data-nm-no-pan": "",
						onKeydown: [ie(y(Rn, ["prevent"]), ["enter"]), ie(y(zn, ["prevent"]), ["esc"])],
						onBlur: Rn,
						onClick: l[4] ||= y(() => {}, ["stop"])
					}, null, 44, mt)), [[ee, J.value.value]]) : r("", !0),
					L.value && q.value ? (m(), i("svg", {
						key: 3,
						class: "pd-relation-layer pd-relation-layer--top",
						width: Ot.value.w,
						height: Ot.value.h,
						"aria-hidden": "true"
					}, [a("g", gt, [a("circle", {
						class: "pd-edge-handle",
						cx: q.value.x1,
						cy: q.value.y1,
						r: "6"
					}, null, 8, _t), a("circle", {
						class: "pd-edge-handle-halo",
						cx: q.value.x1,
						cy: q.value.y1,
						r: "12",
						onPointerdown: l[5] ||= y((e) => Vn(e, q.value, "from"), ["stop"]),
						onClick: l[6] ||= y(() => {}, ["stop"])
					}, [...l[19] ||= [a("title", null, "拖动调整源框连接边", -1)]], 40, vt)]), a("g", yt, [a("circle", {
						class: "pd-edge-handle",
						cx: q.value.x2,
						cy: q.value.y2,
						r: "6"
					}, null, 8, bt), a("circle", {
						class: "pd-edge-handle-halo",
						cx: q.value.x2,
						cy: q.value.y2,
						r: "12",
						onPointerdown: l[7] ||= y((e) => Vn(e, q.value, "to"), ["stop"]),
						onClick: l[8] ||= y(() => {}, ["stop"])
					}, [...l[20] ||= [a("title", null, "拖动调整目标框连接边", -1)]], 40, xt)])], 8, ht)) : r("", !0)
				], 38)]),
				_: 1
			}, 8, ["content-bounds"])),
			!M.value && L.value ? (m(), i("div", St, [
				a("button", {
					type: "button",
					class: u(["pd-edit-toolbar__btn", { "pd-edit-toolbar__btn--active": R.value === "select" }]),
					title: "选择工具（Esc）",
					onClick: l[11] ||= (e) => R.value = "select"
				}, "🖱 选择", 2),
				a("button", {
					type: "button",
					class: u(["pd-edit-toolbar__btn", { "pd-edit-toolbar__btn--active": R.value === "link" }]),
					title: "连线工具：从任意框拖到目标框创建连线",
					onClick: l[12] ||= (e) => R.value = "link"
				}, "🔗 连线", 2),
				a("button", {
					type: "button",
					class: u(["pd-edit-toolbar__btn", { "pd-edit-toolbar__btn--active": R.value === "node" }]),
					title: "节点工具：点画布空白创建新文档框",
					onClick: l[13] ||= (e) => R.value = "node"
				}, "📄 节点", 2)
			])) : r("", !0),
			s(v(ue), {
				ref_key: "toastRef",
				ref: _e
			}, null, 512),
			s(v(se), {
				modelValue: qt.value,
				"onUpdate:modelValue": l[14] ||= (e) => qt.value = e,
				title: Kt.value.title,
				size: "small",
				"confirm-label": "确认",
				"cancel-label": "取消",
				onConfirm: Yt
			}, {
				default: ne(() => [o(_(Kt.value.message), 1)]),
				_: 1
			}, 8, ["modelValue", "title"])
		])]));
	}
});
//#endregion
export { fe as DocFlowCanvas, wt as DocGraphViewer, b as DocViewer, me as MarkdownRenderer };

//# sourceMappingURL=index.js.map