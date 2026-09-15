import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import * as supplierService from "../services/supplier.service";

export const getSuppliers = asyncHandler(async (_req: Request, res: Response) => {
  const suppliers = await supplierService.listSuppliers();
  sendSuccess(res, suppliers);
});

export const getSupplier = asyncHandler(async (req: Request, res: Response) => {
  const supplier = await supplierService.getSupplierById(req.params.id as string);
  sendSuccess(res, supplier);
});

export const addSupplier = asyncHandler(async (req: Request, res: Response) => {
  const supplier = await supplierService.createSupplier(req.body);
  sendSuccess(res, supplier, "Supplier added successfully", 201);
});

export const editSupplier = asyncHandler(async (req: Request, res: Response) => {
  const supplier = await supplierService.updateSupplier(req.params.id as string, req.body);
  sendSuccess(res, supplier, "Supplier updated successfully");
});

export const removeSupplier = asyncHandler(async (req: Request, res: Response) => {
  await supplierService.deleteSupplier(req.params.id as string);
  sendSuccess(res, null, "Supplier deleted successfully");
});
