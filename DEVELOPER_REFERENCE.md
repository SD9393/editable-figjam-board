# 🚀 Developer Quick Reference

## Firebase Integration Patterns

### ✅ Correct Import
```typescript
import { db } from '@/config/firebase';
import { ref, set, onValue, update } from 'firebase/database';
```

### ❌ Never Use
```typescript
import { database } from '@/config/firebase';  // ❌ Wrong export name
```

---

## Database Operations

### Read Data (with safety)
```typescript
const dataRef = ref(db, 'path/to/data');
onValue(dataRef, (snapshot) => {
  const data = snapshot.val();
  if (data && Array.isArray(data)) {
    setState(data);
  } else if (data) {
    setState(initialData);
  } else {
    set(dataRef, cleanFirebaseData(initialData));
  }
});
```

### Write Data
```typescript
set(ref(db, 'projects'), cleanFirebaseData(updatedProjects));
```

### Update Data
```typescript
update(ref(db, 'projects'), {
  [projectId]: updatedProject
});
```

---

## Array Safety Patterns

### ✅ Always Guard Arrays
```typescript
// State operations
(projects || []).map(...)
(projects || []).filter(...)
(projects || []).find(...)

// Spread operations
[...(subtasks || [])]

// JSX rendering
{(items || []).map(item => ...)}
```

### ✅ Local Array Guards in Components
```typescript
// At top of component
const subtasks = project.subtasks || [];
const ownerTags = project.ownerTags || [];

// Then use safely
{subtasks.map(st => ...)}
```

---

## Date Input Safety

### ✅ Sanitize Date Values
```typescript
function sanitizeDateForInput(dateValue: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  return '';
}

<input 
  type="date" 
  value={sanitizeDateForInput(project.deliverableDate)}
  onChange={(e) => onUpdate(id, { deliverableDate: e.target.value || '—' })}
/>
```

### ❌ Never Pass
```typescript
<input type="date" value="TBD" />        // ❌ Invalid
<input type="date" value="------" />    // ❌ Invalid
<input type="date" value="—" />         // ❌ Invalid
```

---

## Change Tracking Pattern

### Always Include When Updating
```typescript
const handleUpdate = (id: string, updates: Partial<ProjectCard>) => {
  const updatedProjects = (projects || []).map(p => 
    p.id === id 
      ? { 
          ...p, 
          ...updates,
          lastModifiedBy: currentUser,    // ✅ Required
          lastModifiedAt: Date.now()      // ✅ Required
        }
      : p
  );
  set(ref(db, 'projects'), cleanFirebaseData(updatedProjects));
};
```

---

## Drag & Drop Pattern

### Update Priority, Category, and Tracking
```typescript
const handleCardDrop = (cardId: string, newPriority: string, isCustom: boolean) => {
  const updatedProjects = (projects || []).map(p => {
    if (p.id === cardId) {
      return {
        ...p,
        priority: newPriority,                        // ✅
        category: isCustom ? newPriority : undefined, // ✅
        lastModifiedBy: currentUser,                  // ✅
        lastModifiedAt: Date.now()                    // ✅
      };
    }
    return p;
  });
  set(ref(db, 'projects'), cleanFirebaseData(updatedProjects));
};
```

---

## Clean Firebase Data

### Remove Undefined Values
```typescript
function cleanFirebaseData<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map(item => cleanFirebaseData(item)) as T;
  } else if (data !== null && typeof data === 'object') {
    const cleaned: any = {};
    Object.keys(data).forEach(key => {
      const value = (data as any)[key];
      if (value !== undefined) {
        cleaned[key] = cleanFirebaseData(value);
      }
    });
    return cleaned as T;
  }
  return data;
}

// Usage: Always clean data before sending to Firebase
set(ref(db, 'projects'), cleanFirebaseData(projects));
```

---

## Environment Variables

### Setup (.env file)
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_DATABASE_URL=your_url
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Usage
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

---

## TypeScript Type Definitions

```typescript
interface ProjectCard {
  id: string;
  lineNumber: number;
  priority: string;
  projectName: string;
  subtasks: Subtask[];
  owner: string;
  ownerTags?: string[];
  status: 'inProgress' | 'done' | 'todo' | 'onHold';
  deliverableDate: string;
  notes: string;
  category?: string;
  tags?: string[];
  lastModifiedBy?: string;
  lastModifiedAt?: number;
}

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface Teammate {
  id: string;
  name: string;
  color: string;
  email?: string;
}

interface CustomRow {
  id: string;
  name: string;
  color: string;
}
```

---

## Common Pitfalls to Avoid

### ❌ Don't
```typescript
// Missing array guard
projects.map(...)                         // ❌ May crash

// Direct snapshot.val() to state
setState(snapshot.val())                  // ❌ Unsafe

// Forgetting change tracking
onUpdate(id, { projectName: 'New' })      // ❌ Missing tracking

// Invalid date in input
<input type="date" value="TBD" />        // ❌ Will cause error

// Undefined in Firebase
set(ref(db, 'path'), { key: undefined }) // ❌ Firebase error
```

### ✅ Do
```typescript
// Guard all arrays
(projects || []).map(...)                 // ✅ Safe

// Safe Firebase reads
if (data && Array.isArray(data)) {...}   // ✅ Guarded

// Include change tracking
onUpdate(id, { 
  projectName: 'New',
  lastModifiedBy: currentUser,
  lastModifiedAt: Date.now()
})                                        // ✅ Complete

// Sanitize dates
<input type="date" 
  value={sanitizeDateForInput(date)} />  // ✅ Safe

// Clean Firebase data
set(ref(db, 'path'), 
  cleanFirebaseData(data))               // ✅ No undefined
```

---

## Testing Checklist

- [ ] All array operations have `|| []` guard
- [ ] All Firebase reads check for `null` and `undefined`
- [ ] Date inputs use `sanitizeDateForInput()`
- [ ] Updates include `lastModifiedBy` and `lastModifiedAt`
- [ ] Data passed to Firebase is cleaned with `cleanFirebaseData()`
- [ ] Environment variables use `import.meta.env.VITE_*`
- [ ] Firebase imports use `{ db }` not `{ database }`

---

## Debugging Tips

### Check Firebase Connection
```typescript
// In browser console
console.log(import.meta.env.VITE_FIREBASE_DATABASE_URL);
```

### Verify Real-Time Sync
1. Open app in two browser windows
2. Make a change in one
3. Should appear in other within 100ms

### Check for Array Errors
- Open browser console (F12)
- Look for "Cannot read properties of undefined"
- Add `|| []` guard where missing

### Firebase Rules Test
```javascript
// Firebase Console → Database → Rules
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

---

## Performance Tips

### Optimize Firebase Reads
```typescript
// Use specific paths
ref(db, `projects/${projectId}`)  // ✅ Specific
ref(db, 'projects')                // ⚠️ Gets all

// Limit listeners
useEffect(() => {
  const unsubscribe = onValue(...);
  return () => unsubscribe();     // ✅ Cleanup
}, []);
```

### Batch Updates
```typescript
// Instead of multiple sets
update(ref(db, '/'), {
  'projects': updatedProjects,
  'customRows': updatedRows,
  'teammates': updatedTeammates
});
```

---

## Quick Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Resources

- [Firebase Realtime Database Docs](https://firebase.google.com/docs/database)
- [React DnD Documentation](https://react-dnd.github.io/react-dnd/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)

---

**Last Updated:** February 3, 2026
