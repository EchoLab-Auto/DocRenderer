import { defineComponent as _, computed as o, openBlock as s, createElementBlock as u, normalizeClass as f, renderSlot as h, normalizeStyle as N, toDisplayString as y, createCommentVNode as p } from "vue";
import { useLocale as x } from "../composables/useLocale.js";
import { u as S } from "./createComponent-jnXBYqCm.js";
import { _ as B } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismBadge.css';const k = ["aria-label"], w = {
  key: 0,
  class: "nm-badge__text",
  "aria-hidden": "true"
}, C = /* @__PURE__ */ _({
  __name: "NeumorphismBadge",
  props: {
    value: {},
    max: { default: 99 },
    dot: { type: Boolean, default: !1 },
    color: {},
    showZero: { type: Boolean, default: !1 }
  },
  setup(l) {
    const a = l, { config: r, resolveProp: n } = S(), d = o(() => {
      var e;
      return n(a.max, (e = r.value.badge) == null ? void 0 : e.max, 99);
    }), t = o(() => {
      var e;
      return n(a.dot, (e = r.value.badge) == null ? void 0 : e.dot, !1);
    }), c = o(
      () => {
        var e;
        return n(a.showZero, (e = r.value.badge) == null ? void 0 : e.showZero, !1);
      }
    ), i = o(() => {
      if (t.value) return "";
      const e = Number(a.value);
      return isNaN(e) ? String(a.value || "") : e <= 0 && !c.value ? "" : e > d.value ? `${d.value}+` : String(e);
    }), m = o(() => {
      if (t.value) return a.value == null || a.value === "";
      const e = Number(a.value);
      return (isNaN(e) || e <= 0) && !c.value;
    }), { t: v } = x(), b = o(
      () => a.dot ? v("badgeOnline") : v("badgeUnread", { count: i.value })
    ), g = o(() => [
      "nm-badge",
      {
        "nm-badge--dot": t.value,
        "nm-badge--hidden": m.value
      }
    ]);
    return (e, Z) => (s(), u("div", {
      class: f(g.value)
    }, [
      h(e.$slots, "default", {}, void 0, !0),
      m.value ? p("", !0) : (s(), u("sup", {
        key: 0,
        class: f(["nm-badge__content", { "nm-badge__content--dot": t.value }]),
        style: N(l.color ? { backgroundColor: l.color } : void 0),
        "aria-label": b.value
      }, [
        t.value ? p("", !0) : (s(), u("span", w, y(i.value), 1))
      ], 14, k))
    ], 2));
  }
}), $ = /* @__PURE__ */ B(C, [["__scopeId", "data-v-11fb0f9f"]]);
export {
  $ as N
};
