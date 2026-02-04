# Firebase Quick Reference Card

## 🚀 Quick Start

### Enable Firebase (3 Steps):
```bash
# 1. Copy template
cp .env.example .env

# 2. Edit .env and add your Firebase credentials

# 3. Restart dev server
npm run dev
```

## ✅ Success Indicator

Look for this in browser console:
```
✅ Firebase initialized successfully. Real-time sync is enabled.
```

## 📋 Required Environment Variables

All must be in `.env` file:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 🔧 Code Pattern Reference

### Correct Import Pattern:
```typescript
import { db, isFirebaseConfigured } from '@/config/firebase';
import { ref, set, onValue, update } from 'firebase/database';
```

### Correct Firebase Reference:
```typescript
const myRef = ref(db, 'my-path');
```

### Correct Array Guard:
```typescript
onValue(myRef, (snapshot) => {
  const data = snapshot.val();
  if (Array.isArray(data)) {
    setState(data);
  } else if (data === null || data === undefined) {
    setState([]);
  } else {
    setState([]);
  }
});
```

## 🎯 Key Rules

1. ✅ **DO**: Export and import `db` (not "database")
2. ✅ **DO**: Use `ref(db, path)` for all references
3. ✅ **DO**: Check `Array.isArray()` before setting state
4. ✅ **DO**: Initialize Firebase only once
5. ❌ **DON'T**: Use variable named "database"
6. ❌ **DON'T**: Assume snapshot.val() returns an array
7. ❌ **DON'T**: Commit `.env` to git

## 🧪 Quick Test

### Test Real-time Sync:
1. Open app in 2 browser tabs
2. Edit a project in Tab 1
3. See instant update in Tab 2

### Console Check:
- ✅ Success message = Firebase working
- ⚠️ Warning = Local mode (no sync)
- ❌ Error = Something needs fixing

## 📚 Full Documentation

- **Setup**: `/FIREBASE_SETUP.md`
- **Technical Details**: `/FIREBASE_FIX_SUMMARY.md`
- **Testing**: `/FIREBASE_TESTING_GUIDE.md`

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Warning appears | Add all env vars to `.env`, restart server |
| No sync | Check Firebase Console rules, verify DATABASE_URL |
| Permission denied | Update database rules in Firebase Console |
| Data not persisting | Verify Firebase is initialized (check console) |

## 💡 Pro Tips

- Use Chrome DevTools → Network tab to debug Firebase requests
- Check Firebase Console → Realtime Database → Data to see live updates
- All team members need the same Firebase project credentials
- Restart dev server after any `.env` changes

## 🎉 Current Status

After the fixes:
- ✅ Firebase initializes automatically when configured
- ✅ No warning messages when working correctly
- ✅ Safe array guards prevent undefined errors
- ✅ Real-time sync works across all team members
- ✅ Single initialization pattern
- ✅ Correct import/export pattern throughout
