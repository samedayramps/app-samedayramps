import { z } from "zod";

const envSchema = z.object({
  WAREHOUSE_ADDRESS: z.string(),
  GOOGLE_MAPS_API_KEY: z.string(),
});

export const env = envSchema.parse({
  WAREHOUSE_ADDRESS: process.env.WAREHOUSE_ADDRESS,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
}); 