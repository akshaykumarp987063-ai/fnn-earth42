import type { Request, Response } from "express";
import { servicesQuerySchema } from "../schemas/services";
import { listPublicServices } from "../services/publicServicesService";
import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";

function firstZodMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid request";
}

export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const parsed = servicesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError(firstZodMessage(parsed.error), 400);
  }

  const services = await listPublicServices(parsed.data.category, parsed.data.search);
  res.status(200).json({ services });
});
