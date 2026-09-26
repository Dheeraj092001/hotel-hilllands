import { describe, it, expect } from "vitest";

describe("Tour Pipeline & CRM Logic", () => {
  // ── 1. Tour Pricing Calculation ──────────────────────────────
  const calculateTourPrice = (params: {
    basePricePerPerson: number;
    adults: number;
    children?: number;
    childDiscountRatio?: number; // e.g., 0.5 for 50% discount
    groupDiscountPercent?: number; // e.g. 10 for 10% off for 4+ guests
  }) => {
    const adults = Math.max(1, params.adults);
    const children = Math.max(0, params.children || 0);
    const childRatio = params.childDiscountRatio ?? 0.5;

    const adultTotal = adults * params.basePricePerPerson;
    const childTotal = children * (params.basePricePerPerson * childRatio);
    let subtotal = adultTotal + childTotal;

    const totalGuests = adults + children;
    if (params.groupDiscountPercent && totalGuests >= 4) {
      const discount = subtotal * (params.groupDiscountPercent / 100);
      subtotal -= discount;
    }

    // 5% GST for travel services in India
    const gstAmount = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + gstAmount;

    return {
      subtotal,
      gstAmount,
      grandTotal,
      totalGuests,
    };
  };

  it("calculates 2-adult package price with 5% travel GST correctly", () => {
    const res = calculateTourPrice({
      basePricePerPerson: 25000,
      adults: 2,
    });

    expect(res.subtotal).toBe(50000);
    expect(res.gstAmount).toBe(2500); // 5% of 50000
    expect(res.grandTotal).toBe(52500);
    expect(res.totalGuests).toBe(2);
  });

  it("applies 50% child tariff and 10% group discount for groups of 4 or more", () => {
    const res = calculateTourPrice({
      basePricePerPerson: 20000,
      adults: 3,
      children: 1, // 1 child @ 10,000
      childDiscountRatio: 0.5,
      groupDiscountPercent: 10, // 4 guests -> 10% off
    });

    // Subtotal before discount: (3 * 20000) + 10000 = 70000
    // 10% discount = 7000
    // Net subtotal = 63000
    // 5% GST = 3150
    // Grand total = 66150
    expect(res.subtotal).toBe(63000);
    expect(res.gstAmount).toBe(3150);
    expect(res.grandTotal).toBe(66150);
    expect(res.totalGuests).toBe(4);
  });

  // ── 2. Lead Status Machine Transitions ────────────────────────
  const VALID_LEAD_TRANSITIONS: Record<string, string[]> = {
    NEW: ["CONTACTED", "QUALIFIED", "CLOSED_LOST"],
    CONTACTED: ["QUALIFIED", "PROPOSAL_SENT", "CLOSED_LOST"],
    QUALIFIED: ["PROPOSAL_SENT", "CONVERTED", "CLOSED_LOST"],
    PROPOSAL_SENT: ["CONVERTED", "CLOSED_LOST"],
    CONVERTED: [], // Terminal state
    CLOSED_LOST: ["NEW"], // Allowed to reopen
  };

  const canTransitionLead = (from: string, to: string): boolean => {
    return VALID_LEAD_TRANSITIONS[from]?.includes(to) ?? false;
  };

  it("permits forward lifecycle transitions for tour leads", () => {
    expect(canTransitionLead("NEW", "CONTACTED")).toBe(true);
    expect(canTransitionLead("CONTACTED", "QUALIFIED")).toBe(true);
    expect(canTransitionLead("QUALIFIED", "PROPOSAL_SENT")).toBe(true);
    expect(canTransitionLead("PROPOSAL_SENT", "CONVERTED")).toBe(true);
  });

  it("prevents illegal backward transitions once converted", () => {
    expect(canTransitionLead("CONVERTED", "NEW")).toBe(false);
    expect(canTransitionLead("CONVERTED", "PROPOSAL_SENT")).toBe(false);
  });

  // ── 3. Departure Seat Availability ─────────────────────────────
  const checkSeatAvailability = (departure: {
    seatsTotal: number;
    seatsBooked: number;
    status: string;
  }, requestedSeats: number) => {
    if (departure.status !== "OPEN") {
      return { available: false, reason: "Departure closed" };
    }
    const remaining = departure.seatsTotal - departure.seatsBooked;
    if (remaining < requestedSeats) {
      return { available: false, reason: `Only ${remaining} seats left`, remaining };
    }
    return { available: true, remaining: remaining - requestedSeats };
  };

  it("correctly validates available seats on a tour departure", () => {
    const dep = { seatsTotal: 12, seatsBooked: 8, status: "OPEN" };
    const check1 = checkSeatAvailability(dep, 4);
    expect(check1.available).toBe(true);
    expect(check1.remaining).toBe(0);

    const check2 = checkSeatAvailability(dep, 5);
    expect(check2.available).toBe(false);
    expect(check2.reason).toContain("Only 4 seats left");
  });

  // ── 4. Tour Confirmation Number Format ─────────────────────────
  const generateConfirmationNumber = (id: string, timestamp: number) => {
    const prefix = "TB";
    const base36Time = timestamp.toString(36).toUpperCase().slice(-5);
    const hash = id.slice(-3).toUpperCase();
    return `${prefix}-${base36Time}-${hash}`;
  };

  it("generates structured alphanumeric confirmation number", () => {
    const code = generateConfirmationNumber("usr_abc123", 1727395200000);
    expect(code).toMatch(/^TB-[A-Z0-9]{5}-[A-Z0-9]{3}$/);
  });
});
