// Display current date
function displayDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Update welcome message with user's name
function updateWelcomeMessage() {
    const username = localStorage.getItem('fittrack_username');
    const welcomeElement = document.getElementById('welcomeMessage');
    
    if (welcomeElement && username) {
        welcomeElement.textContent = `Welcome back, ${username} 👋`;
    }
}

// Load dashboard data
function loadDashboardData() {
    // Get today's steps
    const savedSteps = localStorage.getItem('fitTrackSteps') || '0';
    document.getElementById('todaySteps').textContent = parseInt(savedSteps).toLocaleString();

    // Get water intake
    const savedWater = localStorage.getItem('fitTrackWater') || '0';
    document.getElementById('waterIntake').textContent = savedWater;

    // Calculate current streak
    const streak = calculateStreak();
    document.getElementById('currentStreak').textContent = streak;
}

// Calculate streak of active days
function calculateStreak() {
    const weeklyData = JSON.parse(localStorage.getItem('fitTrackWeekly') || '{}');
    let streak = 0;
    let currentDate = new Date();
    
    // Check backwards from today
    while (true) {
        const dateString = currentDate.toDateString();
        const steps = weeklyData[dateString] || 0;
        
        // Consider day active if at least 1000 steps
        if (steps >= 1000) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
        
        // Limit to prevent infinite loop
        if (streak > 365) break;
    }
    
    return streak;
}

// Initialize
displayDate();
updateWelcomeMessage();
loadDashboardData();
