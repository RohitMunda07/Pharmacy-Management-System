import { Router } from "express";
import {
  getCustomers,
  getCustomer,
  addCustomer,
  getPurchaseHistory,
} from "../controllers/customer.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createCustomerSchema } from "../validators/customer.validator";

const router = Router();

router.use(authenticate);

router.get("/", getCustomers);
router.get("/:id", getCustomer);
router.get("/:id/history", getPurchaseHistory);
router.post("/", validate(createCustomerSchema), addCustomer);

export default router;
