import { Response } from "express";

export function successResponse<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 400,
  code?: string
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    code,
  });
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number },
  message = "Success"
): Response {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
    message,
  });
}
