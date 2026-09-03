import api from "./api";
import { Customer, Sale } from "../types";

export async function fetchCustomers() {
  const res = await api.get<{ data: Customer[] }>("/customers");
  return res.data.data;
}

export async function createCustomer(payload: Omit<Customer, "id">) {
  const res = await api.post<{ data: Customer }>("/customers", payload);
  return res.data.data;
}

export async function fetchPurchaseHistory(customerId: string) {
  const res = await api.get<{ data: Sale[] }>(`/customers/${customerId}/history`);
  return res.data.data;
}
