import { computed as p } from "vue";
let y = 0;
function v(a) {
  const { modelValue: h, tabs: s } = a, i = a.position, u = `nm-tabs-${++y}`, b = p(() => `${u}-panel`), f = p(() => {
    const e = i == null ? void 0 : i.value;
    return e === "left" || e === "right" ? "vertical" : "horizontal";
  });
  function c(e) {
    const r = s.value.find((t) => t.key === e);
    r != null && r.disabled || (h.value = e);
  }
  function g(e, r) {
    const t = s.value.filter((o) => !o.disabled);
    if (t.length === 0) return;
    const n = t.findIndex((o) => o.key === r);
    let l;
    if (f.value === "vertical")
      if (e.key === "ArrowDown")
        e.preventDefault(), l = n + 1 < t.length ? n + 1 : 0;
      else if (e.key === "ArrowUp")
        e.preventDefault(), l = n - 1 >= 0 ? n - 1 : t.length - 1;
      else
        return;
    else if (e.key === "ArrowRight")
      e.preventDefault(), l = n + 1 < t.length ? n + 1 : 0;
    else if (e.key === "ArrowLeft")
      e.preventDefault(), l = n - 1 >= 0 ? n - 1 : t.length - 1;
    else
      return;
    const d = t[l];
    d && c(d.key);
  }
  return {
    activate: c,
    handleKeydown: g,
    panelId: b,
    tabListId: u,
    orientation: f
  };
}
export {
  v as useTabs
};
