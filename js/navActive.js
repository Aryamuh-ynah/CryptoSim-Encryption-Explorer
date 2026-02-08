// js/navActive.js
import { getRoute } from "./router.js";

export function updateActiveNav() {
  const route = getRoute();
  const links = document.querySelectorAll(".nav a[data-route]");

  links.forEach((a) => {
    const r = a.getAttribute("data-route");
    if (r === route) a.classList.add("active");
    else a.classList.remove("active");
  });
}
