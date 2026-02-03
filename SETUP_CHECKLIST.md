# Setup Checklist - Get Your Board Live! ✅

Follow this checklist to get your real-time collaborative board up and running.

## Phase 1: Firebase Setup (15 minutes)

- [ ] **Create Firebase Account**
  - Go to [console.firebase.google.com](https://console.firebase.google.com)
  - Sign in with Google account

- [ ] **Create New Firebase Project**
  - Click "Add project"
  - Name: "Oracle Project Board" (or your choice)
  - Disable Google Analytics (optional)
  - Click "Create project"

- [ ] **Create Web App in Firebase**
  - Click the Web icon (`</>`)
  - App nickname: "Oracle Project Board Web"
  - Don't check "Firebase Hosting" yet
  - Click "Register app"

- [ ] **Copy Firebase Configuration**
  - Copy the entire `firebaseConfig` object
  - Save it temporarily in a text file

- [ ] **Enable Realtime Database**
  - In Firebase Console, click "Realtime Database" (left sidebar)
  - Click "Create Database"
  - Choose location: United States (or your region)
  - Security rules: "Start in test mode"
  - Click "Enable"

- [ ] **Set Database Rules**
  - Go to Realtime Database → Rules tab
  - Replace with:
    ```json
    {
      "rules": {
        ".read": true,
        ".write": true
      }
    }
    ```
  - Click "Publish"

- [ ] **Update Firebase Config in Your Code**
  - Open `/src/config/firebase.ts`
  - Replace placeholder values with YOUR actual config
  - Save the file

- [ ] **Test Firebase Connection Locally**
  - Run `npm install` (ensure firebase package installed)
  - Run `npm run dev`
  - Open `http://localhost:5173`
  - Enter your name when prompted
  - Create a test project
  - Check Firebase Console → Realtime Database → Data
  - You should see your data appear!

---

## Phase 2: Local Testing (10 minutes)

- [ ] **Test User Identification**
  - Open board in your browser
  - Enter your name (e.g., "Admin")
  - Verify name appears in top toolbar

- [ ] **Test Real-Time Sync**
  - Keep first browser window open
  - Open same URL in incognito/private window
  - Enter different name (e.g., "Test User")
  - Make changes in one window
  - Verify changes appear instantly in other window

- [ ] **Test All Features**
  - [ ] Create new project card
  - [ ] Edit project name
  - [ ] Add/check subtasks
  - [ ] Change status (click badge)
  - [ ] Drag card to different priority
  - [ ] Set deliverable date
  - [ ] Assign owner
  - [ ] Tag teammates
  - [ ] Add custom row
  - [ ] Delete test card

- [ ] **Verify Change Tracking**
  - Edit any project
  - Check bottom of card shows "Last edited by [Your Name]"
  - Verify timestamp is correct

- [ ] **Check Data Persistence**
  - Close browser
  - Reopen board URL
  - Verify all data is still there (loaded from Firebase)

---

## Phase 3: Deployment (20 minutes)

Choose ONE deployment method:

### Option A: Vercel (Recommended)

- [ ] Create account at [vercel.com](https://vercel.com)
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login: `vercel login`
- [ ] Deploy: `vercel`
- [ ] Follow prompts (all defaults are fine)
- [ ] Copy the production URL (e.g., `your-board.vercel.app`)

### Option B: Netlify

- [ ] Create account at [netlify.com](https://netlify.com)
- [ ] Build locally: `npm run build`
- [ ] Go to Netlify dashboard
- [ ] Drag `dist` folder to deploy area
- [ ] Copy the URL (e.g., `your-board.netlify.app`)

### Option C: Firebase Hosting

- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Login: `firebase login`
- [ ] Initialize: `firebase init hosting`
  - Select your Firebase project
  - Public directory: `dist`
  - Single-page app: `Yes`
- [ ] Build: `npm run build`
- [ ] Deploy: `firebase deploy`
- [ ] Copy the URL (e.g., `your-project.web.app`)

---

## Phase 4: Test Deployed Board (5 minutes)

- [ ] **Open Deployed URL**
  - Visit the URL from your deployment
  - Should load without errors

- [ ] **Test User Flow**
  - Enter your name when prompted
  - Create a test project
  - Verify it saves (check Firebase Console)

- [ ] **Test from Different Device**
  - Open URL on your phone/tablet
  - Enter different name
  - Make changes
  - Verify sync works across devices

- [ ] **Clear Test Data** (optional)
  - Go to Firebase Console → Realtime Database
  - Delete test projects if needed
  - Your original 16 projects should repopulate

---

## Phase 5: Share with Team (5 minutes)

- [ ] **Prepare Team Communication**
  - Board URL: `[your-deployed-url]`
  - Subject: "New Real-Time Project Board - Oracle Conversation Design Team"
  
- [ ] **Send Email to Team**
  - Include the board URL
  - Attach or paste `TEAM_QUICK_START.md` content
  - Instructions: "Open link, enter your name, start collaborating!"

- [ ] **Optional: Share Quick Video**
  - Record 2-minute screen recording showing:
    - How to enter name
    - How to edit projects
    - How real-time sync works
    - How to assign owners/tags

- [ ] **Pin URL in Team Chat**
  - Slack/Teams/Email signature
  - Make it easily accessible

---

## Phase 6: Monitor & Maintain (Ongoing)

- [ ] **Check Firebase Usage**
  - Firebase Console → Usage tab
  - Monitor connections and data transfer
  - Free tier should be sufficient

- [ ] **Monitor for Issues**
  - First few days: Check if team has questions
  - Watch for duplicate/test data
  - Verify notifications are working

- [ ] **Gather Feedback**
  - After 1 week, ask team:
    - Is everything working smoothly?
    - Are there features they want?
    - Any confusing aspects?

- [ ] **Plan Enhancements** (Optional)
  - Based on feedback, consider:
    - Adding authentication
    - Custom fields
    - Integration with other tools
    - Reports/analytics

---

## Troubleshooting Checklist

If something doesn't work, check:

- [ ] **Firebase config is correct** in `/src/config/firebase.ts`
- [ ] **No placeholder values** (no "YOUR_API_KEY_HERE" remaining)
- [ ] **Database rules allow read/write** (check Firebase Console)
- [ ] **Internet connection** is working
- [ ] **Browser console** for error messages (F12)
- [ ] **Firebase project** is in the correct region
- [ ] **Dependencies installed**: `npm list firebase`
- [ ] **Build succeeds locally**: `npm run build`

---

## Success Criteria ✅

You're done when:

✅ Board loads at deployed URL  
✅ Multiple users can see each other's changes in real-time  
✅ Changes show "Last edited by [Name]"  
✅ All CRUD operations work (Create, Read, Update, Delete)  
✅ Data persists after page refresh  
✅ Team members can access and use the board  

---

## Time Estimate

- **Total Setup Time**: ~55 minutes
- **Firebase Setup**: 15 min
- **Local Testing**: 10 min  
- **Deployment**: 20 min
- **Testing Deployed**: 5 min
- **Team Sharing**: 5 min

---

## Quick Reference URLs

- **Firebase Console**: https://console.firebase.google.com
- **Vercel**: https://vercel.com
- **Netlify**: https://netlify.com
- **Your Deployed Board**: `_____________` (fill in after deployment)

---

## Need Help?

**Common Issues & Solutions**:

| Issue | Solution |
|-------|----------|
| "Permission denied" | Check Firebase database rules |
| "Firebase not defined" | Verify config in `firebase.ts` |
| Changes not syncing | Check internet, verify Firebase rules |
| Blank page | Check browser console (F12) for errors |
| Build fails | Run `npm install`, check for errors |

**Still stuck?** Check:
1. Browser console (F12) for error messages
2. Firebase Console → Realtime Database → Data (is data there?)
3. Network tab (are requests to Firebase succeeding?)

---

## You're All Set! 🎉

Once you've checked all the boxes above, your team can start collaborating in real-time!

**What You've Built**:
- ✅ Real-time collaborative project board
- ✅ Multi-user support with change tracking
- ✅ Cloud-based data storage
- ✅ Email notifications
- ✅ Professional team workspace

**Next Steps**:
1. Monitor usage for first week
2. Gather team feedback
3. Plan future enhancements
4. Enjoy seamless collaboration!

---

**Questions?** Refer to the documentation:
- `FIREBASE_SETUP.md` - Detailed Firebase guide
- `DEPLOYMENT_GUIDE.md` - Deployment options
- `TEAM_QUICK_START.md` - User instructions
- `README.md` - Project overview

Happy collaborating! 🚀
