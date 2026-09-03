import bcrypt from "bcrypt";
import { connectDB } from "./connect";
import { User, Medicine, Customer } from "../models";
import mongoose from "mongoose";

async function seed() {
  await connectDB();

  const hashed = await bcrypt.hash("Admin@123", 10);
  await User.findOneAndUpdate(
    { email: "admin@pharmacy.com" },
    { name: "System Admin", email: "admin@pharmacy.com", password: hashed, role: "ADMIN" },
    { upsert: true, new: true }
  );

  const medicineData = [
    { name: "Paracetamol 500mg", category: "Analgesic", quantity: 120, reorderLevel: 20, price: 2.5, expiryDate: new Date("2027-01-01") },
    { name: "Amoxicillin 250mg", category: "Antibiotic", quantity: 8, reorderLevel: 15, price: 5.0, expiryDate: new Date("2026-11-01") },
    { name: "Cetirizine 10mg", category: "Antihistamine", quantity: 60, reorderLevel: 10, price: 1.8, expiryDate: new Date("2027-06-01") },
  ];
  for (const med of medicineData) {
    await Medicine.findOneAndUpdate({ name: med.name }, med, { upsert: true, new: true });
  }

  const customerData = [
    { name: "Aditya Kumar", phone: "9876500001", address: "Patna, Bihar" },
    { name: "Riya Sharma", phone: "9876500002", address: "Danapur, Patna" },
  ];
  for (const cust of customerData) {
    await Customer.findOneAndUpdate({ phone: cust.phone }, cust, { upsert: true, new: true });
  }

  console.log("Seed complete. Admin login: admin@pharmacy.com / Admin@123");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
