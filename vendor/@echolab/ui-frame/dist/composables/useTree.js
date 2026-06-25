import { ref as y, computed as m, watch as A, nextTick as E } from "vue";
function M(c, a) {
  if (c.length !== a.length) return !1;
  for (let r = 0; r < c.length; r++)
    if (c[r] !== a[r]) return !1;
  return !0;
}
function G(c) {
  const a = [];
  function r(l) {
    var u;
    for (const o of l)
      a.push(o.key), (u = o.children) != null && u.length && r(o.children);
  }
  return r(c), a;
}
function J(c, a) {
  const r = [], l = a.toLowerCase();
  function u(o) {
    var s;
    let t = !1;
    for (const f of o) {
      const k = f.label.toLowerCase().includes(l);
      let h = !1;
      (s = f.children) != null && s.length && (h = u(f.children)), (k || h) && (r.push(f.key), t = !0);
    }
    return t;
  }
  return u(c), r;
}
function p(c, a) {
  var r;
  for (const l of c) {
    if (l.key === a) return l;
    if ((r = l.children) != null && r.length) {
      const u = p(l.children, a);
      if (u) return u;
    }
  }
  return null;
}
function I(c, a, r = []) {
  var l;
  for (const u of c)
    r.push(u), (l = u.children) != null && l.length && a.includes(u.key) && I(u.children, a, r);
  return r;
}
function P(c, a = null, r = /* @__PURE__ */ new Map()) {
  var l;
  for (const u of c)
    r.set(u.key, a), (l = u.children) != null && l.length && P(u.children, u.key, r);
  return r;
}
function X(c) {
  var D, L;
  const { data: a } = c, r = c.multiple ?? y(!1), l = y([...((D = c.expandedKeys) == null ? void 0 : D.value) ?? []]), u = y([...((L = c.selectedKeys) == null ? void 0 : L.value) ?? []]), o = y(""), t = y(null);
  let s = !1;
  function f(e, n) {
    e && A(
      () => e.value,
      (i) => {
        if (s) return;
        const d = [...i];
        M(n.value, d) || (s = !0, n.value = d, E(() => {
          s = !1;
        }));
      },
      { immediate: !0, deep: !0 }
    );
  }
  function k(e, n) {
    n && A(
      () => e.value,
      (i) => {
        if (s) return;
        const d = [...i];
        M(n.value, d) || (s = !0, n.value = d, E(() => {
          s = !1;
        }));
      },
      { deep: !0 }
    );
  }
  f(c.selectedKeys, u), f(c.expandedKeys, l), k(u, c.selectedKeys), k(l, c.expandedKeys);
  const h = m(() => G(a.value)), v = m(() => I(a.value, l.value)), C = m(() => P(a.value));
  function g(e) {
    const n = l.value.indexOf(e);
    n === -1 ? l.value.push(e) : l.value.splice(n, 1);
  }
  function K(e) {
    if (r.value) {
      const n = u.value.indexOf(e);
      n === -1 ? u.value.push(e) : u.value.splice(n, 1);
    } else
      u.value = [e];
  }
  function F() {
    l.value = [...h.value];
  }
  function N() {
    l.value = [];
  }
  function O(e) {
    if (o.value = e, e.trim()) {
      const n = J(a.value, e);
      l.value = [.../* @__PURE__ */ new Set([...l.value, ...n])];
    }
  }
  let x = "", w = null;
  function S(e) {
    x += e.toLowerCase(), w && clearTimeout(w), w = setTimeout(() => {
      x = "";
    }, 500);
    const n = v.value, i = t.value ? n.findIndex((b) => b.key === t.value) + 1 : 0, T = [...n.slice(i), ...n.slice(0, i)].find((b) => b.label.toLowerCase().startsWith(x));
    T && (t.value = T.key);
  }
  function q() {
    const e = v.value;
    if (!e.length) return;
    if (!t.value) {
      t.value = e[0].key;
      return;
    }
    const n = e.findIndex((i) => i.key === t.value);
    n >= 0 && n < e.length - 1 && (t.value = e[n + 1].key);
  }
  function B() {
    const e = v.value;
    if (!e.length) return;
    if (!t.value) {
      t.value = e[e.length - 1].key;
      return;
    }
    const n = e.findIndex((i) => i.key === t.value);
    n > 0 && (t.value = e[n - 1].key);
  }
  function H() {
    const e = v.value;
    e.length && (t.value = e[0].key);
  }
  function R() {
    const e = v.value;
    e.length && (t.value = e[e.length - 1].key);
  }
  function U() {
    if (!t.value) return;
    const e = C.value.get(t.value);
    e && (t.value = e);
  }
  function V() {
    var n;
    if (!t.value) return;
    const e = p(a.value, t.value);
    (n = e == null ? void 0 : e.children) != null && n.length && (l.value.includes(e.key) || g(e.key), t.value = e.children[0].key);
  }
  function W() {
    var n;
    if (!t.value) return;
    const e = p(a.value, t.value);
    (n = e == null ? void 0 : e.children) != null && n.length && l.value.includes(e.key) ? g(e.key) : U();
  }
  function j() {
    var n;
    if (!t.value) return;
    const e = p(a.value, t.value);
    (n = e == null ? void 0 : e.children) != null && n.length && g(e.key);
  }
  function z(e) {
    const n = e.key;
    if (n.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      S(n), e.preventDefault();
      return;
    }
    switch (n) {
      case "ArrowDown":
        q(), e.preventDefault();
        break;
      case "ArrowUp":
        B(), e.preventDefault();
        break;
      case "ArrowRight":
        V(), e.preventDefault();
        break;
      case "ArrowLeft":
        W(), e.preventDefault();
        break;
      case "Enter":
      case " ":
        t.value && K(t.value), e.preventDefault();
        break;
      case "Home":
        H(), e.preventDefault();
        break;
      case "End":
        R(), e.preventDefault();
        break;
      case "*":
        j(), e.preventDefault();
        break;
    }
  }
  return {
    localExpandedKeys: l,
    localSelectedKeys: u,
    allKeys: h,
    searchText: o,
    focusedKey: t,
    toggleExpand: g,
    select: K,
    findNode: p,
    expandAll: F,
    collapseAll: N,
    onSearchInput: O,
    handleKeydown: z
  };
}
export {
  X as useTree
};
