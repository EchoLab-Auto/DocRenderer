import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createTextVNode as o, createVNode as s, defineComponent as c, nextTick as l, normalizeClass as u, normalizeStyle as d, onBeforeUnmount as f, onMounted as p, openBlock as m, ref as h, renderList as g, toDisplayString as _, unref as v, vModelText as ee, watch as te, withCtx as ne, withDirectives as re, withKeys as ie, withModifiers as y } from "vue";
import { NeumorphismBadge as ae, NeumorphismCanvas as oe, NeumorphismModal as se, NeumorphismPopover as ce, NeumorphismThemeToggle as le, NeumorphismToastProvider as ue, useTouchDevice as de } from "@echolab-auto/ui-frame";
import { DocFlowCanvas as fe, DocViewer as b, MarkdownEditor as pe, MarkdownRenderer as me, MarkdownRenderer as he, writeFlowNodePosition as ge } from "@echolab-auto/ui-frame/doc";
import "@echolab-auto/ui-frame/dist/style.css";
//#region ../prodoc-core/dist/graph-C2fVzQvi.js
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
}, Te = /^([trbl_])>([trbl_])$/;
function Ee(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(Te);
		t ? (t[1] !== "_" && (n.fromSide = D[t[1]]), t[2] !== "_" && (n.toSide = D[t[2]])) : e !== "" && (n.label = e);
	}
	return n;
}
function De(e) {
	let t = e.ref;
	if (e.label && (t += ` | ${e.label}`), e.fromSide || e.toSide) {
		let n = e.fromSide ? O[e.fromSide] : "_", r = e.toSide ? O[e.toSide] : "_";
		t += ` | ${n}>${r}`;
	}
	return t;
}
var k = /^(.*)\s*@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
function Oe(e) {
	let t = e.match(k);
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
function ke(e) {
	let { name: t, x: n, y: r, w: i, h: a } = e;
	return [
		n,
		r,
		i,
		a
	].every((e) => typeof e == "number" && Number.isFinite(e)) ? `${t} @ ${n}, ${r}, ${i}, ${a}` : t;
}
function Ae(e, t) {
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
function je(e) {
	let t = e.match(/^#[ \t]+(.+)$/m);
	return t ? t[1].trim() : void 0;
}
function Me(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
}
function Ne(e) {
	return e.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_~]/g, "").replace(/<[^>]+>/g, "").trim();
}
function Pe(e) {
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
			let e = Ne(i[1]);
			e && t.push({
				anchor: Me(e),
				title: e
			});
		}
	}
	return t.length >= 2 ? t : [];
}
function Fe(e, t) {
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
function Ie(e, t, n, r) {
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
function Le(e, t) {
	let n = e.map((e) => ({
		...e,
		x: 0,
		y: 0
	}));
	return Ie(n, t, Fe(n, t), new Map(n.map((e) => [e.id, {}]))), new Map(n.map((e) => [e.id, {
		x: e.x,
		y: e.y
	}]));
}
function Re(e) {
	let t = Object.keys(e).sort(), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let o of t) {
		let { params: t, body: s } = S(e[o]), c = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : o.replace(/\.md$/, ""), l = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || je(s) || c, u = Pe(s), d = E(t.w) ?? 220, f = E(t.h) ?? 96, p = {};
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
			if (e.length > 1 && n.push(`文档 "${c}" 声明了多个 group，仅取第一个 "${Oe(e[0]).name || e[0]}"`), e.length > 0) {
				let { name: t, geo: n } = Oe(e[0]);
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
			let { ref: n, label: r, fromSide: i, toSide: a } = Ee(e);
			n && d(t.id, n, {
				label: r,
				fromSide: i,
				toSide: a
			}, t.id + ".link");
		}
	}
	let f = Fe(o, c);
	for (let e of o) e.depth = f.get(e.id) ?? 0;
	Ie(o, c, f, i);
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
			...Ae(t.members, t.geo),
			explicit: t.geo !== void 0,
			holder: t.holder ?? t.members[0].docPath
		})),
		warnings: n
	};
}
//#endregion
//#region src/components/DocGraphViewer.vue?vue&type=script&setup=true&lang.ts
var ze = { class: "pd-graph-viewer" }, Be = { class: "pd-graph-header" }, Ve = {
	key: 0,
	class: "pd-graph-current"
}, He = { class: "pd-graph-actions" }, Ue = ["disabled"], We = ["disabled"], Ge = ["disabled"], Ke = ["disabled"], qe = ["disabled"], Je = { class: "pd-warn-trigger" }, Ye = { class: "pd-warn-list" }, Xe = { class: "pd-graph-main" }, Ze = ["title", "onPointerdown"], Qe = ["aria-label", "onPointerdown"], $e = ["width", "height"], et = [
	"d",
	"onClick",
	"onDblclick"
], tt = ["d"], nt = ["x", "y"], rt = ["d"], it = [
	"x1",
	"y1",
	"x2",
	"y2"
], at = [
	"aria-label",
	"onPointerdown",
	"onClick",
	"onKeydown",
	"onMouseenter"
], ot = { class: "pd-doc-box__head" }, st = ["title"], ct = [
	"aria-label",
	"onClick",
	"onKeydown"
], lt = [
	"aria-label",
	"title",
	"onClick"
], ut = ["aria-label", "onPointerdown"], dt = {
	class: "pd-doc-blocks-pop__card",
	role: "menu"
}, ft = [
	"title",
	"aria-label",
	"onClick",
	"onKeydown"
], pt = ["aria-label", "onClick"], mt = ["aria-label"], ht = ["aria-label", "onKeydown"], gt = ["width", "height"], _t = { class: "pd-edge-handle-grp" }, vt = ["cx", "cy"], yt = ["cx", "cy"], bt = { class: "pd-edge-handle-grp" }, xt = ["cx", "cy"], St = ["cx", "cy"], Ct = {
	key: 2,
	class: "pd-edit-toolbar",
	role: "toolbar",
	"aria-label": "图编辑工具栏"
}, wt = 30, Tt = /* @__PURE__ */ c({
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
			n.status === 409 ? x(`「${t}」在磁盘上已被其他程序修改，${e}被拒绝。该文件的暂存已保留，可刷新页面同步后重试（或「↩ 放弃更改」丢弃）。`, "error", 8e3) : x(`「${t}」${e}失败：${n.error ?? "未知错误"}`, "error", 6e3);
		}
		let C = h(/* @__PURE__ */ new Map()), w = h(/* @__PURE__ */ new Set()), T = t(() => C.value.size > 0 || w.value.size > 0), E = h([]), D = h([]);
		function O() {
			return {
				drafts: [...C.value],
				newPaths: [...z],
				deletes: [...w.value],
				overrides: P.value ? [...P.value] : null
			};
		}
		function Te(e, t) {
			if (e.deletes.length !== t.deletes.length || e.newPaths.length !== t.newPaths.length || e.drafts.length !== t.drafts.length || (e.overrides?.length ?? 0) !== (t.overrides?.length ?? 0)) return !1;
			let n = new Map(e.drafts);
			if (!t.drafts.every(([e, t]) => n.get(e) === t) || !e.deletes.every((e) => t.deletes.includes(e)) || !e.newPaths.every((e) => t.newPaths.includes(e))) return !1;
			let r = new Map(e.overrides ?? []);
			return (t.overrides ?? []).every(([e, t]) => r.get(e)?.x === t.x && r.get(e)?.y === t.y);
		}
		function k(e) {
			Te(e, O()) || (E.value = [...E.value, e], D.value = []);
		}
		function Oe(e) {
			C.value = new Map(e.drafts), z = new Set(e.newPaths), w.value = new Set(e.deletes), P.value = e.overrides ? new Map(e.overrides) : null;
		}
		function je() {
			let e = E.value[E.value.length - 1];
			e && (E.value = E.value.slice(0, -1), D.value = [...D.value, O()], Oe(e));
		}
		function Ne() {
			let e = D.value[D.value.length - 1];
			e && (D.value = D.value.slice(0, -1), E.value = [...E.value, O()], Oe(e));
		}
		let Pe = `prodoc-drafts:${typeof location < "u" ? location.origin : ""}`;
		function Fe() {
			try {
				if (!T.value) {
					localStorage.removeItem(Pe);
					return;
				}
				localStorage.setItem(Pe, JSON.stringify({
					v: 1,
					drafts: [...C.value].map(([e, t]) => ({
						path: e,
						base: b.files[e] ?? null,
						content: t
					})),
					deletes: [...w.value].map((e) => ({
						path: e,
						base: b.files[e] ?? null
					}))
				}));
			} catch {}
		}
		function Ie() {
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
					t !== e.content && (e.base !== null && t !== e.base || e.base === null && t !== void 0 || (n.set(e.path, e.content), t === void 0 && z.add(e.path)));
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
		} : b.files), A = t(() => Re(Tt.value)), Et = t(() => Object.fromEntries(Object.entries(b.files).map(([e, t]) => [e, S(t).body])));
		te(() => A.value.warnings, (e) => e.forEach((e) => console.warn("[ProDoc]", e)), { immediate: !0 });
		let j = h(null), Dt = h(null), M = t(() => {
			let e = 0, t = 0;
			for (let n of F.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			for (let n of I.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			return {
				w: Math.max(e, 640),
				h: Math.max(t, 480)
			};
		});
		function Ot(e, t) {
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
		function kt(e, t) {
			let n = e.x + e.w / 2, r = e.y + e.h / 2, i = t.x + t.w / 2 - n, a = t.y + t.h / 2 - r;
			return Math.abs(a) >= Math.abs(i) ? {
				fs: a >= 0 ? "bottom" : "top",
				ts: a >= 0 ? "top" : "bottom"
			} : {
				fs: i >= 0 ? "right" : "left",
				ts: i >= 0 ? "left" : "right"
			};
		}
		function At(e, t, n, r) {
			let i = kt(e, t), a = Ot(e, n ?? i.fs), o = Ot(t, r ?? i.ts), s = Math.hypot(o.x - a.x, o.y - a.y), c = Math.max(24, Math.min(s * .45, 96)), l = `M ${a.x} ${a.y} C ${a.x + a.nx * c} ${a.y + a.ny * c}, ${o.x + o.nx * c} ${o.y + o.ny * c}, ${o.x} ${o.y}`;
			return {
				x1: a.x,
				y1: a.y,
				x2: o.x,
				y2: o.y,
				d: l
			};
		}
		let jt = t(() => {
			let e = new Map(F.value.map((e) => [e.id, e])), t = X.value;
			return A.value.relations.flatMap((n) => {
				let r = e.get(n.from), i = e.get(n.to);
				if (!r || !i) return [];
				let a = n.fromSide, o = n.toSide;
				t && t.edgeId === n.id && (t.which === "from" ? a = t.side : o = t.side);
				let { x1: s, y1: c, x2: l, y2: u, d } = At(r, i, a, o), f = (s + l) / 2, p = (c + u) / 2 - 7, m = l - s, h = u - c, g = Math.hypot(m, h) || 1;
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
		function Mt(e) {
			W.value || K.value || X.value || (N.value = e);
		}
		let Nt = t(() => {
			if (!N.value) return /* @__PURE__ */ new Set();
			let e = /* @__PURE__ */ new Set([N.value]);
			for (let t of A.value.relations) t.from === N.value && e.add(t.to), t.to === N.value && e.add(t.from);
			return e;
		}), Pt = (e) => N.value !== null && !Nt.value.has(e), Ft = (e) => N.value !== null && (e.fromId === N.value || e.toId === N.value), It = (e) => N.value !== null && !Ft(e), P = h(null), F = t(() => A.value.boxes.map((e) => {
			let t = P.value?.get(e.id);
			return t ? {
				...e,
				x: t.x,
				y: t.y
			} : e;
		}));
		function Lt(e, t) {
			let n = new Map(P.value ?? []);
			n.set(e, t), P.value = n;
		}
		let I = t(() => {
			let e = Z.value, t = Q.value;
			return A.value.groups.map((n) => {
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
					...Ae(r)
				};
			});
		}), Rt = (e) => N.value !== null && !e.members.some((e) => Nt.value.has(e));
		function zt() {
			if (P.value) {
				P.value = null;
				return;
			}
			let e = Le(A.value.boxes, A.value.relations);
			if (L.value) for (let t of C.value.keys()) {
				let n = A.value.boxes.find((e) => e.docPath === t);
				n && e.delete(n.id);
			}
			P.value = e;
		}
		let Bt = (e) => e.blocks.slice(0, 6), Vt = (e) => Math.max(0, e.blocks.length - 6), Ht = (e) => (Bt(e).length + +(Vt(e) > 0)) * wt + 12, Ut = (e, t) => e.y + e.h + 6 + Ht(e) > t, L = h(!1), R = h("select"), z = /* @__PURE__ */ new Set(), Wt = h({
			title: "",
			message: "",
			action: null
		}), Gt = h(!1);
		function Kt(e, t, n) {
			Wt.value = {
				title: e,
				message: t,
				action: n
			}, Gt.value = !0;
		}
		function qt() {
			Gt.value = !1, Wt.value.action?.();
		}
		function B(e) {
			return C.value.get(e) ?? b.files[e];
		}
		function V(e, t) {
			let n = new Map(C.value);
			t === b.files[e] ? (n.delete(e), z.delete(e)) : (n.set(e, t), e in b.files || z.add(e)), C.value = n;
		}
		let H = h(!1);
		async function Jt() {
			if (!T.value || H.value) return;
			H.value = !0;
			let e = [], t = [];
			for (let [t, n] of C.value) {
				let r = await ve(t, n, b.files[t]);
				r.ok || (e.push(t), xe("保存", t, r));
			}
			for (let e of w.value) {
				let n = await be(e, b.files[e]);
				n.ok || (t.push(e), xe("删除", e, n));
			}
			if (e.length > 0 || t.length > 0) {
				let n = new Map(C.value);
				for (let t of n.keys()) e.includes(t) || (n.delete(t), z.delete(t));
				C.value = n, w.value = new Set([...w.value].filter((e) => t.includes(e)));
			} else C.value = /* @__PURE__ */ new Map(), w.value = /* @__PURE__ */ new Set(), z.clear(), E.value = [], D.value = [], x("图修改已保存", "success", 2500);
			H.value = !1;
		}
		function Yt() {
			if (!T.value) return;
			let e = new Set([...C.value.keys()].map((e) => A.value.boxes.find((t) => t.docPath === e)?.id).filter((e) => !!e));
			if (C.value = /* @__PURE__ */ new Map(), w.value = /* @__PURE__ */ new Set(), P.value) {
				let t = new Map(P.value);
				e.forEach((e) => t.delete(e)), P.value = t.size > 0 ? t : null;
			}
			q.value = null, R.value = "select", z.clear(), E.value = [], D.value = [], L.value = !1;
		}
		function Xt() {
			if (L.value) {
				if (T.value) return;
				q.value = null, R.value = "select", E.value = [], D.value = [], L.value = !1;
			} else L.value = !0;
		}
		let Zt = h(null);
		function U(e, t) {
			let n = Zt.value;
			if (!n) return {
				x: 0,
				y: 0,
				scale: 1
			};
			let r = n.getBoundingClientRect(), i = r.width / M.value.w || 1;
			return {
				x: (e - r.left) / i,
				y: (t - r.top) / i,
				scale: i
			};
		}
		let W = h(null);
		function Qt(e) {
			let t = e?.parentElement ?? null;
			for (; t;) {
				let e = getComputedStyle(t);
				if (/(auto|scroll)/.test(`${e.overflow} ${e.overflowX} ${e.overflowY}`)) return t;
				t = t.parentElement;
			}
			return null;
		}
		function $t(e, t, n, r) {
			if (!n) return {
				px: 0,
				py: 0
			};
			let i = n.getBoundingClientRect(), a = (e) => Math.max(0, Math.min(1, (40 - e) / 40)), o = 0, s = 0;
			return e < i.left + 40 ? o = -14 * a(e - i.left) : e > i.right - 40 && (o = 14 * a(i.right - e)), t < i.top + 40 ? s = -14 * a(t - i.top) : t > i.bottom - 40 && (s = 14 * a(i.bottom - t)), (o || s) && (n.scrollLeft += o, n.scrollTop += s), {
				px: o / r,
				py: s / r
			};
		}
		let G = h([]), en = {
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
		}, tn = {
			x: ["end"],
			y: ["end"]
		};
		function nn(e, t) {
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
		function rn(e, t, n, r) {
			let i = Math.min(Math.max(8 / n, 4), 12), a = {};
			for (let n of ["x", "y"]) {
				let o = nn(e, n), s = r[n].map((e) => o[e]), c = null;
				for (let e of t) for (let t of Object.values(nn(e, n))) for (let e of s) {
					let n = t - e;
					Math.abs(n) <= i && (c === null || Math.abs(n) < Math.abs(c)) && (c = n);
				}
				c !== null && (a[n === "x" ? "dx" : "dy"] = c);
			}
			return a;
		}
		function an(e, t, n) {
			let r = [], i = /* @__PURE__ */ new Set();
			for (let a of ["x", "y"]) {
				let o = nn(e, a), s = n[a].map((e) => o[e]);
				for (let n of t) for (let t of Object.values(nn(n, a))) {
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
		function on(e, t, n, r) {
			let i = F.value.find((t) => t.id === e);
			if (!i) return {
				x: Math.max(0, Math.round(t)),
				y: Math.max(0, Math.round(n)),
				guides: []
			};
			let a = F.value.filter((t) => t.id !== e), o = rn({
				x: t,
				y: n,
				w: i.w,
				h: i.h
			}, a, r, en), s = Math.max(0, Math.round(t + (o.dx ?? 0))), c = Math.max(0, Math.round(n + (o.dy ?? 0)));
			return {
				x: s,
				y: c,
				guides: o.dx !== void 0 || o.dy !== void 0 ? an({
					x: s,
					y: c,
					w: i.w,
					h: i.h
				}, a, en) : []
			};
		}
		let sn = !1;
		function cn(e, t) {
			if (L.value && e.button === 0 && !e.target.closest("button")) {
				if (R.value === "link") {
					yn(e, t);
					return;
				}
				R.value !== "node" && (W.value = {
					id: t.id,
					path: t.docPath,
					startClientX: e.clientX,
					startClientY: e.clientY,
					lastClientX: e.clientX,
					lastClientY: e.clientY,
					scale: U(e.clientX, e.clientY).scale,
					baseX: t.x,
					baseY: t.y,
					moved: !1,
					raf: 0,
					scroller: Qt(Zt.value),
					panX: 0,
					panY: 0,
					before: O()
				}, window.addEventListener("pointermove", ln), window.addEventListener("pointerup", fn), window.addEventListener("pointercancel", fn), N.value = null);
			}
		}
		function ln(e) {
			let t = W.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(un));
		}
		function un() {
			let e = W.value;
			if (!e) return;
			e.raf = 0;
			let t = $t(e.lastClientX, e.lastClientY, e.scroller, e.scale);
			e.panX += t.px, e.panY += t.py;
			let n = (e.lastClientX - e.startClientX) / e.scale + e.panX, r = (e.lastClientY - e.startClientY) / e.scale + e.panY;
			if (!e.moved && Math.hypot(n, r) < 3) return;
			e.moved = !0;
			let i = on(e.id, e.baseX + n, e.baseY + r, e.scale);
			Lt(e.id, {
				x: i.x,
				y: i.y
			}), G.value = i.guides;
		}
		function dn() {
			let e = W.value;
			if (W.value = null, G.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			sn = !0;
			let t = P.value?.get(e.id);
			if (!t) return;
			let n = B(e.path);
			n !== void 0 && (V(e.path, we(n, t)), k(e.before));
		}
		function fn() {
			window.removeEventListener("pointermove", ln), window.removeEventListener("pointerup", fn), window.removeEventListener("pointercancel", fn), dn();
		}
		let { isTouch: pn } = de(), mn = h(null);
		function hn(e) {
			if (sn) {
				sn = !1;
				return;
			}
			if (!L.value) {
				if (pn.value && e.blocks.length > 0 && mn.value !== e.id) {
					mn.value = e.id;
					return;
				}
				mn.value = null, cr(e.docPath);
			}
		}
		let K = h(null), gn = h(null), _n = null;
		function vn(e, t) {
			let n = t.x - (e.x + e.w / 2), r = t.y - (e.y + e.h / 2);
			return Math.abs(n) * e.h > Math.abs(r) * e.w ? n >= 0 ? "right" : "left" : r >= 0 ? "bottom" : "top";
		}
		function yn(e, t, n) {
			if (!L.value || e.button !== 0) return;
			e.preventDefault();
			let r = U(e.clientX, e.clientY);
			K.value = {
				fromId: t.id,
				fromSide: n ?? vn(t, r),
				targetId: null,
				x: r.x,
				y: r.y,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0,
				scroller: Qt(Zt.value),
				before: O()
			}, window.addEventListener("pointermove", xn), window.addEventListener("pointerup", Tn), window.addEventListener("pointercancel", wn), N.value = null;
		}
		function bn(e, t, n) {
			yn(e, t, n);
		}
		function xn(e) {
			let t = K.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Sn));
		}
		function Sn() {
			let e = K.value;
			if (!e) return;
			e.raf = 0, $t(e.lastClientX, e.lastClientY, e.scroller, 1);
			let t = U(e.lastClientX, e.lastClientY), n = F.value.find((e) => t.x >= e.x && t.x <= e.x + e.w && t.y >= e.y && t.y <= e.y + e.h);
			K.value = {
				...e,
				x: t.x,
				y: t.y,
				targetId: n?.id ?? null
			};
		}
		function Cn() {
			window.removeEventListener("pointermove", xn), window.removeEventListener("pointerup", Tn), window.removeEventListener("pointercancel", wn);
		}
		function wn() {
			Cn();
			let e = K.value;
			e?.raf && cancelAnimationFrame(e.raf), K.value = null;
		}
		function Tn(e) {
			Cn();
			let t = K.value;
			if (t?.raf && cancelAnimationFrame(t.raf), K.value = null, !t) return;
			let n = U(e.clientX, e.clientY), r = F.value.find((e) => n.x >= e.x && n.x <= e.x + e.w && n.y >= e.y && n.y <= e.y + e.h);
			!r || r.id === t.fromId || A.value.relations.some((e) => e.from === t.fromId && e.to === r.id) || En(t.fromId, r.id, t.fromSide, vn(r, n), t.before);
		}
		function En(e, t, n, r, i) {
			let a = A.value.boxes.find((t) => t.id === e);
			if (!a) return;
			let o = B(a.docPath);
			if (o === void 0) return;
			let s = De({
				ref: t,
				fromSide: n,
				toSide: r
			});
			V(a.docPath, Se(o, [...ye(o), s])), i && k(i), gn.value = `${e}->${t}`, _n && clearTimeout(_n), _n = setTimeout(() => {
				gn.value = null, _n = null;
			}, 700);
		}
		let Dn = t(() => {
			let e = K.value;
			if (!e) return null;
			let t = F.value.find((t) => t.id === e.fromId);
			if (!t) return null;
			let n = e.targetId ? F.value.find((t) => t.id === e.targetId) : void 0;
			if (n && n.id !== e.fromId) {
				let r = vn(n, {
					x: e.x,
					y: e.y
				});
				return At(t, n, e.fromSide, r).d;
			}
			return At(t, {
				x: e.x,
				y: e.y,
				w: 0,
				h: 0
			}, e.fromSide).d;
		});
		function On(e) {
			let t = K.value;
			return !t || t.targetId !== e.id ? null : e.id === t.fromId || A.value.relations.some((n) => n.from === t.fromId && n.to === e.id) ? "invalid" : "valid";
		}
		p(() => {
			window.addEventListener("keydown", ir), window.addEventListener("popstate", sr);
			let e = Ie();
			e > 0 && (L.value = !0, l(() => x(`已恢复 ${e} 项上次未保存的图修改，可「💾 保存」或「↩ 放弃更改」`, "info", 6e3))), j.value || l(() => requestAnimationFrame(() => Dt.value?.fit?.()));
		}), f(() => {
			_n && clearTimeout(_n), window.removeEventListener("keydown", ir), window.removeEventListener("popstate", sr);
		});
		let kn = null;
		function An(e) {
			!L.value || R.value !== "node" || e.button === 0 && e.target === Zt.value && (kn = {
				clientX: e.clientX,
				clientY: e.clientY
			}, window.addEventListener("pointerup", jn));
		}
		function jn(e) {
			window.removeEventListener("pointerup", jn);
			let t = kn;
			if (kn = null, !t || Math.hypot(e.clientX - t.clientX, e.clientY - t.clientY) >= 3) return;
			let n = U(e.clientX, e.clientY);
			Mn(n.x, n.y);
		}
		function Mn(e, t) {
			let n = Math.max(0, Math.round(e - 220 / 2)), r = Math.max(0, Math.round(t - 96 / 2)), i = O(), a = /* @__PURE__ */ new Set([...Object.keys(b.files), ...C.value.keys()]), o = 1;
			for (; a.has(`untitled-${o}.md`);) o++;
			let s = `untitled-${o}.md`, c = `未命名文档 ${o}`;
			V(s, `---\ntitle: "${c}"\nx: ${n}\ny: ${r}\n---\n\n# ${c}\n`), k(i);
		}
		let q = h(null), J = t(() => jt.value.find((e) => e.id === q.value) ?? null);
		function Nn(e) {
			L.value && (q.value = e.id);
		}
		let Y = h(null), Pn = h(null);
		function Fn(e) {
			L.value && (q.value = e.id, Y.value = {
				edgeId: e.id,
				value: e.label ?? ""
			}, l(() => {
				Pn.value?.focus(), Pn.value?.select();
			}));
		}
		function In() {
			let e = Y.value;
			if (Y.value = null, !e) return;
			let t = jt.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.value.trim();
			if (n === (t.label ?? "")) return;
			let r = A.value.boxes.find((e) => e.id === t.fromId);
			if (!r) return;
			let i = B(r.docPath);
			if (i === void 0) return;
			let a = O(), o = ye(i).map((e) => {
				let r = Ee(e);
				return Kn(r.ref) === t.toId ? De({
					ref: r.ref,
					label: n || void 0,
					fromSide: r.fromSide,
					toSide: r.toSide
				}) : e;
			});
			V(r.docPath, Se(i, o)), k(a);
		}
		function Ln() {
			Y.value = null;
		}
		let X = h(null);
		function Rn(e, t, n) {
			let r = t - (e.x + e.w / 2), i = n - (e.y + e.h / 2);
			return Math.abs(r) / (e.w / 2) >= Math.abs(i) / (e.h / 2) ? r >= 0 ? "right" : "left" : i >= 0 ? "bottom" : "top";
		}
		function zn(e, t, n) {
			if (e.button !== 0) return;
			e.preventDefault(), e.stopPropagation();
			let r = kt(F.value.find((e) => e.id === t.fromId), F.value.find((e) => e.id === t.toId));
			X.value = {
				edgeId: t.id,
				which: n,
				side: (n === "from" ? t.fromSide : t.toSide) ?? (n === "from" ? r.fs : r.ts),
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0,
				before: O()
			}, window.addEventListener("pointermove", Bn), window.addEventListener("pointerup", Wn), window.addEventListener("pointercancel", Un), N.value = null;
		}
		function Bn(e) {
			let t = X.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Vn));
		}
		function Vn() {
			let e = X.value;
			if (!e) return;
			e.raf = 0;
			let t = jt.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = F.value.find((n) => n.id === (e.which === "from" ? t.fromId : t.toId));
			if (!n) return;
			let r = U(e.lastClientX, e.lastClientY), i = Rn(n, r.x, r.y);
			i !== e.side && (X.value = {
				...e,
				side: i
			});
		}
		function Hn() {
			window.removeEventListener("pointermove", Bn), window.removeEventListener("pointerup", Wn), window.removeEventListener("pointercancel", Un);
		}
		function Un() {
			Hn();
			let e = X.value;
			e?.raf && cancelAnimationFrame(e.raf), X.value = null;
		}
		function Wn() {
			Hn();
			let e = X.value;
			if (e?.raf && cancelAnimationFrame(e.raf), X.value = null, !e) return;
			let t = jt.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.which === "from" ? e.side : t.fromSide, r = e.which === "to" ? e.side : t.toSide;
			n === t.fromSide && r === t.toSide || (Gn(t, n, r), k(e.before));
		}
		function Gn(e, t, n) {
			let r = A.value.boxes.find((t) => t.id === e.fromId);
			if (!r) return;
			let i = B(r.docPath);
			if (i === void 0) return;
			let a = ye(i).map((r) => {
				let i = Ee(r);
				return Kn(i.ref) === e.toId ? De({
					ref: i.ref,
					label: i.label,
					fromSide: t,
					toSide: n
				}) : r;
			});
			V(r.docPath, Se(i, a));
		}
		function Kn(e) {
			let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md", r = A.value.boxes;
			return (r.find((e) => e.id === t) ?? r.find((e) => e.docPath === t) ?? r.find((e) => e.docPath === n))?.id;
		}
		function qn() {
			let e = J.value;
			if (!e) return;
			let t = A.value.boxes.find((t) => t.id === e.fromId);
			if (!t) return;
			let n = B(t.docPath);
			if (n === void 0) return;
			let r = O(), i = ye(n).filter((t) => Kn(Ee(t).ref) !== e.toId);
			V(t.docPath, Se(n, i)), k(r), q.value = null;
		}
		let Z = h(null), Q = h(null);
		function Jn(e, t) {
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
			Z.value = {
				name: t.name,
				startClientX: e.clientX,
				startClientY: e.clientY,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				scale: U(e.clientX, e.clientY).scale,
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
				scroller: Qt(Zt.value),
				panX: 0,
				panY: 0,
				before: O()
			}, window.addEventListener("pointermove", Yn), window.addEventListener("pointerup", Zn), window.addEventListener("pointercancel", Zn), N.value = null;
		}
		function Yn(e) {
			let t = Z.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Xn));
		}
		function Xn() {
			let e = Z.value;
			if (!e) return;
			e.raf = 0;
			let t = $t(e.lastClientX, e.lastClientY, e.scroller, e.scale);
			e.panX += t.px, e.panY += t.py;
			let n = Math.round((e.lastClientX - e.startClientX) / e.scale + e.panX), r = Math.round((e.lastClientY - e.startClientY) / e.scale + e.panY);
			if (!e.moved && Math.hypot(n, r) < 3) return;
			let i = [...F.value.filter((t) => !e.basePositions.has(t.id)), ...I.value.filter((t) => t.name !== e.name)], a = rn({
				x: e.baseRegion.x + n,
				y: e.baseRegion.y + r,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, i, e.scale, en), o = Math.min(e.baseRegion.x, ...[...e.basePositions.values()].map((e) => e.x)), s = Math.min(e.baseRegion.y, ...[...e.basePositions.values()].map((e) => e.y)), c = Math.max(n + (a.dx ?? 0), -o), l = Math.max(r + (a.dy ?? 0), -s);
			Z.value = {
				...e,
				dx: c,
				dy: l,
				moved: !0
			};
			for (let [t, n] of e.basePositions) Lt(t, {
				x: n.x + c,
				y: n.y + l
			});
			G.value = a.dx !== void 0 || a.dy !== void 0 ? an({
				x: e.baseRegion.x + c,
				y: e.baseRegion.y + l,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, i, en) : [];
		}
		function Zn() {
			window.removeEventListener("pointermove", Yn), window.removeEventListener("pointerup", Zn), window.removeEventListener("pointercancel", Zn);
			let e = Z.value;
			if (Z.value = null, G.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = A.value.groups.find((t) => t.name === e.name);
			if (t) {
				for (let n of t.members) {
					let t = A.value.boxes.find((e) => e.id === n), r = e.basePositions.get(n);
					if (!t || !r) continue;
					let i = B(t.docPath);
					i !== void 0 && V(t.docPath, we(i, {
						x: r.x + e.dx,
						y: r.y + e.dy
					}));
				}
				if (t.explicit) {
					let n = B(t.holder);
					n !== void 0 && V(t.holder, Ce(n, ke({
						name: t.name,
						x: e.baseRegion.x + e.dx,
						y: e.baseRegion.y + e.dy,
						w: e.baseRegion.w,
						h: e.baseRegion.h
					})));
				}
				k(e.before);
			}
		}
		function Qn(e, t) {
			if (!L.value || e.button !== 0) return;
			e.preventDefault();
			let n = I.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = t.members.map((e) => F.value.find((t) => t.id === e)).filter((e) => !!e), i = Math.max(...r.map((e) => e.x + e.w)), a = Math.max(...r.map((e) => e.y + e.h));
			Q.value = {
				name: t.name,
				startClientX: e.clientX,
				startClientY: e.clientY,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				scale: U(e.clientX, e.clientY).scale,
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
				before: O()
			}, window.addEventListener("pointermove", $n), window.addEventListener("pointerup", tr), window.addEventListener("pointercancel", tr), N.value = null;
		}
		function $n(e) {
			let t = Q.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(er));
		}
		function er() {
			let e = Q.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = Math.round(e.baseRegion.w + t), i = Math.round(e.baseRegion.h + n), a = [...F.value.filter((t) => !e.memberIds.has(t.id)), ...I.value.filter((t) => t.name !== e.name)], o = rn({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: r,
				h: i
			}, a, e.scale, tn), s = Math.max(e.minW, Math.round(r + (o.dx ?? 0))), c = Math.max(e.minH, Math.round(i + (o.dy ?? 0)));
			Q.value = {
				...e,
				curW: s,
				curH: c,
				moved: !0
			}, G.value = o.dx !== void 0 || o.dy !== void 0 ? an({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: s,
				h: c
			}, a, tn) : [];
		}
		function tr() {
			window.removeEventListener("pointermove", $n), window.removeEventListener("pointerup", tr), window.removeEventListener("pointercancel", tr);
			let e = Q.value;
			if (Q.value = null, G.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = A.value.groups.find((t) => t.name === e.name);
			if (!t) return;
			let n = B(t.holder);
			n !== void 0 && (V(t.holder, Ce(n, ke({
				name: t.name,
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: e.curW,
				h: e.curH
			}))), k(e.before));
		}
		function nr(e) {
			if (w.value.has(e.docPath)) {
				let t = O();
				w.value = new Set([...w.value].filter((t) => t !== e.docPath)), k(t);
				return;
			}
			if (z.has(e.docPath) && !(e.docPath in b.files)) {
				rr(e);
				return;
			}
			Kt("删除文档", `「${e.title}」（${e.docPath}）将在「💾 保存」后从磁盘删除，保存前可撤销。确定标记删除？`, () => rr(e));
		}
		function rr(e) {
			let t = O();
			if (C.value.has(e.docPath)) {
				let t = new Map(C.value);
				t.delete(e.docPath), C.value = t;
			}
			z.delete(e.docPath), e.docPath in b.files && (w.value = /* @__PURE__ */ new Set([...w.value, e.docPath])), k(t);
		}
		function ir(e) {
			if (!(j.value || !L.value) && !Y.value) {
				if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z" || e.key === "y")) {
					e.preventDefault(), e.key === "y" || e.shiftKey ? Ne() : je();
					return;
				}
				if (e.key === "Escape") {
					if (q.value) {
						q.value = null;
						return;
					}
					R.value !== "select" && (R.value = "select");
					return;
				}
				q.value && (e.key === "Delete" || e.key === "Backspace") && (e.preventDefault(), qn());
			}
		}
		let ar = t(() => j.value ? A.value.boxes.find((e) => e.docPath === j.value)?.title ?? j.value : "");
		function or() {
			let e = j.value ? `#${encodeURIComponent(j.value)}` : "#";
			if (window.location.hash === e) {
				history.replaceState(null, "", e);
				return;
			}
			history.pushState(null, "", e);
		}
		function sr() {
			let e = window.location.hash, t = null;
			if (e.length > 1) try {
				t = decodeURIComponent(e.slice(1));
			} catch {
				t = null;
			}
			$.value = !1, j.value = t && b.files[t] ? t : null;
		}
		function cr(e) {
			if (b.files[e]) {
				if (j.value === e) {
					$.value = !1;
					return;
				}
				$.value = !1, j.value = e, me("navigate", e), or();
			}
		}
		function lr(e) {
			document.querySelector(`.pd-doc-view [data-heading-id$="-${e}"]`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function ur(e, t) {
			if (j.value === e) {
				lr(t);
				return;
			}
			cr(e), l(() => {
				setTimeout(() => lr(t), 80), setTimeout(() => lr(t), 320);
			});
		}
		function dr() {
			if ($.value && mr.value) {
				Kt("丢弃未保存的修改？", "正文有未保存的修改，返回图画布将丢弃这些修改。", fr);
				return;
			}
			fr();
		}
		function fr() {
			$.value = !1, j.value = null, or(), l(() => requestAnimationFrame(() => Dt.value?.fit?.()));
		}
		te(() => b.files, (e) => {
			if (H.value = !1, j.value && !e[j.value] && fr(), C.value.size) {
				let t = new Map(C.value);
				for (let [n, r] of t) e[n] === r ? (t.delete(n), z.delete(n)) : e[n] === void 0 && !z.has(n) && t.delete(n);
				C.value = t;
			}
			if (w.value.size) {
				let t = new Set([...w.value].filter((t) => e[t] !== void 0));
				t.size !== w.value.size && (w.value = t);
			}
			if (!P.value) return;
			let t = A.value.boxes, n = new Map(P.value);
			for (let [e, r] of n) {
				let i = t.find((t) => t.id === e);
				(!i || i.x === r.x && i.y === r.y) && n.delete(e);
			}
			P.value = n.size > 0 ? n : null;
		});
		let $ = h(!1), pr = h(""), mr = t(() => j.value !== null && pr.value !== (b.files[j.value] ?? ""));
		function hr() {
			j.value && (pr.value = b.files[j.value] ?? "", $.value = !0);
		}
		function gr(e) {
			cr(e), hr();
		}
		function _r() {
			$.value = !1;
		}
		async function vr() {
			if (!j.value || !mr.value) return;
			let e = await ve(j.value, pr.value, b.files[j.value]);
			e.ok || xe("保存", j.value, e);
		}
		function yr(e) {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), vr());
		}
		function br(e, t) {
			if (L.value) {
				if (R.value !== "select") return;
				let n = e.shiftKey ? 10 : 1, r = {
					ArrowLeft: [-n, 0],
					ArrowRight: [n, 0],
					ArrowUp: [0, -n],
					ArrowDown: [0, n]
				}[e.key];
				if (!r) return;
				e.preventDefault(), Sr(t, r[0], r[1]);
				return;
			}
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), cr(t.docPath));
		}
		let xr = null;
		function Sr(e, t, n) {
			let r = Math.max(0, Math.round(e.x + t)), i = Math.max(0, Math.round(e.y + n));
			if (r === e.x && i === e.y) return;
			let a = Date.now(), o = xr?.id === e.id && a - xr.time < 800 ? null : O();
			xr = {
				id: e.id,
				time: a
			}, Lt(e.id, {
				x: r,
				y: i
			});
			let s = B(e.docPath);
			s !== void 0 && (V(e.docPath, we(s, {
				x: r,
				y: i
			})), o && k(o));
		}
		function Cr(e, t) {
			if (/^(https?:|mailto:)/.test(t)) return null;
			let [n, r] = t.split("#"), i = n.trim(), a = r?.trim(), o;
			if (a) try {
				o = Me(decodeURIComponent(a));
			} catch {
				o = Me(a);
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
		function wr(e) {
			if (!j.value) return;
			let t = Cr(j.value, e);
			t && (t.anchor ? ur(t.path, t.anchor) : cr(t.path));
		}
		function Tr(e) {
			if (!j.value) return;
			let t = b.files[j.value];
			if (t === void 0) return;
			let n = ge(t, e.source, e.id, e.x, e.y);
			if (n === t) return;
			let r = j.value;
			ve(r, n, t).then((e) => {
				e.ok || xe("保存", r, e);
			});
		}
		if (typeof window < "u" && window.location.hash.length > 1) {
			let e = decodeURIComponent(window.location.hash.slice(1));
			b.files[e] && (j.value = e);
		}
		return (t, l) => (m(), i("div", ze, [a("header", Be, [
			l[16] ||= a("span", { class: "pd-graph-brand" }, "📚 ProDoc", -1),
			j.value ? (m(), i("span", Ve, _(ar.value), 1)) : r("", !0),
			a("div", He, [
				j.value ? r("", !0) : (m(), i(e, { key: 0 }, [L.value ? (m(), i(e, { key: 1 }, [
					a("button", {
						class: "pd-back-btn",
						disabled: E.value.length === 0,
						title: "撤销（Ctrl+Z）",
						"aria-label": "撤销",
						onClick: je
					}, "↶", 8, Ue),
					a("button", {
						class: "pd-back-btn",
						disabled: D.value.length === 0,
						title: "重做（Ctrl+Shift+Z / Ctrl+Y）",
						"aria-label": "重做",
						onClick: Ne
					}, "↷", 8, We),
					a("button", {
						class: "pd-back-btn",
						disabled: !T.value || H.value,
						onClick: Jt
					}, "💾 保存", 8, Ge),
					T.value ? (m(), i("button", {
						key: 0,
						class: "pd-back-btn",
						disabled: H.value,
						onClick: Yt
					}, "↩ 放弃更改", 8, Ke)) : (m(), i("button", {
						key: 1,
						class: "pd-back-btn pd-back-btn--active",
						onClick: Xt
					}, "✓ 完成"))
				], 64)) : (m(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: Xt
				}, "🛠 编辑图")), a("button", {
					class: "pd-back-btn",
					onClick: zt
				}, _(P.value ? "↩ 恢复坐标" : "🧭 分层重排"), 1)], 64)),
				j.value ? (m(), i(e, { key: 1 }, [$.value ? (m(), i(e, { key: 1 }, [a("button", {
					class: "pd-back-btn",
					disabled: !mr.value,
					onClick: vr
				}, "💾 保存", 8, qe), a("button", {
					class: "pd-back-btn",
					onClick: _r
				}, "👁 预览")], 64)) : (m(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: hr
				}, "✏️ 编辑")), a("button", {
					class: "pd-back-btn",
					onClick: dr
				}, "🗺 返回图")], 64)) : r("", !0),
				A.value.warnings.length ? (m(), n(v(ce), {
					key: 2,
					trigger: "click",
					position: "bottom",
					width: 360
				}, {
					default: ne(() => [a("span", Je, [s(v(ae), { value: A.value.warnings.length }, {
						default: ne(() => [...l[15] ||= [a("button", {
							class: "pd-back-btn",
							type: "button",
							title: "解析告警明细"
						}, "⚠️", -1)]]),
						_: 1
					}, 8, ["value"])])]),
					content: ne(() => [a("ul", Ye, [(m(!0), i(e, null, g(A.value.warnings, (e) => (m(), i("li", { key: e }, _(e), 1))), 128))])]),
					_: 1
				})) : r("", !0),
				s(v(le), { size: "small" })
			])
		]), a("div", Xe, [
			j.value ? (m(), i("div", {
				key: 1,
				class: u(["pd-doc-view", { "pd-doc-view--editing": $.value }])
			}, [$.value ? (m(), n(v(pe), {
				key: j.value,
				value: pr.value,
				class: "pd-doc-editor",
				onChange: l[10] ||= (e) => pr.value = e,
				onKeydown: yr
			}, null, 8, ["value"])) : (m(), n(v(he), {
				key: j.value,
				content: Et.value[j.value],
				"show-toc": !0,
				"flow-editable": !0,
				onDocLink: wr,
				onFlowNodeMove: Tr
			}, null, 8, ["content"]))], 2)) : (m(), n(v(oe), {
				key: 0,
				ref_key: "canvasRef",
				ref: Dt,
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
					ref: Zt,
					class: u(["pd-graph-stage", {
						"pd-graph-stage--dragging": W.value?.moved || K.value || X.value || Z.value?.moved || Q.value?.moved,
						"pd-graph-stage--editing": L.value,
						"pd-graph-stage--tool-link": L.value && R.value === "link",
						"pd-graph-stage--tool-node": L.value && R.value === "node"
					}]),
					style: d({
						width: `${M.value.w}px`,
						height: `${M.value.h}px`
					}),
					onPointerdown: An,
					onClick: l[9] ||= (e) => {
						q.value = null, mn.value = null;
					}
				}, [
					(m(!0), i(e, null, g(I.value, (e) => (m(), i("div", {
						key: "group-" + e.name,
						class: u(["pd-doc-group", { "pd-dim": Rt(e) }]),
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
						onPointerdown: (t) => Jn(t, e)
					}, _(e.name), 41, Ze), L.value ? (m(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-group__resize",
						"aria-label": `调整组「${e.name}」的区域尺寸`,
						title: "拖动调整区域尺寸",
						"data-nm-no-pan": "",
						onPointerdown: y((t) => Qn(t, e), ["stop"])
					}, null, 40, Qe)) : r("", !0)], 6))), 128)),
					jt.value.length || Dn.value ? (m(), i("svg", {
						key: 0,
						class: "pd-relation-layer",
						width: M.value.w,
						height: M.value.h,
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
						(m(!0), i(e, null, g(jt.value, (e) => (m(), i("g", {
							key: e.id,
							class: u(["pd-relation", {
								"pd-dim": It(e),
								"pd-hot": Ft(e),
								"pd-selected": e.id === q.value,
								"pd-relation--new": e.id === gn.value
							}])
						}, [
							a("title", null, _(e.fromTitle) + " → " + _(e.toTitle) + _(e.label ? `（${e.label}）` : ""), 1),
							a("path", {
								class: "pd-relation-hit",
								d: e.d,
								fill: "none",
								onClick: y((t) => Nn(e), ["stop"]),
								onDblclick: y((t) => Fn(e), ["stop"])
							}, null, 40, et),
							a("path", {
								d: e.d,
								fill: "none",
								"marker-end": "url(#pd-relation-arrow)",
								"pointer-events": "none"
							}, null, 8, tt),
							e.label ? (m(), i("text", {
								key: 0,
								x: e.labelX,
								y: e.labelY,
								"pointer-events": "none"
							}, _(e.label), 9, nt)) : r("", !0)
						], 2))), 128)),
						Dn.value ? (m(), i("path", {
							key: 0,
							class: "pd-relation-draft",
							d: Dn.value,
							fill: "none"
						}, null, 8, rt)) : r("", !0),
						(m(!0), i(e, null, g(G.value, (e, t) => (m(), i("line", {
							key: "guide" + t,
							class: "pd-guide",
							x1: e.axis === "x" ? e.pos : e.start,
							y1: e.axis === "x" ? e.start : e.pos,
							x2: e.axis === "x" ? e.pos : e.end,
							y2: e.axis === "x" ? e.end : e.pos
						}, null, 8, it))), 128))
					], 8, $e)) : r("", !0),
					(m(!0), i(e, null, g(F.value, (t) => (m(), i("div", {
						key: t.id,
						class: u(["pd-doc-box", [`pd-doc-box--d${Math.min(t.depth, 3)}`, {
							"pd-dim": Pt(t.id),
							"pd-doc-box--link-target": On(t) === "valid",
							"pd-doc-box--link-invalid": On(t) === "invalid",
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
						onPointerdown: (e) => cn(e, t),
						onClick: (e) => hn(t),
						onKeydown: (e) => br(e, t),
						onMouseenter: (e) => Mt(t.id),
						onMouseleave: l[2] ||= (e) => Mt(null)
					}, [
						a("div", ot, [a("span", {
							class: "pd-doc-box__title",
							title: t.title
						}, _(t.title), 9, st), l[18] ||= a("span", {
							class: "pd-doc-box__icon",
							"aria-hidden": "true"
						}, "↗", -1)]),
						L.value ? r("", !0) : (m(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-box__edit",
							"aria-label": `编辑 ${t.title}`,
							title: "编辑文档",
							onClick: y((e) => gr(t.docPath), ["stop"]),
							onKeydown: [ie(y((e) => gr(t.docPath), ["stop"]), ["enter"]), ie(y((e) => gr(t.docPath), ["stop"]), ["space"])]
						}, "✏️", 40, ct)),
						L.value && c.deleteHandler ? (m(), i("button", {
							key: 1,
							type: "button",
							class: u(["pd-doc-box__delete", { "pd-doc-box__delete--armed": w.value.has(t.docPath) }]),
							"aria-label": w.value.has(t.docPath) ? `撤销删除 ${t.title}` : `删除 ${t.title}`,
							title: w.value.has(t.docPath) ? "撤销删除标记" : "标记删除（💾 保存后生效）",
							onClick: y((e) => nr(t), ["stop"]),
							onPointerdown: l[0] ||= y(() => {}, ["stop"])
						}, _(w.value.has(t.docPath) ? "↩" : "✕"), 43, lt)) : r("", !0),
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
							onPointerdown: y((n) => bn(n, t, e), ["stop"]),
							onClick: l[1] ||= y(() => {}, ["stop"])
						}, null, 42, ut)), 64)) : r("", !0),
						t.blocks.length && !L.value ? (m(), i("div", {
							key: 3,
							class: u(["pd-doc-blocks-pop", {
								"pd-doc-blocks-pop--above": Ut(t, M.value.h),
								"pd-doc-blocks-pop--force": mn.value === t.id
							}])
						}, [a("div", dt, [(m(!0), i(e, null, g(Bt(t), (e) => (m(), i("button", {
							key: e.anchor,
							type: "button",
							class: "pd-doc-blocks-pop__item",
							title: e.title,
							"aria-label": `跳转到「${e.title}」分块`,
							onClick: y((n) => ur(t.docPath, e.anchor), ["stop"]),
							onKeydown: [ie(y((n) => ur(t.docPath, e.anchor), ["stop"]), ["enter"]), ie(y((n) => ur(t.docPath, e.anchor), ["stop"]), ["space"])]
						}, "▸ " + _(e.title), 41, ft))), 128)), Vt(t) > 0 ? (m(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more",
							"aria-label": `查看全部 ${t.blocks.length} 个分块`,
							onClick: y((e) => cr(t.docPath), ["stop"])
						}, "+" + _(Vt(t)) + " 更多分块…", 9, pt)) : r("", !0)])], 2)) : r("", !0)
					], 46, at))), 128)),
					L.value && J.value && !Y.value ? (m(), i("button", {
						key: 1,
						type: "button",
						class: "pd-edge-delete",
						style: d({
							left: `${J.value.delX}px`,
							top: `${J.value.delY}px`
						}),
						"aria-label": `删除连线 ${J.value.fromTitle} → ${J.value.toTitle}`,
						title: "删除连线（Delete）",
						onClick: y(qn, ["stop"])
					}, "✕", 12, mt)) : r("", !0),
					L.value && J.value && Y.value && Y.value.edgeId === J.value.id ? re((m(), i("input", {
						key: 2,
						ref_key: "labelInputEl",
						ref: Pn,
						"onUpdate:modelValue": l[3] ||= (e) => Y.value.value = e,
						type: "text",
						class: "pd-edge-label-input",
						style: d({
							left: `${J.value.labelX}px`,
							top: `${J.value.labelY}px`
						}),
						"aria-label": `编辑连线标签 ${J.value.fromTitle} → ${J.value.toTitle}`,
						placeholder: "连线标签（留空移除）",
						"data-nm-no-pan": "",
						onKeydown: [ie(y(In, ["prevent"]), ["enter"]), ie(y(Ln, ["prevent"]), ["esc"])],
						onBlur: In,
						onClick: l[4] ||= y(() => {}, ["stop"])
					}, null, 44, ht)), [[ee, Y.value.value]]) : r("", !0),
					L.value && J.value ? (m(), i("svg", {
						key: 3,
						class: "pd-relation-layer pd-relation-layer--top",
						width: M.value.w,
						height: M.value.h,
						"aria-hidden": "true"
					}, [a("g", _t, [a("circle", {
						class: "pd-edge-handle",
						cx: J.value.x1,
						cy: J.value.y1,
						r: "6"
					}, null, 8, vt), a("circle", {
						class: "pd-edge-handle-halo",
						cx: J.value.x1,
						cy: J.value.y1,
						r: "12",
						onPointerdown: l[5] ||= y((e) => zn(e, J.value, "from"), ["stop"]),
						onClick: l[6] ||= y(() => {}, ["stop"])
					}, [...l[19] ||= [a("title", null, "拖动调整源框连接边", -1)]], 40, yt)]), a("g", bt, [a("circle", {
						class: "pd-edge-handle",
						cx: J.value.x2,
						cy: J.value.y2,
						r: "6"
					}, null, 8, xt), a("circle", {
						class: "pd-edge-handle-halo",
						cx: J.value.x2,
						cy: J.value.y2,
						r: "12",
						onPointerdown: l[7] ||= y((e) => zn(e, J.value, "to"), ["stop"]),
						onClick: l[8] ||= y(() => {}, ["stop"])
					}, [...l[20] ||= [a("title", null, "拖动调整目标框连接边", -1)]], 40, St)])], 8, gt)) : r("", !0)
				], 38)]),
				_: 1
			}, 512)),
			!j.value && L.value ? (m(), i("div", Ct, [
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
				modelValue: Gt.value,
				"onUpdate:modelValue": l[14] ||= (e) => Gt.value = e,
				title: Wt.value.title,
				size: "small",
				"confirm-label": "确认",
				"cancel-label": "取消",
				onConfirm: qt
			}, {
				default: ne(() => [o(_(Wt.value.message), 1)]),
				_: 1
			}, 8, ["modelValue", "title"])
		])]));
	}
});
//#endregion
export { fe as DocFlowCanvas, Tt as DocGraphViewer, b as DocViewer, me as MarkdownRenderer };

//# sourceMappingURL=index.js.map