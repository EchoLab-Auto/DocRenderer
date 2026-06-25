import { defineComponent as V, computed as l, ref as b, openBlock as i, createBlock as $, withCtx as h, renderSlot as g, createElementVNode as m, normalizeClass as w, createElementBlock as a, Fragment as k, renderList as A, createCommentVNode as p, toDisplayString as y } from "vue";
import { u as P } from "./createComponent-jnXBYqCm.js";
import { N as K } from "./NeumorphismPopover-RB48cpPq.js";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismDropdown.css';const R = {
  key: 0,
  class: "nm-dropdown__divider",
  role: "separator"
}, z = ["aria-disabled", "tabindex", "onClick"], F = {
  key: 0,
  class: "nm-dropdown__item-icon"
}, O = { class: "nm-dropdown__item-label" }, T = {
  key: 0,
  class: "nm-dropdown__custom"
}, U = /* @__PURE__ */ V({
  __name: "NeumorphismDropdown",
  props: {
    items: { default: () => [] },
    position: { default: "bottom" },
    trigger: { default: "click" },
    disabled: { type: Boolean, default: !1 },
    offset: { default: 4 }
  },
  emits: ["select", "visible-change"],
  setup(r, { emit: C }) {
    const d = r, { resolveProp: c } = P(), N = l(
      () => c(d.position, void 0, "bottom")
    ), D = l(
      () => c(d.trigger, void 0, "click")
    ), x = l(() => c(d.offset, void 0, 4)), f = C, u = b(), s = b(-1);
    function v(e) {
      var t, o;
      e.disabled || (f("select", e), (o = (t = u.value) == null ? void 0 : t.hide) == null || o.call(t));
    }
    function B(e) {
      e || (s.value = -1), f("visible-change", e);
    }
    function E(e) {
      var o, n;
      const t = d.items.filter((_) => !_.disabled);
      if (t.length)
        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault(), s.value = s.value < t.length - 1 ? s.value + 1 : 0;
            break;
          }
          case "ArrowUp": {
            e.preventDefault(), s.value = s.value > 0 ? s.value - 1 : t.length - 1;
            break;
          }
          case "Enter":
          case " ": {
            e.preventDefault(), s.value >= 0 && v(t[s.value]);
            break;
          }
          case "Escape": {
            (n = (o = u.value) == null ? void 0 : o.hide) == null || n.call(o);
            break;
          }
        }
    }
    function I(e, t) {
      const o = d.items.filter((n) => !n.disabled)[s.value] === e;
      return [
        "nm-dropdown__item",
        {
          "nm-dropdown__item--disabled": e.disabled,
          "nm-dropdown__item--danger": e.danger,
          "nm-dropdown__item--divided": e.divided,
          "nm-dropdown__item--active": o
        }
      ];
    }
    const S = l(() => ["nm-dropdown"]);
    return (e, t) => (i(), $(K, {
      ref_key: "popoverRef",
      ref: u,
      position: N.value,
      trigger: D.value,
      disabled: r.disabled,
      offset: x.value,
      "show-arrow": !1,
      onVisibleChange: B
    }, {
      content: h(() => [
        m("div", {
          class: w(S.value),
          role: "menu",
          onKeydown: E
        }, [
          (i(!0), a(k, null, A(r.items, (o, n) => (i(), a(k, {
            key: o.key
          }, [
            o.divided && n > 0 ? (i(), a("div", R)) : p("", !0),
            m("div", {
              class: w(I(o)),
              role: "menuitem",
              "aria-disabled": o.disabled,
              tabindex: o.disabled ? -1 : 0,
              onClick: (_) => v(o)
            }, [
              o.icon ? (i(), a("span", F, y(o.icon), 1)) : p("", !0),
              m("span", O, y(o.label), 1)
            ], 10, z)
          ], 64))), 128)),
          r.items.length === 0 && e.$slots.items ? (i(), a("div", T, [
            g(e.$slots, "items", {}, void 0, !0)
          ])) : p("", !0)
        ], 34)
      ]),
      default: h(() => [
        g(e.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["position", "trigger", "disabled", "offset"]));
  }
}), J = /* @__PURE__ */ L(U, [["__scopeId", "data-v-bf5889d7"]]);
export {
  J as N
};
