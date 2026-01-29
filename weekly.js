// Get steps for a specific date
function getStepsForDate(date) {
    const weeklyData = JSON.parse(localStorage.getItem('fitTrackWeekly') || '{}');
    const dateString = date.toDateString();
    return weeklyData[dateString] || 0;
}

// Update weekly summary
function updateWeeklySummary() {
    const today = new Date();
    const currentDay = today.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyItems = document.querySelectorAll('.weekly-item');
    
    const startOfWeek = new Date(today);
    const daysSinceMonday = (currentDay + 6) % 7;
    startOfWeek.setDate(today.getDate() - daysSinceMonday);
    
    weeklyItems.forEach((item, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);
        
        const steps = getStepsForDate(date);
        const dayStepsElement = item.querySelector('.day-steps');
        dayStepsElement.textContent = `${steps.toLocaleString()} steps`;
        
        const itemDay = item.getAttribute('data-day');
        const todayName = dayNames[currentDay];
        
        if (itemDay === todayName) {
            item.classList.add('current-day');
        } else {
            item.classList.remove('current-day');
        }
    });
}

// Initialize
updateWeeklySummary();
