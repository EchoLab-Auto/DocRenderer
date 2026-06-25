import { defineComponent as G, computed as n, ref as g, watch as H, nextTick as J, openBlock as r, createElementBlock as d, createVNode as y, unref as t, createElementVNode as i, normalizeClass as v, renderSlot as B, createTextVNode as Q, toDisplayString as x, createCommentVNode as _, createBlock as U, Teleport as W, Transition as Z, withCtx as ee, normalizeStyle as le, Fragment as te, renderList as oe, withModifiers as ae } from "vue";
import { useSelect as se } from "../composables/useSelect.js";
import { useFormField as ne } from "../composables/useFormField.js";
import { useConfig as re } from "../composables/useConfig.js";
import { useLocale as ie } from "../composables/useLocale.js";
import { N as de } from "./NeumorphismFieldLabel-CBF1nZs1.js";
import { N as ue } from "./NeumorphismFieldError-BxamHjhs.js";
import { _ as ce } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismSelect.css';const me = { class: "nm-select__wrapper" }, fe = ["tabindex", "aria-expanded", "aria-labelledby"], pe = { class: "nm-select__actions" }, be = ["aria-label"], ve = ["aria-label"], we = ["aria-selected", "aria-disabled", "onClick"], he = {
  key: 0,
  class: "nm-select__option nm-select__option--empty"
}, ge = /* @__PURE__ */ G({
  __name: "NeumorphismSelect",
  props: {
    modelValue: { default: "" },
    options: { default: () => [] },
    placeholder: { default: "" },
    disabled: { type: Boolean, default: !1 },
    size: { default: "medium" },
    label: {},
    required: { type: Boolean },
    error: { type: [String, Boolean] },
    name: {},
    id: {},
    clearable: { type: Boolean, default: !1 },
    emptyText: { default: "" },
    clearLabel: { default: "" },
    listLabel: { default: "" }
  },
  emits: ["update:modelValue", "change", "focus", "blur"],
  setup(s, { emit: N }) {
    const o = s, S = re(), { t: m } = ie(), T = n(() => {
      var e;
      return o.size ?? ((e = S.value.select) == null ? void 0 : e.size) ?? "medium";
    }), z = n(() => o.placeholder || m("selectPlaceholder")), E = n(() => o.emptyText || m("selectEmpty")), F = n(() => o.clearLabel || m("selectClear")), $ = n(() => o.listLabel || m("selectListLabel")), f = N, R = n({
      get: () => o.modelValue,
      set: (e) => {
        f("update:modelValue", e), f("change", e);
      }
    }), {
      isOpen: u,
      selectedOption: p,
      toggleOpen: L,
      selectOption: k,
      clearValue: M,
      handleKeydown: C,
      handleBlur: P
    } = se({
      modelValue: R,
      options: n(() => o.options),
      disabled: n(() => o.disabled)
    }), { fieldId: w, errorMessage: q, baseClassList: O, handleFocus: D, handleBlur: I } = ne(() => ({
      id: o.id,
      size: T.value,
      disabled: o.disabled,
      error: o.error,
      prefix: "select"
    })), K = n(() => [
      ...O("nm-select").value,
      {
        "nm-select--open": u.value,
        "nm-select--has-value": o.modelValue !== "" && o.modelValue !== void 0 && o.modelValue !== null
      }
    ]);
    function X(e) {
      e.stopPropagation(), M();
    }
    const h = g(), V = g(), b = g({ top: 0, left: 0, width: 0 });
    function c() {
      if (!h.value || typeof window > "u") return;
      const e = h.value.getBoundingClientRect();
      b.value = {
        top: e.bottom + window.scrollY + 6,
        left: e.left + window.scrollX,
        width: e.width
      };
    }
    H(u, (e) => {
      e ? (J(c), typeof window < "u" && (window.addEventListener("scroll", c, !0), window.addEventListener("resize", c))) : typeof window < "u" && (window.removeEventListener("scroll", c, !0), window.removeEventListener("resize", c));
    });
    const Y = n(() => ({
      position: "fixed",
      top: `${b.value.top}px`,
      left: `${b.value.left}px`,
      width: `${b.value.width}px`
    }));
    function j(e) {
      var a;
      (a = V.value) != null && a.contains(e.relatedTarget) || (P(e.relatedTarget, e.currentTarget), I(e, f));
    }
    return (e, a) => (r(), d("div", me, [
      y(de, {
        label: s.label,
        required: s.required,
        "for-id": t(w)
      }, null, 8, ["label", "required", "for-id"]),
      i("div", {
        ref_key: "triggerRef",
        ref: h,
        class: v(K.value),
        tabindex: s.disabled ? -1 : 0,
        role: "combobox",
        "aria-expanded": t(u),
        "aria-haspopup": "listbox",
        "aria-labelledby": s.label ? t(w) : void 0,
        onClick: a[0] || (a[0] = //@ts-ignore
        (...l) => t(L) && t(L)(...l)),
        onFocus: a[1] || (a[1] = (l) => t(D)(l, f)),
        onBlur: j,
        onKeydown: a[2] || (a[2] = //@ts-ignore
        (...l) => t(C) && t(C)(...l))
      }, [
        i("span", {
          class: v(["nm-select__value", { "nm-select__value--placeholder": !t(p) }])
        }, [
          B(e.$slots, "value", { option: t(p) }, () => {
            var l;
            return [
              Q(x(((l = t(p)) == null ? void 0 : l.label) || z.value), 1)
            ];
          }, !0)
        ], 2),
        i("span", pe, [
          s.clearable && t(p) ? (r(), d("button", {
            key: 0,
            class: "nm-select__clear",
            type: "button",
            "aria-label": F.value,
            onClick: X
          }, [...a[3] || (a[3] = [
            i("svg", {
              width: "14",
              height: "14",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2"
            }, [
              i("path", { d: "M18 6L6 18M6 6l12 12" })
            ], -1)
          ])], 8, be)) : _("", !0),
          (r(), d("svg", {
            class: v(["nm-select__arrow", { "nm-select__arrow--open": t(u) }]),
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2"
          }, [...a[4] || (a[4] = [
            i("path", { d: "M6 9l6 6 6-6" }, null, -1)
          ])], 2))
        ]),
        (r(), U(W, { to: "body" }, [
          y(Z, { name: "nm-select-dropdown" }, {
            default: ee(() => [
              t(u) ? (r(), d("div", {
                key: 0,
                ref_key: "dropdownRef",
                ref: V,
                class: "nm-select__dropdown",
                role: "listbox",
                "aria-label": s.label || $.value,
                style: le(Y.value)
              }, [
                (r(!0), d(te, null, oe(s.options, (l, A) => B(e.$slots, "option", {
                  key: l.value,
                  option: l,
                  selected: l.value === s.modelValue,
                  index: A,
                  select: t(k)
                }, () => [
                  i("div", {
                    class: v(["nm-select__option", {
                      "nm-select__option--selected": l.value === s.modelValue,
                      "nm-select__option--disabled": l.disabled
                    }]),
                    role: "option",
                    "aria-selected": l.value === s.modelValue,
                    "aria-disabled": l.disabled,
                    onClick: ae((ye) => t(k)(l), ["stop"])
                  }, x(l.label), 11, we)
                ], !0)), 128)),
                s.options.length === 0 ? (r(), d("div", he, x(E.value), 1)) : _("", !0)
              ], 12, ve)) : _("", !0)
            ]),
            _: 3
          })
        ]))
      ], 42, fe),
      y(ue, {
        id: `${t(w)}-error`,
        message: t(q)
      }, null, 8, ["id", "message"])
    ]));
  }
}), Se = /* @__PURE__ */ ce(ge, [["__scopeId", "data-v-1bdea91a"]]);
export {
  Se as N
};
