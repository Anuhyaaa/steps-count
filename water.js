// Configuration
const WATER_GOAL = 8;

// State
let waterCount = 0;

// DOM elements
const waterCountElement = document.getElementById('waterCount');
const waterProgress = document.getElementById('waterProgress');
const waterPercentage = document.getElementById('waterPercentage');
const waterGlasses = document.getElementById('waterGlasses');
const addGlassBtn = document.getElementById('addGlassBtn');
const resetWaterBtn = document.getElementById('resetWaterBtn');
const statusMessage = document.getElementById('statusMessage');

// Initialize
function init() {
    loadWaterData();
    updateDisplay();
    renderGlasses();
    
    addGlassBtn.addEventListener('click', addGlass);
    resetWaterBtn.addEventListener('click', resetWater);
}

// Load water data
function loadWaterData() {
    const savedWater = localStorage.getItem('fitTrackWater');
    const savedDate = localStorage.getItem('fitTrackWaterDate');
    const today = new Date().toDateString();
    
    if (savedDate !== today) {
        waterCount = 0;
        localStorage.setItem('fitTrackWaterDate', today);
        localStorage.setItem('fitTrackWater', '0');
    } else if (savedWater) {
        waterCount = parseInt(savedWater, 10);
    }
}

// Save water data
function saveWaterData() {
    localStorage.setItem('fitTrackWater', waterCount.toString());
    localStorage.setItem('fitTrackWaterDate', new Date().toDateString());
}

// Add glass
function addGlass() {
    if (waterCount < WATER_GOAL) {
        waterCount++;
        updateDisplay();
        renderGlasses();
        saveWaterData();
        
        if (waterCount === WATER_GOAL) {
            statusMessage.textContent = '🎉 Daily water goal achieved!';
            statusMessage.style.backgroundColor = '#e3f2fd';
            statusMessage.style.borderLeftColor = '#2196f3';
        }
    } else {
        statusMessage.textContent = '✓ You\'ve reached your daily water goal!';
        statusMessage.style.backgroundColor = '#e8f5e9';
        statusMessage.style.borderLeftColor = '#4caf50';
    }
}

// Reset water
function resetWater() {
    if (confirm('Are you sure you want to reset your water intake?')) {
        waterCount = 0;
        updateDisplay();
        renderGlasses();
        saveWaterData();
        
        statusMessage.textContent = '✓ Water intake reset';
        statusMessage.style.backgroundColor = '#fff9c4';
        statusMessage.style.borderLeftColor = '#fbc02d';
    }
}

// Update display
function updateDisplay() {
    waterCountElement.textContent = waterCount;
    
    const percentage = Math.min((waterCount / WATER_GOAL) * 100, 100);
    waterProgress.style.width = percentage + '%';
    waterPercentage.textContent = Math.round(percentage) + '%';
}

// Render glass icons
function renderGlasses() {
    waterGlasses.innerHTML = '';
    
    for (let i = 0; i < WATER_GOAL; i++) {
        const glass = document.createElement('div');
        glass.style.fontSize = '2.5rem';
        glass.style.transition = 'transform 0.3s ease';
        
        if (i < waterCount) {
            glass.textContent = '💧'; // Filled
            glass.style.transform = 'scale(1.1)';
        } else {
            glass.textContent = '🥛'; // Empty
        }
        
        waterGlasses.appendChild(glass);
    }
}

// Initialize
init();
