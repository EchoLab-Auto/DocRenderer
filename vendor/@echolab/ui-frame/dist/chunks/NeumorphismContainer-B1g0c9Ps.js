import { defineComponent as d, computed as t, openBlock as c, createBlock as m, resolveDynamicComponent as l, normalizeClass as u, withCtx as p, renderSlot as f } from "vue";
import { u as v } from "./createComponent-jnXBYqCm.js";
import { _ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismContainer.css';const g = /* @__PURE__ */ d({
  __name: "NeumorphismContainer",
  props: {
    mode: { default: "fixed" },
    noPadding: { type: Boolean, default: !1 },
    tag: { default: "div" }
  },
  setup(o) {
    const n = o, { config: a, resolveProp: s } = v(), r = t(() => {
      var e;
      return s(n.mode, (e = a.value.container) == null ? void 0 : e.mode, "fixed");
    }), i = t(() => [
      "nm-container",
      { "nm-container--fluid": r.value === "fluid" },
      { "nm-container--no-padding": n.noPadding }
    ]);
    return (e, C) => (c(), m(l(o.tag), {
      class: u(i.value)
    }, {
      default: p(() => [
        f(e.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), B = /* @__PURE__ */ _(g, [["__scopeId", "data-v-23995fcc"]]);
export {
  B as N
};
