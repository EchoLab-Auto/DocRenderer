var i = Object.defineProperty;
var m = (s, t, e) => t in s ? i(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var n = (s, t, e) => m(s, typeof t != "symbol" ? t + "" : t, e);
class p {
  constructor(t) {
    n(this, "_map", /* @__PURE__ */ new Map());
    if (t)
      for (const [e, r] of t)
        this._map.set(e, r);
  }
  /** Register or replace a component. Returns `this` for chaining. */
  register(t, e) {
    return this._map.set(t, e), this;
  }
  /** Retrieve a registered component by name. */
  get(t) {
    return this._map.get(t);
  }
  /** Check if a component name is registered. */
  has(t) {
    return this._map.has(t);
  }
  /** Delete a registered component. Returns true if it existed. */
  remove(t) {
    return this._map.delete(t);
  }
  /** Number of registered components. */
  get size() {
    return this._map.size;
  }
  /** Iterate all [name, component] entries. */
  entries() {
    return this._map.entries();
  }
  /** Iterate all component names. */
  names() {
    return this._map.keys();
  }
  /** Register all components onto a Vue App instance. */
  install(t, e = "") {
    for (const [r, a] of this._map)
      t.component(`${e}${r}`, a);
    return this;
  }
}
export {
  p as C
};
