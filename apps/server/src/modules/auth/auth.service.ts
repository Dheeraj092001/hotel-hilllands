import { prisma } from "../../lib/prisma";
import { firebaseAuth } from "../../config/firebase";
import { AppError, NotFoundError } from "../../utils/errors";
import { logger } from "../../lib/logger";

export class AuthService {
  async registerOrSyncUser(firebaseUid: string, name: string, email: string) {
    // Upsert user — handles both new registration and token sync
    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: { email, name },
      create: {
        firebaseUid,
        email,
        name,
        role: {
          connect: { name: "GUEST" },
        },
        isEmailVerified: false,
        isActive: true,
      },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });

    return user;
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });

    if (!user) throw new NotFoundError("User");
    return user;
  }

  async getUserByFirebaseUid(firebaseUid: string) {
    return prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });
  }

  async verifyFirebaseToken(token: string) {
    try {
      return await firebaseAuth().verifyIdToken(token);
    } catch (error) {
      logger.error("Firebase token verification failed:", error);
      throw new AppError("Invalid or expired token", 401, "UNAUTHORIZED");
    }
  }
}
