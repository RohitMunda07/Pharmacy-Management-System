export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PHARMACIST";
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  price: number;
  expiryDate: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
}

export interface Sale {
  id: string;
  medicine: Medicine;
  customer: Customer;
  quantity: number;
  total: number;
  soldAt: string;
}
