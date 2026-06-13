import { defineComponent as P, ref as w, computed as m, openBlock as u, createElementBlock as y, normalizeClass as C, createElementVNode as n, createVNode as d, unref as t, toDisplayString as x, withCtx as l, watch as A, createBlock as K, createTextVNode as k, createCommentVNode as E } from "vue";
import { nodeToTreeData as F } from "@prodoc/core";
import { NeumorphismTabs as G, NeumorphismCard as T, NeumorphismTextarea as H, useTheme as J, NeumorphismLayout as Q, NeumorphismContainer as W, NeumorphismTag as $, NeumorphismButton as M, NeumorphismDivider as X, NeumorphismTree as Y, NeumorphismThemeToggle as Z } from "@echolab/ui-frame";
import { MarkdownRenderer as ee } from "@prodoc/renderer";
const oe = { class: "prodoc-editor-toolbar" }, te = { class: "editor-stat" }, ae = /* @__PURE__ */ P({
  __name: "MarkdownEditor",
  props: {
    value: {},
    className: { default: "" }
  },
  emits: ["change", "docLink"],
  setup(h, { emit: _ }) {
    const s = h, c = _, a = w("split");
    function g(N) {
      c("docLink", N);
    }
    const b = [
      { key: "edit", label: "✏️ 编辑" },
      { key: "split", label: "⬌ 分栏" },
      { key: "preview", label: "👁 预览" }
    ], V = m(() => s.value.length), z = m(() => s.value.split(`
`).length);
    return (N, p) => (u(), y("div", {
      class: C(`prodoc-markdown-editor ${s.className}`)
    }, [
      n("div", oe, [
        d(t(G), {
          modelValue: a.value,
          "onUpdate:modelValue": p[0] || (p[0] = (v) => a.value = v),
          tabs: b,
          size: "small",
          class: "prodoc-editor-mode-tabs"
        }, null, 8, ["modelValue"]),
        n("span", te, x(z.value) + " 行 · " + x(V.value) + " 字", 1)
      ]),
      n("div", {
        class: C(["prodoc-editor-panels", `prodoc-mode-${a.value}`])
      }, [
        n("div", {
          class: C(["prodoc-editor-panel prodoc-editor-panel--edit", { hidden: a.value === "preview" }])
        }, [
          d(t(T), {
            elevation: -3,
            "no-padding": "",
            class: "edit-card"
          }, {
            default: l(() => [
              d(t(H), {
                class: "prodoc-editor-textarea",
                "model-value": s.value,
                placeholder: "在此输入 Markdown...",
                "auto-resize": !1,
                "show-count": !1,
                "onUpdate:modelValue": p[1] || (p[1] = (v) => c("change", v))
              }, null, 8, ["model-value"])
            ]),
            _: 1
          })
        ], 2),
        n("div", {
          class: C(["prodoc-editor-panel prodoc-editor-panel--preview", { hidden: a.value === "edit" }])
        }, [
          d(t(T), {
            elevation: -2,
            "no-padding": "",
            class: "preview-card"
          }, {
            default: l(() => [
              d(t(ee), {
                content: s.value,
                "show-toc": !1,
                onDocLink: g
              }, null, 8, ["content"])
            ]),
            _: 1
          })
        ], 2)
      ], 2)
    ], 2));
  }
}), S = (h, _) => {
  const s = h.__vccOpts || h;
  for (const [c, a] of _)
    s[c] = a;
  return s;
}, le = /* @__PURE__ */ S(ae, [["__scopeId", "data-v-462d1253"]]), de = { class: "prodoc-editor-actions" }, se = {
  key: 0,
  class: "prodoc-editor-sider"
}, ne = {
  key: 1,
  class: "prodoc-editor-sider-collapsed"
}, re = {
  key: 0,
  class: "prodoc-editor-layout"
}, ie = { class: "prodoc-editor-header" }, ue = { class: "prodoc-editor-title" }, ce = { class: "prodoc-editor-meta" }, pe = { class: "prodoc-editor-body" }, ve = {
  key: 1,
  class: "prodoc-editor-empty"
}, me = /* @__PURE__ */ P({
  __name: "DocEditor",
  props: {
    root: {},
    initialPath: {},
    className: { default: "" }
  },
  emits: ["save", "docLink"],
  setup(h, { emit: _ }) {
    const s = h, c = _, a = w(s.initialPath ?? ""), g = w({}), b = w([]), { theme: V, setTheme: z } = J(), N = m({
      get: () => V.value,
      set: (o) => z(o)
    }), p = m(() => s.root.children.map(F)), v = w(a.value ? [a.value] : []);
    A(a, (o) => {
      v.value = o ? [o] : [];
    });
    function U(o, e = s.root) {
      if (e.path === o) return e;
      for (const f of e.children) {
        const i = U(o, f);
        if (i) return i;
      }
    }
    const I = m(() => a.value ? U(a.value) : void 0), r = m(() => I.value || s.root.children[0]);
    function B(o) {
      return g.value[o.path] ?? o.content;
    }
    function j(o) {
      r.value && (g.value[r.value.path] = o);
    }
    function L() {
      r.value && c("save", r.value.path, B(r.value));
    }
    function O(o) {
      a.value = o;
    }
    function R(o) {
      a.value = o, c("docLink", o);
    }
    const D = m(() => {
      if (!r.value) return !1;
      const o = g.value[r.value.path];
      return o !== void 0 && o !== r.value.content;
    });
    function q(o) {
      (o.ctrlKey || o.metaKey) && o.key === "s" && (o.preventDefault(), L());
    }
    return (o, e) => (u(), y("div", {
      class: C(`prodoc-doc-editor ${s.className}`),
      onKeydown: q
    }, [
      d(t(Q), {
        "show-header": "",
        "show-sider": "",
        "sider-width": 280,
        collapsible: ""
      }, {
        "header-left": l(() => [...e[4] || (e[4] = [
          n("span", { class: "prodoc-editor-brand" }, "📝 ProDoc Editor", -1)
        ])]),
        "header-center": l(() => [
          d(t(Z), {
            modelValue: N.value,
            "onUpdate:modelValue": e[0] || (e[0] = (f) => N.value = f),
            size: "small"
          }, null, 8, ["modelValue"])
        ]),
        "header-right": l(() => [
          n("div", de, [
            D.value ? (u(), K(t($), {
              key: 0,
              variant: "warning",
              size: "small"
            }, {
              default: l(() => [...e[5] || (e[5] = [
                k(" 未保存 ", -1)
              ])]),
              _: 1
            })) : E("", !0),
            d(t(M), {
              variant: "raised",
              size: "small",
              disabled: !D.value,
              onClick: L
            }, {
              default: l(() => [...e[6] || (e[6] = [
                k(" 💾 保存 ", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        sider: l(({ collapsed: f }) => [
          f ? (u(), y("div", ne, "📝")) : (u(), y("div", se, [
            d(t(Y), {
              data: p.value,
              "selected-keys": v.value,
              "onUpdate:selectedKeys": e[1] || (e[1] = (i) => v.value = i),
              "expanded-keys": b.value,
              "onUpdate:expandedKeys": e[2] || (e[2] = (i) => b.value = i),
              "show-search": "",
              "search-placeholder": "搜索文档...",
              onNodeSelect: O
            }, null, 8, ["data", "selected-keys", "expanded-keys"])
          ]))
        ]),
        default: l(() => [
          d(t(W), {
            "no-padding": "",
            class: "prodoc-editor-container"
          }, {
            default: l(() => [
              d(t(T), {
                elevation: -3,
                "no-padding": "",
                class: "prodoc-editor-card"
              }, {
                default: l(() => [
                  r.value ? (u(), y("div", re, [
                    n("header", ie, [
                      n("div", null, [
                        n("h1", ue, x(r.value.title), 1),
                        n("div", ce, [
                          r.value.path ? (u(), K(t($), {
                            key: 0,
                            variant: "primary",
                            size: "small",
                            rounded: ""
                          }, {
                            default: l(() => [
                              k(x(r.value.path), 1)
                            ]),
                            _: 1
                          })) : E("", !0),
                          D.value ? (u(), K(t($), {
                            key: 1,
                            variant: "warning",
                            size: "small"
                          }, {
                            default: l(() => [...e[7] || (e[7] = [
                              k(" 已修改 ", -1)
                            ])]),
                            _: 1
                          })) : E("", !0)
                        ])
                      ]),
                      d(t(M), {
                        variant: "raised",
                        size: "small",
                        disabled: !D.value,
                        onClick: L
                      }, {
                        default: l(() => [...e[8] || (e[8] = [
                          k(" 💾 保存 ", -1)
                        ])]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    d(t(X)),
                    n("div", pe, [
                      d(le, {
                        value: B(r.value),
                        onChange: j,
                        onDocLink: R
                      }, null, 8, ["value"])
                    ])
                  ])) : (u(), y("div", ve, [
                    d(t(T), {
                      elevation: 2,
                      hoverable: "bulge",
                      class: "prodoc-editor-empty-icon"
                    }, {
                      default: l(() => [...e[9] || (e[9] = [
                        n("span", { class: "prodoc-editor-empty-emoji" }, "📂", -1)
                      ])]),
                      _: 1
                    }),
                    e[11] || (e[11] = n("p", null, "请从左侧选择一篇文档进行编辑", -1)),
                    d(t(M), {
                      variant: "raised",
                      size: "small",
                      onClick: e[3] || (e[3] = (f) => {
                        var i;
                        return a.value = ((i = p.value[0]) == null ? void 0 : i.key) ?? "";
                      })
                    }, {
                      default: l(() => [...e[10] || (e[10] = [
                        k(" 打开第一篇 ", -1)
                      ])]),
                      _: 1
                    })
                  ]))
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      })
    ], 34));
  }
}), _e = /* @__PURE__ */ S(me, [["__scopeId", "data-v-e131ddc4"]]);
export {
  _e as DocEditor,
  le as MarkdownEditor
};
//# sourceMappingURL=index.js.map
