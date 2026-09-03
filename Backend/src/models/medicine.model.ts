import { Schema, model, InferSchemaType } from "mongoose";

const medicineSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    reorderLevel: { type: Number, required: true, default: 10, min: 0 },
    price: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    imageUrl: { type: String }, // optional — set if a photo was uploaded via Cloudinary
  },
  { timestamps: true }
);

medicineSchema.index({ name: 1 });

export type MedicineDoc = InferSchemaType<typeof medicineSchema>;
export const Medicine = model("Medicine", medicineSchema);
