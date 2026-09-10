# HOTEL NEWLANDS SHIMLA — PRODUCTION ROLLOUT & DEPLOYMENT GUIDE

## 1. Prerequisites
- **Node.js**: v18 or v20 LTS
- **Package Manager**: `pnpm` (v9+)
- **Database**: Managed MySQL 8.0+ (Render Postgres/MySQL, PlanetScale, AWS RDS, or Aiven)
- **Firebase Project**: `newlands-shimla` (Authentication enabled: Email/Password & Google OAuth)
- **Razorpay Account**: Key ID and Secret for INR transactions
- **Cloudinary Account**: Cloud name, API key, and Secret for media assets

---

## 2. Environment Configuration
Create production environment variables matching `.env.example`:

```bash
# Server Configuration
NODE_ENV=production
PORT=5000
DATABASE_URL="mysql://username:password@hostname:3306/hotel_newlands_prod?sslaccept=strict"
JWT_SECRET="replace-with-cryptographically-secure-64-byte-secret"
CORS_ORIGIN="https://hotelnewlands.in,https://admin.hotelnewlands.in"

# Firebase Admin SDK
FIREBASE_PROJECT_ID="newlands-shimla"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@newlands-shimla.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Razorpay Payments
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="..."

# Cloudinary Media
CLOUDINARY_CLOUD_NAME="hotel-newlands"
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# SMTP Transactional Emails (Nodemailer)
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT=587
SMTP_USER="postmaster@hotelnewlands.in"
SMTP_PASS="..."
SMTP_FROM="Hotel Newlands Shimla <reservations@hotelnewlands.in>"
```

---

## 3. Deployment on Render
The repository includes a ready-to-deploy `render.yaml` Blueprint.

1. Connect the GitHub repository `Dheeraj092001/hotel-hilllands` in your Render dashboard.
2. Select **New Blueprint Instance**.
3. Render automatically discovers:
   - `hotel-newlands-api`: Node Web Service (Port 5000)
   - `hotel-newlands-web`: Static Site (`apps/web/dist`)
   - `hotel-newlands-admin`: Static Site (`apps/admin/dist`)
4. Fill in the secure environment variables under `hotel-newlands-api`.
5. Trigger initial deployment.

---

## 4. Database Initialization & Seeding
Once the production database is connected, execute the migrations and initial seed:

```bash
# Generate Prisma client
pnpm --filter @hotel/server db:generate

# Deploy migrations to production
pnpm --filter @hotel/server db:migrate

# Seed rooms, tax rules, food menu, and initial CMS pages
pnpm --filter @hotel/server db:seed
```

---

## 5. Verification Checklist
- [x] API health check responds `GET /api/v1/health` with `status: OK`.
- [x] Public homepage loads at edge CDN with fast Time To First Byte (&lt;200ms).
- [x] Test booking creation verifies transactional isolation and Razorpay order generation.
- [x] Test in-room dining order appears instantly on Kitchen POS board.
- [x] CSV data exports produce properly formatted files with valid timestamps and numbers.
