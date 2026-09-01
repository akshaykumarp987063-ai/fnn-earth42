import { z } from "zod";

export const servicesQuerySchema = z.object({
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

export type ServicesQuery = z.infer<typeof servicesQuerySchema>;
