import { defineComponent as E, useSlots as I, computed as i, openBlock as s, createElementBlock as l, unref as c, normalizeClass as h, renderSlot as n, createCommentVNode as y, createElementVNode as _, toDisplayString as v, Fragment as V, renderList as D, createTextVNode as F } from "vue";
import { useLocale as H } from "../composables/useLocale.js";
import { u as K } from "./createComponent-jnXBYqCm.js";
import { _ as P } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismList.css';const T = ["aria-label"], j = {
  key: 0,
  class: "nm-list__header"
}, q = {
  key: 1,
  class: "nm-list__loading"
}, w = { class: "nm-list__loading-text" }, A = {
  key: 2,
  class: "nm-list__empty"
}, G = { class: "nm-list__empty-text" }, J = ["onClick"], M = {
  key: 4,
  class: "nm-list__footer"
}, O = /* @__PURE__ */ E({
  __name: "NeumorphismList",
  props: {
    items: { default: () => [] },
    bordered: { type: Boolean, default: !0 },
    split: { type: Boolean, default: !0 },
    size: { default: "medium" },
    hoverable: { type: Boolean, default: !0 },
    loading: { type: Boolean, default: !1 }
  },
  emits: ["item-click"],
  setup(a, { emit: g }) {
    const t = a, k = I(), { config: r, resolveProp: d } = K(), b = i(() => {
      var e;
      return d(t.size, (e = r.value.list) == null ? void 0 : e.size, "medium");
    }), $ = i(
      () => {
        var e;
        return d(t.bordered, (e = r.value.list) == null ? void 0 : e.bordered, !0);
      }
    ), B = i(() => {
      var e;
      return d(t.split, (e = r.value.list) == null ? void 0 : e.split, !0);
    }), L = i(
      () => {
        var e;
        return d(t.hoverable, (e = r.value.list) == null ? void 0 : e.hoverable, !0);
      }
    ), { t: p } = H(), N = g, f = i(() => !t.loading && t.items.length === 0), C = i(() => [
      "nm-list",
      `nm-list--${b.value}`,
      {
        "nm-list--bordered": $.value,
        "nm-list--split": B.value,
        "nm-list--hoverable": L.value,
        "nm-list--loading": t.loading,
        "nm-list--empty": f.value
      }
    ]);
    function S(e, o) {
      N("item-click", e, o);
    }
    function z(e, o) {
      return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.key) ?? o;
    }
    return (e, o) => (s(), l("div", {
      class: h(C.value),
      role: "list",
      "aria-label": c(p)("listLabel")
    }, [
      e.$slots.header ? (s(), l("div", j, [
        n(e.$slots, "header", {}, void 0, !0)
      ])) : y("", !0),
      a.loading ? (s(), l("div", q, [
        n(e.$slots, "loading", {}, () => [
          o[0] || (o[0] = _("span", {
            class: "nm-list__spinner",
            "aria-hidden": "true"
          }, null, -1)),
          _("span", w, v(c(p)("listLoading")), 1)
        ], !0)
      ])) : f.value ? (s(), l("div", A, [
        n(e.$slots, "empty", {}, () => [
          _("span", G, v(c(p)("listEmpty")), 1)
        ], !0)
      ])) : (s(!0), l(V, { key: 3 }, D(a.items, (m, u) => (s(), l("div", {
        key: z(m, u),
        class: h(["nm-list__item", {
          "nm-list__item--last": u === a.items.length - 1,
          "nm-list__item--clickable": !!c(k).default
        }]),
        role: "listitem",
        onClick: (Q) => S(m, u)
      }, [
        n(e.$slots, "default", {
          item: m,
          index: u
        }, () => [
          F(v(m), 1)
        ], !0)
      ], 10, J))), 128)),
      e.$slots.footer ? (s(), l("div", M, [
        n(e.$slots, "footer", {}, void 0, !0)
      ])) : y("", !0)
    ], 10, T));
  }
}), Y = /* @__PURE__ */ P(O, [["__scopeId", "data-v-61b54172"]]);
export {
  Y as N
};
