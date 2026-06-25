import { ref as g, onBeforeUnmount as T } from "vue";
function d() {
  return `nm-toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
function h(s = {}) {
  const { maxCount: c = 5 } = s, a = g([]), t = /* @__PURE__ */ new Map();
  let r = !1;
  function n(e) {
    const l = t.get(e);
    l && (clearTimeout(l), t.delete(e));
  }
  function f(e) {
    const l = d(), o = {
      id: l,
      message: e.message,
      type: e.type || "info",
      duration: e.duration ?? 3e3,
      closable: e.closable ?? !0,
      timestamp: Date.now(),
      leaving: !1
    };
    if (a.value = [...a.value.slice(Math.max(0, a.value.length - (c - 1))), o], r) {
      const u = t.get("__clearAll");
      u && (clearTimeout(u), t.delete("__clearAll")), r = !1, a.value = a.value.filter((v) => !v.leaving);
    }
    return o.duration > 0 && (n(l), t.set(
      l,
      setTimeout(() => i(l), o.duration)
    )), l;
  }
  function i(e) {
    n(e);
    const l = a.value.find((o) => o.id === e);
    l && (l.leaving = !0), t.set(
      e,
      setTimeout(() => {
        a.value = a.value.filter((o) => o.id !== e), t.delete(e);
      }, 250)
    );
  }
  function m() {
    t.forEach((e) => clearTimeout(e)), t.clear(), r = !0, a.value.forEach((e) => {
      e.leaving = !0;
    }), t.set(
      "__clearAll",
      setTimeout(() => {
        a.value = [], t.delete("__clearAll"), r = !1;
      }, 250)
    );
  }
  return T(() => {
    t.forEach((e) => clearTimeout(e)), t.clear();
  }), { toasts: a, addToast: f, removeToast: i, clearAll: m };
}
export {
  h as useToast
};
