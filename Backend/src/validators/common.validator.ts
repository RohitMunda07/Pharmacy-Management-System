import { z } from "zod";

// MongoDB ObjectIds are 24-character hex strings — not UUIDs.
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");
