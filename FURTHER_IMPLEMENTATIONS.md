# Further Implementations & Improvements for ADHDAssist (adhdtm)

This document outlines the current status of the project, identified issues, and a roadmap for further implementations to enhance functionality, security, and maintainability.

## 1. Current Project Status

### What's Working:
- **Core Task Management:** Adding, updating, deleting, and filtering tasks works well.
- **Authentication:** Login and Registration are functional using Firebase Auth.
- **Pomodoro Timer:** A feature-rich timer with custom settings, animations, and music support.
- **Gamification:** Unlockable game logic after completing tasks is implemented.
- **Navigation:** A robust navigation structure using Stack, Tab, and Drawer navigators.

### Critical Bugs & Issues Identified:
- **Firebase Storage Missing Export:** `firebase.js` does not export `storage`, causing `UserProfileScreen.js` to crash when uploading profile pictures.
- **Missing Function in TaskContext:** `getTaskCompletionByHour` is used in `ProgressReportScreen.js` but is not defined in `TaskContext.js`.
- **Redundant Auth State:** `AuthContext.js` maintains a local email/password state which is redundant and less secure than relying solely on Firebase's `onAuthStateChanged`.
- **Broken Test Suite:** Jest is failing to parse `firebase` due to ESM (ECMAScript Modules) compatibility issues in the current configuration.
- **Hardcoded Secrets:** Firebase configuration is hardcoded in `firebase.js`.
- **Deprecated Library:** `react-native-voice` is used in `package.json` but is deprecated; should be replaced with `@react-native-community/voice` if voice features are to be implemented.

---

## 2. Recommended Immediate Fixes

### A. Fix Firebase Storage
Add the following to `firebase.js`:
```javascript
import { getStorage } from 'firebase/storage';
// ...
const storage = getStorage(app);
export { auth, firestore, storage };
```

### B. Implement Missing Logic in TaskContext
Add `getTaskCompletionByHour` to `TaskContext.js` to fix the Progress Report screen.

### C. Update Jest Configuration
Consolidate `transformIgnorePatterns` in `jest.config.js` to properly transform Firebase and other ESM modules.

### D. Security Hardening
- Move Firebase config to a `.env` file using `react-native-dotenv` or Expo's built-in environment variable support.
- Remove sensitive data (email/password) from `AuthContext` state.

---

## 3. Future Roadmap & Implementations

### Phase 1: Stability & Best Practices
- **TypeScript Migration:** Convert the project to TypeScript for better type safety and developer experience.
- **Error Boundaries:** Implement React Error Boundaries to prevent the entire app from crashing on UI errors.
- **Robust Error Handling:** Add global toast notifications for Firebase errors and network issues.

### Phase 2: Feature Enhancement
- **Push Notifications:** Implement daily reminders for tasks using `expo-notifications`.
- **Voice-to-Task:** Implement voice commands to add tasks, utilizing the voice libraries already in `package.json`.
- **Dark Mode:** Add support for system-wide dark mode using `useColorScheme`.
- **Advanced Analytics:** Enhance the Progress Report with more detailed insights (e.g., productivity trends over months).

### Phase 3: UX & UI Polish
- **Haptic Feedback:** Add subtle vibrations for task completion and timer alerts.
- **Micro-animations:** Use `react-native-reanimated` for smoother transitions between screens and task interactions.
- **Offline Support:** Implement Firestore offline persistence to allow task management without an internet connection.

### Phase 4: Extended Gamification
- **Leveling System:** Introduce XP and levels based on task completion.
- **Reward Store:** Allow users to "buy" custom app themes or new game levels with "points" earned from tasks.
- **Leaderboards:** (Optional) Add a social element where users can see friend's productivity streaks.

---

## 4. Maintenance Checklist
- [ ] Run `npm audit fix` to address dependency vulnerabilities.
- [ ] Replace `react-native-voice` with `@react-native-community/voice`.
- [ ] Implement unit tests for all Context providers.
- [ ] Clean up unused assets in the `assets` folder.
