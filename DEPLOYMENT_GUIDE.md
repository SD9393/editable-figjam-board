# Deployment Guide - Share Your Board with Your Team

After setting up Firebase, you need to deploy your board so your team can access it via a URL. Here are the easiest options:

## Option 1: Vercel (Recommended - Easiest!)

Vercel is perfect for React apps and offers a generous free tier.

### Steps:

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Install Vercel CLI** (if deploying from command line)
   ```bash
   npm install -g vercel
   ```

3. **Deploy from Command Line**
   ```bash
   # In your project directory
   vercel login
   vercel
   ```
   
   Or **Deploy from GitHub**:
   - Push your code to a GitHub repository
   - Import the repository in Vercel dashboard
   - Vercel auto-detects Vite and builds it

4. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Get Your URL**
   - Vercel provides: `your-project.vercel.app`
   - Share this URL with your team!

**Pros**: Fast, free, auto-deploys on git push, custom domains  
**Cons**: None for this use case

---

## Option 2: Netlify

Another excellent free option with drag-and-drop deployment.

### Steps:

1. **Create a Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up free

2. **Deploy via Drag & Drop**
   - Build your project locally: `npm run build`
   - Drag the `dist` folder to Netlify's drop zone
   - Done!

   Or **Deploy from Git**:
   - Connect your GitHub/GitLab repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Get Your URL**
   - Netlify provides: `your-project.netlify.app`

**Pros**: Drag-and-drop option, free SSL, custom domains  
**Cons**: None for this use case

---

## Option 3: Firebase Hosting

Since you're already using Firebase, you can host there too!

### Steps:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Hosting**
   ```bash
   firebase init hosting
   ```
   
   - Select your Firebase project
   - Public directory: `dist`
   - Single-page app: `Yes`
   - Auto builds: No

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

5. **Get Your URL**
   - Firebase provides: `your-project.web.app`

**Pros**: All in one place with Firebase, free tier  
**Cons**: Requires CLI setup

---

## Option 4: GitHub Pages

Free hosting directly from your GitHub repository.

### Steps:

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add to scripts:
   ```json
   "scripts": {
     "build": "vite build",
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
   
   Add homepage (replace with your username/repo):
   ```json
   "homepage": "https://yourusername.github.io/repository-name"
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Get Your URL**
   - GitHub provides: `yourusername.github.io/repository-name`

**Pros**: Free, integrates with GitHub  
**Cons**: Requires git setup, slightly more complex

---

## After Deployment

### 1. Test Your Board
- Open the deployed URL
- Enter your name when prompted
- Create a test project
- Open the same URL in another browser/incognito
- Enter a different name
- Verify real-time sync works

### 2. Share with Your Team
Send them:
- **Board URL**: Your deployed link
- **Quick Start Guide**: Share `TEAM_QUICK_START.md`
- **Instructions**: "Open the link, enter your name, start collaborating!"

### 3. Monitor Usage
- Check Firebase Console → Realtime Database to see live data
- Monitor Firebase Console → Usage for connection stats

---

## Environment Variables (Optional)

For better security, you can use environment variables for Firebase config:

### Create `.env` file:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Update `/src/config/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

Then add these environment variables in your hosting platform (Vercel/Netlify settings).

---

## Custom Domain (Optional)

All platforms support custom domains:

- **Vercel**: Settings → Domains → Add Domain
- **Netlify**: Domain settings → Add custom domain
- **Firebase**: Hosting → Add custom domain

Example: `projects.oracle-design-team.com`

---

## Troubleshooting Deployment

### Build fails
- Run `npm run build` locally first
- Check for console errors
- Ensure all dependencies are in package.json

### Blank page after deployment
- Check browser console for errors
- Verify Firebase config is correct
- Check that paths use `/` not relative paths

### Real-time sync not working
- Verify Firebase database rules allow read/write
- Check Firebase config in deployed version
- Test Firebase connection in console

---

## Quick Comparison

| Platform | Ease | Speed | Free Tier | Best For |
|----------|------|-------|-----------|----------|
| **Vercel** | ⭐⭐⭐⭐⭐ | Fastest | Yes | Most users |
| **Netlify** | ⭐⭐⭐⭐⭐ | Fast | Yes | Drag-drop lovers |
| **Firebase** | ⭐⭐⭐ | Fast | Yes | Firebase users |
| **GitHub Pages** | ⭐⭐⭐ | Medium | Yes | GitHub projects |

**Recommendation**: Use **Vercel** for the easiest setup and best performance.

---

## Next Steps

1. Choose your deployment platform
2. Follow the steps above
3. Test the deployed board
4. Share the URL with your Oracle Conversation Design Team
5. Start collaborating in real-time! 🚀

Need help with deployment? Let me know which platform you choose and I can provide more detailed guidance!
