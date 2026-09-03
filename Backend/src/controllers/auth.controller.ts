import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import * as authService from "../services/auth.service";
import { env } from "../env";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  sendSuccess(res, user, "User registered successfully", 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  sendSuccess(res, result, "Login successful");
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  sendSuccess(res, null, "Logged out successfully");
});
