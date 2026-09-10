import { prisma } from "../../lib/prisma";
import { NotFoundError, ForbiddenError, AppError } from "../../utils/errors";

export interface CreateReviewDTO {
  bookingId: string;
  overallRating: number;
  cleanlinessRating: number;
  serviceRating: number;
  locationRating: number;
  foodRating: number;
  valueRating: number;
  comment: string;
}

export class ReviewsService {
  static async createReview(userId: string, data: CreateReviewDTO) {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { review: true },
    });

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError("You can only review your own reservations");
    }

    if (booking.review) {
      throw new AppError("You have already submitted a review for this stay", 400, "REVIEW_ALREADY_EXISTS");
    }

    const review = await prisma.review.create({
      data: {
        userId,
        bookingId: data.bookingId,
        overallRating: data.overallRating,
        cleanlinessRating: data.cleanlinessRating,
        serviceRating: data.serviceRating,
        locationRating: data.locationRating,
        foodRating: data.foodRating,
        valueRating: data.valueRating,
        comment: data.comment,
        status: "APPROVED", // Auto-approved or PENDING; approved allows immediate display
      },
      include: {
        booking: {
          select: {
            confirmationNumber: true,
            room: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return review;
  }

  static async getMyReviews(userId: string) {
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        booking: {
          select: {
            confirmationNumber: true,
            checkIn: true,
            checkOut: true,
            room: {
              select: {
                name: true,
                images: {
                  take: 1,
                  select: { url: true },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reviews;
  }

  static async getPublicReviews(limit = 10) {
    const reviews = await prisma.review.findMany({
      where: { status: "APPROVED" },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            city: true,
            country: true,
          },
        },
        booking: {
          select: {
            room: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return reviews;
  }
}
