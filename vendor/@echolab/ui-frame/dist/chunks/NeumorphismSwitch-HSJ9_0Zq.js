import { defineComponent as f, computed as n, openBlock as l, createElementBlock as o, normalizeClass as b, toDisplayString as d, createCommentVNode as h, createElementVNode as c, normalizeStyle as k, renderSlot as C } from "vue";
import { useConfig as g } from "../composables/useConfig.js";
import { _ as y } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismSwitch.css';const x = {
  key: 0,
  class: "nm-switch__label nm-switch__label--inactive"
}, S = { class: "nm-switch__wrapper" }, z = ["checked", "disabled"], T = { class: "nm-switch__thumb" }, V = {
  key: 1,
  class: "nm-switch__label nm-switch__label--active"
}, N = /* @__PURE__ */ f({
  __name: "NeumorphismSwitch",
  props: {
    modelValue: { type: Boolean, default: !1 },
    disabled: { type: Boolean, default: !1 },
    activeText: {},
    inactiveText: {},
    activeColor: {},
    inactiveColor: {},
    size: { default: "medium" }
  },
  emits: ["update:modelValue", "change"],
  setup(s, { emit: r }) {
    const t = s, u = g(), v = n(() => {
      var e;
      return t.size ?? ((e = u.value.switch) == null ? void 0 : e.size) ?? "medium";
    }), m = r, a = n({
      get: () => t.modelValue,
      set: (e) => {
        m("update:modelValue", e), m("change", e);
      }
    }), _ = n(() => [
      "nm-switch",
      `nm-switch--${v.value}`,
      {
        "nm-switch--checked": a.value,
        "nm-switch--disabled": t.disabled
      }
    ]), p = n(() => {
      const e = {};
      return t.activeColor && (e["--nm-switch-active-color"] = t.activeColor), t.inactiveColor && (e["--nm-switch-inactive-color"] = t.inactiveColor), Object.keys(e).length ? e : void 0;
    });
    function w(e) {
      const i = e.target;
      a.value = i.checked;
    }
    return (e, i) => (l(), o("label", {
      class: b(_.value)
    }, [
      s.inactiveText ? (l(), o("span", x, d(s.inactiveText), 1)) : h("", !0),
      c("span", S, [
        c("input", {
          type: "checkbox",
          class: "nm-switch__input",
          checked: a.value,
          disabled: s.disabled,
          onChange: w
        }, null, 40, z),
        c("span", {
          class: "nm-switch__track",
          "aria-hidden": "true",
          style: k(p.value)
        }, [
          c("span", T, [
            C(e.$slots, "thumb", { checked: a.value }, () => [
              i[0] || (i[0] = c("span", { class: "nm-switch__thumb-dot" }, null, -1))
            ], !0)
          ])
        ], 4)
      ]),
      s.activeText ? (l(), o("span", V, d(s.activeText), 1)) : h("", !0)
    ], 2));
  }
}), j = /* @__PURE__ */ y(N, [["__scopeId", "data-v-6de237fe"]]);
export {
  j as N
};
