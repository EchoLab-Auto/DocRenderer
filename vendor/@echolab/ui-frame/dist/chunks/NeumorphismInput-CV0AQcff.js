import { defineComponent as w, computed as s, useSlots as S, useAttrs as E, openBlock as m, createElementBlock as f, normalizeStyle as A, unref as l, normalizeClass as p, createVNode as h, createElementVNode as y, renderSlot as g, createCommentVNode as b, mergeProps as L } from "vue";
import { useFormField as K } from "../composables/useFormField.js";
import { useConfig as j } from "../composables/useConfig.js";
import { N as M } from "./NeumorphismFieldLabel-CBF1nZs1.js";
import { N as O } from "./NeumorphismFieldError-BxamHjhs.js";
import { _ as P } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismInput.css';const D = {
  key: 0,
  class: "nm-input__prefix"
}, G = ["id", "type", "value", "placeholder", "disabled", "readonly", "required", "maxlength", "minlength", "name", "autocomplete", "inputmode", "aria-invalid", "aria-errormessage", "aria-describedby"], H = {
  key: 1,
  class: "nm-input__suffix"
}, J = /* @__PURE__ */ w({
  inheritAttrs: !1,
  __name: "NeumorphismInput",
  props: {
    modelValue: { default: "" },
    type: { default: "text" },
    placeholder: {},
    disabled: { type: Boolean, default: !1 },
    readonly: { type: Boolean, default: !1 },
    required: { type: Boolean, default: !1 },
    size: { default: "medium" },
    maxlength: {},
    minlength: {},
    name: {},
    id: {},
    autocomplete: { default: "off" },
    inputmode: {},
    error: { type: [String, Boolean] },
    label: {}
  },
  emits: ["update:modelValue", "focus", "blur", "input", "change", "keydown", "enter"],
  setup(t, { emit: v }) {
    const a = t, x = j(), N = s(() => {
      var e;
      return a.size ?? ((e = x.value.input) == null ? void 0 : e.size) ?? "medium";
    }), o = v, c = S(), r = E(), V = s(() => {
      const e = {};
      for (const n of Object.keys(r))
        n !== "class" && n !== "style" && (e[n] = r[n]);
      return e;
    }), { fieldId: i, errorMessage: d, baseClassList: k, handleFocus: B, handleBlur: q } = K(() => ({
      id: a.id,
      size: N.value,
      disabled: a.disabled,
      error: a.error,
      prefix: "input"
    })), z = s(() => a.modelValue.length > 0), C = s(() => [
      ...k("nm-input").value,
      {
        "nm-input--readonly": a.readonly,
        "nm-input--has-prefix": !!c.prefix,
        "nm-input--has-suffix": !!c.suffix,
        "nm-input--has-label": !!a.label,
        "nm-input--filled": z.value
      }
    ]);
    function $(e) {
      const n = e.target;
      o("update:modelValue", n.value), o("input", e);
    }
    function F(e) {
      o("change", e);
    }
    function I(e) {
      o("keydown", e), e.key === "Enter" && o("enter", a.modelValue);
    }
    return (e, n) => (m(), f("div", {
      class: p(["nm-input__wrapper", l(r).class]),
      style: A(l(r).style)
    }, [
      h(M, {
        label: t.label,
        required: t.required,
        "for-id": l(i)
      }, null, 8, ["label", "required", "for-id"]),
      y("div", {
        class: p(C.value)
      }, [
        e.$slots.prefix ? (m(), f("div", D, [
          g(e.$slots, "prefix", {}, void 0, !0)
        ])) : b("", !0),
        y("input", L({
          id: l(i),
          type: t.type,
          value: t.modelValue,
          placeholder: t.placeholder,
          disabled: t.disabled,
          readonly: t.readonly,
          required: t.required,
          maxlength: t.maxlength,
          minlength: t.minlength,
          name: t.name,
          autocomplete: t.autocomplete,
          inputmode: t.inputmode,
          "aria-invalid": !!t.error,
          "aria-errormessage": l(d) ? `${l(i)}-error` : void 0,
          "aria-describedby": l(d) ? `${l(i)}-error` : void 0,
          class: "nm-input__field"
        }, V.value, {
          onInput: $,
          onChange: F,
          onFocus: n[0] || (n[0] = (u) => l(B)(u, o)),
          onBlur: n[1] || (n[1] = (u) => l(q)(u, o)),
          onKeydown: I
        }), null, 16, G),
        e.$slots.suffix ? (m(), f("div", H, [
          g(e.$slots, "suffix", {}, void 0, !0)
        ])) : b("", !0)
      ], 2),
      h(O, {
        id: `${l(i)}-error`,
        message: l(d)
      }, null, 8, ["id", "message"])
    ], 6));
  }
}), Y = /* @__PURE__ */ P(J, [["__scopeId", "data-v-5cc66d54"]]);
export {
  Y as N
};
