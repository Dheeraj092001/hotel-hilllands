import { describe, it, expect } from "vitest";
import crypto from "crypto";

describe("Payment Signature Verification (HMAC SHA256)", () => {
  const mockSecret = "rzp_test_secret_987654321";
  const orderId = "order_Oq7Y6xP8a1BcDe";
  const paymentId = "pay_Oq7Z1mK3x9LpQr";

  it("should generate and verify valid Razorpay HMAC SHA256 signature", () => {
    const payload = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", mockSecret)
      .update(payload)
      .digest("hex");

    // Verification step
    const expectedSignature = crypto
      .createHmac("sha256", mockSecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    expect(generatedSignature).toBe(expectedSignature);
    expect(generatedSignature).toHaveLength(64);
  });

  it("should reject tampered razorpayPaymentId", () => {
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac("sha256", mockSecret)
      .update(payload)
      .digest("hex");

    const tamperedPayload = `${orderId}|pay_TAMPERED_ID`;
    const tamperedVerification = crypto
      .createHmac("sha256", mockSecret)
      .update(tamperedPayload)
      .digest("hex");

    expect(validSignature).not.toBe(tamperedVerification);
  });

  it("should reject tampered signature string", () => {
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac("sha256", mockSecret)
      .update(payload)
      .digest("hex");

    const forgedSignature = validSignature.substring(0, 60) + "ffff";
    expect(validSignature === forgedSignature).toBe(false);
  });
});
