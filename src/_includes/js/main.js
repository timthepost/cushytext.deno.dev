/*
 * Load the framework helpers, theme switchers, etc.
 */

function getLocalStorageOrDefault(key, defaultValue) {
  const storedValue = localStorage.getItem(key);
  if (storedValue !== null) {
    return storedValue;
  } else {
    localStorage.setItem(key, defaultValue);
    return defaultValue;
  }
}

function sync() {
  const html = document.documentElement;
  const themeStyleSheet = document.querySelector("#theme-stylesheet");
  const userTheme = getLocalStorageOrDefault("theme", "light");

  function syncCSS() {
    themeStyleSheet.href = `/infima-css/theme-${userTheme}.css`;
  }

  function syncTheme() {
    html.setAttribute("data-theme", userTheme === "dark" ? "dark" : "light");
  }

  syncCSS();
  syncTheme();
}

function toggleMode() {
  const userTheme = localStorage.getItem("theme");
  localStorage.setItem("theme", userTheme === "dark" ? "light" : "dark");
  sync();
}

document.addEventListener("DOMContentLoaded", function () {
  /* See _includes/partials/scripts.vto for more about these */
  alert(document.querySelectorAll(".alert"));
  buttonGroups(document.querySelectorAll(".button-group"));
  dropdowns(document.querySelectorAll(".dropdown"));
  pills(document.querySelectorAll(".pills"));
  menu(document.querySelectorAll(".menu"));
  navbar(document.querySelectorAll(".navbar"));
  tabs(document.querySelectorAll(".tabs"));

  /* Register dark mode handler if we detect a theme switch button */
  const themeSwitcher = document.getElementById("mode-toggle");
  if (themeSwitcher) {
    sync();
    themeSwitcher.addEventListener("click", toggleMode);
  }
});
