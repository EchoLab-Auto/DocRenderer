import { inject as w, onBeforeUnmount as l, unref as y, provide as k, isRef as S, watch as h, ref as E, computed as m } from "vue";
const p = Symbol("neumorphism-theme"), b = "nm-theme-preference";
function s() {
  return typeof window > "u" ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function x(e) {
  if (typeof window > "u") return null;
  try {
    return localStorage.getItem(e);
  } catch {
    return null;
  }
}
function A(e, t) {
  if (!(typeof window > "u"))
    try {
      localStorage.setItem(t, e);
    } catch {
    }
}
function f(e) {
  if (typeof document > "u") return;
  const t = document.documentElement;
  e ? t.setAttribute("data-theme", "dark") : t.removeAttribute("data-theme");
}
function g(e = {}) {
  const { defaultTheme: t = "auto", storageKey: o = b, followSystem: T = !0 } = e, v = x(o), r = E(v || t), c = m(() => r.value === "auto" ? s() : r.value), a = m(() => c.value === "dark");
  h(
    a,
    (n) => {
      f(n);
    },
    { immediate: !0 }
  );
  let u, i;
  T && typeof window < "u" && (u = window.matchMedia("(prefers-color-scheme: dark)"), i = () => {
    r.value === "auto" && f(s() === "dark");
  }, u.addEventListener("change", i));
  const d = (n) => {
    r.value = n, A(n, o);
  };
  return {
    theme: r,
    currentTheme: c,
    isDark: a,
    setTheme: d,
    toggleTheme: () => {
      const n = a.value ? "light" : "dark";
      d(n);
    },
    dispose: () => {
      u && i && u.removeEventListener("change", i);
    }
  };
}
function L(e = {}) {
  const t = g(y(e));
  return k(p, t), S(e) && h(
    () => e.value.defaultTheme,
    (o) => {
      o !== void 0 && t.setTheme(o);
    }
  ), l(() => {
    t.dispose();
  }), t;
}
function M() {
  const e = w(p, null);
  if (!e) {
    const t = g();
    return l(() => {
      t.dispose();
    }), t;
  }
  return e;
}
export {
  g as createTheme,
  L as provideTheme,
  M as useTheme
};
