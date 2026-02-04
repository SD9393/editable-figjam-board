// DO NOT MODIFY — VERIFIED FIREBASE CONFIG (used by production)

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase configuration is complete
const isConfigured = firebaseConfig.apiKey && firebaseConfig.databaseURL && firebaseConfig.projectId;

// Prevent duplicate Firebase initialization and handle missing config
let app;
let database;

if (isConfigured) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  database = getDatabase(app);
} else {
  console.warn('Firebase configuration is incomplete. Please set environment variables.');
  database = null;
}

export const db = database;
