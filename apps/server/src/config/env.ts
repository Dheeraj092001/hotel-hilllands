import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
}

export const env = {
  // Server
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174").split(","),

  // Database
  databaseUrl: requireEnv("DATABASE_URL"),

  // Firebase Admin
  firebase: {
    projectId: requireEnv("FIREBASE_PROJECT_ID"),
    clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
    privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  },

  // Razorpay
  razorpay: {
    keyId: requireEnv("RAZORPAY_KEY_ID"),
    keySecret: requireEnv("RAZORPAY_KEY_SECRET"),
  },

  // Cloudinary
  cloudinary: {
    cloudName: requireEnv("CLOUDINARY_CLOUD_NAME"),
    apiKey: requireEnv("CLOUDINARY_API_KEY"),
    apiSecret: requireEnv("CLOUDINARY_API_SECRET"),
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    user: requireEnv("EMAIL_USER"),
    password: requireEnv("EMAIL_PASSWORD"),
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
