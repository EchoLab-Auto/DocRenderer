import { ref as y, computed as T } from "vue";
function K(h) {
  const { modelValue: r, options: p, disabled: u } = h, t = y(!1), s = y("");
  let f = null;
  function i() {
    s.value = "", f && (clearTimeout(f), f = null);
  }
  function d(e) {
    s.value += e.toLowerCase(), f && clearTimeout(f), f = setTimeout(() => {
      s.value = "";
    }, 500);
    const l = p.value.filter((c) => !c.disabled), n = s.value;
    let a = l.find((c) => c.label.toLowerCase().startsWith(n));
    a || (a = l.find((c) => c.label.toLowerCase().includes(n))), a && o(a);
  }
  const m = T(() => p.value.find((e) => e.value === r.value));
  function v() {
    u != null && u.value || (t.value = !t.value);
  }
  function k() {
    t.value = !1, i();
  }
  function o(e) {
    e.disabled || u != null && u.value || (r.value = e.value);
  }
  function g(e) {
    e.disabled || u != null && u.value || (r.value = e.value, t.value = !1, i());
  }
  function w(e) {
    u != null && u.value || (r.value = e, t.value = !1, i());
  }
  function D(e) {
    if (u != null && u.value) return;
    if (e.key === "Escape") {
      t.value = !1, i();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(), v();
      return;
    }
    if (e.key === "ArrowDown" && !t.value) {
      e.preventDefault(), t.value = !0;
      return;
    }
    if (!t.value) return;
    const l = p.value.filter((a) => !a.disabled);
    if (l.length === 0) return;
    const n = l.findIndex((a) => a.value === r.value);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const a = n + 1 < l.length ? l[n + 1] : l[0];
      a && o(a);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const a = n - 1 >= 0 ? l[n - 1] : l[l.length - 1];
      a && o(a);
    } else e.key === "Home" ? (e.preventDefault(), l[0] && o(l[0])) : e.key === "End" ? (e.preventDefault(), l[l.length - 1] && o(l[l.length - 1])) : e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && (e.preventDefault(), d(e.key));
  }
  function O(e, l) {
    l.contains(e) || (t.value = !1, i());
  }
  return {
    isOpen: t,
    selectedOption: m,
    toggleOpen: v,
    close: k,
    selectOption: g,
    clearValue: w,
    handleKeydown: D,
    handleBlur: O
  };
}
export {
  K as useSelect
};
