import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { logger } from "../lib/logger";
import { isProd } from "../config/env";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
    return;
  }

  // Prisma errors
  if (err.constructor.name === "PrismaClientKnownRequestError") {
    const prismaError = err as any;
    if (prismaError.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "A record with this value already exists",
        code: "DUPLICATE_ENTRY",
      });
      return;
    }
    if (prismaError.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "Record not found",
        code: "NOT_FOUND",
      });
      return;
    }
  }

  logger.error("Unhandled error:", { message: err.message, stack: err.stack });

  res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
    ...(isProd ? {} : { stack: err.stack }),
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: "Route not found",
    code: "NOT_FOUND",
  });
}
