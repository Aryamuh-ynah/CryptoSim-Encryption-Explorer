// js/theme.js

const STORAGE_KEY = "cryptosim-theme";

export function initThemeToggle(buttonId = "themeToggle") {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  // Load saved theme
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  btn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem(STORAGE_KEY, "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem(STORAGE_KEY, "dark");
    }
  });
}
