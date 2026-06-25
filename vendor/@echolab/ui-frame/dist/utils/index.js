function o(t = "nm") {
  return `${t}-${Math.random().toString(36).slice(2, 9)}`;
}
function c(t, n) {
  let e = null;
  const r = (...i) => {
    e && clearTimeout(e), e = setTimeout(() => t(...i), n);
  };
  return r.cancel = () => {
    e && (clearTimeout(e), e = null);
  }, r;
}
function u(t) {
  return t == null ? !0 : typeof t == "string" ? t.trim() === "" : Array.isArray(t) ? t.length === 0 : typeof t == "object" ? Object.keys(t).length === 0 : !1;
}
export {
  c as debounce,
  o as generateId,
  u as isEmpty
};
