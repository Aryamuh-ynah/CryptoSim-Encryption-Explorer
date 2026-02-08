// js/router.js
export function getRoute() {
  const hash = window.location.hash.replace("#", "");
  return hash || "home";
}

export function onRouteChange(cb) {
  window.addEventListener("hashchange", cb);
}
