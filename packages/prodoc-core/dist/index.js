const d = /^---\s*\n([\s\S]*?)\n---\s*\n?/;
function h(n) {
  const t = n.match(d);
  if (!t)
    return { meta: {}, body: n };
  const i = t[1], s = n.slice(t[0].length), c = {};
  for (const o of i.split(`
`)) {
    const r = o.indexOf(":");
    if (r === -1) continue;
    const l = o.slice(0, r).trim();
    let e = o.slice(r + 1).trim();
    /^-?\d+$/.test(e) ? e = parseInt(e, 10) : /^-?\d+\.\d+$/.test(e) ? e = parseFloat(e) : e === "true" ? e = !0 : e === "false" ? e = !1 : (e.startsWith('"') && e.endsWith('"') || e.startsWith("'") && e.endsWith("'")) && (e = e.slice(1, -1)), c[l] = e;
  }
  return { meta: c, body: s };
}
function p(n) {
  return n.replace(/\.md$/i, "").replace(/\//g, "-").replace(/\\/g, "-");
}
function m(n, t) {
  if (t.title && typeof t.title == "string")
    return t.title;
  const i = n.match(/^#\s+(.+)$/m);
  return i ? i[1].trim() : "Untitled";
}
function g(n, t) {
  const { meta: i, body: s } = h(t), c = m(s, i), o = typeof i.order == "number" ? i.order : 9999;
  return {
    id: p(n),
    title: c,
    path: n,
    content: t,
    body: s,
    meta: i,
    children: [],
    order: o
  };
}
function M(n) {
  const t = /* @__PURE__ */ new Map();
  for (const [r, l] of Object.entries(n)) {
    if (!r.endsWith(".md")) continue;
    const e = g(r, l);
    t.set(r, e);
  }
  const i = [], s = Array.from(t.keys()).sort();
  for (const r of s) {
    const l = r.split("/");
    if (l.length === 1) {
      i.push(r);
      continue;
    }
    let e = null;
    const f = `${l.slice(0, -1).join("/")}/index.md`;
    if (t.has(f) && f !== r)
      e = f;
    else {
      const a = l.slice(0, -1).join("/") + ".md";
      t.has(a) && (e = a);
    }
    if (e && t.has(e)) {
      const a = t.get(e), u = t.get(r);
      a.children.push(u);
    } else
      i.push(r);
  }
  for (const r of t.values())
    r.children.sort((l, e) => l.order - e.order || l.title.localeCompare(e.title));
  const c = i.map((r) => t.get(r)).sort((r, l) => r.order - l.order || r.title.localeCompare(l.title));
  return {
    id: "root",
    title: "Root",
    path: "",
    content: "",
    body: "",
    meta: {},
    children: c,
    order: 0
  };
}
function b(n) {
  const t = /* @__PURE__ */ new Map();
  function i(o) {
    t.set(o.path, o);
    for (const r of o.children)
      i(r);
  }
  i(n);
  const s = /* @__PURE__ */ new Map();
  function c(o) {
    s.set(o.id, o);
    for (const r of o.children)
      c(r);
  }
  return c(n), {
    root: n,
    nodeMap: t,
    findByPath(o) {
      return t.get(o);
    },
    findById(o) {
      return s.get(o);
    }
  };
}
function D(n) {
  const t = [];
  function i(s) {
    t.push(s);
    for (const c of s.children)
      i(c);
  }
  return i(n), t;
}
function I(n, t) {
  const i = [];
  function s(c, o, r) {
    if (c.id === o)
      return i.push(...r), !0;
    for (const l of c.children)
      if (s(l, o, [...r, c]))
        return !0;
    return !1;
  }
  return s(t, n.id, []), i;
}
function y(n) {
  var i;
  const t = ((i = n.path) == null ? void 0 : i.toLowerCase()) || "";
  return t.includes("api") ? "🔌" : t.includes("guide") ? "📖" : t.includes("config") ? "⚙️" : t.includes("example") ? "💡" : t.includes("install") ? "📦" : t.includes("changelog") ? "📝" : t.includes("faq") ? "❓" : "📄";
}
function T(n) {
  const t = n.children.length > 0 ? "📁" : y(n);
  return {
    key: n.path,
    label: n.title,
    icon: t,
    children: n.children.map(T)
  };
}
export {
  M as buildDocTree,
  b as createDocTree,
  g as createNode,
  m as extractTitle,
  D as flattenDocTree,
  I as getAncestors,
  y as getNodeIcon,
  T as nodeToTreeData,
  h as parseFrontmatter,
  p as pathToId
};
//# sourceMappingURL=index.js.map
