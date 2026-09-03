import { Medicine, Customer, Sale } from "../models";
import { ApiError } from "../utils/apiError";
import { CreateSaleInput } from "../interfaces";

// Note: this does NOT use a MongoDB transaction. Transactions require
// MongoDB to run as a replica set (Atlas does this automatically, but a
// plain local `mongod` does not, and setting one up is extra friction
// you don't need for this project). For a single-pharmacist system this
// sequential approach is safe enough in practice — if you later deploy
// to Atlas and want stronger guarantees against concurrent sales, wrap
// the two writes below in a mongoose session + withTransaction().
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

export async function listSales() {
  return Sale.find().populate("medicine").populate("customer").sort({ soldAt: -1 });
}
