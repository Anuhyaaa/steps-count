# 🎨 Visual Feature Guide

## What Users Will See

### 1️⃣ First Visit - Name Prompt Modal

```
╔════════════════════════════════════════════════╗
║                                                ║
║         Welcome to FitTrack! 👋               ║
║                                                ║
║    Enter your name to personalize your        ║
║              experience                        ║
║                                                ║
║    ┌──────────────────────────────────┐      ║
║    │       Your name                   │      ║
║    └──────────────────────────────────┘      ║
║                                                ║
║    ┌──────────────────────────────────┐      ║
║    │        Get Started                │      ║
║    └──────────────────────────────────┘      ║
║                                                ║
║  💡 Your name is stored locally on your       ║
║     device only                                ║
║                                                ║
╚════════════════════════════════════════════════╝
```

### 2️⃣ Navbar After Login

```
╔═══════════════════════════════════════════════════════════╗
║  FitTrack  Home Steps Weekly Water ...     Hi, Anuhya 👋 ║
╚═══════════════════════════════════════════════════════════╝
```

### 3️⃣ Home Page Welcome

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║            Welcome back, Anuhya 👋                    ║
║              Saturday, February 1, 2026               ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

### 4️⃣ Profile Page

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║                    [Avatar Image]                      ║
║                                                        ║
║                      Anuhya                           ║
║                 Fitness Enthusiast                    ║
║                                                        ║
║              ┌────────────────────┐                   ║
║              │  ✏️ Change Name    │                   ║
║              └────────────────────┘                   ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

### 5️⃣ Edit Name Modal (Profile Page)

```
╔════════════════════════════════════════════════╗
║                                                ║
║           Change Your Name                     ║
║                                                ║
║       Update your personalized name            ║
║                                                ║
║    ┌──────────────────────────────────┐      ║
║    │       Anuhya                      │      ║
║    └──────────────────────────────────┘      ║
║                                                ║
║    ┌─────────────┐  ┌──────────────┐        ║
║    │ Update Name │  │   Cancel     │        ║
║    └─────────────┘  └──────────────┘        ║
║                                                ║
╚════════════════════════════════════════════════╝
```

## User Flow Diagram

```
┌─────────────────┐
│  User visits    │
│   any page      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Check localStorage      │
│ for 'fittrack_username' │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────┐   ┌──────┐
│ Yes │   │  No  │
└──┬──┘   └───┬──┘
   │          │
   │          ▼
   │   ┌──────────────┐
   │   │ Show modal   │
   │   │ prompt for   │
   │   │ name entry   │
   │   └──────┬───────┘
   │          │
   │          ▼
   │   ┌──────────────┐
   │   │ User enters  │
   │   │ name & saves │
   │   └──────┬───────┘
   │          │
   │          ▼
   │   ┌──────────────┐
   │   │ Save to      │
   │   │ localStorage │
   │   └──────┬───────┘
   │          │
   └──────────┴─────────┐
                        │
                        ▼
              ┌──────────────────┐
              │ Display name in: │
              │ • Navbar         │
              │ • Home page      │
              │ • Profile page   │
              └──────────────────┘
```

## Feature Behavior Matrix

| Scenario | Behavior | User Sees |
|----------|----------|-----------|
| **First visit** | No name in localStorage | Name prompt modal |
| **Return visit** | Name exists | Auto-greet, no prompt |
| **Clear storage** | Name removed | Prompt appears again |
| **Different browser** | Independent storage | New prompt |
| **Different device** | Independent storage | New prompt |
| **Incognito mode** | Temporary storage | Prompt on each session |
| **Profile edit** | Update localStorage | Changes everywhere instantly |

## localStorage Structure

```javascript
// localStorage Key-Value Pair
{
  "fittrack_username": "Anuhya"
}

// Other existing FitTrack keys
{
  "fitTrackSteps": "5000",
  "fitTrackWater": "6",
  "fitTrackWeight": "65",
  "fitTrackDate": "Sat Feb 01 2026",
  "fitTrackWeekly": "{...}",
  // New addition:
  "fittrack_username": "Anuhya"
}
```

## Color Scheme

### Light Mode
- Modal background: `#ffffff` (white)
- Overlay: `rgba(0, 0, 0, 0.7)` with blur
- Primary button: `#c49a6c` (accent tan)
- Text: `#3b2a20` (dark brown)
- Navbar greeting bg: `rgba(196, 154, 108, 0.2)`

### Dark Mode
- Modal background: `#333333`
- Overlay: `rgba(0, 0, 0, 0.7)` with blur
- Primary button: `#c49a6c`
- Text: `#f5f5f5` (light)
- Navbar greeting bg: `rgba(196, 154, 108, 0.15)`

## Responsive Breakpoints

```
Mobile (< 768px):
- Navbar greeting: Smaller font (0.85rem)
- Modal: Full width (90%)
- Buttons: Stacked vertically

Tablet & Desktop (> 768px):
- Navbar greeting: Normal font (0.95rem)
- Modal: Fixed width (450px max)
- Buttons: Side by side
```

## Animation Timeline

```
Modal Appearance:
0ms   → Modal overlay fades in (opacity 0 → 1)
0ms   → Content slides down (translateY -30px → 0)
100ms → Input field auto-focuses
400ms → Animation complete

Modal Disappearance:
0ms   → Opacity transition (1 → 0)
300ms → Element removed from DOM
```

## Interaction States

### Input Field
```
Default:  [            ] border: #c49a6c
Focus:    [|           ] border: #5a3e2b + shadow + scale(1.02)
Error:    [            ] border: #e74c3c
Filled:   [John       ] border: #c49a6c
```

### Buttons
```
Default:  [ Button ] background: gradient(#c49a6c, #8b7355)
Hover:    [ Button ] translateY(-2px) + shadow
Active:   [ Button ] translateY(0)
Disabled: [ Button ] opacity: 0.6 + no pointer
```

## Success Messages

```
After name set:
┌────────────────────────────────────────┐
│ ✓ Name updated successfully!           │
└────────────────────────────────────────┘
(Appears for 3 seconds, then fades out)
```

## Privacy Notice Display

```
┌──────────────────────────────────────────┐
│ 💡 Your name is stored locally on your   │
│    device only                            │
└──────────────────────────────────────────┘
(Shown in first-time modal, small text, subtle)
```

## Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `Enter` | Submit name | Input field focused |
| `Escape` | Close modal | Edit name modal |
| `Tab` | Navigate | Between input and button |

## Avatar Generation

```
Profile avatar URL pattern:
https://api.dicebear.com/7.x/avataaars/svg?seed={username}

Examples:
- seed=Anuhya  → Unique avatar for "Anuhya"
- seed=John    → Unique avatar for "John"
- seed=Sarah   → Unique avatar for "Sarah"

Each name generates a consistent, unique avatar
```

## File Dependencies

```
HTML Page
    ↓
theme.js (loads first - handles dark mode)
    ↓
user-name.js (loads second - handles name)
    ↓
page-specific.js (loads last - e.g., index.js)
```

## Browser DevTools Console

```javascript
// Check if name is set
localStorage.getItem('fittrack_username')
// → "Anuhya"

// Set name manually
localStorage.setItem('fittrack_username', 'TestUser')

// Remove name (trigger first visit flow)
localStorage.removeItem('fittrack_username')

// View all FitTrack data
Object.keys(localStorage).filter(k => k.includes('fit'))
// → ["fitTrackSteps", "fittrack_username", "fitTrackWater", ...]
```

---

## Quick Reference

**First Visit:** Modal → Enter Name → Get Started → Personalized App
**Edit Name:** Profile → Change Name → Update → Instant Change
**Reset:** Clear localStorage → Refresh → Modal Appears Again

**Storage Key:** `fittrack_username`
**Storage Type:** `localStorage` (persistent)
**Privacy:** 100% client-side, no server
