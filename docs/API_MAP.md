# HOTEL NEWLANDS SHIMLA — MASTER API SPECIFICATION

Base URL: `/api/v1`

---

## 1. Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new guest account and sync with Prisma DB |
| POST | `/login` | Public | Verify Firebase ID token and return authenticated session |
| POST | `/google` | Public | Google OAuth token verification and account sync |
| GET | `/me` | Authenticated | Retrieve current user profile and role details |
| POST | `/logout` | Authenticated | Terminate session |

---

## 2. Rooms & Inventory (`/api/v1/rooms`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List published suites and rooms with pricing & amenities |
| GET | `/:id` | Public | Detailed view of a suite with high-res photos and policies |
| GET | `/admin/all` | Admin | Staff inventory table with occupancy and housekeeping status |
| POST | `/admin` | Admin | Create a new room / suite entry |
| PATCH | `/admin/:id/status`| Admin | Toggle room state (`AVAILABLE`, `MAINTENANCE`, `BLOCKED`) |
| POST | `/admin/blocks` | Admin | Place maintenance hold with dates and reason |
| DELETE | `/admin/blocks/:id`| Admin | Release maintenance block |

---

## 3. Bookings & Availability (`/api/v1/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/availability` | Public | Date-range room availability search engine |
| POST | `/price-preview` | Public | Server-side tariff quote with taxes, extras & coupons |
| POST | `/` | Authenticated | Transactional booking creation with anti-double-booking lock |
| GET | `/my-bookings` | Authenticated | Guest reservation ledger (Upcoming, Completed, Cancelled) |
| GET | `/:id` | Authenticated | Booking detail with stay timeline & invoice |
| POST | `/:id/cancel` | Authenticated | Automated 48-hour refund calculation and cancellation |
| GET | `/admin/all` | Admin | Master reservations ledger with pagination and filters |
| PATCH | `/admin/:id/checkin`| Admin | Check in guest upon arrival |
| PATCH | `/admin/:id/checkout`| Admin | Check out guest upon departure |

---

## 4. Payments (`/api/v1/payments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/create-order` | Authenticated | Create Razorpay order in paise |
| POST | `/verify` | Authenticated | HMAC SHA256 signature verification & booking confirmation |
| GET | `/my-payments` | Authenticated | Transaction history for current guest |

---

## 5. Invoices & Taxes (`/api/v1/invoices`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/my-invoices` | Authenticated | Paginated guest GST tax invoices |
| GET | `/:id` | Authenticated | Tax invoice detail with itemized breakdown |
| GET | `/admin/all` | Admin | Full financial invoice ledger |

---

## 6. Food & In-Room Dining (`/api/v1/food`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/menu` | Public | Categorized à la carte menu with dietary flags |
| POST | `/orders` | Authenticated | Place in-room dining order with room number & notes |
| GET | `/orders/my-orders`| Authenticated | Guest active food orders and tracking |
| GET | `/admin/orders` | Admin / Chef | Live Kitchen Order Ticket (KOT) board |
| PATCH | `/admin/orders/:id/status` | Admin / Chef | Update status: `PLACED` -> `CONFIRMED` -> `PREPARING` -> `READY` -> `DELIVERED` |

---

## 7. Website Content Management (`/api/v1/cms`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/pages/:slug` | Public | Fetch published page sections and SEO tags |
| GET | `/admin/pages` | Admin | List all editable pages |
| PUT | `/pages/:slug/sections/:key` | Admin | Update hero narrative or content block |
| PUT | `/pages/:slug/seo` | Admin | Update browser title, meta description & OG tags |

---

## 8. Housekeeping (`/api/v1/housekeeping`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/rooms` | Admin | Real-time cleaning status matrix (`CLEAN`, `DIRTY`, `CLEANING`, `INSPECTED`) |
| PATCH | `/rooms/:id/status`| Admin | Transition room cleaning status |
| GET | `/tasks` | Admin | List pending housekeeping assignments |
| POST | `/tasks` | Admin | Assign suite cleaning task to attendant |
| PATCH | `/tasks/:id/complete`| Admin | Complete assigned cleaning task |

---

## 9. Analytics & Finance Reports (`/api/v1/analytics`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Admin | Executive summary: Occupancy %, revenue, arrivals, departures |
| GET | `/financial-summary`| Admin | Room vs F&B revenues, statutory GST collected (18% and 5%) |
| GET | `/advanced` | Admin | ADR, RevPAR, cancellation rate, and trend line charts |
| GET | `/export/:type` | Admin | Instant CSV export (`bookings`, `guests`, `payments`, `food-orders`) |
