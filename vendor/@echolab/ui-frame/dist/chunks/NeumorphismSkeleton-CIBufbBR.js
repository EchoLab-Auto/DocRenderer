import { defineComponent as k, computed as t, openBlock as m, createElementBlock as u, Fragment as v, renderList as _, unref as g, normalizeStyle as x, normalizeClass as y, createElementVNode as N } from "vue";
import { useLocale as S } from "../composables/useLocale.js";
import { u as b } from "./createComponent-jnXBYqCm.js";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismSkeleton.css';const w = ["aria-label"], z = /* @__PURE__ */ k({
  __name: "NeumorphismSkeleton",
  props: {
    variant: { default: "text" },
    width: {},
    height: {},
    count: { default: 1 },
    animation: { default: "pulse" }
  },
  setup(n) {
    const o = n, { config: s, resolveProp: i } = b(), c = t(
      () => {
        var e;
        return i(o.variant, (e = s.value.skeleton) == null ? void 0 : e.variant, "text");
      }
    ), p = t(
      () => {
        var e;
        return i(o.animation, (e = s.value.skeleton) == null ? void 0 : e.animation, "pulse");
      }
    ), { t: d } = S(), f = t(() => {
      const e = Math.max(0, Math.floor(o.count));
      return Array.from({ length: e }, (a, r) => r);
    }), h = t(() => [
      "nm-skeleton",
      `nm-skeleton--${c.value}`,
      `nm-skeleton--${p.value}`
    ]);
    function l(e) {
      if (e !== void 0)
        return typeof e == "number" ? `${e}px` : e;
    }
    return (e, a) => (m(!0), u(v, null, _(f.value, (r) => (m(), u("span", {
      key: r,
      class: y(h.value),
      style: x({
        width: l(n.width),
        height: l(n.height)
      }),
      role: "status",
      "aria-label": g(d)("skeletonLoading")
    }, [...a[0] || (a[0] = [
      N("span", {
        class: "nm-skeleton__shimmer",
        "aria-hidden": "true"
      }, null, -1)
    ])], 14, w))), 128));
  }
}), E = /* @__PURE__ */ L(z, [["__scopeId", "data-v-66ae242b"]]);
export {
  E as N
};
