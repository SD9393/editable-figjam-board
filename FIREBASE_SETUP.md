# Firebase Setup Guide for Real-Time Collaboration

Your Project Board now supports real-time collaboration! Follow these steps to set up Firebase and enable live updates for your team.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "Oracle Project Board")
4. Optional: Enable Google Analytics (you can skip this)
5. Click "Create project"

## Step 2: Create a Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Register your app:
   - App nickname: "Oracle Project Board Web"
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

## Step 3: Get Your Firebase Configuration

After registering your app, Firebase will show you a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**Copy this entire configuration!**

## Step 4: Enable Realtime Database

1. In the Firebase Console, click **"Realtime Database"** in the left sidebar (under "Build")
2. Click **"Create Database"**
3. Choose a location (e.g., United States)
4. **Security Rules**: Select **"Start in test mode"** for now
   - This allows read/write access for 30 days
   - We'll secure it in Step 6
5. Click "Enable"

## Step 5: Update Your Code

Open `/src/config/firebase.ts` and replace the placeholder values with your actual Firebase configuration:

```typescript
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Replace these with YOUR actual Firebase project credentials
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
```

## Step 6: Secure Your Database (Important!)

By default, test mode allows anyone with your database URL to read/write data. For a collaborative board where "anyone with the link can edit", use these rules:

1. In Firebase Console, go to **Realtime Database** → **Rules** tab
2. Replace the rules with:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **Security Note**: These rules allow anyone with the database URL to access your data. For better security, consider:

- **Option A - Restrict by Domain**: Only allow requests from your specific domain
- **Option B - Add Simple Password**: Implement a simple shared password in your app
- **Option C - Use Firebase Authentication**: Add user login (more complex but most secure)

For production use, I recommend Option C. Let me know if you want help implementing authentication!

## Step 7: Share Your Board

Once Firebase is configured:

1. **Deploy your board** to a hosting service:
   - [Vercel](https://vercel.com/) (Easiest - free tier available)
   - [Netlify](https://www.netlify.com/) (Also easy - free tier)
   - Firebase Hosting (included with your Firebase project)

2. **Share the URL** with your team members

3. When someone visits for the first time, they'll be prompted to enter their name

4. All changes will sync in real-time across all users! 🎉

## Features Enabled

✅ **Real-time Updates**: Changes appear instantly for all users  
✅ **Change Tracking**: See who made the last edit and when  
✅ **User Identification**: Each user enters their name on first visit  
✅ **Persistent Data**: All data stored in Firebase (not just browser storage)  
✅ **Collaborative Editing**: Multiple people can edit simultaneously

## Troubleshooting

### "Permission denied" error
- Check that your Realtime Database rules allow read/write access
- Verify the `databaseURL` in your config is correct

### Changes not syncing
- Open browser console (F12) and check for errors
- Verify your Firebase config is correct
- Make sure you're using the same Firebase project for all users

### "Firebase not initialized" error
- Check that `/src/config/firebase.ts` has valid credentials
- Verify the imports are correct

## Need Help?

If you encounter any issues:
1. Check the browser console (F12) for error messages
2. Verify all configuration values are correct (no "YOUR_" placeholders)
3. Ensure Firebase Realtime Database is enabled in your project

Let me know if you need any assistance! 🚀
