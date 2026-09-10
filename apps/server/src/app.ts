import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { env } from "./config/env";
import { initFirebase } from "./config/firebase";
import { requestLogger } from "./middleware/requestLogger";
import { generalLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { logger } from "./lib/logger";

// Route imports
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import roomRoutes from "./modules/rooms/rooms.routes";
import bookingRoutes from "./modules/bookings/bookings.routes";
import paymentRoutes from "./modules/payments/payments.routes";
import invoiceRoutes from "./modules/invoices/invoices.routes";
import foodRoutes from "./modules/food/food.routes";
import offerRoutes from "./modules/offers/offers.routes";
import reviewRoutes from "./modules/reviews/reviews.routes";
import leadRoutes from "./modules/leads/leads.routes";
import cmsRoutes from "./modules/cms/cms.routes";
import mediaRoutes from "./modules/media/media.routes";
import notificationRoutes from "./modules/notifications/notifications.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import auditRoutes from "./modules/audit/audit.routes";
import housekeepingRoutes from "./modules/housekeeping/housekeeping.routes";

// Initialize Firebase Admin
initFirebase();

const app = express();

// ─── Security ─────────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
    },
  },
}));

app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
}));

// ─── General Middleware ───────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(requestLogger);
app.use(generalLimiter);

// ─── Health Check ─────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "hotel-newlands-api",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes (v1) ──────────────────────────────────────────
const v1 = "/api/v1";

app.use(`${v1}/auth`, authRoutes);
app.use(`${v1}/users`, userRoutes);
app.use(`${v1}/rooms`, roomRoutes);
app.use(`${v1}/bookings`, bookingRoutes);
app.use(`${v1}/payments`, paymentRoutes);
app.use(`${v1}/invoices`, invoiceRoutes);
app.use(`${v1}/food`, foodRoutes);
app.use(`${v1}/offers`, offerRoutes);
app.use(`${v1}/reviews`, reviewRoutes);
app.use(`${v1}/leads`, leadRoutes);
app.use(`${v1}/cms`, cmsRoutes);
app.use(`${v1}/media`, mediaRoutes);
app.use(`${v1}/notifications`, notificationRoutes);
app.use(`${v1}/analytics`, analyticsRoutes);
app.use(`${v1}/audit`, auditRoutes);
app.use(`${v1}/housekeeping`, housekeepingRoutes);

// ─── Error Handling ───────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
