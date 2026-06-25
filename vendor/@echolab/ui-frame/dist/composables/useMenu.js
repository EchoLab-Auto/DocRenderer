import { ref as p, watch as g, nextTick as b, computed as x } from "vue";
function C(a, u, t = []) {
  var r;
  for (const i of a)
    t.push(i), (r = i.children) != null && r.length && u.includes(i.key) && C(i.children, u, t);
  return t;
}
function J(a) {
  const u = [];
  function t(r) {
    var i;
    for (const n of r)
      u.push(n.key), (i = n.children) != null && i.length && t(n.children);
  }
  return t(a), u;
}
function K(a, u) {
  var t;
  for (const r of a) {
    if (r.key === u) return r;
    if ((t = r.children) != null && t.length) {
      const i = K(r.children, u);
      if (i) return i;
    }
  }
  return null;
}
function M(a, u = null, t = /* @__PURE__ */ new Map()) {
  var r;
  for (const i of a)
    t.set(i.key, u), (r = i.children) != null && r.length && M(i.children, i.key, t);
  return t;
}
function z(a, u) {
  if (a.length !== u.length) return !1;
  for (let t = 0; t < a.length; t++)
    if (a[t] !== u[t]) return !1;
  return !0;
}
function X(a) {
  const { items: u, onSelect: t } = a, r = a.mode ?? p("vertical"), i = a.disabled ?? p(!1), n = p(null), f = p([]);
  let o = !1;
  a.activeKey && (g(
    () => a.activeKey.value,
    (e) => {
      o || n.value !== e && (o = !0, n.value = e, b(() => {
        o = !1;
      }));
    },
    { immediate: !0 }
  ), g(
    () => n.value,
    (e) => {
      o || a.activeKey.value !== e && (o = !0, a.activeKey.value = e, b(() => {
        o = !1;
      }));
    }
  ));
  let d = !1;
  a.expandedKeys && (g(
    () => a.expandedKeys.value,
    (e) => {
      d || z(f.value, e) || (d = !0, f.value = [...e], b(() => {
        d = !1;
      }));
    },
    { immediate: !0, deep: !0 }
  ), g(
    () => f.value,
    (e) => {
      d || z(a.expandedKeys.value, e) || (d = !0, a.expandedKeys.value = [...e], b(() => {
        d = !1;
      }));
    },
    { deep: !0 }
  ));
  const N = x(() => J(u.value)), F = x(() => C(u.value, f.value)), V = x(() => M(u.value)), v = x(() => F.value.filter((e) => !e.disabled));
  function y(e) {
    return f.value.includes(e);
  }
  function H(e) {
    return n.value === e;
  }
  function k(e) {
    f.value.includes(e) || f.value.push(e);
  }
  function w(e) {
    const l = f.value.indexOf(e);
    l !== -1 && f.value.splice(l, 1);
  }
  function D(e) {
    y(e) ? w(e) : k(e);
  }
  function O(e) {
    var l;
    i.value || e.disabled || ((l = e.children) != null && l.length ? D(e.key) : (n.value = e.key, t == null || t(e)));
  }
  function _(e) {
    var l;
    i.value || e.disabled || (r.value === "horizontal" && ((l = e.children) != null && l.length) && k(e.key), n.value = e.key);
  }
  function q(e) {
    var l;
    i.value || e.disabled || r.value === "horizontal" && ((l = e.children) != null && l.length);
  }
  let m = "", A = null;
  function B(e) {
    m += e.toLowerCase(), A && clearTimeout(A), A = setTimeout(() => {
      m = "";
    }, 500);
    const l = v.value, c = n.value ? l.findIndex((E) => E.key === n.value) + 1 : 0, s = [...l.slice(c), ...l.slice(0, c)].find((E) => E.label.toLowerCase().startsWith(m));
    s && (n.value = s.key);
  }
  function I() {
    const e = v.value;
    if (!e.length) return;
    if (!n.value) {
      n.value = e[0].key;
      return;
    }
    const l = e.findIndex((c) => c.key === n.value);
    l >= 0 && l < e.length - 1 ? n.value = e[l + 1].key : n.value = e[0].key;
  }
  function L() {
    const e = v.value;
    if (!e.length) return;
    if (!n.value) {
      n.value = e[e.length - 1].key;
      return;
    }
    const l = e.findIndex((c) => c.key === n.value);
    l > 0 ? n.value = e[l - 1].key : n.value = e[e.length - 1].key;
  }
  function R() {
    const e = v.value;
    e.length && (n.value = e[0].key);
  }
  function U() {
    const e = v.value;
    e.length && (n.value = e[e.length - 1].key);
  }
  function W() {
    if (!n.value) return;
    const e = V.value.get(n.value);
    e && (n.value = e);
  }
  function P() {
    var l;
    if (!n.value) return;
    const e = K(u.value, n.value);
    (l = e == null ? void 0 : e.children) != null && l.length && (y(e.key) || k(e.key), n.value = e.children[0].key);
  }
  function T() {
    var l;
    if (!n.value) return;
    const e = K(u.value, n.value);
    (l = e == null ? void 0 : e.children) != null && l.length && y(e.key) ? w(e.key) : W();
  }
  function j() {
    var l;
    if (!n.value) return;
    const e = K(u.value, n.value);
    !e || e.disabled || ((l = e.children) != null && l.length ? D(e.key) : t == null || t(e));
  }
  function G(e) {
    if (i.value) return;
    const l = e.key;
    if (l.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      B(l), e.preventDefault();
      return;
    }
    const h = r.value === "vertical", s = r.value === "horizontal";
    switch (l) {
      case "ArrowDown":
        h ? I() : s && P(), e.preventDefault();
        break;
      case "ArrowUp":
        h ? L() : s && T(), e.preventDefault();
        break;
      case "ArrowRight":
        h ? P() : s && I(), e.preventDefault();
        break;
      case "ArrowLeft":
        h ? T() : s && L(), e.preventDefault();
        break;
      case "Enter":
      case " ":
        j(), e.preventDefault();
        break;
      case "Escape":
        f.value = [], n.value = null, e.preventDefault();
        break;
      case "Home":
        R(), e.preventDefault();
        break;
      case "End":
        U(), e.preventDefault();
        break;
    }
  }
  return {
    activeKey: n,
    expandedKeys: f,
    allKeys: N,
    handleKeydown: G,
    handleItemClick: O,
    handleItemEnter: _,
    handleItemLeave: q,
    isExpanded: y,
    isActive: H,
    expand: k,
    collapse: w,
    toggleExpand: D
  };
}
export {
  X as useMenu
};
