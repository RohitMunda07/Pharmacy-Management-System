import { z } from "zod";

export const createMedicineSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  quantity: z.number().int().nonnegative(),
  reorderLevel: z.number().int().nonnegative().optional(),
  price: z.number().positive(),
  expiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export const updateMedicineSchema = createMedicineSchema.partial();
