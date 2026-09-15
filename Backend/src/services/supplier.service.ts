import { Supplier } from "../models";
import { ApiError } from "../utils/apiError";
import { CreateSupplierInput } from "../interfaces";

export async function listSuppliers() {
  return Supplier.find().sort({ name: 1 });
}

export async function getSupplierById(id: string) {
  const supplier = await Supplier.findById(id);
  if (!supplier) throw ApiError.notFound("Supplier not found");
  return supplier;
}

export async function createSupplier(input: CreateSupplierInput) {
  return Supplier.create(input);
}

export async function updateSupplier(id: string, input: Partial<CreateSupplierInput>) {
  await getSupplierById(id);
  const updated = await Supplier.findByIdAndUpdate(id, input, { new: true });
  return updated;
}

export async function deleteSupplier(id: string) {
  await getSupplierById(id);
  await Supplier.findByIdAndDelete(id);
}
