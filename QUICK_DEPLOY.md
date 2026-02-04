# ⚡ Quick Deploy - Get Your Link in 5 Minutes!

## 🎯 Goal
Deploy your board so everyone can access it with just a URL - **no setup required for team members**!

---

## 🚀 Fastest Method: Vercel (Recommended)

### 1. Push to GitHub (2 min)

```bash
# Initialize git if you haven't already
git init
git add .
git commit -m "Oracle Design Board"
git branch -M main

# Create a new repo at: https://github.com/new
# Then run (replace YOUR_USERNAME):
git remote add origin https://github.com/YOUR_USERNAME/oracle-design-board.git
git push -u origin main
```

### 2. Deploy to Vercel (3 min)

1. **Go to:** https://vercel.com/signup
2. **Sign up** with GitHub
3. **Click:** "Add New..." → "Project"
4. **Import** your `oracle-design-board` repository
5. **Framework:** Vite (auto-detected)
6. **Add Environment Variables** (click "Environment Variables"):

Copy-paste these exactly:

```
VITE_FIREBASE_API_KEY
AIzaSyCknjodvT095K0M3ASxCEeeoChn9RBU1CQ

VITE_FIREBASE_AUTH_DOMAIN
realtime-board-ocd.firebaseapp.com

VITE_FIREBASE_DATABASE_URL
https://realtime-board-ocd-default-rtdb.firebaseio.com

VITE_FIREBASE_PROJECT_ID
realtime-board-ocd

VITE_FIREBASE_STORAGE_BUCKET
realtime-board-ocd.firebasestorage.app

VITE_FIREBASE_MESSAGING_SENDER_ID
258036246275

VITE_FIREBASE_APP_ID
1:258036246275:web:a93405647e4013aef3eb36
```

7. **Click "Deploy"**
8. **Wait 2-3 minutes** ⏱️
9. **Copy your URL!** (e.g., `oracle-design-board.vercel.app`)

---

## ✅ Done! Share With Team

Send this to your team:

```
🎉 Oracle Design Board is Live!

Link: https://your-app-url.vercel.app

Just open the link and enter your name - no installation needed!

Features:
✅ Real-time collaboration
✅ Drag & drop projects
✅ See who's online
✅ Tag teammates
✅ Track deliverables
```

---

## 🔄 Future Updates

**Automatic:** Every time you push to GitHub, Vercel auto-deploys!

```bash
# Make changes to your code
git add .
git commit -m "Updated features"
git push

# Vercel automatically redeploys! ✨
```

---

## 💡 Alternative: Firebase Hosting (If you prefer)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Choose 'dist' as public directory
# Choose 'Yes' for single-page app

npm run build
firebase deploy --only hosting

# Your URL: https://realtime-board-ocd.web.app
```

---

## 🆘 Need Help?

**Can't find GitHub repository?**
- Make sure it's under your account
- Repository must be pushed (check on GitHub.com)

**Vercel build fails?**
- Make sure `npm run build` works locally first
- Check that all environment variables are added

**App works locally but not deployed?**
- Verify all 7 Firebase env vars are added to Vercel
- Hard refresh browser: `Ctrl + Shift + R`

---

**That's it! 🎉 Your team can now collaborate in real-time!**
