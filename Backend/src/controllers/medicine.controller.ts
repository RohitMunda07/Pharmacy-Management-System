import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import * as medicineService from "../services/medicine.service";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary";
import { cloudinaryEnabled } from "../config/cloudinary.config";
import { sendLowStockAlert } from "../utils/sendEmail";

export const getMedicines = asyncHandler(async (_req: Request, res: Response) => {
  const medicines = await medicineService.listMedicines();
  sendSuccess(res, medicines);
});

export const getMedicine = asyncHandler(async (req: Request, res: Response) => {
  const medicine = await medicineService.getMedicineById((req.params.id as string));
  sendSuccess(res, medicine);
});

export const addMedicine = asyncHandler(async (req: Request, res: Response) => {
  const medicine = await medicineService.createMedicine(req.body);
  sendSuccess(res, medicine, "Medicine added successfully", 201);
});

export const editMedicine = asyncHandler(async (req: Request, res: Response) => {
  const medicine = await medicineService.updateMedicine((req.params.id as string), req.body);
  sendSuccess(res, medicine, "Medicine updated successfully");
});

export const removeMedicine = asyncHandler(async (req: Request, res: Response) => {
  await medicineService.deleteMedicine((req.params.id as string));
  sendSuccess(res, null, "Medicine deleted successfully");
});

export const getLowStock = asyncHandler(async (_req: Request, res: Response) => {
  const medicines = await medicineService.getLowStockMedicines();
  sendSuccess(res, medicines);
});

export const getExpiringSoon = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? Number(req.query.days) : 30;
  const medicines = await medicineService.getExpiringMedicines(days);
  sendSuccess(res, medicines);
});

// Optional: manually trigger the low-stock email alert (only sends if
// RESEND_API_KEY etc. are configured in .env — otherwise it's a no-op).
export const sendLowStockAlertEmail = asyncHandler(async (_req: Request, res: Response) => {
  const medicines = await medicineService.getLowStockMedicines();
  await sendLowStockAlert(medicines.map((m) => ({ name: m.name, quantity: m.quantity })));
  sendSuccess(res, null, "Low-stock alert email sent (or skipped if email isn't configured)");
});

// Optional: attach a photo to an existing medicine. Only works if
// Cloudinary credentials are set in .env.
export const uploadMedicineImage = asyncHandler(async (req: Request, res: Response) => {
  if (!cloudinaryEnabled) {
    throw ApiError.badRequest("Image upload isn't configured (missing Cloudinary credentials in .env)");
  }
  if (!req.file) {
    throw ApiError.badRequest("No image file was provided");
  }

  const imageUrl = await uploadBufferToCloudinary(req.file.buffer);
  const medicine = await medicineService.updateMedicine((req.params.id as string), { imageUrl });
  sendSuccess(res, medicine, "Image uploaded successfully");
});
