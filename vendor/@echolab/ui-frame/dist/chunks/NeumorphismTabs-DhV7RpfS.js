import { defineComponent as K, computed as o, ref as N, openBlock as v, createElementBlock as y, normalizeClass as k, createElementVNode as c, unref as i, Fragment as x, renderList as z, renderSlot as p, toDisplayString as E, nextTick as B } from "vue";
import { useTabs as I } from "../composables/useTabs.js";
import { useLocale as M } from "../composables/useLocale.js";
import { _ as R } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismTabs.css';const S = ["aria-orientation", "aria-label"], D = ["id", "aria-selected", "aria-disabled", "tabindex", "disabled", "onClick", "onKeydown"], F = { class: "nm-tabs__tab-label" }, H = ["id", "aria-labelledby"], j = /* @__PURE__ */ K({
  __name: "NeumorphismTabs",
  props: {
    modelValue: { default: "" },
    tabs: { default: () => [] },
    position: { default: "top" },
    size: { default: "medium" },
    navLabel: { default: "标签导航" }
  },
  emits: ["update:modelValue", "change", "tabClick"],
  setup(l, { emit: _ }) {
    const t = l, { t: h } = M(), V = o(() => t.navLabel || h("tabsNavLabel")), r = _, m = o({
      get: () => t.modelValue,
      set: (a) => {
        r("update:modelValue", a), r("change", a);
        const s = t.tabs.find((e) => e.key === a);
        s && r("tabClick", s);
      }
    }), {
      activate: u,
      handleKeydown: $,
      panelId: b,
      orientation: L
    } = I({
      modelValue: m,
      tabs: o(() => t.tabs),
      position: o(() => t.position)
    }), T = o(() => t.tabs.filter((a) => !a.disabled)), f = N(/* @__PURE__ */ new Map());
    function g(a, s) {
      s instanceof HTMLElement && f.value.set(a, s);
    }
    function w(a, s) {
      $(a, s);
      const e = T.value.find((n) => n.key === m.value);
      e && B(() => {
        var n;
        return (n = f.value.get(e.key)) == null ? void 0 : n.focus();
      });
    }
    const C = o(() => [
      "nm-tabs",
      `nm-tabs--${t.position}`,
      `nm-tabs--${t.size}`
    ]);
    return (a, s) => (v(), y("div", {
      class: k(C.value)
    }, [
      c("div", {
        class: "nm-tabs__nav",
        role: "tablist",
        "aria-orientation": i(L),
        "aria-label": V.value
      }, [
        (v(!0), y(x, null, z(l.tabs, (e, n) => p(a.$slots, "tab", {
          key: e.key,
          tab: e,
          active: l.modelValue === e.key,
          index: n,
          activate: i(u)
        }, () => [
          c("button", {
            id: `${i(b)}-tab-${e.key}`,
            ref_for: !0,
            ref: (d) => g(e.key, d),
            class: k(["nm-tabs__tab", {
              "nm-tabs__tab--active": l.modelValue === e.key,
              "nm-tabs__tab--disabled": e.disabled
            }]),
            role: "tab",
            "aria-selected": l.modelValue === e.key,
            "aria-disabled": e.disabled,
            tabindex: l.modelValue === e.key ? 0 : -1,
            disabled: e.disabled,
            onClick: (d) => i(u)(e.key),
            onKeydown: (d) => w(d, e.key)
          }, [
            c("span", F, E(e.label), 1)
          ], 42, D)
        ], !0)), 128))
      ], 8, S),
      c("div", {
        id: i(b),
        class: "nm-tabs__panel",
        role: "tabpanel",
        "aria-labelledby": `${i(b)}-tab-${l.modelValue}`
      }, [
        p(a.$slots, "default", {}, void 0, !0)
      ], 8, H)
    ], 2));
  }
}), O = /* @__PURE__ */ R(j, [["__scopeId", "data-v-e74396ae"]]);
export {
  O as N
};
