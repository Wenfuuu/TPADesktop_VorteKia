# VorteKia

VorteKia is a desktop management system for a theme park, built with React and Tauri.
One app serves both park staff and customer kiosks, and each device picks its UI from its configured device ID.

## Features

- **Role-based staff workspaces** for customer service, lost and found, restaurants, stores, rides, maintenance and executives (CEO, CFO, COO).
- **Customer kiosks** for browsing restaurants, rides and stores, ordering menus, buying souvenirs, joining ride queues, topping up balance and leaving reviews.
- **Proposals and approvals** for opening or removing rides, restaurants and stores, reviewed by the executive roles.
- **Maintenance flow** where ride staff submit maintenance requests, managers schedule tasks, and staff submit maintenance logs.
- **Lost and found log** to report, track and update missing items.
- **Income and history views** per ride, restaurant and store, built from transactions.
- **Realtime chat and broadcasts** between staff groups and customers through Firebase Firestore.

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, React Router, Tailwind CSS, shadcn/ui (Radix) |
| Desktop shell | Tauri 2 |
| Backend | Rust, Diesel ORM, Tokio, Argon2 password hashing |
| Data | PostgreSQL, Redis (ride list cache), Firebase Firestore (chat) |

## Architecture

The React frontend calls Rust functions through Tauri commands (`invoke`), so there is no separate HTTP server.
The Rust side is split into `models` (Diesel structs), `handler` (one module per domain, such as rides, stores or proposals) and `db` (connection setup built with a builder pattern from `.env`).
Database schema changes live in `src-tauri/migrations` and are applied with the Diesel CLI.

```
TPA/tpa/
├── src/                  React frontend
│   ├── ui/               One layout per role or kiosk type
│   ├── components/       Feature components grouped by domain
│   ├── pages/            Staff and customer login
│   └── models/           TypeScript types mirroring the Rust models
└── src-tauri/
    ├── src/handler/      Tauri commands per domain
    ├── src/models/       Diesel models
    └── migrations/       PostgreSQL migrations
```

## Device Modes

Each install reads `device_id` from `src-tauri/config.json`, and its prefix decides which UI opens.

| Prefix | Opens |
| --- | --- |
| `STAFF` | Staff login, then the workspace for that staff member's role |
| `CUSTOMER` | General customer kiosk |
| `RIDE` | Ride kiosk |
| `RES` | Restaurant kiosk |
| `STR` | Store kiosk |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [Rust](https://www.rust-lang.org/tools/install) and the [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your OS
- PostgreSQL and Redis
- Diesel CLI with Postgres support: `cargo install diesel_cli --no-default-features --features postgres`
- A Firebase project with Firestore enabled

### Setup

1. Clone the repo and install frontend dependencies.

   ```bash
   git clone https://github.com/Wenfuuu/TPADesktop_VorteKia.git
   cd TPADesktop_VorteKia/TPA/tpa
   npm install
   ```

2. Copy the example env file, then fill in your own PostgreSQL and Redis connection strings.

   ```bash
   cp .env.example .env
   ```

3. Run the migrations from `src-tauri`.

   ```bash
   cd src-tauri
   diesel setup
   diesel migration run
   cd ..
   ```

4. Put your Firebase web config in `TPA/tpa/firebaseConfig.ts`.

5. Set the device mode in `TPA/tpa/src-tauri/config.json`.

   ```json
   { "device_id": "STAFF-01" }
   ```

6. Start the app.

   ```bash
   npm run tauri dev
   ```

## Course Context

This app was built for the Desktop Technical Path Assessment (TPA) at Software Laboratory Center, BINUS University.
The `Diagram/` folder holds the use case and activity diagrams (Visual Paradigm), and `BT_Use_Case_Description.xlsx` holds the use case descriptions.
