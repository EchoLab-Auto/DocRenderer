//#region src/frame.ts
function e(e) {
	let t = [], n = "", r = null;
	for (let i of e) r ? (n += i, i === r && (r = null)) : i === "\"" || i === "'" ? (r = i, n += i) : i === "," ? (t.push(n), n = "") : n += i;
	return t.push(n), t;
}
function t(n) {
	let r = n.trim();
	if (r === "") return "";
	if (r.startsWith("[") && r.endsWith("]")) return e(r.slice(1, -1)).map((e) => t(e)).filter((e) => e !== "");
	if (r === "true") return !0;
	if (r === "false") return !1;
	if (/^-?\d+$/.test(r)) return parseInt(r, 10);
	if (/^-?\d*\.\d+$/.test(r)) return parseFloat(r);
	let i = r.match(/^(["'])([\s\S]*)\1$/);
	return i ? i[2] : r;
}
function n(e) {
	let n = e.indexOf("\n");
	if ((n === -1 ? e : e.slice(0, n)).trim() !== "---") return {
		params: {},
		body: e,
		hasFrame: !1
	};
	let r = (n === -1 ? "" : e.slice(n + 1)).split("\n"), i = -1;
	for (let e = 0; e < r.length; e++) if (r[e].trim() === "---") {
		i = e;
		break;
	}
	if (i === -1) return {
		params: {},
		body: e,
		hasFrame: !1
	};
	let a = {};
	for (let e of r.slice(0, i)) {
		if (e.trim() === "") continue;
		let n = e.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*([\s\S]*)$/);
		n && (a[n[1]] = t(n[2]));
	}
	return {
		params: a,
		body: r.slice(i + 1).join("\n"),
		hasFrame: !0
	};
}
function r(e) {
	return (Array.isArray(e) ? e : typeof e == "string" ? e.split(",") : []).filter((e) => typeof e == "string").map((e) => e.trim()).filter(Boolean);
}
function i(e) {
	return r(n(e).params.link);
}
function a(e) {
	return e === "" || e !== e.trim() || /[|,"]/.test(e) ? e.includes("\"") ? `'${e}'` : `"${e}"` : e;
}
function o(e, t) {
	let r = e.includes("\r\n") ? "\r\n" : "\n", i = n(e), o = t.length > 0 ? `link: [${t.map(a).join(", ")}]` : null;
	if (!i.hasFrame) return o === null ? e : `---${r}${o}${r}---${r}${e}`;
	let s = e.split(/\r?\n/), c = s.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (c === -1) return e;
	let l = s.slice(1, c).findIndex((e) => /^link\s*:/.test(e));
	return o === null ? l >= 0 && s.splice(l + 1, 1) : l >= 0 ? s[l + 1] = o : s.splice(c, 0, o), s.join(r);
}
function s(e, t) {
	let r = Object.entries(t).filter((e) => (e[0] === "x" || e[0] === "y") && typeof e[1] == "number" && Number.isFinite(e[1]));
	if (r.length === 0) return e;
	let i = e.includes("\r\n") ? "\r\n" : "\n";
	if (!n(e).hasFrame) return `---${i}${r.map(([e, t]) => `${e}: ${t}`).join(i)}${i}---${i}${e}`;
	let a = e.split(/\r?\n/), o = a.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (o === -1) return e;
	let s = o;
	for (let [e, t] of r) {
		let n = RegExp(`^${e}\\s*:`), r = a.slice(1, s).findIndex((e) => n.test(e));
		r >= 0 ? a[r + 1] = `${e}: ${t}` : (a.splice(s, 0, `${e}: ${t}`), s++);
	}
	return a.join(i);
}
//#endregion
//#region src/graph.ts
var c = 220, l = 96, u = 6, d = 72, f = 48, p = /* @__PURE__ */ new Set([
	"id",
	"title",
	"x",
	"y",
	"w",
	"h",
	"link"
]);
function m(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
var h = {
	t: "top",
	r: "right",
	b: "bottom",
	l: "left"
}, g = {
	top: "t",
	right: "r",
	bottom: "b",
	left: "l"
}, _ = /^([trbl])>([trbl])$/;
function v(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(_);
		t ? (n.fromSide = h[t[1]], n.toSide = h[t[2]]) : e !== "" && (n.label = e);
	}
	return n;
}
function y(e) {
	let t = e.ref;
	return e.label && (t += ` | ${e.label}`), e.fromSide && e.toSide && (t += ` | ${g[e.fromSide]}>${g[e.toSide]}`), t;
}
function b(e) {
	let t = e.match(/^#[ \t]+(.+)$/m);
	return t ? t[1].trim() : void 0;
}
function x(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
}
function S(e) {
	return e.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_~]/g, "").replace(/<[^>]+>/g, "").trim();
}
function C(e) {
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
			let e = S(i[1]);
			e && t.push({
				anchor: x(e),
				title: e
			});
		}
	}
	return t.length >= 2 ? t : [];
}
function w(e, t) {
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
function T(e, t, n, r) {
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
	let u = [...l.keys()].sort((e, t) => e - t), p = f;
	for (let e of u) {
		let t = l.get(e), n = t.map((e, n) => {
			let r = (c.get(e.box.id) ?? []).map((e) => s.get(e)).filter((e) => e !== void 0);
			return {
				auto: e,
				bary: r.length ? r.reduce((e, t) => e + t, 0) / r.length : 2 ** 53 - 1 - (t.length - n)
			};
		});
		n.sort((e, t) => e.bary - t.bary);
		let i = n.map((e) => e.auto), u = p, m = 0, h = f, g = 0;
		for (let { box: e } of i) {
			g === a && (u += m + d, m = 0, h = f, g = 0);
			let t = r.get(e.id);
			t.rawX === void 0 && (e.x = h), t.rawY === void 0 && (e.y = u), s.set(e.id, o(e)), h += e.w + 64, m = Math.max(m, e.h), g++;
		}
		p = u + m + d;
	}
}
function E(e, t) {
	let n = e.map((e) => ({
		...e,
		x: 0,
		y: 0
	}));
	return T(n, t, w(n, t), new Map(n.map((e) => [e.id, {}]))), new Map(n.map((e) => [e.id, {
		x: e.x,
		y: e.y
	}]));
}
function D(e) {
	let t = Object.keys(e).sort(), i = [], a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let r of t) {
		let { params: t, body: s } = n(e[r]), c = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : r.replace(/\.md$/, ""), l = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || b(s) || c, u = C(s), d = m(t.w) ?? 220, f = m(t.h) ?? 96, h = {};
		for (let [e, n] of Object.entries(t)) p.has(e) || (h[e] = n);
		let g = {
			id: c,
			title: l,
			docPath: r,
			depth: 0,
			blocks: u,
			x: m(t.x) ?? 0,
			y: m(t.y) ?? 0,
			w: d,
			h: f,
			attrs: h
		};
		o.set(c, {
			rawX: m(t.x),
			rawY: m(t.y)
		}), a.has(c) && i.push(`重复 id "${c}"：${a.get(c).docPath} 被 ${r} 覆盖`), a.set(c, g);
	}
	let s = [...a.values()], c = new Map(s.map((e) => [e.docPath, e])), l = [], u = /* @__PURE__ */ new Set();
	function d(e) {
		let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md";
		return a.get(t) ?? c.get(t) ?? c.get(n);
	}
	function f(e, t, n, r) {
		let a = d(e), o = d(t);
		if (!a || !o) {
			let n = a ? t : e;
			i.push("连线 " + r + " 引用了不存在的文档 \"" + n + "\"");
			return;
		}
		if (a.id === o.id) {
			i.push("文档 \"" + a.id + "\" 不能连线自身");
			return;
		}
		let s = a.id + "->" + o.id;
		u.has(s) || (u.add(s), l.push({
			id: s,
			type: "link",
			from: a.id,
			to: o.id,
			label: n.label,
			fromSide: n.fromSide,
			toSide: n.toSide
		}));
	}
	for (let t of s) {
		let { params: i } = n(e[t.docPath]);
		for (let e of r(i.link)) {
			let { ref: n, label: r, fromSide: i, toSide: a } = v(e);
			n && f(t.id, n, {
				label: r,
				fromSide: i,
				toSide: a
			}, t.id + ".link");
		}
	}
	let h = w(s, l);
	for (let e of s) e.depth = h.get(e.id) ?? 0;
	return T(s, l, h, o), {
		boxes: s,
		relations: l,
		warnings: i
	};
}
//#endregion
export { y as a, r as c, o as d, s as f, D as i, n as l, c as n, E as o, u as r, v as s, l as t, i as u };

//# sourceMappingURL=graph-CepZYFyQ.js.map