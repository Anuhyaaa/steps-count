# 🏋️ FitTrack — Personal Fitness Tracker Web App

FitTrack is a mobile-friendly fitness tracking web application designed to help users stay active, build healthy habits, and monitor daily progress.  
It works completely in the browser with no backend required.

---

## ✨ Features

- 📱 **Real-time Step Counter** (using mobile motion sensors)  
- 🎯 **Daily Step Goal (10,000 steps)**  
- 📅 **Weekly Step Summary**  
- 💧 **Water Intake Tracker**  
- 💬 **Daily Motivation Quotes**  
- 📍 **Distance Tracker (GPS-based)**  
- 👤 **User Profile Page**  
- 📊 **Progress Overview Dashboard**  
- 🌙 **Dark / Light Mode with Persistent Theme**  
- ⚙️ **Settings Page with Toggles**  
- 🍎 **Fitness Nutrition Guide**

---

## 🎨 UI Highlights

- Fully responsive for **mobile, tablet, and desktop**  
- Warm brown & beige theme  
- Smooth card-based layout  
- Clean modern typography (Poppins font)  
- Persistent settings using LocalStorage

---

## 📱 How to Use

1. Open the website on your **mobile browser**.  
2. Allow motion and location permissions when prompted.  
3. Start walking to track steps in real time.  
4. Use the Settings page to switch Dark Mode.  
5. Navigate through features using the navbar.

---

## 🚀 Live Demo

🔗 **[View Live Demo](https://anuhyaaa.github.io/steps-count/)**

---

## 🛠️ Built With

- HTML  
- CSS  
- JavaScript  
- Browser Sensor APIs (DeviceMotion & Geolocation)  
- LocalStorage  

(No backend or database required)

---

## 📂 Project Structure

```
steps-count/
│
├── index.html          # Home dashboard
├── steps.html          # Step counter page
├── weekly.html         # Weekly summary
├── water.html          # Water tracker
├── quotes.html         # Daily motivation
├── distance.html       # Distance tracker
├── profile.html        # User profile
├── progress.html       # Progress overview
├── nutrition.html      # Nutrition guide
├── settings.html       # Settings & dark mode
├── about.html          # About page
│
├── style.css           # Global styles
├── theme.js            # Dark mode manager
│
├── index.js            # Dashboard logic
├── steps.js            # Step counter logic
├── weekly.js           # Weekly data logic
├── water.js            # Water tracker logic
├── quotes.js           # Quote generator
├── distance.js         # Distance tracker logic
├── profile.js          # Profile management
├── progress.js         # Progress calculations
├── settings.js         # Settings toggles
└── README.md           # This file
```

---

## 🌙 Dark Mode

FitTrack includes a fully functional dark mode that:
- Persists across all pages using `localStorage`
- Toggles via Settings page
- Applies instantly without page refresh
- Uses CSS custom properties for smooth transitions

---

## 💾 Local Storage Keys

- `fitTrackTheme` - Stores theme preference (light/dark)
- `fitTrackNotifications` - Notification toggle state
- `fitTrackSound` - Sound effects toggle state
- `todaySteps` - Current day step count
- `waterCount` - Daily water intake count

---

## 🚀 Getting Started

### Clone the Repository
```bash
git clone https://github.com/Anuhyaaa/steps-count.git
cd steps-count
```

### Run Locally
Simply open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then navigate to `http://localhost:8000`

---

## 📱 Mobile Usage

For best experience on mobile:
1. Open in Chrome or Safari mobile browser
2. Grant motion sensor permissions
3. Grant location permissions for distance tracking
4. Keep the app open while walking for accurate step counting

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Anuhya**  
- GitHub: [@Anuhyaaa](https://github.com/Anuhyaaa)
- Repository: [steps-count](https://github.com/Anuhyaaa/steps-count)

---

## 🙏 Acknowledgments

- Font: [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins)
- Icons: Emoji-based for lightweight performance
- Design inspiration: Modern fitness tracking apps

---

⭐ **If you find this project helpful, please give it a star!** ⭐
