import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authenticate";
import { ForbiddenError } from "../utils/errors";

const ADMIN_ROLES = ["SUPER_ADMIN", "HOTEL_ADMIN", "MANAGER", "RECEPTION",
  "RESTAURANT_MANAGER", "ACCOUNTANT", "CONTENT_MANAGER", "HOUSEKEEPING"];

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
    return;
  }
  if (!ADMIN_ROLES.includes(req.user.role)) {
    res.status(403).json({ success: false, message: "Admin access required", code: "FORBIDDEN" });
    return;
  }
  next();
}

export function requirePermission(...permissions: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
      return;
    }

    const hasPermission = permissions.some((perm) =>
      req.user!.permissions.includes(perm)
    );

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
        code: "FORBIDDEN",
      });
      return;
    }
    next();
  };
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized", code: "UNAUTHORIZED" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "Insufficient role", code: "FORBIDDEN" });
      return;
    }
    next();
  };
}
