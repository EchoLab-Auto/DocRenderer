import { defineComponent as ee, computed as a, ref as B, watch as M, nextTick as V, onBeforeUnmount as te, openBlock as n, createElementBlock as i, normalizeClass as _, createVNode as O, unref as u, withCtx as R, createElementVNode as l, withModifiers as b, createCommentVNode as k, createBlock as oe, Teleport as ne, Transition as le, normalizeStyle as ae, Fragment as ie, renderList as ue, toDisplayString as se } from "vue";
import { useAutoComplete as de } from "../composables/useAutoComplete.js";
import { u as re } from "./createComponent-jnXBYqCm.js";
import { N as ce } from "./NeumorphismInput-CV0AQcff.js";
import { _ as pe } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismAutoComplete.css';const me = { class: "nm-autocomplete__suffix" }, fe = {
  key: 1,
  class: "nm-autocomplete__spinner",
  "aria-hidden": "true"
}, ve = ["aria-selected", "aria-disabled", "onClick"], he = ["innerHTML"], we = {
  key: 1,
  class: "nm-autocomplete__empty"
}, ge = {
  key: 2,
  class: "nm-autocomplete__loading"
}, _e = /* @__PURE__ */ ee({
  __name: "NeumorphismAutoComplete",
  props: {
    modelValue: { default: void 0 },
    options: { default: () => [] },
    placeholder: { default: "" },
    disabled: { type: Boolean, default: !1 },
    size: { default: "medium" },
    clearable: { type: Boolean, default: !0 },
    loading: { type: Boolean, default: !1 },
    label: {},
    debounce: { default: 300 },
    searchFn: {}
  },
  emits: ["update:modelValue", "select", "search", "focus", "blur"],
  setup(m, { emit: T }) {
    const s = m, r = T, { resolveProp: $ } = re(), E = a(
      () => $(s.size, void 0, "medium")
    ), L = a({
      get: () => s.modelValue,
      set: (e) => {
        r("update:modelValue", e);
      }
    }), y = a(() => s.loading), {
      inputValue: c,
      isOpen: d,
      filteredOptions: N,
      activeIndex: h,
      highlightMatch: A,
      selectOption: D,
      handleKeydown: K,
      handleInput: P,
      open: H,
      close: C,
      cleanupTimers: U
    } = de({
      modelValue: L,
      options: a(() => s.options),
      searchFn: s.searchFn,
      loading: y,
      debounceMs: s.debounce
    }), w = B(), p = B(), g = B({ top: 0, left: 0, width: 0 });
    function f() {
      if (!w.value || typeof window > "u") return;
      const e = w.value.getBoundingClientRect();
      g.value = {
        top: e.bottom + window.scrollY + 4,
        left: e.left + window.scrollX,
        width: e.width
      };
    }
    M(d, (e) => {
      e ? (V(f), typeof window < "u" && (window.addEventListener("scroll", f, !0), window.addEventListener("resize", f))) : typeof window < "u" && (window.removeEventListener("scroll", f, !0), window.removeEventListener("resize", f));
    });
    function S(e) {
      var o, v;
      if (!d.value || s.disabled) return;
      const t = e.target;
      (o = w.value) != null && o.contains(t) || (v = p.value) != null && v.contains(t) || C();
    }
    function q() {
      typeof document < "u" && document.addEventListener("click", S, !0);
    }
    function z() {
      typeof document < "u" && document.removeEventListener("click", S, !0);
    }
    M(d, (e) => {
      e ? V(q) : z();
    }), te(() => {
      z(), U();
    }), M(h, (e) => {
      !p.value || e < 0 || V(() => {
        var o;
        const t = (o = p.value) == null ? void 0 : o.querySelector(
          ".nm-autocomplete__option--active"
        );
        t && t.scrollIntoView({ block: "nearest" });
      });
    });
    const X = a(() => ({
      position: "fixed",
      top: `${g.value.top}px`,
      left: `${g.value.left}px`,
      width: `${g.value.width}px`
    }));
    function Y(e) {
      D(e), r("select", e);
    }
    function j(e) {
      K(e);
    }
    function G(e) {
      r("focus", e), !d.value && c.value.length > 0 && H();
    }
    function J(e) {
      setTimeout(() => {
        p.value && document.activeElement && p.value.contains(document.activeElement) || (r("blur", e), C());
      }, 150);
    }
    function Q() {
      c.value = "", L.value = void 0, h.value = -1, r("update:modelValue", void 0), r("search", ""), C();
    }
    function W(e) {
      r("search", e), P(e);
    }
    const Z = a(() => [
      "nm-autocomplete",
      `nm-autocomplete--${E.value}`,
      {
        "nm-autocomplete--disabled": s.disabled,
        "nm-autocomplete--open": d.value,
        "nm-autocomplete--has-value": c.value.length > 0
      }
    ]), I = a(() => N.value.length > 0), F = a(
      () => !I.value && c.value.trim().length > 0 && !y.value
    ), x = a(() => y.value);
    return (e, t) => (n(), i("div", {
      ref_key: "triggerRef",
      ref: w,
      class: _(Z.value)
    }, [
      O(ce, {
        "model-value": u(c),
        label: m.label,
        placeholder: m.placeholder,
        disabled: m.disabled,
        size: E.value,
        autocomplete: "off",
        role: "combobox",
        "aria-expanded": u(d),
        "aria-haspopup": "listbox",
        "aria-autocomplete": "list",
        "onUpdate:modelValue": W,
        onFocus: G,
        onBlur: J,
        onKeydown: j
      }, {
        suffix: R(() => [
          l("div", me, [
            m.clearable && u(c).length > 0 && !x.value ? (n(), i("button", {
              key: 0,
              class: "nm-autocomplete__clear",
              type: "button",
              "aria-label": "Clear",
              onMousedown: t[0] || (t[0] = b(() => {
              }, ["prevent"])),
              onClick: b(Q, ["stop"])
            }, [...t[2] || (t[2] = [
              l("svg", {
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                l("path", { d: "M18 6L6 18M6 6l12 12" })
              ], -1)
            ])], 32)) : k("", !0),
            x.value ? (n(), i("span", fe, [...t[3] || (t[3] = [
              l("svg", {
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                l("path", { d: "M12 2a10 10 0 1 0 10 10" })
              ], -1)
            ])])) : k("", !0),
            (n(), i("svg", {
              class: _(["nm-autocomplete__arrow", { "nm-autocomplete__arrow--open": u(d) }]),
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2",
              "aria-hidden": "true"
            }, [...t[4] || (t[4] = [
              l("path", { d: "M6 9l6 6 6-6" }, null, -1)
            ])], 2))
          ])
        ]),
        _: 1
      }, 8, ["model-value", "label", "placeholder", "disabled", "size", "aria-expanded"]),
      (n(), oe(ne, { to: "body" }, [
        O(le, { name: "nm-autocomplete-dropdown" }, {
          default: R(() => [
            u(d) ? (n(), i("div", {
              key: 0,
              ref_key: "dropdownRef",
              ref: p,
              class: _(["nm-autocomplete__dropdown", { "nm-autocomplete__dropdown--empty": F.value }]),
              role: "listbox",
              style: ae(X.value)
            }, [
              I.value ? (n(!0), i(ie, { key: 0 }, ue(u(N), (o, v) => (n(), i("div", {
                key: o.value,
                class: _(["nm-autocomplete__option", {
                  "nm-autocomplete__option--active": v === u(h),
                  "nm-autocomplete__option--disabled": o.disabled
                }]),
                role: "option",
                "aria-selected": v === u(h),
                "aria-disabled": o.disabled,
                onMousedown: t[1] || (t[1] = b(() => {
                }, ["prevent"])),
                onClick: b((be) => Y(o), ["stop"])
              }, [
                l("span", {
                  class: "nm-autocomplete__option-label",
                  innerHTML: u(A)(o.label)
                }, null, 8, he)
              ], 42, ve))), 128)) : F.value ? (n(), i("div", we, se("No matching results"))) : x.value ? (n(), i("div", ge, [...t[5] || (t[5] = [
                l("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  class: "nm-autocomplete__loading-icon"
                }, [
                  l("path", { d: "M12 2a10 10 0 1 0 10 10" })
                ], -1),
                l("span", null, "Searching…", -1)
              ])])) : k("", !0)
            ], 6)) : k("", !0)
          ]),
          _: 1
        })
      ]))
    ], 2));
  }
}), Me = /* @__PURE__ */ pe(_e, [["__scopeId", "data-v-0a06b477"]]);
export {
  Me as N
};
