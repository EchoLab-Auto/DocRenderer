import { defineComponent as re, computed as l, ref as L, watch as le, openBlock as c, createElementBlock as m, createVNode as h, unref as r, withCtx as F, createElementVNode as t, normalizeClass as f, toDisplayString as p, createCommentVNode as ie, Fragment as V, renderList as Y } from "vue";
import { useDatePicker as ne } from "../composables/useDatePicker.js";
import { useFormField as se } from "../composables/useFormField.js";
import { u as de } from "./createComponent-jnXBYqCm.js";
import { useLocale as ue } from "../composables/useLocale.js";
import { N as ce } from "./NeumorphismFieldLabel-CBF1nZs1.js";
import { N as me } from "./NeumorphismFieldError-BxamHjhs.js";
import { N as pe } from "./NeumorphismPopover-RB48cpPq.js";
import { _ as ve } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import '../NeumorphismDatePicker.css';const be = { class: "nm-datepicker__wrapper" }, ke = ["aria-label", "aria-expanded"], ye = { class: "nm-datepicker__actions" }, he = ["aria-label"], fe = ["aria-label"], _e = { class: "nm-datepicker__header" }, ge = ["aria-label"], xe = ["aria-label"], we = { class: "nm-datepicker__header-label" }, Ce = ["aria-label"], De = ["aria-label"], Ne = { class: "nm-datepicker__weekdays" }, Pe = { class: "nm-datepicker__days" }, Me = ["disabled", "aria-label", "aria-selected", "aria-current", "onClick"], Be = { class: "nm-datepicker__footer" }, Le = /* @__PURE__ */ re({
  __name: "NeumorphismDatePicker",
  props: {
    modelValue: { default: null },
    placeholder: { default: "" },
    format: { default: "yyyy-MM-dd" },
    disabled: { type: Boolean, default: !1 },
    clearable: { type: Boolean, default: !0 },
    size: { default: "medium" },
    minDate: {},
    maxDate: {},
    firstDayOfWeek: { default: 0 },
    label: {},
    required: { type: Boolean },
    error: { type: [String, Boolean] },
    name: {},
    id: {}
  },
  emits: ["update:modelValue", "change", "focus", "blur"],
  setup(n, { emit: T }) {
    const i = n, d = T, { resolveProp: _ } = de(), { t: s } = ue(), S = l(() => _(i.size, void 0, "medium")), z = l(() => _(i.format, void 0, "yyyy-MM-dd")), g = l(() => i.placeholder || s("datePickerPlaceholder")), O = l(() => s("datePickerClear")), $ = l(() => s("datePickerToday")), q = l(() => s("datePickerPrevMonth")), R = l(() => s("datePickerNextMonth")), E = l(() => s("datePickerPrevYear")), I = l(() => s("datePickerNextYear")), J = l({
      get: () => i.modelValue ?? null,
      set: (o) => {
        d("update:modelValue", o), d("change", o);
      }
    }), {
      currentYear: x,
      currentMonth: w,
      calendarDays: W,
      weekdays: A,
      selectedDate: u,
      selectDate: C,
      prevMonth: D,
      nextMonth: N,
      prevYear: P,
      nextYear: M,
      formatDate: H,
      goToToday: j
    } = ne({
      modelValue: J,
      minDate: l(() => i.minDate),
      maxDate: l(() => i.maxDate),
      format: z,
      firstDayOfWeek: l(() => i.firstDayOfWeek)
    }), { fieldId: B, errorMessage: G, baseClassList: K, handleFocus: Q, handleBlur: U } = se(() => ({
      id: i.id,
      size: S.value,
      disabled: i.disabled,
      error: i.error,
      prefix: "datepicker"
    })), v = L(), b = L(!1);
    function X(o) {
      b.value = o;
    }
    function Z(o) {
      var e;
      o.isDisabled || (C(o.date), (e = v.value) == null || e.hide());
    }
    function ee() {
      var e;
      const o = /* @__PURE__ */ new Date();
      o.setHours(0, 0, 0, 0), C(o), j(), (e = v.value) == null || e.hide();
    }
    function te(o) {
      o.stopPropagation(), d("update:modelValue", null), d("change", null);
    }
    le(u, (o) => {
      o && (x.value = o.getFullYear(), w.value = o.getMonth() + 1);
    });
    const ae = l(() => u.value ? H(u.value) : ""), oe = l(() => [
      ...K("nm-datepicker").value,
      {
        "nm-datepicker--open": b.value,
        "nm-datepicker--has-value": u.value !== null
      }
    ]), k = l(() => {
      const o = x.value, e = w.value;
      return { year: o, monthName: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ][e - 1] };
    });
    return (o, e) => (c(), m("div", be, [
      h(ce, {
        label: n.label,
        required: n.required,
        "for-id": r(B)
      }, null, 8, ["label", "required", "for-id"]),
      h(pe, {
        ref_key: "popoverRef",
        ref: v,
        disabled: n.disabled,
        width: "trigger",
        "show-arrow": !1,
        trigger: "click",
        onVisibleChange: X
      }, {
        content: F(() => [
          t("div", {
            class: "nm-datepicker__calendar",
            role: "dialog",
            "aria-label": n.label || "Date picker"
          }, [
            t("div", _e, [
              t("button", {
                class: "nm-datepicker__nav-btn",
                type: "button",
                "aria-label": E.value,
                onClick: e[2] || (e[2] = //@ts-ignore
                (...a) => r(P) && r(P)(...a))
              }, [...e[8] || (e[8] = [
                t("svg", {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  t("polyline", { points: "11 17 6 12 11 7" }),
                  t("polyline", { points: "18 17 13 12 18 7" })
                ], -1)
              ])], 8, ge),
              t("button", {
                class: "nm-datepicker__nav-btn",
                type: "button",
                "aria-label": q.value,
                onClick: e[3] || (e[3] = //@ts-ignore
                (...a) => r(D) && r(D)(...a))
              }, [...e[9] || (e[9] = [
                t("svg", {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  t("polyline", { points: "15 18 9 12 15 6" })
                ], -1)
              ])], 8, xe),
              t("span", we, p(k.value.monthName) + " " + p(k.value.year), 1),
              t("button", {
                class: "nm-datepicker__nav-btn",
                type: "button",
                "aria-label": R.value,
                onClick: e[4] || (e[4] = //@ts-ignore
                (...a) => r(N) && r(N)(...a))
              }, [...e[10] || (e[10] = [
                t("svg", {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  t("polyline", { points: "9 18 15 12 9 6" })
                ], -1)
              ])], 8, Ce),
              t("button", {
                class: "nm-datepicker__nav-btn",
                type: "button",
                "aria-label": I.value,
                onClick: e[5] || (e[5] = //@ts-ignore
                (...a) => r(M) && r(M)(...a))
              }, [...e[11] || (e[11] = [
                t("svg", {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  t("polyline", { points: "13 17 18 12 13 7" }),
                  t("polyline", { points: "6 17 11 12 6 7" })
                ], -1)
              ])], 8, De)
            ]),
            t("div", Ne, [
              (c(!0), m(V, null, Y(r(A), (a, y) => (c(), m("span", {
                key: y,
                class: "nm-datepicker__weekday"
              }, p(a), 1))), 128))
            ]),
            t("div", Pe, [
              (c(!0), m(V, null, Y(r(W), (a, y) => (c(), m("button", {
                key: y,
                class: f(["nm-datepicker__day", {
                  "nm-datepicker__day--other-month": !a.isCurrentMonth,
                  "nm-datepicker__day--today": a.isToday,
                  "nm-datepicker__day--selected": a.isSelected,
                  "nm-datepicker__day--disabled": a.isDisabled,
                  "nm-datepicker__day--in-range": a.isInRange
                }]),
                type: "button",
                disabled: a.isDisabled,
                "aria-label": `${k.value.monthName} ${a.day}, ${a.date.getFullYear()}`,
                "aria-selected": a.isSelected,
                "aria-current": a.isToday ? "date" : void 0,
                onClick: (Fe) => Z(a)
              }, p(a.day), 11, Me))), 128))
            ]),
            t("div", Be, [
              t("button", {
                class: "nm-datepicker__today-btn",
                type: "button",
                onClick: ee
              }, p($.value), 1)
            ])
          ], 8, fe)
        ]),
        default: F(() => [
          t("div", {
            class: f(oe.value),
            "aria-label": n.label || g.value,
            role: "combobox",
            "aria-expanded": b.value,
            "aria-haspopup": "dialog",
            onFocus: e[0] || (e[0] = (a) => r(Q)(a, d)),
            onBlur: e[1] || (e[1] = (a) => r(U)(a, d))
          }, [
            t("span", {
              class: f(["nm-datepicker__value", { "nm-datepicker__value--placeholder": !r(u) }])
            }, p(ae.value || g.value), 3),
            t("span", ye, [
              n.clearable && r(u) ? (c(), m("button", {
                key: 0,
                class: "nm-datepicker__clear",
                type: "button",
                "aria-label": O.value,
                onClick: te
              }, [...e[6] || (e[6] = [
                t("svg", {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  t("path", { d: "M18 6L6 18M6 6l12 12" })
                ], -1)
              ])], 8, he)) : ie("", !0),
              e[7] || (e[7] = t("svg", {
                class: "nm-datepicker__icon",
                width: "16",
                height: "16",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                t("rect", {
                  x: "3",
                  y: "4",
                  width: "18",
                  height: "18",
                  rx: "2",
                  ry: "2"
                }),
                t("line", {
                  x1: "16",
                  y1: "2",
                  x2: "16",
                  y2: "6"
                }),
                t("line", {
                  x1: "8",
                  y1: "2",
                  x2: "8",
                  y2: "6"
                }),
                t("line", {
                  x1: "3",
                  y1: "10",
                  x2: "21",
                  y2: "10"
                })
              ], -1))
            ])
          ], 42, ke)
        ]),
        _: 1
      }, 8, ["disabled"]),
      h(me, {
        id: `${r(B)}-error`,
        message: r(G)
      }, null, 8, ["id", "message"])
    ]));
  }
}), Ee = /* @__PURE__ */ ve(Le, [["__scopeId", "data-v-d19f28ea"]]);
export {
  Ee as N
};
