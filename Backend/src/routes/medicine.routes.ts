import { Router } from "express";
import {
  getMedicines,
  getMedicine,
  addMedicine,
  editMedicine,
  removeMedicine,
  getLowStock,
  getExpiringSoon,
  sendLowStockAlertEmail,
  uploadMedicineImage,
} from "../controllers/medicine.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { upload } from "../middleware/upload.middleware";
import { createMedicineSchema, updateMedicineSchema } from "../validators/medicine.validator";

const router = Router();

router.use(authenticate);

router.get("/", getMedicines);
router.get("/low-stock", getLowStock);
router.get("/expiring-soon", getExpiringSoon);
router.post("/low-stock/notify", authorize("ADMIN"), sendLowStockAlertEmail);
router.get("/:id", getMedicine);

router.post("/", authorize("ADMIN", "PHARMACIST"), validate(createMedicineSchema), addMedicine);
router.put("/:id", authorize("ADMIN", "PHARMACIST"), validate(updateMedicineSchema), editMedicine);
router.delete("/:id", authorize("ADMIN", "PHARMACIST"), removeMedicine);

router.post(
  "/:id/image",
  authorize("ADMIN", "PHARMACIST"),
  upload.single("image"),
  uploadMedicineImage
);

export default router;
