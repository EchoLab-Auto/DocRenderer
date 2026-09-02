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
	let a = {}, o = 0, s = r.slice(0, i);
	for (; o < s.length;) {
		let e = s[o];
		if (o += 1, e.trim() === "") continue;
		let n = e.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*([\s\S]*)$/);
		if (!n) continue;
		let r = n[1], i = n[2];
		if (i.trim() === "" && o < s.length && s[o].trimStart().startsWith("[") && (i = s[o], o += 1), i.trimStart().startsWith("[") && !/\]\s*$/.test(i)) {
			let e = [i];
			for (; o < s.length;) {
				let t = s[o];
				if (o += 1, e.push(t), /\]\s*$/.test(t)) break;
			}
			i = e.join("\n");
		}
		a[r] = t(i);
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
function o(e, t, r) {
	let i = e.includes("\r\n") ? "\r\n" : "\n";
	if (!n(e).hasFrame) return r === null ? e : `---${i}${r}${i}---${i}${e}`;
	let a = e.split(/\r?\n/), o = a.findIndex((e, t) => t > 0 && e.trim() === "---");
	if (o === -1) return e;
	let s = RegExp(`^${t}\\s*:`), c = a.slice(1, o).findIndex((e) => s.test(e));
	if (c >= 0) {
		let e = c + 1, t = 1, n = e, i = a[e].replace(s, "");
		if (i.trim() === "" && e + 1 < o && a[e + 1].trimStart().startsWith("[") && (n = e + 1, i = a[n], t = 2), i.trimStart().startsWith("[") && !/\]\s*$/.test(i)) {
			let r = n + 1;
			for (; r < o && !/\]\s*$/.test(a[r]);) r++;
			r < o && (t = r - e + 1);
		}
		r === null ? a.splice(e, t) : a.splice(e, t, r);
	} else r !== null && a.splice(o, 0, r);
	return a.join(i);
}
function s(e, t) {
	return o(e, "link", t.length > 0 ? `link: [${t.map(a).join(", ")}]` : null);
}
function c(e, t) {
	return o(e, "group", t === null ? null : `group: ${a(t)}`);
}
function l(e, t) {
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
var u = 220, d = 96, f = 6, p = 24, m = 34, h = 72, g = 48, _ = /* @__PURE__ */ new Set([
	"id",
	"title",
	"x",
	"y",
	"w",
	"h",
	"link",
	"group"
]);
function v(e) {
	return typeof e == "number" && Number.isFinite(e) ? e : void 0;
}
var y = {
	t: "top",
	r: "right",
	b: "bottom",
	l: "left"
}, b = {
	top: "t",
	right: "r",
	bottom: "b",
	left: "l"
}, x = /^([trbl_])>([trbl_])$/;
function S(e) {
	let t = e.split("|").map((e) => e.trim()), n = { ref: t[0] };
	for (let e of t.slice(1)) {
		let t = e.match(x);
		t ? (t[1] !== "_" && (n.fromSide = y[t[1]]), t[2] !== "_" && (n.toSide = y[t[2]])) : e !== "" && (n.label = e);
	}
	return n;
}
function C(e) {
	let t = e.ref;
	if (e.label && (t += ` | ${e.label}`), e.fromSide || e.toSide) {
		let n = e.fromSide ? b[e.fromSide] : "_", r = e.toSide ? b[e.toSide] : "_";
		t += ` | ${n}>${r}`;
	}
	return t;
}
var w = /^(.*)\s*@\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;
function T(e) {
	let t = e.match(w);
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
function E(e) {
	let { name: t, x: n, y: r, w: i, h: a } = e;
	return [
		n,
		r,
		i,
		a
	].every((e) => typeof e == "number" && Number.isFinite(e)) ? `${t} @ ${n}, ${r}, ${i}, ${a}` : t;
}
function D(e, t) {
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
function O(e) {
	let t = e.match(/^#[ \t]+(.+)$/m);
	return t ? t[1].trim() : void 0;
}
function k(e) {
	return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/[\s-]+/g, "-").replace(/^-+|-+$/g, "");
}
function A(e) {
	return e.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[`*_~]/g, "").replace(/<[^>]+>/g, "").trim();
}
function j(e) {
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
			let e = A(i[1]);
			e && t.push({
				anchor: k(e),
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
	let u = [...l.keys()].sort((e, t) => e - t), d = g;
	for (let e of u) {
		let t = l.get(e), n = t.map((e, n) => {
			let r = (c.get(e.box.id) ?? []).map((e) => s.get(e)).filter((e) => e !== void 0);
			return {
				auto: e,
				bary: r.length ? r.reduce((e, t) => e + t, 0) / r.length : 2 ** 53 - 1 - (t.length - n)
			};
		});
		n.sort((e, t) => e.bary - t.bary);
		let i = n.map((e) => e.auto), u = d, f = 0, p = g, m = 0;
		for (let { box: e } of i) {
			m === a && (u += f + h, f = 0, p = g, m = 0);
			let t = r.get(e.id);
			t.rawX === void 0 && (e.x = p), t.rawY === void 0 && (e.y = u), s.set(e.id, o(e)), p += e.w + 64, f = Math.max(f, e.h), m++;
		}
		d = u + f + h;
	}
}
function P(e, t) {
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
function F(e) {
	let t = Object.keys(e).sort(), i = [], a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
	for (let r of t) {
		let { params: t, body: c } = n(e[r]), l = typeof t.id == "string" && t.id.trim() !== "" ? t.id.trim() : r.replace(/\.md$/, ""), u = typeof t.title == "string" && t.title.trim() !== "" && t.title.trim() || O(c) || l, d = j(c), f = v(t.w) ?? 220, p = v(t.h) ?? 96, m = {};
		for (let [e, n] of Object.entries(t)) _.has(e) || (m[e] = n);
		let h = {
			id: l,
			title: u,
			docPath: r,
			depth: 0,
			blocks: d,
			x: v(t.x) ?? 0,
			y: v(t.y) ?? 0,
			w: f,
			h: p,
			attrs: m
		};
		if (o.set(l, {
			rawX: v(t.x),
			rawY: v(t.y)
		}), t.group !== void 0) {
			let e = (Array.isArray(t.group) ? t.group : [t.group]).map((e) => typeof e == "string" ? e : typeof e == "number" ? String(e) : "").filter((e) => e.trim() !== "");
			if (e.length > 1 && i.push(`文档 "${l}" 声明了多个 group，仅取第一个 "${T(e[0]).name || e[0]}"`), e.length > 0) {
				let { name: t, geo: n } = T(e[0]);
				t && s.set(l, {
					name: t,
					geo: n
				});
			}
		}
		a.has(l) && i.push(`重复 id "${l}"：${a.get(l).docPath} 被 ${r} 覆盖`), a.set(l, h);
	}
	let c = [...a.values()], l = new Map(c.map((e) => [e.docPath, e])), u = [], d = /* @__PURE__ */ new Set();
	function f(e) {
		let t = e.trim(), n = t.endsWith(".md") ? t : t + ".md";
		return a.get(t) ?? l.get(t) ?? l.get(n);
	}
	function p(e, t, n, r) {
		let a = f(e), o = f(t);
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
		d.has(s) || (d.add(s), u.push({
			id: s,
			type: "link",
			from: a.id,
			to: o.id,
			label: n.label,
			fromSide: n.fromSide,
			toSide: n.toSide
		}));
	}
	for (let t of c) {
		let { params: i } = n(e[t.docPath]);
		for (let e of r(i.link)) {
			let { ref: n, label: r, fromSide: i, toSide: a } = S(e);
			n && p(t.id, n, {
				label: r,
				fromSide: i,
				toSide: a
			}, t.id + ".link");
		}
	}
	let m = M(c, u);
	for (let e of c) e.depth = m.get(e.id) ?? 0;
	N(c, u, m, o);
	let h = /* @__PURE__ */ new Map();
	for (let e of c) {
		let t = s.get(e.id);
		if (!t) continue;
		let n = h.get(t.name);
		n || (n = { members: [] }, h.set(t.name, n)), n.members.push(e), t.geo && (n.geo ? (n.geo.x !== t.geo.x || n.geo.y !== t.geo.y || n.geo.w !== t.geo.w || n.geo.h !== t.geo.h) && i.push(`组 "${t.name}" 的显式几何被多个成员声明且不一致，取 ${n.holder} 的声明`) : (n.geo = t.geo, n.holder = e.docPath));
	}
	return {
		boxes: c,
		relations: u,
		groups: [...h.entries()].map(([e, t]) => ({
			name: e,
			members: t.members.map((e) => e.id),
			...D(t.members, t.geo),
			explicit: t.geo !== void 0,
			holder: t.holder ?? t.members[0].docPath
		})),
		warnings: i
	};
}
//#endregion
export { c as _, f as a, C as c, T as d, S as f, i as g, n as h, p as i, D as l, r as m, u as n, F as o, k as p, m as r, E as s, d as t, P as u, s as v, l as y };

//# sourceMappingURL=graph-C2fVzQvi.js.map