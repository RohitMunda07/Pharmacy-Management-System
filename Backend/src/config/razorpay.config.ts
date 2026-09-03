import Razorpay from "razorpay";
import { env } from "../env";

export const razorpayEnabled = Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET);

export const razorpay = razorpayEnabled
  ? new Razorpay({ key_id: env.RAZORPAY_KEY_ID!, key_secret: env.RAZORPAY_KEY_SECRET! })
  : null;
