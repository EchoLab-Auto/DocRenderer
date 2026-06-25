import { defineComponent as N, computed as t, watch as T, openBlock as e, createBlock as V, Transition as $, withCtx as A, unref as I, createElementBlock as o, normalizeClass as E, renderSlot as p, Fragment as D, renderList as F, createCommentVNode as i, createElementVNode as d, toDisplayString as _ } from "vue";
import { useLocale as P } from "../composables/useLocale.js";
import { useAlert as j } from "../composables/useAlert.js";
import { u as q } from "./createComponent-jnXBYqCm.js";
import { _ as G } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismAlert.css';const H = ["aria-live"], J = {
  key: 0,
  class: "nm-alert__icon",
  "aria-hidden": "true"
}, K = ["viewBox"], O = ["d"], Q = { class: "nm-alert__content" }, R = {
  key: 0,
  class: "nm-alert__title"
}, U = {
  key: 1,
  class: "nm-alert__message"
}, W = ["aria-label"], X = /* @__PURE__ */ N({
  __name: "NeumorphismAlert",
  props: {
    type: { default: "info" },
    title: { default: "" },
    message: { default: "" },
    closable: { type: Boolean, default: !0 },
    duration: { default: 0 },
    icon: { type: Boolean, default: !0 },
    bordered: { type: Boolean, default: !0 },
    size: { default: "medium" },
    closeLabel: { default: "" }
  },
  emits: ["close"],
  setup(a, { emit: b }) {
    const l = a, B = b, { resolveProp: s } = q(), n = t(() => s(l.type, void 0, "info")), y = t(() => s(l.closable, void 0, !0)), c = t(() => s(l.duration, void 0, 0)), z = t(() => s(l.icon, void 0, !0)), C = t(() => s(l.bordered, void 0, !0)), g = t(() => s(l.size, void 0, "medium")), { t: w } = P(), k = t(() => l.closeLabel || w("alertClose")), { isVisible: u, close: m, leaving: v } = j({
      duration: c.value
    });
    T(c, (r) => {
      u.value && !v.value && r > 0 && setTimeout(() => m(), r);
    });
    function L() {
      m(), setTimeout(() => {
        B("close");
      }, 300);
    }
    const x = t(() => [
      "nm-alert",
      `nm-alert--${n.value}`,
      `nm-alert--${g.value}`,
      {
        "nm-alert--bordered": C.value,
        "nm-alert--leaving": v.value,
        "nm-alert--hidden": !u.value
      }
    ]), h = {
      info: {
        viewBox: "0 0 24 24",
        paths: [
          "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
        ]
      },
      success: {
        viewBox: "0 0 24 24",
        paths: [
          "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        ]
      },
      warning: {
        viewBox: "0 0 24 24",
        paths: ["M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"]
      },
      error: {
        viewBox: "0 0 24 24",
        paths: [
          "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
        ]
      }
    };
    return (r, f) => (e(), V($, { name: "nm-alert-fade" }, {
      default: A(() => [
        I(u) ? (e(), o("div", {
          key: 0,
          class: E(x.value),
          role: "alert",
          "aria-live": n.value === "error" ? "assertive" : "polite"
        }, [
          z.value ? (e(), o("div", J, [
            p(r.$slots, "icon", {}, () => [
              (e(), o("svg", {
                width: "20",
                height: "20",
                viewBox: h[n.value].viewBox,
                fill: "currentColor"
              }, [
                (e(!0), o(D, null, F(h[n.value].paths, (S, M) => (e(), o("path", {
                  key: M,
                  d: S
                }, null, 8, O))), 128))
              ], 8, K))
            ], !0)
          ])) : i("", !0),
          d("div", Q, [
            p(r.$slots, "default", {}, () => [
              a.title ? (e(), o("div", R, _(a.title), 1)) : i("", !0),
              a.message ? (e(), o("div", U, _(a.message), 1)) : i("", !0)
            ], !0)
          ]),
          y.value ? (e(), o("button", {
            key: 1,
            class: "nm-alert__close",
            "aria-label": k.value,
            type: "button",
            onClick: L
          }, [...f[0] || (f[0] = [
            d("svg", {
              width: "14",
              height: "14",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              "stroke-width": "2.5"
            }, [
              d("path", { d: "M18 6L6 18M6 6l12 12" })
            ], -1)
          ])], 8, W)) : i("", !0)
        ], 10, H)) : i("", !0)
      ]),
      _: 3
    }));
  }
}), le = /* @__PURE__ */ G(X, [["__scopeId", "data-v-44329a9b"]]);
export {
  le as N
};
