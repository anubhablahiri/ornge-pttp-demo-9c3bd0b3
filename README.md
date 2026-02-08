# Ornge Family Transport Tracking Platform (FTTP)

A multi-portal web application for **Ornge Transport Medicine**, providing real-time family transport tracking and an operations dashboard for centralized logistics management.

---

## 🚁 Overview

This platform serves two primary user groups:

1. **Families & Patients** — Track critical care transport journeys in real-time with a non-clinical, reassuring interface.
2. **Operations Staff** — Monitor fleet status, crew scheduling, transport analytics, and live activity across Ontario.

## 🌐 Live Demo

**Published URL:** [ornge-fttp-demo.lovable.app](https://ornge-fttp-demo.lovable.app)

---

## ✨ Features

### Family Transport Tracking Portal

- **Transport Mode Selection** — Choose between Air (helicopter/plane) or Land (ambulance) transport tracking.
- **Multi-Device Support** — Optimized layouts for mobile, tablet, and desktop with realistic device frame previews.
- **10-Stage Status Timeline** — Non-clinical milestone updates from dispatch to completion (responsive: vertical on mobile/tablet, horizontal on desktop).
- **Live Map** — Real-time transport location tracking via Leaflet/OpenStreetMap.
- **ETA Display** — Estimated time of arrival with live updates.
- **Notification Feed** — Chronological updates about the transport journey.
- **Family Support Resources** — Contextual support information for families during transport.
- **Bilingual Support** — Full English/French toggle with responsive layouts for variable string lengths.

### Operations Dashboard (Admin Portal)

- **Live Transport Stats** — Real-time counts for air/land transports, completions, response times, and delays.
- **Ontario-Wide Map View** — Province-wide visualization of active transports.
- **Crew Scheduling** — Crew assignment and shift management interface.
- **Fleet Status** — Vehicle availability and maintenance tracking.
- **Transport Analytics** — Weekly, monthly, and yearly analytics via Recharts with performance metrics.
- **Detailed Statistics** — Granular breakdowns by transport type, vehicle usage, and flight hours with CSV export.

---

## 🧭 User Flow

```
Landing Page (/)
├── Family Transport Tracking
│   ├── Select Transport Mode (Air / Land)
│   ├── Select Platform (Mobile / Tablet / Desktop) — auto-skipped on mobile devices
│   ├── Login (Transport Reference ID)
│   └── Tracking Dashboard (/track/:id)
│
└── Operations Dashboard
    ├── Admin Login (/admin-login) — demo credentials pre-filled
    └── Admin Portal (/admin)
```

---

## 🛠 Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | React 18 + TypeScript               |
| Build Tool   | Vite                                |
| Styling      | Tailwind CSS + shadcn/ui            |
| Animations   | Framer Motion                       |
| Routing      | React Router v6                     |
| Charts       | Recharts                            |
| Maps         | Leaflet + React Leaflet             |
| State        | TanStack React Query                |
| i18n         | Custom context-based (EN/FR)        |

---

## 🎨 Design System

- **Brand Colors:** Ornge navy blue (`#1c4599`) as primary, with semantic HSL tokens defined in `src/index.css`.
- **Typography:** Custom display font pairing via `font-display` utility.
- **Components:** shadcn/ui component library with Ornge-themed variants.
- **Dark/Light Mode:** Themed via CSS custom properties (`:root` / `.dark`).

---

## 📁 Project Structure

```
src/
├── assets/            # Images: logos, hero banners, device mockups, map
├── components/
│   ├── admin/         # Operations dashboard components
│   ├── transport/     # Family tracking components
│   └── ui/            # shadcn/ui base components
├── data/              # Mock transport data
├── hooks/             # Custom hooks (mobile detection, toast)
├── lib/               # i18n provider, utilities
├── pages/             # Route-level page components
│   ├── Welcome.tsx        # Landing page with portal selection
│   ├── FormatSelector.tsx # Device format picker
│   ├── Login.tsx          # Family transport login
│   ├── Dashboard.tsx      # Family tracking dashboard
│   ├── AdminLogin.tsx     # Operations login
│   └── AdminPortal.tsx    # Operations dashboard
└── App.tsx            # Router configuration
```

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

## 📝 Notes

- All data is **mock/demo data** — no backend or database is connected.
- The admin login uses pre-filled demo credentials (`admin@ornge.ca`).
- Family login accepts any Transport Reference ID for demo purposes.
- Device frame previews simulate realistic mobile/tablet chrome (status bar, notch, home indicator).

---

© Ornge Transport Medicine — Demo Application
