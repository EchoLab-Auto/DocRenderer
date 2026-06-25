import { defineComponent as y, computed as l, openBlock as r, createBlock as M, Teleport as L, createElementVNode as e, normalizeClass as p, createVNode as b, TransitionGroup as B, withCtx as N, createElementBlock as n, Fragment as T, renderList as P, unref as u, renderSlot as $, toDisplayString as S, createCommentVNode as V } from "vue";
import { useToast as z } from "../composables/useToast.js";
import { useLocale as E } from "../composables/useLocale.js";
import { u as A } from "./createComponent-jnXBYqCm.js";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismToastProvider.css';const F = { class: "nm-toast__icon" }, G = {
  key: 0,
  width: "18",
  height: "18",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2"
}, I = {
  key: 1,
  width: "18",
  height: "18",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2"
}, j = {
  key: 2,
  width: "18",
  height: "18",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2"
}, q = {
  key: 3,
  width: "18",
  height: "18",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2"
}, H = { class: "nm-toast__message" }, J = ["aria-label", "onClick"], K = /* @__PURE__ */ y({
  __name: "NeumorphismToastProvider",
  props: {
    position: { default: "top-right" },
    maxCount: { default: 5 },
    closeLabel: { default: "" }
  },
  setup(v, { expose: h }) {
    const i = v, { config: d, resolveProp: m } = A(), k = l(
      () => {
        var s;
        return m(i.position, (s = d.value.toast) == null ? void 0 : s.position, "top-right");
      }
    ), _ = l(
      () => {
        var s;
        return m(i.maxCount, (s = d.value.toast) == null ? void 0 : s.maxCount, 5);
      }
    ), { t: f } = E(), g = l(() => i.closeLabel || f("toastClose")), { toasts: c, addToast: C, removeToast: a, clearAll: w } = z({
      maxCount: _.value
    });
    h({ addToast: C, removeToast: a, clearAll: w, toasts: c });
    const x = l(() => [
      "nm-toast-container",
      `nm-toast-container--${k.value}`
    ]);
    return (s, o) => (r(), M(L, { to: "body" }, [
      e("div", {
        class: p(x.value),
        "aria-live": "polite",
        "aria-atomic": "false"
      }, [
        b(B, { name: "nm-toast-list" }, {
          default: N(() => [
            (r(!0), n(T, null, P(u(c), (t) => $(s.$slots, "toast-item", {
              key: t.id,
              toast: t,
              remove: () => u(a)(t.id)
            }, () => [
              e("div", {
                class: p(["nm-toast", [`nm-toast--${t.type}`, { "nm-toast--leaving": t.leaving }]]),
                role: "status"
              }, [
                e("span", F, [
                  t.type === "success" ? (r(), n("svg", G, [...o[0] || (o[0] = [
                    e("path", { d: "M5 13l4 4L19 7" }, null, -1)
                  ])])) : t.type === "error" ? (r(), n("svg", I, [...o[1] || (o[1] = [
                    e("circle", {
                      cx: "12",
                      cy: "12",
                      r: "10"
                    }, null, -1),
                    e("path", { d: "M15 9l-6 6M9 9l6 6" }, null, -1)
                  ])])) : t.type === "warning" ? (r(), n("svg", j, [...o[2] || (o[2] = [
                    e("path", { d: "M12 2L2 22h20L12 2zM12 9v4M12 17v1" }, null, -1)
                  ])])) : (r(), n("svg", q, [...o[3] || (o[3] = [
                    e("circle", {
                      cx: "12",
                      cy: "12",
                      r: "10"
                    }, null, -1),
                    e("path", { d: "M12 16v-4M12 8v-1" }, null, -1)
                  ])]))
                ]),
                e("span", H, S(t.message), 1),
                t.closable ? (r(), n("button", {
                  key: 0,
                  class: "nm-toast__close",
                  "aria-label": g.value,
                  type: "button",
                  onClick: (O) => u(a)(t.id)
                }, [...o[4] || (o[4] = [
                  e("svg", {
                    width: "14",
                    height: "14",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2"
                  }, [
                    e("path", { d: "M18 6L6 18M6 6l12 12" })
                  ], -1)
                ])], 8, J)) : V("", !0)
              ], 2)
            ], !0)), 128))
          ]),
          _: 3
        })
      ], 2)
    ]));
  }
}), Y = /* @__PURE__ */ D(K, [["__scopeId", "data-v-57965a01"]]);
export {
  Y as N
};
