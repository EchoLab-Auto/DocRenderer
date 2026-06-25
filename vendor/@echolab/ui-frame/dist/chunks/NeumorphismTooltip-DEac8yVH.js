import { defineComponent as S, useCssVars as W, computed as s, ref as $, watch as z, nextTick as E, openBlock as C, createElementBlock as N, unref as n, normalizeClass as T, renderSlot as x, createVNode as H, Transition as K, withCtx as R, createElementVNode as V, createTextVNode as D, toDisplayString as F, createCommentVNode as q } from "vue";
import { useTooltip as I } from "../composables/useTooltip.js";
import { u as O } from "./createComponent-jnXBYqCm.js";
import { _ as j } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismTooltip.css';const A = ["aria-hidden"], G = { class: "nm-tooltip__content" }, J = /* @__PURE__ */ S({
  __name: "NeumorphismTooltip",
  props: {
    content: {},
    position: { default: "top" },
    trigger: { default: "hover" },
    disabled: { type: Boolean, default: !1 },
    offset: { default: 8 },
    delay: { default: 150 }
  },
  setup(u) {
    W((o) => ({
      d310ce7a: M.value
    }));
    const l = u, { config: v, resolveProp: f } = O(), r = s(
      () => {
        var o;
        return f(l.position, (o = v.value.tooltip) == null ? void 0 : o.position, "top");
      }
    ), i = s(
      () => {
        var o;
        return f(l.trigger, (o = v.value.tooltip) == null ? void 0 : o.trigger, "hover");
      }
    ), a = s(() => {
      var o;
      return f(l.offset, (o = v.value.tooltip) == null ? void 0 : o.offset, 8);
    }), B = s(() => {
      var o;
      return f(l.delay, (o = v.value.tooltip) == null ? void 0 : o.delay, 150);
    }), {
      isVisible: d,
      show: c,
      hide: w,
      toggle: L,
      handleKeydown: g
    } = I({
      disabled: s(() => l.disabled),
      delay: B.value
    }), M = s(() => `${a.value}px`), y = $(), p = $(r.value);
    function b() {
      const o = y.value;
      if (!o || typeof window > "u") return r.value;
      const e = o.getBoundingClientRect(), t = o.querySelector(".nm-tooltip"), h = (t == null ? void 0 : t.offsetHeight) ?? 40, k = (t == null ? void 0 : t.offsetWidth) ?? 120;
      switch (r.value) {
        case "top":
          if (e.top < h + a.value + 8) return "bottom";
          break;
        case "bottom":
          if (e.bottom + h + a.value + 8 > window.innerHeight) return "top";
          break;
        case "left":
          if (e.left < k + a.value + 8) return "right";
          break;
        case "right":
          if (e.right + k + a.value + 8 > window.innerWidth) return "left";
          break;
      }
      return r.value;
    }
    function m() {
      d.value && (p.value = b());
    }
    z(d, (o) => {
      o ? E(() => {
        p.value = b(), typeof window < "u" && (window.addEventListener("scroll", m, { passive: !0 }), window.addEventListener("resize", m));
      }) : (p.value = r.value, typeof window < "u" && (window.removeEventListener("scroll", m), window.removeEventListener("resize", m)));
    });
    const P = s(() => [
      "nm-tooltip",
      `nm-tooltip--${p.value}`,
      { "nm-tooltip--visible": d.value }
    ]);
    return (o, e) => (C(), N("div", {
      ref_key: "triggerRef",
      ref: y,
      class: T(["nm-tooltip-wrapper", { "nm-tooltip-wrapper--disabled": u.disabled }]),
      onMouseenter: e[2] || (e[2] = (t) => i.value === "hover" ? n(c)() : void 0),
      onMouseleave: e[3] || (e[3] = (t) => i.value === "hover" ? n(w)() : void 0),
      onClick: e[4] || (e[4] = (t) => i.value === "click" ? n(L)() : void 0),
      onFocusin: e[5] || (e[5] = (t) => i.value === "focus" ? n(c)() : void 0),
      onFocusout: e[6] || (e[6] = (t) => i.value === "focus" ? n(w)() : void 0),
      onKeydown: e[7] || (e[7] = //@ts-ignore
      (...t) => n(g) && n(g)(...t))
    }, [
      x(o.$slots, "default", {}, void 0, !0),
      H(K, { name: "nm-tooltip-fade" }, {
        default: R(() => [
          n(d) && (u.content || o.$slots.content) ? (C(), N("div", {
            key: 0,
            class: T(P.value),
            role: "tooltip",
            "aria-hidden": !n(d),
            onMouseenter: e[0] || (e[0] = (t) => i.value === "hover" ? n(c)() : void 0),
            onMouseleave: e[1] || (e[1] = (t) => i.value === "hover" ? n(w)() : void 0)
          }, [
            e[8] || (e[8] = V("span", { class: "nm-tooltip__arrow" }, null, -1)),
            V("span", G, [
              x(o.$slots, "content", {}, () => [
                D(F(u.content), 1)
              ], !0)
            ])
          ], 42, A)) : q("", !0)
        ]),
        _: 3
      })
    ], 34));
  }
}), Z = /* @__PURE__ */ j(J, [["__scopeId", "data-v-f2e8bc1c"]]);
export {
  Z as N
};
