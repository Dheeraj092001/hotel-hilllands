import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../utils/errors";

export interface UpdateProfileDTO {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  preferences?: Record<string, any>;
  profileImage?: string;
}

export class UsersService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firebaseUid: true,
        name: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        profileImage: true,
        address: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
        preferences: true,
        isEmailVerified: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User profile not found");
    }

    const [totalBookings, activeBookings, completedStays, reviewsCount] = await Promise.all([
      prisma.booking.count({ where: { userId } }),
      prisma.booking.count({
        where: {
          userId,
          status: { in: ["CONFIRMED", "CHECKED_IN"] },
        },
      }),
      prisma.booking.count({
        where: {
          userId,
          status: "CHECKED_OUT",
        },
      }),
      prisma.review.count({ where: { userId } }),
    ]);

    return {
      ...user,
      stats: {
        totalBookings,
        activeBookings,
        completedStays,
        reviewsCount,
      },
    };
  }

  static async updateProfile(userId: string, data: UpdateProfileDTO) {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      throw new NotFoundError("User not found");
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.state !== undefined && { state: data.state }),
        ...(data.country !== undefined && { country: data.country }),
        ...(data.postalCode !== undefined && { postalCode: data.postalCode }),
        ...(data.preferences && { preferences: data.preferences }),
        ...(data.profileImage !== undefined && { profileImage: data.profileImage }),
      },
      select: {
        id: true,
        firebaseUid: true,
        name: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        profileImage: true,
        address: true,
        city: true,
        state: true,
        country: true,
        postalCode: true,
        preferences: true,
        isEmailVerified: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  static async getAllGuestsAdmin(params: { search?: string; page?: number; limit?: number }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (params.search) {
      where.OR = [
        { name: { contains: params.search } },
        { email: { contains: params.search } },
        { phone: { contains: params.search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          city: true,
          state: true,
          country: true,
          createdAt: true,
          _count: {
            select: { bookings: true, reviews: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getGuestDetailsAdmin(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            room: { select: { name: true, roomNumber: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("Guest profile not found");
    }

    return user;
  }
}

