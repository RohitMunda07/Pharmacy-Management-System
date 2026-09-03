import mongoose from "mongoose";
import { Medicine, Customer, Sale } from "../models";
import { ApiError } from "../utils/apiError";
import { CreateSaleInput } from "../interfaces";

export async function createSale(input: CreateSaleInput) {
  const medicine = await Medicine.findById(input.medicineId);
  if (!medicine) throw ApiError.notFound("Medicine not found");

  const customer = await Customer.findById(input.customerId);
  if (!customer) throw ApiError.notFound("Customer not found");

  if (medicine.quantity < input.quantity) {
    throw ApiError.badRequest(
      `Insufficient stock for ${medicine.name}. Available: ${medicine.quantity}`
    );
  }

  const total = medicine.price * input.quantity;

  const sale = await Sale.create({
    medicine: input.medicineId,
    customer: input.customerId,
    quantity: input.quantity,
    total,
  });

  medicine.quantity -= input.quantity;
  await medicine.save();

  return sale;
}

export async function updateSale(id: string, input: Partial<CreateSaleInput>) {
  const sale = await Sale.findById(id);
  if (!sale) throw ApiError.notFound("Sale not found");

  const newMedicineId = input.medicineId ?? sale.medicine.toString();
  const newCustomerId = input.customerId ?? sale.customer.toString();
  const newQuantity = input.quantity ?? sale.quantity;

  const medicine = await Medicine.findById(newMedicineId);
  if (!medicine) throw ApiError.notFound("Medicine not found");

  const customer = await Customer.findById(newCustomerId);
  if (!customer) throw ApiError.notFound("Customer not found");

  const previousMedicine = await Medicine.findById(sale.medicine);
  if (!previousMedicine) throw ApiError.notFound("Previous medicine not found");

  if (newMedicineId === sale.medicine.toString()) {
    medicine.quantity += sale.quantity;
  } else {
    previousMedicine.quantity += sale.quantity;
    await previousMedicine.save();
  }

  if (newQuantity > medicine.quantity) {
    throw ApiError.badRequest(
      `Insufficient stock for ${medicine.name}. Available: ${medicine.quantity}`
    );
  }

  medicine.quantity -= newQuantity;
  await medicine.save();

  sale.medicine = new mongoose.Types.ObjectId(newMedicineId);
  sale.customer = new mongoose.Types.ObjectId(newCustomerId);
  sale.quantity = newQuantity;
  sale.total = medicine.price * newQuantity;
  await sale.save();

  return sale;
}

export async function listSales() {
  return Sale.find().populate("medicine").populate("customer").sort({ soldAt: -1 });
}
