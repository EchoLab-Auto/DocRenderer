import { computed as u } from "vue";
import { ConfigKey as f } from "./composables/useConfig.js";
import { useConfig as Nr } from "./composables/useConfig.js";
import { N as h } from "./chunks/NeumorphismButton-CiIrdqlV.js";
import { N as n } from "./chunks/NeumorphismSwitch-HSJ9_0Zq.js";
import { N as l } from "./chunks/NeumorphismCard-Cgy4dCPE.js";
import { N as x } from "./chunks/NeumorphismInput-CV0AQcff.js";
import { T as c } from "./chunks/ThemeProvider-CCR_TjUs.js";
import { N as d } from "./chunks/NeumorphismCheckbox-Bo5Q7yC_.js";
import { N as T } from "./chunks/NeumorphismDatePicker-TLkTC22A.js";
import { N as C } from "./chunks/NeumorphismSelect-D57-kOit.js";
import { N as g } from "./chunks/NeumorphismTextarea-hf4f9EM1.js";
import { N as v } from "./chunks/NeumorphismFieldLabel-CBF1nZs1.js";
import { N as b } from "./chunks/NeumorphismFieldError-BxamHjhs.js";
import { N as S } from "./chunks/NeumorphismModal-BejbU5Uw.js";
import { N as P } from "./chunks/NeumorphismToastProvider-CJvxNDwJ.js";
import { N as y } from "./chunks/NeumorphismTooltip-DEac8yVH.js";
import { N as L } from "./chunks/NeumorphismAlert-C8gUjcJ9.js";
import { N as w } from "./chunks/NeumorphismPopover-RB48cpPq.js";
import { N as F } from "./chunks/NeumorphismDropdown-B_cuLYvV.js";
import { N as M } from "./chunks/NeumorphismAutoComplete-DI9cIsCr.js";
import { N as D } from "./chunks/NeumorphismEmpty-DAsVUAXw.js";
import { N as R } from "./chunks/NeumorphismMenu-xfgTqwex.js";
import { N as A } from "./chunks/NeumorphismNavMenu-D_aeJ9zj.js";
import { N as E } from "./chunks/NeumorphismTabs-DhV7RpfS.js";
import { N as I } from "./chunks/NeumorphismBreadcrumb-PeUQHAqO.js";
import { N as O } from "./chunks/NeumorphismPagination-Dj-JuN7F.js";
import { N as _ } from "./chunks/NeumorphismAvatar-D7pr7n61.js";
import { N as k } from "./chunks/NeumorphismBadge-Br8ESUFf.js";
import { N as K } from "./chunks/NeumorphismTag-D-HO-n7l.js";
import { N as V } from "./chunks/NeumorphismProgress-jGoOJqN4.js";
import { N as $ } from "./chunks/NeumorphismSkeleton-CIBufbBR.js";
import { N as B } from "./chunks/NeumorphismTable-BEcMl0Sh.js";
import { N as G } from "./chunks/NeumorphismVirtualList-BI322-e4.js";
import { N as U } from "./chunks/NeumorphismList-BPjiY2ok.js";
import { N as j } from "./chunks/NeumorphismDrawer-BmpGyAlZ.js";
import { N as z } from "./chunks/NeumorphismDivider-CjDyku2C.js";
import { N as q } from "./chunks/NeumorphismCollapse-BLSShHjJ.js";
import { N as H } from "./chunks/NeumorphismContainer-B1g0c9Ps.js";
import { N as J, a as Q } from "./chunks/NeumorphismCol-DwoaSc5J.js";
import { N as W } from "./chunks/NeumorphismLayout-C7hoaRIo.js";
import { N as X } from "./chunks/NeumorphismThemeToggle-B-lky48G.js";
import { a as Y, N as Z } from "./chunks/NeumorphismTree-C5jKWadX.js";
import { N as oo } from "./chunks/NeumorphismCanvas-CBLkbovI.js";
import { a as ro, N as mo } from "./chunks/NeumorphismRadioGroup-BC-NFcXF.js";
import { N as eo } from "./chunks/NeumorphismSlider-CJGJhgAY.js";
import { N as so } from "./chunks/NeumorphismInputNumber-BLSDUrG2.js";
import { N as po } from "./chunks/NeumorphismSteps-Eq8pY0Yo.js";
import { a as io, N as to } from "./chunks/NeumorphismFormItem-DjtFqfsK.js";
import { N as ao } from "./chunks/NeumorphismUpload-CK8GutG5.js";
import { createTheme as fr, provideTheme as hr, useTheme as nr } from "./composables/useTheme.js";
import { useSelect as xr } from "./composables/useSelect.js";
import { useTabs as dr } from "./composables/useTabs.js";
import { usePagination as Cr } from "./composables/usePagination.js";
import { useTree as vr } from "./composables/useTree.js";
import { useTable as Sr } from "./composables/useTable.js";
import { useCollapse as yr } from "./composables/useCollapse.js";
import { useModal as wr } from "./composables/useModal.js";
import { useToast as Mr } from "./composables/useToast.js";
import { useAlert as Rr } from "./composables/useAlert.js";
import { useTooltip as Er } from "./composables/useTooltip.js";
import { useTouchDevice as Or } from "./composables/useTouchDevice.js";
import { useCheckable as kr } from "./composables/useCheckable.js";
import { useFormField as Vr } from "./composables/useFormField.js";
import { useSlider as Br } from "./composables/useSlider.js";
import { useNumberInput as Ur } from "./composables/useNumberInput.js";
import { usePopover as zr } from "./composables/usePopover.js";
import { useSteps as Hr } from "./composables/useSteps.js";
import { useDrawer as Qr } from "./composables/useDrawer.js";
import { useMenu as Xr } from "./composables/useMenu.js";
import { useVirtualList as Zr } from "./composables/useVirtualList.js";
import { useDatePicker as rm } from "./composables/useDatePicker.js";
import { useUpload as em } from "./composables/useUpload.js";
import { useAutoComplete as pm } from "./composables/useAutoComplete.js";
import { validateFieldValue as tm } from "./composables/useFormValidation.js";
import { LocaleKey as Nm, getLocaleMessages as um, provideLocale as fm, useLocale as hm } from "./composables/useLocale.js";
import { enUS as lm, zhCN as xm } from "./locales/index.js";
import { debounce as dm, generateId as Tm, isEmpty as Cm } from "./utils/index.js";
import { C as vm } from "./chunks/componentRegistry-XcPWEoEL.js";
import { u as Sm } from "./chunks/createComponent-jnXBYqCm.js";
import { FormKey as ym, RadioGroupKey as Lm, RowGutterKey as wm } from "./composables/injectionKeys.js";
import './ui-frame.css';const N = {
  NeumorphismButton: h,
  NeumorphismSwitch: n,
  NeumorphismCard: l,
  NeumorphismInput: x,
  ThemeProvider: c,
  NeumorphismCheckbox: d,
  NeumorphismRadio: mo,
  NeumorphismRadioGroup: ro,
  NeumorphismSelect: C,
  NeumorphismTextarea: g,
  NeumorphismForm: to,
  NeumorphismFormItem: io,
  NeumorphismModal: S,
  NeumorphismToastProvider: P,
  NeumorphismTooltip: y,
  NeumorphismTabs: E,
  NeumorphismBreadcrumb: I,
  NeumorphismPagination: O,
  NeumorphismAvatar: _,
  NeumorphismBadge: k,
  NeumorphismTag: K,
  NeumorphismAlert: L,
  NeumorphismPopover: w,
  NeumorphismDropdown: F,
  NeumorphismEmpty: D,
  NeumorphismProgress: V,
  NeumorphismSkeleton: $,
  NeumorphismTable: B,
  NeumorphismDivider: z,
  NeumorphismCollapse: q,
  NeumorphismContainer: H,
  NeumorphismRow: Q,
  NeumorphismCol: J,
  NeumorphismLayout: W,
  NeumorphismThemeToggle: X,
  NeumorphismTree: Z,
  NeumorphismTreeNode: Y,
  NeumorphismCanvas: oo,
  NeumorphismFieldLabel: v,
  NeumorphismFieldError: b,
  NeumorphismSlider: eo,
  NeumorphismInputNumber: so,
  NeumorphismDrawer: j,
  NeumorphismMenu: R,
  NeumorphismNavMenu: A,
  NeumorphismSteps: po,
  NeumorphismVirtualList: G,
  NeumorphismDatePicker: T,
  NeumorphismList: U,
  NeumorphismUpload: ao,
  NeumorphismAutoComplete: M
};
function No(m, p) {
  const o = p ?? {}, e = "config" in o || "components" in o || "prefix" in o, i = e ? o.config : p, t = e ? o.components ?? {} : {}, a = e ? o.prefix ?? "" : "";
  i && m.provide(
    f,
    u(() => i)
  );
  for (const [r, s] of Object.entries(N))
    m.component(`${a}${r}`, t[r] ?? s);
  for (const [r, s] of Object.entries(t))
    r in N || m.component(`${a}${r}`, s);
}
const ir = {
  install: No,
  version: "__VERSION__"
};
export {
  vm as ComponentRegistry,
  f as ConfigKey,
  ym as FormKey,
  Nm as LocaleKey,
  L as NeumorphismAlert,
  M as NeumorphismAutoComplete,
  _ as NeumorphismAvatar,
  k as NeumorphismBadge,
  I as NeumorphismBreadcrumb,
  h as NeumorphismButton,
  oo as NeumorphismCanvas,
  l as NeumorphismCard,
  d as NeumorphismCheckbox,
  J as NeumorphismCol,
  q as NeumorphismCollapse,
  H as NeumorphismContainer,
  T as NeumorphismDatePicker,
  z as NeumorphismDivider,
  j as NeumorphismDrawer,
  F as NeumorphismDropdown,
  D as NeumorphismEmpty,
  b as NeumorphismFieldError,
  v as NeumorphismFieldLabel,
  to as NeumorphismForm,
  io as NeumorphismFormItem,
  x as NeumorphismInput,
  so as NeumorphismInputNumber,
  W as NeumorphismLayout,
  U as NeumorphismList,
  R as NeumorphismMenu,
  S as NeumorphismModal,
  A as NeumorphismNavMenu,
  O as NeumorphismPagination,
  w as NeumorphismPopover,
  V as NeumorphismProgress,
  mo as NeumorphismRadio,
  ro as NeumorphismRadioGroup,
  Q as NeumorphismRow,
  C as NeumorphismSelect,
  $ as NeumorphismSkeleton,
  eo as NeumorphismSlider,
  po as NeumorphismSteps,
  n as NeumorphismSwitch,
  B as NeumorphismTable,
  E as NeumorphismTabs,
  K as NeumorphismTag,
  g as NeumorphismTextarea,
  X as NeumorphismThemeToggle,
  P as NeumorphismToastProvider,
  y as NeumorphismTooltip,
  Z as NeumorphismTree,
  Y as NeumorphismTreeNode,
  ao as NeumorphismUpload,
  G as NeumorphismVirtualList,
  Lm as RadioGroupKey,
  wm as RowGutterKey,
  c as ThemeProvider,
  fr as createTheme,
  dm as debounce,
  ir as default,
  lm as enUS,
  Tm as generateId,
  um as getLocaleMessages,
  No as install,
  Cm as isEmpty,
  fm as provideLocale,
  hr as provideTheme,
  Rr as useAlert,
  pm as useAutoComplete,
  kr as useCheckable,
  yr as useCollapse,
  Nr as useConfig,
  rm as useDatePicker,
  Qr as useDrawer,
  Vr as useFormField,
  hm as useLocale,
  Xr as useMenu,
  wr as useModal,
  Sm as useNeumorphismSetup,
  Ur as useNumberInput,
  Cr as usePagination,
  zr as usePopover,
  xr as useSelect,
  Br as useSlider,
  Hr as useSteps,
  Sr as useTable,
  dr as useTabs,
  nr as useTheme,
  Mr as useToast,
  Er as useTooltip,
  Or as useTouchDevice,
  vr as useTree,
  em as useUpload,
  Zr as useVirtualList,
  tm as validateFieldValue,
  xm as zhCN
};
