// DOM elements
const weightInput = document.getElementById('weightInput');
const weightDisplay = document.getElementById('weightDisplay');
const saveWeightBtn = document.getElementById('saveWeightBtn');
const statusMessage = document.getElementById('statusMessage');

// Load and display user profile
function loadUserProfile() {
    const username = localStorage.getItem('fittrack_username');
    
    if (username) {
        // Update profile name
        const profileName = document.getElementById('profileName');
        if (profileName) {
            profileName.textContent = username;
        }
        
        // Update avatar with username seed
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            profileAvatar.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
            profileAvatar.alt = `${username}'s Avatar`;
        }
    }
}

// Load saved weight
function loadWeight() {
    const savedWeight = localStorage.getItem('fitTrackWeight');
    if (savedWeight) {
        weightInput.value = savedWeight;
        weightDisplay.textContent = `Current Weight: ${savedWeight} kg`;
        weightDisplay.style.display = 'block';
    }
}

// Save weight
function saveWeight() {
    const weight = weightInput.value.trim();
    
    if (!weight || isNaN(weight) || weight <= 0) {
        statusMessage.textContent = '⚠️ Please enter a valid weight';
        statusMessage.style.backgroundColor = '#ffebee';
        statusMessage.style.borderLeftColor = '#f44336';
        statusMessage.style.display = 'block';
        return;
    }
    
    localStorage.setItem('fitTrackWeight', weight);
    weightDisplay.textContent = `Current Weight: ${weight} kg`;
    weightDisplay.style.display = 'block';
    
    statusMessage.textContent = '✓ Profile updated successfully!';
    statusMessage.style.backgroundColor = '#e8f5e9';
    statusMessage.style.borderLeftColor = '#4caf50';
    statusMessage.style.display = 'block';
    
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

// Initialize
loadUserProfile();
loadWeight();
saveWeightBtn.addEventListener('click', saveWeight);
