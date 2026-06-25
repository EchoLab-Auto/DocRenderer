import { inject as l, computed as r, provide as f } from "vue";
import { zhCN as c, enUS as L } from "../locales/index.js";
const p = {
  "zh-CN": c,
  "en-US": L
}, i = Symbol("nm-locale"), u = c;
function a(n, o) {
  return n ? o ? n.replace(/\{(\w+)\}/g, (e, t) => String(o[t] ?? `{${t}}`)) : n : "";
}
function C() {
  const n = l(
    i,
    r(() => u)
  );
  function o(e, t) {
    return a(n.value[e], t);
  }
  return { locale: n, t: o };
}
function S(n) {
  f(
    i,
    r(() => n)
  );
}
function d(n) {
  return p[n] ?? u;
}
export {
  i as LocaleKey,
  d as getLocaleMessages,
  S as provideLocale,
  C as useLocale
};
