import { Router } from "express";
import { createPaymentOrder } from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
router.post("/create-order", createPaymentOrder);

export default router;
