# Salon Sprint — Claude Code Project Briefing

## What This Is
Salon Sprint is a B2B same-day delivery app for salon supplies.
It connects three types of users:
- **Stylists** — independent suite renters who need supplies fast
- **Supply Owners** (e.g. SalonCentric) — fulfill and dispatch orders
- **Drivers** — pick up from supply store and deliver to stylists

Tagline: *"Supplies at Speed"*

---

## Current State
A working React prototype exists (`salon-sprint-app.jsx`). It has all three role-based interfaces and demonstrates the full order flow. It is currently **frontend-only** — no backend, no database, no auth, all mock data.

---

## Immediate Goal: Deploy for Real-World Pilot Testing

The founder has a real pilot lined up:
- **Stylist:** KG, suite renter at a salon suite building in Paramus, NJ
- **Driver:** A private driver / rideshare driver the founder knows personally
- **Supply Source:** SalonCentric store in Paramus, NJ (founder has existing relationship with staff)
- **Coordinator:** The founder will manually relay orders during initial tests (Wizard of Oz approach)

**We do NOT need a full backend yet.** The goal is a live URL that real people can open on their phones and interact with.

---

## Priority Task List (in order)

### TASK 1 — Deploy to Vercel (highest priority)
- Set up the React app for deployment
- Deploy to Vercel (free tier)
- Confirm it works on mobile browsers (iPhone Safari especially)
- Deliverable: A shareable URL like `salon-sprint.vercel.app`

### TASK 2 — Make it Mobile-First
- The current UI was built for desktop
- Optimize layout for small screens (375px width minimum)
- Make buttons large enough for thumbs
- Ensure all three role views work cleanly on iPhone

### TASK 3 — Replace Mock Data with Pilot-Specific Data
Update the hardcoded sample data to reflect the actual pilot:
- Stylist name: KG (or "KG's Suite")
- Location: Paramus, NJ
- Supply source: SalonCentric, Paramus
- Driver: Use a placeholder like "Your Driver" until real name confirmed
- Remove LA addresses, replace with NJ context

### TASK 4 — Add a Simple Order Submission Form
Right now the "Request New Delivery" button in the Stylist view is a placeholder.
Build a basic form that:
- Lets a stylist enter their name, items needed, and preferred time
- On submit, sends an email or SMS notification to the founder (use EmailJS or Formspree — no backend needed)
- Shows a confirmation screen: "Your order has been received! We'll confirm shortly."

### TASK 5 — Basic Shareable Links per Role
Add URL routing so each role has its own link:
- `/owner` → Supply Owner view
- `/driver` → Driver view  
- `/stylist` → Stylist view

This lets the founder text each person their specific link rather than explaining which tab to tap.

---

## Tech Stack
- **Frontend:** React (existing), Tailwind CSS
- **Icons:** lucide-react
- **Deployment:** Vercel (free)
- **Order notifications (no backend):** Formspree or EmailJS
- **Routing:** React Router

---

## What NOT to Build Yet
- No database
- No user authentication / login
- No payment processing
- No real-time GPS tracking
- No push notifications
- No admin dashboard

These are Phase 2+ features. Keep it simple for the pilot.

---

## Brand & Design
- **Primary color:** Indigo (#4F46E5)
- **Secondary:** Purple (#9333EA)
- **Logo concept:** Deconstructed female sprinter with curly hair
- **Personality:** Fast, reliable, empowering
- **Font feel:** Clean, modern, professional

---

## Files in This Package
| File | Description |
|------|-------------|
| `CLAUDE.md` | This file — start here |
| `salon-sprint-app.jsx` | Full React prototype (all 3 interfaces) |
| `TASKS.md` | Prioritized build list with details |
| `PILOT.md` | Pilot context — people, location, logistics |
| `salon-sprint-development-history.md` | Full business plan & background |
| `salon-sprint-quick-reference.md` | Executive summary & key facts |
| `salon-sprint-design-notes.md` | Branding, colors, logo concept |
| `salon-sprint-mvp-enhancements.md` | Phase 2+ feature roadmap (for later) |

---

## Success Criteria for This Phase
- [ ] App loads on iPhone Safari via a real URL
- [ ] Stylist can tap through their view and submit an order
- [ ] Founder receives order notification (email or SMS)
- [ ] Driver can see their assigned delivery
- [ ] Each role has its own direct link

That's it. Nail these five things and the pilot can begin.
