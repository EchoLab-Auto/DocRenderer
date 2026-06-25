import { inject as o, computed as n } from "vue";
const c = Symbol("nm-global-config"), t = {};
function e() {
  return o(
    c,
    n(() => t)
  );
}
export {
  c as ConfigKey,
  e as useConfig
};
