# Firebase Testing Guide

## Quick Test: Is Firebase Working?

Open your browser console and look for one of these messages:

### ✅ Firebase Enabled:
```
✅ Firebase initialized successfully. Real-time sync is enabled.
```

### ⚠️ Firebase Disabled (Local Mode):
```
⚠️ Firebase is not configured. Real-time sync will be disabled.
To enable Firebase, add your credentials to the .env file:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_DATABASE_URL
See .env.example for the template.
```

## Test Scenarios

### Test 1: Local-Only Mode (No Firebase)
**Steps:**
1. Ensure no `.env` file exists (or rename it temporarily)
2. Start the app: `npm run dev`
3. Check browser console

**Expected:**
- ⚠️ Warning about Firebase not configured
- ❌ No errors
- ✅ App works normally in local mode
- ❌ Changes don't sync across tabs

### Test 2: Firebase Enabled Mode
**Steps:**
1. Create `.env` from `.env.example`
2. Add your Firebase credentials
3. Restart: `npm run dev`
4. Check browser console

**Expected:**
- ✅ Success message about Firebase initialization
- ❌ No warnings or errors
- ✅ App works normally
- ✅ Changes sync across tabs

### Test 3: Real-time Sync Verification
**Steps:**
1. Open app in two browser tabs/windows (with Firebase enabled)
2. In Tab 1: Add a new project card
3. Watch Tab 2

**Expected:**
- ✅ New card appears instantly in Tab 2
- ✅ No page refresh needed

### Test 4: Data Persistence
**Steps:**
1. Add/edit several projects (with Firebase enabled)
2. Close all browser tabs
3. Open app again

**Expected:**
- ✅ All changes are preserved
- ✅ Data loads from Firebase

### Test 5: Array Guard Protection
**Steps:**
1. With Firebase enabled, check browser console
2. Make various changes (add, edit, delete projects)

**Expected:**
- ❌ No "undefined" errors
- ❌ No "cannot read property of undefined" errors
- ✅ All operations work smoothly

## Console Messages Reference

### Normal Operation (Firebase Enabled)
```
✅ Firebase initialized successfully. Real-time sync is enabled.
```

### Normal Operation (Firebase Disabled)
```
⚠️ Firebase is not configured. Real-time sync will be disabled.
To enable Firebase, add your credentials to the .env file:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_DATABASE_URL
See .env.example for the template.
```

### Error (Something Wrong)
```
❌ Failed to initialize Firebase: [error details]
```

## Troubleshooting

### Problem: Warning appears even with .env configured

**Solution:**
1. Check that all required variables are set in `.env`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_DATABASE_URL`
2. Restart dev server: Stop and run `npm run dev` again
3. Clear browser cache and reload

### Problem: Changes not syncing across tabs

**Checklist:**
- [ ] Firebase success message appears in console
- [ ] Database URL is correct (ends with `.firebaseio.com`)
- [ ] Firebase Realtime Database is enabled in Firebase Console
- [ ] Database rules allow read/write access
- [ ] Both tabs are using the same Firebase project

### Problem: "Permission denied" errors

**Solution:**
1. Go to Firebase Console
2. Navigate to Realtime Database > Rules
3. Update rules to allow access (see FIREBASE_SETUP.md)
4. Publish the rules

### Problem: Data not persisting after refresh

**Possible causes:**
- Firebase not configured correctly
- Database rules blocking writes
- Network connectivity issues

**Debug steps:**
1. Open browser Network tab
2. Look for Firebase requests
3. Check for 403 (permission denied) or 401 (unauthorized) errors

## Verification Checklist

After setup, verify the following:

- [ ] ✅ Browser console shows Firebase success message
- [ ] ❌ No "Firebase is not initialized" warnings
- [ ] ❌ No undefined/null errors in console
- [ ] ✅ Changes sync across multiple browser tabs instantly
- [ ] ✅ Data persists after closing and reopening app
- [ ] ✅ All CRUD operations work (Create, Read, Update, Delete)
- [ ] ✅ Drag-and-drop updates sync in real-time
- [ ] ✅ Teammate management syncs across team
- [ ] ✅ Custom rows sync properly

## Code Verification

### Check 1: Firebase Import
Open `/src/app/components/FigJamBoard.tsx` and verify line 4:
```typescript
import { db, isFirebaseConfigured } from '@/config/firebase';
```

### Check 2: Firebase Export
Open `/src/config/firebase.ts` and verify line 49:
```typescript
export { db, isFirebaseConfigured };
```

### Check 3: Database Initialization
Open `/src/config/firebase.ts` and verify line 40:
```typescript
db = getDatabase(app);
```

### Check 4: Array Guards
Open `/src/app/components/FigJamBoard.tsx` and verify lines 850-859:
```typescript
if (Array.isArray(data)) {
  setProjects(data);
} else if (data === null || data === undefined) {
  // Initialize with default data if empty
  set(projectsRef, cleanFirebaseData(initialProjects));
  setProjects(initialProjects);
} else {
  // Fallback for invalid data structure
  setProjects(initialProjects);
}
```

## Performance Check

With Firebase enabled, the app should:
- ✅ Load initial data within 1-2 seconds
- ✅ Sync changes across tabs within 100-500ms
- ✅ Handle 50+ projects without lag
- ✅ Support 10+ concurrent users

## Security Reminders

- ❌ Never commit `.env` to version control
- ✅ Add `.env` to `.gitignore`
- ✅ Share credentials securely with team (1Password, etc.)
- ✅ Use production security rules in Firebase
- ✅ Consider adding Firebase Authentication for production

## Success Criteria

You'll know Firebase is working correctly when:

1. **Console Message**: "✅ Firebase initialized successfully"
2. **No Warnings**: No "not initialized" messages
3. **No Errors**: No undefined/null errors
4. **Real-time Sync**: Changes appear instantly in other tabs
5. **Data Persistence**: Data survives page refresh
6. **Array Safety**: No crashes from undefined arrays

## Need Help?

If you encounter issues:
1. Check `/FIREBASE_SETUP.md` for setup instructions
2. Review `/FIREBASE_FIX_SUMMARY.md` for technical details
3. Verify all checklist items above
4. Check Firebase Console for database status
5. Review browser console for specific error messages
