# Salon Sprint — Paramus Pilot Context

## What This File Is
This is the real-world context for the first live test of Salon Sprint.
The founder is running a "Wizard of Oz" pilot — manually coordinating behind the scenes
while real users interact with the app. This is intentional and appropriate for this stage.

---

## The Pilot Players

### Stylist
- **Name:** KG
- **Location:** Suite renter at a salon suite building in Paramus, NJ
- **Relationship:** Personal connection to the founder
- **Role in pilot:** Primary test user, may recruit 1–2 other stylists in the building
- **How they'll use the app:** Open stylist link on iPhone, browse, submit a real order

### Driver
- **Background:** Private driver; uses rideshare (Lyft/Uber) as backup income
- **Relationship:** Regular working relationship with the founder
- **Role in pilot:** Picks up orders from SalonCentric, delivers to suite building
- **How they'll use the app:** Open driver link on iPhone, see assigned delivery, mark complete
- **Important note:** This is pilot/test work — not steady volume yet. Founder has been transparent about this.

### Supply Source
- **Name:** SalonCentric
- **Location:** Paramus, NJ (nearest location to suite building)
- **Relationship:** Founder has visited in person, knows staff, has fulfilled orders for KG before
- **Role in pilot:** Fulfills orders at the counter when driver arrives with list
- **How they'll use the app:** Open owner/supply link on iPhone or desktop, see incoming orders
- **Pitch used:** "I'm testing an app that sends you orders from local stylists. Nothing changes on your end — a driver just comes in with a list."

---

## How a Test Order Will Flow

1. **KG** opens `salon-sprint.vercel.app/stylist` on her iPhone
2. KG submits an order: items she needs, preferred time
3. **Founder** receives email notification from Formspree
4. Founder manually contacts the driver via text: "Hey, order ready — pick up at SalonCentric Paramus at 2pm"
5. Founder (or SalonCentric staff) logs into `/owner` view and marks order as assigned
6. **Driver** opens `salon-sprint.vercel.app/driver` — sees the delivery
7. Driver picks up from SalonCentric, taps "Start Delivery"
8. Driver arrives at KG's suite, taps "Mark Delivered"
9. **KG** sees status update in her stylist view

The founder is the "engine" behind steps 3–4 for now. That's fine — the goal is to test the experience, not the automation.

---

## What We're Trying to Learn

1. **Does KG actually use it?** Or does she just text the founder like before?
2. **Is the order form clear enough?** Can she describe what she needs without confusion?
3. **Does the driver find the app intuitive?** Can he navigate it without explanation?
4. **Does SalonCentric find this useful or annoying?** Are they interested in being a real partner?
5. **What breaks?** Any bugs, confusing UI, or steps that don't make sense in real life?

---

## Success = One Real Delivery
A successful pilot is: one stylist submits an order → driver picks it up from SalonCentric → delivers to the suite building → everyone used the app to track it.

That's it. One real delivery with real people using the app = validated concept.

---

## What This Pilot Does NOT Need to Prove
- Scale (one driver, one location is fine)
- Speed (timing doesn't matter for v1 test)
- Payment (cash or Venmo for pilot, no in-app payment needed yet)
- Perfection (bugs are expected and valuable)

---

## After the Pilot
Debrief with each person separately:
- KG: "What was confusing? What would make you use this every week?"
- Driver: "Did the app make sense? What information was missing?"
- SalonCentric staff: "Would you want more orders like this? What would need to change?"

Those answers drive the next build sprint.
