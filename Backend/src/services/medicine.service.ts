import { Medicine } from "../models";
import { ApiError } from "../utils/apiError";
import { CreateMedicineInput } from "../interfaces";

export async function listMedicines() {
  return Medicine.find().sort({ name: 1 });
}

export async function getMedicineById(id: string) {
  const medicine = await Medicine.findById(id);
  if (!medicine) throw ApiError.notFound("Medicine not found");
  return medicine;
}

export async function createMedicine(input: CreateMedicineInput) {
  return Medicine.create({
    ...input,
    expiryDate: new Date(input.expiryDate),
  });
}

export async function updateMedicine(id: string, input: Partial<CreateMedicineInput>) {
  await getMedicineById(id); // ensures 404 if missing
  const updateData: Record<string, unknown> = { ...input };
  if (input.expiryDate) updateData.expiryDate = new Date(input.expiryDate);

  const updated = await Medicine.findByIdAndUpdate(id, updateData, { new: true });
  return updated;
}

export async function deleteMedicine(id: string) {
  await getMedicineById(id);
  await Medicine.findByIdAndDelete(id);
}

export async function getLowStockMedicines() {
  const medicines = await Medicine.find();
  return medicines.filter((m) => m.quantity <= m.reorderLevel);
}

export async function getExpiringMedicines(withinDays = 30) {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + withinDays);
  return Medicine.find({ expiryDate: { $lte: threshold } }).sort({ expiryDate: 1 });
}
