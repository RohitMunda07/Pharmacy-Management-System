import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};
