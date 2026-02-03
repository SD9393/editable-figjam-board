# Oracle Conversation Design Team - Project Board

A real-time collaborative project management board built with React, Firebase, and Tailwind CSS.

## 🎯 Features

### Core Functionality
- ✅ **16 Original Projects** organized by priority (P0-P4)
- ✅ **Draggable Cards** - Move projects between priority levels
- ✅ **Editable Content** - Click to edit any field (project name, subtasks, notes, dates)
- ✅ **Interactive Checkboxes** - Track subtask completion
- ✅ **Clickable Status Badges** - Cycle through: To do → In progress → Done → On hold
- ✅ **Custom Priority Rows** - Add categories like "Planned", "In Discussions", "Backlog"

### Team Collaboration
- ✅ **Teammate Tagging System** - Tag team members on projects
- ✅ **Owner Assignment** - Assign project owners with colored badges
- ✅ **Editable Team Members** - Manage teammate names and emails
- ✅ **Calendar Date Picker** - Set deliverable dates

### Real-Time Features (NEW!)
- 🔄 **Live Synchronization** - Changes appear instantly for all users
- 👤 **User Identification** - See who's editing the board
- 📝 **Change Tracking** - Every card shows who made the last edit and when
- 🌐 **Multi-User Support** - Multiple people can edit simultaneously
- 💾 **Firebase Backend** - All data stored in cloud, not just browser

### Email Notifications
- 📧 **Auto-Email Updates** when:
  - Teammates are tagged/assigned as owner
  - Project status changes
  - Project moves to different priority level
  - Deliverable date is approaching (72 hours before)
  - Project is on hold/to-do for more than 72 hours

### Data Persistence
- 💾 **Cloud Storage** - All changes saved to Firebase Realtime Database
- 🔄 **Auto-Sync** - No save button needed
- 👥 **Shared State** - Everyone sees the same data
- 📱 **Works Everywhere** - Desktop, mobile, tablet

## 🏗️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Drag & Drop**: react-dnd
- **Backend**: Firebase Realtime Database
- **Icons**: Lucide React
- **Date Picker**: react-day-picker
- **Build Tool**: Vite

## 📁 Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── FigJamBoard.tsx         # Main board component
│   │   └── App.tsx                     # App entry point
│   ├── config/
│   │   └── firebase.ts                 # Firebase configuration
│   └── styles/
│       └── theme.css                   # Custom styles
├── FIREBASE_SETUP.md                   # Firebase setup guide
├── DEPLOYMENT_GUIDE.md                 # How to deploy
├── COLLABORATION_FEATURES.md           # Real-time features explained
├── TEAM_QUICK_START.md                 # Quick start for team members
└── README.md                           # This file
```

## 🚀 Getting Started

### For Administrators

**1. Install Dependencies**
```bash
npm install
```

**2. Set Up Firebase**
- Follow the complete guide in `FIREBASE_SETUP.md`
- Create a Firebase project
- Enable Realtime Database
- Copy your Firebase config to `/src/config/firebase.ts`

**3. Run Locally**
```bash
npm run dev
```

**4. Deploy**
- Follow the guide in `DEPLOYMENT_GUIDE.md`
- Recommended: Deploy to Vercel (easiest)
- Alternative: Netlify, Firebase Hosting, or GitHub Pages

**5. Share with Team**
- Send the deployed URL to your team
- Share `TEAM_QUICK_START.md` with them
- They'll enter their name on first visit

### For Team Members

**1. Open the Board**
- Click the link provided by your admin

**2. Enter Your Name**
- First-time only - your browser remembers you
- Use your real name so teammates know who's editing

**3. Start Collaborating!**
- All changes sync automatically
- See live updates from teammates
- Click "How to Use" button for full instructions

## 📚 Documentation

| Document | Description | Audience |
|----------|-------------|----------|
| `FIREBASE_SETUP.md` | Complete Firebase setup instructions | Administrator |
| `DEPLOYMENT_GUIDE.md` | How to deploy to hosting platforms | Administrator |
| `COLLABORATION_FEATURES.md` | Technical details of real-time features | Administrator/Developers |
| `TEAM_QUICK_START.md` | Quick start guide | All team members |
| `README.md` | Project overview (this file) | Everyone |

## 🎨 Board Layout

### Priority Levels
- **P0** (🔴 Red) - Critical/Urgent
- **P1** (🟠 Orange) - High Priority
- **P2** (🟡 Yellow) - Medium Priority
- **P3** (🟢 Green) - Low Priority
- **P4** (🔵 Blue) - Future Consideration
- **Custom Rows** (🟣 Purple/Teal) - Your custom categories

### Project Card Fields
- Line Number
- Priority Badge
- Project Name
- Subtasks (with checkboxes)
- Owner (with colored badges)
- Status Badge (clickable)
- Deliverable Date (with calendar picker)
- Notes
- Tagged Teammates
- Last Modified Info (who & when)

## 👥 Pre-Loaded Team Members

Your Oracle team members are already in the system:
- Samrat Ambadekar
- Palak Midha
- Vinayak V
- Sowmya Kanchibotla
- Hariprasath K
- Priyanka Rani
- Sowmya Nagappa
- Jerina Johny
- Vedanshi Singh
- Sravya Putta

All with their @oracle.com email addresses for notifications.

## 🔐 Security Notes

**Current Setup**: "Anyone with link can edit"
- No authentication required
- All changes are public to users with the link
- User identity based on self-entered name

**For Enhanced Security**:
- Add Firebase Authentication (email/password, Google Sign-In)
- Implement permission levels (viewer vs editor)
- Restrict database access by domain
- Add audit logging

See `FIREBASE_SETUP.md` for security options.

## 🐛 Troubleshooting

### Changes Not Syncing
- Check internet connection
- Verify Firebase config in `/src/config/firebase.ts`
- Check Firebase Console → Realtime Database rules
- Look for errors in browser console (F12)

### "Permission Denied" Error
- Firebase database rules need to allow read/write
- See `FIREBASE_SETUP.md` Step 6

### User Name Not Saving
- Check browser localStorage isn't disabled
- Try clearing browser cache and re-entering name

### Build Errors
- Run `npm install` to ensure all dependencies installed
- Check that Firebase package is installed: `npm list firebase`
- Verify all imports are correct

## 📊 Firebase Free Tier Limits

- **Simultaneous Connections**: 100 (more than enough for teams)
- **Data Transfer**: 10 GB/month
- **Storage**: 1 GB
- **Requests**: Unlimited for Realtime Database

Perfect for team collaboration - no payment needed!

## 🔄 How Real-Time Sync Works

1. User makes a change (edit project, drag card, etc.)
2. Change is sent to Firebase Realtime Database
3. Firebase broadcasts change to all connected clients
4. All users see the update within milliseconds
5. Change attribution (who & when) is recorded

**No polling, no delays, just instant updates!**

## 📞 Support

Need help or want to add features?

**Potential Enhancements**:
- User authentication with login
- Permission levels (admin, editor, viewer)
- Change history / audit log
- Real-time cursors showing who's editing what
- Comments system with @mentions
- File attachments
- Export to PDF/Excel
- Slack/Teams integration
- Mobile app version

Just let me know what you need! 🚀

## 📄 License

This is a custom-built internal tool for the Oracle Conversation Design Team.

---

**Built with ❤️ for collaborative project management**

Last Updated: February 3, 2026
