# Advanced Todo Card - Stage 1

An interactive, accessible, and responsive Todo Card component built with vanilla HTML, CSS, and JavaScript.

## 🚀 Features

- **Editable Content**: Click Edit to modify title, description, priority, and due date
- **Status Management**: Toggle between Pending, In Progress, and Done states
- **Priority Indicators**: Visual priority levels with colored indicators
- **Smart Expand/Collapse**: Automatically collapses long descriptions with smooth animations
- **Dynamic Time Tracking**: Real-time countdown with overdue detection
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Full Accessibility**: Keyboard navigation, screen reader support, and focus management

## 📋 What Changed from Stage 0

Stage 0 was a basic, read-only Todo Card with static content. Stage 1 transforms it into a fully interactive component:

### New Functionality

- **Edit Mode**: Complete form-based editing with validation
- **Status Controls**: Dropdown selector for task states (Pending/In Progress/Done)
- **Priority System**: Visual priority indicators with Low/Medium/High levels
- **Expand/Collapse**: Intelligent text truncation with toggle controls
- **Time Management**: Live updates every 30 seconds with granular time display
- **Overdue Detection**: Visual alerts for past-due tasks

### Enhanced UX

- **State Synchronization**: Checkbox and status dropdown stay in sync
- **Visual Feedback**: Different styles for different states (Done, In Progress, High Priority, Overdue)
- **Smooth Transitions**: CSS animations for expand/collapse and state changes
- **Focus Management**: Proper tab order and focus trapping in edit mode

### Technical Improvements

- **Accessibility**: ARIA attributes, keyboard navigation, screen reader support
- **Responsive Design**: Mobile-first approach with breakpoints at 320px, 768px, 1024px+
- **Performance**: Efficient rendering with minimal DOM updates
- **Code Organization**: Clean separation of concerns and modular functions

## 🎨 Design Decisions

### Visual State System

- **Done Tasks**: Strike-through text with muted opacity
- **In Progress**: Orange left border accent
- **High Priority**: Red left border accent
- **Overdue**: Red left border with enhanced shadow
- **Priority Dots**: Green (Low), Orange (Medium), Red (High)

### Layout Strategy

- **Mobile (320px)**: Vertical stacking, larger touch targets, full-width buttons
- **Tablet (768px)**: Horizontal alignment for priority/status controls
- **Desktop (1024px+)**: Optimized spacing and proportions

### Interaction Patterns

- **Edit Mode**: Hides normal view, shows form with focus trapping
- **Status Logic**: Checkbox completion sets status to "Done"; manual status changes sync checkbox
- **Time Display**: Shows "Completed" for done tasks, granular time for active tasks
- **Expand Behavior**: Auto-collapses descriptions >80 characters, hides button for short text

## 🧪 Testing

The component includes comprehensive test IDs for automated testing:

```html
data-testid="test-todo-card" data-testid="test-todo-title"
data-testid="test-todo-description" data-testid="test-todo-priority"
data-testid="test-todo-priority-indicator" data-testid="test-todo-status"
data-testid="test-todo-status-control" data-testid="test-todo-due-date"
data-testid="test-todo-time-remaining" data-testid="test-todo-overdue-indicator"
data-testid="test-todo-complete-toggle" data-testid="test-todo-tags"
data-testid="test-todo-expand-toggle"
data-testid="test-todo-collapsible-section" data-testid="test-todo-edit-button"
data-testid="test-todo-delete-button" data-testid="test-todo-edit-form"
data-testid="test-todo-edit-title-input"
data-testid="test-todo-edit-description-input"
data-testid="test-todo-edit-priority-select"
data-testid="test-todo-edit-due-date-input" data-testid="test-todo-save-button"
data-testid="test-todo-cancel-button"
```

## ♿ Accessibility Notes

### Keyboard Navigation

- **Tab Order**: Checkbox → Status Control → Expand Toggle → Edit → Delete → Edit Form
- **Focus Trapping**: Edit form traps focus with Tab/Shift+Tab cycling
- **Escape Key**: Exits edit mode and returns focus to Edit button

### Screen Reader Support

- **ARIA Labels**: All form controls have accessible names
- **Live Regions**: Time updates announced with `aria-live="polite"`
- **Semantic HTML**: Proper heading hierarchy and list structures
- **Status Announcements**: State changes communicated to assistive technologies

### Focus Management

- **Visual Focus**: High-contrast focus indicators on all interactive elements
- **Logical Flow**: Tab order follows visual layout and usage patterns
- **Context Preservation**: Focus returns to trigger element after mode changes

## ⚠️ Known Limitations

### Browser Compatibility

- **Date Input**: `datetime-local` input may have inconsistent UI across browsers
- **CSS Grid/Flexbox**: Requires modern browser support (IE11+)
- **ES6 Features**: Arrow functions and template literals require ES6+ support

### Functionality Constraints

- **Single Task**: Currently displays only one todo item (designed for single-card testing)
- **Local Storage**: No persistence - data resets on page reload
- **Time Zones**: Due date calculations use client timezone
- **Validation**: Basic client-side validation only

### Performance Considerations

- **Interval Updates**: Time updates every 30 seconds regardless of visibility
- **DOM Queries**: Multiple `document.querySelector` calls on each render
- **Memory Leaks**: Interval not cleared on page unload (acceptable for demo)

### Accessibility Edge Cases

- **High Contrast Mode**: Some visual state indicators may be less apparent
- **Reduced Motion**: CSS transitions respect `prefers-reduced-motion` setting
- **Touch Devices**: Larger touch targets implemented but not fully tested

## 🚀 Getting Started

1. **Clone/Download** the project files
2. **Open** `index.html` in a modern web browser
3. **Interact** with the todo card using mouse or keyboard
4. **Test** different states and responsive breakpoints

### File Structure

```
testable-todo-card/
├── index.html      # Main HTML structure
├── script.js       # JavaScript functionality
├── styles.css      # CSS styling and responsive design
└── README.md       # This documentation
```

## 🛠️ Development

### Code Style

- **HTML**: Semantic markup with accessibility attributes
- **CSS**: Mobile-first responsive design with CSS custom properties
- **JavaScript**: Vanilla ES6+ with modular functions and event delegation

### Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
