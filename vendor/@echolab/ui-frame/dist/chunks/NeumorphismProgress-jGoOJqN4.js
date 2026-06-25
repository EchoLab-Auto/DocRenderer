import { defineComponent as g, computed as o, openBlock as i, createElementBlock as m, unref as h, normalizeClass as _, createElementVNode as u, normalizeStyle as b, toDisplayString as y, createCommentVNode as w } from "vue";
import { useLocale as x } from "../composables/useLocale.js";
import { u as L } from "./createComponent-jnXBYqCm.js";
import { _ as z } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismProgress.css';const N = ["aria-valuenow", "aria-valuemax", "aria-label"], V = { class: "nm-progress__track" }, k = {
  key: 0,
  class: "nm-progress__label"
}, B = /* @__PURE__ */ g({
  __name: "NeumorphismProgress",
  props: {
    modelValue: { default: 0 },
    max: { default: 100 },
    variant: { default: "primary" },
    size: { default: "medium" },
    showLabel: { type: Boolean, default: !1 },
    indeterminate: { type: Boolean, default: !1 },
    striped: { type: Boolean, default: !1 }
  },
  setup(r) {
    const e = r, { config: t, resolveProp: n } = L(), l = o(
      () => {
        var a;
        return n(e.variant, (a = t.value.progress) == null ? void 0 : a.variant, "primary");
      }
    ), c = o(() => {
      var a;
      return n(e.size, (a = t.value.progress) == null ? void 0 : a.size, "medium");
    }), d = o(
      () => {
        var a;
        return n(e.showLabel, (a = t.value.progress) == null ? void 0 : a.showLabel, !1);
      }
    ), { t: p } = x(), s = o(() => e.indeterminate ? 0 : Math.min(100, Math.max(0, e.modelValue / e.max * 100))), v = o(() => [
      "nm-progress",
      `nm-progress--${c.value}`,
      `nm-progress--${l.value}`,
      {
        "nm-progress--indeterminate": e.indeterminate,
        "nm-progress--striped": e.striped,
        "nm-progress--complete": !e.indeterminate && s.value >= 100
      }
    ]), f = {
      default: "var(--nm-text-secondary)",
      primary: "var(--nm-primary-color)",
      success: "var(--nm-color-success)",
      warning: "var(--nm-color-warning)",
      error: "var(--nm-color-error)"
    };
    return (a, C) => (i(), m("div", {
      class: _(v.value),
      role: "progressbar",
      "aria-valuenow": r.indeterminate ? void 0 : r.modelValue,
      "aria-valuemin": 0,
      "aria-valuemax": r.max,
      "aria-label": r.showLabel ? void 0 : h(p)("progressLabel", { percentage: Math.round(s.value) })
    }, [
      u("div", V, [
        u("div", {
          class: "nm-progress__bar",
          style: b({
            width: r.indeterminate ? "40%" : `${s.value}%`,
            backgroundColor: f[l.value]
          })
        }, null, 4)
      ]),
      d.value ? (i(), m("span", k, y(Math.round(s.value)) + "%", 1)) : w("", !0)
    ], 10, N));
  }
}), E = /* @__PURE__ */ z(B, [["__scopeId", "data-v-696cafad"]]);
export {
  E as N
};
