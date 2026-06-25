import { defineComponent as g, computed as u, openBlock as m, createElementBlock as r, normalizeClass as C, createVNode as D, createElementVNode as d, withModifiers as a, unref as o, createCommentVNode as v } from "vue";
import { u as P } from "./createComponent-jnXBYqCm.js";
import { useNumberInput as E } from "../composables/useNumberInput.js";
import { N as F } from "./NeumorphismFieldLabel-CBF1nZs1.js";
import { _ as K } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismInputNumber.css';const L = { class: "nm-input-number__body" }, R = ["disabled"], S = { class: "nm-input-number__input-wrapper" }, A = ["value", "placeholder", "disabled", "aria-disabled"], M = ["disabled"], $ = /* @__PURE__ */ g({
  inheritAttrs: !1,
  __name: "NeumorphismInputNumber",
  props: {
    modelValue: { default: void 0 },
    min: { default: void 0 },
    max: { default: void 0 },
    step: { default: 1 },
    precision: { default: void 0 },
    disabled: { type: Boolean, default: !1 },
    size: { default: "medium" },
    placeholder: { default: "" },
    controls: { type: Boolean, default: !0 },
    label: { default: void 0 }
  },
  emits: ["update:modelValue", "change", "focus", "blur"],
  setup(t, { emit: N }) {
    const l = t, s = N, { config: y, resolveProp: V } = P(), x = u(
      () => {
        var n;
        return V(l.size, (n = y.value.input) == null ? void 0 : n.size, "medium");
      }
    ), I = u(() => l.disabled), _ = u({
      get: () => l.modelValue,
      set: (n) => {
        s("update:modelValue", n), s("change", n);
      }
    }), { displayValue: h, increment: b, decrement: p, handleInput: c, handleKeydown: f, handleBlur: k } = E({
      modelValue: _,
      min: l.min,
      max: l.max,
      step: l.step,
      precision: l.precision,
      disabled: I
    }), w = u(() => [
      "nm-input-number",
      `nm-input-number--${x.value}`,
      {
        "nm-input-number--disabled": l.disabled,
        "nm-input-number--has-controls": l.controls
      }
    ]);
    function B(n) {
      k(), s("blur", n);
    }
    function z(n) {
      s("focus", n);
    }
    return (n, e) => (m(), r("div", {
      class: C(w.value)
    }, [
      D(F, {
        label: t.label,
        "for-id": void 0
      }, null, 8, ["label"]),
      d("div", L, [
        t.controls ? (m(), r("button", {
          key: 0,
          type: "button",
          class: "nm-input-number__btn nm-input-number__btn--decrement",
          disabled: t.disabled,
          "aria-label": "Decrement",
          tabindex: "-1",
          onPointerdown: e[0] || (e[0] = a(
            //@ts-ignore
            (...i) => o(p) && o(p)(...i),
            ["prevent"]
          )),
          onDblclick: e[1] || (e[1] = a(() => {
          }, ["prevent"]))
        }, [...e[6] || (e[6] = [
          d("span", { class: "nm-input-number__btn-icon" }, "−", -1)
        ])], 40, R)) : v("", !0),
        d("div", S, [
          d("input", {
            type: "text",
            inputmode: "decimal",
            class: "nm-input-number__input",
            value: o(h),
            placeholder: t.placeholder,
            disabled: t.disabled,
            "aria-disabled": t.disabled || void 0,
            onInput: e[2] || (e[2] = //@ts-ignore
            (...i) => o(c) && o(c)(...i)),
            onKeydown: e[3] || (e[3] = //@ts-ignore
            (...i) => o(f) && o(f)(...i)),
            onBlur: B,
            onFocus: z
          }, null, 40, A)
        ]),
        t.controls ? (m(), r("button", {
          key: 1,
          type: "button",
          class: "nm-input-number__btn nm-input-number__btn--increment",
          disabled: t.disabled,
          "aria-label": "Increment",
          tabindex: "-1",
          onPointerdown: e[4] || (e[4] = a(
            //@ts-ignore
            (...i) => o(b) && o(b)(...i),
            ["prevent"]
          )),
          onDblclick: e[5] || (e[5] = a(() => {
          }, ["prevent"]))
        }, [...e[7] || (e[7] = [
          d("span", { class: "nm-input-number__btn-icon" }, "+", -1)
        ])], 40, M)) : v("", !0)
      ])
    ], 2));
  }
}), O = /* @__PURE__ */ K($, [["__scopeId", "data-v-174aebb6"]]);
export {
  O as N
};
