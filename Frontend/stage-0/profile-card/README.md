# Profile Card (Accessible & Responsive)

## 📌 Overview

This project is a fully accessible and responsive **Profile Card** built using **HTML, CSS, and JavaScript**.

It demonstrates:

- WCAG-compliant accessibility practices
- Responsive UI design (mobile → desktop)
- Dynamic time updates using `Date.now()`
- Semantic HTML structure
- Keyboard-friendly interactions

---

## 🚀 Features

### Accessibility

- Meaningful `alt` text for images
- Proper semantic HTML (`article`, `section`, `figure`)
- Keyboard navigable elements (buttons, links)
- Visible focus states for interactive elements
- `aria-live="polite"` for dynamic time updates
- Accessible names for buttons and links

### Responsiveness

- Mobile-first layout (stacked)
- Tablet/Desktop layout (avatar left, content right)
- Flexible layout using Flexbox
- Handles long text without breaking UI

### Behavior

- Displays current epoch time in milliseconds
- Updates:
  - On page load
  - On button click
  - Automatically every 1 second

### Security Best Practices

- External links use:
  - `target="_blank"`
  - `rel="noopener noreferrer"`

---

## 📂 Project Structure

```
profile-card/
│── index.html
│── styles.css
│── script.js
│── README.md
```

---

## 🛠️ How to Run Locally

### Option 1 (Simplest)

1. Download or clone the repository:

   ```bash
   git clone https://github.com/your-username/profile-card.git
   ```

2. Navigate into the folder:

   ```bash
   cd profile-card
   ```

3. Open `index.html` in your browser:
   - Double-click the file
     OR
   - Right-click → Open with browser

---

### Option 2 (Recommended - Live Server)

If you use **VS Code**:

1. Install **Live Server extension**
2. Open the project folder
3. Right-click `index.html`
4. Click **"Open with Live Server"**

👉 This enables auto-refresh on changes.

---

## 🧪 Testing Checklist

### Accessibility Tests

- [ ] Can navigate entire card using **Tab key**
- [ ] All interactive elements are focusable
- [ ] Screen reader announces time updates
- [ ] Image has meaningful alt text
- [ ] Button has accessible name

### Responsiveness Tests

- [ ] Mobile layout stacks vertically
- [ ] Desktop layout aligns avatar left, content right
- [ ] No overflow on small screens
- [ ] Text wraps correctly

### Functionality Tests

- [ ] Time displays on page load
- [ ] Clicking "Update Now" refreshes time
- [ ] Time updates automatically every second

---

## 📄 License

This project is open-source and free to use for learning and portfolio purposes.
