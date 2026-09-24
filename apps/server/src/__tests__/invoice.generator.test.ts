import { describe, it, expect } from "vitest";

describe("Invoice Generator & Folio Aggregation Engine", () => {
  const LODGING_GST_RATE = 0.18; // 18% GST on Room Tariff & Extras
  const DINING_GST_RATE = 0.05;  // 5% GST on Restaurant Dining & Room Service

  interface LineItemCalculation {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    taxRate: number;
    tax: number;
    category: "ACCOMMODATION" | "FOOD_BEVERAGE" | "EXTRAS" | "ADDITIONAL";
  }

  const aggregateFolio = (params: {
    room: {
      nights: number;
      nightlyRate: number;
    };
    foodOrders: Array<{
      items: Array<{
        name: string;
        quantity: number;
        unitPrice: number;
      }>;
    }>;
    extras: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
    }>;
    incidentals?: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      taxRate: number;
    }>;
    advancePaidOnline: number;
  }) => {
    const lineItems: LineItemCalculation[] = [];

    // 1. Room Accommodation
    const roomSubtotal = params.room.nights * params.room.nightlyRate;
    const roomTax = Math.round(roomSubtotal * LODGING_GST_RATE);
    lineItems.push({
      description: `Suite Lodging (${params.room.nights} nights)`,
      quantity: params.room.nights,
      unitPrice: params.room.nightlyRate,
      amount: roomSubtotal,
      taxRate: 18,
      tax: roomTax,
      category: "ACCOMMODATION",
    });

    // 2. Pre-booked Extras
    let extrasSubtotal = 0;
    let extrasTax = 0;
    for (const ex of params.extras) {
      const amt = ex.quantity * ex.unitPrice;
      const tx = Math.round(amt * LODGING_GST_RATE);
      extrasSubtotal += amt;
      extrasTax += tx;
      lineItems.push({
        description: ex.name,
        quantity: ex.quantity,
        unitPrice: ex.unitPrice,
        amount: amt,
        taxRate: 18,
        tax: tx,
        category: "EXTRAS",
      });
    }

    // 3. Food & Beverage Orders
    let foodSubtotal = 0;
    let foodTax = 0;
    for (const order of params.foodOrders) {
      for (const item of order.items) {
        const amt = item.quantity * item.unitPrice;
        const tx = Math.round(amt * DINING_GST_RATE);
        foodSubtotal += amt;
        foodTax += tx;
        lineItems.push({
          description: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: amt,
          taxRate: 5,
          tax: tx,
          category: "FOOD_BEVERAGE",
        });
      }
    }

    // 4. Custom Incidental Charges (e.g. Minibar, Laundry)
    let incidentalSubtotal = 0;
    let incidentalTax = 0;
    if (params.incidentals) {
      for (const inc of params.incidentals) {
        const amt = inc.quantity * inc.unitPrice;
        const tx = Math.round(amt * (inc.taxRate / 100));
        incidentalSubtotal += amt;
        incidentalTax += tx;
        lineItems.push({
          description: inc.description,
          quantity: inc.quantity,
          unitPrice: inc.unitPrice,
          amount: amt,
          taxRate: inc.taxRate,
          tax: tx,
          category: "ADDITIONAL",
        });
      }
    }

    const totalTaxableSubtotal = roomSubtotal + extrasSubtotal + foodSubtotal + incidentalSubtotal;
    const totalTax = roomTax + extrasTax + foodTax + incidentalTax;
    const grandTotal = totalTaxableSubtotal + totalTax;
    const balanceDue = Math.max(0, grandTotal - params.advancePaidOnline);

    return {
      lineItems,
      roomSubtotal,
      roomTax,
      foodSubtotal,
      foodTax,
      extrasSubtotal,
      extrasTax,
      incidentalSubtotal,
      incidentalTax,
      totalTaxableSubtotal,
      totalTax,
      grandTotal,
      advancePaidOnline: params.advancePaidOnline,
      balanceDue,
    };
  };

  it("calculates room lodging with 18% GST correctly", () => {
    const folio = aggregateFolio({
      room: { nights: 3, nightlyRate: 20000 },
      foodOrders: [],
      extras: [],
      advancePaidOnline: 70800, // 60,000 + 10,800 GST
    });

    expect(folio.roomSubtotal).toBe(60000);
    expect(folio.roomTax).toBe(10800);
    expect(folio.grandTotal).toBe(70800);
    expect(folio.balanceDue).toBe(0);
  });

  it("calculates in-room dining orders with 5% Restaurant GST correctly", () => {
    const folio = aggregateFolio({
      room: { nights: 2, nightlyRate: 15000 },
      foodOrders: [
        {
          items: [
            { name: "Himachali Gosht Rogan Josh", quantity: 2, unitPrice: 1250 },
            { name: "Aged Basmati Rice", quantity: 2, unitPrice: 350 },
            { name: "Estate Spiced Kangra Valley Chai", quantity: 2, unitPrice: 383 },
          ],
        },
      ],
      extras: [],
      advancePaidOnline: 35400, // Room paid in advance
    });

    // Food subtotal: (2*1250) + (2*350) + (2*383) = 2500 + 700 + 766 = 3966
    expect(folio.foodSubtotal).toBe(3966);
    // Food GST (5%): 3966 * 0.05 = 198.3 -> 198
    expect(folio.foodTax).toBe(198);
    // Balance due should be food total: 3966 + 198 = 4164
    expect(folio.balanceDue).toBe(4164);
  });

  it("aggregates full post-checkout folio with room, dining, extras, and incidentals", () => {
    const folio = aggregateFolio({
      room: { nights: 3, nightlyRate: 25000 }, // 75,000 + 13,500 tax = 88,500
      foodOrders: [
        {
          items: [
            { name: "Pan-Seared Himalayan River Trout", quantity: 2, unitPrice: 1100 }, // 2200
            { name: "Saffron & Wild Walnut Pilaf", quantity: 1, unitPrice: 485 },       // 485
          ],
        },
      ],
      extras: [
        { name: "Chauffeur Kalka Luxury Transfer", quantity: 1, unitPrice: 4500 }, // 4500 + 810 tax
      ],
      incidentals: [
        { description: "Cedar Crest Minibar Consumption", quantity: 1, unitPrice: 2400, taxRate: 18 }, // 2400 + 432 tax
        { description: "Express Laundry & Pressing", quantity: 1, unitPrice: 850, taxRate: 18 },       // 850 + 153 tax
      ],
      advancePaidOnline: 88500, // Initial room tariff paid online
    });

    expect(folio.roomSubtotal).toBe(75000);
    expect(folio.roomTax).toBe(13500);

    expect(folio.foodSubtotal).toBe(2685);
    expect(folio.foodTax).toBe(Math.round(2685 * 0.05)); // 134

    expect(folio.extrasSubtotal).toBe(4500);
    expect(folio.extrasTax).toBe(810);

    expect(folio.incidentalSubtotal).toBe(3250);
    expect(folio.incidentalTax).toBe(585);

    const expectedGrandTotal =
      75000 + 13500 + 2685 + 134 + 4500 + 810 + 3250 + 585;
    expect(folio.grandTotal).toBe(expectedGrandTotal);

    // Balance due should be grand total minus advance paid
    expect(folio.balanceDue).toBe(expectedGrandTotal - 88500);
  });
});
