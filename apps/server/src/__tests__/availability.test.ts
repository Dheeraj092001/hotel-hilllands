import { describe, it, expect } from "vitest";

describe("Room Availability & Conflict Engine Logic", () => {
  // Helper simulating Prisma overlap query: checkIn < existingCheckOut && checkOut > existingCheckIn
  const hasOverlap = (
    newIn: Date,
    newOut: Date,
    existingIn: Date,
    existingOut: Date
  ) => {
    return newIn < existingOut && newOut > existingIn;
  };

  const bookedCheckIn = new Date("2026-10-10T14:00:00.000Z");
  const bookedCheckOut = new Date("2026-10-15T11:00:00.000Z");

  it("detects conflict when new booking completely encloses existing stay", () => {
    const newIn = new Date("2026-10-08T14:00:00.000Z");
    const newOut = new Date("2026-10-18T11:00:00.000Z");
    expect(hasOverlap(newIn, newOut, bookedCheckIn, bookedCheckOut)).toBe(true);
  });

  it("detects conflict when new booking is inside existing stay", () => {
    const newIn = new Date("2026-10-11T14:00:00.000Z");
    const newOut = new Date("2026-10-13T11:00:00.000Z");
    expect(hasOverlap(newIn, newOut, bookedCheckIn, bookedCheckOut)).toBe(true);
  });

  it("detects conflict when new booking overlaps on check-in side", () => {
    const newIn = new Date("2026-10-08T14:00:00.000Z");
    const newOut = new Date("2026-10-12T11:00:00.000Z");
    expect(hasOverlap(newIn, newOut, bookedCheckIn, bookedCheckOut)).toBe(true);
  });

  it("detects conflict when new booking overlaps on check-out side", () => {
    const newIn = new Date("2026-10-13T14:00:00.000Z");
    const newOut = new Date("2026-10-18T11:00:00.000Z");
    expect(hasOverlap(newIn, newOut, bookedCheckIn, bookedCheckOut)).toBe(true);
  });

  it("allows same-day checkout and checkin (turnaround window)", () => {
    // Previous guest checks out on Oct 10 morning (11am). New guest arrives Oct 10 afternoon (2pm).
    // Or previous guest departs Oct 15 morning, new guest arrives Oct 15 afternoon.
    const newIn = new Date("2026-10-15T14:00:00.000Z");
    const newOut = new Date("2026-10-20T11:00:00.000Z");
    expect(hasOverlap(newIn, newOut, bookedCheckIn, bookedCheckOut)).toBe(false);
  });

  it("allows completely distinct date ranges", () => {
    const newIn = new Date("2026-11-01T14:00:00.000Z");
    const newOut = new Date("2026-11-05T11:00:00.000Z");
    expect(hasOverlap(newIn, newOut, bookedCheckIn, bookedCheckOut)).toBe(false);
  });
});
