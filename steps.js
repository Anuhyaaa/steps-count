// Configuration
const DAILY_GOAL = 10000;
const CALORIES_PER_STEP = 0.04;
const STEP_THRESHOLD = 1.2;
const STEP_DELAY = 250;

// State variables
let stepCount = 0;
let lastStepTime = 0;
let lastAcceleration = 0;
let isTracking = false;
let motionListener = null;

// DOM elements
const stepCountElement = document.getElementById('stepCount');
const caloriesElement = document.getElementById('calories');
const resetBtn = document.getElementById('resetBtn');
const startTrackingBtn = document.getElementById('startTrackingBtn');
const statusMessage = document.getElementById('statusMessage');
const progressCircle = document.querySelector('.progress-ring-circle');
const dateDisplay = document.getElementById('dateDisplay');

// Calculate circle circumference
const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = circumference;

// Initialize
function init() {
    displayDate();
    loadStepsFromStorage();
    updateDisplay();
    
    // Setup event listeners
    resetBtn.addEventListener('click', resetSteps);
    startTrackingBtn.addEventListener('click', handleStartTracking);
    
    // Check device capabilities
    if (typeof DeviceMotionEvent === 'undefined') {
        statusMessage.textContent = '✗ Device motion not supported on this device';
        statusMessage.style.backgroundColor = '#ffebee';
        statusMessage.style.borderLeftColor = '#f44336';
        return;
    }
    
    // iOS devices need explicit permission via button click
    if (needsPermission()) {
        startTrackingBtn.style.display = 'block';
        statusMessage.textContent = '📱 Tap "Start Step Tracking" to enable motion sensor';
        statusMessage.style.backgroundColor = '#fff9f0';
        statusMessage.style.borderLeftColor = '#c49a6c';
    } else {
        // Android and other devices - auto-start
        startStepDetection();
        statusMessage.textContent = '✓ Motion sensor active';
        statusMessage.style.backgroundColor = '#e8f5e9';
        statusMessage.style.borderLeftColor = '#4caf50';
    }
}

// Display date
function displayDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
}

// Load steps
function loadStepsFromStorage() {
    const savedSteps = localStorage.getItem('fitTrackSteps');
    const savedDate = localStorage.getItem('fitTrackDate');
    const today = new Date().toDateString();
    
    if (savedDate !== today) {
        if (savedDate && savedSteps) {
            saveToWeeklyData(savedDate, parseInt(savedSteps, 10));
        }
        stepCount = 0;
        localStorage.setItem('fitTrackDate', today);
        localStorage.setItem('fitTrackSteps', '0');
    } else if (savedSteps) {
        stepCount = parseInt(savedSteps, 10);
    }
    
    saveToWeeklyData(today, stepCount);
}

// Save steps
function saveStepsToStorage() {
    const today = new Date().toDateString();
    localStorage.setItem('fitTrackSteps', stepCount.toString());
    localStorage.setItem('fitTrackDate', today);
    saveToWeeklyData(today, stepCount);
}

// Save to weekly data
function saveToWeeklyData(dateString, steps) {
    let weeklyData = JSON.parse(localStorage.getItem('fitTrackWeekly') || '{}');
    weeklyData[dateString] = steps;
    
    const dates = Object.keys(weeklyData).sort((a, b) => new Date(b) - new Date(a));
    if (dates.length > 30) {
        dates.slice(30).forEach(date => delete weeklyData[date]);
    }
    
    localStorage.setItem('fitTrackWeekly', JSON.stringify(weeklyData));
}

// Check if permission is needed (iOS 13+)
function needsPermission() {
    return typeof DeviceMotionEvent !== 'undefined' && 
           typeof DeviceMotionEvent.requestPermission === 'function';
}

// Request motion permission (iOS)
async function requestMotionPermission() {
    try {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission === 'granted') {
            startStepDetection();
            startTrackingBtn.style.display = 'none';
            statusMessage.textContent = '✓ Motion sensor active';
            statusMessage.style.backgroundColor = '#e8f5e9';
            statusMessage.style.borderLeftColor = '#4caf50';
            return true;
        } else {
            statusMessage.textContent = '✗ Motion permission denied. Please enable in Settings.';
            statusMessage.style.backgroundColor = '#ffebee';
            statusMessage.style.borderLeftColor = '#f44336';
            return false;
        }
    } catch (error) {
        statusMessage.textContent = '✗ Could not request permission: ' + error.message;
        statusMessage.style.backgroundColor = '#ffebee';
        statusMessage.style.borderLeftColor = '#f44336';
        return false;
    }
}

// Handle start tracking button click
async function handleStartTracking() {
    if (needsPermission()) {
        await requestMotionPermission();
    } else {
        startStepDetection();
        startTrackingBtn.style.display = 'none';
        statusMessage.textContent = '✓ Motion sensor active';
        statusMessage.style.backgroundColor = '#e8f5e9';
        statusMessage.style.borderLeftColor = '#4caf50';
    }
}

// Start detection
function startStepDetection() {
    if (isTracking) return; // Prevent duplicate listeners
    
    isTracking = true;
    motionListener = handleMotion.bind(this);
    window.addEventListener('devicemotion', motionListener);
}

// Handle motion
function handleMotion(event) {
    if (!event.accelerationIncludingGravity) return;
    
    const { x, y, z } = event.accelerationIncludingGravity;
    const acceleration = Math.sqrt(x * x + y * y + z * z);
    const currentTime = Date.now();
    const timeSinceLastStep = currentTime - lastStepTime;
    
    if (acceleration > STEP_THRESHOLD && 
        lastAcceleration < STEP_THRESHOLD && 
        timeSinceLastStep > STEP_DELAY) {
        
        stepCount++;
        lastStepTime = currentTime;
        updateDisplay();
        saveStepsToStorage();
    }
    
    lastAcceleration = acceleration;
}

// Update display
function updateDisplay() {
    stepCountElement.textContent = stepCount.toLocaleString();
    const calories = Math.round(stepCount * CALORIES_PER_STEP);
    caloriesElement.textContent = calories.toLocaleString();
    
    const progress = Math.min(stepCount / DAILY_GOAL, 1);
    const offset = circumference - (progress * circumference);
    progressCircle.style.strokeDashoffset = offset;
    
    if (stepCount >= DAILY_GOAL && stepCount - 1 < DAILY_GOAL) {
        statusMessage.textContent = '🎉 Daily goal achieved!';
        statusMessage.style.backgroundColor = '#fff9c4';
        statusMessage.style.borderLeftColor = '#fbc02d';
    }
}

// Reset
function resetSteps() {
    if (confirm('Are you sure you want to reset your step count?')) {
        stepCount = 0;
        lastStepTime = 0;
        lastAcceleration = 0;
        updateDisplay();
        saveStepsToStorage();
        
        statusMessage.textContent = '✓ Steps reset successfully';
        statusMessage.style.backgroundColor = '#e3f2fd';
        statusMessage.style.borderLeftColor = '#2196f3';
        
        setTimeout(() => {
            statusMessage.textContent = '✓ Step tracking active';
            statusMessage.style.backgroundColor = '#e8f5e9';
            statusMessage.style.borderLeftColor = '#4caf50';
        }, 3000);
    }
}

// Init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
