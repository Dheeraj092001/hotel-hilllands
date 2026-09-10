# HOTEL NEWLANDS SHIMLA — ESTATE ERP & OPERATIONS MANUAL

## 1. Overview
The Hotel Newlands ERP provides a unified executive dashboard for front desk, hotel management, culinary staff, and housekeeping attendants to coordinate guest stays, billing, maintenance, and kitchen operations.

---

## 2. Daily Operations Workflow

### 2.1 Morning Front Desk Routine
1. Open the **Executive Overview** (`/`).
2. Review **Today's Arrivals** and **Today's Departures** counters.
3. Check the **Stay Calendar** (`/calendar`) to ensure all incoming suites have been marked `CLEAN` or `INSPECTED` by Housekeeping.
4. When guests arrive at the reception desk, navigate to **Reservations Ledger** (`/bookings`), search the guest by name or confirmation number (`NLS-XXXXXX`), and click **Check In**.

### 2.2 Suite Turnover & Housekeeping
1. Attendants access the **Housekeeping Board** (`/housekeeping`).
2. Suites change to `DIRTY` upon departure. Attendants can transition suites to `CLEANING` while in progress and `CLEAN` or `INSPECTION` upon completion.
3. Supervisors can use the **Assign Task** modal to dispatch specific deep-clean requests, towel changes, or fireplace preparations to attendants.

### 2.3 Managing Suite Maintenance
1. When a room requires plumbing, heating, or aesthetic maintenance, navigate to **Rooms & Suites** (`/rooms`).
2. Click **Maintenance Hold**, select the date range and enter the reason (e.g., "Radiator servicing").
3. The room is immediately excluded from the public booking engine, preventing double-bookings or guest complaints.

---

## 3. The Cedar Hearth (Kitchen POS & Dining)
1. Chefs and pantry staff monitor the **Dining & Kitchen POS** (`/dining-pos`).
2. As in-room orders are placed by guests via their phones, new tickets appear with room number, requested dishes, and special dietary notes.
3. Click **Confirm** -> **Preparing** -> **Ready** -> **Delivered** to track the order through delivery.
4. All food items automatically carry statutory 5% restaurant GST.

---

## 4. Finance & Tax Compliance
1. Navigate to **Finance & Tax Ledger** (`/finance`).
2. Monitor real-time gross revenue, net room tariffs, F&B food revenues, and total GST collected.
3. Invoices are sequentially numbered (`NLS/2026/000001`) with full itemization and printable receipt format.
4. Click any of the CSV export buttons (**Bookings CSV**, **Guests CRM CSV**, **Payments CSV**, **F&B Orders CSV**) to download raw data for accounting and tax audits.

---

## 5. Website CMS & SEO Content Control
1. Navigate to **Website CMS** (`/cms`).
2. Select the page tab (Home, About, Dining, Experiences, Offers).
3. Modify the Headline, Sub-tagline, Browser Page Title, and SERP Meta Description without touching code.
4. Click **Save & Publish Live to Website** to push updates immediately to the public site.
