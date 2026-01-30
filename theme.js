// FitTrack Theme Manager - Global Theme System
// Automatically applies saved theme on every page load
// Optimized for performance - prevents flash of unstyled content (FOUC)

// Apply saved theme immediately on page load (prevents flicker)
(function () {
  const savedTheme = localStorage.getItem("fitTrackTheme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
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

// Shared utility functions for localStorage management
const FitTrackStorage = {
  // Get item with default fallback
  get: function(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : defaultValue;
    } catch (e) {
      console.warn('localStorage access failed:', e);
      return defaultValue;
    }
  },
  
  // Set item safely
  set: function(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('localStorage write failed:', e);
      return false;
    }
  },
  
  // Get JSON with error handling
  getJSON: function(key, defaultValue = {}) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('localStorage JSON parse failed:', e);
      return defaultValue;
    }
  },
  
  // Set JSON safely
  setJSON: function(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('localStorage JSON write failed:', e);
      return false;
    }
  }
};

// Prevent redundant reflows/repaints by batching DOM updates
function batchDOMUpdates(updates) {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });}