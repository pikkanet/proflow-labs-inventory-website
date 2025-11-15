# Inventory Management System – Frontend Website

Frontend website for the Inventory Management System, built with Next.js (App Router) and TypeScript. Implements secure user login, inventory listing with pagination & filtering, warehouse filtering, item creation, inventory movement logs.

>  **Backend Repository:** [proflow-labs-inventory-api](https://github.com/pikkanet/proflow-labs-inventory-api)  
> **Frontend Repository:** [proflow-labs-inventory-website](https://github.com/pikkanet/proflow-labs-inventory-website)  


> **Live Website:** [Link](https://proflow-labs-inventory-website.vercel.app/)
> **API URL** https://static-aurel-proflowlabs-assessment-d460a949.koyeb.app/api

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [UI/UX Improvements](#-uiux-improvements)
- [Assignment Requirements Checklist](#-assignment-requirements-checklist)
- [AI Usage](#-ai-usage)
- [Deployment](#-deployment)
- [Author](#-author)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** — recommended version from `.nvmrc` or Node.js site
- **NPM** (Node Package Manager)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/pikkanet/proflow-labs-inventory-website.git
cd proflow-labs-inventory-website
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` and make sure `NEXT_PUBLIC_API_URL` points to your local backend API:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

> **Note:** Make sure the backend API is running on your local machine at the port specified in `NEXT_PUBLIC_API_URL` (default: `3001`).

For production deployment, use:

```env
NEXT_PUBLIC_API_URL="https://static-aurel-proflowlabs-assessment-d460a949.koyeb.app/api"
```
> ⚠️ **Note:** The deployed API on Koyeb may have slow response times due to using the free plan (cold start and resource limits).

### Start Development Server

```bash
npm run dev
```

The website will run at: **http://localhost:3000**

> **Note:** Make sure the backend API is running and accessible at the URL specified in your `.env` file.

---

## 🎯 Overview

This frontend provides the complete inventory management interface used by warehouse admins to:

- Authenticate with username/password
- View and filter item masters
- Create and update inventory items
- Track inbound/outbound movements
- View dashboard metrics
- Expand inventory rows to view their activities and 7-day stock chart
- Interact with secure APIs protected by JWT

All state is fetched from the backend API and dynamically updated.

---

## ✨ Features

### 🔐 Login Authentication

- JWT stored securely
- Redirects unauthorized users
- Protected routes & API calls

### 📦 Inventory Page

- Paginated item list ordered by latest updated
- Create item dialog (UUID SKU, name, image, warehouse selection)
- Edit item dialog (name)
- Toggle visibility (disabled for now, backend not implemented)
- Multi-warehouse filter with search
- Item master search
- Reset filter button (enabled only when filters are applied)
- Refresh button to fetch latest data & update "Last Updated" timestamp

### 🏬 Warehouse Support

- Selectable warehouse filters
- Searchable by multiple selection warehouse from dropdown

### 📊 Dashboard Metrics

- Total Items
- Total Quantity
- Low Stock
- Out of Stock
- "Last Updated" timestamp synced with the latest API call

### 🔽 Expandable Movements Table

- Shows history of inbound/outbound activity
- Latest movement at the top
- "Add Movement" button
- Note field displayed (limit 50 chars)

### 📈 Movement Line Chart (7 days)

- Hover tooltip
- Shows stock and date time
- Based on movement logs

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white" alt="Next.js" /> Next.js (App Router) |
| Language | <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript" /> TypeScript |
| UI Framework | <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="TailwindCSS" /> TailwindCSS |
| Component Libraries | <img src="https://img.shields.io/badge/Ant_Design-0170FE?style=flat&logo=ant-design&logoColor=white" alt="Ant Design" /> Ant Design + Custom Components |
| Charts | <img src="https://img.shields.io/badge/Recharts-FF6384?style=flat&logo=recharts&logoColor=white" alt="Recharts" /> Recharts |
| HTTP Client | <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white" alt="Axios" /> Axios |
| Authentication | 🔐 JWT via backend |
| State Management | <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React" /> React Hooks |
| Deployment | <img src="https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white" alt="Vercel" /> Vercel |

---

## 🔧 Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` and set `NEXT_PUBLIC_API_URL` to point to your local backend API:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

> **Important:** Make sure `NEXT_PUBLIC_API_URL` points to the backend API running on your local machine. The default port is `3001`, but adjust it if your backend runs on a different port.

For production deployment:

```env
NEXT_PUBLIC_API_URL="https://static-aurel-proflowlabs-assessment-d460a949.koyeb.app/api"
```

---

## 📁 Project Structure

```
proflow-labs-inventory-website/
├── app/
│   ├── contexts/               # React contexts (Auth, Refresh)
│   ├── inventory/              # Inventory management pages
│   │   ├── components/         # Inventory-specific components
│   │   │   ├── dashboard/      # Dashboard cards and hooks
│   │   │   ├── itemMaster/     # Item display, charts, tables
│   │   │   ├── modals/         # Create, edit, add movement modals
│   │   │   ├── pagination/     # Pagination components and hooks
│   │   │   └── search/         # Search components and hooks
│   │   ├── constants/          # Item master constants
│   │   ├── enums/              # Activity type, search type, stock status
│   │   ├── hooks/              # Inventory hooks (useInventory)
│   │   ├── types/              # TypeScript types
│   │   ├── layout.tsx          # Inventory layout
│   │   └── page.tsx            # Inventory page
│   ├── layouts/                # App layout components
│   ├── login/                  # Login page
│   │   ├── hooks/              # Login hooks
│   │   ├── types/              # Login types
│   │   └── page.tsx
│   ├── shared/                 # Shared utilities and components
│   │   ├── components/         # Shared UI components
│   │   ├── services/           # API services (axios instance)
│   │   └── utils/              # Utility functions (auth helpers)
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Root page
│   ├── providers.tsx            # Context providers
│   └── globals.css             # Global styles
├── middleware.ts                # Next.js middleware
├── public/                     # Static assets
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🎨 UI/UX Improvements

These are improvements made beyond the Figma design, while keeping original functionality 100% complete ✨:

### 1. Redesigned Sidebar Navigation

Original sidebar used 2 icons (Dashboard & Store) with only one active.

**Improved to clear parent menus:**
- Dashboard
- Inventory Management
  - Warehouse
  - Inventory

Non-implemented menus are disabled to avoid confusion. Cleaner, more intuitive hierarchy for users.

### 2. Enhanced User Section in Sidebar

- Added user avatar + username
- Moved logout button to bottom
- Improves identity visibility and quick access

### 3. Dashboard Metrics Moved Above Filters

**Rationale:**
- Total Items / Total Quantity / Low Stock / Out of Stock should not change when filtering table results.
- In the original Figma, filters visually affected the metrics, causing confusion.
- Now metrics always represent overall system status, not filtered results.
- Added "Last updated: <timestamp>" based on latest API call.

### 4. Multi-Select Warehouse Filter with Search

- Users can select multiple warehouses at once
- Added searchable dropdown to avoid manual typing
- Greatly improves filtering experience

### 5. Reset Button (Enable/Disable)

- Disabled when no filters are applied
- Enabled only when filters/search are active
- Prevents unnecessary button usage

### 6. Improved Item Count Display

Figma's item count UI was ambiguous.

**Updated to show:**
```
 <currentItems> / <filteredTotal> items
```

Clear and accurate for users.

### 7. Create Inventory Dialog Enhancements

- Item name validated: max 100 chars
- Warehouse dropdown supports search
- UUID SKU generated automatically
- Better error and form validation UX

### 8. Refresh Button Behavior

- Calls all APIs on the page
- Updates dashboard metrics
- Updates item list
- Updates "Last updated" timestamp at top

### 9. Export Button Disabled

- Feature not implemented yet
- Kept visible but disabled for clarity

### 10. Table Header Filters Apply Only to Current Page

- Filters only the displayed items

### 11. Edit Item Name (Extra point)

- Click pencil icon → edit name directly
- Works smoothly with API `PATCH /items/:sku`

### 12. Show/Hide Eye Icon for Visibility (Disabled)

- UI implemented with eye/eye-off icons
- Maintains future compatibility
- Disabled for now, backend not implemented

### 13. Repositioned "Add Movement" Button

- Moved to top of expanded section
- Clearer and more visually consistent

### 14. Movement Table Shows Notes

- Notes were available in add movement but missing in UI
- Added note column
- Note limited to 50 characters

---

## ✅ Assignment Requirements Checklist

### ✔ Inventory Page

- [x] Paginated list
- [x] Ordered by latest updated
- [x] Create item dialog
- [x] 3+ warehouses (9 provided)
- [x] Random images
- [x] UUID SKU
- [x] Initial quantity = 0, stock = Out of Stock

### ✔ Dashboard

- [x] Total items
- [x] Total quantity
- [x] Low stock ≤ 10
- [x] Out of stock = 0 qty

### ✔ Inventory Movement

- [x] Expand row
- [x] Table (latest first)
- [x] Add inbound/outbound movement
- [x] Stock updates
- [x] 7-day line chart + tooltip

### ✔ Filters

- [x] Search item name
- [x] Multi-warehouse search filter
- [x] Reset filter

### ✔ Login

- [x] JWT authentication
- [x] Protected routes

### ✔ Optional Extras Implemented

- Edit item master name
- Visibility toggle UI
- Improved UI/UX everywhere
- User avatar + logout
- Last updated timestamp
- Searchable warehouse selection
- Better sidebar structure

---

## 🤖 AI Usage

This project used AI tools to support documentation and UI development:

- **Cursor** — Autocomplete, UI refactor suggestions
- **ChatGPT GPT-5.1 (2025)** — Used for README writing, code review suggestions, and clarifying assignment requirements

No AI-generated code was used without review and modification.

---

## 🌐 Deployment

- **Frontend Website:** https://proflow-labs-inventory-website.vercel.app/
- **Backend API:** https://static-aurel-proflowlabs-assessment-d460a949.koyeb.app/api

---

## 👤 Author

Developed for the Middle Full Stack Web Developer Assignment.
