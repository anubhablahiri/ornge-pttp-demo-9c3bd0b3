# Ornge Patient Transport Tracking Portal (PTTP)

> A multi-version prototype web application for **Ornge Transport Medicine**, Ontario's provider of critical care transport services. The portal keeps families informed about their loved one's transport journey and provides operations staff with centralized logistics management tools.

---

## 📋 Executive Overview

The Ornge PTTP addresses a critical communication gap in emergency medical transport: keeping families informed about the status and location of their loved ones during critical care transfers across Ontario.

### The Problem

When a patient requires inter-facility or scene-based critical care transport — by air ambulance (helicopter or fixed-wing aircraft) or land ambulance — families are often left in the dark about the transport's progress. This uncertainty adds significant stress during an already difficult time.

### The Solution

The PTTP provides two purpose-built portals across multiple prototype versions:

1. **Patient Transport Tracking** — A patient-family-facing interface that provides non-clinical updates about a transport journey. Families can track their loved one's progress through milestones, view estimated arrival times, and access support resources — all without exposing sensitive medical information.

2. **Operations Dashboard** — A logistics management interface for Ornge operations staff. It provides transport visibility, fleet management, tracking number generation, QR code sharing, and analytics to support coordination.

### Design Philosophy

- **Non-clinical messaging**: All patient-facing status updates use reassuring, family-friendly language. No medical jargon, diagnosis information, or clinical records are displayed.
- **Privacy-first**: Information is intentionally limited. The platform confirms transport status and location without exposing protected health information.
- **Bilingual support** (V3): Full English/French support throughout the family portal.
- **Multi-device**: Responsive layouts for mobile, tablet, and desktop — with realistic device frame previews for demonstration purposes.

---

## 🌐 Live Demo

**Published URL:** [ornge-pttp-demo.lovable.app](https://ornge-pttp-demo.lovable.app)

> All data is mock/demo data. No backend or database is connected.

---

## 🔐 Secure Access Gate

The entire application is protected behind a login screen. Users must enter valid credentials to access any part of the prototype. After successful authentication, the user is taken to the Version Selection screen.

**Features:**
- Username and password authentication
- Rate limiting: 3 failed attempts trigger a 5-minute lockout with a visible countdown timer
- Session-based security — navigating directly to any internal page without logging in redirects back to the login screen

---

## 🧭 Version Selection

After logging in, users are presented with the Version Selection screen, which provides an overview of all prototype iterations. Each version is displayed as a card with its name, subtitle, description, and a list of key features.

The four versions are:
- **Version 1** — Manual Static Tracker
- **Version 2** — Semi-Live Tracker
- **Version 3** — Real-Time Platform
- **Version 4** — TBD (not yet clickable)

Users can click any active version card to explore that iteration. A logout button at the bottom returns to the secure login screen.

---

## 📦 Version 1 — Manual Static Tracker

**Subtitle:** Manual data posting of transport data from PTAC and OCC. No real-time data.

Version 1 represents the simplest iteration of the tracking concept. All transport data is manually entered by operations staff, and families see static updates that are refreshed only when staff post new information.

### Portal Selection

Upon entering Version 1, users choose between two access paths:
- **Patient Tracking** — For families to track their loved one's transport
- **Operations Dashboard** — For admin staff to manage and post transport updates

A back link returns to the Version Selection screen.

### Platform Selector

On desktop browsers, users can choose how they want to view the demo: Mobile, Tablet, or Desktop. Each option is represented by a realistic device mockup image. On mobile devices, this step is skipped automatically.

### Patient Login

A simple login screen where families enter a Transport Reference ID to access the tracking view. The reference field is pre-filled with a demo value for easy testing.

### Patient Tracking Dashboard

The family-facing tracking view in V1 includes:

- **QR Code & Share Link** — A QR code and a "Copy Tracking Link" button allow families to share the tracking page with others
- **Patient & Route Information** — Displays the transport reference number, transport mode (Air or Land), origin and destination facilities, and estimated arrival time
- **5-Stage Horizontal Timeline** — A simplified progress tracker showing five stages: Requested → Team Assigned → En Route to Pickup → In Transit → Arrived. Completed stages are highlighted, and the current stage pulses to indicate activity
- **Special Message Box** — A dedicated area for operations staff to post contextual messages (e.g., delay notices, weather updates, or reassuring notes)
- **Transport Details** — Shows care level, crew type, and vehicle information

### Operations Dashboard (V1 Admin)

The V1 admin portal is a **manual data entry system** designed for operations staff to create, update, and manage patient tracking entries. It functions as a simple content management tool.

**Features:**
- **Tracking Number Management** — Staff can manually enter or auto-generate 16-digit tracking numbers
- **Mission Number Assignment** — Link each tracking entry to an internal mission number
- **Status Selection** — Choose from six predefined statuses: Preparing for Transport, En Route to Patient Pickup, With Patient, En Route to Patient Dropoff, Arrived at Destination, Transport Complete
- **ETA Entry** — Set estimated arrival times using a date/time picker
- **Hospital Selection** — Choose the destination hospital from a predefined list of Ontario facilities
- **Special Messages** — Attach predefined messages (e.g., Medical Delay, Weather Delay) or write custom notes
- **QR Code Sharing** — Generate a QR code for each tracking entry to share with families
- **Tracking Table** — A searchable table showing all active tracking entries with their tracking number, mission number, status, last updated time, and ETA. Staff can edit or delete entries directly from the table
- **Filter/Search** — Quickly find entries by tracking number, mission number, or status

The admin login uses pre-filled demo credentials — simply click Sign In to proceed.

---

## 📦 Version 2 — Semi-Live Tracker

**Subtitle:** Manual data posting of transport data from PTAC and OCC with minimum real-time data from Flight Vector.

Version 2 builds on V1 by introducing a more detailed timeline, a notification feed, and a richer operations dashboard. While data is still primarily manually posted, minimal real-time data from Flight Vector begins to supplement the updates.

### Portal Selection

Same as V1 — users choose between Patient Tracking and Operations Dashboard.

### Platform Selector

Same as V1 — desktop users can choose between Mobile, Tablet, and Desktop views.

### Patient Login

A login screen where families enter a Transport Reference ID (e.g., ORN-2025-4821). Pre-filled with a demo value for easy testing.

### Patient Tracking Dashboard

The family-facing tracking view in V2 includes:

- **QR Code & Share Link** — Same as V1, allowing families to scan or copy a link to share the tracking page
- **Patient & Route Information** — Displays reference number, transport mode, origin/destination, and ETA with a highlighted time badge
- **7-Stage Vertical Timeline** — An expanded progress tracker with seven stages: Transport Requested → Team Assigned → Team Dispatched → Arrived at Pickup → Patient Onboard → En Route to Destination → Transport Complete. Each stage shows a colored circle indicating completed, active (pulsing), or pending status
- **Notification Feed** — A chronological list of transport updates, each with a message and timestamp. This is a new addition compared to V1, giving families a running log of events
- **Transport Details** — Shows care level, crew type, and vehicle information
- **Clinical Notes** — A brief, non-diagnostic summary of the patient's status (e.g., "Patient is stable and being monitored continuously")

### Operations Dashboard (V2 Admin)

The V2 admin portal is a **monitoring-focused dashboard** that provides at-a-glance visibility into transport operations. Unlike V1's manual data entry approach, V2 presents a summary view of all active and recent transports.

**Features:**
- **Summary Statistics** — Six stat cards showing: Live Transports (7), Air Active (4), Land Active (3), Completed Today (23), Average Response Time (14 min), and Delays (2)
- **Recent Transports Table** — A list of recent transports with patient name, reference ID, route (origin → destination), transport mode (Air or Land), and status badges (In Transit, Dispatched, or Completed)
- **QR Code Sharing** — Each transport in the table has a QR code button. Clicking it reveals an inline panel with a scannable QR code, a copyable tracking link, and a description explaining how to share it with the patient's family
- **Fleet Status** — Vehicle availability broken down by fleet type:
  - Fixed-Wing (PC-12): 10 total, 4 active, 1 maintenance
  - Rotor-Wing (AW139): 12 total, 6 active, 2 maintenance
  - Land Ambulance: 20 total, 3 active, 3 maintenance
  - Each type shows a visual progress bar and active/available/maintenance counts

The admin login uses pre-filled demo credentials — simply click Sign In to proceed.

---

## 📦 Version 3 — Real-Time Platform

**Subtitle:** Automated real-time data from PTAC, OCC, and Flight Vector.

Version 3 is the most advanced iteration, featuring live map tracking, full system integration, multi-device previews, and bilingual support. Transport data is fully automated with no manual data posting required.

### Landing Page

The entry point features a full-width hero banner showing an Ornge helicopter over Toronto. Users choose between two portals:
- **Patient Transport Tracking** — For families
- **Operations Dashboard** — For admin staff

After selecting Patient Transport Tracking, users choose between Air Transport and Land Transport.

### Platform Selector

On desktop browsers, users choose a device view (Mobile, Tablet, or Desktop) using realistic device mockup images. Mobile users skip this step.

### Patient Login

A secure login screen with:
- **Transport Reference ID** field (pre-filled with a demo value)
- **Nickname** field — Families can optionally enter their name (e.g., "Mom") for a personalized experience
- Privacy notice confirming no medical records or diagnosis information are displayed
- Full bilingual support (English/French) with a language toggle

### Patient Tracking Dashboard

The most feature-rich family-facing view, with layout adapting across mobile, tablet, and desktop:

- **Transport Header** — Displays reference ID, patient first name with possessive (e.g., "Sarah's Transport"), transport mode badge (Air/Land), care level badge, and origin/destination facilities
- **ETA Display** — Smart estimated arrival that changes based on the current transport phase and hides during patient transfer or after arrival
- **Live Tracking Card** — A five-phase horizontal progress bar condensing the journey into: Preparing → En Route to Pickup → With Patient → En Route to Dropoff → Completed. Includes altitude display for air transports and an animated flight progress bar
- **Interactive Map** — A live map showing three markers: origin (green), destination (red), and current vehicle position (pulsing orange). Dashed route line for the planned path and solid line for the completed portion
- **10-Milestone Timeline** — A detailed timeline tracking all stages from "Preparing for Transport" through "Transport Completed." Each milestone shows completion timestamps and contextual messages
- **Notification Feed** — Chronological updates with distinct icons for status changes, departures, arrivals, and delays
- **Transport Details** — Expandable sections for crew information, equipment onboard, and a non-clinical patient summary
- **Family Support** — An empathetic support card with the Transport Coordination hotline (1-800-461-1911) and a brief FAQ
- **Demo Controls** — A testing panel allowing instant navigation to any transport milestone, delay simulation, and undo

### Device Frame Previews

When viewing the demo on a desktop browser, the Mobile and Tablet views are wrapped in realistic device frames:
- **Mobile:** iPhone-style frame with Dynamic Island notch, status bar, and home indicator
- **Tablet:** iPad-style frame with minimal bezel and status bar
- **Desktop:** No frame — content renders at full width

### Operations Dashboard (V3 Admin)

The most comprehensive operations dashboard with province-wide visibility:

- **Summary Statistics** — Six stat cards: Live Transports, Air Active, Land Active, Completed Today, Average Response Time, and Delays
- **Live Transport Map** — A province-wide interactive map of Ontario showing active transports with route lines, color-coded vehicle markers (orange for air, green for land), and Ornge base locations (Toronto, Sudbury, Thunder Bay, Ottawa). Click any transport for details
- **Recent Transports Table** — Transport list with mode icons, patient names, routes, and status badges
- **Crew Scheduling** — A roster of crew members with names, roles, assigned vehicles, shift hours, base locations, and status indicators (On Duty, En Route, On Call, Off Duty)
- **Fleet Status** — Vehicle availability by fleet type with progress bars
- **Transport Analytics** — Tabbed bar charts (Weekly/Monthly/Yearly) showing air vs. land transport volume, plus performance metrics: on-time rate, patient satisfaction, average response time, and care level breakdown
- **Detailed Statistics** — Daily totals by response type and vehicle type, with CSV export for individual categories and full reports

The admin login uses pre-filled demo credentials — simply click Sign In to proceed.

### Bilingual Support (V3 Only)

Version 3 includes full English/French language support:
- A persistent language toggle (EN/FR) is accessible from all pages
- Over 60 translated text strings covering the landing page, login, dashboard labels, milestone names and messages, support text, and format selector
- The interface automatically adapts to French text lengths

---

## 🧪 Demo Data

Three pre-configured transport scenarios are available for testing:

| Reference | Patient | Route | Mode | Care Level | Current Status |
|-----------|---------|-------|------|------------|----------------|
| ORN-2025-4821 | Sarah Mitchell | Thunder Bay → Toronto | Air | Critical Care | En Route to Destination |
| ORN-2025-4819 | James Chen | Brampton → Hamilton | Land | Advanced Care | Team Dispatched |
| ORN-2025-4815 | Maria Santos | Sudbury → Ottawa | Air | Critical Care | Completed |

Each transport includes coordinates, crew details, equipment lists, notification history, ETA values, and clinical notes.

---

## 🎨 Design System

### Brand Colors

| Color | Purpose |
|-------|---------|
| **Ornge Orange** | Primary brand color — buttons, active indicators, map routes |
| **Ornge Navy Blue** | Secondary color — admin headers, text, chart accents |
| **Green** | Completed states, on-time rates, origin markers |
| **Amber** | Delays, on-call crew, caution indicators |
| **Red** | Critical alerts, destination markers, errors |
| **Blue** | Active milestone pulse animation |

### Typography

- **Display Font:** Plus Jakarta Sans (headings and labels)
- **Body Font:** Inter (body text and descriptions)

### Visual Consistency

All four versions share a consistent light-themed design with the same color palette, typography, and card-based layouts. This ensures a cohesive look across all prototype iterations.

---

## 🛠 Technology

Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui components. Maps are powered by Leaflet with OpenStreetMap tiles. Charts use Recharts. Animations are handled by Framer Motion.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📝 Important Notes

- **All data is mock/demo data** — no backend, database, or API is connected.
- **Secure access** — The entire application requires login credentials. Without authentication, no internal pages can be accessed.
- **Admin login** uses pre-filled demo credentials — click Sign In to proceed.
- **Patient login** accepts Transport Reference IDs matching the demo data (e.g., ORN-2025-4821).
- **Device frame previews** simulate realistic mobile/tablet appearance when viewed on desktop browsers.
- **Demo Controls** (V3 only) allow instant jumping between transport milestones and delay simulation for testing all UI states.
- **CSV exports** in the V3 admin portal generate mock data files — the download functionality works but the data is static.

---

© Ornge Transport Medicine — Demo Application
