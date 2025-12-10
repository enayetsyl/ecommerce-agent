import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { sendError } from "../utils/sendResponse";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle known AppError
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    sendError(res, "Invalid token", 401);
    return;
  }

  if (err.name === "TokenExpiredError") {
    sendError(res, "Token expired", 401);
    return;
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    const prismaError = err as any;

    // Unique constraint violation
    if (prismaError.code === "P2002") {
      const field = prismaError.meta?.target?.[0] || "field";
      sendError(res, `${field} already exists`, 409);
      return;
    }

    // Record not found
    if (prismaError.code === "P2025") {
      sendError(res, "Record not found", 404);
      return;
    }
  }

  // Default error
  sendError(
    res,
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
    500
  );
};
