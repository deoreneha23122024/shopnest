// src/firebase.js
// ─────────────────────────────────────────────────────────────────────────────
// Firebase configuration for ShopNest
// 
// HOW TO SET UP:
// 1. Go to https://console.firebase.google.com
// 2. Create project "ShopNest"
// 3. Authentication → Sign-in method → Enable Google + Phone Number
// 4. Project Settings → General → Your Apps → Add Web App (</>)
// 5. Copy the firebaseConfig values into your .env file:
//    VITE_FIREBASE_API_KEY=...
//    VITE_FIREBASE_AUTH_DOMAIN=...
//    VITE_FIREBASE_PROJECT_ID=...
//    VITE_FIREBASE_APP_ID=...
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCwG0KZCUohEMLE-6iCutyfNFyMn5_ItZs",
  authDomain: "shopnest-97cbe.firebaseapp.com",
  projectId: "shopnest-97cbe",
  storageBucket: "shopnest-97cbe.firebasestorage.app",
  messagingSenderId: "394126701745",
  appId: "1:394126701745:web:1246d7429a8409e13c5e90",
  measurementId: "G-6MS7V618GS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.settings.appVerificationDisabledForTesting = true;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
