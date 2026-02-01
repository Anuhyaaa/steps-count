// Configuration
const DAILY_GOAL = 10000;
const CALORIES_PER_STEP = 0.04;
const STEP_LENGTH_KM = 0.00075; // Average step length in kilometers
const STEP_THRESHOLD = 12; // iOS-friendly threshold (11-13 range)
const STEP_COOLDOWN = 400; // Minimum time between steps in ms
const GRAVITY = 9.81; // Earth's gravity for reference

// State variables
let stepCount = 0;
let distanceKm = 0; // Distance in kilometers
let lastStepTime = 0;
let previousMagnitude = 0;
let isTracking = false;
let motionListener = null;
let peakDetected = false;

// DOM elements
const stepCountElement = document.getElementById('stepCount');
const caloriesElement = document.getElementById('calories');
const distanceElement = document.getElementById('distance');
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
    const savedDistance = localStorage.getItem('fitTrackDistance');
    const savedDate = localStorage.getItem('fitTrackDate');
    const today = new Date().toDateString();
    
    if (savedDate !== today) {
        if (savedDate && savedSteps) {
            saveToWeeklyData(savedDate, parseInt(savedSteps, 10));
        }
        stepCount = 0;
        distanceKm = 0;
        localStorage.setItem('fitTrackDate', today);
        localStorage.setItem('fitTrackSteps', '0');
        localStorage.setItem('fitTrackDistance', '0');
    } else if (savedSteps) {
        stepCount = parseInt(savedSteps, 10);
        distanceKm = savedDistance ? parseFloat(savedDistance) : stepCount * STEP_LENGTH_KM;
    }
    
    saveToWeeklyData(today, stepCount);
}

// Save steps
function saveStepsToStorage() {
    const today = new Date().toDateString();
    localStorage.setItem('fitTrackSteps', stepCount.toString());
    localStorage.setItem('fitTrackDistance', distanceKm.toFixed(2));
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
    // Reset state when starting
    previousMagnitude = 0;
    peakDetected = false;
    
    // Add listener only once
    window.addEventListener('devicemotion', handleMotion, false);
    
    console.log('Step detection started');
}

// Handle motion - Improved step detection for iPhone
function handleMotion(event) {
    // Check if acceleration data is available
    if (!event.accelerationIncludingGravity) {
        console.warn('No acceleration data available');
        return;
    }
    
    const { x, y, z } = event.accelerationIncludingGravity;
    
    // Calculate magnitude of acceleration vector
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    
    // Get current time
    const currentTime = Date.now();
    const timeSinceLastStep = currentTime - lastStepTime;
    
    // Step detection logic using peak detection
    // A step is detected when:
    // 1. Current magnitude crosses above threshold (peak detected)
    // 2. Previous magnitude was below threshold (rising edge)
    // 3. Enough time has passed since last step (cooldown)
    
    if (timeSinceLastStep >= STEP_COOLDOWN) {
        // Detect peak: magnitude crosses above threshold
        if (magnitude > STEP_THRESHOLD && previousMagnitude <= STEP_THRESHOLD) {
            peakDetected = true;
        }
        
        // Detect step: magnitude crosses back below threshold after peak
        if (peakDetected && magnitude < STEP_THRESHOLD && previousMagnitude >= STEP_THRESHOLD) {
            // Step detected!
            stepCount++;
            distanceKm = stepCount * STEP_LENGTH_KM; // Calculate distance in real-time
            lastStepTime = currentTime;
            peakDetected = false;
            
            // Update UI
            updateDisplay();
            saveStepsToStorage();
            
            console.log('Step detected! Total:', stepCount, 'Distance:', distanceKm.toFixed(2), 'km');
        }
    }
    
    // Store current magnitude for next iteration
    previousMagnitude = magnitude;
}

// Reset step detection state
function resetStepDetection() {
    previousMagnitude = 0;
    peakDetected = false;
    lastStepTime = 0;
}

// Update display
function updateDisplay() {
    // Update step count
    stepCountElement.textContent = stepCount.toLocaleString();
    
    // Update calories
    const calories = Math.round(stepCount * CALORIES_PER_STEP);
    caloriesElement.textContent = calories.toLocaleString();
    
    // Update distance (rounded to 2 decimal places)
    distanceElement.textContent = distanceKm.toFixed(2);
    
    // Update progress circle
    const progress = Math.min(stepCount / DAILY_GOAL, 1);
    const offset = circumference - (progress * circumference);
    progressCircle.style.strokeDashoffset = offset;
    
    // Show achievement message
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
        distanceKm = 0; // Reset distance
        resetStepDetection(); // Reset detection state
        updateDisplay();
        saveStepsToStorage();
        
        statusMessage.textContent = '✓ Steps reset successfully';
        statusMessage.style.backgroundColor = '#e3f2fd';
        statusMessage.style.borderLeftColor = '#2196f3';
        
        setTimeout(() => {
            statusMessage.textContent = '✓ Motion sensor active';
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
