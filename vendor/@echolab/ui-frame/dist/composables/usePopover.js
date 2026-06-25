import { ref as k, onMounted as y, onBeforeUnmount as h, nextTick as p } from "vue";
function C(r = {}) {
  const { trigger: i, disabled: e } = r, v = r.delay ?? 150, n = k(!1);
  let u = null, t = null;
  const m = (i == null ? void 0 : i.value) ?? "click";
  function f() {
    e != null && e.value || (t && (clearTimeout(t), t = null), m === "hover" ? u = setTimeout(() => {
      n.value = !0;
    }, v) : n.value = !0);
  }
  function c() {
    u && (clearTimeout(u), u = null), t = setTimeout(() => {
      n.value = !1;
    }, 100);
  }
  function s() {
    e != null && e.value || (n.value ? c() : f());
  }
  function d(l) {
    if (!(e != null && e.value)) {
      if (l.key === "Escape") {
        n.value = !1;
        return;
      }
      l.key === "Tab" && n.value && p(() => {
        typeof document > "u" || (n.value = !1);
      });
    }
  }
  function a(l) {
    n.value;
  }
  let o = null;
  function T(l) {
    !n.value || e != null && e.value || a();
  }
  return y(() => {
    typeof document > "u" || (o = (l) => {
      T();
    }, document.addEventListener("click", o, !0));
  }), h(() => {
    u && (clearTimeout(u), u = null), t && (clearTimeout(t), t = null), typeof document < "u" && o && document.removeEventListener("click", o, !0);
  }), {
    isOpen: n,
    show: f,
    hide: c,
    toggle: s,
    handleKeydown: d,
    handleClickOutside: a
  };
}
export {
  C as usePopover
};
