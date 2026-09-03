import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import * as customerService from "../services/customer.service";

export const getCustomers = asyncHandler(async (_req: Request, res: Response) => {
  const customers = await customerService.listCustomers();
  sendSuccess(res, customers);
});

export const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.getCustomerById((req.params.id as string));
  sendSuccess(res, customer);
});

export const addCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.createCustomer(req.body);
  sendSuccess(res, customer, "Customer added successfully", 201);
});

export const removeCustomer = asyncHandler(async (req: Request, res: Response) => {
  await customerService.deleteCustomer((req.params.id as string));
  sendSuccess(res, null, "Customer deleted successfully");
});

export const getPurchaseHistory = asyncHandler(async (req: Request, res: Response) => {
  const history = await customerService.getCustomerPurchaseHistory((req.params.id as string));
  sendSuccess(res, history);
});
