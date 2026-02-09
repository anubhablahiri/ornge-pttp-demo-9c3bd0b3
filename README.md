# Ornge Family Transport Tracking Platform (FTTP)

> A multi-portal web application for **Ornge Transport Medicine**, Ontario's provider of critical care transport services. The platform delivers real-time family transport tracking and a centralized operations dashboard for logistics management across the province.

---

## 📋 Executive Overview

The Ornge FTTP addresses a critical communication gap in emergency medical transport: keeping families informed about the status and location of their loved ones during critical care transfers across Ontario.

### Problem Statement

When a patient requires inter-facility or scene-based critical care transport — by air ambulance (helicopter or fixed-wing aircraft) or land ambulance — families are often left in the dark about the transport's progress. This uncertainty adds significant stress during an already difficult time.

### Solution

The FTTP provides two purpose-built portals:

1. **Family Transport Tracking Portal** — A patient-family-facing interface that provides real-time, non-clinical updates about a transport journey. Families can track their loved one's location on a live map, view milestone progress, and access support resources — all without exposing sensitive medical information.

2. **Operations Dashboard (Admin Portal)** — A comprehensive logistics management interface for Ornge operations staff. It provides province-wide transport visibility, fleet management, crew scheduling, and analytics to support centralized coordination.

### Design Philosophy

- **Non-clinical messaging**: All patient-facing status updates use reassuring, family-friendly language. No medical jargon, diagnosis information, or clinical records are displayed.
- **Privacy-first**: Information is intentionally limited. The platform confirms transport status and location without exposing protected health information.
- **Bilingual by default**: Full English/French support throughout the family portal, with layouts optimized for variable string lengths.
- **Multi-device**: Responsive layouts for mobile, tablet, and desktop — with realistic device frame previews for demonstration purposes.

---

## 🌐 Live Demo

**Published URL:** [ornge-fttp-demo.lovable.app](https://ornge-fttp-demo.lovable.app)

> All data is mock/demo data. No backend or database is connected. Admin login uses pre-filled demo credentials.

---

## 🧭 Application Flow & Page-by-Page Breakdown

```
Landing Page (/)
├── Family Transport Tracking
│   ├── Select Transport Mode (Air / Land)
│   ├── Select Platform (Mobile / Tablet / Desktop) — auto-skipped on mobile devices
│   ├── Login (Transport Reference ID)
│   └── Tracking Dashboard (/track/:id)
│
└── Operations Dashboard
    ├── Admin Login (/admin-login)
    └── Admin Portal (/admin)
```

---

### Page 1: Welcome / Landing Page (`/`)

**File:** `src/pages/Welcome.tsx`

The entry point to the application. Features a full-width hero banner showing an Ornge helicopter over Toronto with a gradient overlay transitioning into a white content card.

**Features:**
- **Portal Selection (Step 1):** Two large card buttons — "Family Transport Tracking" and "Operations Dashboard" — allowing users to choose their entry path.
- **Transport Mode Selection (Step 2):** After selecting the family portal, users choose between "Air Transport" (helicopter & fixed-wing) and "Land Transport" (ground ambulance). This selection is stored in `sessionStorage` and used to filter mock data.
- **Responsive Hero Banner:** Uses a landscape hero image on desktop (`hero-banner.png`) and a portrait-cropped version on mobile (`hero-banner-mobile.png`).
- **Responsive Header:** Solid white background with orange Ornge logo on mobile; transparent overlay with white logo on desktop.
- **Language Toggle:** Persistent EN/FR toggle accessible from all pages.
- **Smart Navigation:** The "Back" button returns from mode selection to portal selection without page reload, preserving local state. When returning from the Platform Selector via browser history or the back link, the `location.state.portal` parameter restores the user directly to the transport mode selection view.
- **Mobile Detection:** On touch-enabled small screens (≤768px), the platform selector is bypassed entirely and the user proceeds directly to login.

---

### Page 2: Transport Mode Selection (Embedded in `/`)

**File:** `src/pages/Welcome.tsx` (second step within the Welcome component)

After selecting "Family Transport Tracking" on the portal selection screen, users are presented with a transport mode selection step — rendered inline on the same page without a route change.

**Features:**
- **Two Mode Options:** "Air Transport" (helicopter & fixed-wing aircraft) and "Land Transport" (ground ambulance), each displayed as a large card with a circular icon badge (Plane / Truck), bold label, and descriptive subtitle.
- **Session Persistence:** The selected mode (`air` or `land`) is written to `sessionStorage` under the key `transportMode`. This value is used downstream to filter mock transport data and display mode-appropriate UI elements (altitude indicators, flight progress bars, etc.).
- **Back Button:** An "← Back" link at the top left returns the user to the portal selection step (Step 1) without a page navigation, preserving smooth in-page transitions via local state.
- **Mobile-Aware Routing:** On touch-enabled small screens (≤768px), selecting a transport mode navigates directly to `/login`, bypassing the Platform Selector. On desktop browsers, it navigates to `/platform` for device format selection.
- **Full i18n Support:** Mode titles and descriptions are bilingual (`welcome.air`, `welcome.land`, `welcome.airDesc`, `welcome.landDesc`).
- **Framer Motion Animations:** The section fades and slides in with `motion.div`. Each card responds to hover (scale up) and tap (scale down) interactions.
- **State Restoration:** When navigating back from the Platform Selector page, `location.state.portal === 'family'` ensures users land on this transport mode step rather than resetting to the initial portal choice.

---

### Page 3: Platform Selector (`/platform`)

**File:** `src/pages/FormatSelector.tsx`

A device picker page that lets users choose how they want to experience the demo. This page is **only shown on desktop browsers** — mobile users skip it entirely.

**Features:**
- **Three Device Options:** Mobile (iPhone), Tablet (iPad), and Desktop (Laptop) — each represented by a front-facing device mockup image with a visual size hierarchy (Laptop > Tablet > Smartphone).
- **Device Mockup Images:** Custom assets (`device-iphone.png`, `device-ipad.png`, `device-laptop.png`) showing internal dashboard screenshots within the device frames.
- **Framer Motion Animations:** Each device card animates in with a staggered fade-up effect and responds to hover/tap with scale transforms.
- **Back Navigation:** A "← Select Transport Mode" link at the bottom navigates back to the Welcome page with `{ state: { portal: 'family' } }` to preserve the family portal context.

---

### Page 4: Family Login (`/login`)

**File:** `src/pages/Login.tsx`

A secure-feeling login page where families enter their Transport Reference Number to access the tracking dashboard.

**Features:**
- **Pre-filled Demo Credentials:** The reference number field is pre-filled with `ORN-2025-4821` for easy demo access.
- **Reference Lookup:** On submit, the entered reference ID is matched against `mockTransports` data. If found, the user is navigated to the tracking dashboard; otherwise, an error message is displayed.
- **Device-Aware Routing:** The login page routes to the correct URL prefix based on the selected device format (`/track/:id`, `/tablet/track/:id`, or `/desktop/track/:id`).
- **Security Indicators:** A shield icon and "Secure & Private Access" label reinforce trust.
- **Privacy Notice:** A footer message confirms that no medical records or diagnosis information are displayed.
- **Back to Platform:** On non-mobile devices, a "← Select Platform" link returns to the format selector.
- **Full i18n Support:** All labels, error messages, and placeholders are bilingual (EN/FR).

---

### Page 5: Tracking Dashboard (`/track/:id`)

**File:** `src/pages/Dashboard.tsx`

The core family-facing interface. Displays comprehensive, real-time transport information in a non-clinical format. The layout adapts significantly across device formats.

**Layout Strategy:**
- **Mobile:** Single-column vertical stack of all components.
- **Tablet:** Two-column grid with transport info on the left and maps/updates on the right, plus a full-width bottom row for support and demo controls.
- **Desktop:** Two-row layout — a top row with transport header and ETA side-by-side, followed by a main content area with a narrow left sidebar (support, updates, details, admin) and a wide right panel (maps, timeline).

**Components (in display order):**

#### 5a. Transport Header (`TransportHeader.tsx`)
- Displays the Transport Reference ID (e.g., `ORN-2025-4821`), patient first name with possessive suffix (e.g., "Sarah's Transport"), transport mode badge (Air/Land with icon), care level badge (Critical Care / Advanced Care / Basic Care), and origin/destination facility names.

#### 5b. ETA Display (`ETADisplay.tsx`)
- Shows estimated arrival time for either the pickup location or the destination, depending on the current transport phase.
- **Smart Visibility:** ETA is hidden during patient transfer phases (milestone 5) and after arrival at destination (milestone 8+) to manage family expectations.
- Includes a disclaimer: "Times are estimates and may change due to weather or operational factors."

#### 5c. Live Tracking Card (`LiveMap.tsx`)
- A **five-phase horizontal progress bar** that condenses the 10 transport milestones into five visual stages: Preparing → En Route to Pickup → With Patient → En Route to Dropoff → Completed.
- Each phase shows the transport mode icon (Plane or Truck) with the active phase pulsing.
- Below the progress bar, a contextual status message describes the current phase in plain language.
- For air transports in the "En Route to Destination" phase, an animated flight progress bar is displayed with a gradient fill.
- Includes altitude display for air transports (e.g., "Alt: 24,000 ft").

#### 5d. Interactive Map (`TrackingMap.tsx`)
- **Leaflet/OpenStreetMap** interactive map with CartoDB Light tiles.
- Three marker types: Green circle (origin), Red circle (destination), Pulsing orange circle (current vehicle position).
- Route visualization: Dashed gray polyline for the full planned route; solid orange polyline for the completed portion.
- **Auto-fit bounds:** Map automatically adjusts zoom and center to show all three points with padding.
- Vehicle marker is hidden when transport is complete.
- For air transports, an altitude badge appears in the card header.

#### 5e. Status Timeline (`StatusTimeline.tsx`)
- A **10-milestone timeline** tracking the full transport journey from "Preparing for Transport" through "Transport Completed."
- **Responsive orientation:** Vertical layout on mobile/tablet; horizontal layout on desktop.
- Each milestone shows a numbered circle with three states: completed (green with checkmark), active (blue with pulse animation), or pending (gray).
- Active and recently completed milestones display a contextual message (e.g., "The team is on the way to your family member").
- Completed milestones show their completion timestamp.

##### The 10 Transport Milestones:
1. Preparing for Transport
2. Transport Team Assigned
3. Team Dispatched
4. En Route to Pickup Location
5. Arrived at Pickup Location
6. Patient Transfer in Progress
7. Departed from Pickup
8. En Route to Destination
9. Arrived at Destination
10. Transport Completed

#### 5f. Notification Feed (`NotificationFeed.tsx`)
- A chronological (newest-first) list of transport updates.
- Four notification types with distinct icons: `status` (ArrowRightLeft), `departure` (MapPin), `arrival` (MapPin), `delay` (AlertTriangle with warning styling).
- Each notification shows its message and timestamp (HH:MM format).

#### 5g. Transport Details (`TransportDetails.tsx`)
- An **accordion-based** expandable section with three panels:
  - **Crew Information:** Crew type (e.g., "Critical Care Paramedic + Flight Nurse") and vehicle ID (e.g., "Ornge Pilatus PC-12 (C-GORN)").
  - **Equipment Onboard:** List of medical equipment as pill-shaped badges (e.g., Ventilator, Cardiac Monitor, IV Pumps, Blood Products).
  - **Clinical Summary:** A brief, non-diagnostic summary of the patient's status (e.g., "Patient is stable and being monitored continuously").

#### 5h. Family Support (`FamilySupport.tsx`)
- A support card with an empathetic message: "We understand this is a stressful time."
- **Transport Coordination hotline:** Clickable `tel:` link to 1-800-461-1911.
- **FAQ section:** "What happens during transport?" with a brief reassuring answer.

#### 5i. Demo Controls (`AdminToggle.tsx`)
- A collapsible panel (dashed warning-colored border) that provides demo-only controls for testing purposes.
- **Jump to Status:** A grid of 10 buttons allowing instant navigation to any transport milestone.
- **Simulate Delay:** Adds a mock delay notification ("A brief delay has been reported due to weather conditions").
- **Undo Delay:** Removes the most recent delay notification.
- When milestone 10 is selected, all milestones are marked complete and no milestone is active, reflecting a finished transport.

---

### Page 5: Device Frame Wrapper (`DeviceFrame.tsx`)

**File:** `src/components/DeviceFrame.tsx`

Not a page itself, but wraps the Login and Dashboard pages in a realistic device mockup when viewed on desktop browsers.

**Features:**
- **Mobile Frame:** iPhone-style frame with Dynamic Island notch, status bar (time, signal, WiFi, battery icons), and home indicator bar. Dimensions: 390×844px.
- **Tablet Frame:** iPad-style frame with minimal bezel and status bar. Dimensions: 768×1024px.
- **Desktop:** No frame wrapper — content renders at full width.
- **Auto-bypass:** If the browser width is less than 1024px, the frame is not rendered regardless of the selected format.

---

### Page 6: Admin Login (`/admin-login`)

**File:** `src/pages/AdminLogin.tsx`

A dedicated login page for operations staff to access the admin dashboard.

**Features:**
- **Pre-filled Demo Credentials:** Email (`admin@ornge.ca`) and password are pre-filled.
- **Demo Mode Notice:** A highlighted banner explains that credentials are pre-filled for demo purposes.
- **Simulated Authentication:** Clicking "Sign In" triggers an 800ms loading spinner before redirecting to `/admin`.
- **Back Navigation:** A "← Back to Portal Selection" link returns to the Welcome page.

---

### Page 7: Operations Dashboard / Admin Portal (`/admin`)

**File:** `src/pages/AdminPortal.tsx`

A comprehensive operations dashboard for Ornge's centralized logistics management. Uses a wide viewport (95vw) layout with a sticky header.

**Sections (top to bottom):**

#### 7a. Header
- Sticky navigation bar with Ornge logo, "Operations Dashboard" title, subtitle "Ornge Transport Medicine," and the current date.
- Back arrow returns to the root landing page.

#### 7b. Operational Stat Cards (`AdminStatCard.tsx`)
- Six summary cards in a responsive grid (6 columns on large screens, 4 on medium, 2 on mobile):
  - **Live Transports:** 7 (primary accent)
  - **Air Active:** 4 (primary accent)
  - **Land Active:** 3 (primary accent)
  - **Completed Today:** 23 (success/green accent)
  - **Avg Response:** 14 min (warning/amber accent)
  - **Delays:** 2 (destructive/red accent)

#### 7c. Live Transport Map (`AdminMapView.tsx`)
- A **province-wide Leaflet map** centered on Ontario showing:
  - **5 active transports** with route polylines (solid completed, dashed remaining).
  - Color-coded vehicle markers: Orange for air, green for land.
  - **4 Ornge base locations** (Toronto, Sudbury, Thunder Bay, Ottawa) with darker markers.
  - Popup details on click: transport ID, route, mode, and status.
  - Map legend showing Air, Land, and Base marker types.

#### 7d. Recent Transports Table (`AdminRecentTransports.tsx`)
- A list of the 6 most recent transports with:
  - Transport mode icon (Plane/Truck) with color-coded background.
  - Patient name (abbreviated), reference ID, and route.
  - Status badge: "In Transit" (primary), "Dispatched" (warning), or "Completed" (success).

#### 7e. Crew Scheduling (`AdminCrewScheduling.tsx`)
- A roster of 8 crew members with:
  - Name, role (Flight Physician, Flight Paramedic, Pilot, Land Paramedic), assigned vehicle ID, shift hours, and base location.
  - Status indicators: On Duty (green dot), En Route (blue dot), On Call (amber dot), Off Duty (gray dot).
  - Summary counts: "X On Duty" and "X On Call" in the header.

#### 7f. Fleet Status (`AdminFleetStatus.tsx`)
- Vehicle availability broken down by fleet type:
  - **Fixed-Wing (PC-12):** 10 total, 4 active, 1 maintenance.
  - **Rotor-Wing (AW139):** 12 total, 6 active, 2 maintenance.
  - **Land Ambulance:** 20 total, 3 active, 3 maintenance.
- Each type shows a progress bar (active percentage) and active/available/maintenance counts.
- Summary row: 42 Total Fleet, 13 Active Now, 23 Available.

#### 7g. Transport Analytics (`AdminTransportChart.tsx` + `AdminPerformanceMetrics.tsx`)
- **Tabbed interface** with Weekly / Monthly / Yearly views.
- **Bar Chart (Recharts):** Stacked bar chart showing air vs. land transport volume over time. Uses Ornge brand orange for air and navy blue for land.
- **Performance Metrics Panel:**
  - Total Transports count
  - On-Time Rate (percentage with progress bar, green)
  - Patient Satisfaction (percentage with progress bar, primary blue)
  - Average Response Time
  - Breakdown by Care Level: Critical Care (red), Advanced Care (amber), Basic Care (green)

#### 7h. Detailed Statistics (`AdminDetailedStats.tsx`)
- **Summary Banner:** Total Daily Transports (64) with a "Download Full Report" button.
- **By Response Type:** Scene (5), Modified-Scene (4), Interfacility (52), Life or Limb (11) — each with individual CSV download.
- **By Vehicle:** Fixed-Wing (32), Rotor-Wing (9), Land Ambulance (23) — each with individual CSV download.
- **Other Daily Statistics:** Longest Patient Transport (913 KM), Avg Transport Distance (287 KM), Total Flight Hours (142 hrs), Patients Transported (64).
- **CSV Export:** Both individual stat downloads and a full composite report are generated as CSV blobs and triggered via `URL.createObjectURL`.

---

## 🌍 Internationalization (i18n)

**File:** `src/lib/i18n.tsx`

A custom context-based i18n system providing:

- **Supported Languages:** English (`en`) and French (`fr`).
- **Translation Coverage:** ~60+ keyed strings covering all family-facing content: welcome page, login, dashboard labels, milestone names and messages, support text, admin controls, and format selector.
- **Implementation:** A React Context (`AppProvider`) exposes a `t(key)` function and `lang` state. The `LanguageToggle` component provides a persistent toggle button accessible on all pages.
- **Layout Optimization:** French translations are generally longer than English. The UI accommodates this with responsive text alignment, word-breaking, and flexible container sizing.

---

## 🧪 Mock Data

**File:** `src/data/mockTransports.ts`

Three pre-configured transport scenarios:

| ID | Reference | Patient | Route | Mode | Care Level | Status |
|----|-----------|---------|-------|------|------------|--------|
| T-1 | ORN-2025-4821 | Sarah Mitchell | Thunder Bay → Toronto | Air | Critical Care | En Route to Destination (Milestone 7) |
| T-2 | ORN-2025-4819 | James Chen | Brampton → Hamilton | Land | Advanced Care | Team Dispatched (Milestone 2) |
| T-3 | ORN-2025-4815 | Maria Santos | Sudbury → Ottawa | Air | Critical Care | Completed (All milestones done) |

Each transport includes coordinates (origin, destination, current position), crew details, equipment lists, notification history, ETA values, and clinical notes.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | React 18 + TypeScript | Component architecture & type safety |
| Build Tool | Vite | Fast dev server & optimized production builds |
| Styling | Tailwind CSS + shadcn/ui | Utility-first CSS with pre-built accessible components |
| Animations | Framer Motion | Page transitions, hover effects, staggered reveals |
| Routing | React Router v6 | Client-side routing with device-prefixed paths |
| Charts | Recharts | Bar charts for transport volume analytics |
| Maps | Leaflet + React Leaflet | Interactive maps with CartoDB Light tiles |
| State | TanStack React Query | Server-state management (configured, used for future API integration) |
| i18n | Custom React Context | Bilingual EN/FR support with keyed translations |

---

## 🎨 Design System

**File:** `src/index.css` + `tailwind.config.ts`

### Brand Colors (HSL)

| Token | Light Mode | Purpose |
|-------|-----------|---------|
| `--primary` | `22 90% 54%` | Ornge brand orange — CTAs, active indicators, map routes |
| `--secondary` | `224 70% 35%` | Ornge navy blue — admin header, foreground text, chart accents |
| `--success` | `152 60% 40%` | Completed states, on-time rates, origin markers |
| `--warning` | `38 92% 50%` | Delays, on-call crew, caution indicators |
| `--destructive` | `0 72% 51%` | Critical alerts, destination markers, error states |
| `--active` | `210 100% 52%` | Active milestone pulse animation |
| `--foreground` | `224 70% 35%` | Primary text (navy blue, replacing standard black) |

### Typography

- **Display Font:** Plus Jakarta Sans (headings, stat values, labels) via `.font-display`
- **Body Font:** Inter (body text, descriptions, metadata)
- Both loaded via Google Fonts CDN.

### Custom Animations

- `animate-pulse-active`: Blue pulsing glow for active timeline milestones
- `animate-vehicle-bounce`: Vertical bounce for vehicle indicators
- Leaflet marker pulse: CSS keyframe animation for the pulsing orange vehicle marker on the map

### Component Library

All UI components are from **shadcn/ui**, customized with Ornge-themed semantic tokens. Key components used: Card, Badge, Button, Accordion, Tabs, Progress, Input, Label, Dialog.

---

## 📁 Project Structure

```
src/
├── assets/                    # Static images
│   ├── ornge-logo.png         # Orange Ornge logo (for light backgrounds)
│   ├── ornge-logo-white.png   # White Ornge logo (for dark/hero backgrounds)
│   ├── hero-banner.png        # Landscape hero image (desktop)
│   ├── hero-banner-mobile.png # Portrait hero image (mobile)
│   ├── device-iphone.png      # iPhone mockup with dashboard screenshot
│   ├── device-ipad.png        # iPad mockup with dashboard screenshot
│   ├── device-laptop.png      # Laptop mockup with dashboard screenshot
│   └── ontario-map.png        # Ontario map background
│
├── components/
│   ├── admin/                 # Operations dashboard components
│   │   ├── AdminStatCard.tsx       # Individual stat card with icon + accent color
│   │   ├── AdminMapView.tsx        # Province-wide Leaflet map with live transports
│   │   ├── AdminRecentTransports.tsx # Recent transport activity table
│   │   ├── AdminCrewScheduling.tsx  # Crew roster with shift/status management
│   │   ├── AdminFleetStatus.tsx     # Fleet availability by vehicle type
│   │   ├── AdminTransportChart.tsx  # Recharts bar chart (air vs land volume)
│   │   ├── AdminPerformanceMetrics.tsx # KPIs: on-time rate, satisfaction, response time
│   │   └── AdminDetailedStats.tsx   # Granular breakdowns with CSV export
│   │
│   ├── transport/             # Family tracking dashboard components
│   │   ├── TransportHeader.tsx     # Patient name, reference ID, mode, care level, route
│   │   ├── ETADisplay.tsx          # Dynamic ETA with phase-aware visibility
│   │   ├── LiveMap.tsx             # 5-phase horizontal progress bar + status message
│   │   ├── TrackingMap.tsx         # Interactive Leaflet map with route polylines
│   │   ├── StatusTimeline.tsx      # 10-milestone vertical/horizontal timeline
│   │   ├── NotificationFeed.tsx    # Chronological update feed
│   │   ├── TransportDetails.tsx    # Accordion: crew info, equipment, clinical summary
│   │   ├── FamilySupport.tsx       # Support resources + hotline
│   │   └── AdminToggle.tsx         # Demo controls for milestone jumping & delay simulation
│   │
│   ├── DeviceFrame.tsx        # iPhone/iPad device frame wrapper
│   ├── LanguageToggle.tsx     # EN/FR language switch button
│   ├── NavLink.tsx            # Navigation link component
│   └── ui/                    # shadcn/ui base components (40+ components)
│
├── data/
│   └── mockTransports.ts      # Transport type definitions, 3 mock records, helper functions
│
├── hooks/
│   ├── use-mobile.tsx         # Mobile device detection hook
│   └── use-toast.ts           # Toast notification hook
│
├── lib/
│   ├── i18n.tsx               # App context: language state, translations, device format
│   └── utils.ts               # Tailwind class merge utility (cn)
│
├── pages/
│   ├── Welcome.tsx            # Landing page: portal selection + transport mode selection
│   ├── FormatSelector.tsx     # Device format picker (mobile/tablet/desktop)
│   ├── Login.tsx              # Family transport login
│   ├── Dashboard.tsx          # Family tracking dashboard (multi-layout)
│   ├── AdminLogin.tsx         # Operations staff login
│   ├── AdminPortal.tsx        # Operations dashboard
│   ├── Index.tsx              # Index redirect
│   └── NotFound.tsx           # 404 page
│
├── App.tsx                    # Router configuration with device-prefixed routes
├── main.tsx                   # Application entry point
└── index.css                  # Design tokens, custom fonts, animations
```

---

## 🛣 Routing Configuration

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Welcome` | Landing page with portal selection |
| `/platform` | `FormatSelector` | Device format picker |
| `/login` | `FramedLogin` | Family login (wrapped in device frame) |
| `/track/:id` | `FramedDashboard` | Mobile tracking dashboard (in device frame) |
| `/tablet/track/:id` | `FramedDashboard` | Tablet tracking dashboard (in device frame) |
| `/desktop/track/:id` | `Dashboard` | Desktop tracking dashboard (no frame) |
| `/admin-login` | `AdminLogin` | Operations staff login |
| `/admin` | `AdminPortal` | Operations dashboard |
| `*` | `NotFound` | 404 catch-all |

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
- **Admin login** uses pre-filled demo credentials (`admin@ornge.ca`) — click Sign In to proceed.
- **Family login** accepts any Transport Reference ID that matches the mock data (e.g., `ORN-2025-4821`, `ORN-2025-4819`, `ORN-2025-4815`).
- **Device frame previews** simulate realistic mobile/tablet chrome (Dynamic Island, status bar, home indicator) when viewed on desktop browsers.
- **Demo Controls** (dashed-border panel in the tracking dashboard) allow instant jumping between transport milestones and delay simulation for testing all UI states.
- **CSV exports** in the admin portal generate mock data files — the download functionality is fully functional but the data is static.

---

© Ornge Transport Medicine — Demo Application
