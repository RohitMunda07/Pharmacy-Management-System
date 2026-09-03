import { Customer, Sale } from "../models";
import { ApiError } from "../utils/apiError";
import { CreateCustomerInput } from "../interfaces";

export async function listCustomers() {
  return Customer.find().sort({ name: 1 });
}

export async function getCustomerById(id: string) {
  const customer = await Customer.findById(id);
  if (!customer) throw ApiError.notFound("Customer not found");
  return customer;
}

export async function createCustomer(input: CreateCustomerInput) {
  const existing = await Customer.findOne({ phone: input.phone });
  if (existing) throw ApiError.conflict("A customer with this phone number already exists");
  return Customer.create(input);
}

export async function getCustomerPurchaseHistory(id: string) {
  await getCustomerById(id);
  return Sale.find({ customer: id })
    .populate("medicine")
    .sort({ soldAt: -1 });
}
