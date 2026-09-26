import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

function requireEnv(key: string, devFallback: string = ""): string {
  const value = process.env[key];
  if (!value || value.startsWith("FILL_")) {
    if (process.env.NODE_ENV !== "production" || devFallback) {
      return devFallback || `dev-${key.toLowerCase()}`;
    }
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value;
}

export const env = {
  // Server
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174,http://localhost:5175").split(","),


  // Database
  databaseUrl: requireEnv("DATABASE_URL", "mysql://root:password@localhost:3306/hotel_newlands"),

  // Firebase Admin
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "newlands-shimla",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  },

  // Razorpay
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_devkey12345",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret12345",
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "dev-cloud",
    apiKey: process.env.CLOUDINARY_API_KEY || "dev-api-key",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "dev-api-secret",
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    user: process.env.EMAIL_USER || "dev@hotelnewlands.in",
    password: process.env.EMAIL_PASSWORD || "dev-password",
    from: process.env.EMAIL_FROM || "Hotel Newlands Shimla <noreply@hotelnewlandsshimla.com>",
  },

  // App URLs
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  adminUrl: process.env.ADMIN_URL || "http://localhost:5174",

  // Invoice
  invoicePrefix: process.env.INVOICE_PREFIX || "NLS",
} as const;

export const isDev = env.nodeEnv === "development";
export const isProd = env.nodeEnv === "production";
