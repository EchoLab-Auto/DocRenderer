import { defineComponent as S, computed as l, ref as I, watch as h, nextTick as R, openBlock as a, createBlock as T, Teleport as E, createVNode as p, Transition as y, withCtx as k, unref as c, createElementBlock as r, withModifiers as H, normalizeClass as b, normalizeStyle as L, createElementVNode as n, toDisplayString as P, createCommentVNode as s, renderSlot as m } from "vue";
import { useDrawer as W } from "../composables/useDrawer.js";
import { generateId as j } from "../utils/index.js";
import { _ as q } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismDrawer.css';const A = ["aria-labelledby"], F = { class: "nm-drawer__header" }, G = { class: "nm-drawer__body" }, J = {
  key: 0,
  class: "nm-drawer__footer"
}, Q = /* @__PURE__ */ S({
  __name: "NeumorphismDrawer",
  props: {
    modelValue: { type: Boolean, default: !1 },
    position: { default: "right" },
    title: {},
    width: {},
    maskClosable: { type: Boolean, default: !0 },
    closable: { type: Boolean, default: !0 },
    showClose: { type: Boolean, default: !0 },
    destroyOnClose: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue", "open", "close"],
  setup(o, { emit: C }) {
    const t = o, i = C, _ = l({
      get: () => t.modelValue,
      set: (e) => i("update:modelValue", e)
    }), {
      isOpen: d,
      rendered: v,
      close: g,
      handleKeydown: V,
      handleMaskClick: B,
      focusDrawer: x
    } = W({
      modelValue: _,
      maskClosable: l(() => t.maskClosable),
      closable: l(() => t.closable),
      destroyOnClose: l(() => t.destroyOnClose)
    }), u = I(), f = `nm-drawer-title-${j()}`, $ = l(() => {
      if (t.width != null) return N(t.width);
      const e = t.position;
      return e === "left" || e === "right" ? "320px" : "240px";
    });
    function N(e) {
      return typeof e == "number" ? `${e}px` : e;
    }
    h(d, async (e) => {
      e && (await R(), x(u.value));
    }), h(
      () => t.modelValue,
      (e) => {
        i(e ? "open" : "close");
      }
    );
    function D() {
      B();
    }
    function M() {
      g();
    }
    function z(e) {
      V(e, u.value);
    }
    const K = l(() => t.position === "left" || t.position === "right"), O = l(() => {
      const e = $.value;
      return K.value ? { width: e } : { height: e };
    });
    return (e, w) => (a(), T(E, { to: "body" }, [
      p(y, { name: "nm-drawer-fade" }, {
        default: k(() => [
          c(v) ? (a(), r("div", {
            key: 0,
            class: b(["nm-drawer__mask", { "nm-drawer__mask--visible": c(d) }]),
            onClick: H(D, ["self"])
          }, [
            p(y, { name: "nm-drawer-slide" }, {
              default: k(() => [
                c(d) ? (a(), r("div", {
                  key: 0,
                  ref_key: "drawerRef",
                  ref: u,
                  class: b(["nm-drawer", `nm-drawer--${o.position}`]),
                  style: L(O.value),
                  role: "dialog",
                  "aria-modal": "true",
                  "aria-labelledby": o.title ? f : void 0,
                  tabindex: "-1",
                  onKeydown: z
                }, [
                  n("div", F, [
                    o.title ? (a(), r("h2", {
                      key: 0,
                      id: f,
                      class: "nm-drawer__title"
                    }, P(o.title), 1)) : s("", !0),
                    m(e.$slots, "header", {}, void 0, !0),
                    o.showClose && o.closable ? (a(), r("button", {
                      key: 1,
                      class: "nm-drawer__close",
                      "aria-label": "关闭",
                      type: "button",
                      onClick: M
                    }, [...w[0] || (w[0] = [
                      n("svg", {
                        width: "18",
                        height: "18",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2"
                      }, [
                        n("path", { d: "M18 6L6 18M6 6l12 12" })
                      ], -1)
                    ])])) : s("", !0)
                  ]),
                  n("div", G, [
                    m(e.$slots, "default", {}, void 0, !0)
                  ]),
                  e.$slots.footer ? (a(), r("div", J, [
                    m(e.$slots, "footer", {}, void 0, !0)
                  ])) : s("", !0)
                ], 46, A)) : s("", !0)
              ]),
              _: 3
            })
          ], 2)) : s("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), ee = /* @__PURE__ */ q(Q, [["__scopeId", "data-v-72aa66d5"]]);
export {
  ee as N
};
