import { defineComponent as Z, computed as n, openBlock as v, createElementBlock as p, normalizeStyle as c, normalizeClass as M, createElementVNode as e, unref as u, toDisplayString as B, renderSlot as h, createCommentVNode as N } from "vue";
import { useLocale as V } from "../composables/useLocale.js";
import { u as G } from "./createComponent-jnXBYqCm.js";
import { _ as $ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismCanvas.css';const I = {
  key: 0,
  class: "nm-canvas__toolbar"
}, L = { class: "nm-canvas__controls" }, O = ["aria-label", "disabled"], P = { class: "nm-canvas__zoom-text" }, j = ["aria-label", "disabled"], E = ["aria-label"], F = { class: "nm-canvas__viewport" }, D = /* @__PURE__ */ Z({
  __name: "NeumorphismCanvas",
  props: {
    modelValue: { default: 1 },
    minZoom: { default: 0.1 },
    maxZoom: { default: 5 },
    zoomStep: { default: 0.1 },
    showGrid: { type: Boolean, default: !0 },
    gridSize: { default: 20 },
    showControls: { type: Boolean, default: !0 },
    width: { default: "100%" },
    height: { default: "500px" }
  },
  emits: ["update:modelValue", "zoom-change"],
  setup(r, { emit: w }) {
    const t = r, { config: l, resolveProp: i } = G(), _ = n(
      () => {
        var o;
        return i(t.showGrid, (o = l.value.canvas) == null ? void 0 : o.showGrid, !0);
      }
    ), f = n(
      () => {
        var o;
        return i(t.gridSize, (o = l.value.canvas) == null ? void 0 : o.gridSize, 20);
      }
    ), g = n(
      () => {
        var o;
        return i(t.showControls, (o = l.value.canvas) == null ? void 0 : o.showControls, !0);
      }
    ), m = w, { t: d } = V(), a = n({
      get: () => t.modelValue,
      set: (o) => {
        m("update:modelValue", o), m("zoom-change", o);
      }
    }), k = n(() => Math.round(a.value * 100));
    function b() {
      a.value = Math.min(t.maxZoom, +(a.value + t.zoomStep).toFixed(2));
    }
    function x() {
      a.value = Math.max(t.minZoom, +(a.value - t.zoomStep).toFixed(2));
    }
    function C() {
      a.value = 1;
    }
    const z = n(() => {
      if (!_.value) return {};
      const o = f.value * a.value;
      return {
        backgroundImage: `
      radial-gradient(circle, var(--nm-text-placeholder) 1px, transparent 1px)
    `,
        backgroundSize: `${o}px ${o}px`,
        backgroundPosition: "0 0"
      };
    }), S = n(() => ({
      width: t.width,
      height: t.height
    })), y = n(() => ["nm-canvas"]);
    return (o, s) => (v(), p("div", {
      class: M(y.value),
      style: c(S.value)
    }, [
      g.value ? (v(), p("div", I, [
        e("div", L, [
          e("button", {
            type: "button",
            class: "nm-canvas__btn",
            "aria-label": u(d)("canvasZoomOut"),
            disabled: a.value <= r.minZoom,
            onClick: x
          }, [...s[0] || (s[0] = [
            e("svg", {
              viewBox: "0 0 24 24",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg"
            }, [
              e("circle", {
                cx: "11",
                cy: "11",
                r: "8",
                stroke: "currentColor",
                "stroke-width": "2"
              }),
              e("path", {
                d: "M8 11h6M21 21l-4.35-4.35",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round"
              })
            ], -1)
          ])], 8, O),
          e("span", P, B(k.value) + "%", 1),
          e("button", {
            type: "button",
            class: "nm-canvas__btn",
            "aria-label": u(d)("canvasZoomIn"),
            disabled: a.value >= r.maxZoom,
            onClick: b
          }, [...s[1] || (s[1] = [
            e("svg", {
              viewBox: "0 0 24 24",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg"
            }, [
              e("circle", {
                cx: "11",
                cy: "11",
                r: "8",
                stroke: "currentColor",
                "stroke-width": "2"
              }),
              e("path", {
                d: "M11 8v6M8 11h6M21 21l-4.35-4.35",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round"
              })
            ], -1)
          ])], 8, j),
          e("button", {
            type: "button",
            class: "nm-canvas__btn nm-canvas__btn--reset",
            "aria-label": u(d)("canvasZoomReset"),
            onClick: C
          }, [...s[2] || (s[2] = [
            e("svg", {
              viewBox: "0 0 24 24",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg"
            }, [
              e("path", {
                d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }),
              e("path", {
                d: "M3 3v5h5",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              })
            ], -1)
          ])], 8, E)
        ]),
        h(o.$slots, "toolbar", {}, void 0, !0)
      ])) : N("", !0),
      e("div", F, [
        e("div", {
          class: "nm-canvas__grid",
          style: c(z.value)
        }, [
          e("div", {
            class: "nm-canvas__content",
            style: c({ transform: `scale(${a.value})`, transformOrigin: "top left" })
          }, [
            h(o.$slots, "default", {}, void 0, !0)
          ], 4)
        ], 4)
      ])
    ], 6));
  }
}), J = /* @__PURE__ */ $(D, [["__scopeId", "data-v-8b77d958"]]);
export {
  J as N
};
