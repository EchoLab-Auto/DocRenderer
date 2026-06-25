import { defineComponent as m, computed as r, provide as N, openBlock as v, createElementBlock as f, normalizeStyle as g, normalizeClass as x, renderSlot as y, inject as b } from "vue";
import { RowGutterKey as _ } from "../composables/injectionKeys.js";
import { u as A } from "./createComponent-jnXBYqCm.js";
import { _ as h } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismCol.css';const B = /* @__PURE__ */ m({
  __name: "NeumorphismRow",
  props: {
    gutter: { default: 0 },
    justify: { default: "start" },
    align: { default: "stretch" },
    wrap: { type: Boolean, default: !0 }
  },
  setup(c) {
    const t = c, { config: l, resolveProp: s } = A(), a = r(() => {
      var e;
      return s(t.gutter, (e = l.value.grid) == null ? void 0 : e.gutter, 0);
    }), i = r(
      () => {
        var e;
        return s(t.justify, (e = l.value.grid) == null ? void 0 : e.justify, "start");
      }
    ), n = r(() => {
      var e;
      return s(t.align, (e = l.value.grid) == null ? void 0 : e.align, "stretch");
    }), o = r(() => {
      var e;
      return s(t.wrap, (e = l.value.grid) == null ? void 0 : e.wrap, !0);
    }), p = r(
      () => Array.isArray(a.value) ? a.value[0] : a.value
    ), d = r(
      () => Array.isArray(a.value) ? a.value[1] : a.value
    );
    N(_, { x: p, y: d });
    const w = {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      "space-between": "space-between",
      "space-around": "space-around",
      "space-evenly": "space-evenly"
    }, $ = {
      start: "flex-start",
      center: "center",
      end: "flex-end",
      stretch: "stretch",
      baseline: "baseline"
    }, j = r(() => {
      const e = p.value, u = d.value;
      if (!(e === 0 && u === 0))
        return {
          marginLeft: e ? `${-e / 2}px` : void 0,
          marginRight: e ? `${-e / 2}px` : void 0,
          rowGap: u ? `${u}px` : void 0
        };
    }), C = r(() => ["nm-row", { "nm-row--nowrap": !o.value }]);
    return (e, u) => (v(), f("div", {
      class: x(C.value),
      style: g([
        j.value,
        { justifyContent: w[i.value], alignItems: $[n.value] }
      ])
    }, [
      y(e.$slots, "default", {}, void 0, !0)
    ], 6));
  }
}), k = /* @__PURE__ */ h(B, [["__scopeId", "data-v-f8bc1d4d"]]), R = /* @__PURE__ */ m({
  __name: "NeumorphismCol",
  props: {
    span: { default: 24 },
    offset: {},
    xs: {},
    sm: {},
    md: {},
    lg: {},
    xl: {},
    xxl: {}
  },
  setup(c) {
    const t = c, l = b(_, {
      x: r(() => 0),
      y: r(() => 0)
    });
    function s(n, o) {
      return o === void 0 || o === "" ? "" : `${n}${o}`;
    }
    const a = r(() => [
      s("nm-col-", t.span),
      s("nm-col-offset-", t.offset),
      s("nm-col-xs-", t.xs),
      s("nm-col-sm-", t.sm),
      s("nm-col-md-", t.md),
      s("nm-col-lg-", t.lg),
      s("nm-col-xl-", t.xl),
      s("nm-col-xxl-", t.xxl),
      "nm-col"
    ].filter(Boolean)), i = r(() => {
      const n = l.x.value, o = l.y.value;
      if (!(n === 0 && o === 0))
        return {
          paddingLeft: n ? `${n / 2}px` : void 0,
          paddingRight: n ? `${n / 2}px` : void 0,
          paddingTop: o ? `${o / 2}px` : void 0,
          paddingBottom: o ? `${o / 2}px` : void 0
        };
    });
    return (n, o) => (v(), f("div", {
      class: x(a.value),
      style: g(i.value)
    }, [
      y(n.$slots, "default", {}, void 0, !0)
    ], 6));
  }
}), z = /* @__PURE__ */ h(R, [["__scopeId", "data-v-c367585e"]]);
export {
  z as N,
  k as a
};
