# Firebase Setup Guide

## Overview
This project uses Firebase Realtime Database for real-time collaboration. Follow these steps to set up Firebase for your team.

## Steps to Configure Firebase

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2. Enable Realtime Database
1. In your Firebase project, go to **Build > Realtime Database**
2. Click "Create Database"
3. Choose a location for your database
4. Start in **test mode** for development (you can secure it later)

### 3. Get Your Firebase Configuration
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the **</>** (web) icon to add a web app
4. Register your app with a nickname
5. Copy the configuration values

### 4. Update Your .env File
1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 5. Restart Your Development Server
After updating the `.env` file, restart your development server for the changes to take effect.

## Security Rules (Important!)

For production, update your Firebase Realtime Database rules:

1. Go to **Build > Realtime Database > Rules**
2. Use these recommended rules:

```json
{
  "rules": {
    "projects": {
      ".read": true,
      ".write": true
    },
    "customRows": {
      ".read": true,
      ".write": true
    },
    "teammates": {
      ".read": true,
      ".write": true
    }
  }
}
```

For enhanced security, you can add authentication and more granular rules based on your team's needs.

## Troubleshooting

### "Can't determine Firebase Database URL" Error
- Make sure you've added the `VITE_FIREBASE_DATABASE_URL` to your `.env` file
- Verify the database URL matches your Firebase project (should end with `.firebaseio.com`)
- Restart your development server after making changes

### Changes Not Syncing
- Check your browser console for Firebase errors
- Verify your database rules allow read/write access
- Make sure all team members are using the same Firebase project

## Features Using Firebase

- ✅ Real-time project updates across all team members
- ✅ Drag-and-drop priority changes sync instantly
- ✅ Custom row creation and editing
- ✅ Teammate management with email notifications
- ✅ Edit tracking (who changed what and when)

## Local Development Without Firebase

The app will work in local-only mode if Firebase is not configured. Changes will be stored in browser state but won't sync across team members.
