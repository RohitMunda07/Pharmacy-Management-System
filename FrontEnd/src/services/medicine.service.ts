import api from "./api";
import { Medicine } from "../types";

function normalizeMedicine(doc: any): Medicine {
  // if backend returns _id (Mongo) map it to id for frontend expectations
  const id = doc.id ?? doc._id;
  return { ...doc, id } as Medicine;
}

export async function fetchMedicines() {
  const res = await api.get<{ data: any[] }>("/medicines");
  const list = (res.data.data || []).map(normalizeMedicine);
  return list;
}

export async function fetchLowStock() {
  const res = await api.get<{ data: any[] }>("/medicines/low-stock");
  return (res.data.data || []).map(normalizeMedicine);
}

export async function createMedicine(payload: Omit<Medicine, "id">) {
  const res = await api.post<{ data: any }>("/medicines", payload);
  return normalizeMedicine(res.data.data);
}

export async function updateMedicine(id: string, payload: Partial<Omit<Medicine, "id">>) {
  const res = await api.put<{ data: any }>(`/medicines/${id}`, payload);
  return normalizeMedicine(res.data.data);
}

export async function deleteMedicine(id: string) {
  const res = await api.delete<{ data: null }>(`/medicines/${id}`);
  return res.data.data;
}
