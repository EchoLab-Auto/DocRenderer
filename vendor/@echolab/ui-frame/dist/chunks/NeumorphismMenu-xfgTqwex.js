import { defineComponent as Y, computed as c, ref as D, openBlock as t, createElementBlock as o, unref as l, normalizeClass as v, createElementVNode as u, Fragment as h, renderList as g, createCommentVNode as i, withModifiers as N, toDisplayString as k, createBlock as Z } from "vue";
import { useMenu as ee } from "../composables/useMenu.js";
import { u as ne } from "./createComponent-jnXBYqCm.js";
import { useTheme as te } from "../composables/useTheme.js";
import { N as oe } from "./NeumorphismTooltip-DEac8yVH.js";
import { _ as se } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismMenu.css';const ae = ["role"], le = {
  class: "nm-menu__list",
  role: "group"
}, ie = {
  key: 0,
  class: "nm-menu__divider",
  role: "separator",
  "aria-hidden": !0
}, de = ["aria-disabled", "aria-expanded", "aria-haspopup", "tabindex", "onClick", "onMouseenter", "onMouseleave", "onKeydown"], ue = { class: "nm-menu__item-content" }, re = {
  key: 0,
  class: "nm-menu__item-icon",
  "aria-hidden": "true"
}, me = {
  key: 1,
  class: "nm-menu__item-label"
}, ce = {
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, _e = {
  key: 0,
  d: "M9 18l6-6-6-6"
}, pe = {
  key: 1,
  d: "M6 9l6 6 6-6"
}, ve = ["aria-label"], he = {
  key: 0,
  class: "nm-menu__divider",
  role: "separator"
}, ke = ["aria-disabled", "aria-expanded", "aria-haspopup", "tabindex", "onClick", "onMouseenter", "onMouseleave", "onKeydown"], be = { class: "nm-menu__item-content" }, ye = {
  key: 0,
  class: "nm-menu__item-icon",
  "aria-hidden": "true"
}, fe = { class: "nm-menu__item-label" }, xe = {
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Me = {
  key: 0,
  d: "M9 18l6-6-6-6"
}, we = {
  key: 1,
  d: "M6 9l6 6 6-6"
}, Ce = ["aria-label"], Ke = {
  key: 0,
  class: "nm-menu__divider",
  role: "separator"
}, $e = ["aria-disabled", "tabindex", "onClick", "onMouseenter", "onMouseleave", "onKeydown"], ge = { class: "nm-menu__item-content" }, Ne = {
  key: 0,
  class: "nm-menu__item-icon",
  "aria-hidden": "true"
}, ze = { class: "nm-menu__item-label" }, Ee = {
  key: 0,
  class: "nm-menu__empty"
}, Ie = /* @__PURE__ */ Y({
  __name: "NeumorphismMenu",
  props: {
    items: { default: () => [] },
    mode: { default: "vertical" },
    defaultActive: { default: void 0 },
    defaultExpanded: { default: () => [] },
    collapsed: { type: Boolean, default: !1 },
    selectable: { type: Boolean, default: !0 },
    theme: { default: void 0 },
    size: { default: "medium" }
  },
  emits: ["select", "item-click"],
  setup(r, { emit: V }) {
    const d = r, z = V, { resolveProp: f } = ne(), { isDark: F } = te(), P = c(() => d.theme ? d.theme : F.value ? "dark" : "light"), _ = c(
      () => f(d.mode, void 0, "vertical")
    ), q = c(
      () => f(d.size, void 0, "medium")
    ), G = c(() => f(d.selectable, void 0, !0)), H = D(d.defaultActive ?? null), J = D([...d.defaultExpanded]), {
      handleKeydown: x,
      handleItemClick: M,
      handleItemEnter: O,
      isExpanded: m,
      isActive: w,
      collapse: Q
    } = ee({
      items: c(() => d.items),
      mode: _,
      activeKey: H,
      expandedKeys: J,
      onSelect: (a) => {
        z("select", a), z("item-click", a);
      }
    });
    let b = null;
    function C(a) {
      b && (clearTimeout(b), b = null), O(a);
    }
    function K(a) {
      var p;
      _.value === "horizontal" && ((p = a.children) != null && p.length) && (b = setTimeout(() => {
        Q(a.key);
      }, 200));
    }
    const U = c(() => [
      "nm-menu",
      `nm-menu--${_.value}`,
      `nm-menu--${q.value}`,
      `nm-menu--theme-${P.value}`,
      {
        "nm-menu--collapsed": d.collapsed,
        "nm-menu--selectable": G.value
      }
    ]), W = c(() => _.value === "horizontal" ? "menubar" : "menu");
    function X(a) {
      return [
        "nm-menu__item",
        {
          "nm-menu__item--active": w(a.key),
          "nm-menu__item--disabled": a.disabled,
          "nm-menu__item--divided": a.divided,
          "nm-menu__item--has-children": a.children && a.children.length > 0,
          "nm-menu__item--expanded": m(a.key)
        }
      ];
    }
    function $(a, p) {
      p.disabled || x(a);
    }
    const E = c(() => [
      "nm-menu__expand-icon",
      {
        "nm-menu__expand-icon--expanded": !1,
        "nm-menu__expand-icon--horizontal": _.value === "horizontal"
      }
    ]);
    return (a, p) => (t(), o("nav", {
      class: v(U.value),
      role: W.value,
      "aria-label": "Menu",
      onKeydown: p[0] || (p[0] = //@ts-ignore
      (...n) => l(x) && l(x)(...n))
    }, [
      u("ul", le, [
        (t(!0), o(h, null, g(r.items, (n) => {
          var I, B, S, T;
          return t(), o(h, {
            key: n.key
          }, [
            n.divided ? (t(), o("li", ie)) : i("", !0),
            u("li", {
              class: v(X(n)),
              role: "menuitem",
              "aria-disabled": n.disabled ?? !1,
              "aria-expanded": (I = n.children) != null && I.length ? l(m)(n.key) : void 0,
              "aria-haspopup": (B = n.children) != null && B.length ? "menu" : void 0,
              tabindex: n.disabled ? -1 : 0,
              onClick: N((e) => l(M)(n), ["stop"]),
              onMouseenter: (e) => C(n),
              onMouseleave: (e) => K(n),
              onKeydown: (e) => $(e, n)
            }, [
              u("div", ue, [
                n.icon ? (t(), o("span", re, k(n.icon), 1)) : i("", !0),
                !r.collapsed || !n.icon ? (t(), o("span", me, k(n.label), 1)) : i("", !0),
                (S = n.children) != null && S.length && !r.collapsed ? (t(), o("span", {
                  key: 2,
                  class: v([
                    ...E.value,
                    { "nm-menu__expand-icon--expanded": l(m)(n.key) }
                  ]),
                  "aria-hidden": "true"
                }, [
                  (t(), o("svg", ce, [
                    _.value === "vertical" ? (t(), o("path", _e)) : (t(), o("path", pe))
                  ]))
                ], 2)) : i("", !0)
              ]),
              (T = n.children) != null && T.length && l(m)(n.key) && !r.collapsed ? (t(), o("ul", {
                key: 0,
                class: "nm-menu__submenu",
                role: "menu",
                "aria-label": n.label
              }, [
                (t(!0), o(h, null, g(n.children, (e) => {
                  var A, L, R, j;
                  return t(), o(h, {
                    key: e.key
                  }, [
                    e.divided ? (t(), o("li", he)) : i("", !0),
                    u("li", {
                      class: v([
                        "nm-menu__item",
                        "nm-menu__item--sub",
                        {
                          "nm-menu__item--active": l(w)(e.key),
                          "nm-menu__item--disabled": e.disabled,
                          "nm-menu__item--has-children": e.children && e.children.length > 0,
                          "nm-menu__item--expanded": l(m)(e.key)
                        }
                      ]),
                      role: "menuitem",
                      "aria-disabled": e.disabled ?? !1,
                      "aria-expanded": (A = e.children) != null && A.length ? l(m)(e.key) : void 0,
                      "aria-haspopup": (L = e.children) != null && L.length ? "menu" : void 0,
                      tabindex: e.disabled ? -1 : 0,
                      onClick: N((s) => l(M)(e), ["stop"]),
                      onMouseenter: (s) => C(e),
                      onMouseleave: (s) => K(e),
                      onKeydown: (s) => $(s, e)
                    }, [
                      u("div", be, [
                        e.icon ? (t(), o("span", ye, k(e.icon), 1)) : i("", !0),
                        u("span", fe, k(e.label), 1),
                        (R = e.children) != null && R.length ? (t(), o("span", {
                          key: 1,
                          class: v([
                            ...E.value,
                            { "nm-menu__expand-icon--expanded": l(m)(e.key) }
                          ]),
                          "aria-hidden": "true"
                        }, [
                          (t(), o("svg", xe, [
                            _.value === "vertical" ? (t(), o("path", Me)) : (t(), o("path", we))
                          ]))
                        ], 2)) : i("", !0)
                      ]),
                      (j = e.children) != null && j.length && l(m)(e.key) ? (t(), o("ul", {
                        key: 0,
                        class: "nm-menu__submenu",
                        role: "menu",
                        "aria-label": e.label
                      }, [
                        (t(!0), o(h, null, g(e.children, (s) => (t(), o(h, {
                          key: s.key
                        }, [
                          s.divided ? (t(), o("li", Ke)) : i("", !0),
                          u("li", {
                            class: v([
                              "nm-menu__item",
                              "nm-menu__item--sub",
                              "nm-menu__item--sub-deep",
                              {
                                "nm-menu__item--active": l(w)(s.key),
                                "nm-menu__item--disabled": s.disabled
                              }
                            ]),
                            role: "menuitem",
                            "aria-disabled": s.disabled ?? !1,
                            tabindex: s.disabled ? -1 : 0,
                            onClick: N((y) => l(M)(s), ["stop"]),
                            onMouseenter: (y) => C(s),
                            onMouseleave: (y) => K(s),
                            onKeydown: (y) => $(y, s)
                          }, [
                            u("div", ge, [
                              s.icon ? (t(), o("span", Ne, k(s.icon), 1)) : i("", !0),
                              u("span", ze, k(s.label), 1)
                            ])
                          ], 42, $e)
                        ], 64))), 128))
                      ], 8, Ce)) : i("", !0)
                    ], 42, ke)
                  ], 64);
                }), 128))
              ], 8, ve)) : i("", !0),
              r.collapsed && n.icon ? (t(), Z(oe, {
                key: 1,
                content: n.label,
                position: "right",
                delay: 300,
                disabled: !r.collapsed
              }, null, 8, ["content", "disabled"])) : i("", !0)
            ], 42, de)
          ], 64);
        }), 128)),
        r.items.length === 0 ? (t(), o("li", Ee, "No menu items")) : i("", !0)
      ])
    ], 42, ae));
  }
}), je = /* @__PURE__ */ se(Ie, [["__scopeId", "data-v-2ebaa4cf"]]);
export {
  je as N
};
