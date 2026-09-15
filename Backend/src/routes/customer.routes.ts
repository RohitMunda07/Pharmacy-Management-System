import { Router } from "express";
import {
  getCustomers,
  getCustomer,
  addCustomer,
  editCustomer,
  removeCustomer,
  getPurchaseHistory,
} from "../controllers/customer.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createCustomerSchema, updateCustomerSchema } from "../validators/customer.validator";

const router = Router();

router.use(authenticate);

router.get("/", getCustomers);
router.get("/:id", getCustomer);
router.get("/:id/history", getPurchaseHistory);
router.post("/", authorize("ADMIN", "PHARMACIST"), validate(createCustomerSchema), addCustomer);
router.put("/:id", authorize("ADMIN", "PHARMACIST"), validate(updateCustomerSchema), editCustomer);
router.delete("/:id", authorize("ADMIN", "PHARMACIST"), removeCustomer);

export default router;
