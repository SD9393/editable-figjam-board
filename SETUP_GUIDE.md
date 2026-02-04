# 🔧 Quick Setup Guide

This guide will help you set up the project board from scratch in **under 10 minutes**.

## ✅ Prerequisites

- Node.js 18+ installed
- A Google/Gmail account (for Firebase)
- Basic terminal/command line knowledge

---

## 📝 Step-by-Step Setup

### 1️⃣ Clone/Download the Project

```bash
# If you received the project files, navigate to the directory
cd project-board
```

### 2️⃣ Install Dependencies

```bash
npm install
```

This will install all required packages including React, Firebase, and Tailwind CSS.

### 3️⃣ Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `oracle-project-board` (or any name you prefer)
4. Disable Google Analytics (optional, not needed for this project)
5. Click **"Create project"**

### 4️⃣ Enable Realtime Database

1. In Firebase Console, click **"Realtime Database"** in the left sidebar
2. Click **"Create Database"**
3. Choose a location (e.g., `us-central1`)
4. Start in **"Test mode"** (we'll secure it later)
5. Click **"Enable"**

### 5️⃣ Get Firebase Configuration

1. In Firebase Console, click the ⚙️ gear icon → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **web icon** (`</>`) to add a web app
4. Enter app nickname: `Project Board Web`
5. Click **"Register app"**
6. **Copy the configuration values** - you'll need these in the next step

### 6️⃣ Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Open `.env` and fill in your Firebase credentials:**
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyC...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456:web:abc123
   ```

   **Where to find these values:**
   - From Step 5 above, copy each value from the Firebase config object
   - `apiKey` → `VITE_FIREBASE_API_KEY`
   - `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
   - `databaseURL` → `VITE_FIREBASE_DATABASE_URL`
   - `projectId` → `VITE_FIREBASE_PROJECT_ID`
   - `storageBucket` → `VITE_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `VITE_FIREBASE_APP_ID`

3. **Save the `.env` file**

   ⚠️ **IMPORTANT**: Never commit `.env` to Git! It's already in `.gitignore`.

### 7️⃣ Set Firebase Database Rules

1. In Firebase Console → **Realtime Database** → **Rules** tab
2. Replace with these rules (allows anyone with the link to edit):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

3. Click **"Publish"**

**🔒 For Better Security (Optional):**
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
*(Requires adding Firebase Authentication - see `FIREBASE_SETUP.md` for details)*

### 8️⃣ Run the Project Locally

```bash
npm run dev
```

The app should open at `http://localhost:5173` (or another port if 5173 is busy).

### 9️⃣ Test It!

1. Enter your name when prompted
2. Try editing a project card
3. Open another browser window (incognito mode)
4. Enter a different name
5. Make changes in one window → they should appear instantly in the other!

---

## 🚀 Deploy to Vercel (Recommended)

### Why Vercel?
- Free tier (perfect for teams)
- Automatic HTTPS
- Global CDN
- Easy environment variables setup
- Deploy in under 2 minutes

### Steps:

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Push Code to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

3. **Import to Vercel**
   - Click **"Add New Project"** in Vercel dashboard
   - Import your Git repository
   - Vercel auto-detects it's a Vite project ✅

4. **Add Environment Variables**
   - In deployment settings, click **"Environment Variables"**
   - Add all variables from your `.env` file:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_DATABASE_URL`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

5. **Deploy!**
   - Click **"Deploy"**
   - Wait ~1 minute
   - Get your live URL: `https://your-project.vercel.app`

---

## 📱 Share with Your Team

### Send them:
1. **The deployed URL**
   - Example: `https://oracle-board.vercel.app`

2. **Quick instructions:**
   ```
   Welcome to the Project Board!
   
   1. Open: https://your-project.vercel.app
   2. Enter your name (first time only)
   3. Click "How to Use" for instructions
   4. Start collaborating!
   
   All changes sync in real-time across all users.
   ```

3. **The `TEAM_QUICK_START.md` file** (optional)
   - More detailed instructions
   - Tips and tricks

---

## 🐛 Troubleshooting

### "Permission Denied" Error
- Check Firebase Database Rules (Step 7)
- Make sure rules are set to allow read/write

### Changes Not Syncing
- Verify all environment variables are set correctly
- Check browser console (F12) for errors
- Ensure Firebase Realtime Database is enabled

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Environment Variables Not Working
- Make sure variable names start with `VITE_`
- Restart the dev server after changing `.env`
- For Vercel, re-deploy after adding variables

---

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Realtime Database enabled
- [ ] `.env` file created with all credentials
- [ ] Firebase rules set to allow read/write
- [ ] Project runs locally (`npm run dev`)
- [ ] Changes sync between two browser windows
- [ ] Project deployed to Vercel/Netlify
- [ ] Environment variables added to hosting platform
- [ ] Deployed app works in production
- [ ] Team members can access and edit

---

## 🎉 You're Done!

Your project board is now:
- ✅ Running in production
- ✅ Accessible to your team
- ✅ Syncing in real-time
- ✅ Storing data in the cloud

**Next Steps:**
- Add team members' emails for notifications
- Customize priority rows for your workflow
- Explore the "How to Use" guide in the app

Need help? Check `FIREBASE_SETUP.md` for detailed documentation.

---

**Last Updated:** February 3, 2026
