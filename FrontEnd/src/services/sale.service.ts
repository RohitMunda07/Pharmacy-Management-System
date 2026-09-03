import api from "./api";
import { Sale } from "../types";

export async function fetchSales() {
  const res = await api.get<{ data: Sale[] }>("/sales");
  return res.data.data;
}

export async function createSale(payload: { medicineId: string; customerId: string; quantity: number }) {
  const res = await api.post<{ data: Sale }>("/sales", payload);
  return res.data.data;
}

export async function updateSale(
  saleId: string,
  payload: { medicineId: string; customerId: string; quantity: number }
) {
  const res = await api.put<{ data: Sale }>(`/sales/${saleId}`, payload);
  return res.data.data;
}
