import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/authenticate";
import { PaymentsService } from "./payments.service";
import { successResponse } from "../../utils/response";
import { AppError } from "../../utils/errors";

export class PaymentsController {
  static async createOrder(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const { bookingId } = req.body;
    if (!bookingId) {
      throw new AppError("bookingId is required", 400);
    }

    const result = await PaymentsService.createOrder({
      bookingId,
      userId: req.user.id,
    });

    return successResponse(res, result, "Payment order created successfully");
  }

  static async verifyPayment(req: AuthenticatedRequest, res: Response) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      throw new AppError("razorpayOrderId and razorpayPaymentId are required", 400);
    }

    const result = await PaymentsService.verifySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: razorpaySignature || "",
    });

    return successResponse(res, result, "Payment verified and booking confirmed successfully");
  }
}
