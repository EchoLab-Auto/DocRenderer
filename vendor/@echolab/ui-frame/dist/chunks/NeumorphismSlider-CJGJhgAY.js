import { defineComponent as X, computed as r, ref as _, openBlock as u, createElementBlock as d, normalizeClass as P, createElementVNode as c, normalizeStyle as f, unref as o, Fragment as Y, renderList as U, withModifiers as j, createVNode as q, Transition as A, withCtx as G, toDisplayString as H, createCommentVNode as J } from "vue";
import { u as O } from "./createComponent-jnXBYqCm.js";
import { useSlider as Q, coordinateToValue as W } from "../composables/useSlider.js";
import { _ as Z } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismSlider.css';const ee = ["tabindex", "aria-valuemin", "aria-valuemax", "aria-valuenow", "aria-valuetext", "aria-disabled", "aria-orientation"], te = {
  key: 0,
  class: "nm-slider__tooltip",
  "aria-hidden": "true"
}, ae = /* @__PURE__ */ X({
  __name: "NeumorphismSlider",
  props: {
    modelValue: { default: 0 },
    min: { default: 0 },
    max: { default: 100 },
    step: { default: 1 },
    disabled: { type: Boolean, default: !1 },
    showTooltip: { type: Boolean, default: !0 },
    showStops: { type: Boolean, default: !1 },
    vertical: { type: Boolean, default: !1 },
    size: { default: "medium" }
  },
  emits: ["update:modelValue", "change"],
  setup(l, { emit: k }) {
    const t = l, { config: m, resolveProp: v } = O(), T = r(
      () => {
        var e;
        return v(t.size, (e = m.value.slider) == null ? void 0 : e.size, "medium");
      }
    ), p = r(
      () => {
        var e;
        return v(t.showTooltip, (e = m.value.slider) == null ? void 0 : e.showTooltip, !0);
      }
    ), z = r(
      () => {
        var e;
        return v(t.showStops, (e = m.value.slider) == null ? void 0 : e.showStops, !1);
      }
    ), g = k, B = r(() => t.disabled), C = r(() => t.vertical), { sliderValue: s, percentage: h, setValue: N, handleKeydown: w, isDragging: x } = Q({
      modelValue: r({
        get: () => t.modelValue,
        set: (e) => {
          g("update:modelValue", e), g("change", e);
        }
      }),
      min: t.min,
      max: t.max,
      step: t.step,
      disabled: B,
      vertical: C
    }), b = _(null), n = _(!1);
    function R() {
      var e;
      return ((e = b.value) == null ? void 0 : e.getBoundingClientRect()) ?? null;
    }
    function S(e, i) {
      const a = R();
      if (!a) return;
      const F = t.vertical ? i : e, K = t.vertical ? a.top : a.left, L = t.vertical ? a.height : a.width, M = W(
        F,
        K,
        L,
        t.min,
        t.max,
        t.step,
        t.vertical
      );
      N(M);
    }
    function y(e) {
      if (t.disabled) return;
      n.value = !0, x.value = !0, e.currentTarget.setPointerCapture(e.pointerId), S(e.clientX, e.clientY);
    }
    function $(e) {
      n.value && S(e.clientX, e.clientY);
    }
    function V(e) {
      if (!n.value) return;
      n.value = !1, x.value = !1, e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const D = r(() => {
      if (!z.value) return [];
      const e = [], i = t.max - t.min;
      if (i <= 0) return e;
      for (let a = t.min; a <= t.max; a += t.step)
        e.push({
          value: a,
          percentage: (a - t.min) / i * 100
        });
      return e;
    }), E = r(() => `${s.value}`), I = r(() => [
      "nm-slider",
      `nm-slider--${T.value}`,
      {
        "nm-slider--disabled": t.disabled,
        "nm-slider--vertical": t.vertical,
        "nm-slider--dragging": n.value,
        "nm-slider--show-tooltip": p.value && n.value
      }
    ]);
    return (e, i) => (u(), d("div", {
      class: P(I.value),
      role: "group",
      "aria-label": "Slider"
    }, [
      c("div", {
        ref_key: "railRef",
        ref: b,
        class: "nm-slider__rail",
        onPointerdown: y,
        onPointermove: $,
        onPointerup: V,
        onPointercancel: V
      }, [
        c("div", {
          class: "nm-slider__track",
          style: f({
            [l.vertical ? "height" : "width"]: `${o(h)}%`
          }),
          "aria-hidden": "true"
        }, null, 4),
        (u(!0), d(Y, null, U(D.value, (a) => (u(), d("span", {
          key: a.value,
          class: P(["nm-slider__stop", { "nm-slider__stop--active": a.value <= o(s) }]),
          style: f({
            [l.vertical ? "top" : "left"]: `${a.percentage}%`
          }),
          "aria-hidden": "true"
        }, null, 6))), 128)),
        c("div", {
          class: "nm-slider__thumb-wrapper",
          style: f({
            [l.vertical ? "top" : "left"]: `${o(h)}%`
          })
        }, [
          c("div", {
            class: "nm-slider__thumb",
            role: "slider",
            tabindex: l.disabled ? -1 : 0,
            "aria-valuemin": l.min,
            "aria-valuemax": l.max,
            "aria-valuenow": o(s),
            "aria-valuetext": E.value,
            "aria-disabled": l.disabled || void 0,
            "aria-orientation": l.vertical ? "vertical" : "horizontal",
            onKeydown: i[0] || (i[0] = //@ts-ignore
            (...a) => o(w) && o(w)(...a)),
            onPointerdown: j(y, ["stop"])
          }, null, 40, ee),
          q(A, { name: "nm-slider-tooltip" }, {
            default: G(() => [
              p.value && n.value ? (u(), d("span", te, H(o(s)), 1)) : J("", !0)
            ]),
            _: 1
          })
        ], 4)
      ], 544)
    ], 2));
  }
}), oe = /* @__PURE__ */ Z(ae, [["__scopeId", "data-v-cb4ce4a0"]]);
export {
  oe as N
};
