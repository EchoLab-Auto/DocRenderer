import { defineComponent as D, computed as o, ref as C, openBlock as l, createElementBlock as t, normalizeClass as w, createElementVNode as i, unref as v, createCommentVNode as p, renderSlot as n, createVNode as E, Transition as T, withCtx as V, withModifiers as z, normalizeStyle as x } from "vue";
import { useLocale as I } from "../composables/useLocale.js";
import { useTouchDevice as O } from "../composables/useTouchDevice.js";
import { u as P } from "./createComponent-jnXBYqCm.js";
import { _ as j } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismLayout.css';const q = {
  key: 0,
  class: "nm-layout__header"
}, F = { class: "nm-layout__header-left" }, G = ["aria-label"], J = {
  width: "18",
  height: "18",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2"
}, K = {
  key: 0,
  d: "M16 18l-6-6 6-6"
}, Q = {
  key: 1,
  d: "M8 18l6-6-6-6"
}, R = { class: "nm-layout__header-center" }, U = { class: "nm-layout__header-right" }, X = { class: "nm-layout__body" }, Y = { class: "nm-layout__sider-inner" }, Z = {
  key: 1,
  class: "nm-layout__footer"
}, ee = /* @__PURE__ */ D({
  __name: "NeumorphismLayout",
  props: {
    showHeader: { type: Boolean, default: !0 },
    showSider: { type: Boolean, default: !1 },
    siderWidth: { default: 240 },
    collapsible: { type: Boolean, default: !1 },
    defaultCollapsed: { type: Boolean, default: !1 },
    collapsedWidth: { default: 64 },
    mobileAutoCollapse: { type: Boolean, default: !0 }
  },
  emits: ["collapse"],
  setup(b, { emit: k }) {
    const a = b, { config: r, resolveProp: d } = P(), S = o(
      () => {
        var e;
        return d(a.showHeader, (e = r.value.layout) == null ? void 0 : e.showHeader, !0);
      }
    ), h = o(
      () => {
        var e;
        return d(a.showSider, (e = r.value.layout) == null ? void 0 : e.showSider, !1);
      }
    ), $ = o(
      () => {
        var e;
        return d(a.siderWidth, (e = r.value.layout) == null ? void 0 : e.siderWidth, 240);
      }
    ), B = o(
      () => {
        var e;
        return d(a.collapsible, (e = r.value.layout) == null ? void 0 : e.collapsible, !1);
      }
    ), W = o(
      () => {
        var e;
        return d(a.collapsedWidth, (e = r.value.layout) == null ? void 0 : e.collapsedWidth, 64);
      }
    ), g = o(
      () => {
        var e;
        return d(a.mobileAutoCollapse, (e = r.value.layout) == null ? void 0 : e.mobileAutoCollapse, !0);
      }
    ), N = k, { isMobile: s } = O(), m = C(a.defaultCollapsed), u = C(!1), c = o(() => g.value && s.value ? !0 : m.value);
    function M() {
      s.value ? u.value = !u.value : (m.value = !m.value, N("collapse", m.value));
    }
    const { t: _ } = I();
    function f() {
      u.value = !1;
    }
    function A() {
      s.value && u.value && f();
    }
    const H = o(() => [
      "nm-layout",
      {
        "nm-layout--has-sider": h.value,
        "nm-layout--sider-collapsed": c.value,
        "nm-layout--mobile": s.value,
        "nm-layout--drawer-open": u.value
      }
    ]), L = o(() => ({
      width: c.value ? `${W.value}px` : `${$.value}px`
    }));
    return (e, y) => (l(), t("div", {
      class: w(H.value)
    }, [
      S.value ? (l(), t("header", q, [
        i("div", F, [
          h.value && B.value ? (l(), t("button", {
            key: 0,
            class: "nm-layout__collapse-btn",
            type: "button",
            "aria-label": c.value ? v(_)("layoutExpandSider") : v(_)("layoutCollapseSider"),
            onClick: M
          }, [
            (l(), t("svg", J, [
              c.value ? (l(), t("path", K)) : (l(), t("path", Q))
            ]))
          ], 8, G)) : p("", !0),
          n(e.$slots, "header-left", {}, void 0, !0)
        ]),
        i("div", R, [
          n(e.$slots, "header-center", {}, void 0, !0)
        ]),
        i("div", U, [
          n(e.$slots, "header-right", {}, void 0, !0)
        ])
      ])) : p("", !0),
      i("div", X, [
        E(T, { name: "nm-layout-fade" }, {
          default: V(() => [
            v(s) && u.value ? (l(), t("div", {
              key: 0,
              class: "nm-layout__drawer-overlay",
              onClick: f,
              onTouchmove: y[0] || (y[0] = z(() => {
              }, ["prevent"]))
            }, null, 32)) : p("", !0)
          ]),
          _: 1
        }),
        h.value ? (l(), t("aside", {
          key: 0,
          class: w(["nm-layout__sider", {
            "nm-layout__sider--drawer": v(s),
            "nm-layout__sider--open": u.value
          }]),
          style: x(v(s) ? void 0 : L.value)
        }, [
          i("div", Y, [
            n(e.$slots, "sider", { collapsed: c.value }, void 0, !0)
          ])
        ], 6)) : p("", !0),
        i("main", {
          class: "nm-layout__content",
          onClick: A
        }, [
          n(e.$slots, "default", {}, void 0, !0)
        ])
      ]),
      e.$slots.footer ? (l(), t("footer", Z, [
        n(e.$slots, "footer", {}, void 0, !0)
      ])) : p("", !0)
    ], 2));
  }
}), ue = /* @__PURE__ */ j(ee, [["__scopeId", "data-v-3558204f"]]);
export {
  ue as N
};
