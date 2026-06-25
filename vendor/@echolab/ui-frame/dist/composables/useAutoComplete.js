import { ref as f, computed as L, watch as C } from "vue";
function m(d) {
  return d.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function _(d) {
  const { modelValue: k, options: g, searchFn: i, loading: n, debounceMs: D = 300 } = d, r = f(""), u = f(!1), t = f(-1), v = f([]), w = f(!1);
  let s = null;
  function T() {
    s && (clearTimeout(s), s = null);
  }
  const p = L(() => i ? v.value : (g == null ? void 0 : g.value) ?? []), y = L(() => {
    const e = r.value.trim().toLowerCase();
    return i || !e ? p.value : p.value.filter((l) => l.label.toLowerCase().includes(e));
  });
  function x(e) {
    const l = r.value.trim();
    if (!l) return m(e);
    const a = e.toLowerCase(), b = l.toLowerCase();
    let h = "", c = 0;
    for (; c < e.length; ) {
      const o = a.indexOf(b, c);
      if (o === -1) {
        h += m(e.slice(c));
        break;
      }
      h += m(e.slice(c, o)), h += '<mark class="nm-autocomplete__mark">' + m(e.slice(o, o + l.length)) + "</mark>", c = o + l.length;
    }
    return h;
  }
  function A(e) {
    if (!i) return;
    s && clearTimeout(s);
    const l = e.trim();
    if (!l) {
      v.value = [], w.value = !1, n && (n.value = !1);
      return;
    }
    w.value = !0, n && (n.value = !0), s = setTimeout(async () => {
      try {
        const a = await i(l);
        v.value = a;
      } catch {
        v.value = [];
      } finally {
        w.value = !1, n && (n.value = !1);
      }
    }, D);
  }
  C(
    k,
    (e) => {
      if (e === void 0 || e === "" || e === null)
        return;
      const a = p.value.find((b) => b.value === e);
      a && a.label !== r.value && (r.value = a.label);
    },
    { flush: "sync" }
  ), C(y, () => {
    t.value = -1;
  });
  function q() {
    u.value = !0;
  }
  function E() {
    u.value = !1, t.value = -1;
  }
  function O(e) {
    e.disabled || (k.value = e.value, r.value = e.label, u.value = !1, t.value = -1);
  }
  function I(e) {
    r.value = e, t.value = -1, i && A(e), u.value || (u.value = !0);
  }
  function M(e) {
    const l = y.value.filter((a) => !a.disabled);
    switch (e.key) {
      case "ArrowDown":
        if (e.preventDefault(), !u.value) {
          u.value = !0;
          return;
        }
        if (l.length === 0) return;
        t.value = t.value + 1 >= l.length ? 0 : t.value + 1;
        break;
      case "ArrowUp":
        if (e.preventDefault(), !u.value) {
          u.value = !0;
          return;
        }
        if (l.length === 0) return;
        t.value = t.value - 1 < 0 ? l.length - 1 : t.value - 1;
        break;
      case "Enter":
        if (!u.value || l.length === 0) return;
        e.preventDefault(), t.value >= 0 && t.value < l.length && O(l[t.value]);
        break;
      case "Escape":
        e.preventDefault(), u.value = !1, t.value = -1;
        break;
    }
  }
  return {
    inputValue: r,
    isOpen: u,
    filteredOptions: y,
    activeIndex: t,
    highlightMatch: x,
    selectOption: O,
    handleKeydown: M,
    handleInput: I,
    open: q,
    close: E,
    // Expose cleanup for lifecycle integration
    cleanupTimers: T
  };
}
export {
  _ as useAutoComplete
};
