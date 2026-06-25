import { defineComponent as G, useCssVars as J, computed as u, ref as b, onMounted as Q, onBeforeUnmount as Z, watch as M, nextTick as k, openBlock as y, createElementBlock as T, normalizeClass as R, renderSlot as S, createBlock as ee, Teleport as te, createVNode as oe, Transition as ne, withCtx as ie, unref as x, normalizeStyle as re, createElementVNode as se, toDisplayString as ae, createCommentVNode as W } from "vue";
import { usePopover as le } from "../composables/usePopover.js";
import { u as ue } from "./createComponent-jnXBYqCm.js";
import { _ as ce } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismPopover.css';const de = ["aria-hidden"], fe = { class: "nm-popover__text" }, ve = {
  key: 0,
  class: "nm-popover__arrow"
}, pe = /* @__PURE__ */ G({
  __name: "NeumorphismPopover",
  props: {
    position: { default: "auto" },
    trigger: { default: "click" },
    disabled: { type: Boolean, default: !1 },
    offset: { default: 8 },
    width: { default: "auto" },
    content: {},
    showArrow: { type: Boolean, default: !0 }
  },
  emits: ["visible-change"],
  setup(m, { expose: K, emit: z }) {
    J((n) => ({
      v1e7eeb51: X.value
    }));
    const c = m, B = z, { resolveProp: v } = ue(), r = u(
      () => v(c.position, void 0, "auto")
    ), a = u(
      () => v(c.trigger, void 0, "click")
    ), w = u(() => v(c.offset, void 0, 8)), $ = u(() => v(c.width, void 0, "auto")), F = u(() => v(c.showArrow, void 0, !0)), {
      isOpen: s,
      show: h,
      hide: d,
      toggle: P,
      handleKeydown: H
    } = le({
      trigger: a,
      disabled: u(() => c.disabled)
    }), f = b(), p = b(), _ = b(
      r.value === "auto" ? "bottom" : r.value
    ), E = b({});
    function V() {
      const n = f.value;
      if (!n || typeof window > "u")
        return r.value === "auto" ? "bottom" : r.value;
      const t = n.getBoundingClientRect(), e = p.value, i = (e == null ? void 0 : e.offsetHeight) ?? 120, o = (e == null ? void 0 : e.offsetWidth) ?? 200, l = w.value;
      if (r.value === "auto") {
        const j = ["bottom", "top", "right", "left"];
        for (const q of j)
          switch (q) {
            case "bottom":
              if (t.bottom + i + l + 8 <= window.innerHeight) return "bottom";
              break;
            case "top":
              if (t.top - i - l - 8 >= 0) return "top";
              break;
            case "right":
              if (t.right + o + l + 8 <= window.innerWidth) return "right";
              break;
            case "left":
              if (t.left - o - l - 8 >= 0) return "left";
              break;
          }
        return "bottom";
      }
      switch (r.value) {
        case "top":
          if (t.top < i + l + 8) return "bottom";
          break;
        case "bottom":
          if (t.bottom + i + l + 8 > window.innerHeight) return "top";
          break;
        case "left":
          if (t.left < o + l + 8) return "right";
          break;
        case "right":
          if (t.right + o + l + 8 > window.innerWidth) return "left";
          break;
      }
      return r.value;
    }
    function C() {
      if (typeof window > "u") return;
      const n = f.value;
      if (!n) return;
      const t = V();
      _.value = t;
      const e = n.getBoundingClientRect(), i = w.value, o = {};
      switch (t) {
        case "top":
          o.top = `${e.top + window.scrollY - i}px`, o.left = `${e.left + window.scrollX + e.width / 2}px`, o.transform = "translate(-50%, -100%)";
          break;
        case "bottom":
          o.top = `${e.bottom + window.scrollY + i}px`, o.left = `${e.left + window.scrollX + e.width / 2}px`, o.transform = "translate(-50%, 0)";
          break;
        case "left":
          o.top = `${e.top + window.scrollY + e.height / 2}px`, o.left = `${e.left + window.scrollX - i}px`, o.transform = "translate(-100%, -50%)";
          break;
        case "right":
          o.top = `${e.top + window.scrollY + e.height / 2}px`, o.left = `${e.right + window.scrollX + i}px`, o.transform = "translate(0, -50%)";
          break;
      }
      $.value === "trigger" ? o.width = `${e.width}px` : typeof $.value == "number" && (o.width = `${$.value}px`), E.value = o;
    }
    function g() {
      s.value && C();
    }
    function L(n) {
      var e, i;
      if (!s.value || c.disabled) return;
      const t = n.target;
      (e = f.value) != null && e.contains(t) || (i = p.value) != null && i.contains(t) || d();
    }
    Q(() => {
      typeof document > "u" || document.addEventListener("click", L, !0);
    }), Z(() => {
      typeof document > "u" || document.removeEventListener("click", L, !0);
    }), M(s, (n) => {
      n ? (B("visible-change", !0), k(() => {
        C(), typeof window < "u" && (window.addEventListener("scroll", g, { passive: !0 }), window.addEventListener("resize", g));
      })) : (B("visible-change", !1), _.value = r.value === "auto" ? "bottom" : r.value, typeof window < "u" && (window.removeEventListener("scroll", g), window.removeEventListener("resize", g)));
    }), M(w, () => {
      s.value && k(C);
    });
    const X = u(() => `${w.value}px`), Y = u(() => [
      "nm-popover",
      `nm-popover--${_.value}`,
      { "nm-popover--visible": s.value }
    ]);
    function N(n) {
      H(n), n.key === "Tab" && s.value && k(() => {
        var e, i;
        if (typeof document > "u") return;
        const t = document.activeElement;
        t instanceof Node && !((e = f.value) != null && e.contains(t)) && !((i = p.value) != null && i.contains(t)) && d();
      });
    }
    function A() {
      a.value === "hover" && h();
    }
    function O() {
      a.value === "hover" && d();
    }
    function D() {
      a.value === "click" && P();
    }
    function I() {
      a.value === "focus" && h();
    }
    K({ show: h, hide: d, toggle: P, isOpen: s });
    function U(n) {
      a.value === "focus" && k(() => {
        var e, i;
        const t = document.activeElement;
        !((e = f.value) != null && e.contains(t)) && !((i = p.value) != null && i.contains(t)) && d();
      });
    }
    return (n, t) => (y(), T("div", {
      ref_key: "triggerRef",
      ref: f,
      class: R(["nm-popover-wrapper", { "nm-popover-wrapper--disabled": m.disabled }]),
      onMouseenter: A,
      onMouseleave: O,
      onClick: D,
      onFocusin: I,
      onFocusout: U,
      onKeydown: N
    }, [
      S(n.$slots, "default", {}, void 0, !0),
      (y(), ee(te, { to: "body" }, [
        oe(ne, { name: "nm-popover-fade" }, {
          default: ie(() => [
            x(s) && (m.content || n.$slots.content) ? (y(), T("div", {
              key: 0,
              ref_key: "popoverRef",
              ref: p,
              class: R(Y.value),
              role: "dialog",
              "aria-hidden": !x(s),
              style: re(E.value),
              onKeydown: N,
              onMouseenter: t[0] || (t[0] = (e) => a.value === "hover" ? x(h)() : void 0),
              onMouseleave: t[1] || (t[1] = (e) => a.value === "hover" ? x(d)() : void 0)
            }, [
              S(n.$slots, "content", {}, () => [
                se("span", fe, ae(m.content), 1)
              ], !0),
              F.value ? (y(), T("span", ve)) : W("", !0)
            ], 46, de)) : W("", !0)
          ]),
          _: 3
        })
      ]))
    ], 34));
  }
}), be = /* @__PURE__ */ ce(pe, [["__scopeId", "data-v-37f044a3"]]);
export {
  be as N
};
