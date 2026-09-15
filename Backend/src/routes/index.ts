import { Router } from "express";
import authRoutes from "./auth.routes";
import medicineRoutes from "./medicine.routes";
import customerRoutes from "./customer.routes";
import saleRoutes from "./sale.routes";
import paymentRoutes from "./payment.routes";
import supplierRoutes from "./supplier.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/medicines", medicineRoutes);
router.use("/customers", customerRoutes);
router.use("/sales", saleRoutes);
router.use("/payments", paymentRoutes);
router.use("/suppliers", supplierRoutes);

export default router;
