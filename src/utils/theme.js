export function getStoredTheme() {
  return localStorage.getItem("theme") || "dark";
}

export function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === "light") {
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
  }

  localStorage.setItem("theme", theme);
}