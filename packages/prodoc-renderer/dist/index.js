import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createTextVNode as o, createVNode as s, defineComponent as c, nextTick as l, normalizeClass as u, normalizeStyle as d, onBeforeUnmount as f, onMounted as p, openBlock as m, ref as h, renderList as g, toDisplayString as _, unref as v, vModelText as ee, watch as te, withCtx as ne, withDirectives as re, withKeys as y, withModifiers as b } from "vue";
import { NeumorphismBadge as ie, NeumorphismCanvas as ae, NeumorphismModal as oe, NeumorphismPopover as se, NeumorphismThemeToggle as ce, NeumorphismToastProvider as le, useTouchDevice as ue } from "@echolab-auto/ui-frame";
import { DocFlowCanvas as de, DocViewer as x, MarkdownEditor as fe, MarkdownRenderer as pe, MarkdownRenderer as me, writeFlowNodePosition as he } from "@echolab-auto/ui-frame/doc";
import "@echolab-auto/ui-frame/dist/style.css";
//#region ../prodoc-core/dist/graph-C2fVzQvi.js
function ge(e) {
	let t = [], n = "", r = null;
	for (let i of e) r ? (n += i, i === r && (r = null)) : i === "\"" || i === "'" ? (r = i, n += i) : i === "," ? (t.push(n), n = "") : n += i;
	return t.push(n), t;
}
function S(e) {
	let t = e.trim();
	if (t === "") return "";
	if (t.startsWith("[") && t.endsWith("]")) return ge(t.slice(1, -1)).map((e) => S(e)).filter((e) => e !== "");
	if (t === "true") return !0;
	if (t === "false") return !1;
	if (/^-?\d+$/.test(t)) return parseInt(t, 10);
	if (/^-?\d*\.\d+$/.test(t)) return parseFloat(t);
	let n = t.match(/^(["'])([\s\S]*)\1$/);
	return n ? n[2] : t;
}
function C(e) {
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
		i[n] = S(r);
	}
	return {
		params: i,
		body: n.slice(r + 1).join("\n"),
		hasFrame: !0
	};
}
function _e(e) {
	return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).filter((e) => typeof e == "string").map((e) => e.trim()).filter(Boolean);
}
function ve(e) {
	return _e(C(e).params.link);
}
function ye(e) {
	return e === "" || e !== e.trim() || /[|,"]/.test(e) ? e.includes("\"") ? `'${e}'` : `"${e}"` : e;
}
function be(e, t, n) {
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!C(e).hasFrame) return n === null ? e : `---${r}${n}${r}---${r}${e}`;
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
function xe(e, t) {
	return be(e, "link", t.length > 0 ? `link: [${t.map(ye).join(", ")}]` : null);
}
function Se(e, t) {
	return be(e, "group", t === null ? null : `group: ${ye(t)}`);
}
function Ce(e, t) {
	let n = Object.entries(t).filter((e) => (e[0] === "x" || e[0] === "y") && typeof e[1] == "number" && Number.isFinite(e[1]));
	if (n.length === 0) return e;
	let r = e.includes("\r\n") ? "\r\n" : "\n";
	if (!C(e).hasFrame) return `---${r}${n.map(([e, t]) => `${e}: ${t}`).join(r)}${r}---${r}${e}`;
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
}, we = /^([trbl_])>([trbl_])$/;
function Te(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(we);
		t ? (t[1] !== "_" && (n.fromSide = O[t[1]]), t[2] !== "_" && (n.toSide = O[t[2]])) : e !== "" && (n.label = e);
	}
	return n;
}
function Ee(e) {
	let t = e.ref;
	if (e.label && (t += ` | ${e.label}`), e.fromSide || e.toSide) {
		let n = e.fromSide ? k[e.fromSide] : "_", r = e.toSide ? k[e.toSide] : "_";
		t += ` | ${n}>${r}`;
	}
	return t;
}
var A = /^(.*)\s*@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
function De(e) {
	let t = e.match(A);
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
		let { params: t, body: s } = C(e[o]), c = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : o.replace(/\.md$/, ""), l = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || Ae(s) || c, u = Ne(s), d = D(t.w) ?? 220, f = D(t.h) ?? 96, p = {};
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
			if (e.length > 1 && n.push(`文档 "${c}" 声明了多个 group，仅取第一个 "${De(e[0]).name || e[0]}"`), e.length > 0) {
				let { name: t, geo: n } = De(e[0]);
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
		let { params: n } = C(e[t.docPath]);
		for (let e of _e(n.link)) {
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
], it = {
	key: 1,
	class: "pd-edge-handles"
}, at = ["cx", "cy"], ot = ["cx", "cy"], st = ["aria-label"], ct = ["aria-label", "onKeydown"], lt = [
	"aria-label",
	"onPointerdown",
	"onClick",
	"onKeydown",
	"onMouseenter"
], ut = { class: "pd-doc-box__head" }, dt = ["title"], ft = [
	"aria-label",
	"onClick",
	"onKeydown"
], pt = [
	"aria-label",
	"title",
	"onClick"
], mt = ["aria-label", "onPointerdown"], ht = {
	class: "pd-doc-blocks-pop__card",
	role: "menu"
}, gt = [
	"title",
	"aria-label",
	"onClick",
	"onKeydown"
], _t = ["aria-label", "onClick"], vt = {
	key: 2,
	class: "pd-edit-toolbar",
	role: "toolbar",
	"aria-label": "图编辑工具栏"
}, yt = 30, bt = /* @__PURE__ */ c({
	__name: "DocGraphViewer",
	props: {
		files: {},
		saveHandler: { type: Function },
		deleteHandler: { type: Function }
	},
	emits: ["navigate", "save"],
	setup(c, { emit: de }) {
		let x = c, pe = de, ge = h(null);
		function S(e, t = "info", n = 4e3) {
			ge.value?.addToast({
				message: e,
				type: t,
				duration: n
			});
		}
		async function _e(e, t, n) {
			if (x.saveHandler) {
				let r = await x.saveHandler(e, t, n);
				return typeof r == "object" ? r : { ok: r };
			}
			return pe("save", e, t, n), { ok: !0 };
		}
		async function ye(e, t) {
			if (!x.deleteHandler) return {
				ok: !1,
				error: "当前环境不支持删除文档"
			};
			let n = await x.deleteHandler(e, t);
			return typeof n == "object" ? n : { ok: n };
		}
		function be(e, t, n) {
			n.status === 409 ? S(`「${t}」在磁盘上已被其他程序修改，${e}被拒绝。该文件的暂存已保留，可刷新页面同步后重试（或「↩ 放弃更改」丢弃）。`, "error", 8e3) : S(`「${t}」${e}失败：${n.error ?? "未知错误"}`, "error", 6e3);
		}
		let w = h(/* @__PURE__ */ new Map()), T = h(/* @__PURE__ */ new Set()), E = t(() => w.value.size > 0 || T.value.size > 0), D = h([]), O = h([]);
		function k() {
			return {
				drafts: [...w.value],
				newPaths: [...B],
				deletes: [...T.value],
				overrides: I.value ? [...I.value] : null
			};
		}
		function we(e, t) {
			if (e.deletes.length !== t.deletes.length || e.newPaths.length !== t.newPaths.length || e.drafts.length !== t.drafts.length || (e.overrides?.length ?? 0) !== (t.overrides?.length ?? 0)) return !1;
			let n = new Map(e.drafts);
			if (!t.drafts.every(([e, t]) => n.get(e) === t) || !e.deletes.every((e) => t.deletes.includes(e)) || !e.newPaths.every((e) => t.newPaths.includes(e))) return !1;
			let r = new Map(e.overrides ?? []);
			return (t.overrides ?? []).every(([e, t]) => r.get(e)?.x === t.x && r.get(e)?.y === t.y);
		}
		function A(e) {
			we(e, k()) || (D.value = [...D.value, e], O.value = []);
		}
		function De(e) {
			w.value = new Map(e.drafts), B = new Set(e.newPaths), T.value = new Set(e.deletes), I.value = e.overrides ? new Map(e.overrides) : null;
		}
		function Ae() {
			let e = D.value[D.value.length - 1];
			e && (D.value = D.value.slice(0, -1), O.value = [...O.value, k()], De(e));
		}
		function Me() {
			let e = O.value[O.value.length - 1];
			e && (O.value = O.value.slice(0, -1), D.value = [...D.value, k()], De(e));
		}
		let Ne = `prodoc-drafts:${typeof location < "u" ? location.origin : ""}`;
		function Pe() {
			try {
				if (!E.value) {
					localStorage.removeItem(Ne);
					return;
				}
				localStorage.setItem(Ne, JSON.stringify({
					v: 1,
					drafts: [...w.value].map(([e, t]) => ({
						path: e,
						base: x.files[e] ?? null,
						content: t
					})),
					deletes: [...T.value].map((e) => ({
						path: e,
						base: x.files[e] ?? null
					}))
				}));
			} catch {}
		}
		function Fe() {
			let e = null;
			try {
				e = localStorage.getItem(Ne), localStorage.removeItem(Ne);
			} catch {
				return 0;
			}
			if (!e) return 0;
			try {
				let t = JSON.parse(e), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
				for (let e of t.drafts ?? []) {
					let t = x.files[e.path];
					t !== e.content && (e.base !== null && t !== e.base || e.base === null && t !== void 0 || (n.set(e.path, e.content), t === void 0 && B.add(e.path)));
				}
				for (let e of t.deletes ?? []) {
					let t = x.files[e.path];
					t !== void 0 && (e.base !== null && t !== e.base || r.add(e.path));
				}
				let i = n.size + r.size;
				return i > 0 && (w.value = n, T.value = r), i;
			} catch {
				return 0;
			}
		}
		te([w, T], Pe);
		let bt = t(() => w.value.size ? {
			...x.files,
			...Object.fromEntries(w.value)
		} : x.files), j = t(() => Le(bt.value)), xt = t(() => Object.fromEntries(Object.entries(x.files).map(([e, t]) => [e, C(t).body])));
		te(() => j.value.warnings, (e) => e.forEach((e) => console.warn("[ProDoc]", e)), { immediate: !0 });
		let M = h(null), St = h(null), N = t(() => {
			let e = 0, t = 0;
			for (let n of L.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			for (let n of Mt.value) e = Math.max(e, n.x + n.w + 48), t = Math.max(t, n.y + n.h + 48);
			return {
				w: Math.max(e, 640),
				h: Math.max(t, 480)
			};
		});
		function Ct(e, t) {
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
		function wt(e, t) {
			let n = e.x + e.w / 2, r = e.y + e.h / 2, i = t.x + t.w / 2 - n, a = t.y + t.h / 2 - r;
			return Math.abs(a) >= Math.abs(i) ? {
				fs: a >= 0 ? "bottom" : "top",
				ts: a >= 0 ? "top" : "bottom"
			} : {
				fs: i >= 0 ? "right" : "left",
				ts: i >= 0 ? "left" : "right"
			};
		}
		function Tt(e, t, n, r) {
			let i = wt(e, t), a = Ct(e, n ?? i.fs), o = Ct(t, r ?? i.ts), s = Math.hypot(o.x - a.x, o.y - a.y), c = Math.max(24, Math.min(s * .45, 96)), l = `M ${a.x} ${a.y} C ${a.x + a.nx * c} ${a.y + a.ny * c}, ${o.x + o.nx * c} ${o.y + o.ny * c}, ${o.x} ${o.y}`;
			return {
				x1: a.x,
				y1: a.y,
				x2: o.x,
				y2: o.y,
				d: l
			};
		}
		let P = t(() => {
			let e = new Map(L.value.map((e) => [e.id, e])), t = X.value;
			return j.value.relations.flatMap((n) => {
				let r = e.get(n.from), i = e.get(n.to);
				if (!r || !i) return [];
				let a = n.fromSide, o = n.toSide;
				t && t.edgeId === n.id && (t.which === "from" ? a = t.side : o = t.side);
				let { x1: s, y1: c, x2: l, y2: u, d } = Tt(r, i, a, o), f = (s + l) / 2, p = (c + u) / 2 - 7, m = l - s, h = u - c, g = Math.hypot(m, h) || 1;
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
		}), F = h(null);
		function Et(e) {
			W.value || K.value || X.value || (F.value = e);
		}
		let Dt = t(() => {
			if (!F.value) return /* @__PURE__ */ new Set();
			let e = /* @__PURE__ */ new Set([F.value]);
			for (let t of j.value.relations) t.from === F.value && e.add(t.to), t.to === F.value && e.add(t.from);
			return e;
		}), Ot = (e) => F.value !== null && !Dt.value.has(e), kt = (e) => F.value !== null && (e.fromId === F.value || e.toId === F.value), At = (e) => F.value !== null && !kt(e), I = h(null), L = t(() => j.value.boxes.map((e) => {
			let t = I.value?.get(e.id);
			return t ? {
				...e,
				x: t.x,
				y: t.y
			} : e;
		}));
		function jt(e, t) {
			let n = new Map(I.value ?? []);
			n.set(e, t), I.value = n;
		}
		let Mt = t(() => {
			let e = Z.value, t = Q.value;
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
				let r = n.members.map((e) => L.value.find((t) => t.id === e)).filter((e) => !!e);
				return {
					...n,
					...ke(r)
				};
			});
		}), Nt = (e) => F.value !== null && !e.members.some((e) => Dt.value.has(e));
		function Pt() {
			if (I.value) {
				I.value = null;
				return;
			}
			let e = Ie(j.value.boxes, j.value.relations);
			if (R.value) for (let t of w.value.keys()) {
				let n = j.value.boxes.find((e) => e.docPath === t);
				n && e.delete(n.id);
			}
			I.value = e;
		}
		let Ft = (e) => e.blocks.slice(0, 6), It = (e) => Math.max(0, e.blocks.length - 6), Lt = (e) => (Ft(e).length + +(It(e) > 0)) * yt + 12, Rt = (e, t) => e.y + e.h + 6 + Lt(e) > t, R = h(!1), z = h("select"), B = /* @__PURE__ */ new Set(), zt = h({
			title: "",
			message: "",
			action: null
		}), Bt = h(!1);
		function Vt(e, t, n) {
			zt.value = {
				title: e,
				message: t,
				action: n
			}, Bt.value = !0;
		}
		function Ht() {
			Bt.value = !1, zt.value.action?.();
		}
		function V(e) {
			return w.value.get(e) ?? x.files[e];
		}
		function H(e, t) {
			let n = new Map(w.value);
			t === x.files[e] ? (n.delete(e), B.delete(e)) : (n.set(e, t), e in x.files || B.add(e)), w.value = n;
		}
		let Ut = h(!1);
		async function Wt() {
			if (!E.value || Ut.value) return;
			Ut.value = !0;
			let e = [], t = [];
			for (let [t, n] of w.value) {
				let r = await _e(t, n, x.files[t]);
				r.ok || (e.push(t), be("保存", t, r));
			}
			for (let e of T.value) {
				let n = await ye(e, x.files[e]);
				n.ok || (t.push(e), be("删除", e, n));
			}
			if (e.length > 0 || t.length > 0) {
				let n = new Map(w.value);
				for (let t of n.keys()) e.includes(t) || (n.delete(t), B.delete(t));
				w.value = n, T.value = new Set([...T.value].filter((e) => t.includes(e)));
			} else w.value = /* @__PURE__ */ new Map(), T.value = /* @__PURE__ */ new Set(), B.clear(), D.value = [], O.value = [], S("图修改已保存", "success", 2500);
			Ut.value = !1;
		}
		function Gt() {
			if (!E.value) return;
			let e = new Set([...w.value.keys()].map((e) => j.value.boxes.find((t) => t.docPath === e)?.id).filter((e) => !!e));
			if (w.value = /* @__PURE__ */ new Map(), T.value = /* @__PURE__ */ new Set(), I.value) {
				let t = new Map(I.value);
				e.forEach((e) => t.delete(e)), I.value = t.size > 0 ? t : null;
			}
			q.value = null, z.value = "select", B.clear(), D.value = [], O.value = [], R.value = !1;
		}
		function Kt() {
			if (R.value) {
				if (E.value) return;
				q.value = null, z.value = "select", D.value = [], O.value = [], R.value = !1;
			} else R.value = !0;
		}
		let qt = h(null);
		function U(e, t) {
			let n = qt.value;
			if (!n) return {
				x: 0,
				y: 0,
				scale: 1
			};
			let r = n.getBoundingClientRect(), i = r.width / N.value.w || 1;
			return {
				x: (e - r.left) / i,
				y: (t - r.top) / i,
				scale: i
			};
		}
		let W = h(null);
		function Jt(e) {
			let t = e?.parentElement ?? null;
			for (; t;) {
				let e = getComputedStyle(t);
				if (/(auto|scroll)/.test(`${e.overflow} ${e.overflowX} ${e.overflowY}`)) return t;
				t = t.parentElement;
			}
			return null;
		}
		function Yt(e, t, n, r) {
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
		let G = h([]), Xt = {
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
		}, Zt = {
			x: ["end"],
			y: ["end"]
		};
		function Qt(e, t) {
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
		function $t(e, t, n, r) {
			let i = Math.min(Math.max(8 / n, 4), 12), a = {};
			for (let n of ["x", "y"]) {
				let o = Qt(e, n), s = r[n].map((e) => o[e]), c = null;
				for (let e of t) for (let t of Object.values(Qt(e, n))) for (let e of s) {
					let n = t - e;
					Math.abs(n) <= i && (c === null || Math.abs(n) < Math.abs(c)) && (c = n);
				}
				c !== null && (a[n === "x" ? "dx" : "dy"] = c);
			}
			return a;
		}
		function en(e, t, n) {
			let r = [], i = /* @__PURE__ */ new Set();
			for (let a of ["x", "y"]) {
				let o = Qt(e, a), s = n[a].map((e) => o[e]);
				for (let n of t) for (let t of Object.values(Qt(n, a))) {
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
		function tn(e, t, n, r) {
			let i = L.value.find((t) => t.id === e);
			if (!i) return {
				x: Math.max(0, Math.round(t)),
				y: Math.max(0, Math.round(n)),
				guides: []
			};
			let a = L.value.filter((t) => t.id !== e), o = $t({
				x: t,
				y: n,
				w: i.w,
				h: i.h
			}, a, r, Xt), s = Math.max(0, Math.round(t + (o.dx ?? 0))), c = Math.max(0, Math.round(n + (o.dy ?? 0)));
			return {
				x: s,
				y: c,
				guides: o.dx !== void 0 || o.dy !== void 0 ? en({
					x: s,
					y: c,
					w: i.w,
					h: i.h
				}, a, Xt) : []
			};
		}
		let nn = !1;
		function rn(e, t) {
			if (R.value && e.button === 0 && !e.target.closest("button")) {
				if (z.value === "link") {
					hn(e, t);
					return;
				}
				z.value !== "node" && (W.value = {
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
					scroller: Jt(qt.value),
					panX: 0,
					panY: 0,
					before: k()
				}, window.addEventListener("pointermove", an), window.addEventListener("pointerup", cn), window.addEventListener("pointercancel", cn), F.value = null);
			}
		}
		function an(e) {
			let t = W.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(on));
		}
		function on() {
			let e = W.value;
			if (!e) return;
			e.raf = 0;
			let t = Yt(e.lastClientX, e.lastClientY, e.scroller, e.scale);
			e.panX += t.px, e.panY += t.py;
			let n = (e.lastClientX - e.startClientX) / e.scale + e.panX, r = (e.lastClientY - e.startClientY) / e.scale + e.panY;
			if (!e.moved && Math.hypot(n, r) < 3) return;
			e.moved = !0;
			let i = tn(e.id, e.baseX + n, e.baseY + r, e.scale);
			jt(e.id, {
				x: i.x,
				y: i.y
			}), G.value = i.guides;
		}
		function sn() {
			let e = W.value;
			if (W.value = null, G.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			nn = !0;
			let t = I.value?.get(e.id);
			if (!t) return;
			let n = V(e.path);
			n !== void 0 && (H(e.path, Ce(n, t)), A(e.before));
		}
		function cn() {
			window.removeEventListener("pointermove", an), window.removeEventListener("pointerup", cn), window.removeEventListener("pointercancel", cn), sn();
		}
		let { isTouch: ln } = ue(), un = h(null);
		function dn(e) {
			if (nn) {
				nn = !1;
				return;
			}
			if (!R.value) {
				if (ln.value && e.blocks.length > 0 && un.value !== e.id) {
					un.value = e.id;
					return;
				}
				un.value = null, ir(e.docPath);
			}
		}
		let K = h(null), fn = h(null), pn = null;
		function mn(e, t) {
			let n = t.x - (e.x + e.w / 2), r = t.y - (e.y + e.h / 2);
			return Math.abs(n) * e.h > Math.abs(r) * e.w ? n >= 0 ? "right" : "left" : r >= 0 ? "bottom" : "top";
		}
		function hn(e, t, n) {
			if (!R.value || e.button !== 0) return;
			e.preventDefault();
			let r = U(e.clientX, e.clientY);
			K.value = {
				fromId: t.id,
				fromSide: n ?? mn(t, r),
				targetId: null,
				x: r.x,
				y: r.y,
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0,
				scroller: Jt(qt.value),
				before: k()
			}, window.addEventListener("pointermove", _n), window.addEventListener("pointerup", xn), window.addEventListener("pointercancel", bn), F.value = null;
		}
		function gn(e, t, n) {
			hn(e, t, n);
		}
		function _n(e) {
			let t = K.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(vn));
		}
		function vn() {
			let e = K.value;
			if (!e) return;
			e.raf = 0, Yt(e.lastClientX, e.lastClientY, e.scroller, 1);
			let t = U(e.lastClientX, e.lastClientY), n = L.value.find((e) => t.x >= e.x && t.x <= e.x + e.w && t.y >= e.y && t.y <= e.y + e.h);
			K.value = {
				...e,
				x: t.x,
				y: t.y,
				targetId: n?.id ?? null
			};
		}
		function yn() {
			window.removeEventListener("pointermove", _n), window.removeEventListener("pointerup", xn), window.removeEventListener("pointercancel", bn);
		}
		function bn() {
			yn();
			let e = K.value;
			e?.raf && cancelAnimationFrame(e.raf), K.value = null;
		}
		function xn(e) {
			yn();
			let t = K.value;
			if (t?.raf && cancelAnimationFrame(t.raf), K.value = null, !t) return;
			let n = U(e.clientX, e.clientY), r = L.value.find((e) => n.x >= e.x && n.x <= e.x + e.w && n.y >= e.y && n.y <= e.y + e.h);
			!r || r.id === t.fromId || j.value.relations.some((e) => e.from === t.fromId && e.to === r.id) || Sn(t.fromId, r.id, t.fromSide, mn(r, n), t.before);
		}
		function Sn(e, t, n, r, i) {
			let a = j.value.boxes.find((t) => t.id === e);
			if (!a) return;
			let o = V(a.docPath);
			if (o === void 0) return;
			let s = Ee({
				ref: t,
				fromSide: n,
				toSide: r
			});
			H(a.docPath, xe(o, [...ve(o), s])), i && A(i), fn.value = `${e}->${t}`, pn && clearTimeout(pn), pn = setTimeout(() => {
				fn.value = null, pn = null;
			}, 700);
		}
		let Cn = t(() => {
			let e = K.value;
			if (!e) return null;
			let t = L.value.find((t) => t.id === e.fromId);
			if (!t) return null;
			let n = e.targetId ? L.value.find((t) => t.id === e.targetId) : void 0;
			if (n && n.id !== e.fromId) {
				let r = mn(n, {
					x: e.x,
					y: e.y
				});
				return Tt(t, n, e.fromSide, r).d;
			}
			return Tt(t, {
				x: e.x,
				y: e.y,
				w: 0,
				h: 0
			}, e.fromSide).d;
		});
		function wn(e) {
			let t = K.value;
			return !t || t.targetId !== e.id ? null : e.id === t.fromId || j.value.relations.some((n) => n.from === t.fromId && n.to === e.id) ? "invalid" : "valid";
		}
		p(() => {
			window.addEventListener("keydown", er), window.addEventListener("popstate", rr);
			let e = Fe();
			e > 0 && (R.value = !0, l(() => S(`已恢复 ${e} 项上次未保存的图修改，可「💾 保存」或「↩ 放弃更改」`, "info", 6e3))), M.value || l(() => requestAnimationFrame(() => St.value?.fit?.()));
		}), f(() => {
			pn && clearTimeout(pn), window.removeEventListener("keydown", er), window.removeEventListener("popstate", rr);
		});
		let Tn = null;
		function En(e) {
			!R.value || z.value !== "node" || e.button === 0 && e.target === qt.value && (Tn = {
				clientX: e.clientX,
				clientY: e.clientY
			}, window.addEventListener("pointerup", Dn));
		}
		function Dn(e) {
			window.removeEventListener("pointerup", Dn);
			let t = Tn;
			if (Tn = null, !t || Math.hypot(e.clientX - t.clientX, e.clientY - t.clientY) >= 3) return;
			let n = U(e.clientX, e.clientY);
			On(n.x, n.y);
		}
		function On(e, t) {
			let n = Math.max(0, Math.round(e - 220 / 2)), r = Math.max(0, Math.round(t - 96 / 2)), i = k(), a = /* @__PURE__ */ new Set([...Object.keys(x.files), ...w.value.keys()]), o = 1;
			for (; a.has(`untitled-${o}.md`);) o++;
			let s = `untitled-${o}.md`, c = `未命名文档 ${o}`;
			H(s, `---\ntitle: "${c}"\nx: ${n}\ny: ${r}\n---\n\n# ${c}\n`), A(i);
		}
		let q = h(null), J = t(() => P.value.find((e) => e.id === q.value) ?? null);
		function kn(e) {
			R.value && (q.value = e.id);
		}
		let Y = h(null), An = h(null);
		function jn(e) {
			R.value && (q.value = e.id, Y.value = {
				edgeId: e.id,
				value: e.label ?? ""
			}, l(() => {
				An.value?.focus(), An.value?.select();
			}));
		}
		function Mn() {
			let e = Y.value;
			if (Y.value = null, !e) return;
			let t = P.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.value.trim();
			if (n === (t.label ?? "")) return;
			let r = j.value.boxes.find((e) => e.id === t.fromId);
			if (!r) return;
			let i = V(r.docPath);
			if (i === void 0) return;
			let a = k(), o = ve(i).map((e) => {
				let r = Te(e);
				return Hn(r.ref) === t.toId ? Ee({
					ref: r.ref,
					label: n || void 0,
					fromSide: r.fromSide,
					toSide: r.toSide
				}) : e;
			});
			H(r.docPath, xe(i, o)), A(a);
		}
		function Nn() {
			Y.value = null;
		}
		let X = h(null);
		function Pn(e, t, n) {
			let r = t - (e.x + e.w / 2), i = n - (e.y + e.h / 2);
			return Math.abs(r) / (e.w / 2) >= Math.abs(i) / (e.h / 2) ? r >= 0 ? "right" : "left" : i >= 0 ? "bottom" : "top";
		}
		function Fn(e, t, n) {
			if (e.button !== 0) return;
			e.preventDefault(), e.stopPropagation();
			let r = wt(L.value.find((e) => e.id === t.fromId), L.value.find((e) => e.id === t.toId));
			X.value = {
				edgeId: t.id,
				which: n,
				side: (n === "from" ? t.fromSide : t.toSide) ?? (n === "from" ? r.fs : r.ts),
				lastClientX: e.clientX,
				lastClientY: e.clientY,
				raf: 0,
				before: k()
			}, window.addEventListener("pointermove", In), window.addEventListener("pointerup", Bn), window.addEventListener("pointercancel", zn), F.value = null;
		}
		function In(e) {
			let t = X.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Ln));
		}
		function Ln() {
			let e = X.value;
			if (!e) return;
			e.raf = 0;
			let t = P.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = L.value.find((n) => n.id === (e.which === "from" ? t.fromId : t.toId));
			if (!n) return;
			let r = U(e.lastClientX, e.lastClientY), i = Pn(n, r.x, r.y);
			i !== e.side && (X.value = {
				...e,
				side: i
			});
		}
		function Rn() {
			window.removeEventListener("pointermove", In), window.removeEventListener("pointerup", Bn), window.removeEventListener("pointercancel", zn);
		}
		function zn() {
			Rn();
			let e = X.value;
			e?.raf && cancelAnimationFrame(e.raf), X.value = null;
		}
		function Bn() {
			Rn();
			let e = X.value;
			if (e?.raf && cancelAnimationFrame(e.raf), X.value = null, !e) return;
			let t = P.value.find((t) => t.id === e.edgeId);
			if (!t) return;
			let n = e.which === "from" ? e.side : t.fromSide, r = e.which === "to" ? e.side : t.toSide;
			n === t.fromSide && r === t.toSide || (Vn(t, n, r), A(e.before));
		}
		function Vn(e, t, n) {
			let r = j.value.boxes.find((t) => t.id === e.fromId);
			if (!r) return;
			let i = V(r.docPath);
			if (i === void 0) return;
			let a = ve(i).map((r) => {
				let i = Te(r);
				return Hn(i.ref) === e.toId ? Ee({
					ref: i.ref,
					label: i.label,
					fromSide: t,
					toSide: n
				}) : r;
			});
			H(r.docPath, xe(i, a));
		}
		function Hn(e) {
			let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md", r = j.value.boxes;
			return (r.find((e) => e.id === t) ?? r.find((e) => e.docPath === t) ?? r.find((e) => e.docPath === n))?.id;
		}
		function Un() {
			let e = J.value;
			if (!e) return;
			let t = j.value.boxes.find((t) => t.id === e.fromId);
			if (!t) return;
			let n = V(t.docPath);
			if (n === void 0) return;
			let r = k(), i = ve(n).filter((t) => Hn(Te(t).ref) !== e.toId);
			H(t.docPath, xe(n, i)), A(r), q.value = null;
		}
		let Z = h(null), Q = h(null);
		function Wn(e, t) {
			if (!R.value || e.button !== 0) return;
			e.preventDefault();
			let n = Mt.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = /* @__PURE__ */ new Map();
			for (let e of t.members) {
				let t = L.value.find((t) => t.id === e);
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
				scroller: Jt(qt.value),
				panX: 0,
				panY: 0,
				before: k()
			}, window.addEventListener("pointermove", Gn), window.addEventListener("pointerup", qn), window.addEventListener("pointercancel", qn), F.value = null;
		}
		function Gn(e) {
			let t = Z.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Kn));
		}
		function Kn() {
			let e = Z.value;
			if (!e) return;
			e.raf = 0;
			let t = Yt(e.lastClientX, e.lastClientY, e.scroller, e.scale);
			e.panX += t.px, e.panY += t.py;
			let n = Math.round((e.lastClientX - e.startClientX) / e.scale + e.panX), r = Math.round((e.lastClientY - e.startClientY) / e.scale + e.panY);
			if (!e.moved && Math.hypot(n, r) < 3) return;
			let i = [...L.value.filter((t) => !e.basePositions.has(t.id)), ...Mt.value.filter((t) => t.name !== e.name)], a = $t({
				x: e.baseRegion.x + n,
				y: e.baseRegion.y + r,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, i, e.scale, Xt), o = Math.min(e.baseRegion.x, ...[...e.basePositions.values()].map((e) => e.x)), s = Math.min(e.baseRegion.y, ...[...e.basePositions.values()].map((e) => e.y)), c = Math.max(n + (a.dx ?? 0), -o), l = Math.max(r + (a.dy ?? 0), -s);
			Z.value = {
				...e,
				dx: c,
				dy: l,
				moved: !0
			};
			for (let [t, n] of e.basePositions) jt(t, {
				x: n.x + c,
				y: n.y + l
			});
			G.value = a.dx !== void 0 || a.dy !== void 0 ? en({
				x: e.baseRegion.x + c,
				y: e.baseRegion.y + l,
				w: e.baseRegion.w,
				h: e.baseRegion.h
			}, i, Xt) : [];
		}
		function qn() {
			window.removeEventListener("pointermove", Gn), window.removeEventListener("pointerup", qn), window.removeEventListener("pointercancel", qn);
			let e = Z.value;
			if (Z.value = null, G.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = j.value.groups.find((t) => t.name === e.name);
			if (t) {
				for (let n of t.members) {
					let t = j.value.boxes.find((e) => e.id === n), r = e.basePositions.get(n);
					if (!t || !r) continue;
					let i = V(t.docPath);
					i !== void 0 && H(t.docPath, Ce(i, {
						x: r.x + e.dx,
						y: r.y + e.dy
					}));
				}
				if (t.explicit) {
					let n = V(t.holder);
					n !== void 0 && H(t.holder, Se(n, Oe({
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
		function Jn(e, t) {
			if (!R.value || e.button !== 0) return;
			e.preventDefault();
			let n = Mt.value.find((e) => e.name === t.name);
			if (!n) return;
			let r = t.members.map((e) => L.value.find((t) => t.id === e)).filter((e) => !!e), i = Math.max(...r.map((e) => e.x + e.w)), a = Math.max(...r.map((e) => e.y + e.h));
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
				before: k()
			}, window.addEventListener("pointermove", Yn), window.addEventListener("pointerup", Zn), window.addEventListener("pointercancel", Zn), F.value = null;
		}
		function Yn(e) {
			let t = Q.value;
			t && (t.lastClientX = e.clientX, t.lastClientY = e.clientY, t.raf ||= requestAnimationFrame(Xn));
		}
		function Xn() {
			let e = Q.value;
			if (!e) return;
			e.raf = 0;
			let t = (e.lastClientX - e.startClientX) / e.scale, n = (e.lastClientY - e.startClientY) / e.scale;
			if (!e.moved && Math.hypot(t, n) < 3) return;
			let r = Math.round(e.baseRegion.w + t), i = Math.round(e.baseRegion.h + n), a = [...L.value.filter((t) => !e.memberIds.has(t.id)), ...Mt.value.filter((t) => t.name !== e.name)], o = $t({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: r,
				h: i
			}, a, e.scale, Zt), s = Math.max(e.minW, Math.round(r + (o.dx ?? 0))), c = Math.max(e.minH, Math.round(i + (o.dy ?? 0)));
			Q.value = {
				...e,
				curW: s,
				curH: c,
				moved: !0
			}, G.value = o.dx !== void 0 || o.dy !== void 0 ? en({
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: s,
				h: c
			}, a, Zt) : [];
		}
		function Zn() {
			window.removeEventListener("pointermove", Yn), window.removeEventListener("pointerup", Zn), window.removeEventListener("pointercancel", Zn);
			let e = Q.value;
			if (Q.value = null, G.value = [], !e || (e.raf && cancelAnimationFrame(e.raf), !e.moved)) return;
			let t = j.value.groups.find((t) => t.name === e.name);
			if (!t) return;
			let n = V(t.holder);
			n !== void 0 && (H(t.holder, Se(n, Oe({
				name: t.name,
				x: e.baseRegion.x,
				y: e.baseRegion.y,
				w: e.curW,
				h: e.curH
			}))), A(e.before));
		}
		function Qn(e) {
			if (T.value.has(e.docPath)) {
				let t = k();
				T.value = new Set([...T.value].filter((t) => t !== e.docPath)), A(t);
				return;
			}
			if (B.has(e.docPath) && !(e.docPath in x.files)) {
				$n(e);
				return;
			}
			Vt("删除文档", `「${e.title}」（${e.docPath}）将在「💾 保存」后从磁盘删除，保存前可撤销。确定标记删除？`, () => $n(e));
		}
		function $n(e) {
			let t = k();
			if (w.value.has(e.docPath)) {
				let t = new Map(w.value);
				t.delete(e.docPath), w.value = t;
			}
			B.delete(e.docPath), e.docPath in x.files && (T.value = /* @__PURE__ */ new Set([...T.value, e.docPath])), A(t);
		}
		function er(e) {
			if (!(M.value || !R.value) && !Y.value) {
				if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z" || e.key === "y")) {
					e.preventDefault(), e.key === "y" || e.shiftKey ? Me() : Ae();
					return;
				}
				if (e.key === "Escape") {
					if (q.value) {
						q.value = null;
						return;
					}
					z.value !== "select" && (z.value = "select");
					return;
				}
				q.value && (e.key === "Delete" || e.key === "Backspace") && (e.preventDefault(), Un());
			}
		}
		let tr = t(() => M.value ? j.value.boxes.find((e) => e.docPath === M.value)?.title ?? M.value : "");
		function nr() {
			let e = M.value ? `#${encodeURIComponent(M.value)}` : "#";
			if (window.location.hash === e) {
				history.replaceState(null, "", e);
				return;
			}
			history.pushState(null, "", e);
		}
		function rr() {
			let e = window.location.hash, t = null;
			if (e.length > 1) try {
				t = decodeURIComponent(e.slice(1));
			} catch {
				t = null;
			}
			$.value = !1, M.value = t && x.files[t] ? t : null;
		}
		function ir(e) {
			if (x.files[e]) {
				if (M.value === e) {
					$.value = !1;
					return;
				}
				$.value = !1, M.value = e, pe("navigate", e), nr();
			}
		}
		function ar(e) {
			document.querySelector(`.pd-doc-view [data-heading-id$="-${e}"]`)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
		function or(e, t) {
			if (M.value === e) {
				ar(t);
				return;
			}
			ir(e), l(() => {
				setTimeout(() => ar(t), 80), setTimeout(() => ar(t), 320);
			});
		}
		function sr() {
			if ($.value && ur.value) {
				Vt("丢弃未保存的修改？", "正文有未保存的修改，返回图画布将丢弃这些修改。", cr);
				return;
			}
			cr();
		}
		function cr() {
			$.value = !1, M.value = null, nr(), l(() => requestAnimationFrame(() => St.value?.fit?.()));
		}
		te(() => x.files, (e) => {
			if (Ut.value = !1, M.value && !e[M.value] && cr(), w.value.size) {
				let t = new Map(w.value);
				for (let [n, r] of t) e[n] === r ? (t.delete(n), B.delete(n)) : e[n] === void 0 && !B.has(n) && t.delete(n);
				w.value = t;
			}
			if (T.value.size) {
				let t = new Set([...T.value].filter((t) => e[t] !== void 0));
				t.size !== T.value.size && (T.value = t);
			}
			if (!I.value) return;
			let t = j.value.boxes, n = new Map(I.value);
			for (let [e, r] of n) {
				let i = t.find((t) => t.id === e);
				(!i || i.x === r.x && i.y === r.y) && n.delete(e);
			}
			I.value = n.size > 0 ? n : null;
		});
		let $ = h(!1), lr = h(""), ur = t(() => M.value !== null && lr.value !== (x.files[M.value] ?? ""));
		function dr() {
			M.value && (lr.value = x.files[M.value] ?? "", $.value = !0);
		}
		function fr(e) {
			ir(e), dr();
		}
		function pr() {
			$.value = !1;
		}
		async function mr() {
			if (!M.value || !ur.value) return;
			let e = await _e(M.value, lr.value, x.files[M.value]);
			e.ok || be("保存", M.value, e);
		}
		function hr(e) {
			(e.ctrlKey || e.metaKey) && e.key === "s" && (e.preventDefault(), mr());
		}
		function gr(e, t) {
			if (R.value) {
				if (z.value !== "select") return;
				let n = e.shiftKey ? 10 : 1, r = {
					ArrowLeft: [-n, 0],
					ArrowRight: [n, 0],
					ArrowUp: [0, -n],
					ArrowDown: [0, n]
				}[e.key];
				if (!r) return;
				e.preventDefault(), vr(t, r[0], r[1]);
				return;
			}
			(e.key === "Enter" || e.key === " ") && (e.preventDefault(), ir(t.docPath));
		}
		let _r = null;
		function vr(e, t, n) {
			let r = Math.max(0, Math.round(e.x + t)), i = Math.max(0, Math.round(e.y + n));
			if (r === e.x && i === e.y) return;
			let a = Date.now(), o = _r?.id === e.id && a - _r.time < 800 ? null : k();
			_r = {
				id: e.id,
				time: a
			}, jt(e.id, {
				x: r,
				y: i
			});
			let s = V(e.docPath);
			s !== void 0 && (H(e.docPath, Ce(s, {
				x: r,
				y: i
			})), o && A(o));
		}
		function yr(e, t) {
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
		function br(e) {
			if (!M.value) return;
			let t = yr(M.value, e);
			t && (t.anchor ? or(t.path, t.anchor) : ir(t.path));
		}
		function xr(e) {
			if (!M.value) return;
			let t = x.files[M.value];
			if (t === void 0) return;
			let n = he(t, e.source, e.id, e.x, e.y);
			if (n === t) return;
			let r = M.value;
			_e(r, n, t).then((e) => {
				e.ok || be("保存", r, e);
			});
		}
		if (typeof window < "u" && window.location.hash.length > 1) {
			let e = decodeURIComponent(window.location.hash.slice(1));
			x.files[e] && (M.value = e);
		}
		return (t, l) => (m(), i("div", Re, [a("header", ze, [
			l[14] ||= a("span", { class: "pd-graph-brand" }, "📚 ProDoc", -1),
			M.value ? (m(), i("span", Be, _(tr.value), 1)) : r("", !0),
			a("div", Ve, [
				M.value ? r("", !0) : (m(), i(e, { key: 0 }, [R.value ? (m(), i(e, { key: 1 }, [
					a("button", {
						class: "pd-back-btn",
						disabled: D.value.length === 0,
						title: "撤销（Ctrl+Z）",
						"aria-label": "撤销",
						onClick: Ae
					}, "↶", 8, He),
					a("button", {
						class: "pd-back-btn",
						disabled: O.value.length === 0,
						title: "重做（Ctrl+Shift+Z / Ctrl+Y）",
						"aria-label": "重做",
						onClick: Me
					}, "↷", 8, Ue),
					a("button", {
						class: "pd-back-btn",
						disabled: !E.value || Ut.value,
						onClick: Wt
					}, "💾 保存", 8, We),
					E.value ? (m(), i("button", {
						key: 0,
						class: "pd-back-btn",
						disabled: Ut.value,
						onClick: Gt
					}, "↩ 放弃更改", 8, Ge)) : (m(), i("button", {
						key: 1,
						class: "pd-back-btn pd-back-btn--active",
						onClick: Kt
					}, "✓ 完成"))
				], 64)) : (m(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: Kt
				}, "🛠 编辑图")), a("button", {
					class: "pd-back-btn",
					onClick: Pt
				}, _(I.value ? "↩ 恢复坐标" : "🧭 分层重排"), 1)], 64)),
				M.value ? (m(), i(e, { key: 1 }, [$.value ? (m(), i(e, { key: 1 }, [a("button", {
					class: "pd-back-btn",
					disabled: !ur.value,
					onClick: mr
				}, "💾 保存", 8, Ke), a("button", {
					class: "pd-back-btn",
					onClick: pr
				}, "👁 预览")], 64)) : (m(), i("button", {
					key: 0,
					class: "pd-back-btn",
					onClick: dr
				}, "✏️ 编辑")), a("button", {
					class: "pd-back-btn",
					onClick: sr
				}, "🗺 返回图")], 64)) : r("", !0),
				j.value.warnings.length ? (m(), n(v(se), {
					key: 2,
					trigger: "click",
					position: "bottom",
					width: 360
				}, {
					default: ne(() => [a("span", qe, [s(v(ie), { value: j.value.warnings.length }, {
						default: ne(() => [...l[13] ||= [a("button", {
							class: "pd-back-btn",
							type: "button",
							title: "解析告警明细"
						}, "⚠️", -1)]]),
						_: 1
					}, 8, ["value"])])]),
					content: ne(() => [a("ul", Je, [(m(!0), i(e, null, g(j.value.warnings, (e) => (m(), i("li", { key: e }, _(e), 1))), 128))])]),
					_: 1
				})) : r("", !0),
				s(v(ce), { size: "small" })
			])
		]), a("div", Ye, [
			M.value ? (m(), i("div", {
				key: 1,
				class: u(["pd-doc-view", { "pd-doc-view--editing": $.value }])
			}, [$.value ? (m(), n(v(fe), {
				key: M.value,
				value: lr.value,
				class: "pd-doc-editor",
				onChange: l[8] ||= (e) => lr.value = e,
				onKeydown: hr
			}, null, 8, ["value"])) : (m(), n(v(me), {
				key: M.value,
				content: xt.value[M.value],
				"show-toc": !0,
				"flow-editable": !0,
				onDocLink: br,
				onFlowNodeMove: xr
			}, null, 8, ["content"]))], 2)) : (m(), n(v(ae), {
				key: 0,
				ref_key: "canvasRef",
				ref: St,
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
					ref: qt,
					class: u(["pd-graph-stage", {
						"pd-graph-stage--dragging": W.value?.moved || K.value || X.value || Z.value?.moved || Q.value?.moved,
						"pd-graph-stage--editing": R.value,
						"pd-graph-stage--tool-link": R.value && z.value === "link",
						"pd-graph-stage--tool-node": R.value && z.value === "node"
					}]),
					style: d({
						width: `${N.value.w}px`,
						height: `${N.value.h}px`
					}),
					onPointerdown: En,
					onClick: l[7] ||= (e) => {
						q.value = null, un.value = null;
					}
				}, [
					(m(!0), i(e, null, g(Mt.value, (e) => (m(), i("div", {
						key: "group-" + e.name,
						class: u(["pd-doc-group", { "pd-dim": Nt(e) }]),
						style: d({
							left: `${e.x}px`,
							top: `${e.y}px`,
							width: `${e.w}px`,
							height: `${e.h}px`
						})
					}, [a("span", {
						class: "pd-doc-group__label",
						title: R.value ? `拖动移动整组「${e.name}」` : e.name,
						"data-nm-no-pan": "",
						onPointerdown: (t) => Wn(t, e)
					}, _(e.name), 41, Xe), R.value ? (m(), i("button", {
						key: 0,
						type: "button",
						class: "pd-doc-group__resize",
						"aria-label": `调整组「${e.name}」的区域尺寸`,
						title: "拖动调整区域尺寸",
						"data-nm-no-pan": "",
						onPointerdown: b((t) => Jn(t, e), ["stop"])
					}, null, 40, Ze)) : r("", !0)], 6))), 128)),
					P.value.length || Cn.value ? (m(), i("svg", {
						key: 0,
						class: "pd-relation-layer",
						width: N.value.w,
						height: N.value.h,
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
						(m(!0), i(e, null, g(P.value, (e) => (m(), i("g", {
							key: e.id,
							class: u(["pd-relation", {
								"pd-dim": At(e),
								"pd-hot": kt(e),
								"pd-selected": e.id === q.value,
								"pd-relation--new": e.id === fn.value
							}])
						}, [
							a("title", null, _(e.fromTitle) + " → " + _(e.toTitle) + _(e.label ? `（${e.label}）` : ""), 1),
							a("path", {
								class: "pd-relation-hit",
								d: e.d,
								fill: "none",
								onClick: b((t) => kn(e), ["stop"]),
								onDblclick: b((t) => jn(e), ["stop"])
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
						Cn.value ? (m(), i("path", {
							key: 0,
							class: "pd-relation-draft",
							d: Cn.value,
							fill: "none"
						}, null, 8, nt)) : r("", !0),
						(m(!0), i(e, null, g(G.value, (e, t) => (m(), i("line", {
							key: "guide" + t,
							class: "pd-guide",
							x1: e.axis === "x" ? e.pos : e.start,
							y1: e.axis === "x" ? e.start : e.pos,
							x2: e.axis === "x" ? e.pos : e.end,
							y2: e.axis === "x" ? e.end : e.pos
						}, null, 8, rt))), 128)),
						R.value && J.value ? (m(), i("g", it, [a("circle", {
							class: "pd-edge-handle",
							cx: J.value.x1,
							cy: J.value.y1,
							r: "6",
							onPointerdown: l[0] ||= b((e) => Fn(e, J.value, "from"), ["stop"])
						}, [...l[15] ||= [a("title", null, "拖动调整源框连接边", -1)]], 40, at), a("circle", {
							class: "pd-edge-handle",
							cx: J.value.x2,
							cy: J.value.y2,
							r: "6",
							onPointerdown: l[1] ||= b((e) => Fn(e, J.value, "to"), ["stop"])
						}, [...l[16] ||= [a("title", null, "拖动调整目标框连接边", -1)]], 40, ot)])) : r("", !0)
					], 8, Qe)) : r("", !0),
					R.value && J.value && !Y.value ? (m(), i("button", {
						key: 1,
						type: "button",
						class: "pd-edge-delete",
						style: d({
							left: `${J.value.delX}px`,
							top: `${J.value.delY}px`
						}),
						"aria-label": `删除连线 ${J.value.fromTitle} → ${J.value.toTitle}`,
						title: "删除连线（Delete）",
						onClick: b(Un, ["stop"])
					}, "✕", 12, st)) : r("", !0),
					R.value && J.value && Y.value && Y.value.edgeId === J.value.id ? re((m(), i("input", {
						key: 2,
						ref_key: "labelInputEl",
						ref: An,
						"onUpdate:modelValue": l[2] ||= (e) => Y.value.value = e,
						type: "text",
						class: "pd-edge-label-input",
						style: d({
							left: `${J.value.labelX}px`,
							top: `${J.value.labelY}px`
						}),
						"aria-label": `编辑连线标签 ${J.value.fromTitle} → ${J.value.toTitle}`,
						placeholder: "连线标签（留空移除）",
						"data-nm-no-pan": "",
						onKeydown: [y(b(Mn, ["prevent"]), ["enter"]), y(b(Nn, ["prevent"]), ["esc"])],
						onBlur: Mn,
						onClick: l[3] ||= b(() => {}, ["stop"])
					}, null, 44, ct)), [[ee, Y.value.value]]) : r("", !0),
					(m(!0), i(e, null, g(L.value, (t) => (m(), i("div", {
						key: t.id,
						class: u(["pd-doc-box", [`pd-doc-box--d${Math.min(t.depth, 3)}`, {
							"pd-dim": Ot(t.id),
							"pd-doc-box--link-target": wn(t) === "valid",
							"pd-doc-box--link-invalid": wn(t) === "invalid",
							"pd-doc-box--deleting": T.value.has(t.docPath)
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
						onPointerdown: (e) => rn(e, t),
						onClick: (e) => dn(t),
						onKeydown: (e) => gr(e, t),
						onMouseenter: (e) => Et(t.id),
						onMouseleave: l[6] ||= (e) => Et(null)
					}, [
						a("div", ut, [a("span", {
							class: "pd-doc-box__title",
							title: t.title
						}, _(t.title), 9, dt), l[18] ||= a("span", {
							class: "pd-doc-box__icon",
							"aria-hidden": "true"
						}, "↗", -1)]),
						R.value ? r("", !0) : (m(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-box__edit",
							"aria-label": `编辑 ${t.title}`,
							title: "编辑文档",
							onClick: b((e) => fr(t.docPath), ["stop"]),
							onKeydown: [y(b((e) => fr(t.docPath), ["stop"]), ["enter"]), y(b((e) => fr(t.docPath), ["stop"]), ["space"])]
						}, "✏️", 40, ft)),
						R.value && c.deleteHandler ? (m(), i("button", {
							key: 1,
							type: "button",
							class: u(["pd-doc-box__delete", { "pd-doc-box__delete--armed": T.value.has(t.docPath) }]),
							"aria-label": T.value.has(t.docPath) ? `撤销删除 ${t.title}` : `删除 ${t.title}`,
							title: T.value.has(t.docPath) ? "撤销删除标记" : "标记删除（💾 保存后生效）",
							onClick: b((e) => Qn(t), ["stop"]),
							onPointerdown: l[4] ||= b(() => {}, ["stop"])
						}, _(T.value.has(t.docPath) ? "↩" : "✕"), 43, pt)) : r("", !0),
						R.value ? (m(), i(e, { key: 2 }, g([
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
							onPointerdown: b((n) => gn(n, t, e), ["stop"]),
							onClick: l[5] ||= b(() => {}, ["stop"])
						}, null, 42, mt)), 64)) : r("", !0),
						t.blocks.length && !R.value ? (m(), i("div", {
							key: 3,
							class: u(["pd-doc-blocks-pop", {
								"pd-doc-blocks-pop--above": Rt(t, N.value.h),
								"pd-doc-blocks-pop--force": un.value === t.id
							}])
						}, [a("div", ht, [(m(!0), i(e, null, g(Ft(t), (e) => (m(), i("button", {
							key: e.anchor,
							type: "button",
							class: "pd-doc-blocks-pop__item",
							title: e.title,
							"aria-label": `跳转到「${e.title}」分块`,
							onClick: b((n) => or(t.docPath, e.anchor), ["stop"]),
							onKeydown: [y(b((n) => or(t.docPath, e.anchor), ["stop"]), ["enter"]), y(b((n) => or(t.docPath, e.anchor), ["stop"]), ["space"])]
						}, "▸ " + _(e.title), 41, gt))), 128)), It(t) > 0 ? (m(), i("button", {
							key: 0,
							type: "button",
							class: "pd-doc-blocks-pop__item pd-doc-blocks-pop__item--more",
							"aria-label": `查看全部 ${t.blocks.length} 个分块`,
							onClick: b((e) => ir(t.docPath), ["stop"])
						}, "+" + _(It(t)) + " 更多分块…", 9, _t)) : r("", !0)])], 2)) : r("", !0)
					], 46, lt))), 128))
				], 38)]),
				_: 1
			}, 512)),
			!M.value && R.value ? (m(), i("div", vt, [
				a("button", {
					type: "button",
					class: u(["pd-edit-toolbar__btn", { "pd-edit-toolbar__btn--active": z.value === "select" }]),
					title: "选择工具（Esc）",
					onClick: l[9] ||= (e) => z.value = "select"
				}, "🖱 选择", 2),
				a("button", {
					type: "button",
					class: u(["pd-edit-toolbar__btn", { "pd-edit-toolbar__btn--active": z.value === "link" }]),
					title: "连线工具：从任意框拖到目标框创建连线",
					onClick: l[10] ||= (e) => z.value = "link"
				}, "🔗 连线", 2),
				a("button", {
					type: "button",
					class: u(["pd-edit-toolbar__btn", { "pd-edit-toolbar__btn--active": z.value === "node" }]),
					title: "节点工具：点画布空白创建新文档框",
					onClick: l[11] ||= (e) => z.value = "node"
				}, "📄 节点", 2)
			])) : r("", !0),
			s(v(le), {
				ref_key: "toastRef",
				ref: ge
			}, null, 512),
			s(v(oe), {
				modelValue: Bt.value,
				"onUpdate:modelValue": l[12] ||= (e) => Bt.value = e,
				title: zt.value.title,
				size: "small",
				"confirm-label": "确认",
				"cancel-label": "取消",
				onConfirm: Ht
			}, {
				default: ne(() => [o(_(zt.value.message), 1)]),
				_: 1
			}, 8, ["modelValue", "title"])
		])]));
	}
});
//#endregion
export { de as DocFlowCanvas, bt as DocGraphViewer, x as DocViewer, pe as MarkdownRenderer };

//# sourceMappingURL=index.js.map