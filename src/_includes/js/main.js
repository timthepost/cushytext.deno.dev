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
  const userTheme = getLocalStorageOrDefault("theme", "light");
  html.setAttribute("data-theme", userTheme === "dark" ? "dark" : "light");
}

function toggleColorTheme() {
  const userTheme = localStorage.getItem("theme");
  localStorage.setItem("theme", userTheme === "dark" ? "light" : "dark");
  sync();
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
    sync();
    themeSwitcher.addEventListener("click", toggleColorTheme);
  }
});
