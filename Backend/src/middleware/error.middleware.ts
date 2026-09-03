import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { env } from "../env";

export function errorHandler(
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Mongoose throws a CastError when a route param like :id isn't a
  // valid ObjectId (e.g. GET /medicines/not-a-real-id) — treat that as
  // a bad request instead of letting it fall through as a 500.
  if (err.name === "CastError") {
    res.status(400).json({ success: false, message: "Invalid ID format" });
    return;
  }

  // Mongoose unique-index violations surface as MongoServerError code 11000.
  if ((err as any).code === 11000) {
    res.status(409).json({ success: false, message: "A record with this value already exists" });
    return;
  }

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  if (statusCode === 500) {
    // Log unexpected errors for debugging; operational errors are expected
    // and don't need to pollute the server logs.
    console.error("[Unhandled Error]", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && statusCode === 500
      ? { stack: err.stack }
      : {}),
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
}
