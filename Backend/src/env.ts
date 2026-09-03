import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  PORT: process.env.PORT || "5000",
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  MONGO_URI: required("MONGO_URI"),
  JWT_SECRET: required("JWT_SECRET"),

  // Optional integrations — undefined if not configured; features that
  // depend on them check for this before running.
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  RESEND_API_KEY: process.env.RESEND_API_KEY,
  ALERT_EMAIL_FROM: process.env.ALERT_EMAIL_FROM,
  ALERT_EMAIL_TO: process.env.ALERT_EMAIL_TO,

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
};
