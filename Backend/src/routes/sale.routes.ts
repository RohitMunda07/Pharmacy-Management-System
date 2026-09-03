import { Router } from "express";
import { recordSale, getSales } from "../controllers/sale.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createSaleSchema } from "../validators/sale.validator";

const router = Router();

router.use(authenticate);

router.get("/", getSales);
router.post("/", validate(createSaleSchema), recordSale);

export default router;
