import { prisma } from "../../lib/prisma";
import { NotFoundError, ForbiddenError } from "../../utils/errors";

export class InvoicesService {
  static async getMyInvoices(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where: {
          booking: {
            userId,
          },
        },
        include: {
          booking: {
            select: {
              confirmationNumber: true,
              checkIn: true,
              checkOut: true,
              room: {
                select: {
                  name: true,
                  roomNumber: true,
                },
              },
            },
          },
          items: true,
        },
        orderBy: {
          issuedAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.invoice.count({
        where: {
          booking: {
            userId,
          },
        },
      }),
    ]);

    return {
      invoices,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getInvoiceById(userId: string, invoiceId: string, isAdmin = false) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        booking: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                city: true,
                state: true,
                postalCode: true,
              },
            },
            room: {
              select: {
                name: true,
                roomNumber: true,
              },
            },
            payments: {
              select: {
                transactionId: true,
                provider: true,
                amount: true,
                status: true,
                createdAt: true,
              },
            },
          },
        },
        items: true,
      },
    });

    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }

    if (!isAdmin && invoice.booking.userId !== userId) {
      throw new ForbiddenError("You are not authorized to view this invoice");
    }

    return invoice;
  }
}
