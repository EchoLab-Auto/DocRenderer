import { defineComponent as $, computed as l, openBlock as u, createElementBlock as d, unref as i, normalizeClass as f, toDisplayString as h, createCommentVNode as _, createElementVNode as n, Fragment as D, renderList as M, renderSlot as j, createTextVNode as P } from "vue";
import { useLocale as E } from "../composables/useLocale.js";
import { usePagination as F } from "../composables/usePagination.js";
import { u as I } from "./createComponent-jnXBYqCm.js";
import { _ as q } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismPagination.css';const A = ["aria-label"], G = {
  key: 0,
  class: "nm-pagination__total"
}, H = { class: "nm-pagination__list" }, K = ["disabled", "aria-label"], O = {
  key: 0,
  class: "nm-pagination__ellipsis",
  "aria-hidden": "true"
}, Q = ["aria-label", "aria-current", "onClick"], R = ["disabled", "aria-label"], U = {
  key: 1,
  class: "nm-pagination__jumper"
}, W = ["max", "value", "disabled"], X = /* @__PURE__ */ $({
  __name: "NeumorphismPagination",
  props: {
    modelValue: { default: 1 },
    total: { default: 0 },
    pageSize: { default: 10 },
    size: { default: "medium" },
    showTotal: { type: Boolean, default: !1 },
    showJumper: { type: Boolean, default: !1 },
    maxVisiblePages: { default: 7 },
    disabled: { type: Boolean, default: !1 },
    prevLabel: { default: "上一页" },
    nextLabel: { default: "下一页" },
    totalLabel: { default: "共" }
  },
  emits: ["update:modelValue", "change"],
  setup(o, { emit: V }) {
    const s = o, { config: r, resolveProp: m } = I(), x = l(
      () => {
        var e;
        return m(s.size, (e = r.value.pagination) == null ? void 0 : e.size, "medium");
      }
    ), k = l(
      () => {
        var e;
        return m(s.showTotal, (e = r.value.pagination) == null ? void 0 : e.showTotal, !1);
      }
    ), w = l(
      () => {
        var e;
        return m(s.showJumper, (e = r.value.pagination) == null ? void 0 : e.showJumper, !1);
      }
    ), y = l(
      () => {
        var e;
        return m(s.maxVisiblePages, (e = r.value.pagination) == null ? void 0 : e.maxVisiblePages, 7);
      }
    ), S = l(
      () => {
        var e;
        return m(s.pageSize, (e = r.value.pagination) == null ? void 0 : e.pageSize, 10);
      }
    ), p = V, C = l({
      get: () => s.modelValue,
      set: (e) => {
        p("update:modelValue", e), p("change", e);
      }
    }), { totalPages: z, visiblePages: L, changePage: g, prevPage: b, nextPage: c, isPrevDisabled: N, isNextDisabled: B } = F({
      modelValue: C,
      total: l(() => s.total),
      pageSize: l(() => S.value),
      maxVisiblePages: l(() => y.value),
      disabled: l(() => s.disabled)
    }), T = l(() => [
      "nm-pagination",
      `nm-pagination--${x.value}`,
      { "nm-pagination--disabled": s.disabled }
    ]);
    function J(e) {
      g(Number(e.target.value));
    }
    const { t: v } = E();
    return (e, t) => (u(), d("nav", {
      class: f(T.value),
      role: "navigation",
      "aria-label": i(v)("paginationLabel")
    }, [
      k.value ? (u(), d("span", G, h(i(v)("paginationTotal", { total: o.total })), 1)) : _("", !0),
      n("ul", H, [
        n("li", null, [
          n("button", {
            class: "nm-pagination__btn",
            disabled: i(N),
            "aria-label": o.prevLabel,
            type: "button",
            onClick: t[0] || (t[0] = //@ts-ignore
            (...a) => i(b) && i(b)(...a))
          }, [...t[2] || (t[2] = [
            n("svg", {
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2"
            }, [
              n("path", { d: "M15 18l-6-6 6-6" })
            ], -1)
          ])], 8, K)
        ]),
        (u(!0), d(D, null, M(i(L), (a) => j(e.$slots, "page-item", {
          key: String(a),
          page: a,
          active: a === o.modelValue
        }, () => [
          n("li", null, [
            typeof a == "string" ? (u(), d("span", O, "...")) : (u(), d("button", {
              key: 1,
              class: f(["nm-pagination__btn", { "nm-pagination__btn--active": a === o.modelValue }]),
              "aria-label": `第 ${a} 页`,
              "aria-current": a === o.modelValue ? "page" : void 0,
              type: "button",
              onClick: (Y) => i(g)(a)
            }, h(a), 11, Q))
          ])
        ], !0)), 128)),
        n("li", null, [
          n("button", {
            class: "nm-pagination__btn",
            disabled: i(B),
            "aria-label": o.nextLabel,
            type: "button",
            onClick: t[1] || (t[1] = //@ts-ignore
            (...a) => i(c) && i(c)(...a))
          }, [...t[3] || (t[3] = [
            n("svg", {
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2"
            }, [
              n("path", { d: "M9 18l6-6-6-6" })
            ], -1)
          ])], 8, R)
        ])
      ]),
      w.value ? (u(), d("div", U, [
        t[4] || (t[4] = P(" 跳至 ", -1)),
        n("input", {
          class: "nm-pagination__jumper-input",
          type: "number",
          min: 1,
          max: i(z),
          value: o.modelValue,
          disabled: o.disabled,
          onChange: J
        }, null, 40, W),
        t[5] || (t[5] = P(" 页 ", -1))
      ])) : _("", !0)
    ], 10, A));
  }
}), ie = /* @__PURE__ */ q(X, [["__scopeId", "data-v-85a91c0d"]]);
export {
  ie as N
};
