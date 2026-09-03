import { Schema, model, InferSchemaType } from "mongoose";

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    address: { type: String },
  },
  { timestamps: true }
);

export type CustomerDoc = InferSchemaType<typeof customerSchema>;
export const Customer = model("Customer", customerSchema);
