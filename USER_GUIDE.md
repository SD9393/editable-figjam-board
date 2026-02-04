# Oracle Conversation Design Team - Project Board User Guide

Welcome to your real-time collaborative project board! This FigJam-style board helps your team manage 16+ projects with draggable cards, priority levels, deliverables tracking, and instant Firebase synchronization.

---

## 🚀 Quick Start

1. **Enter Your Name**: When you first open the app, you'll be prompted to enter your name. This helps your teammates see who makes changes.
2. **Explore the Board**: You'll see project cards organized by priority levels (P0-P4) and custom categories.
3. **Start Editing**: Click on any field to edit it - all changes sync instantly across all users!

---

## 📋 Core Features

### 1. **Sidebar Navigation**

- **Quick Jump**: Click on any project name in the left sidebar to instantly highlight and scroll to that card
- **Drag to Reorder**: Drag project names in the sidebar to reorder them within the same priority level
- **Visual Dividers**: Color-coded sections separate P0-P4 priorities and custom rows
  - **P0** - Highest Priority (Red)
  - **P1** - High Priority (Orange)
  - **P2** - Medium Priority (Yellow)
  - **P3** - Low Priority (Green)
  - **P4** - Lowest Priority (Blue)
- **Toggle Sidebar**: Use the chevron arrows (◀ ▶) to show/hide the sidebar for more workspace

### 2. **Moving Project Cards**

**Drag and Drop**: 
- Click and hold any project card by the grip handle (⋮⋮) at the top
- Drag it to any priority row (P0-P4) or custom category
- The priority updates automatically when you drop it!

### 3. **Editing Projects**

All fields are editable inline - just click to edit:

- **Project Name**: Click the title to edit
- **Subtasks**: 
  - Check/uncheck boxes to mark completion
  - Click the text to edit inline
  - Click the X button to delete a subtask
  - Click "+ Add subtask" to create new ones
- **Owner**: Click the 👥 icon to assign project owners (can be multiple people)
- **Status**: Click the status badge to cycle through states (see Status Management below)
- **Deliverable Date**: Click the date field to open a calendar picker
- **Notes**: Click and type directly in the notes field
- **Tagged Teammates**: Click the 👥 icon to tag collaborators

### 4. **Status Management**

Click the status badge to cycle through these states:

**To do** (Gray) → **In progress** (Orange) → **Done** (Green) → **On hold** (Purple) → _back to To do_

The color instantly updates so everyone on your team sees the current status!

### 5. **Deliverables Management** 🎯

Track specific deliverable items for each project:

- **View Deliverables**: Click the "Deliverable (X)" link on any project card
- **Add Items**: Click "Add Deliverable" in the popup modal
- **Edit Names**: Click on the deliverable text to edit inline
- **Update Status**: Click the status badge to cycle through:
  - **To Do** (Gray)
  - **In Progress** (Blue)
  - **Done** (Green)
  - **Blocked** (Red)
- **Delete**: Click the trash icon to remove a deliverable
- **Track Count**: The card shows the total count (e.g., "Deliverable (3)")

### 6. **Team Member Management**

**Manage Teammates** (Click toolbar button):
- **Add Members**: Enter a name and click "Add Teammate"
- **Edit Names**: Click the ✏️ icon next to any teammate
- **Delete Members**: Click the trash icon
- **Color Coding**: Each teammate gets a unique color for easy identification

**Assigning Team Members**:
- **Set Owners**: Click the 👥 icon next to "Owner" to assign project owners (multiple allowed)
- **Tag Teammates**: Click the 👥 icon under "Tagged Teammates" to loop in collaborators
- Tagged teammates and owners are displayed with colored badges on each card

### 7. **Adding & Organizing**

- **New Card**: Click the "Add Card" button in any priority row to create a new project
- **Custom Rows**: Click "Add Custom Row" in the toolbar to create categories like:
  - "Planned"
  - "In Discussions"
  - "Backlog"
  - "Future Release"
- **Delete Card**: Click the X button in the top-right corner of any card
- **Edit Row Names**: Click the ✏️ icon next to custom row names to rename them
- **Delete Custom Rows**: Click the trash icon next to custom row names

### 8. **Real-Time Collaboration** 🔄

- **Instant Sync**: All changes sync automatically across all team members via Firebase
- **Last Modified Info**: See who made the last edit and when at the bottom of each card
- **Your Identity**: Your name appears in the top toolbar
- **Simultaneous Editing**: Multiple people can work on different cards at the same time!

---

## 🎨 Visual Priority System

Each priority level has a distinct color:

| Priority | Color | Use Case |
|----------|-------|----------|
| **P0** | Red | Critical/Urgent - Must be done immediately |
| **P1** | Orange | High Priority - Important and time-sensitive |
| **P2** | Yellow | Medium Priority - Should be completed soon |
| **P3** | Green | Low Priority - Can be scheduled later |
| **P4** | Blue | Lowest Priority - Future consideration |

---

## 💾 Data Persistence

- **Auto-Save**: Every change is automatically saved to Firebase
- **No Manual Save**: You never need to click a "Save" button
- **Real-Time Database**: Firebase Realtime Database keeps everyone in sync
- **Local Storage**: Your name is stored locally so you don't need to re-enter it

---

## 🔧 Toolbar Features

At the top of the board, you'll find:

- **📚 Manage Teammates**: Add, edit, or remove team members
- **➕ Add Custom Row**: Create new category rows beyond P0-P4
- **❓ How to Use**: View this guide inside the app
- **Your Name Display**: Shows your current username
- **Sidebar Toggle**: Show/hide the project navigation sidebar

---

## 📝 Project Card Anatomy

Each card contains:

1. **Grip Handle** (⋮⋮) - Drag to move the card
2. **Project Name** - Editable title
3. **Subtasks** - Checklist with checkboxes
4. **Owner** - Assigned team members (with colored badges)
5. **Status Badge** - Current project status (clickable to cycle)
6. **Deliverable Date** - Calendar date picker
7. **Notes** - Free-form text area
8. **Deliverable Link** - Click to manage deliverable items
9. **Tagged Teammates** - Collaborators looped into the project
10. **Last Modified** - Shows who edited last and when
11. **Delete Button** (X) - Remove the card

---

## 🎯 Best Practices

1. **Set Owners Early**: Assign owners as soon as you create a project so everyone knows who's responsible
2. **Use Subtasks**: Break down projects into actionable subtasks for better tracking
3. **Tag Collaborators**: Tag teammates who need visibility even if they're not the owner
4. **Update Status Frequently**: Keep status badges current so the team knows real-time progress
5. **Use Deliverables**: For projects with multiple outputs, use the Deliverables feature to track each item separately
6. **Leverage Custom Rows**: Create rows like "Backlog" or "In Discussions" for projects not yet prioritized
7. **Check Last Modified**: Before making changes, check who edited last to avoid conflicts
8. **Add Notes**: Use the notes field for context, blockers, or important updates

---

## 🚨 Troubleshooting

**Changes not syncing?**
- Check your internet connection
- Refresh the page
- Verify Firebase is configured (see FIREBASE_SETUP.md)

**Can't see other users' changes?**
- Make sure everyone is connected to the same Firebase database
- Check that you're all viewing the same URL

**Lost your work?**
- Don't worry! Everything is saved to Firebase automatically
- Refresh the page to see the latest data

**Sidebar not showing?**
- Click the ▶ arrow to expand the sidebar
- It may be collapsed if your screen is narrow

---

## 🔗 Related Documentation

- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - How to configure Firebase
- **[TEAM_QUICK_START.md](./TEAM_QUICK_START.md)** - Quick guide for new team members
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - How to deploy the app
- **[COLLABORATION_FEATURES.md](./COLLABORATION_FEATURES.md)** - Deep dive into collaboration features

---

## 📧 Support

For technical issues or feature requests, contact your development team.

---

**Last Updated**: February 2026  
**Version**: 2.0 (Deliverables Feature Added)
