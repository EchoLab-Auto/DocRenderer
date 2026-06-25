import { ref as l, watch as W, nextTick as h, onMounted as D, onBeforeUnmount as E } from "vue";
const v = /* @__PURE__ */ new WeakMap();
function k(n) {
  return v.get(n) ?? 0;
}
function p(n, o) {
  o <= 0 ? v.delete(n) : v.set(n, o);
}
function L() {
  return typeof window > "u" ? 0 : window.innerWidth - document.documentElement.clientWidth;
}
function B(n) {
  const { modelValue: o } = n, g = n.maskClosable ?? l(!0), f = n.closable ?? l(!0), x = n.destroyOnClose ?? l(!1), c = l(o.value), i = l(o.value), r = l(null);
  let d;
  function C() {
    if (typeof document > "u") return;
    const e = k(document);
    if (p(document, e + 1), e === 0) {
      const t = L();
      t > 0 && (document.body.style.paddingRight = `${t}px`), document.body.style.overflow = "hidden";
    }
  }
  function b() {
    if (typeof document > "u") return;
    const e = k(document), t = Math.max(0, e - 1);
    p(document, t), t === 0 && (document.body.style.overflow = "", document.body.style.paddingRight = "");
  }
  W(
    () => o.value,
    (e) => {
      var t;
      if (e) {
        i.value = !0;
        const u = document.activeElement;
        r.value = u instanceof HTMLElement ? u : null, C(), h(() => {
          c.value = !0;
        });
      } else
        c.value = !1, clearTimeout(d), x.value && (d = setTimeout(() => {
          i.value = !1;
        }, 200)), b(), (t = r.value) == null || t.focus();
    }
  );
  function w() {
    o.value = !0;
  }
  function m() {
    f.value && (o.value = !1);
  }
  function T() {
    g.value && f.value && m();
  }
  function y(e) {
    return e ? Array.from(
      e.querySelectorAll(
        'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled]), [contenteditable]:not([contenteditable="false"])'
      )
    ) : [];
  }
  function S(e) {
    if (!e) return;
    e.focus();
    const t = y(e);
    t.length > 0 && t[0].focus();
  }
  function M(e, t) {
    if (e.key === "Escape" && f.value) {
      m();
      return;
    }
    if (e.key === "Tab" && t) {
      const u = y(t);
      if (u.length === 0) return;
      const a = u[0], s = u[u.length - 1];
      e.shiftKey ? document.activeElement === a && (e.preventDefault(), s == null || s.focus()) : document.activeElement === s && (e.preventDefault(), a == null || a.focus());
    }
  }
  return D(() => {
    o.value && (i.value = !0, h(() => {
      c.value = !0;
    }));
  }), E(() => {
    var e;
    clearTimeout(d), b(), c.value && ((e = r.value) == null || e.focus());
  }), {
    isOpen: c,
    rendered: i,
    open: w,
    close: m,
    handleKeydown: M,
    handleMaskClick: T,
    focusDrawer: S
  };
}
export {
  B as useDrawer
};
