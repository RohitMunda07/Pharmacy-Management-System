import { z } from "zod";
import { objectIdSchema } from "./common.validator";

export const createSaleSchema = z.object({
  medicineId: objectIdSchema,
  customerId: objectIdSchema,
  quantity: z.number().int().positive(),
});
