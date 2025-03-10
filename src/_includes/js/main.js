function getLocalStorageOrDefault(key, defaultValue) {
  const storedValue = localStorage.getItem(key);
  if (storedValue !== null) {
    return storedValue;
  } else {
    localStorage.setItem(key, defaultValue);
    return defaultValue;
  }
}

const availableFonts = {
  system:
    "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans",
  user: "opendyslexic",
};

function syncColorTheme() {
  const html = document.documentElement;
  const userTheme = getLocalStorageOrDefault("theme", "light");
  html.setAttribute("data-theme", userTheme === "dark" ? "dark" : "light");
}

function toggleColorTheme() {
  const userTheme = localStorage.getItem("theme");
  localStorage.setItem("theme", userTheme === "dark" ? "light" : "dark");
  syncColorTheme();
}

function syncUserFont() {
  const html = document.documentElement;
  const userFont = getLocalStorageOrDefault("font", "system");
  html.setAttribute("data-font", userFont);
  const affectedElements = document.querySelectorAll(".font-selectable");
  if (affectedElements) {
    affectedElements.forEach((element) => {
      element.style.fontFamily = availableFonts[userFont];
    });
  }
}

function toggleUserFont() {
  const userFont = localStorage.getItem("font");
  localStorage.setItem("font", userFont === "system" ? "user" : "system");
  syncUserFont();
}

document.addEventListener("DOMContentLoaded", function () {
  alert(document.querySelectorAll(".alert"));
  buttonGroups(document.querySelectorAll(".button-group"));
  dropdowns(document.querySelectorAll(".dropdown"));
  pills(document.querySelectorAll(".pills"));
  menu(document.querySelectorAll(".menu"));
  navbar(document.querySelectorAll(".navbar"));
  tabs(document.querySelectorAll(".tabs"));

  const themeSwitcher = document.getElementById("mode-toggle");
  if (themeSwitcher) {
    syncColorTheme();
    themeSwitcher.addEventListener("click", toggleColorTheme);
  }

  const fontSwitcher = document.getElementById("font-toggle");
  if (fontSwitcher) {
    syncUserFont();
    fontSwitcher.addEventListener("click", toggleUserFont);
  }
});
