import { Request, Response, NextFunction } from "express";
import { firebaseAuth } from "../config/firebase";
import { prisma } from "../lib/prisma";
import { UnauthorizedError } from "../utils/errors";
import { logger } from "../lib/logger";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    firebaseUid: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
  };
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await firebaseAuth().verifyIdToken(token);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
      include: {
        role: {
          include: { permissions: { include: { permission: true } } },
        },
      },
    });

    if (!user) throw new UnauthorizedError("User not found");
    if (!user.isActive) throw new UnauthorizedError("Account is deactivated");

    req.user = {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      role: user.role?.name || "GUEST",
      permissions: user.role?.permissions.map((rp) => rp.permission.name) || [],
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ success: false, message: error.message, code: "UNAUTHORIZED" });
    } else {
      logger.error("Auth middleware error:", error);
      res.status(401).json({ success: false, message: "Invalid or expired token", code: "UNAUTHORIZED" });
    }
  }
}

export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return next();

  try {
    const token = authHeader.split(" ")[1];
    const decodedToken = await firebaseAuth().verifyIdToken(token);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
      include: {
        role: {
          include: { permissions: { include: { permission: true } } },
        },
      },
    });

    if (user?.isActive) {
      req.user = {
        id: user.id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        role: user.role?.name || "GUEST",
        permissions: user.role?.permissions.map((rp) => rp.permission.name) || [],
      };
    }
  } catch (_error) {
    // Optional auth — ignore errors
  }
  next();
}
