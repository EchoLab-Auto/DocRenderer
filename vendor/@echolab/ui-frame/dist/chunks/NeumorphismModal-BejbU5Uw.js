import { defineComponent as D, computed as l, ref as E, watch as j, nextTick as q, openBlock as t, createBlock as A, Teleport as F, createVNode as h, Transition as k, withCtx as p, unref as u, createElementBlock as s, withModifiers as G, normalizeClass as w, createElementVNode as n, toDisplayString as f, createCommentVNode as d, renderSlot as b } from "vue";
import { useModal as H } from "../composables/useModal.js";
import { useConfig as J } from "../composables/useConfig.js";
import { useLocale as P } from "../composables/useLocale.js";
import { generateId as Q } from "../utils/index.js";
import { _ as U } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismModal.css';const W = ["aria-labelledby"], X = { class: "nm-modal__header" }, Y = ["aria-label"], Z = { class: "nm-modal__body" }, ee = {
  key: 0,
  class: "nm-modal__footer"
}, oe = /* @__PURE__ */ D({
  __name: "NeumorphismModal",
  props: {
    modelValue: { type: Boolean, default: !1 },
    title: {},
    size: { default: "medium" },
    closable: { type: Boolean, default: !0 },
    maskClosable: { type: Boolean, default: !0 },
    showClose: { type: Boolean, default: !0 },
    destroyOnClose: { type: Boolean, default: !1 },
    footer: { type: Boolean, default: !0 },
    closeLabel: { default: "关闭" },
    cancelLabel: { default: "取消" },
    confirmLabel: { default: "确认" }
  },
  emits: ["update:modelValue", "open", "close", "confirm", "cancel"],
  setup(a, { emit: L }) {
    const o = a, { t: m } = P(), g = J(), B = l(() => {
      var e;
      return o.size ?? ((e = g.value.modal) == null ? void 0 : e.size) ?? "medium";
    }), V = l(() => o.closeLabel || m("modalClose")), M = l(() => o.cancelLabel || m("modalCancel")), N = l(() => o.confirmLabel || m("modalConfirm")), i = L, z = l({
      get: () => o.modelValue,
      set: (e) => i("update:modelValue", e)
    }), {
      visible: c,
      rendered: $,
      close: _,
      confirm: x,
      handleKeydown: K,
      focusDialog: I
    } = H({
      modelValue: z,
      maskClosable: l(() => o.maskClosable),
      closable: l(() => o.closable),
      destroyOnClose: l(() => o.destroyOnClose)
    }), r = E(), y = `nm-modal-title-${Q()}`;
    j(c, async (e) => {
      e && (await q(), I(r.value));
    });
    function O() {
      o.maskClosable && o.closable && (_(), i("cancel"));
    }
    function C() {
      _(), i("cancel");
    }
    function R() {
      i("confirm"), x();
    }
    function S(e) {
      K(e, r.value);
    }
    const T = l(() => ["nm-modal", `nm-modal--${B.value}`]);
    return (e, v) => (t(), A(F, { to: "body" }, [
      h(k, { name: "nm-modal-fade" }, {
        default: p(() => [
          u($) ? (t(), s("div", {
            key: 0,
            class: w(["nm-modal__mask", { "nm-modal__mask--visible": u(c) }]),
            onClick: G(O, ["self"])
          }, [
            h(k, { name: "nm-modal-scale" }, {
              default: p(() => [
                u(c) ? (t(), s("div", {
                  key: 0,
                  ref_key: "dialogRef",
                  ref: r,
                  class: w(T.value),
                  role: "dialog",
                  "aria-modal": "true",
                  "aria-labelledby": a.title ? y : void 0,
                  tabindex: "-1",
                  onKeydown: S
                }, [
                  n("div", X, [
                    a.title ? (t(), s("h2", {
                      key: 0,
                      id: y,
                      class: "nm-modal__title"
                    }, f(a.title), 1)) : d("", !0),
                    b(e.$slots, "header", {}, void 0, !0),
                    a.showClose && a.closable ? (t(), s("button", {
                      key: 1,
                      class: "nm-modal__close",
                      "aria-label": V.value,
                      type: "button",
                      onClick: C
                    }, [...v[0] || (v[0] = [
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
                    ])], 8, Y)) : d("", !0)
                  ]),
                  n("div", Z, [
                    b(e.$slots, "default", {}, void 0, !0)
                  ]),
                  a.footer ? (t(), s("div", ee, [
                    b(e.$slots, "footer", {}, () => [
                      n("button", {
                        class: "nm-modal__btn nm-modal__btn--cancel",
                        type: "button",
                        onClick: C
                      }, f(M.value), 1),
                      n("button", {
                        class: "nm-modal__btn nm-modal__btn--confirm",
                        type: "button",
                        onClick: R
                      }, f(N.value), 1)
                    ], !0)
                  ])) : d("", !0)
                ], 42, W)) : d("", !0)
              ]),
              _: 3
            })
          ], 2)) : d("", !0)
        ]),
        _: 3
      })
    ]));
  }
}), ie = /* @__PURE__ */ U(oe, [["__scopeId", "data-v-b04139cf"]]);
export {
  ie as N
};
