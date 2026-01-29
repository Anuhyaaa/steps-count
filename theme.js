// FitTrack Theme Manager - Global Theme System
// Automatically applies saved theme on every page load

// Apply saved theme immediately on page load (prevents flicker)
(function () {
  const savedTheme = localStorage.getItem("fitTrackTheme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
})();

// Global function to toggle theme across the entire app
function toggleThemeGlobal() {
  document.body.classList.toggle("dark");
  
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("fitTrackTheme", isDark ? "dark" : "light");
  
  return isDark;
}
