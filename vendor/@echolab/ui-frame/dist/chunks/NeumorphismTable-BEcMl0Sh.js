import { defineComponent as G, computed as d, openBlock as n, createElementBlock as a, normalizeClass as y, createElementVNode as o, createVNode as $, unref as i, createCommentVNode as m, Fragment as f, renderList as g, normalizeStyle as N, renderSlot as _, createTextVNode as T, toDisplayString as h } from "vue";
import { useTable as J } from "../composables/useTable.js";
import { useConfig as O } from "../composables/useConfig.js";
import { useLocale as P } from "../composables/useLocale.js";
import { N as B } from "./NeumorphismCheckbox-Bo5Q7yC_.js";
import { _ as Q } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismTable.css';const U = { class: "nm-table__wrapper" }, X = { class: "nm-table__inner" }, Y = {
  key: 0,
  class: "nm-table__head"
}, Z = {
  key: 0,
  class: "nm-table__th nm-table__th--selection"
}, ee = ["onClick"], te = { class: "nm-table__th-content" }, le = {
  key: 0,
  class: "nm-table__sort-icon",
  "aria-hidden": "true"
}, se = { class: "nm-table__body" }, ne = ["onClick"], ae = {
  key: 0,
  class: "nm-table__td nm-table__td--selection"
}, oe = {
  key: 0,
  class: "nm-table__empty"
}, ie = { class: "nm-table__empty-text" }, de = {
  key: 1,
  class: "nm-table__loading"
}, re = { class: "nm-table__loading-text" }, ce = /* @__PURE__ */ G({
  __name: "NeumorphismTable",
  props: {
    data: { default: () => [] },
    columns: { default: () => [] },
    rowKey: { default: "key" },
    selectable: { type: [Boolean, String], default: !1 },
    selectedKeys: { default: () => [] },
    loading: { type: Boolean, default: !1 },
    emptyText: { default: "暂无数据" },
    size: { default: "medium" },
    striped: { type: Boolean, default: !1 },
    hoverable: { type: Boolean, default: !0 },
    showHeader: { type: Boolean, default: !0 }
  },
  emits: ["update:selectedKeys", "select", "selectAll", "sort"],
  setup(r, { emit: A }) {
    const l = r, u = A, { t: p } = P(), W = O(), z = d(() => {
      var e;
      return l.size ?? ((e = W.value.table) == null ? void 0 : e.size) ?? "medium";
    }), V = d(() => l.emptyText || p("tableEmpty")), E = d({
      get: () => l.selectedKeys,
      set: (e) => u("update:selectedKeys", e)
    }), {
      resolvedColumns: v,
      displayData: k,
      sortState: S,
      toggleSort: L,
      isSelected: C,
      toggleSelect: D,
      selectAll: H,
      isAllSelected: K,
      isIndeterminate: j
    } = J({
      data: d(() => l.data),
      columns: d(() => l.columns),
      rowKey: d(() => l.rowKey),
      selectable: d(() => l.selectable),
      selectedKeys: E
    });
    function F(e) {
      L(e), u("sort", e, S.value.direction);
    }
    function w(e) {
      const s = String(e[l.rowKey] ?? "");
      D(s), u("select", s, e);
    }
    function I() {
      H(), u("selectAll", K.value);
    }
    function M(e, s) {
      const t = e[s.key];
      return t == null ? "" : String(t);
    }
    function R(e) {
      if (!e.width && !e.minWidth) return;
      const s = {};
      return e.width && (s.width = typeof e.width == "number" ? `${e.width}px` : e.width), e.minWidth && (s.minWidth = typeof e.minWidth == "number" ? `${e.minWidth}px` : e.minWidth), s;
    }
    const q = d(() => [
      "nm-table",
      `nm-table--${z.value}`,
      {
        "nm-table--striped": l.striped,
        "nm-table--hoverable": l.hoverable,
        "nm-table--loading": l.loading
      }
    ]), x = d(
      () => l.selectable === !0 || l.selectable === "multiple"
    );
    return (e, s) => (n(), a("div", {
      class: y(q.value)
    }, [
      o("div", U, [
        o("table", X, [
          r.showHeader ? (n(), a("thead", Y, [
            o("tr", null, [
              x.value ? (n(), a("th", Z, [
                $(B, {
                  "model-value": i(K),
                  indeterminate: i(j),
                  onChange: I
                }, null, 8, ["model-value", "indeterminate"])
              ])) : m("", !0),
              (n(!0), a(f, null, g(i(v), (t) => (n(), a("th", {
                key: t.key,
                class: y(["nm-table__th", {
                  "nm-table__th--sortable": t.sortable,
                  "nm-table__th--active": i(S).key === t.key
                }]),
                style: N([R(t), { textAlign: t.align }]),
                onClick: (b) => t.sortable ? F(t.key) : void 0
              }, [
                o("span", te, [
                  _(e.$slots, "header", { column: t }, () => [
                    T(h(t.label), 1)
                  ], !0),
                  t.sortable ? (n(), a("span", le, [...s[0] || (s[0] = [
                    o("svg", {
                      width: "10",
                      height: "10",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "3",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    }, [
                      o("path", { d: "M18 15l-6-6-6 6" })
                    ], -1)
                  ])])) : m("", !0)
                ])
              ], 14, ee))), 128))
            ])
          ])) : m("", !0),
          o("tbody", se, [
            (n(!0), a(f, null, g(i(k), (t, b) => (n(), a("tr", {
              key: String(t[r.rowKey] ?? b),
              class: y(["nm-table__tr", {
                "nm-table__tr--selected": i(C)(String(t[r.rowKey] ?? ""))
              }]),
              onClick: (c) => r.selectable === "single" ? w(t) : void 0
            }, [
              x.value ? (n(), a("td", ae, [
                $(B, {
                  "model-value": i(C)(String(t[r.rowKey] ?? "")),
                  onChange: (c) => w(t)
                }, null, 8, ["model-value", "onChange"])
              ])) : m("", !0),
              (n(!0), a(f, null, g(i(v), (c) => (n(), a("td", {
                key: c.key,
                class: "nm-table__td",
                style: N({ textAlign: c.align })
              }, [
                _(e.$slots, `cell-${c.key}`, {
                  row: t,
                  column: c,
                  value: t[c.key],
                  index: b
                }, () => [
                  T(h(M(t, c)), 1)
                ], !0)
              ], 4))), 128))
            ], 10, ne))), 128))
          ])
        ]),
        i(k).length === 0 && !r.loading ? (n(), a("div", oe, [
          _(e.$slots, "empty", {}, () => [
            o("span", ie, h(V.value), 1)
          ], !0)
        ])) : m("", !0),
        r.loading ? (n(), a("div", de, [
          _(e.$slots, "loading", {}, () => [
            s[1] || (s[1] = o("span", { class: "nm-table__loading-spinner" }, null, -1)),
            o("span", re, h(i(p)("tableLoading")), 1)
          ], !0)
        ])) : m("", !0)
      ])
    ], 2));
  }
}), fe = /* @__PURE__ */ Q(ce, [["__scopeId", "data-v-3139066b"]]);
export {
  fe as N
};
