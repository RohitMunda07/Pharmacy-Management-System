import { Schema, model, InferSchemaType } from "mongoose";

const supplierSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

supplierSchema.index({ name: 1 });

export type SupplierDoc = InferSchemaType<typeof supplierSchema>;
export const Supplier = model("Supplier", supplierSchema);
