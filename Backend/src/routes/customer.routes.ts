import { Router } from "express";
import {
  getCustomers,
  getCustomer,
  addCustomer,
  removeCustomer,
  getPurchaseHistory,
} from "../controllers/customer.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createCustomerSchema } from "../validators/customer.validator";

const router = Router();

router.use(authenticate);

router.get("/", getCustomers);
router.get("/:id", getCustomer);
router.get("/:id/history", getPurchaseHistory);
router.post("/", authorize("ADMIN", "PHARMACIST"), validate(createCustomerSchema), addCustomer);
router.delete("/:id", authorize("ADMIN", "PHARMACIST"), removeCustomer);

export default router;
