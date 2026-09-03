import api from "./api";
import { Medicine } from "../types";

export async function fetchMedicines() {
  const res = await api.get<{ data: Medicine[] }>("/medicines");
  return res.data.data;
}

export async function fetchLowStock() {
  const res = await api.get<{ data: Medicine[] }>("/medicines/low-stock");
  return res.data.data;
}

export async function createMedicine(payload: Omit<Medicine, "id">) {
  const res = await api.post<{ data: Medicine }>("/medicines", payload);
  return res.data.data;
}
