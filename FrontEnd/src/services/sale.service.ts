import api from "./api";
import { Sale } from "../types";

function normalizeSale(doc: any): Sale {
  const sale = { ...doc } as any;
  // medicine/customer may be populated objects or just id strings
  if (sale.medicine) {
    if (typeof sale.medicine === "string") {
      sale.medicine = { id: sale.medicine };
    } else if (typeof sale.medicine === "object") {
      sale.medicine.id = sale.medicine.id ?? sale.medicine._id;
    }
  } else {
    sale.medicine = { id: undefined, name: undefined };
  }

  if (sale.customer) {
    if (typeof sale.customer === "string") {
      sale.customer = { id: sale.customer };
    } else if (typeof sale.customer === "object") {
      sale.customer.id = sale.customer.id ?? sale.customer._id;
    }
  } else {
    sale.customer = { id: undefined, name: undefined };
  }
  sale.id = sale.id ?? sale._id;
  return sale as Sale;
}

export async function fetchSales() {
  const res = await api.get<{ data: any[] }>("/sales");
  return (res.data.data || []).map(normalizeSale);
}

export async function createSale(payload: { medicineId: string; customerId: string; quantity: number }) {
  const res = await api.post<{ data: any }>("/sales", payload);
  return normalizeSale(res.data.data);
}

export async function updateSale(
  saleId: string,
  payload: { medicineId: string; customerId: string; quantity: number }
) {
  const res = await api.put<{ data: any }>(`/sales/${saleId}`, payload);
  return normalizeSale(res.data.data);
}
