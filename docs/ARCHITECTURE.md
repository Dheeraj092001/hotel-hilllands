# HOTEL NEWLANDS SHIMLA — SYSTEM ARCHITECTURE

## 1. Executive Summary
Hotel Newlands Shimla is an enterprise-grade hospitality technology platform engineered for high concurrency, zero double-booking tolerance, and fine-grained role-based administrative control. It unites a public guest booking portal, an executive staff ERP, and a headless Node.js/TypeScript backend within an optimized pnpm monorepo.

---

## 2. High-Level Architecture Diagram

```
[ Public Guest Client ]           [ Hotel Admin ERP ]
   (apps/web: Vite+React)          (apps/admin: Vite+React)
             |                                |
             +---------------+----------------+
                             |
                             v
              [ Cloudflare CDN & Edge WAF ]
                             |
                             v
                 [ Reverse Proxy / Load Balancer ]
                             |
                             v
         [ Express.js REST API Server (apps/server) ]
          ├── Helmet, CORS, Winston & Morgan Logging
          ├── Rate Limiters (Auth, Booking, Payments)
          ├── Firebase Admin Auth Token Verification
          └── RBAC Middleware (requireRole / requirePermission)
                             |
             +---------------+---------------+
             |                               |
             v                               v
    [ Prisma ORM Client ]         [ External Service Integrations ]
             |                     ├── Razorpay (Payments & Webhooks)
             v                     ├── Firebase Auth (Identity Provider)
   [ MySQL Relational Database ]   ├── Cloudinary (Estate Media CDN)
    ├── 30+ Normalized Tables      └── Nodemailer (Transactional Emails)
    ├── ACID Transactions
    └── Isolation-Locked Engines
```

---

## 3. Monorepo Structure

```
hotel-hilllands/
├── apps/
│   ├── web/          # Public luxury guest portal & booking checkout
│   ├── admin/        # Executive ERP, Operations, Calendar & Housekeeping
│   └── server/       # Express.js REST API server with Prisma ORM
├── packages/
│   ├── shared/       # Brand tokens, colors, RBAC permissions matrix
│   ├── types/        # Unified TypeScript interfaces across all 30 entities
│   └── validation/   # Zod validation schemas for requests and forms
├── prisma/
│   ├── schema.prisma # Master database schema (30+ models)
│   └── seed.ts       # Idempotent database seeder
├── docs/             # Technical and operational manuals
└── render.yaml       # Infrastructure as Code deployment blueprint
```

---

## 4. Key Architectural Engines

### 4.1 Anti-Double-Booking Transactional Engine
- Located in `apps/server/src/modules/bookings/bookings.service.ts`.
- Operates inside an explicit `prisma.$transaction(async (tx) => ...)` with serializable integrity.
- **Pre-execution conflict verification**: Queries for existing overlapping stays where `checkIn < requestedCheckOut` and `checkOut > requestedCheckIn` for non-cancelled statuses.
- **Maintenance Block Check**: Inspects `RoomBlock` table to prevent booking suites undergoing repair or deep cleaning.
- Atomically creates reservation, links extras, records coupon redemption, generates an unguessable sequential confirmation number (`NLS-XXXXXX`), and generates an initial invoice record.

### 4.2 Server-Side Pricing Engine
- Located in `apps/server/src/modules/bookings/pricing.service.ts`.
- Never trusts client-side prices. Calculates day-by-day rates:
  - Weekday vs Weekend (Friday/Saturday) room rate differentiation.
  - Extra adult charges when exceeding base capacity of 2 guests.
  - Optional extras (e.g. airport transfer, mountain bonfire, private afternoon tea).
  - Coupon discount (Percentage or Fixed amount) with maximum cap enforcement.
  - Standard statutory Indian hospitality GST calculation (18% on lodging).

### 4.3 Payment & Razorpay Verification Flow
- Generates server-side Razorpay order in paise (`amount * 100`).
- Validates webhook and checkout return with HMAC SHA256 signature verification (`crypto.createHmac("sha256", secret)`).
- On valid signature: marks payment `CAPTURED`, confirms booking, queues transactional confirmation email, and issues official tax invoice.

---

## 5. Security & RBAC Matrix
1. **Network Layer**: Helmet security headers, restrictive CORS policy, rate limiting on `/auth` (10 req/15min) and `/bookings` (20 req/15min).
2. **Authentication**: Firebase Auth tokens validated on server via Firebase Admin SDK.
3. **Authorization**: RBAC permissions matrix enforcing:
   - `SUPER_ADMIN`: Unrestricted root access.
   - `HOTEL_MANAGER`: Inventory, pricing, guest CRM, finance reports.
   - `FRONT_DESK`: Check-in, check-out, bookings ledger, walk-ins.
   - `HOUSEKEEPING`: Room cleaning board, maintenance tagging.
   - `FNB_MANAGER`: Dining menu, kitchen order ticket (KOT) workflow.
   - `GUEST`: Personal reservations, profile, invoices, reviews.
