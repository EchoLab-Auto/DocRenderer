import { defineComponent as h, computed as a, openBlock as i, createElementBlock as r, normalizeClass as u, setBlockTracking as d, createElementVNode as m, createCommentVNode as y, renderSlot as B } from "vue";
import { useConfig as C } from "../composables/useConfig.js";
import { _ as w } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismButton.css';const x = ["type", "form", "disabled", "aria-label", "aria-busy"], z = {
  key: 0,
  class: "nm-button__spinner"
}, N = /* @__PURE__ */ h({
  __name: "NeumorphismButton",
  props: {
    variant: { default: "raised" },
    size: { default: "medium" },
    shape: { default: "rounded" },
    disabled: { type: Boolean, default: !1 },
    loading: { type: Boolean, default: !1 },
    type: { default: "button" },
    form: {},
    ariaLabel: {}
  },
  emits: ["click"],
  setup(t, { emit: c }) {
    const n = t, s = C(), b = a(() => {
      var e;
      return n.variant ?? ((e = s.value.button) == null ? void 0 : e.variant) ?? "raised";
    }), f = a(() => {
      var e;
      return n.size ?? ((e = s.value.button) == null ? void 0 : e.size) ?? "medium";
    }), v = a(() => {
      var e;
      return n.shape ?? ((e = s.value.button) == null ? void 0 : e.shape) ?? "rounded";
    }), p = c, l = a(() => n.disabled || n.loading), g = a(() => [
      "nm-button",
      `nm-button--${b.value}`,
      `nm-button--${f.value}`,
      `nm-button--${v.value}`,
      {
        "nm-button--disabled": l.value,
        "nm-button--loading": n.loading
      }
    ]);
    function k(e) {
      l.value || p("click", e);
    }
    return (e, o) => (i(), r("button", {
      class: u(g.value),
      type: t.type,
      form: t.form,
      disabled: l.value,
      "aria-label": t.ariaLabel,
      "aria-busy": t.loading ? !0 : void 0,
      onClick: k
    }, [
      t.loading ? (i(), r("span", z, [
        o[0] || (d(-1, !0), (o[0] = (i(), r("svg", {
          class: "nm-button__spinner-svg",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        }, [
          o[1] || (o[1] = m("circle", {
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "currentColor",
            "stroke-width": "3",
            "stroke-linecap": "round",
            "stroke-dasharray": "31.42",
            "stroke-dashoffset": "10"
          }, null, -1))
        ]))).cacheIndex = 0, d(1), o[0])
      ])) : y("", !0),
      m("span", {
        class: u(["nm-button__content", { "nm-button__content--hidden": t.loading }])
      }, [
        B(e.$slots, "default", {}, void 0, !0)
      ], 2)
    ], 10, x));
  }
}), S = /* @__PURE__ */ w(N, [["__scopeId", "data-v-14c068f1"]]);
export {
  S as N
};
