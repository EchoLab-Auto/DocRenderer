import { defineComponent as Z, computed as p, ref as N, openBlock as a, createElementBlock as s, unref as t, normalizeClass as h, createElementVNode as l, Fragment as f, renderList as z, createCommentVNode as d, createBlock as ee, withCtx as A, withModifiers as w, toDisplayString as m } from "vue";
import { useMenu as ne } from "../composables/useMenu.js";
import { u as oe } from "./createComponent-jnXBYqCm.js";
import { useTheme as ae } from "../composables/useTheme.js";
import { N as te } from "./NeumorphismPopover-RB48cpPq.js";
import { _ as se } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismNavMenu.css';const ie = ["aria-orientation"], le = {
  key: 0,
  class: "nm-nav-menu__divider",
  role: "separator"
}, de = ["aria-disabled", "aria-expanded", "tabindex", "onClick", "onMouseenter", "onMouseleave"], re = { class: "nm-nav-menu__item-content" }, ue = {
  key: 0,
  class: "nm-nav-menu__item-icon",
  "aria-hidden": "true"
}, me = { class: "nm-nav-menu__item-label" }, ve = {
  key: 0,
  class: "nm-nav-menu__indicator",
  "aria-hidden": "true"
}, ce = ["aria-label", "onMouseleave"], _e = {
  key: 0,
  class: "nm-nav-menu__dropdown-divider",
  role: "separator"
}, pe = ["aria-disabled", "tabindex", "onClick", "onMouseenter"], he = {
  key: 0,
  class: "nm-nav-menu__dropdown-item-icon",
  "aria-hidden": "true"
}, ke = { class: "nm-nav-menu__dropdown-item-label" }, be = ["aria-disabled", "aria-haspopup", "aria-expanded", "tabindex", "onClick", "onMouseenter", "onMouseleave"], fe = { class: "nm-nav-menu__item-content" }, ye = {
  key: 0,
  class: "nm-nav-menu__item-icon",
  "aria-hidden": "true"
}, we = { class: "nm-nav-menu__item-label" }, ge = {
  key: 0,
  class: "nm-nav-menu__indicator",
  "aria-hidden": "true"
}, xe = ["aria-label"], Me = ["aria-disabled", "tabindex", "onClick", "onMouseenter"], Ce = { class: "nm-nav-menu__item-content" }, $e = {
  key: 0,
  class: "nm-nav-menu__item-icon",
  "aria-hidden": "true"
}, Ne = { class: "nm-nav-menu__item-label" }, ze = {
  key: 0,
  class: "nm-nav-menu__empty"
}, Ie = /* @__PURE__ */ Z({
  __name: "NeumorphismNavMenu",
  props: {
    items: { default: () => [] },
    defaultActive: { default: void 0 },
    mode: { default: "horizontal" },
    showIndicator: { type: Boolean, default: !0 },
    theme: { default: void 0 },
    size: { default: "medium" }
  },
  emits: ["select", "item-click"],
  setup(g, { emit: j }) {
    const v = g, I = j, { resolveProp: x } = oe(), { isDark: D } = ae(), F = p(() => v.theme ? v.theme : D.value ? "dark" : "light"), r = p(
      () => x(v.mode, void 0, "horizontal")
    ), q = p(
      () => x(v.size, void 0, "medium")
    ), M = p(() => x(v.showIndicator, void 0, !0)), G = N(v.defaultActive ?? null), H = N([]), {
      handleKeydown: c,
      handleItemClick: y,
      handleItemEnter: C,
      isExpanded: k,
      isActive: b,
      expand: J,
      collapse: $
    } = ne({
      items: p(() => v.items),
      mode: r,
      activeKey: G,
      expandedKeys: H,
      onSelect: (o) => {
        I("select", o), I("item-click", o);
      }
    });
    let u = null;
    function K(o) {
      u && (clearTimeout(u), u = null), C(o);
    }
    function E(o) {
      var i;
      r.value === "horizontal" && ((i = o.children) != null && i.length) && (u = setTimeout(() => {
        $(o.key);
      }, 250));
    }
    function O() {
      u && (clearTimeout(u), u = null);
    }
    function Q(o) {
      u = setTimeout(() => {
        $(o.key);
      }, 250);
    }
    const U = N({});
    function W(o, i) {
      U.value[o] = i;
    }
    function X(o, i) {
      i ? J(o.key) : $(o.key);
    }
    const Y = p(() => [
      "nm-nav-menu",
      `nm-nav-menu--${r.value}`,
      `nm-nav-menu--${q.value}`,
      `nm-nav-menu--theme-${F.value}`,
      {
        "nm-nav-menu--indicator": M.value
      }
    ]);
    function S(o) {
      return [
        "nm-nav-menu__item",
        {
          "nm-nav-menu__item--active": b(o.key),
          "nm-nav-menu__item--disabled": o.disabled,
          "nm-nav-menu__item--divided": o.divided,
          "nm-nav-menu__item--has-children": o.children && o.children.length > 0,
          "nm-nav-menu__item--expanded": k(o.key)
        }
      ];
    }
    return (o, i) => (a(), s("nav", {
      class: h(Y.value),
      role: "navigation",
      "aria-label": "Navigation menu",
      onKeydown: i[2] || (i[2] = //@ts-ignore
      (...e) => t(c) && t(c)(...e))
    }, [
      l("ul", {
        class: "nm-nav-menu__list",
        role: "menubar",
        "aria-orientation": r.value
      }, [
        (a(!0), s(f, null, z(g.items, (e) => {
          var T, B, V, L, P, R;
          return a(), s(f, {
            key: e.key
          }, [
            e.divided && r.value === "vertical" ? (a(), s("li", le)) : d("", !0),
            (T = e.children) != null && T.length && r.value === "horizontal" ? (a(), ee(te, {
              key: `${e.key}-popover`,
              ref_for: !0,
              ref: (n) => W(e.key, n),
              position: "bottom",
              trigger: "hover",
              offset: 4,
              "show-arrow": !1,
              disabled: e.disabled,
              onVisibleChange: (n) => X(e, n)
            }, {
              content: A(() => [
                l("div", {
                  class: "nm-nav-menu__dropdown",
                  role: "menu",
                  "aria-label": e.label,
                  onMouseenter: O,
                  onMouseleave: (n) => Q(e),
                  onKeydown: i[0] || (i[0] = //@ts-ignore
                  (...n) => t(c) && t(c)(...n))
                }, [
                  (a(!0), s(f, null, z(e.children, (n) => (a(), s(f, {
                    key: n.key
                  }, [
                    n.divided ? (a(), s("div", _e)) : d("", !0),
                    l("div", {
                      class: h([
                        "nm-nav-menu__dropdown-item",
                        {
                          "nm-nav-menu__dropdown-item--active": t(b)(n.key),
                          "nm-nav-menu__dropdown-item--disabled": n.disabled,
                          "nm-nav-menu__dropdown-item--divided": n.divided
                        }
                      ]),
                      role: "menuitem",
                      "aria-disabled": n.disabled ?? !1,
                      tabindex: n.disabled ? -1 : 0,
                      onClick: w((_) => t(y)(n), ["stop"]),
                      onMouseenter: (_) => t(C)(n)
                    }, [
                      n.icon ? (a(), s("span", he, m(n.icon), 1)) : d("", !0),
                      l("span", ke, m(n.label), 1)
                    ], 42, pe)
                  ], 64))), 128))
                ], 40, ce)
              ]),
              default: A(() => [
                l("li", {
                  class: h(S(e)),
                  role: "menuitem",
                  "aria-disabled": e.disabled ?? !1,
                  "aria-haspopup": "menu",
                  "aria-expanded": t(k)(e.key),
                  tabindex: e.disabled ? -1 : 0,
                  onClick: w((n) => {
                    var _;
                    return (_ = e.children) != null && _.length ? void 0 : t(y)(e);
                  }, ["stop"]),
                  onMouseenter: (n) => K(e),
                  onMouseleave: (n) => E(e)
                }, [
                  l("div", re, [
                    e.icon ? (a(), s("span", ue, m(e.icon), 1)) : d("", !0),
                    l("span", me, m(e.label), 1),
                    i[3] || (i[3] = l("span", {
                      class: "nm-nav-menu__dropdown-arrow",
                      "aria-hidden": "true"
                    }, [
                      l("svg", {
                        width: "10",
                        height: "10",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      }, [
                        l("path", { d: "M6 9l6 6 6-6" })
                      ])
                    ], -1))
                  ]),
                  M.value && t(b)(e.key) ? (a(), s("span", ve)) : d("", !0)
                ], 42, de)
              ]),
              _: 2
            }, 1032, ["disabled", "onVisibleChange"])) : d("", !0),
            !((B = e.children) != null && B.length) || r.value === "vertical" ? (a(), s("li", {
              key: 2,
              class: h(S(e)),
              role: "menuitem",
              "aria-disabled": e.disabled ?? !1,
              "aria-haspopup": (V = e.children) != null && V.length ? "menu" : void 0,
              "aria-expanded": (L = e.children) != null && L.length ? t(k)(e.key) : void 0,
              tabindex: e.disabled ? -1 : 0,
              onClick: w((n) => t(y)(e), ["stop"]),
              onMouseenter: (n) => K(e),
              onMouseleave: (n) => E(e),
              onKeydown: i[1] || (i[1] = //@ts-ignore
              (...n) => t(c) && t(c)(...n))
            }, [
              l("div", fe, [
                e.icon ? (a(), s("span", ye, m(e.icon), 1)) : d("", !0),
                l("span", we, m(e.label), 1),
                (P = e.children) != null && P.length && r.value === "vertical" ? (a(), s("span", {
                  key: 1,
                  class: h(["nm-nav-menu__expand-icon", { "nm-nav-menu__expand-icon--expanded": t(k)(e.key) }]),
                  "aria-hidden": "true"
                }, [...i[4] || (i[4] = [
                  l("svg", {
                    width: "12",
                    height: "12",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  }, [
                    l("path", { d: "M9 18l6-6-6-6" })
                  ], -1)
                ])], 2)) : d("", !0)
              ]),
              M.value && r.value === "horizontal" && t(b)(e.key) ? (a(), s("span", ge)) : d("", !0),
              (R = e.children) != null && R.length && r.value === "vertical" && t(k)(e.key) ? (a(), s("ul", {
                key: 1,
                class: "nm-nav-menu__submenu",
                role: "menu",
                "aria-label": e.label
              }, [
                (a(!0), s(f, null, z(e.children, (n) => (a(), s("li", {
                  key: n.key,
                  class: h(["nm-nav-menu__item nm-nav-menu__item--sub", {
                    "nm-nav-menu__item--active": t(b)(n.key),
                    "nm-nav-menu__item--disabled": n.disabled
                  }]),
                  role: "menuitem",
                  "aria-disabled": n.disabled ?? !1,
                  tabindex: n.disabled ? -1 : 0,
                  onClick: w((_) => t(y)(n), ["stop"]),
                  onMouseenter: (_) => t(C)(n)
                }, [
                  l("div", Ce, [
                    n.icon ? (a(), s("span", $e, m(n.icon), 1)) : d("", !0),
                    l("span", Ne, m(n.label), 1)
                  ])
                ], 42, Me))), 128))
              ], 8, xe)) : d("", !0)
            ], 42, be)) : d("", !0)
          ], 64);
        }), 128)),
        g.items.length === 0 ? (a(), s("li", ze, "No navigation items")) : d("", !0)
      ], 8, ie)
    ], 34));
  }
}), Le = /* @__PURE__ */ se(Ie, [["__scopeId", "data-v-4432c2e6"]]);
export {
  Le as N
};
