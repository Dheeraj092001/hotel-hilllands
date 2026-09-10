# HOTEL NEWLANDS SHIMLA — MASTER IMPLEMENTATION CHECKLIST

> Mark tasks as `[x]` when complete. Mark as `[/]` when in progress.
> Update this file after every session.
> Last Updated: 2026-09-10

---

## PHASE 1 — Discovery & Architecture

- [x] Inspect existing repository structure
- [x] Create DATABASE_SCHEMA.md (all entities, relationships, indexes) — in Prisma schema
- [x] Define design tokens (colors, typography, spacing, shadows) — in index.css + tailwind.config.js
- [x] Define user roles & permissions matrix — in packages/shared/src/index.ts
- [x] Create .env.example with all required variables
- [x] Define monorepo package.json root workspace config
- [x] Create ARCHITECTURE.md (system design, layers, data flow)
- [x] Create API_MAP.md (all endpoints, methods, auth requirements)

**Gate:** All documentation complete before Phase 2.

---

## PHASE 2 — Foundation (Monorepo + Infra + Auth)

### Monorepo Setup
- [x] Initialize monorepo with pnpm workspaces
- [x] Setup apps/web (React + Vite + TypeScript + TailwindCSS)
- [x] Setup apps/admin (React + Vite + TypeScript + TailwindCSS)
- [x] Setup apps/server (Node + Express + TypeScript)
- [x] Setup packages/types (shared TypeScript interfaces — all 15+ entities)
- [x] Setup packages/validation (shared Zod schemas — 10+ schemas)
- [x] Setup packages/shared (shared constants/utilities — BRAND, COLORS, PERMISSIONS, ROLE_PERMISSIONS)
- [x] Configure TypeScript strict mode across all apps
- [x] Configure ESLint + Prettier across all apps

### Database
- [x] Setup Prisma with MySQL connection
- [x] Create complete Prisma schema (all entities — 30+ models)
- [x] Create Prisma seed script (roles, permissions, room types, amenities, food cats, tax rules, CMS pages)
- [x] Run initial migration (requires DB connection)
- [x] Verify all relationships and constraints

### Backend Foundation
- [x] Express app with TypeScript
- [x] Helmet security headers
- [x] CORS configuration
- [x] Request logging middleware (Morgan + Winston)
- [x] Error handling middleware (global + 404)
- [x] Rate limiting middleware (auth, booking, payment, general limiters)
- [x] Centralized response formatter (success/error/paginated)
- [x] Environment config module (env.ts with all vars)
- [x] Firebase Admin SDK initialization
- [x] Cloudinary config
- [x] Razorpay config
- [x] Logger (Winston)
- [x] Custom error classes (AppError, UnauthorizedError, ForbiddenError, NotFoundError, BookingConflictError, PaymentError)
- [x] All module stub routes (16 modules scaffolded)

### Frontend Foundation
- [x] Centralized Axios API client (src/lib/api.ts with Firebase token injection)
- [x] TanStack Query provider setup
- [x] Zustand store initialization (authStore, bookingStore)
- [x] React Router setup (public + dashboard + 404 routes)
- [x] Toast (Sonner) setup
- [x] Firebase client SDK initialized
- [x] AuthProvider component (waits for Firebase init)
- [x] ProtectedRoute component
- [x] PageLoader component (premium animation)
- [x] PublicLayout (header + footer + outlet)
- [x] DashboardLayout (sidebar + header + outlet)
- [x] Header component (transparent-to-solid, mobile menu)
- [x] Footer component (4-column, links, social)
- [x] All page stubs (17 public + 6 dashboard pages scaffolded)
- [x] Global error boundary

### Authentication — Guest
- [x] Firebase client SDK setup (web app)
- [x] Email/password registration (RegisterPage)
- [x] Email/password login (LoginPage)
- [x] Google OAuth login
- [x] Password reset flow (ForgotPasswordPage)
- [x] Email verification flow
- [x] Backend: Firebase token verification middleware
- [x] Backend: User record sync (Firebase UID -> DB User — in auth.service.ts)
- [x] Backend: /api/v1/auth/me endpoint
- [x] Backend: Auth controller (register, login, google, me, logout)
- [x] Frontend: AuthContext / auth store
- [x] Login page (premium design)
- [x] Register page (premium design)
- [x] Forgot password page

### Authentication — Admin
- [x] Admin Firebase Authentication setup
- [x] Backend: Admin role verification middleware (requireAdmin)
- [x] Backend: RBAC middleware (requirePermission, requireRole)
- [x] Backend: Seed admin roles + permissions (in seed.ts)
- [x] Admin login page (LoginPage with role check)
- [x] Admin protected route with role check

**Gate:** pnpm lint + typecheck + build pass before Phase 3.

---

## PHASE 3 — Design System

- [x] TailwindCSS config with brand colors + fonts
- [x] Google Fonts import (Cormorant Garamond + Inter + Manrope)
- [x] CSS variables for design tokens
- [x] Button component (all variants + states)
- [x] Input component (text, select, date, textarea)
- [x] Badge/Tag component
- [x] Card component
- [x] Dialog/Modal component
- [x] Alert/Toast integration (Sonner)
- [x] Skeleton loader component
- [x] Empty state component
- [x] Loading spinner / overlay (PageLoader)
- [x] Navigation components (header, sidebar, mobile menu)
- [x] Section layout primitives (Container, SectionHeading)
- [x] Typography components (Heading, Body, Caption)
- [x] Data table base component primitives
- [x] Form field wrapper (label + input + error)
- [x] Image component (with lazy loading + fallback)
- [x] Framer Motion animation primitives
- [x] Page transition wrapper

**Gate:** Design system reviewed visually before Phase 4.

---

## PHASE 4 — Public Website

### Global Layout
- [x] Header / Navigation (transparent-to-solid scroll behavior)
- [x] Mobile navigation menu (animated, polished)
- [x] Footer (CMS-ready content, contact details, legal links)

### Homepage
- [x] Hero section (cinematic, full-screen, CTA, ambient overlay)
- [x] Mountain scene aesthetic with mobile fallback
- [x] Booking widget (check-in/out/adults/children/rooms/promo, Zustand sync)
- [x] Hotel introduction section (The Story of Newlands, 1928 heritage)
- [x] Featured rooms section (Governor's Suite, Cedar Ridge, Pine Mist)
- [x] Mountain experiences section (Ridge High Tea, Shinrin-Yoku, Stargazing)
- [x] Dining section ("The Cedar Hearth" preview & highlights)
- [x] Guest reviews section (verified reviews, ratings, cards)
- [x] Location section (Shimla landmarks, transit times, map embed)
- [x] Final booking CTA section (concierge contact & direct booking)

### Rooms
- [x] Rooms listing page (with filtering by category/view/price, sorting, specs)
- [x] Room detail page (multi-photo gallery, amenities, specs, policies, live calculator)
- [x] Room gallery (clickable photo switcher, responsive)

### Other Pages
- [x] Dining page ("The Cedar Hearth" story, timings, categorized menu with dietary tags)
- [x] Experiences page (curated mountain pursuits, itineraries, guides)
- [x] Offers page (Honeymoon, Winter Snowfall, Workation, Early Bird packages)
- [x] About page (1928 history, values, restoration story, timeline)
- [x] Contact page (Zod validated form, leads API integration, estate contacts)
- [x] Login page (Firebase email/password + Google OAuth)
- [x] Register page (Firebase account creation + DB user sync)
- [x] Forgot password page (password reset email flow)

**Gate:** All pages responsive at 390/768/1024/1440px. No console errors.

---

## PHASE 5 — Booking Engine

### Backend
- [x] AvailabilityService (considers bookings, blocks, maintenance)
- [x] GET /api/v1/bookings/availability (search by dates + guests)
- [x] PricingEngine (room + dates + season + discount + coupon + tax)
- [x] POST /api/v1/bookings (transactional, anti-double-booking)
- [x] GET /api/v1/bookings/:id
- [x] POST /api/v1/bookings/:id/cancel (with refund calc)
- [x] Coupon validation & discount application
- [x] Booking confirmation number generation (NLS-XXXXXX)

### Frontend
- [x] Date picker (availability-aware in BookingWidget)
- [x] Room search results page (RoomsPage with capacity & date filters)
- [x] Room selection with price preview (RoomDetailPage)
- [x] Extras selection step (Bonfire, Transfer, High Tea)
- [x] Guest details form (BookingCheckoutPage)
- [x] Price summary component (ledger with tax & discount calculation)
- [x] Coupon/promo code input + validation UI
- [x] Payment step (Razorpay checkout integration)
- [x] Booking confirmation page (NLS-XXXXXX code, details, directions)

### Payments
- [x] Backend: Razorpay order creation
- [x] Backend: Payment signature verification (HMAC SHA256)
- [x] Backend: Payment record storage
- [x] Frontend: Razorpay checkout integration
- [x] Frontend: Payment success/failure handling

**Gate:** Full booking flow tested end-to-end. Double-booking test passes.

---

## PHASE 6 — Guest Dashboard

### Backend
- [x] GET /api/v1/users/me (profile with stay & review statistics)
- [x] PUT /api/v1/users/me (update profile & preferences)
- [x] GET /api/v1/bookings/my-bookings (paginated reservation ledger)
- [x] GET /api/v1/payments/my-payments (Razorpay transaction history)
- [x] GET /api/v1/invoices/my-invoices (paginated GST tax invoices)
- [x] GET /api/v1/invoices/:id (tax receipt detail with items & room info)
- [x] POST /api/v1/reviews (submit 5-star category ratings & testimonials)
- [x] GET /api/v1/reviews/my-reviews (view past submitted reviews)
- [x] GET /api/v1/notifications/my-notifications (with unread badge counter)
- [x] PATCH /api/v1/notifications/:id/read & /mark-all-read

### Frontend
- [x] Guest dashboard layout (responsive sidebar drawer, navigation, header bar)
- [x] Profile page (name, phone, address, preferences for pillows and diet)
- [x] My Bookings page (tabs: All, Upcoming, Completed, Cancelled + status badges)
- [x] Booking details page (stay timings, room specs, billing summary, cancel modal)
- [x] Invoices page (list with status and printable official tax invoice view)
- [x] Reviews page (star rating form for Cleanliness, Service, Location, Food, Value)
- [x] Notifications page (feed with status badges and mark all read)

**Gate:** All guest dashboard routes tested with clean TypeScript and Vite builds.

---

## PHASE 7 — Admin Dashboard

### Admin Layout
- [x] Admin sidebar (with brand emblem and module navigation)
- [x] Admin header (live station clock, external guest site link)
- [x] Responsive admin layout (drawer with mobile overlay)

### Dashboard Overview
- [x] Today's arrivals/departures/current guests widget
- [x] Occupancy % widget
- [x] Revenue widgets (today, monthly)
- [x] Recharts charts (7-day revenue trend area chart & daily occupancy ratio bar chart)
- [x] Recent reservations quick ledger

### Bookings Module
- [x] Bookings list (data table: search, status filter, formatted stay dates)
- [x] Booking detail view (modal drawer with full reservation details)
- [x] Check-in workflow (one-click check-in mutation)
- [x] Check-out workflow (one-click check-out mutation)
- [x] Booking status update (controlled transitions)

### Room Availability & Rooms Module
- [x] Room availability calendar (7-day timeline matrix across all suites)
- [x] Block rooms for maintenance (maintenance hold modal with dates and reasons)
- [x] Rooms list (data table with base tariff, floor, and housekeeping status)
- [x] Room status toggle (AVAILABLE, MAINTENANCE, BLOCKED)

### Housekeeping Module
- [x] Room status board (CLEAN, DIRTY, CLEANING, INSPECTION status matrix)
- [x] Assign housekeeping tasks (select suite, attendant, priority, task details)
- [x] Housekeeping task list with one-click completion

### Guests/Users CRM Module
- [x] Users list (data table: search by name/email/phone, total stays, registered date)
- [x] Guest profile view (modal drawer with complete reservation history)

### Offers & Coupons Module
- [x] Coupons list (code, percentage or fixed discount, validity, usage count)
- [x] Create promo code modal (date range, discount value, limits)
- [x] Delete promo code action

### Reviews Module
- [x] Reviews list with star ratings and comments
- [x] Moderation queue (one-click Approve, Reject)
- [x] Official host response publisher modal

**Gate:** All admin modules tested with clean TypeScript and Vite builds. RBAC verified.

---

## PHASE 8 — CMS

### Backend
- [x] CMS API endpoints (GET /pages/:slug, PUT /pages/:slug/sections/:key)
- [x] Page model with sections and metadata
- [x] SEO metadata per page (title, meta description, OG tags)
- [x] CMS block types (HeroBlock, TextImageBlock, etc.)
- [x] Draft/Published/Archived support
- [x] CMS revision tracking

### Admin CMS UI
- [x] CMS module in admin sidebar
- [x] Page editor (Home, About, Dining, Experiences, Offers)
- [x] Hero headline & sub-tagline live editor
- [x] SEO editor (browser title tag, meta description)
- [x] Live publish button with toast feedback

**Gate:** Admin can change homepage hero text without touching code.

---

## PHASE 9 — Food Ordering

### Backend
- [x] Food menu public API (GET /api/v1/food/menu)
- [x] Food cart management & order creation (POST /api/v1/food/orders)
- [x] Food order status machine (PLACED -> CONFIRMED -> PREPARING -> READY -> DELIVERED)
- [x] Room charge and delivery type (ROOM, PICKUP)
- [x] Kitchen POS management API (GET /admin/orders, PATCH /admin/orders/:id/status)

### Frontend (Guest & Admin)
- [x] In-room dining drawer component (InRoomDiningDrawer)
- [x] Integrated order trigger on Dining page
- [x] Real-time Kitchen POS board in admin ERP (DiningPosPage)
- [x] Single-click status transitions for chefs and pantry staff

**Gate:** Full food ordering flow tested end-to-end.

---

## PHASE 10 — Finance & Invoicing

### Backend
- [x] GST tax rules engine (18% Room Lodging GST, 5% Dining GST)
- [x] Automated sequential invoice generation (NLS/YYYY/NNNNNN)
- [x] Financial summary API (/api/v1/analytics/financial-summary)
- [x] Enterprise CSV data export endpoints (bookings, guests, payments, food orders)
- [x] Admin all invoices ledger endpoint (/api/v1/invoices/admin/all)

### Admin Finance UI
- [x] FinancePage with total gross revenue, net room tariff, F&B revenue, and GST collected
- [x] Statutory tax classification rules table
- [x] Sequential invoices data table
- [x] One-click CSV download buttons for all tables

**Gate:** Tax calculations verified against configured rules.

---

## PHASE 11 — Analytics & CRM

### Backend
- [x] Advanced analytics API with date range filters (7D, 30D, 90D, YEAR)
- [x] Average Daily Rate (ADR) calculation
- [x] Revenue per Available Room (RevPAR) calculation
- [x] Average Occupancy % calculation
- [x] Cancellation rate % tracking

### Admin Analytics UI
- [x] AnalyticsPage with date range switcher
- [x] Recharts AreaChart (daily revenue trajectory)
- [x] Recharts BarChart (daily occupancy ratio)
- [x] Executive performance KPI metrics

**Gate:** All KPI metrics verified against real data.

---

## PHASE 12 — Notifications & Email

### Backend
- [x] Email service abstraction with Nodemailer (email.service.ts)
- [x] Luxury HTML email templates (Booking confirmation, cancellation refund)
- [x] In-app notification creation on reservation confirm & cancel
- [x] In-app notification feed endpoints (read, mark-all-read)

### Frontend
- [x] Notifications page in guest dashboard
- [x] Admin station clock and alert indicators

**Gate:** Booking confirmation email tested with reservation workflow.

---

## PHASE 13 — QA & Security

### Security Audit
- [x] All admin routes protected by requireAdmin and RBAC middleware
- [x] HMAC SHA256 payment signature verification verified
- [x] Rate limiters active on auth and booking endpoints
- [x] Helmet security headers and CORS strict policy

### Automated Unit Tests
- [x] Vitest test suite configured in apps/server
- [x] Pricing engine test suite (4 tests passing)
- [x] Room availability conflict detection test suite (6 tests passing)
- [x] Payment signature verification test suite (3 tests passing)
- [x] 100% test pass rate (13/13 passing)

**Gate:** Zero security vulnerabilities. Zero test failures.

---

## PHASE 14 — Deployment

- [x] Render Blueprint IaC configuration (render.yaml)
- [x] Backend API service definition (Node web service)
- [x] Public guest portal static site definition
- [x] Admin ERP static site definition
- [x] Production environment variables documented in DEPLOYMENT.md
- [x] Edge CDN caching headers configured

---

## PHASE 15 — Documentation & Handoff

- [x] ARCHITECTURE.md (complete system design, engines, data flows)
- [x] API_MAP.md (all 30+ endpoints cataloged)
- [x] ADMIN_GUIDE.md (front desk and operations handbook)
- [x] DEPLOYMENT.md (production rollout and seed guide)
- [x] MASTER IMPLEMENTATION CHECKLIST (updates.md) 100% complete

---

## PROGRESS SUMMARY

| Phase | Status | Notes |
|---|---|---|
| 1. Discovery & Architecture | [x] Completed | Tokens, roles matrix, env template, Prisma schema mapped |
| 2. Foundation | [x] Completed | Monorepo pnpm, Prisma client generated, Express + Vite builds passing |
| 3. Design System | [x] Completed | Luxury UI component primitives in apps/web/src/components/ui |
| 4. Public Website | [x] Completed | Homepage, Rooms, RoomDetail, Dining, Experiences, Offers, About, Contact, Auth |
| 5. Booking Engine | [x] Completed | Availability engine, Pricing engine, transactional lock, checkout, Razorpay |
| 6. Guest Dashboard | [x] Completed | Profile, My Bookings, Invoices, Food Orders, Reviews, Notifications |
| 7. Admin Dashboard ERP | [x] Completed | Operations, bookings, calendar, housekeeping, CRM, coupons, reviews |
| 8. CMS | [x] Completed | Page sections, SEO metadata, live headline & description editor |
| 9. Food Ordering | [x] Completed | In-room dining menu, cart drawer, live kitchen POS order status board |
| 10. Finance & Invoicing | [x] Completed | GST tax ledger (18% and 5%), sequential invoices, CSV data exports |
| 11. Analytics & CRM | [x] Completed | ADR, RevPAR, Occupancy %, Recharts Area & Bar visualizations |
| 12. Notifications & Email | [x] Completed | Nodemailer HTML templates, transactional in-app notifications |
| 13. QA & Automated Tests | [x] Completed | Vitest suites for availability, pricing, and HMAC signatures (13/13 passing) |
| 14. Deployment | [x] Completed | Render Blueprint (render.yaml), environment guide, edge CDN headers |
| 15. Documentation | [x] Completed | ARCHITECTURE.md, API_MAP.md, ADMIN_GUIDE.md, DEPLOYMENT.md |
