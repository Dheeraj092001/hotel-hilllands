import { prisma } from "../../lib/prisma";
import { NotFoundError, AppError } from "../../utils/errors";

export interface PricingInput {
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children?: number;
  extraIds?: { extraId: string; quantity: number }[];
  couponCode?: string;
}

export interface PricingBreakdown {
  roomId: string;
  nights: number;
  baseNightRate: number;
  roomSubtotal: number;
  extraGuestAmount: number;
  extrasAmount: number;
  discountAmount: number;
  taxAmount: number;
  serviceCharge: number;
  totalAmount: number;
  currency: string;
  appliedCoupon?: {
    id: string;
    code: string;
    discount: number;
    discountType: string;
  };
}

export class PricingEngine {
  private static readonly GST_RATE = 0.18; // 18% standard Indian hospitality GST
  private static readonly EXTRA_ADULT_FEE_PER_NIGHT = 2000; // ₹2,000 per night for extra guest

  static async calculatePrice(input: PricingInput): Promise<PricingBreakdown> {
    const room = await prisma.room.findUnique({
      where: { id: input.roomId },
    });

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    const checkInTime = new Date(input.checkIn).getTime();
    const checkOutTime = new Date(input.checkOut).getTime();

    if (checkOutTime <= checkInTime) {
      throw new AppError("Check-out date must be after check-in date", 400);
    }

    const nights = Math.max(
      1,
      Math.round((checkOutTime - checkInTime) / (1000 * 60 * 60 * 24))
    );

    // 1. Calculate room subtotal considering weekend/weekday pricing per night
    let roomSubtotal = 0;
    const currentDate = new Date(input.checkIn);

    for (let i = 0; i < nights; i++) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

      const dailyRate = isWeekend
        ? Number(room.weekendPrice)
        : Number(room.basePrice);

      roomSubtotal += dailyRate;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const baseNightRate = Math.round(roomSubtotal / nights);

    // 2. Extra guest charges if guests exceed base room capacity
    let extraGuestAmount = 0;
    const baseCapacity = 2; // Standard base double occupancy
    if (input.adults > baseCapacity) {
      const extraGuests = input.adults - baseCapacity;
      extraGuestAmount = extraGuests * this.EXTRA_ADULT_FEE_PER_NIGHT * nights;
    }

    // 3. Optional Extras calculation
    let extrasAmount = 0;
    if (input.extraIds && input.extraIds.length > 0) {
      const extraEntities = await prisma.extra.findMany({
        where: {
          id: { in: input.extraIds.map((e) => e.extraId) },
          isActive: true,
        },
      });

      for (const item of input.extraIds) {
        const found = extraEntities.find((e) => e.id === item.extraId);
        if (found) {
          extrasAmount += Number(found.price) * item.quantity;
        }
      }
    }

    // 4. Coupon Discount calculation
    let discountAmount = 0;
    let appliedCoupon: PricingBreakdown["appliedCoupon"] = undefined;

    if (input.couponCode) {
      const now = new Date();
      const coupon = await prisma.coupon.findUnique({
        where: { code: input.couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        const isExpired = coupon.endDate && coupon.endDate < now;
        const isNotStarted = coupon.startDate && coupon.startDate > now;
        const subtotalForDiscount = roomSubtotal + extraGuestAmount;

        const meetsMinAmount =
          !coupon.minBookingAmount ||
          subtotalForDiscount >= Number(coupon.minBookingAmount);

        if (!isExpired && !isNotStarted && meetsMinAmount) {
          if (coupon.discountType === "PERCENTAGE") {
            discountAmount = (subtotalForDiscount * Number(coupon.value)) / 100;
            if (coupon.maxDiscountAmount && discountAmount > Number(coupon.maxDiscountAmount)) {
              discountAmount = Number(coupon.maxDiscountAmount);
            }
          } else {
            // Flat amount
            discountAmount = Number(coupon.value);
          }

          appliedCoupon = {
            id: coupon.id,
            code: coupon.code,
            discount: discountAmount,
            discountType: coupon.discountType,
          };
        }
      }
    }

    // 5. Tax Calculation
    const taxableAmount = Math.max(
      0,
      roomSubtotal + extraGuestAmount + extrasAmount - discountAmount
    );
    const taxAmount = Math.round(taxableAmount * this.GST_RATE);
    const serviceCharge = 0; // Transparent zero hidden fees
    const totalAmount = taxableAmount + taxAmount + serviceCharge;

    return {
      roomId: room.id,
      nights,
      baseNightRate,
      roomSubtotal,
      extraGuestAmount,
      extrasAmount,
      discountAmount,
      taxAmount,
      serviceCharge,
      totalAmount,
      currency: "INR",
      appliedCoupon,
    };
  }
}
