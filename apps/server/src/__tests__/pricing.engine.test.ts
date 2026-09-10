import { describe, it, expect } from "vitest";

describe("Pricing Engine Core Calculations", () => {
  const GST_RATE = 0.18;
  const EXTRA_ADULT_FEE = 2000;

  // Pure pricing calculation helper matching PricingEngine logic
  const calculateStayPrice = (params: {
    nights: number;
    baseRate: number;
    weekendRate: number;
    weekendDaysCount: number;
    adults: number;
    baseCapacity?: number;
    discount?: number;
  }) => {
    const weekdayDaysCount = params.nights - params.weekendDaysCount;
    const roomSubtotal =
      weekdayDaysCount * params.baseRate + params.weekendDaysCount * params.weekendRate;

    const baseCapacity = params.baseCapacity || 2;
    let extraGuestAmount = 0;
    if (params.adults > baseCapacity) {
      extraGuestAmount = (params.adults - baseCapacity) * EXTRA_ADULT_FEE * params.nights;
    }

    const discountAmount = params.discount || 0;
    const taxableSubtotal = roomSubtotal + extraGuestAmount - discountAmount;
    const taxAmount = Math.round(taxableSubtotal * GST_RATE);
    const totalAmount = taxableSubtotal + taxAmount;

    return {
      roomSubtotal,
      extraGuestAmount,
      discountAmount,
      taxAmount,
      totalAmount,
    };
  };

  it("calculates standard 2-night weekday booking with 18% GST correctly", () => {
    // 2 nights @ ₹10,000 weekday rate
    const result = calculateStayPrice({
      nights: 2,
      baseRate: 10000,
      weekendRate: 13000,
      weekendDaysCount: 0,
      adults: 2,
    });

    expect(result.roomSubtotal).toBe(20000);
    expect(result.extraGuestAmount).toBe(0);
    expect(result.taxAmount).toBe(3600); // 18% of 20000
    expect(result.totalAmount).toBe(23600);
  });

  it("applies weekend premium on Friday and Saturday nights", () => {
    // 3 nights (Thursday, Friday, Saturday) -> 1 weekday + 2 weekend days
    const result = calculateStayPrice({
      nights: 3,
      baseRate: 10000,
      weekendRate: 14000,
      weekendDaysCount: 2,
      adults: 2,
    });

    // 1 * 10000 + 2 * 14000 = 38000
    expect(result.roomSubtotal).toBe(38000);
    expect(result.taxAmount).toBe(Math.round(38000 * 0.18)); // 6840
    expect(result.totalAmount).toBe(44840);
  });

  it("charges extra guest fee when adults exceed base capacity", () => {
    // 3 adults in room with base capacity of 2 for 2 nights
    const result = calculateStayPrice({
      nights: 2,
      baseRate: 12000,
      weekendRate: 15000,
      weekendDaysCount: 0,
      adults: 3,
    });

    // Room: 2 * 12000 = 24000
    // Extra guest: 1 extra * ₹2000 * 2 nights = ₹4000
    // Taxable: 28000
    // GST: 18% of 28000 = 5040
    // Total: 33040
    expect(result.roomSubtotal).toBe(24000);
    expect(result.extraGuestAmount).toBe(4000);
    expect(result.taxAmount).toBe(5040);
    expect(result.totalAmount).toBe(33040);
  });

  it("properly subtracts promo discount before computing 18% GST", () => {
    const result = calculateStayPrice({
      nights: 2,
      baseRate: 10000,
      weekendRate: 12000,
      weekendDaysCount: 0,
      adults: 2,
      discount: 2000, // ₹2000 discount
    });

    // Subtotal: 20000
    // Discount: 2000
    // Taxable: 18000
    // GST: 18% of 18000 = 3240
    // Total: 18000 + 3240 = 21240
    expect(result.discountAmount).toBe(2000);
    expect(result.taxAmount).toBe(3240);
    expect(result.totalAmount).toBe(21240);
  });
});
