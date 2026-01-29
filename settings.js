// DOM elements
const themeToggle = document.getElementById('themeToggle');
const themeStatus = document.getElementById('themeStatus');
const notificationToggle = document.getElementById('notificationToggle');
const notificationStatus = document.getElementById('notificationStatus');
const soundToggle = document.getElementById('soundToggle');
const soundStatus = document.getElementById('soundStatus');

// Initialize settings on page load
function initializeSettings() {
    loadTheme();
    loadNotificationSetting();
    loadSoundSetting();
}

// ========== THEME FUNCTIONALITY ==========
function loadTheme() {
    const savedTheme = localStorage.getItem('fitTrackTheme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.classList.add('active');
        themeStatus.textContent = 'Theme: Dark Mode';
    } else {
        document.body.classList.remove('dark');
        themeToggle.classList.remove('active');
        themeStatus.textContent = 'Theme: Light Mode';
    }
}

// UI function called from settings page toggle
function toggleThemeUI() {
    // Call global toggle function from theme.js
    const isDark = toggleThemeGlobal();
    
    // Update toggle UI
    if (isDark) {
        themeToggle.classList.add('active');
        themeStatus.textContent = 'Theme: Dark Mode';
    } else {
        themeToggle.classList.remove('active');
        themeStatus.textContent = 'Theme: Light Mode';
    }
}

// Make function globally available for onclick handler
window.handleThemeToggle = toggleThemeUI;

// ========== NOTIFICATION FUNCTIONALITY ==========
function loadNotificationSetting() {
    const notificationEnabled = localStorage.getItem('fitTrackNotifications');
    
    // Default to 'on' if no setting exists
    if (notificationEnabled === null || notificationEnabled === 'on') {
        notificationToggle.classList.add('active');
        notificationStatus.textContent = 'Notifications: On';
        localStorage.setItem('fitTrackNotifications', 'on');
    } else {
        notificationToggle.classList.remove('active');
        notificationStatus.textContent = 'Notifications: Off';
    }
}

function toggleNotification() {
    notificationToggle.classList.toggle('active');
    
    const isOn = notificationToggle.classList.contains('active');
    localStorage.setItem('fitTrackNotifications', isOn ? 'on' : 'off');
    
    notificationStatus.textContent = isOn ? 'Notifications: On' : 'Notifications: Off';
}

// ========== SOUND FUNCTIONALITY ==========
function loadSoundSetting() {
    const soundEnabled = localStorage.getItem('fitTrackSound');
    
    // Default to 'on' if no setting exists
    if (soundEnabled === null || soundEnabled === 'on') {
        soundToggle.classList.add('active');
        soundStatus.textContent = 'Sound Effects: On';
        localStorage.setItem('fitTrackSound', 'on');
    } else {
        soundToggle.classList.remove('active');
        soundStatus.textContent = 'Sound Effects: Off';
    }
}

function toggleSound() {
    soundToggle.classList.toggle('active');
    
    const isOn = soundToggle.classList.contains('active');
    localStorage.setItem('fitTrackSound', isOn ? 'on' : 'off');
    
    soundStatus.textContent = isOn ? 'Sound Effects: On' : 'Sound Effects: Off';
}

// ========== EVENT LISTENERS ==========
// Note: themeToggle uses onclick="handleThemeToggle()" in HTML
notificationToggle.addEventListener('click', toggleNotification);
soundToggle.addEventListener('click', toggleSound);

// Initialize all settings
initializeSettings();
