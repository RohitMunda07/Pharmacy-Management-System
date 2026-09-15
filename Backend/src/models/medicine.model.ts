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

// Virtuals for helpful computed fields
medicineSchema.virtual("isExpired").get(function (this: any) {
  if (!this.expiryDate) return false;
  return new Date(this.expiryDate) < new Date();
});

medicineSchema.virtual("daysToExpiry").get(function (this: any) {
  if (!this.expiryDate) return null;
  const diff = new Date(this.expiryDate).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

medicineSchema.virtual("stockStatus").get(function (this: any) {
  if (this.quantity <= 0) return "out_of_stock";
  if (this.reorderLevel != null && this.quantity <= this.reorderLevel) return "low_stock";
  return "in_stock";
});

// Ensure virtuals are included when converting to JSON
medicineSchema.set("toJSON", { virtuals: true });
medicineSchema.set("toObject", { virtuals: true });

export type MedicineDoc = InferSchemaType<typeof medicineSchema>;
export const Medicine = model("Medicine", medicineSchema);
