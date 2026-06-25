import { defineComponent as E, reactive as j, provide as B, onBeforeUnmount as I, computed as _, openBlock as v, createElementBlock as p, normalizeClass as N, renderSlot as S, inject as M, ref as q, onMounted as w, watch as C, normalizeStyle as O, unref as F, createTextVNode as D, toDisplayString as k, createCommentVNode as g, createElementVNode as R } from "vue";
import { validateFieldValue as V } from "../composables/useFormValidation.js";
import { FormKey as x } from "../composables/injectionKeys.js";
import { _ as z } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import { generateId as A } from "../utils/index.js";
import '../NeumorphismFormItem.css';const K = /* @__PURE__ */ E({
  __name: "NeumorphismForm",
  props: {
    model: { default: () => ({}) },
    rules: { default: () => ({}) },
    labelWidth: {},
    size: {},
    direction: { default: "vertical" }
  },
  emits: ["submit", "validate"],
  setup(u, { expose: h, emit: r }) {
    const e = u, d = r, o = j({}), l = /* @__PURE__ */ new Map();
    function c(t) {
      const i = e.rules[t];
      if (i) {
        const $ = e.model[t], y = V($, i);
        if (y)
          return o[t] = y, !1;
      }
      const f = l.get(t);
      if (f) {
        if (!f(e.model[t]))
          return !1;
      } else if (!i)
        return delete o[t], !0;
      return delete o[t], !0;
    }
    function n() {
      let t = !0;
      const i = /* @__PURE__ */ new Set([...Object.keys(e.rules), ...l.keys()]);
      for (const f of i)
        c(f) || (t = !1);
      for (const f of Object.keys(o))
        i.has(f) || delete o[f];
      return d("validate", t), t;
    }
    function b(t, i) {
      l.set(t, i);
    }
    function s(t) {
      l.delete(t), delete o[t];
    }
    function a(t) {
      t.preventDefault(), n() && d("submit", { ...e.model });
    }
    function m() {
      Object.keys(o).forEach((t) => delete o[t]);
    }
    B(x, {
      get model() {
        return e.model;
      },
      get rules() {
        return e.rules;
      },
      errors: o,
      labelWidth: e.labelWidth,
      size: e.size,
      validateField: c,
      registerField: b,
      unregisterField: s
    }), I(() => {
      l.clear();
    });
    const W = _(() => ["nm-form", `nm-form--${e.direction}`]);
    return h({ validateAll: n, validateField: c, clearErrors: m }), (t, i) => (v(), p("form", {
      class: N(W.value),
      novalidate: "",
      onSubmit: a
    }, [
      S(t.$slots, "default", {
        errors: o,
        validateAll: n,
        clearErrors: m
      }, void 0, !0)
    ], 34));
  }
}), Z = /* @__PURE__ */ z(K, [["__scopeId", "data-v-92a05290"]]), L = ["for"], T = {
  key: 0,
  class: "nm-form-item__required"
}, U = { class: "nm-form-item__content" }, G = {
  key: 1,
  class: "nm-form-item__error",
  role: "alert"
}, H = /* @__PURE__ */ E({
  __name: "NeumorphismFormItem",
  props: {
    label: {},
    required: { type: Boolean },
    error: {},
    rules: { default: () => [] },
    name: {}
  },
  setup(u, { expose: h }) {
    const r = u, e = M(x, null), d = q(""), o = _(() => r.name ? e == null ? void 0 : e.errors[r.name] : void 0), l = _(() => r.error || o.value || d.value), c = _(() => r.name ? `nm-field-${r.name}` : A("nm-field"));
    function n(s) {
      const a = r.rules;
      if (!a.length) return !0;
      const m = V(s, a);
      return m ? (d.value = m, !1) : (d.value = "", !0);
    }
    function b() {
      d.value = "";
    }
    return w(() => {
      r.name && e && e.registerField(r.name, n);
    }), C(
      () => r.name,
      (s, a) => {
        a && e && e.unregisterField(a), s && e && e.registerField(s, n);
      },
      { immediate: !0 }
    ), I(() => {
      r.name && e && e.unregisterField(r.name);
    }), h({ validate: n, clearError: b, fieldId: c }), (s, a) => {
      var m;
      return v(), p("div", {
        class: N(["nm-form-item", { "nm-form-item--error": !!l.value }])
      }, [
        u.label ? (v(), p("label", {
          key: 0,
          for: u.name ? c.value : void 0,
          class: "nm-form-item__label",
          style: O((m = F(e)) != null && m.labelWidth ? { width: F(e).labelWidth } : void 0)
        }, [
          D(k(u.label) + " ", 1),
          u.required ? (v(), p("span", T, "*")) : g("", !0)
        ], 12, L)) : g("", !0),
        R("div", U, [
          S(s.$slots, "default", {
            error: l.value,
            validate: n,
            fieldId: c.value
          }, void 0, !0)
        ]),
        l.value ? (v(), p("div", G, k(l.value), 1)) : g("", !0)
      ], 2);
    };
  }
}), ee = /* @__PURE__ */ z(H, [["__scopeId", "data-v-90b791e9"]]);
export {
  Z as N,
  ee as a
};
