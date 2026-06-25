import { computed as w, ref as g, watch as D } from "vue";
function v(r, n, e) {
  return Math.min(Math.max(r, n), e);
}
function y(r, n) {
  const e = Math.pow(10, n);
  return Math.round(r * e) / e;
}
function F(r) {
  if (!Number.isFinite(r) || r <= 0) return 0;
  const n = String(r), e = n.indexOf(".");
  return e === -1 ? 0 : n.length - e - 1;
}
function m(r, n) {
  return r == null || !Number.isFinite(r) ? "" : y(r, n).toFixed(n);
}
function k(r) {
  const n = r.trim();
  if (n === "" || n === "-" || n === "+") return;
  const e = Number(n);
  return Number.isFinite(e) ? e : void 0;
}
function A(r) {
  const {
    modelValue: n,
    min: e = -1 / 0,
    max: s = 1 / 0,
    step: c = 1,
    precision: d,
    disabled: o
  } = r, a = w(() => d !== void 0 ? d : F(c)), i = g(m(n.value, a.value)), I = w(() => i.value);
  D(n, (t) => {
    const u = m(t, a.value);
    k(i.value) !== t && (i.value = u);
  });
  function p(t) {
    if (c <= 0) return t;
    const u = a.value, f = Math.round((t - e) / c) * c + e;
    return y(f, u);
  }
  function l(t) {
    if (o != null && o.value) return;
    const u = v(t, e, s), f = p(u);
    n.value = f, i.value = m(f, a.value);
  }
  function h() {
    const t = n.value ?? e, u = v(t + c, e, s);
    l(p(u));
  }
  function x() {
    const t = n.value ?? s, u = v(t - c, e, s);
    l(p(u));
  }
  function M(t) {
    if (!(o != null && o.value))
      switch (t.key) {
        case "ArrowUp": {
          t.preventDefault(), h();
          break;
        }
        case "ArrowDown": {
          t.preventDefault(), x();
          break;
        }
        case "Enter": {
          t.preventDefault(), N();
          break;
        }
      }
  }
  function b(t) {
    if (o != null && o.value) return;
    const u = t.target;
    i.value = u.value;
  }
  function N() {
    if (o != null && o.value) return;
    const t = k(i.value);
    if (t === void 0) {
      const u = n.value ?? e;
      i.value = m(u, a.value);
      return;
    }
    l(t);
  }
  return {
    displayValue: I,
    increment: h,
    decrement: x,
    setValue: l,
    handleInput: b,
    handleKeydown: M,
    handleBlur: N
  };
}
export {
  m as formatNumber,
  k as parseNumber,
  A as useNumberInput
};
