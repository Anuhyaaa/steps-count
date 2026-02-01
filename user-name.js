/**
 * User Name Management Module
 * Handles personalization using localStorage
 * No backend, database, or authentication required
 */

// localStorage key for storing username
const USERNAME_KEY = 'fittrack_username';

/**
 * Get the stored username from localStorage
 * @returns {string|null} The username or null if not set
 */
function getUsername() {
    return localStorage.getItem(USERNAME_KEY);
}

/**
 * Save username to localStorage
 * @param {string} name - The name to save
 * @returns {boolean} Success status
 */
function saveUsername(name) {
    if (!name || name.trim() === '') {
        return false;
    }
    localStorage.setItem(USERNAME_KEY, name.trim());
    return true;
}

/**
 * Display username in navbar greeting
 * Adds "Hi, <name> 👋" to the navbar
 */
function displayNavbarGreeting() {
    const username = getUsername();
    const navbar = document.querySelector('.nav-container');
    
    if (username && navbar) {
        // Check if greeting already exists
        let greetingElement = document.getElementById('navbarGreeting');
        
        if (!greetingElement) {
            // Create greeting element
            greetingElement = document.createElement('div');
            greetingElement.id = 'navbarGreeting';
            greetingElement.className = 'navbar-greeting';
            navbar.appendChild(greetingElement);
        }
        
        greetingElement.textContent = `Hi, ${username} 👋`;
    }
}

/**
 * Show name prompt modal for first-time users
 */
function checkAndPromptForName() {
    const username = getUsername();
    
    // If name doesn't exist, show prompt
    if (!username) {
        showNamePrompt();
    } else {
        // Name exists, display it in navbar
        displayNavbarGreeting();
    }
}

/**
 * Show the name input modal
 */
function showNamePrompt() {
    // Check if modal already exists
    if (document.getElementById('namePromptModal')) {
        return;
    }
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'namePromptModal';
    modalOverlay.className = 'name-modal-overlay';
    
    // Create modal content
    modalOverlay.innerHTML = `
        <div class="name-modal-content">
            <h2 class="name-modal-title">Welcome to FitTrack! 👋</h2>
            <p class="name-modal-text">Enter your name to personalize your experience</p>
            
            <input 
                type="text" 
                id="nameInput" 
                class="name-input" 
                placeholder="Your name" 
                maxlength="30"
                autocomplete="off"
            />
            
            <button id="saveNameBtn" class="name-save-btn">Get Started</button>
            
            <p class="name-modal-note">
                💡 Your name is stored locally on your device only
            </p>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(modalOverlay);
    
    // Add modal-open class to body
    document.body.classList.add('modal-open');
    
    // Focus on input
    const nameInput = document.getElementById('nameInput');
    setTimeout(() => nameInput.focus(), 100);
    
    // Handle save button click
    document.getElementById('saveNameBtn').addEventListener('click', handleNameSubmit);
    
    // Handle Enter key
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleNameSubmit();
        }
    });
}

/**
 * Handle name submission from prompt
 */
function handleNameSubmit() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    
    if (name === '') {
        // Show error feedback
        nameInput.style.borderColor = '#e74c3c';
        nameInput.placeholder = 'Please enter your name';
        nameInput.focus();
        return;
    }
    
    // Save name
    if (saveUsername(name)) {
        // Remove modal-open class from body
        document.body.classList.remove('modal-open');
        
        // Remove modal
        const modal = document.getElementById('namePromptModal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
        
        // Display greeting
        displayNavbarGreeting();
        
        // Refresh dynamic content on current page
        refreshPageContent();
    }
}

/**
 * Refresh page content with new username
 * Updates dynamic elements that display the username
 */
function refreshPageContent() {
    const username = getUsername();
    if (!username) return;
    
    // Update home page welcome message
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle && pageTitle.textContent.includes('Welcome back')) {
        pageTitle.textContent = `Welcome back, ${username} 👋`;
    }
    
    // Update profile page
    const profileName = document.querySelector('.profile-name');
    if (profileName) {
        profileName.textContent = username;
    }
    
    // Update avatar seed
    const profileAvatar = document.querySelector('.profile-avatar');
    if (profileAvatar) {
        profileAvatar.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        profileAvatar.alt = `${username}'s Avatar`;
    }
}

/**
 * Show edit name modal (for profile page)
 */
function showEditNameModal() {
    const currentName = getUsername() || '';
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'editNameModal';
    modalOverlay.className = 'name-modal-overlay';
    
    // Create modal content
    modalOverlay.innerHTML = `
        <div class="name-modal-content">
            <h2 class="name-modal-title">Change Your Name</h2>
            <p class="name-modal-text">Update your personalized name</p>
            
            <input 
                type="text" 
                id="editNameInput" 
                class="name-input" 
                placeholder="Your name" 
                maxlength="30"
                value="${currentName}"
                autocomplete="off"
            />
            
            <div class="name-modal-buttons">
                <button id="updateNameBtn" class="name-save-btn">Update Name</button>
                <button id="cancelEditBtn" class="name-cancel-btn">Cancel</button>
            </div>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(modalOverlay);
    
    // Add modal-open class to body
    document.body.classList.add('modal-open');
    
    // Focus on input and select text
    const editInput = document.getElementById('editNameInput');
    setTimeout(() => {
        editInput.focus();
        editInput.select();
    }, 100);
    
    // Handle update button
    document.getElementById('updateNameBtn').addEventListener('click', handleNameUpdate);
    
    // Handle cancel button
    document.getElementById('cancelEditBtn').addEventListener('click', () => {
        // Remove modal-open class from body
        document.body.classList.remove('modal-open');
        closeEditModal();
    });
    
    // Handle Enter key
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleNameUpdate();
        }
    });
    
    // Handle Escape key
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Remove modal-open class from body
            document.body.classList.remove('modal-open');
            closeEditModal();
        }
    });
}

/**
 * Handle name update from edit modal
 */
function handleNameUpdate() {
    const editInput = document.getElementById('editNameInput');
    const name = editInput.value.trim();
    
    if (name === '') {
        editInput.style.borderColor = '#e74c3c';
        editInput.placeholder = 'Name cannot be empty';
        editInput.value = '';
        editInput.focus();
        return;
    }
    
    // Save updated name
    if (saveUsername(name)) {
        // Remove modal-open class from body
        document.body.classList.remove('modal-open');
        
        closeEditModal();
        
        // Refresh all name displays
        displayNavbarGreeting();
        refreshPageContent();
        
        // Show success message
        showSuccessMessage('Name updated successfully! ✓');
    }
}

/**
 * Close edit name modal
 */
function closeEditModal() {
    const modal = document.getElementById('editNameModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    }
}

/**
 * Show success message
 * @param {string} message - Message to display
 */
function showSuccessMessage(message) {
    const statusMessage = document.getElementById('statusMessage');
    if (statusMessage) {
        statusMessage.textContent = message;
        statusMessage.style.display = 'block';
        statusMessage.style.color = '#27ae60';
        
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAndPromptForName();
});
