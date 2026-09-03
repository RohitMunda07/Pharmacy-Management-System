import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env";
import { ApiError } from "../utils/apiError";
import { JwtPayload } from "../interfaces";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("No token provided"));
  }
  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}

export function authorize(...allowedRoles: JwtPayload["role"][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden("You do not have permission to perform this action"));
    }
    next();
  };
}
