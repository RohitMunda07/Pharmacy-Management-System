import { Schema, model, InferSchemaType, Types } from "mongoose";

const saleSchema = new Schema(
  {
    medicine: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true, min: 0 },
    soldAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type SaleDoc = InferSchemaType<typeof saleSchema>;
export const Sale = model("Sale", saleSchema);
export type { Types };
