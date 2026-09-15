export interface JwtPayload {
  id: string;
  role: "ADMIN" | "PHARMACIST";
}

export interface CreateMedicineInput {
  name: string;
  category: string;
  quantity: number;
  reorderLevel?: number;
  price: number;
  expiryDate: string;
  imageUrl?: string;
}

export interface CreateCustomerInput {
  name: string;
  phone: string;
  address?: string;
}

export interface CreateSupplierInput {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface CreateSaleInput {
  medicineId: string;
  customerId: string;
  quantity: number;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "PHARMACIST";
}

export interface LoginInput {
  email: string;
  password: string;
}
