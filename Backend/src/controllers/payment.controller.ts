import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import { razorpay, razorpayEnabled } from "../config/razorpay.config";

// Optional bonus feature: create a Razorpay order for a sale total so the
// frontend can open the Razorpay checkout widget. Only works if
// RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are set in .env — most final-year
// pharmacy projects work fine with just cash/manual billing, so this is
// entirely opt-in.
export const createPaymentOrder = asyncHandler(async (req: Request, res: Response) => {
  if (!razorpayEnabled || !razorpay) {
    throw ApiError.badRequest("Online payments aren't configured (missing Razorpay credentials in .env)");
  }

  const { amount } = req.body as { amount: number };
  if (!amount || amount <= 0) {
    throw ApiError.badRequest("A valid amount is required");
  }

  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Razorpay expects paise, not rupees
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  sendSuccess(res, order, "Payment order created");
});
