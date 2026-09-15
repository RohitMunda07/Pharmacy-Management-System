import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();
