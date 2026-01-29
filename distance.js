// State variables
let isTracking = false;
let totalDistance = 0;
let lastPosition = null;
let startTime = null;
let watchId = null;
let timerInterval = null;

// DOM elements
const distanceElement = document.getElementById('distance');
const durationElement = document.getElementById('duration');
const avgSpeedElement = document.getElementById('avgSpeed');
const trackingStatus = document.getElementById('trackingStatus');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusMessage = document.getElementById('statusMessage');

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Format time
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update timer
function updateTimer() {
    if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        durationElement.textContent = formatTime(elapsed);
        
        // Update average speed
        if (elapsed > 0) {
            const avgSpeed = (totalDistance / elapsed) * 3600;
            avgSpeedElement.textContent = avgSpeed.toFixed(1) + ' km/h';
        }
    }
}

// Handle position update
function handlePosition(position) {
    const { latitude, longitude } = position.coords;
    
    if (lastPosition) {
        const distance = calculateDistance(
            lastPosition.latitude,
            lastPosition.longitude,
            latitude,
            longitude
        );
        
        // Only add distance if movement is significant (more than 5 meters)
        if (distance > 0.005) {
            totalDistance += distance;
            distanceElement.textContent = totalDistance.toFixed(2);
        }
    }
    
    lastPosition = { latitude, longitude };
}

// Handle position error
function handleError(error) {
    statusMessage.textContent = '✗ Unable to get location: ' + error.message;
    statusMessage.style.backgroundColor = '#ffebee';
    statusMessage.style.borderLeftColor = '#f44336';
    stopTracking();
}

// Start tracking
function startTracking() {
    if (!navigator.geolocation) {
        statusMessage.textContent = '✗ Geolocation not supported';
        statusMessage.style.backgroundColor = '#ffebee';
        statusMessage.style.borderLeftColor = '#f44336';
        return;
    }
    
    isTracking = true;
    totalDistance = 0;
    lastPosition = null;
    startTime = Date.now();
    
    // Update UI
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    trackingStatus.textContent = 'Tracking...';
    trackingStatus.style.color = '#4caf50';
    statusMessage.textContent = '✓ GPS tracking active';
    statusMessage.style.backgroundColor = '#e8f5e9';
    statusMessage.style.borderLeftColor = '#4caf50';
    
    // Start watching position
    watchId = navigator.geolocation.watchPosition(
        handlePosition,
        handleError,
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        }
    );
    
    // Start timer
    timerInterval = setInterval(updateTimer, 1000);
}

// Stop tracking
function stopTracking() {
    isTracking = false;
    
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Update UI
    startBtn.style.display = 'block';
    stopBtn.style.display = 'none';
    trackingStatus.textContent = 'Stopped';
    trackingStatus.style.color = '#f44336';
    statusMessage.textContent = '✓ Walk completed!';
    statusMessage.style.backgroundColor = '#e3f2fd';
    statusMessage.style.borderLeftColor = '#2196f3';
}

// Event listeners
startBtn.addEventListener('click', startTracking);
stopBtn.addEventListener('click', stopTracking);
