import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import * as saleService from "../services/sale.service";

export const recordSale = asyncHandler(async (req: Request, res: Response) => {
  const sale = await saleService.createSale(req.body);
  sendSuccess(res, sale, "Sale recorded successfully", 201);
});

export const updateSale = asyncHandler(async (req: Request, res: Response) => {
  const sale = await saleService.updateSale((req.params.id as string), req.body);
  sendSuccess(res, sale, "Sale updated successfully");
});

export const getSales = asyncHandler(async (_req: Request, res: Response) => {
  const sales = await saleService.listSales();
  sendSuccess(res, sales);
});
