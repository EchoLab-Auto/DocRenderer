import { ref as S, computed as M, watch as Q, defineComponent as ee, nextTick as fe, onBeforeUnmount as He, openBlock as $, createElementBlock as N, normalizeClass as A, createElementVNode as p, normalizeStyle as Pe, createVNode as y, withCtx as g, Fragment as ae, renderList as ve, withModifiers as G, toDisplayString as H, createCommentVNode as P, Transition as ge, unref as _, createBlock as O, createTextVNode as V, isRef as U } from "vue";
import { useTheme as Ve } from "../composables/useTheme.js";
import { N as ye } from "../chunks/NeumorphismLayout-C7hoaRIo.js";
import { N as J } from "../chunks/NeumorphismButton-CiIrdqlV.js";
import { N as F } from "../chunks/NeumorphismCard-Cgy4dCPE.js";
import { N as ke } from "../chunks/NeumorphismThemeToggle-B-lky48G.js";
import { N as be } from "../chunks/NeumorphismTree-C5jKWadX.js";
import { N as we } from "../chunks/NeumorphismDivider-CjDyku2C.js";
import { N as Z } from "../chunks/NeumorphismTag-D-HO-n7l.js";
import { N as $e } from "../chunks/NeumorphismContainer-B1g0c9Ps.js";
import { marked as re } from "marked";
import { N as Fe } from "../chunks/NeumorphismBadge-Br8ESUFf.js";
import { generateId as Ie } from "../utils/index.js";
import { _ as ce } from "../chunks/_plugin-vue_export-helper-CHgC5LLL.js";
import { N as qe } from "../chunks/NeumorphismTabs-DhV7RpfS.js";
import { N as Be } from "../chunks/NeumorphismTextarea-hf4f9EM1.js";
import '../index.css';function Ke(r) {
  var l;
  const s = ((l = r.path) == null ? void 0 : l.toLowerCase()) || "";
  return s.includes("api") ? "🔌" : s.includes("guide") ? "📖" : s.includes("config") ? "⚙️" : s.includes("example") ? "💡" : s.includes("install") ? "📦" : s.includes("changelog") ? "📝" : s.includes("faq") ? "❓" : "📄";
}
function _e(r) {
  const s = r.children.length > 0 ? "📁" : Ke(r);
  return {
    key: r.path,
    label: r.title,
    icon: s,
    children: r.children.map(_e)
  };
}
function Oe(r) {
  const s = /* @__PURE__ */ new Map();
  function l(d) {
    s.set(d.path, d);
    for (const i of d.children)
      l(i);
  }
  l(r);
  const m = /* @__PURE__ */ new Map();
  function c(d) {
    m.set(d.id, d);
    for (const i of d.children)
      c(i);
  }
  return c(r), {
    root: r,
    nodeMap: s,
    findByPath(d) {
      return s.get(d);
    },
    findById(d) {
      return m.get(d);
    }
  };
}
function jt(r) {
  const s = [];
  function l(m) {
    s.push(m);
    for (const c of m.children)
      l(c);
  }
  return l(r), s;
}
function Gt(r, s) {
  const l = [];
  function m(c, d, i) {
    if (c.id === d)
      return l.push(...i), !0;
    for (const h of c.children)
      if (m(h, d, [...i, c]))
        return !0;
    return !1;
  }
  return m(s, r.id, []), l;
}
function xe(r) {
  var w;
  const { root: s, initialPath: l } = r, m = S(l ?? ((w = s.children[0]) == null ? void 0 : w.path) ?? ""), c = S([]), { theme: d, setTheme: i } = Ve(), h = M({
    get: () => d.value,
    set: (f) => i(f)
  }), o = M(() => s.children.map(_e)), T = S(m.value ? [m.value] : []);
  Q(m, (f) => {
    T.value = f ? [f] : [];
  });
  const E = M(() => Oe(s)), k = M(() => {
    if (m.value)
      return E.value.findByPath(m.value);
  }), C = M(() => k.value || s.children[0]);
  function R(f) {
    m.value = f;
  }
  function u(f, L) {
    m.value = L, f("docLink", L);
  }
  return Q(
    () => l,
    (f) => {
      f && (m.value = f);
    }
  ), {
    selectedPath: m,
    selectedKeys: T,
    expandedKeys: c,
    treeData: o,
    selectedNode: k,
    displayNode: C,
    docTree: E,
    themeModel: h,
    handleTreeSelect: R,
    handleDocLink: u
  };
}
const Ue = { class: "neumorphism-markdown-body" }, We = ["innerHTML"], je = { class: "neumorphism-toc-header" }, Ge = {
  class: "neumorphism-toc-list",
  role: "list"
}, Ze = ["aria-current", "onClick"], Xe = ["aria-label", "onClick"], Ye = { class: "toc-text" }, Je = { class: "neumorphism-toc-mobile-header" }, Qe = {
  class: "neumorphism-toc-list",
  role: "list"
}, et = ["aria-current", "onClick"], tt = ["aria-label", "onClick"], nt = { class: "toc-text" }, Ce = /* @__PURE__ */ ee({
  __name: "MarkdownRenderer",
  props: {
    content: {},
    className: { default: "" },
    showToc: { type: Boolean, default: !0 },
    scrollContainer: {}
  },
  emits: ["docLink"],
  setup(r, { emit: s }) {
    const l = r, m = s, c = S(null), d = S(null), i = S(""), h = S(!1), o = S(/* @__PURE__ */ new Set()), T = S(!1), E = S({});
    let k = null, C = null, R = null;
    const u = Ie("toc");
    function w(t) {
      return `${u}-${Te(t)}`;
    }
    const f = /(\/\/.*$|\/\*[\s\S]*?\*\/|#\s+.*$|--.*$)/gm, L = /(&quot;.*?&quot;|\'.*?\'|`.*?`)/g, q = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|default|try|catch|finally|throw|new|this|typeof|instanceof|class|extends|import|export|from|async|await|yield|static|public|private|protected|interface|type|enum|namespace|module|declare|abstract|readonly|implements|void|number|string|boolean|any|never|unknown|null|undefined|true|false)\b/g, te = /\b([a-zA-Z_]\w*)(?=\()/g, x = /\b(\d+\.?\d*)\b/g, b = /\b([A-Z][a-zA-Z0-9_]*)\b/g;
    function z(t, n) {
      if (!n || n === "text" || n === "plain")
        return D(t);
      let e = D(t);
      return e = e.replace(f, '<span class="token-comment">$1</span>'), e = e.replace(L, '<span class="token-string">$1</span>'), e = e.replace(q, '<span class="token-keyword">$1</span>'), e = e.replace(te, '<span class="token-function">$1</span>'), e = e.replace(x, '<span class="token-number">$1</span>'), e = e.replace(b, '<span class="token-type">$1</span>'), e;
    }
    function D(t) {
      return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    function Te(t) {
      return t.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    }
    function ne(t) {
      return t.map((n) => {
        const e = n;
        return e.text ? String(e.text) : e.tokens ? ne(e.tokens) : "";
      }).join("");
    }
    function Ne(t) {
      const n = [], e = re.lexer(t);
      for (const a of e)
        if (a.type === "heading") {
          const v = ne(a.tokens);
          n.push({
            level: a.depth,
            text: v,
            id: w(v)
          });
        }
      return n;
    }
    const B = new re.Renderer();
    B.heading = ({ tokens: t, depth: n }) => {
      const e = ne(t), a = w(e);
      return `<h${n} id="${a}"><a href="#${a}" class="heading-anchor" aria-hidden="true">#</a>${e}</h${n}>`;
    }, B.code = ({ text: t, lang: n }) => {
      const e = n || "text", a = z(t, n), v = t.split(`
`).length, j = Array.from({ length: v }, (Y, Ae) => Ae + 1).map((Y) => `<span class="line-num">${Y}</span>`).join("");
      return `
    <div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-lang">${e}</span>
        <span class="code-lines">${v} lines</span>
        <button class="code-copy-btn" data-code="${D(t)}">复制</button>
      </div>
      <div class="code-block-body">
        <div class="line-numbers">${j}</div>
        <pre><code class="language-${e}">${a}</code></pre>
      </div>
    </div>
  `;
    }, B.codespan = ({ text: t }) => `<code class="inline-code">${D(t)}</code>`, B.image = ({ href: t, title: n, text: e }) => `<img src="${t}" alt="${e}" title="${n || ""}" loading="lazy" />`, B.listitem = ({ text: t, task: n, checked: e }) => n ? `
      <li class="task-list-item">
        <label class="task-checkbox">
          <input type="checkbox" ${e ? "checked" : ""} disabled />
          <span class="checkmark"></span>
          <span class="task-text">${t.replace(/^\[[ x]\]\s*/, "")}</span>
        </label>
      </li>
    ` : `<li>${t}</li>`;
    const Ee = M(() => re.parse(l.content, {
      async: !1,
      gfm: !0,
      breaks: !1,
      renderer: B
    })), W = M(() => Ne(l.content)), de = M(() => {
      const t = W.value, n = [], e = [];
      for (const a of t) {
        const v = { level: a.level, text: a.text, id: a.id, children: [] };
        for (; e.length > 0 && e[e.length - 1].level >= v.level; )
          e.pop();
        e.length === 0 ? n.push(v) : e[e.length - 1].children.push(v), e.push(v);
      }
      return n;
    }), ue = M(() => {
      const t = [];
      function n(e) {
        for (const a of e)
          t.push({
            level: a.level,
            text: a.text,
            id: a.id,
            hasChildren: a.children.length > 0
          }), a.children.length > 0 && !o.value.has(a.id) && n(a.children);
      }
      return n(de.value), t;
    });
    function me(t) {
      var n, e;
      (e = (n = c.value) == null ? void 0 : n.querySelector(`[id="${t}"]`)) == null || e.scrollIntoView({ behavior: "smooth" });
    }
    function Re(t) {
      me(t), h.value = !1;
    }
    function pe(t) {
      const n = new Set(o.value);
      n.has(t) ? n.delete(t) : n.add(t), o.value = n;
    }
    function X(t) {
      return o.value.has(t);
    }
    function De() {
      if (!d.value || window.innerWidth <= 1100) return;
      const t = d.value.querySelector(
        ".neumorphism-toc-item.active"
      );
      t && t.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    function Se(t) {
      const n = t.target, e = n.closest(".code-copy-btn");
      if (e) {
        const v = e.dataset.code;
        v && (t.preventDefault(), navigator.clipboard.writeText(v).then(() => {
          const j = e.textContent;
          e.textContent = "已复制!", setTimeout(() => {
            e && (e.textContent = j);
          }, 1500);
        }));
        return;
      }
      const a = n.closest("a");
      if (a) {
        const v = a.getAttribute("href");
        v && (v.startsWith("/") || v.startsWith(".") || v.endsWith(".md")) && (t.preventDefault(), m("docLink", v));
      }
    }
    function K() {
      return c.value ? l.scrollContainer instanceof HTMLElement ? l.scrollContainer : typeof l.scrollContainer == "string" ? c.value.closest(l.scrollContainer) : c.value.closest(".nm-layout__content") : null;
    }
    function he() {
      const t = K();
      if (!t) return 64;
      const n = t.closest(".nm-layout"), e = n == null ? void 0 : n.querySelector(".nm-layout__header");
      return e ? e.getBoundingClientRect().height : 64;
    }
    function Le() {
      return he() + 20;
    }
    function oe() {
      if (!d.value) return;
      if (window.innerWidth <= 1100) {
        T.value = !1, E.value = {};
        return;
      }
      const n = K();
      if (!n) {
        T.value = !1;
        return;
      }
      T.value = !0;
      const e = he(), a = n.getBoundingClientRect(), v = Math.max(0, window.innerWidth - a.right);
      E.value = {
        position: "fixed",
        top: `${e + 20}px`,
        maxHeight: `calc(100vh - ${e + 40}px)`,
        right: `${v}px`,
        width: "220px",
        zIndex: "10"
      };
    }
    function Me() {
      var e;
      se();
      const t = K();
      if (!t) return;
      k = new ResizeObserver(() => {
        C !== null && cancelAnimationFrame(C), C = requestAnimationFrame(() => {
          C = null, oe(), le();
        });
      }), k.observe(t);
      const n = (e = t.closest(".nm-layout")) == null ? void 0 : e.querySelector(".nm-layout__header");
      n && k.observe(n);
    }
    function se() {
      k && (k.disconnect(), k = null);
    }
    function le() {
      var a;
      const t = K();
      if (!t) return;
      const n = (a = c.value) == null ? void 0 : a.querySelectorAll("h1, h2, h3");
      if (!n) return;
      let e = "";
      for (const v of n) {
        const j = v.getBoundingClientRect(), Y = t.getBoundingClientRect();
        if (j.top - Y.top <= Le())
          e = v.id;
        else
          break;
      }
      e !== i.value && (i.value = e, fe(() => De()));
    }
    function ze(t, n) {
      let e = 0, a = null;
      return () => {
        const v = Date.now();
        v - e >= n ? (e = v, t()) : a === null && (a = requestAnimationFrame(() => {
          a = null, t();
        }));
      };
    }
    const ie = ze(le, 80);
    let I = null;
    return Q(c, (t, n) => {
      if (n) {
        const e = K();
        e == null || e.removeEventListener("scroll", ie), se(), R && (window.removeEventListener("resize", R), R = null);
      }
      t && fe(() => {
        I = K(), I == null || I.addEventListener("scroll", ie), oe(), Me(), R = () => {
          C !== null && cancelAnimationFrame(C), C = requestAnimationFrame(() => {
            C = null, oe();
          });
        }, window.addEventListener("resize", R, { passive: !0 }), le();
      });
    }), He(() => {
      I == null || I.removeEventListener("scroll", ie), se(), C !== null && (cancelAnimationFrame(C), C = null), R && (window.removeEventListener("resize", R), R = null);
    }), Q(i, (t) => {
      if (!t) return;
      function n(e) {
        for (const a of e) {
          if (a.id === t) return !0;
          if (n(a.children)) {
            if (o.value.has(a.id)) {
              const v = new Set(o.value);
              v.delete(a.id), o.value = v;
            }
            return !0;
          }
        }
        return !1;
      }
      n(de.value);
    }), (t, n) => ($(), N("div", {
      class: A(`neumorphism-markdown ${l.className}`)
    }, [
      p("div", Ue, [
        p("div", {
          ref_key: "contentRef",
          ref: c,
          class: "neumorphism-markdown-content",
          onClick: Se,
          innerHTML: Ee.value
        }, null, 8, We)
      ]),
      r.showToc && W.value.length > 0 ? ($(), N("nav", {
        key: 0,
        ref_key: "tocNavRef",
        ref: d,
        class: A(["neumorphism-toc", { "neumorphism-toc--fixed": T.value }]),
        style: Pe(T.value ? E.value : {}),
        "aria-label": "文档目录"
      }, [
        y(F, {
          elevation: -2,
          "no-padding": "",
          class: "neumorphism-toc-card"
        }, {
          default: g(() => [
            p("div", je, [
              n[3] || (n[3] = p("span", null, "📑 目录", -1)),
              y(Fe, {
                value: W.value.length
              }, null, 8, ["value"])
            ]),
            p("ul", Ge, [
              ($(!0), N(ae, null, ve(ue.value, (e) => ($(), N("li", {
                key: e.id,
                class: A(`neumorphism-toc-item level-${e.level} ${i.value === e.id ? "active" : ""} ${e.hasChildren ? "has-children" : ""}`),
                role: "listitem"
              }, [
                p("a", {
                  href: "#",
                  role: "button",
                  "aria-current": i.value === e.id ? "location" : void 0,
                  onClick: G((a) => me(e.id), ["prevent"])
                }, [
                  e.hasChildren ? ($(), N("button", {
                    key: 0,
                    class: "toc-toggle",
                    "aria-label": X(e.id) ? "展开子标题" : "折叠子标题",
                    onClick: G((a) => pe(e.id), ["stop", "prevent"])
                  }, H(X(e.id) ? "▸" : "▾"), 9, Xe)) : P("", !0),
                  p("span", Ye, H(e.text), 1)
                ], 8, Ze)
              ], 2))), 128))
            ])
          ]),
          _: 1
        })
      ], 6)) : P("", !0),
      r.showToc && W.value.length > 0 ? ($(), N("button", {
        key: 1,
        class: A(["neumorphism-toc-mobile-btn", { active: h.value }]),
        "aria-label": "切换目录",
        onClick: n[0] || (n[0] = (e) => h.value = !h.value)
      }, " 📑 ", 2)) : P("", !0),
      y(ge, { name: "neumorphism-toc-drawer" }, {
        default: g(() => [
          r.showToc && W.value.length > 0 && h.value ? ($(), N("div", {
            key: 0,
            class: "neumorphism-toc-mobile-overlay",
            onClick: n[2] || (n[2] = G((e) => h.value = !1, ["self"]))
          }, [
            y(F, {
              elevation: 0,
              class: "neumorphism-toc-mobile-panel"
            }, {
              default: g(() => [
                p("div", Je, [
                  n[4] || (n[4] = p("span", { class: "neumorphism-toc-mobile-title" }, "📑 目录", -1)),
                  p("button", {
                    class: "neumorphism-toc-mobile-close",
                    "aria-label": "关闭目录",
                    onClick: n[1] || (n[1] = (e) => h.value = !1)
                  }, " ✕ ")
                ]),
                p("ul", Qe, [
                  ($(!0), N(ae, null, ve(ue.value, (e) => ($(), N("li", {
                    key: e.id,
                    class: A(`neumorphism-toc-item level-${e.level} ${i.value === e.id ? "active" : ""} ${e.hasChildren ? "has-children" : ""}`),
                    role: "listitem"
                  }, [
                    p("a", {
                      href: "#",
                      role: "button",
                      "aria-current": i.value === e.id ? "location" : void 0,
                      onClick: G((a) => Re(e.id), ["prevent"])
                    }, [
                      e.hasChildren ? ($(), N("button", {
                        key: 0,
                        class: "toc-toggle",
                        "aria-label": X(e.id) ? "展开子标题" : "折叠子标题",
                        onClick: G((a) => pe(e.id), ["stop", "prevent"])
                      }, H(X(e.id) ? "▸" : "▾"), 9, tt)) : P("", !0),
                      p("span", nt, H(e.text), 1)
                    ], 8, et)
                  ], 2))), 128))
                ])
              ]),
              _: 1
            })
          ])) : P("", !0)
        ]),
        _: 1
      })
    ], 2));
  }
}), ot = {
  key: 0,
  class: "neumorphism-sider-content"
}, st = {
  key: 1,
  class: "neumorphism-sider-collapsed"
}, lt = { class: "neumorphism-doc-header" }, it = { class: "neumorphism-doc-title" }, rt = { class: "neumorphism-doc-meta" }, at = { class: "neumorphism-doc-body" }, ct = {
  key: 1,
  class: "neumorphism-empty-state"
}, dt = /* @__PURE__ */ ee({
  __name: "DocViewer",
  props: {
    root: {},
    initialPath: {},
    className: { default: "" }
  },
  emits: ["docLink"],
  setup(r, { emit: s }) {
    const l = r, m = s, {
      selectedPath: c,
      selectedKeys: d,
      expandedKeys: i,
      treeData: h,
      displayNode: o,
      themeModel: T,
      handleTreeSelect: E,
      handleDocLink: k
    } = xe({ root: l.root, initialPath: l.initialPath });
    function C(R) {
      k(m, R);
    }
    return (R, u) => ($(), N("div", {
      class: A(`neumorphism-doc-viewer ${l.className}`)
    }, [
      y(ye, {
        "show-header": "",
        "show-sider": "",
        "sider-width": 280,
        collapsible: ""
      }, {
        "header-left": g(() => [...u[4] || (u[4] = [
          p("span", { class: "neumorphism-header-brand" }, "📚 Doc Viewer", -1)
        ])]),
        "header-right": g(() => [
          y(ke, {
            modelValue: _(T),
            "onUpdate:modelValue": u[0] || (u[0] = (w) => U(T) ? T.value = w : null),
            size: "small"
          }, null, 8, ["modelValue"])
        ]),
        sider: g(({ collapsed: w }) => [
          w ? ($(), N("div", st, "📚")) : ($(), N("div", ot, [
            y(be, {
              "selected-keys": _(d),
              "onUpdate:selectedKeys": u[1] || (u[1] = (f) => U(d) ? d.value = f : null),
              "expanded-keys": _(i),
              "onUpdate:expandedKeys": u[2] || (u[2] = (f) => U(i) ? i.value = f : null),
              data: _(h),
              "show-search": "",
              "search-placeholder": "搜索文档...",
              onNodeSelect: _(E)
            }, null, 8, ["selected-keys", "expanded-keys", "data", "onNodeSelect"])
          ]))
        ]),
        default: g(() => [
          y($e, {
            "no-padding": "",
            class: "neumorphism-main-container"
          }, {
            default: g(() => [
              y(F, {
                elevation: -3,
                "no-padding": "",
                class: "neumorphism-content-card"
              }, {
                default: g(() => [
                  _(o) ? ($(), N(ae, { key: 0 }, [
                    p("div", lt, [
                      p("h1", it, H(_(o).title), 1),
                      p("div", rt, [
                        _(o).path ? ($(), O(Z, {
                          key: 0,
                          variant: "primary",
                          size: "small",
                          rounded: ""
                        }, {
                          default: g(() => [
                            V(H(_(o).path), 1)
                          ]),
                          _: 1
                        })) : P("", !0),
                        _(o).children.length > 0 ? ($(), O(Z, {
                          key: 1,
                          variant: "info",
                          size: "small",
                          rounded: ""
                        }, {
                          default: g(() => [
                            V(" 📁 " + H(_(o).children.length) + " 个子项 ", 1)
                          ]),
                          _: 1
                        })) : P("", !0)
                      ])
                    ]),
                    y(we),
                    p("div", at, [
                      y(ge, {
                        name: "neumorphism-doc-switch",
                        mode: "out-in"
                      }, {
                        default: g(() => [
                          ($(), O(Ce, {
                            key: _(o).path,
                            content: _(o).body,
                            onDocLink: C
                          }, null, 8, ["content"]))
                        ]),
                        _: 1
                      })
                    ])
                  ], 64)) : ($(), N("div", ct, [
                    y(F, {
                      elevation: 2,
                      hoverable: "bulge",
                      class: "neumorphism-empty-icon"
                    }, {
                      default: g(() => [...u[5] || (u[5] = [
                        p("span", { class: "neumorphism-empty-emoji" }, "📂", -1)
                      ])]),
                      _: 1
                    }),
                    u[7] || (u[7] = p("p", null, "请从左侧选择一篇文档", -1)),
                    y(J, {
                      variant: "raised",
                      size: "small",
                      onClick: u[3] || (u[3] = (w) => {
                        var f;
                        return c.value = ((f = _(h)[0]) == null ? void 0 : f.key) ?? "";
                      })
                    }, {
                      default: g(() => [...u[6] || (u[6] = [
                        V(" 打开第一篇 ", -1)
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
    ], 2));
  }
}), Zt = /* @__PURE__ */ ce(dt, [["__scopeId", "data-v-aa1a5e08"]]), ut = { class: "neumorphism-editor-toolbar" }, mt = { class: "editor-stat" }, pt = /* @__PURE__ */ ee({
  __name: "MarkdownEditor",
  props: {
    value: {},
    className: { default: "" }
  },
  emits: ["change", "docLink"],
  setup(r, { emit: s }) {
    const l = r, m = s, c = S("split");
    function d(u) {
      m("docLink", u);
    }
    const i = [
      { key: "edit", label: "✏️ 编辑" },
      { key: "split", label: "⬌ 分栏" },
      { key: "preview", label: "👁 预览" }
    ], h = M(() => l.value.length), o = M(() => l.value.split(`
`).length), T = S(null), E = S(null);
    let k = !1;
    function C() {
      var L;
      if (k || c.value !== "split") return;
      const u = (L = T.value) == null ? void 0 : L.querySelector("textarea"), w = E.value;
      if (!u || !w) return;
      const f = u.scrollTop / (u.scrollHeight - u.clientHeight || 1);
      k = !0, w.scrollTop = f * (w.scrollHeight - w.clientHeight), requestAnimationFrame(() => {
        k = !1;
      });
    }
    function R() {
      var L;
      if (k || c.value !== "split") return;
      const u = (L = T.value) == null ? void 0 : L.querySelector("textarea"), w = E.value;
      if (!u || !w) return;
      const f = w.scrollTop / (w.scrollHeight - w.clientHeight || 1);
      k = !0, u.scrollTop = f * (u.scrollHeight - u.clientHeight), requestAnimationFrame(() => {
        k = !1;
      });
    }
    return (u, w) => ($(), N("div", {
      class: A(`neumorphism-markdown-editor ${l.className}`)
    }, [
      p("div", ut, [
        y(qe, {
          modelValue: c.value,
          "onUpdate:modelValue": w[0] || (w[0] = (f) => c.value = f),
          tabs: i,
          size: "small",
          class: "neumorphism-editor-mode-tabs"
        }, null, 8, ["modelValue"]),
        p("span", mt, H(o.value) + " 行 · " + H(h.value) + " 字", 1)
      ]),
      p("div", {
        class: A(["neumorphism-editor-panels", `neumorphism-mode-${c.value}`])
      }, [
        p("div", {
          ref_key: "editPanelRef",
          ref: T,
          class: A(["neumorphism-editor-panel neumorphism-editor-panel--edit", { hidden: c.value === "preview" }]),
          onScroll: C
        }, [
          y(F, {
            elevation: -3,
            "no-padding": "",
            class: "edit-card"
          }, {
            default: g(() => [
              y(Be, {
                class: "neumorphism-editor-textarea",
                "model-value": l.value,
                placeholder: "在此输入 Markdown...",
                "auto-resize": !1,
                "show-count": !1,
                "onUpdate:modelValue": w[1] || (w[1] = (f) => m("change", f))
              }, null, 8, ["model-value"])
            ]),
            _: 1
          })
        ], 34),
        p("div", {
          ref_key: "previewPanelRef",
          ref: E,
          class: A(["neumorphism-editor-panel neumorphism-editor-panel--preview", { hidden: c.value === "edit" }]),
          onScroll: R
        }, [
          y(F, {
            elevation: -2,
            "no-padding": "",
            class: "preview-card"
          }, {
            default: g(() => [
              y(Ce, {
                content: l.value,
                "show-toc": !1,
                onDocLink: d
              }, null, 8, ["content"])
            ]),
            _: 1
          })
        ], 34)
      ], 2)
    ], 2));
  }
}), ht = /* @__PURE__ */ ce(pt, [["__scopeId", "data-v-c47cd884"]]), ft = { class: "neumorphism-editor-actions" }, vt = {
  key: 0,
  class: "neumorphism-editor-sider"
}, gt = {
  key: 1,
  class: "neumorphism-editor-sider-collapsed"
}, yt = {
  key: 0,
  class: "neumorphism-editor-layout"
}, kt = { class: "neumorphism-editor-header" }, bt = { class: "neumorphism-editor-title" }, wt = { class: "neumorphism-editor-meta" }, $t = { class: "neumorphism-editor-body" }, _t = {
  key: 1,
  class: "neumorphism-editor-empty"
}, xt = 50, Ct = /* @__PURE__ */ ee({
  __name: "DocEditor",
  props: {
    root: {},
    initialPath: {},
    className: { default: "" }
  },
  emits: ["save", "docLink"],
  setup(r, { emit: s }) {
    const l = r, m = s, {
      selectedPath: c,
      selectedKeys: d,
      expandedKeys: i,
      treeData: h,
      displayNode: o,
      themeModel: T,
      handleTreeSelect: E
    } = xe({ root: l.root, initialPath: l.initialPath }), k = S({}), C = S([]);
    function R(x, b) {
      const z = C.value.filter((D) => D !== x);
      for (z.push(x); z.length > xt; ) {
        const D = z.shift();
        D !== x && delete k.value[D];
      }
      C.value = z, k.value[x] = b;
    }
    function u(x) {
      return k.value[x.path] ?? x.content;
    }
    function w(x) {
      o.value && R(o.value.path, x);
    }
    function f() {
      o.value && m("save", o.value.path, u(o.value));
    }
    function L(x) {
      c.value = x, m("docLink", x);
    }
    const q = M(() => {
      if (!o.value) return !1;
      const x = k.value[o.value.path];
      return x !== void 0 && x !== o.value.content;
    });
    function te(x) {
      (x.ctrlKey || x.metaKey) && x.key === "s" && (x.preventDefault(), f());
    }
    return (x, b) => ($(), N("div", {
      class: A(`neumorphism-doc-editor ${l.className}`),
      onKeydown: te
    }, [
      y(ye, {
        "show-header": "",
        "show-sider": "",
        "sider-width": 280,
        collapsible: ""
      }, {
        "header-left": g(() => [...b[4] || (b[4] = [
          p("span", { class: "neumorphism-editor-brand" }, "📝 Doc Editor", -1)
        ])]),
        "header-center": g(() => [
          y(ke, {
            modelValue: _(T),
            "onUpdate:modelValue": b[0] || (b[0] = (z) => U(T) ? T.value = z : null),
            size: "small"
          }, null, 8, ["modelValue"])
        ]),
        "header-right": g(() => [
          p("div", ft, [
            q.value ? ($(), O(Z, {
              key: 0,
              variant: "warning",
              size: "small"
            }, {
              default: g(() => [...b[5] || (b[5] = [
                V(" 未保存 ", -1)
              ])]),
              _: 1
            })) : P("", !0),
            y(J, {
              variant: "raised",
              size: "small",
              disabled: !q.value,
              onClick: f
            }, {
              default: g(() => [...b[6] || (b[6] = [
                V(" 💾 保存 ", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ]),
        sider: g(({ collapsed: z }) => [
          z ? ($(), N("div", gt, "📝")) : ($(), N("div", vt, [
            y(be, {
              "selected-keys": _(d),
              "onUpdate:selectedKeys": b[1] || (b[1] = (D) => U(d) ? d.value = D : null),
              "expanded-keys": _(i),
              "onUpdate:expandedKeys": b[2] || (b[2] = (D) => U(i) ? i.value = D : null),
              data: _(h),
              "show-search": "",
              "search-placeholder": "搜索文档...",
              onNodeSelect: _(E)
            }, null, 8, ["selected-keys", "expanded-keys", "data", "onNodeSelect"])
          ]))
        ]),
        default: g(() => [
          y($e, {
            "no-padding": "",
            class: "neumorphism-editor-container"
          }, {
            default: g(() => [
              y(F, {
                elevation: -3,
                "no-padding": "",
                class: "neumorphism-editor-card"
              }, {
                default: g(() => [
                  _(o) ? ($(), N("div", yt, [
                    p("header", kt, [
                      p("div", null, [
                        p("h1", bt, H(_(o).title), 1),
                        p("div", wt, [
                          _(o).path ? ($(), O(Z, {
                            key: 0,
                            variant: "primary",
                            size: "small",
                            rounded: ""
                          }, {
                            default: g(() => [
                              V(H(_(o).path), 1)
                            ]),
                            _: 1
                          })) : P("", !0),
                          q.value ? ($(), O(Z, {
                            key: 1,
                            variant: "warning",
                            size: "small"
                          }, {
                            default: g(() => [...b[7] || (b[7] = [
                              V(" 已修改 ", -1)
                            ])]),
                            _: 1
                          })) : P("", !0)
                        ])
                      ]),
                      y(J, {
                        variant: "raised",
                        size: "small",
                        disabled: !q.value,
                        onClick: f
                      }, {
                        default: g(() => [...b[8] || (b[8] = [
                          V(" 💾 保存 ", -1)
                        ])]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    y(we),
                    p("div", $t, [
                      y(ht, {
                        value: u(_(o)),
                        onChange: w,
                        onDocLink: L
                      }, null, 8, ["value"])
                    ])
                  ])) : ($(), N("div", _t, [
                    y(F, {
                      elevation: 2,
                      hoverable: "bulge",
                      class: "neumorphism-editor-empty-icon"
                    }, {
                      default: g(() => [...b[9] || (b[9] = [
                        p("span", { class: "neumorphism-editor-empty-emoji" }, "📂", -1)
                      ])]),
                      _: 1
                    }),
                    b[11] || (b[11] = p("p", null, "请从左侧选择一篇文档进行编辑", -1)),
                    y(J, {
                      variant: "raised",
                      size: "small",
                      onClick: b[3] || (b[3] = (z) => {
                        var D;
                        return c.value = ((D = _(h)[0]) == null ? void 0 : D.key) ?? "";
                      })
                    }, {
                      default: g(() => [...b[10] || (b[10] = [
                        V(" 打开第一篇 ", -1)
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
}), Xt = /* @__PURE__ */ ce(Ct, [["__scopeId", "data-v-974c39ef"]]), Tt = /^---\s*\n([\s\S]*?)\n---\s*\n?/;
function Nt(r) {
  const s = r.match(Tt);
  if (!s)
    return { meta: {}, body: r };
  const l = s[1], m = r.slice(s[0].length), c = {};
  for (const d of l.split(`
`)) {
    const i = d.indexOf(":");
    if (i === -1) continue;
    const h = d.slice(0, i).trim();
    let o = d.slice(i + 1).trim();
    /^-?\d+$/.test(o) ? o = parseInt(o, 10) : /^-?\d+\.\d+$/.test(o) ? o = parseFloat(o) : o === "true" ? o = !0 : o === "false" ? o = !1 : (o.startsWith('"') && o.endsWith('"') || o.startsWith("'") && o.endsWith("'")) && (o = o.slice(1, -1)), c[h] = o;
  }
  return { meta: c, body: m };
}
function Et(r) {
  return r.replace(/\.md$/i, "").replace(/\//g, "-").replace(/\\/g, "-");
}
function Rt(r, s) {
  if (s.title && typeof s.title == "string")
    return s.title;
  const l = r.match(/^#\s+(.+)$/m);
  return l ? l[1].trim() : "Untitled";
}
function Dt(r, s) {
  const { meta: l, body: m } = Nt(s), c = Rt(m, l), d = typeof l.order == "number" ? l.order : 9999;
  return {
    id: Et(r),
    title: c,
    path: r,
    content: s,
    body: m,
    meta: l,
    children: [],
    order: d
  };
}
function Yt(r) {
  const s = /* @__PURE__ */ new Map();
  for (const [i, h] of Object.entries(r)) {
    if (!i.endsWith(".md")) continue;
    const o = Dt(i, h);
    s.set(i, o);
  }
  const l = [], m = Array.from(s.keys()).sort();
  for (const i of m) {
    const h = i.split("/");
    if (h.length === 1) {
      l.push(i);
      continue;
    }
    let o = null;
    const E = `${h.slice(0, -1).join("/")}/index.md`;
    if (s.has(E) && E !== i)
      o = E;
    else {
      const k = h.slice(0, -1).join("/") + ".md";
      s.has(k) && (o = k);
    }
    if (o && s.has(o)) {
      const k = s.get(o), C = s.get(i);
      k.children.push(C);
    } else
      l.push(i);
  }
  for (const i of s.values())
    i.children.sort((h, o) => h.order - o.order || h.title.localeCompare(o.title));
  const c = l.map((i) => s.get(i)).sort((i, h) => i.order - h.order || i.title.localeCompare(h.title));
  return {
    id: "root",
    title: "Root",
    path: "",
    content: "",
    body: "",
    meta: {},
    children: c,
    order: 0
  };
}
export {
  Xt as DocEditor,
  Zt as DocViewer,
  ht as MarkdownEditor,
  Ce as MarkdownRenderer,
  Yt as buildDocTree,
  Oe as createDocTree,
  Dt as createNode,
  Rt as extractTitle,
  jt as flattenDocTree,
  Gt as getAncestors,
  Ke as getNodeIcon,
  _e as nodeToTreeData,
  Nt as parseFrontmatter,
  Et as pathToId,
  xe as useDocLayout
};
