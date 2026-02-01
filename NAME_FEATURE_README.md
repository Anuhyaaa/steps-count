# FitTrack - Personalized Name Feature 🎯

## Overview
FitTrack now includes a personalized name feature that greets users with their name throughout the app. This feature uses **localStorage only** - no backend, database, or authentication required.

## How It Works

### First Visit
1. When a user visits any page for the first time, a friendly modal appears
2. User enters their name
3. Name is saved to localStorage with key: `fittrack_username`
4. Modal disappears and the app is personalized

### Subsequent Visits
- Name is automatically loaded from localStorage
- User is greeted throughout the app
- No prompt appears again

### Personalization Display Locations
1. **Navbar**: "Hi, [Name] 👋" in the top navigation
2. **Home Page**: "Welcome back, [Name] 👋"
3. **Profile Page**: Display name and personalized avatar

### Editing Name
Users can change their name from the Profile page:
1. Go to Profile page
2. Click "✏️ Change Name" button
3. Update name in the modal
4. Changes apply immediately across the app

## Technical Implementation

### Files Added
- **user-name.js** - Core name management module with all functionality

### Files Modified
- **style.css** - Added styles for name modal and navbar greeting
- **index.html** - Added welcome message with name
- **index.js** - Function to update welcome message
- **profile.html** - Added change name button and dynamic profile
- **profile.js** - Function to load and display user profile
- All other HTML pages - Added user-name.js script

### localStorage Key
```javascript
fittrack_username // Stores the user's name
```

## Features

### ✅ Privacy First
- Data stored **only** on user's device
- No server communication
- No tracking or analytics
- Each browser/device is independent

### ✅ User Experience
- Simple, friendly interface
- No login/signup required
- No passwords
- Instant personalization
- Easy name updates

### ✅ Multi-Device Support
- Different devices = different names
- Users won't overwrite each other
- localStorage is browser-specific
- Perfect for shared devices

### ✅ Data Reset
- If localStorage is cleared, user is prompted again
- This is expected behavior
- Simple re-entry process

## Code Structure

### Main Functions (user-name.js)

```javascript
// Get username from localStorage
getUsername()

// Save username to localStorage
saveUsername(name)

// Display greeting in navbar
displayNavbarGreeting()

// Check for name and show prompt if needed
checkAndPromptForName()

// Show name input modal (first visit)
showNamePrompt()

// Show edit name modal (profile page)
showEditNameModal()

// Refresh page content with updated name
refreshPageContent()
```

### Usage Example

```javascript
// Automatically runs on every page load
document.addEventListener('DOMContentLoaded', () => {
    checkAndPromptForName();
});

// To manually trigger name edit (from profile page)
showEditNameModal();
```

## Browser Compatibility
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers
- Requires localStorage support (available in all modern browsers)

## GitHub Pages Deployment
This feature is **100% compatible** with GitHub Pages:
- No server-side code
- Pure frontend (HTML, CSS, JavaScript)
- Works with static hosting
- No build process required

## User Privacy

### What's Stored
- **Only the user's name** in localStorage
- Nothing else

### What's NOT Stored
- ❌ No passwords
- ❌ No email addresses
- ❌ No personal information
- ❌ No cookies
- ❌ No tracking data

### Data Location
- Stored locally in browser's localStorage
- Never sent to any server
- Only accessible by the same website
- Cleared when user clears browser data

## Customization

### Change Greeting Text
Edit in [user-name.js](user-name.js#L40):
```javascript
greetingElement.textContent = `Hi, ${username} 👋`;
```

### Change localStorage Key
Edit the constant in [user-name.js](user-name.js#L8):
```javascript
const USERNAME_KEY = 'fittrack_username';
```

### Modify Modal Appearance
Styles are in [style.css](style.css) under the section:
```css
/* USER NAME PERSONALIZATION STYLES */
```

## Testing

### Test First Visit
1. Clear localStorage: `localStorage.removeItem('fittrack_username')`
2. Refresh page
3. Name prompt should appear

### Test Name Change
1. Go to Profile page
2. Click "Change Name"
3. Enter new name
4. Verify it updates everywhere

### Test Multiple Users
1. Use different browsers or incognito mode
2. Enter different names
3. Verify each session is independent

## Troubleshooting

### Name prompt doesn't appear
- Check browser console for errors
- Verify localStorage is enabled
- Check if name is already set: `localStorage.getItem('fittrack_username')`

### Name doesn't update
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Verify user-name.js is loaded in HTML
- Check browser console for errors

### Navbar greeting not showing
- Verify navbar has class `nav-container`
- Check that user-name.js is loaded before page-specific scripts
- Inspect navbar in DevTools

## Future Enhancements (Optional)
- 📸 Custom avatar upload (using localStorage with base64)
- 🎨 Name color customization
- 🏆 Achievement badges with names
- 📊 Personal statistics display

## Support
This feature is designed to be simple and self-contained. All code is well-commented for easy understanding and modification.

---

**Built with ❤️ for FitTrack users**
