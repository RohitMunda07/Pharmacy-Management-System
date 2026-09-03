import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { authLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", authLimiter, logout);

export default router;
