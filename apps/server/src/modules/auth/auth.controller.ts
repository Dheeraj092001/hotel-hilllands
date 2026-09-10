import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { successResponse, errorResponse } from "../../utils/response";
import { logger } from "../../lib/logger";

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firebaseToken, name, email } = req.body;

      if (!firebaseToken || !name || !email) {
        errorResponse(res, "firebaseToken, name and email are required", 400);
        return;
      }

      await this.authService.verifyFirebaseToken(firebaseToken);
      const decoded = await this.authService.verifyFirebaseToken(firebaseToken);
      const user = await this.authService.registerOrSyncUser(decoded.uid, name, email);

      successResponse(res, { user: this.sanitizeUser(user) }, "Registration successful", 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firebaseToken } = req.body;
      if (!firebaseToken) {
        errorResponse(res, "firebaseToken is required", 400);
        return;
      }

      const decoded = await this.authService.verifyFirebaseToken(firebaseToken);
      let user = await this.authService.getUserByFirebaseUid(decoded.uid);

      if (!user) {
        user = await this.authService.registerOrSyncUser(
          decoded.uid,
          decoded.name || decoded.email?.split("@")[0] || "User",
          decoded.email || ""
        );
      }

      successResponse(res, { user: this.sanitizeUser(user) }, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  async googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    return this.login(req, res, next);
  }

  async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.authService.getUserById(req.user!.id);
      successResponse(res, { user: this.sanitizeUser(user) }, "User fetched");
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Firebase handles token invalidation on client side
      successResponse(res, null, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  }

  private sanitizeUser(user: any) {
    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role?.name,
      permissions: user.role?.permissions?.map((rp: any) => rp.permission.name) || [],
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
