import { z } from "zod";

export const taskIdParamSchema = z.object({
  id: z.string().uuid("Invalid task id"),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum([
    "ASSIGNED",
    "ACCEPTED",
    "RESPONDING",
    "ARRIVED",
    "RESOLVED",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export type TaskIdParam = z.infer<typeof taskIdParamSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
