import { Router } from "express";
import {
  getSuppliers,
  getSupplier,
  addSupplier,
  editSupplier,
  removeSupplier,
} from "../controllers/supplier.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createSupplierSchema, updateSupplierSchema } from "../validators/supplier.validator";

const router = Router();

router.use(authenticate);

router.get("/", getSuppliers);
router.get("/:id", getSupplier);

router.post("/", authorize("ADMIN", "PHARMACIST"), validate(createSupplierSchema), addSupplier);
router.put("/:id", authorize("ADMIN", "PHARMACIST"), validate(updateSupplierSchema), editSupplier);
router.delete("/:id", authorize("ADMIN", "PHARMACIST"), removeSupplier);

export default router;
