import { defineComponent as m, computed as o, openBlock as r, createElementBlock as n, normalizeClass as p, renderSlot as f, createCommentVNode as _ } from "vue";
import { u as h } from "./createComponent-jnXBYqCm.js";
import { _ as g } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismDivider.css';const N = ["aria-orientation"], z = {
  key: 0,
  class: "nm-divider__text"
}, B = /* @__PURE__ */ m({
  __name: "NeumorphismDivider",
  props: {
    direction: { default: "horizontal" },
    align: { default: "center" },
    dashed: { type: Boolean, default: !1 },
    inset: { type: Boolean, default: !1 }
  },
  setup(d) {
    const i = d, { config: t, resolveProp: s } = h(), a = o(
      () => {
        var e;
        return s(i.direction, (e = t.value.divider) == null ? void 0 : e.direction, "horizontal");
      }
    ), l = o(
      () => {
        var e;
        return s(i.align, (e = t.value.divider) == null ? void 0 : e.align, "center");
      }
    ), v = o(
      () => {
        var e;
        return s(i.dashed, (e = t.value.divider) == null ? void 0 : e.dashed, !1);
      }
    ), c = o(() => {
      var e;
      return s(i.inset, (e = t.value.divider) == null ? void 0 : e.inset, !1);
    }), u = o(() => [
      "nm-divider",
      `nm-divider--${a.value}`,
      ...a.value === "horizontal" ? [`nm-divider--${l.value}`] : [],
      {
        "nm-divider--dashed": v.value,
        "nm-divider--inset": c.value
      }
    ]);
    return (e, D) => (r(), n("div", {
      class: p(u.value),
      role: "separator",
      "aria-orientation": a.value
    }, [
      e.$slots.default ? (r(), n("span", z, [
        f(e.$slots, "default", {}, void 0, !0)
      ])) : _("", !0)
    ], 10, N));
  }
}), C = /* @__PURE__ */ g(B, [["__scopeId", "data-v-84be10a5"]]);
export {
  C as N
};
