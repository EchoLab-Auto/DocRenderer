import { computed as T, ref as s, onMounted as U, onBeforeUnmount as Y, watch as V } from "vue";
function k(w) {
  const { items: i } = w, x = T(() => {
    const e = w.overscan;
    return e == null ? 5 : typeof e == "number" ? e : e.value ?? 5;
  }), B = T(() => {
    const e = w.itemHeight;
    let n;
    if (typeof e == "number")
      n = () => e;
    else if (typeof e == "function")
      n = e;
    else {
      const t = e.value;
      n = typeof t == "number" ? () => t : t;
    }
    return n;
  }), h = s(null), c = s(0);
  let a = null;
  function R() {
    a && (a.disconnect(), a = null);
  }
  function C() {
    R();
    const e = h.value;
    !e || typeof ResizeObserver > "u" || (c.value = e.clientHeight, a = new ResizeObserver(([n]) => {
      const t = n.contentRect.height;
      t !== c.value && (c.value = t);
    }), a.observe(e));
  }
  U(() => {
    C();
  }), Y(() => {
    R();
  });
  const M = s(0);
  function E() {
    const e = h.value;
    e && (M.value = e.scrollTop);
  }
  let H = /* @__PURE__ */ new Map();
  function z(e) {
    const n = B.value, t = H.get(e);
    if (t !== void 0) return t;
    const o = n(e);
    return H.set(e, t !== void 0 ? t : o), o;
  }
  function I() {
    const e = i.value.length, n = [0];
    for (let t = 0; t < e; t++) {
      const o = n[t];
      n.push(o + z(t));
    }
    return n;
  }
  const y = s(0), m = s(0), d = s(0), O = s(0);
  function S() {
    const e = i.value.length;
    if (e === 0) {
      y.value = 0, m.value = 0, d.value = 0, O.value = 0;
      return;
    }
    const n = c.value;
    if (n === 0) return;
    const t = x.value, o = M.value, l = I();
    y.value = l[e];
    let p = 0, r = e - 1, g = 0;
    for (; p <= r; ) {
      const b = p + r >>> 1;
      l[b + 1] <= o ? p = b + 1 : (g = b, r = b - 1);
    }
    const f = Math.max(0, g - t), v = o + n;
    let u = f;
    for (; u < e && l[u + 1] < v; )
      u++;
    u = Math.min(e, u + 1 + t), m.value = f, d.value = u, O.value = l[f];
  }
  V(
    () => i.value,
    () => {
      H = /* @__PURE__ */ new Map(), S();
    }
  ), V([M, c, x], () => S(), { deep: !1, immediate: !1 });
  const F = T(() => i.value.slice(m.value, d.value));
  function L(e, n = "top") {
    const t = h.value;
    if (!t) return;
    const o = i.value.length;
    if (o === 0) return;
    const l = Math.max(0, Math.min(o - 1, e)), r = I()[l], g = z(l), f = c.value;
    let v;
    n === "center" ? v = r - (f - g) / 2 : v = r, t.scrollTo({ top: Math.max(0, v), behavior: "smooth" });
  }
  return {
    containerRef: h,
    visibleItems: F,
    totalHeight: y,
    offsetY: O,
    startIndex: m,
    endIndex: d,
    scrollTo: L,
    handleScroll: E
  };
}
export {
  k as useVirtualList
};
