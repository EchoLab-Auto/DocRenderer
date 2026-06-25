import { defineComponent as p, computed as s, openBlock as e, createElementBlock as o, normalizeClass as u, createElementVNode as y, renderSlot as a, createStaticVNode as h, toDisplayString as v, createCommentVNode as c } from "vue";
import { u as f } from "./createComponent-jnXBYqCm.js";
import { _ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismEmpty.css';const g = { class: "nm-empty__image" }, k = ["src", "alt"], w = {
  key: 1,
  class: "nm-empty__illustration",
  viewBox: "0 0 160 160",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": "true"
}, x = {
  key: 0,
  class: "nm-empty__description"
}, C = {
  key: 1,
  class: "nm-empty__footer"
}, N = /* @__PURE__ */ p({
  __name: "NeumorphismEmpty",
  props: {
    image: {},
    description: {},
    size: { default: "medium" }
  },
  setup(t) {
    const n = t, { resolveProp: d } = f(), l = s(() => d(n.size, void 0, "medium")), m = s(() => ["nm-empty", `nm-empty--${l.value}`]);
    return (r, i) => (e(), o("div", {
      class: u(m.value)
    }, [
      y("div", g, [
        a(r.$slots, "image", {}, () => [
          t.image ? (e(), o("img", {
            key: 0,
            src: t.image,
            alt: t.description ?? "",
            class: "nm-empty__img"
          }, null, 8, k)) : (e(), o("svg", w, [...i[0] || (i[0] = [
            h('<rect x="28" y="48" width="104" height="82" rx="4" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3" data-v-124d81a4></rect><path d="M28 48 L80 62 L132 48" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3" data-v-124d81a4></path><rect x="48" y="66" width="64" height="6" rx="2" fill="currentColor" opacity="0.12" data-v-124d81a4></rect><rect x="48" y="80" width="48" height="6" rx="2" fill="currentColor" opacity="0.12" data-v-124d81a4></rect><rect x="48" y="94" width="56" height="6" rx="2" fill="currentColor" opacity="0.12" data-v-124d81a4></rect><circle cx="116" cy="116" r="16" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.25" data-v-124d81a4></circle><line x1="127" y1="127" x2="138" y2="138" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.25" data-v-124d81a4></line>', 7)
          ])]))
        ], !0)
      ]),
      t.description ? (e(), o("div", x, v(t.description), 1)) : c("", !0),
      r.$slots.default ? (e(), o("div", C, [
        a(r.$slots, "default", {}, void 0, !0)
      ])) : c("", !0)
    ], 2));
  }
}), $ = /* @__PURE__ */ _(N, [["__scopeId", "data-v-124d81a4"]]);
export {
  $ as N
};
