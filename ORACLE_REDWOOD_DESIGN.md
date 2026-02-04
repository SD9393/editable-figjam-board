# Oracle Redwood Design System Implementation

This document describes the Oracle Redwood design system colors and typography applied to the Conversation Design Team Project Board.

---

## 🎨 Color Palette

### Primary Oracle Redwood Colors

#### Oracle Red
- **Primary**: `#C74634`
- **Dark**: `#A63C2C`
- **Light**: `#E57361`
- **Usage**: Critical priority (P0), destructive actions, error states

#### Oracle Blue  
- **Primary**: `#0572CE`
- **Dark**: `#025A9F`
- **Light**: `#3B8FDB`
- **Usage**: Primary buttons, links, P4 priority, interactive elements

#### Oracle Teal
- **Primary**: `#1B9AAA`
- **Dark**: `#147A87`
- **Light**: `#4DB5C2`
- **Usage**: Custom row "In Discussions", secondary accents

#### Oracle Green
- **Primary**: `#2E7D32`
- **Dark**: `#1B5E20`
- **Light**: `#4CAF50`
- **Usage**: P3 priority, "Done" status, success states

#### Oracle Purple
- **Primary**: `#6A1B9A`
- **Dark**: `#4A148C`
- **Light**: `#8E24AA`
- **Usage**: "On hold" status, custom row "Planned"

#### Oracle Orange
- **Primary**: `#F57C00`
- **Dark**: `#E65100`
- **Light**: `#FF9800`
- **Usage**: P1 priority, "In progress" status

#### Oracle Yellow
- **Primary**: `#F9A825`
- **Dark**: `#F57F17`
- **Light**: `#FBC02D`
- **Usage**: P2 priority, highlights, warnings

### Neutral Grays

| Color | Hex | Usage |
|-------|-----|-------|
| Gray 50 | `#FAFAFA` | Lightest backgrounds |
| Gray 100 | `#F5F5F5` | Card backgrounds, subtle fills |
| Gray 200 | `#EEEEEE` | Borders, dividers |
| Gray 300 | `#E0E0E0` | Active borders |
| Gray 400 | `#BDBDBD` | Disabled elements |
| Gray 500 | `#9E9E9E` | Placeholder text, "To do" status |
| Gray 600 | `#757575` | Secondary text |
| Gray 700 | `#616161` | Body text |
| Gray 800 | `#424242` | Headings |
| Gray 900 | `#212121` | Primary text |

---

## 🎯 Applied Color Mapping

### Priority Levels
- **P0 (Critical)**: Oracle Red (#C74634)
- **P1 (High)**: Oracle Orange (#F57C00)
- **P2 (Medium)**: Oracle Yellow (#F9A825)
- **P3 (Low)**: Oracle Green (#2E7D32)
- **P4 (Future)**: Oracle Blue (#0572CE)

### Status Badges
- **To do**: Gray (#9E9E9E)
- **In progress**: Oracle Orange (#F57C00)
- **Done**: Oracle Green (#2E7D32)
- **On hold**: Oracle Purple (#6A1B9A)

### Deliverable Status
- **To Do**: Gray (#9E9E9E)
- **In Progress**: Oracle Blue (#0572CE)
- **Done**: Oracle Green (#2E7D32)
- **Blocked**: Oracle Red (#C74634)

### Teammate Badge Colors
Rotating through Oracle palette:
1. Oracle Blue (#0572CE)
2. Oracle Green (#2E7D32)
3. Oracle Red (#C74634)
4. Oracle Yellow (#F9A825)
5. Oracle Purple (#6A1B9A)
6. Pink (#D81B60)
7. Oracle Orange (#F57C00)
8. Purple Light (#8E24AA)
9. Oracle Teal (#1B9AAA)
10. Blue Light (#3B8FDB)
11. Green Light (#4CAF50)
12. Orange Light (#FF9800)

### UI Elements
- **Primary Buttons**: Oracle Blue (#0572CE) → Hover (#025A9F)
- **Focus Borders**: Oracle Blue (#0572CE)
- **Selected Items**: Oracle Blue border with light blue background
- **Highlights**: Oracle Yellow (#F9A825) with light yellow background

---

## 🔤 Typography

### Font Family
**Primary**: Inter (Google Font)
- Oracle Sans is proprietary, so we use Inter as a high-quality alternative
- Inter matches Oracle's clean, modern aesthetic
- Fallback: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif)

### Font Weights
- **Normal**: 400 (body text, inputs)
- **Medium**: 500 (labels, buttons)
- **Semibold**: 600 (headings, emphasis)
- **Bold**: 700 (strong emphasis)

### Type Scale
```css
h1: 2xl (semibold, line-height 1.4)
h2: xl (semibold, line-height 1.4)
h3: lg (semibold, line-height 1.4)
h4: base (semibold, line-height 1.4)
body: base (normal, line-height 1.5)
label/button: base (medium, line-height 1.5)
```

---

## 📐 Design Tokens

### Border Radius
- **Small**: 0.175rem (2.8px)
- **Medium**: 0.375rem (6px) - Default
- **Large**: 0.575rem (9.2px)
- **Extra Large**: 0.775rem (12.4px)

Oracle Redwood uses subtle rounded corners (smaller than typical Material Design).

### Spacing
Standard 8px grid system for consistent spacing.

---

## 🖼️ Component Styling

### Cards
- Background: White (#FFFFFF)
- Border: Gray 300 (#E0E0E0)
- Hover: Gray 100 (#F5F5F5)
- Shadow: Subtle elevation

### Priority Rows
Each priority has a light tinted background:
- **P0**: Light red background (#FFEBEE)
- **P1**: Light orange background (#FFF3E0)
- **P2**: Light yellow background (#FFF9C4)
- **P3**: Light green background (#E8F5E9)
- **P4**: Light blue background (#E3F2FD)

### Buttons
- **Primary**: Oracle Blue with white text
- **Secondary**: White with gray border
- **Hover**: Darker shade of base color
- **Disabled**: Gray 400

### Inputs
- Border: Gray 300
- Focus: Oracle Blue border
- Hover: Gray 400 border
- Background: White or Gray 50

---

## ✨ Accessibility

All color combinations meet WCAG 2.1 AA standards for contrast:
- Text on colored backgrounds: Minimum 4.5:1 contrast
- Large text: Minimum 3:1 contrast
- Interactive elements: Clear focus states with Oracle Blue

---

## 🔄 Migration from Previous Colors

### Changes Made:
1. **Blue**: Changed from generic blue-600 → Oracle Blue (#0572CE)
2. **Green**: Changed from generic green → Oracle Green (#2E7D32)
3. **Red**: Changed from generic red → Oracle Red (#C74634)
4. **Orange**: Changed from #eb9632 → Oracle Orange (#F57C00)
5. **Purple**: Changed from generic purple → Oracle Purple (#6A1B9A)
6. **Teammate badges**: Updated to Oracle color palette
7. **All buttons**: Converted to Oracle Blue
8. **Focus states**: Unified to Oracle Blue
9. **Gradients**: Updated modal sections to Oracle colors

---

## 📚 Resources

- **Oracle Redwood Design System**: [Official Documentation](https://www.oracle.com/design/)
- **Font**: [Inter on Google Fonts](https://fonts.google.com/specimen/Inter)
- **Color Contrast Checker**: Use to verify accessibility

---

## 💡 Best Practices

1. **Consistency**: Always use the defined Oracle colors, never arbitrary hex values
2. **Hierarchy**: Use color to establish visual hierarchy (P0 = red attention, P4 = blue calm)
3. **Accessibility**: Test all color combinations for contrast
4. **Semantic Colors**: Use colors meaningfully (red = critical/error, green = success/done)
5. **Light Backgrounds**: Priority rows use 50-100 tints for subtle differentiation
6. **Focus States**: Always use Oracle Blue for focus indicators
7. **Buttons**: Primary actions use Oracle Blue, destructive actions use Oracle Red

---

**Last Updated**: February 2026  
**Design System**: Oracle Redwood v1.0
