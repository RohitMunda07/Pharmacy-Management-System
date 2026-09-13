import api from "./api";
import { Customer, Sale } from "../types";

function normalizeCustomer(doc: any): Customer {
  const id = doc.id ?? doc._id;
  return { ...doc, id } as Customer;
}

export async function fetchCustomers() {
  const res = await api.get<{ data: any[] }>("/customers");
  return (res.data.data || []).map(normalizeCustomer);
}

export async function createCustomer(payload: Omit<Customer, "id">) {
  const res = await api.post<{ data: any }>("/customers", payload);
  return normalizeCustomer(res.data.data);
}

export async function deleteCustomer(customerId: string) {
  const id = String(customerId || "").trim();
  if (!id) throw new Error("Invalid customer id");
  const res = await api.delete<{ data: null }>(`/customers/${encodeURIComponent(id)}`);
  return res.data.data;
}

export async function fetchPurchaseHistory(customerId: string) {
  const id = String(customerId || "").trim();
  if (!id) return [];
  const res = await api.get<{ data: any[] }>(`/customers/${encodeURIComponent(id)}/history`);
  const list = res.data.data || [];
  // normalize nested sale objects: ensure ids are present and nested objects have id fields
  return list.map((sale: any) => {
    const s = { ...sale } as any;
    s.id = s.id ?? s._id;
    if (s.medicine && typeof s.medicine === "object") {
      s.medicine.id = s.medicine.id ?? s.medicine._id;
    }
    if (s.customer && typeof s.customer === "object") {
      s.customer.id = s.customer.id ?? s.customer._id;
    }
    return s as Sale;
  });
}
