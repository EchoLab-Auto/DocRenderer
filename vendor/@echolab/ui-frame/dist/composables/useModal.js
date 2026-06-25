import { ref as c, watch as C, nextTick as h, onMounted as M, onBeforeUnmount as W } from "vue";
const d = /* @__PURE__ */ new WeakMap();
function p(o) {
  return d.get(o) ?? 0;
}
function k(o, n) {
  n <= 0 ? d.delete(o) : d.set(o, n);
}
function E() {
  return typeof window > "u" ? 0 : window.innerWidth - document.documentElement.clientWidth;
}
function A(o) {
  const { modelValue: n } = o, m = o.closable ?? c(!0), w = o.destroyOnClose ?? c(!1), l = c(n.value), i = c(n.value), s = c(null);
  let a;
  function g() {
    if (typeof document > "u") return;
    const e = p(document);
    if (k(document, e + 1), e === 0) {
      const t = E();
      t > 0 && (document.body.style.paddingRight = `${t}px`), document.body.style.overflow = "hidden";
    }
  }
  function v() {
    if (typeof document > "u") return;
    const e = p(document), t = Math.max(0, e - 1);
    k(document, t), t === 0 && (document.body.style.overflow = "", document.body.style.paddingRight = "");
  }
  C(
    () => n.value,
    (e) => {
      var t;
      if (e) {
        i.value = !0;
        const u = document.activeElement;
        s.value = u instanceof HTMLElement ? u : null, g(), h(() => {
          l.value = !0;
        });
      } else
        l.value = !1, clearTimeout(a), w.value && (a = setTimeout(() => {
          i.value = !1;
        }, 200)), v(), (t = s.value) == null || t.focus();
    }
  );
  function b() {
    m.value && (n.value = !1);
  }
  function x() {
    n.value = !1;
  }
  function y(e) {
    return e ? Array.from(
      e.querySelectorAll(
        'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), [contenteditable]:not([contenteditable="false"])'
      )
    ) : [];
  }
  function T(e) {
    if (!e) return;
    e.focus();
    const t = y(e);
    t.length > 0 && t[0].focus();
  }
  function S(e, t) {
    if (e.key === "Escape" && m.value) {
      b();
      return;
    }
    if (e.key === "Tab" && t) {
      const u = y(t);
      if (u.length === 0) return;
      const r = u[0], f = u[u.length - 1];
      e.shiftKey ? document.activeElement === r && (e.preventDefault(), f == null || f.focus()) : document.activeElement === f && (e.preventDefault(), r == null || r.focus());
    }
  }
  return M(() => {
    n.value && (i.value = !0, h(() => {
      l.value = !0;
    }));
  }), W(() => {
    var e;
    clearTimeout(a), v(), l.value && ((e = s.value) == null || e.focus());
  }), {
    visible: l,
    rendered: i,
    close: b,
    confirm: x,
    handleKeydown: S,
    focusDialog: T
  };
}
export {
  A as useModal
};
