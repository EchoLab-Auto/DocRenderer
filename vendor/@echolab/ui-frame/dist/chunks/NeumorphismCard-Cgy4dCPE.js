import { defineComponent as _, computed as r, openBlock as s, createElementBlock as t, normalizeClass as f, renderSlot as d, createCommentVNode as i, createElementVNode as h } from "vue";
import { u as g } from "./createComponent-jnXBYqCm.js";
import { _ as b } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismCard.css';const N = {
  key: 0,
  class: "nm-card__header"
}, $ = { class: "nm-card__body" }, k = {
  key: 1,
  class: "nm-card__footer"
}, y = /* @__PURE__ */ _({
  __name: "NeumorphismCard",
  props: {
    elevation: {},
    variant: {},
    depth: {},
    radius: { default: "large" },
    noPadding: { type: Boolean, default: !1 },
    hoverable: { type: [Boolean, String], default: !1 }
  },
  setup(u) {
    const c = {
      shallow: 1,
      medium: 2,
      deep: 3,
      "very-deep": 4
    }, o = u, { config: n, resolveProp: l } = g(), m = r(() => {
      var e;
      return l(o.radius, (e = n.value.card) == null ? void 0 : e.radius, "large");
    }), a = r(
      () => {
        var e;
        return l(o.hoverable, (e = n.value.card) == null ? void 0 : e.hoverable, !1);
      }
    ), v = r(() => {
      if (o.elevation !== void 0) return o.elevation;
      const e = c[o.depth ?? "medium"];
      return o.variant === "pressed" ? -e : e;
    }), p = r(() => [
      "nm-card",
      `nm-card--elevation-${v.value}`,
      `nm-card--radius-${m.value}`,
      {
        "nm-card--no-padding": o.noPadding,
        "nm-card--hoverable": !!a.value,
        "nm-card--hover-bulge": a.value === !0 || a.value === "bulge",
        "nm-card--hover-sink": a.value === "sink"
      }
    ]);
    return (e, C) => (s(), t("div", {
      class: f(p.value)
    }, [
      e.$slots.header ? (s(), t("div", N, [
        d(e.$slots, "header", {}, void 0, !0)
      ])) : i("", !0),
      h("div", $, [
        d(e.$slots, "default", {}, void 0, !0)
      ]),
      e.$slots.footer ? (s(), t("div", k, [
        d(e.$slots, "footer", {}, void 0, !0)
      ])) : i("", !0)
    ], 2));
  }
}), S = /* @__PURE__ */ b(y, [["__scopeId", "data-v-af9ed606"]]);
export {
  S as N
};
