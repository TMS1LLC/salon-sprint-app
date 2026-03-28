# Salon Sprint — Task List for Claude Code

## Overview
These tasks are ordered by priority. Complete them in sequence.
The goal is a live, mobile-friendly URL ready for pilot testing in Paramus, NJ.

---

## TASK 1: Deploy to Vercel
**Priority:** 🔴 Do this first
**Estimated time:** 30–60 minutes

Steps:
1. Initialize a new React app using Vite:
   ```bash
   npm create vite@latest salon-sprint -- --template react
   cd salon-sprint
   npm install
   npm install lucide-react react-router-dom
   ```
2. Install Tailwind CSS:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
3. Replace the default `App.jsx` with `salon-sprint-app.jsx`
4. Configure Tailwind in `tailwind.config.js` and import in `index.css`
5. Test locally: `npm run dev`
6. Deploy to Vercel:
   ```bash
   npm install -g vercel
   vercel
   ```
7. Confirm the live URL works on a real iPhone (test in Safari)

---

## TASK 2: Mobile-First Layout
**Priority:** 🔴 Required before pilot
**Estimated time:** 1–2 hours

Issues to fix:
- Header/nav tabs need to be full-width and thumb-friendly (min 44px tap targets)
- Cards should stack vertically with adequate padding
- Buttons should be large (`py-4` not `py-2`) on mobile
- Text inputs need `text-base` or larger (prevents iOS zoom-on-focus)
- Test at 375px width (iPhone SE) and 390px (iPhone 14)

Specific changes:
- Add `viewport` meta tag if not present
- Use `sm:` breakpoints to enhance for tablet/desktop
- Base styles should be mobile-first

---

## TASK 3: Update Mock Data for Paramus Pilot
**Priority:** 🟡 Important for authenticity
**Estimated time:** 30 minutes

Replace the LA-based mock data with pilot-relevant data:

```javascript
// Replace existing orders with:
const initialOrders = [
  {
    id: 1,
    stylist: 'KG',
    salon: 'KG\'s Suite — Paramus',
    address: 'Salon Suite Building, Paramus, NJ',
    items: ['Color Developer', 'Hair Color x2', 'Foils'],
    status: 'pending',
    priority: 'same-day',
    time: '2:00 PM'
  }
];

// Replace drivers with:
const initialDrivers = [
  { id: 1, name: 'Your Driver', available: true, deliveries: 0 }
];
```

Also update the supply source label to reference "SalonCentric — Paramus" in the Owner view header.

---

## TASK 4: Order Submission Form (No Backend)
**Priority:** 🟡 Important for real testing
**Estimated time:** 1–2 hours

Goal: When a stylist submits an order, the founder receives a notification.

Use **Formspree** (free, no backend needed):
1. Create account at formspree.io
2. Create a new form, get the form endpoint URL
3. Build the submission form in the Stylist view:

```javascript
const handleOrderSubmit = async (formData) => {
  const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stylist: formData.stylist,
      items: formData.items,
      time: formData.time,
      notes: formData.notes
    })
  });
  if (response.ok) {
    setOrderSubmitted(true); // Show confirmation screen
  }
};
```

4. After submit, show a confirmation screen:
   - "✅ Order received! We'll confirm your delivery shortly."
   - Include estimated response time: "Usually within 15 minutes"

---

## TASK 5: Role-Based URL Routing
**Priority:** 🟢 Nice to have before pilot
**Estimated time:** 45 minutes

Add React Router so each role has a direct link:
- `salon-sprint.vercel.app/owner` → Supply Owner / SalonCentric view
- `salon-sprint.vercel.app/driver` → Driver view
- `salon-sprint.vercel.app/stylist` → Stylist order view
- `salon-sprint.vercel.app/` → Landing/role selector (current home screen)

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// In App.jsx:
<BrowserRouter>
  <Routes>
    <Route path="/" element={<RoleSelector />} />
    <Route path="/owner" element={<OwnerView />} />
    <Route path="/driver" element={<DriverView />} />
    <Route path="/stylist" element={<StylistView />} />
  </Routes>
</BrowserRouter>
```

This lets the founder send:
- KG: `salon-sprint.vercel.app/stylist`
- Driver: `salon-sprint.vercel.app/driver`
- SalonCentric staff: `salon-sprint.vercel.app/owner`

---

## Done = Pilot Ready ✅
When all 5 tasks are complete:
- [ ] Live URL confirmed working on iPhone Safari
- [ ] All three role views mobile-optimized
- [ ] Pilot-specific data populated
- [ ] Order form submits and founder receives email
- [ ] Each role has its own shareable link
