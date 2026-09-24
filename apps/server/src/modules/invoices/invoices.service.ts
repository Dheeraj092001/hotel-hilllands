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

  static async getAllInvoicesAdmin(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        include: {
          booking: {
            include: {
              user: { select: { name: true, email: true, phone: true } },
              room: { select: { name: true, roomNumber: true } },
            },
          },
          items: true,
        },
        orderBy: { issuedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.invoice.count(),
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

  /**
   * Admin: Look up a guest by email with all reservations & stay statuses
   */
  static async lookupGuestByEmail(email: string) {
    const cleanEmail = email.trim().toLowerCase();

    // Find user by email or bookings with guestEmail
    const [user, bookings] = await Promise.all([
      prisma.user.findFirst({
        where: { email: { equals: cleanEmail } },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          city: true,
          state: true,
          country: true,
          createdAt: true,
        },
      }),
      prisma.booking.findMany({
        where: {
          OR: [
            { user: { email: { equals: cleanEmail } } },
            { guestEmail: { equals: cleanEmail } },
          ],
        },
        include: {
          room: { select: { id: true, name: true, roomNumber: true, basePrice: true } },
          payments: { select: { id: true, amount: true, status: true, transactionId: true, provider: true } },
          invoice: { select: { id: true, invoiceNumber: true, status: true, total: true } },
          extras: { include: { extra: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      user: user || (bookings.length > 0 ? {
        id: bookings[0].userId,
        name: bookings[0].guestName || "Guest",
        email: cleanEmail,
        phone: bookings[0].guestPhone || "",
      } : null),
      bookings,
    };
  }

  /**
   * Admin: Get checkout billing preview aggregating room, dining, extras, and payments
   */
  static async getCheckoutPreview(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        room: { select: { id: true, name: true, roomNumber: true, basePrice: true } },
        extras: { include: { extra: true } },
        payments: true,
        invoice: { include: { items: true } },
      },
    });

    if (!booking) {
      throw new NotFoundError("Booking reservation not found");
    }

    // Correlate Food Orders for this booking / room stay
    const foodOrders = await prisma.foodOrder.findMany({
      where: {
        OR: [
          { bookingId: booking.id },
          {
            roomNumber: booking.room.roomNumber,
            createdAt: {
              gte: booking.checkIn,
            },
          },
        ],
      },
      include: {
        items: {
          include: { foodItem: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Room charges
    const nights = Math.max(
      1,
      Math.round((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 3600 * 24))
    );
    const roomSubtotal = Number(booking.subtotal || booking.room.basePrice);
    const nightlyRate = Math.round(roomSubtotal / nights);
    const roomTaxRate = 18; // 18% Lodging GST
    const roomTax = Math.round(roomSubtotal * 0.18);
    const roomTotal = roomSubtotal + roomTax;

    // Food charges (5% Dining GST)
    let foodSubtotal = 0;
    let foodTax = 0;
    const formattedFoodOrders = foodOrders.map((o) => {
      const orderSub = Number(o.subtotal);
      const orderTax = Number(o.tax);
      foodSubtotal += orderSub;
      foodTax += orderTax;
      return {
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        createdAt: o.createdAt.toISOString(),
        subtotal: orderSub,
        tax: orderTax,
        total: Number(o.total),
        items: o.items.map((it) => ({
          id: it.id,
          dishName: it.foodItem?.name || "Dish Item",
          quantity: it.quantity,
          unitPrice: Number(it.unitPrice),
          total: Number(it.total),
          isVeg: it.foodItem?.isVeg ?? true,
        })),
      };
    });

    // Extras charges (18% GST)
    let extrasSubtotal = 0;
    let extrasTax = 0;
    const formattedExtras = (booking.extras || []).map((e) => {
      const unitPrice = Number(e.price);
      const total = unitPrice * e.quantity;
      const tax = Math.round(total * 0.18);
      extrasSubtotal += total;
      extrasTax += tax;
      return {
        id: e.id,
        name: e.extra?.name || "Stay Extra",
        quantity: e.quantity,
        unitPrice,
        total,
        taxRate: 18,
      };
    });

    // Paid payments calculation
    const paidPayments = booking.payments.filter((p) => p.status === "PAID" || p.status === "CAPTURED");
    const totalPaid = paidPayments.reduce((acc, p) => acc + Number(p.amount), 0);

    const discount = Number(booking.discount || 0);
    const serviceCharge = Number(booking.serviceCharge || 0);
    const grossSubtotal = roomSubtotal + foodSubtotal + extrasSubtotal;
    const totalTax = roomTax + foodTax + extrasTax;
    const grandTotal = grossSubtotal - discount + totalTax + serviceCharge;
    const balanceDue = Math.max(0, grandTotal - totalPaid);

    return {
      booking: {
        id: booking.id,
        confirmationNumber: booking.confirmationNumber,
        guestName: booking.guestName || booking.user?.name || "Guest",
        guestEmail: booking.guestEmail || booking.user?.email || "",
        guestPhone: booking.guestPhone || booking.user?.phone || "",
        checkIn: booking.checkIn.toISOString(),
        checkOut: booking.checkOut.toISOString(),
        nights,
        adults: booking.adults,
        children: booking.children,
        status: booking.status,
        room: {
          id: booking.room.id,
          name: booking.room.name,
          roomNumber: booking.room.roomNumber,
          basePrice: Number(booking.room.basePrice),
        },
      },
      roomCharges: {
        nights,
        nightlyRate,
        subtotal: roomSubtotal,
        taxRate: roomTaxRate,
        tax: roomTax,
        total: roomTotal,
      },
      foodOrders: formattedFoodOrders,
      extras: formattedExtras,
      payments: booking.payments.map((p) => ({
        id: p.id,
        transactionId: p.transactionId,
        provider: p.provider,
        amount: Number(p.amount),
        status: p.status,
        createdAt: p.createdAt.toISOString(),
      })),
      summary: {
        roomSubtotal,
        foodSubtotal,
        extrasSubtotal,
        grossSubtotal,
        discount,
        roomTax,
        foodTax,
        extrasTax,
        totalTax,
        serviceCharge,
        grandTotal,
        totalPaid,
        balanceDue,
      },
      existingInvoice: booking.invoice ? {
        id: booking.invoice.id,
        invoiceNumber: booking.invoice.invoiceNumber,
        status: booking.invoice.status,
      } : null,
    };
  }

  /**
   * Admin: Generate official checkout GST invoice with room + food + extras + incidentals
   */
  static async generateCheckoutInvoice(data: {
    bookingId: string;
    paymentMethod?: string;
    settleBalance?: boolean;
    notes?: string;
    additionalItems?: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      taxRate: number;
      category: string;
    }>;
  }) {
    const preview = await this.getCheckoutPreview(data.bookingId);
    const { booking, roomCharges, foodOrders, extras, summary } = preview;

    // Check / transition booking status to CHECKED_OUT
    await prisma.booking.update({
      where: { id: data.bookingId },
      data: {
        status: "CHECKED_OUT",
        checkedOutAt: new Date(),
      },
    });

    // Calculate additional incidental items
    let additionalSubtotal = 0;
    let additionalTax = 0;
    const customItemsData: any[] = [];

    if (data.additionalItems && data.additionalItems.length > 0) {
      data.additionalItems.forEach((item) => {
        const itemSubtotal = item.quantity * item.unitPrice;
        const itemTax = Math.round(itemSubtotal * (item.taxRate / 100));
        additionalSubtotal += itemSubtotal;
        additionalTax += itemTax;
        customItemsData.push({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: itemSubtotal,
          taxRate: item.taxRate,
          category: item.category || "ADDITIONAL",
        });
      });
    }

    const finalSubtotal = summary.grossSubtotal + additionalSubtotal;
    const finalTax = summary.totalTax + additionalTax;
    const finalTotal = finalSubtotal - summary.discount + finalTax + summary.serviceCharge;

    // Generate or re-use sequential invoice number
    let invoiceNumber: string;
    const existing = await prisma.invoice.findUnique({
      where: { bookingId: data.bookingId },
    });

    if (existing) {
      invoiceNumber = existing.invoiceNumber;
    } else {
      const { generateInvoiceNumber } = await import("../../utils/invoiceNumber");
      invoiceNumber = await generateInvoiceNumber();
    }

    // Build complete line items list
    const allLineItems: any[] = [
      // 1. Room lodging (SAC 996311)
      {
        description: `${booking.room.name} (Suite #${booking.room.roomNumber}) — ${roomCharges.nights} Night(s) Stay [SAC 996311]`,
        quantity: roomCharges.nights,
        unitPrice: roomCharges.nightlyRate,
        amount: roomCharges.subtotal,
        taxRate: 18,
        category: "ACCOMMODATION",
      },
    ];

    // 2. Extras (SAC 996339)
    extras.forEach((e) => {
      allLineItems.push({
        description: `${e.name} [SAC 996339]`,
        quantity: e.quantity,
        unitPrice: e.unitPrice,
        amount: e.total,
        taxRate: 18,
        category: "EXTRAS",
      });
    });

    // 3. Food items from dining orders (SAC 996331)
    foodOrders.forEach((o) => {
      o.items.forEach((it) => {
        allLineItems.push({
          description: `${it.dishName} (Ref: ${o.orderNumber}) [SAC 996331]`,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          amount: it.total,
          taxRate: 5,
          category: "FOOD_BEVERAGE",
        });
      });
    });

    // 4. Custom additional checkout charges
    customItemsData.forEach((it) => {
      allLineItems.push(it);
    });

    // Transactional invoice save & line items generation
    const invoice = await prisma.$transaction(async (tx) => {
      // Clean existing items if regenerating
      if (existing) {
        await tx.invoiceItem.deleteMany({
          where: { invoiceId: existing.id },
        });
      }

      const inv = await tx.invoice.upsert({
        where: { bookingId: data.bookingId },
        update: {
          subtotal: finalSubtotal,
          discount: summary.discount,
          tax: finalTax,
          serviceCharge: summary.serviceCharge,
          extras: summary.extrasSubtotal + additionalSubtotal,
          food: summary.foodSubtotal,
          total: finalTotal,
          status: "PAID",
          issuedAt: new Date(),
        },
        create: {
          invoiceNumber,
          bookingId: data.bookingId,
          subtotal: finalSubtotal,
          discount: summary.discount,
          tax: finalTax,
          serviceCharge: summary.serviceCharge,
          extras: summary.extrasSubtotal + additionalSubtotal,
          food: summary.foodSubtotal,
          total: finalTotal,
          currency: "INR",
          status: "PAID",
        },
      });

      // Insert all detailed line items
      for (const item of allLineItems) {
        await tx.invoiceItem.create({
          data: {
            invoiceId: inv.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
            taxRate: item.taxRate,
            category: item.category,
          },
        });
      }

      // Mark linked food orders as DELIVERED/SETTLED
      await tx.foodOrder.updateMany({
        where: {
          OR: [
            { bookingId: data.bookingId },
            { roomNumber: booking.room.roomNumber, status: { in: ["PLACED", "CONFIRMED", "PREPARING", "READY"] } },
          ],
        },
        data: { status: "DELIVERED" },
      });

      // Notify guest in-app
      const bookingUser = await tx.booking.findUnique({
        where: { id: data.bookingId },
        select: { userId: true },
      });

      if (bookingUser?.userId) {
        await tx.notification.create({
          data: {
            userId: bookingUser.userId,
            title: "Official Tax Invoice Issued",
            message: `Your final stay invoice ${invoiceNumber} for Hotel Newlands Shimla has been generated upon checkout.`,
            type: "INVOICE_GENERATED",
            link: `/dashboard/invoices`,
          },
        }).catch((err) => console.error("Notification error:", err));
      }

      return inv;
    });

    return this.getInvoiceById("", invoice.id, true);
  }

  /**
   * Admin: Send official invoice email to guest
   */
  static async sendInvoiceEmail(invoiceId: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        booking: {
          include: {
            user: true,
            room: true,
          },
        },
        items: true,
      },
    });

    if (!invoice) {
      throw new NotFoundError("Invoice not found");
    }

    const { emailService } = await import("../../lib/email.service");
    const guestEmail = invoice.booking.guestEmail || invoice.booking.user?.email;

    if (!guestEmail) {
      throw new NotFoundError("Guest email not found for this invoice");
    }

    await emailService.sendInvoiceReceipt({
      to: guestEmail,
      guestName: invoice.booking.guestName || invoice.booking.user?.name || "Valued Guest",
      invoiceNumber: invoice.invoiceNumber,
      confirmationNumber: invoice.booking.confirmationNumber,
      roomName: invoice.booking.room.name,
      roomNumber: invoice.booking.room.roomNumber,
      checkIn: new Date(invoice.booking.checkIn).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      checkOut: new Date(invoice.booking.checkOut).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      subtotal: Number(invoice.subtotal),
      tax: Number(invoice.tax),
      food: Number(invoice.food),
      extras: Number(invoice.extras),
      total: Number(invoice.total),
      items: invoice.items.map((it) => ({
        description: it.description,
        quantity: it.quantity,
        unitPrice: Number(it.unitPrice),
        amount: Number(it.amount),
        category: it.category || undefined,
      })),
    });

    return {
      success: true,
      message: `Tax invoice ${invoice.invoiceNumber} emailed successfully to ${guestEmail}`,
    };
  }
}

