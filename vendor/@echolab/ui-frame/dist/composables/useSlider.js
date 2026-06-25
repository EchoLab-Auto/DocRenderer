import { ref as A, computed as h } from "vue";
function f(n, t, e) {
  return Math.min(Math.max(n, t), e);
}
function k(n, t, e) {
  return e <= 0 ? n : Math.round((n - t) / e) * e + t;
}
function V(n, t, e, r, a, o, i) {
  if (e <= 0) return r;
  let u = (n - t) / e;
  i && (u = 1 - u), u = f(u, 0, 1);
  const p = r + u * (a - r);
  return k(p, r, o);
}
function b(n) {
  const { modelValue: t, min: e, max: r, step: a, disabled: o, vertical: i } = n, u = A(!1), p = h(() => f(t.value, e, r)), x = h(() => {
    const c = r - e;
    return c === 0 ? 0 : (p.value - e) / c * 100;
  });
  function s(c) {
    if (o != null && o.value) return;
    const d = f(c, e, r), m = k(d, e, a);
    t.value = m;
  }
  function v(c) {
    if (o != null && o.value) return;
    const d = (i == null ? void 0 : i.value) ?? !1;
    let m = !0;
    const w = p.value;
    switch (c.key) {
      case "ArrowRight":
      case "ArrowUp": {
        const l = (d && c.key === "ArrowUp", a), g = f(w + l, e, r);
        s(g);
        break;
      }
      case "ArrowLeft":
      case "ArrowDown": {
        const g = f(w - a, e, r);
        s(g);
        break;
      }
      case "Home": {
        s(e);
        break;
      }
      case "End": {
        s(r);
        break;
      }
      case "PageUp": {
        const l = Math.max(a * 10, (r - e) / 10);
        s(f(w + l, e, r));
        break;
      }
      case "PageDown": {
        const l = Math.max(a * 10, (r - e) / 10);
        s(f(w - l, e, r));
        break;
      }
      default: {
        m = !1;
        break;
      }
    }
    m && c.preventDefault();
  }
  return {
    sliderValue: p,
    percentage: x,
    setValue: s,
    handleKeydown: v,
    isDragging: u
  };
}
export {
  V as coordinateToValue,
  b as useSlider
};
