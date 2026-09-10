import { prisma } from "../../lib/prisma";
import { NotFoundError, AppError } from "../../utils/errors";

export interface CreateCouponDTO {
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED";
  value: number;
  minBookingAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  userLimit?: number;
  isActive?: boolean;
}

export class OffersService {
  static async getCouponsAdmin() {
    return prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { usages: true, bookings: true } },
      },
    });
  }

  static async createCoupon(data: CreateCouponDTO) {
    const existing = await prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() },
    });

    if (existing) {
      throw new AppError("A coupon with this promo code already exists", 400);
    }

    return prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        value: data.value,
        minBookingAmount: data.minBookingAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        usageLimit: data.usageLimit,
        userLimit: data.userLimit,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  static async deleteCoupon(id: string) {
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Coupon not found");
    }

    return prisma.coupon.delete({ where: { id } });
  }

  static async toggleCouponStatus(id: string, isActive: boolean) {
    return prisma.coupon.update({
      where: { id },
      data: { isActive },
    });
  }
}
