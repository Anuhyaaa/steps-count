// Configuration
const DAILY_GOAL = 10000;
const CALORIES_PER_STEP = 0.04;
const STEP_THRESHOLD = 1.3; // Acceleration threshold for step detection
const STEP_DELAY = 250; // Minimum milliseconds between steps

// State variables
let stepCount = 0;
let lastStepTime = 0;
let lastAcceleration = 0;

// DOM elements
const stepCountElement = document.getElementById('stepCount');
const caloriesElement = document.getElementById('calories');
const resetBtn = document.getElementById('resetBtn');
const statusMessage = document.getElementById('statusMessage');
const progressCircle = document.querySelector('.progress-ring-circle');
const dateDisplay = document.getElementById('dateDisplay');
const weeklyList = document.getElementById('weeklyList');

// Calculate circle circumference for progress ring
const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = circumference;

// Initialize app
function init() {
    displayDate();
    loadStepsFromStorage();
    updateDisplay();
    updateWeeklySummary();
    requestMotionPermission();
    
    // Reset button event listener
    resetBtn.addEventListener('click', resetSteps);
}

// Load saved steps from localStorage
function loadStepsFromStorage() {
    const savedSteps = localStorage.getItem('fitTrackSteps');
    const savedDate = localStorage.getItem('fitTrackDate');
    const today = new Date().toDateString();
    
    // Reset if it's a new day
    if (savedDate !== today) {
        // Save yesterday's steps to weekly data before resetting
        if (savedDate && savedSteps) {
            saveToWeeklyData(savedDate, parseInt(savedSteps, 10));
        }
        
        stepCount = 0;
        localStorage.setItem('fitTrackDate', today);
        localStorage.setItem('fitTrackSteps', '0');
    } else if (savedSteps) {
        stepCount = parseInt(savedSteps, 10);
    }
    
    // Save today's initial count to weekly data
    saveToWeeklyData(today, stepCount);
}

// Save steps to localStorage
function saveStepsToStorage() {
    const today = new Date().toDateString();
    localStorage.setItem('fitTrackSteps', stepCount.toString());
    localStorage.setItem('fitTrackDate', today);
    
    // Update weekly data
    saveToWeeklyData(today, stepCount);
    updateWeeklySummary();
}

// Request motion sensor permission (required for iOS 13+)
async function requestMotionPermission() {
    if (typeof DeviceMotionEvent !== 'undefined') {
        // Check if permission request is needed (iOS 13+)
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceMotionEvent.requestPermission();
                if (permission === 'granted') {
                    startStepDetection();
                    statusMessage.textContent = '✓ Step tracking active';
                    statusMessage.style.backgroundColor = '#e8f5e9';
                    statusMessage.style.borderLeftColor = '#4caf50';
                } else {
                    statusMessage.textContent = '✗ Motion permission denied';
                    statusMessage.style.backgroundColor = '#ffebee';
                    statusMessage.style.borderLeftColor = '#f44336';
                }
            } catch (error) {
                console.error('Permission request error:', error);
                statusMessage.textContent = '✗ Could not request permission';
            }
        } else {
            // No permission needed (Android, older iOS, desktop)
            startStepDetection();
            statusMessage.textContent = '✓ Step tracking active';
            statusMessage.style.backgroundColor = '#e8f5e9';
            statusMessage.style.borderLeftColor = '#4caf50';
        }
    } else {
        statusMessage.textContent = '✗ Device motion not supported';
        statusMessage.style.backgroundColor = '#ffebee';
        statusMessage.style.borderLeftColor = '#f44336';
    }
}

// Start step detection using DeviceMotion API
function startStepDetection() {
    window.addEventListener('devicemotion', handleMotion);
}

// Handle motion events and detect steps
function handleMotion(event) {
    if (!event.accelerationIncludingGravity) return;
    
    const { x, y, z } = event.accelerationIncludingGravity;
    
    // Calculate total acceleration magnitude
    const acceleration = Math.sqrt(x * x + y * y + z * z);
    
    // Detect step using peak detection algorithm
    const currentTime = Date.now();
    const timeSinceLastStep = currentTime - lastStepTime;
    
    // Check if we have a significant acceleration peak
    if (acceleration > STEP_THRESHOLD && 
        lastAcceleration < STEP_THRESHOLD && 
        timeSinceLastStep > STEP_DELAY) {
        
        // Register a step
        stepCount++;
        lastStepTime = currentTime;
        
        // Update display and save
        updateDisplay();
        saveStepsToStorage();
    }
    
    lastAcceleration = acceleration;
}

// Update UI display
function updateDisplay() {
    // Update step count
    stepCountElement.textContent = stepCount.toLocaleString();
    
    // Update calories
    const calories = Math.round(stepCount * CALORIES_PER_STEP);
    caloriesElement.textContent = calories.toLocaleString();
    
    // Update progress ring
    const progress = Math.min(stepCount / DAILY_GOAL, 1);
    const offset = circumference - (progress * circumference);
    progressCircle.style.strokeDashoffset = offset;
    
    // Update status message if goal reached
    if (stepCount >= DAILY_GOAL && stepCount - 1 < DAILY_GOAL) {
        statusMessage.textContent = '🎉 Daily goal achieved!';
        statusMessage.style.backgroundColor = '#fff9c4';
        statusMessage.style.borderLeftColor = '#fbc02d';
    }
}

// Save steps to weekly data
function saveToWeeklyData(dateString, steps) {
    let weeklyData = JSON.parse(localStorage.getItem('fitTrackWeekly') || '{}');
    weeklyData[dateString] = steps;
    
    // Keep only last 30 days to prevent unlimited growth
    const dates = Object.keys(weeklyData).sort((a, b) => new Date(b) - new Date(a));
    if (dates.length > 30) {
        dates.slice(30).forEach(date => delete weeklyData[date]);
    }
    
    localStorage.setItem('fitTrackWeekly', JSON.stringify(weeklyData));
}

// Get steps for a specific date
function getStepsForDate(date) {
    const weeklyData = JSON.parse(localStorage.getItem('fitTrackWeekly') || '{}');
    const dateString = date.toDateString();
    return weeklyData[dateString] || 0;
}

// Update weekly summary display
function updateWeeklySummary() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyItems = weeklyList.querySelectorAll('.weekly-item');
    
    // Calculate the start of the week (Monday)
    const startOfWeek = new Date(today);
    const daysSinceMonday = (currentDay + 6) % 7; // Convert to Monday-based week
    startOfWeek.setDate(today.getDate() - daysSinceMonday);
    
    weeklyItems.forEach((item, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        
        const steps = getStepsForDate(date);
        const dayStepsElement = item.querySelector('.day-steps');
        dayStepsElement.textContent = `${steps.toLocaleString()} steps`;
        
        // Highlight current day
        const itemDay = item.getAttribute('data-day');
        const todayName = dayNames[currentDay];
        
        if (itemDay === todayName) {
            item.classList.add('current-day');
        } else {
            item.classList.remove('current-day');
        }
    });
}

// Reset steps
function resetSteps() {
    if (confirm('Are you sure you want to reset your step count?')) {
        stepCount = 0;
        lastStepTime = 0;
        lastAcceleration = 0;
        
        updateDisplay();
        saveStepsToStorage();
        updateWeeklySummary();
        
        statusMessage.textContent = '✓ Steps reset successfully';
        statusMessage.style.backgroundColor = '#e3f2fd';
        statusMessage.style.borderLeftColor = '#2196f3';
        
        // Reset status message after 3 seconds
        setTimeout(() => {
            statusMessage.textContent = '✓ Step tracking active';
            statusMessage.style.backgroundColor = '#e8f5e9';
            statusMessage.style.borderLeftColor = '#4caf50';
        }, 3000);
    }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
