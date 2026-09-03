import { Router } from "express";
import { recordSale, getSales, updateSale } from "../controllers/sale.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createSaleSchema } from "../validators/sale.validator";

const router = Router();

router.use(authenticate);

router.get("/", getSales);
router.post("/", authorize("ADMIN", "PHARMACIST"), validate(createSaleSchema), recordSale);
router.put("/:id", authorize("ADMIN", "PHARMACIST"), validate(createSaleSchema), updateSale);

export default router;
