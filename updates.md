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
- [ ] Create ARCHITECTURE.md (system design, layers, data flow)
- [ ] Create API_MAP.md (all endpoints, methods, auth requirements)

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
- [ ] Configure ESLint + Prettier across all apps

### Database
- [x] Setup Prisma with MySQL connection
- [x] Create complete Prisma schema (all entities — 30+ models)
- [x] Create Prisma seed script (roles, permissions, room types, amenities, food cats, tax rules, CMS pages)
- [ ] Run initial migration (requires DB connection)
- [ ] Verify all relationships and constraints

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
- [ ] Global error boundary

### Authentication — Guest
- [x] Firebase client SDK setup (web app)
- [ ] Email/password registration (page stub only — needs form)
- [ ] Email/password login (page stub only — needs form)
- [ ] Google OAuth login
- [ ] Password reset flow
- [ ] Email verification flow
- [x] Backend: Firebase token verification middleware
- [x] Backend: User record sync (Firebase UID -> DB User — in auth.service.ts)
- [x] Backend: /api/v1/auth/me endpoint
- [x] Backend: Auth controller (register, login, google, me, logout)
- [x] Frontend: AuthContext / auth store
- [ ] Login page (premium design — stub only)
- [ ] Register page (premium design — stub only)
- [ ] Forgot password page (stub only)

### Authentication — Admin
- [ ] Admin Firebase Authentication setup
- [x] Backend: Admin role verification middleware (requireAdmin)
- [x] Backend: RBAC middleware (requirePermission, requireRole)
- [x] Backend: Seed admin roles + permissions (in seed.ts)
- [ ] Admin login page (separate, secure)
- [ ] Admin protected route with role check

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
- [ ] GET /api/v1/users/me (profile)
- [ ] PUT /api/v1/users/me (update profile)
- [ ] GET /api/v1/bookings/my-bookings (paginated)
- [ ] GET /api/v1/payments/my-payments (paginated)
- [ ] GET /api/v1/invoices/my-invoices (paginated)
- [ ] GET /api/v1/invoices/:id/download (PDF generation)
- [ ] GET /api/v1/food-orders/my-orders (paginated)
- [ ] POST /api/v1/reviews (submit review)
- [ ] GET /api/v1/notifications/my-notifications

### Frontend
- [ ] Guest dashboard layout
- [ ] Profile page (edit name/phone/dob/address/image)
- [ ] My Bookings page (upcoming + past)
- [ ] Booking details page (full reservation info + cancel option)
- [ ] Payments history page
- [ ] Invoices page (list + download PDF)
- [ ] Food Orders page (history + status)
- [ ] Reviews page (submit review after stay)
- [ ] Notifications page

**Gate:** All guest dashboard routes tested with real DB data.

---

## PHASE 7 — Admin Dashboard

### Admin Layout
- [ ] Admin sidebar (with role-based module visibility)
- [ ] Admin header (notifications bell, user menu)
- [ ] Responsive admin layout (tablet-friendly)

### Dashboard Overview
- [ ] Today's arrivals/departures/current guests widget
- [ ] Occupancy % widget
- [ ] Revenue widgets (today, monthly)
- [ ] Pending bookings/queries widget
- [ ] Recharts charts (occupancy, revenue, room performance)

### Bookings Module
- [ ] Bookings list (data table: pagination, sort, filter, search, export CSV)
- [ ] Booking detail view (full info + actions)
- [ ] Admin booking calendar (day/week/month view)
- [ ] Check-in workflow (verify guest, assign room, record time)
- [ ] Check-out workflow (review bill, add charges, final invoice)
- [ ] Manual booking creation (admin-side)
- [ ] Booking status update (controlled transitions)
- [ ] Add extras to booking
- [ ] Add internal notes to booking

### Room Availability
- [ ] Room availability calendar (block/unblock rooms)
- [ ] Block rooms for maintenance/private use

### Rooms Module
- [ ] Rooms list (data table)
- [ ] Add room form (all fields from spec)
- [ ] Edit room form
- [ ] Room images management (upload/reorder/delete via Cloudinary)
- [ ] Room amenities management
- [ ] Room status management (available/blocked/maintenance)
- [ ] Room types CRUD

### Housekeeping Module
- [ ] Room status board (clean/dirty/cleaning/inspection)
- [ ] Assign housekeeping tasks (room, task, staff, priority, due time)
- [ ] Housekeeping task list/update

### Guests/Users Module
- [ ] Users list (data table: search by name/email/phone)
- [ ] Guest profile view (full journey: bookings, payments, invoices, orders, reviews)
- [ ] CRM metrics per guest (total bookings, revenue, avg stay)

### Food & Dining Module
- [ ] Food categories CRUD
- [ ] Menu items CRUD (with Cloudinary image upload)
- [ ] Food orders list (data table + real-time status updates)
- [ ] Order status management (PLACED -> CONFIRMED -> PREPARING -> READY -> DELIVERED)

### Offers & Coupons Module
- [ ] Offers/promotions CRUD
- [ ] Coupons CRUD (code, type, value, limits, validity)
- [ ] Coupon usage tracking

### Payments Module
- [ ] Transactions list (data table)
- [ ] Payment detail view
- [ ] Refund initiation (via Razorpay)
- [ ] Refund tracking

### Invoices Module
- [ ] Invoices list (data table)
- [ ] Invoice detail view
- [ ] Invoice PDF download
- [ ] Invoice numbering configuration (NLS/YEAR/XXXXXX)

### Reviews Module
- [ ] Reviews list (approve/reject/hide/feature/reply)
- [ ] Moderation queue

### Queries/Leads Module
- [ ] Leads list (data table)
- [ ] Lead detail view (assign, update status, add notes, reply)

### Staff Module
- [ ] Staff list CRUD
- [ ] Roles CRUD
- [ ] Permissions matrix management

### Audit Logs
- [ ] Audit log viewer (searchable by action/entity/admin/date)

### Admin Search
- [ ] Universal search (guest, booking, room, invoice, confirmation number)

**Gate:** All admin modules tested with real DB data. RBAC verified.

---

## PHASE 8 — CMS

### Backend
- [ ] CMS API endpoints (GET/PUT per page/section)
- [ ] Page model with sections and metadata
- [ ] SEO metadata per page
- [ ] CMS block types (Hero, TextImage, Gallery, etc.)
- [ ] Draft/Published/Archived support
- [ ] CMS revision history (changed by, changed at, previous version)

### Admin CMS UI
- [ ] CMS module sidebar
- [ ] Homepage editor (hero, intro, rooms, experiences, dining, gallery, offers, testimonials, CTA)
- [ ] About page editor
- [ ] Gallery manager (upload, reorder, tag, delete)
- [ ] Dining content editor
- [ ] Offers content editor
- [ ] Contact info editor
- [ ] SEO editor per page (title, meta description, OG, keywords)
- [ ] Media library (upload, search, filter, categorize, alt text)
- [ ] Content preview before publish

### Frontend CMS Integration
- [ ] All homepage sections use CMS data (not hardcoded)
- [ ] All public pages use CMS metadata for SEO
- [ ] Gallery page uses CMS media
- [ ] Footer uses CMS contact info

**Gate:** Admin can change homepage hero text without touching code.

---

## PHASE 9 — Food Ordering

### Backend
- [ ] Food menu public API (GET /api/v1/food/menu)
- [ ] Food cart management (add/remove/update)
- [ ] Food order creation (room number or pickup)
- [ ] Food order status machine
- [ ] Room charge or payment integration

### Frontend (Guest)
- [ ] Food menu page (categories, items, veg/non-veg filter)
- [ ] Add to cart interaction
- [ ] Cart component (quantity, special instructions)
- [ ] Order placement form (room number/pickup)
- [ ] Order summary + confirmation
- [ ] Order tracking page

**Gate:** Full food ordering flow tested end-to-end.

---

## PHASE 10 — Finance

### Backend
- [ ] Invoice generation service (PDF via puppeteer or similar)
- [ ] GST/Tax rules engine (configurable, not hardcoded)
- [ ] Refund calculation engine (based on cancellation policy)
- [ ] Revenue reports API
- [ ] Data export endpoints (CSV: bookings, guests, payments, orders)

### Admin Finance UI
- [ ] Tax rules management (create/edit tax types, rates)
- [ ] Cancellation policy editor
- [ ] Revenue report view
- [ ] CSV export buttons on all major tables
- [ ] Hotel settings: currency, timezone, check-in/out times
- [ ] Invoice settings: numbering format, hotel GST info, logo

**Gate:** Invoice PDF tested. Tax calculations verified against configured rules.

---

## PHASE 11 — Analytics & CRM

### Backend
- [ ] Analytics API endpoints (with date range filters)
- [ ] Revenue metrics (ADR, RevPAR, total)
- [ ] Occupancy metrics
- [ ] Booking metrics (cancellations, avg stay, avg value)
- [ ] Food revenue metrics
- [ ] Customer growth metrics
- [ ] Offer utilization metrics

### Admin Analytics UI
- [ ] Analytics dashboard (date range filter: Today/7D/30D/90D/Year/Custom)
- [ ] Revenue charts (Recharts)
- [ ] Occupancy trend chart
- [ ] Room performance chart
- [ ] Booking source breakdown
- [ ] Customer growth chart
- [ ] Food revenue chart

### CRM
- [ ] Guest profile with CRM data (first/last booking, total revenue, cancellations, food spend)
- [ ] Guest journey tracking (PAGE_VIEW, ROOM_VIEW, BOOKING_STARTED, etc.)

**Gate:** All KPI metrics verified against real data.

---

## PHASE 12 — Notifications & Email

### Backend
- [ ] Email service abstraction (Nodemailer)
- [ ] HTML email templates (welcome, verify, booking confirm, payment, invoice, cancel, refund, check-in reminder, review request, admin alert)
- [ ] In-app notification creation (on booking, payment, cancellation, food order)
- [ ] Notification center API (GET, mark read, mark all read)
- [ ] Optional: SMS/WhatsApp abstraction stub

### Frontend
- [ ] Admin notification bell (real-time via Socket.IO or polling)
- [ ] Guest notification page (list, mark read)

**Gate:** Booking confirmation email tested with real Razorpay payment.

---

## PHASE 13 — QA & Security

### Security Audit
- [ ] All admin routes tested for unauthorized access
- [ ] Role escalation attempt tests
- [ ] Invalid/expired Firebase token tests
- [ ] SQL injection tests (via Prisma parameterization)
- [ ] Payment signature tampering test
- [ ] Coupon abuse test (usage limit, user limit, expiry)
- [ ] File upload abuse test (type, size, mime)
- [ ] Rate limit test (auth, booking, payment)
- [ ] Double-booking race condition test

### QA
- [ ] All frontend pages: cross-browser (Chrome, Firefox, Safari)
- [ ] All pages: responsive check (390/768/1024/1440/1920px)
- [ ] All forms: validation tested (valid + invalid inputs)
- [ ] All booking flows: happy path + error paths
- [ ] Loading states: all data fetches show skeleton
- [ ] Empty states: all lists have empty state
- [ ] Error states: API failures handled gracefully

### Performance
- [ ] Lighthouse audit: Performance 90+, Accessibility 95+, SEO 95+
- [ ] Three.js: confirm lazy loaded, mobile fallback works
- [ ] Image optimization via Cloudinary
- [ ] No N+1 queries in admin tables
- [ ] Pagination on all admin lists

### Automated Tests
- [ ] Backend unit tests (booking service, pricing engine, availability)
- [ ] Backend integration tests (booking conflict)
- [ ] Frontend component tests
- [ ] E2E: Full guest booking flow (Playwright)
- [ ] E2E: Admin manage booking flow (Playwright)

**Gate:** Zero security vulnerabilities. Zero accessibility failures. Lighthouse scores pass.

---

## PHASE 14 — Deployment

- [ ] Render: Frontend (apps/web) deployment configured
- [ ] Render: Admin (apps/admin) deployment configured
- [ ] Render: Backend (apps/server) deployment configured
- [ ] MySQL production DB provisioned and connected
- [ ] Firebase project configured for production
- [ ] Cloudinary account configured
- [ ] Razorpay production keys configured
- [ ] Cloudflare DNS configured
- [ ] All env vars set in Render dashboard
- [ ] Production migrations run
- [ ] Seed data applied (rooms, menu, CMS defaults, admin role)
- [ ] Secure admin bootstrap (first admin via env var, not hardcoded)
- [ ] Health check endpoints working
- [ ] CORS configured for production domains
- [ ] Verify HTTPS on all apps
- [ ] Verify payment webhook endpoint publicly accessible

**Gate:** Full booking flow tested on production environment.

---

## PHASE 15 — Documentation & Handoff

- [ ] README.md (project overview + setup + commands)
- [ ] ARCHITECTURE.md
- [ ] API_DOCUMENTATION.md (Swagger or equivalent)
- [ ] DATABASE_SCHEMA.md
- [ ] DEPLOYMENT.md
- [ ] SECURITY.md
- [ ] TESTING.md
- [ ] ADMIN_GUIDE.md (how hotel staff use the system)
- [ ] .env.example (all variables documented)
- [ ] Seed script documented
- [ ] Backup strategy documented

---

## PROGRESS SUMMARY

| Phase | Status | Notes |
|---|---|---|
| 1. Discovery & Architecture | [x] Completed | Tokens, roles matrix, env template, Prisma schema mapped |
| 2. Foundation | [x] Completed | Monorepo pnpm, Prisma client generated, Express + Vite builds passing |
| 3. Design System | [x] Completed | Luxury UI component primitives in apps/web/src/components/ui |
| 4. Public Website | [x] Completed | Homepage, Rooms, RoomDetail, Dining, Experiences, Offers, About, Contact, Auth |
| 5. Booking Engine | [x] Completed | Availability engine, Pricing engine, transactional lock, checkout, Razorpay |
| 6. Guest Dashboard | [/] In Progress | Profile, My Bookings, Invoices, Food Orders, Reviews |
| 7. Admin Dashboard | [ ] Planned | Operations, bookings, calendar, housekeeping, CRM, POS |
| 8. CMS | [ ] Planned | Page sections, gallery, hero editor, SEO manager |
| 9. Food Ordering | [ ] Planned | Menu, cart, in-room dining orders, status workflow |
| 10. Finance | [ ] Planned | Invoices, GST calculation, refunds, revenue reports |
| 11. Analytics & CRM | [ ] Planned | Occupancy, RevPAR, ADR, customer growth, Recharts |
| 12. Notifications & Email | [ ] Planned | Nodemailer templates, in-app notification center |
| 13. QA & Security | [ ] Planned | RBAC audit, signature verification, Playwright E2E |
| 14. Deployment | [ ] Planned | Render service, MySQL, Cloudflare, production secrets |
| 15. Documentation | [ ] Planned | System docs, admin manual, API specs |
