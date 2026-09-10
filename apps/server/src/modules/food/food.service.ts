import { prisma } from "../../lib/prisma";
import { NotFoundError, AppError } from "../../utils/errors";

export interface CreateOrderDTO {
  deliveryType: "ROOM" | "PICKUP";
  roomNumber?: string;
  bookingId?: string;
  specialNotes?: string;
  items: Array<{
    foodItemId: string;
    quantity: number;
    specialInstructions?: string;
  }>;
}

export class FoodService {
  static async getMenu() {
    return prisma.foodCategory.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isAvailable: true, deletedAt: null },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
  }

  static async createOrder(userId: string, data: CreateOrderDTO) {
    if (!data.items || data.items.length === 0) {
      throw new AppError("Cart is empty", 400);
    }

    const itemIds = data.items.map((i) => i.foodItemId);
    const dbItems = await prisma.foodItem.findMany({
      where: { id: { in: itemIds }, isAvailable: true },
    });

    if (dbItems.length !== itemIds.length) {
      throw new AppError("One or more selected menu items are currently unavailable", 400);
    }

    const itemMap = new Map(dbItems.map((item) => [item.id, item]));

    let subtotal = 0;
    const orderItemsData = data.items.map((item) => {
      const dbItem = itemMap.get(item.foodItemId)!;
      const unitPrice = Number(dbItem.price);
      const total = unitPrice * item.quantity;
      subtotal += total;
      return {
        foodItemId: item.foodItemId,
        quantity: item.quantity,
        unitPrice,
        total,
        specialInstructions: item.specialInstructions,
      };
    });

    const tax = Math.round(subtotal * 0.05); // 5% GST on Restaurant Dining
    const total = subtotal + tax;

    const orderNumber = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return prisma.$transaction(async (tx) => {
      const order = await tx.foodOrder.create({
        data: {
          userId,
          orderNumber,
          bookingId: data.bookingId,
          deliveryType: data.deliveryType,
          roomNumber: data.roomNumber,
          subtotal,
          tax,
          total,
          specialNotes: data.specialNotes,
          status: "PLACED",
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { foodItem: true },
          },
        },
      });

      return order;
    });
  }

  static async getMyOrders(userId: string) {
    return prisma.foodOrder.findMany({
      where: { userId },
      include: {
        items: {
          include: { foodItem: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getAllOrdersAdmin() {
    return prisma.foodOrder.findMany({
      include: {
        user: { select: { name: true, phone: true } },
        items: {
          include: { foodItem: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  static async updateOrderStatus(id: string, status: string) {
    const existing = await prisma.foodOrder.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Food order not found");
    }

    return prisma.foodOrder.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { foodItem: true } },
      },
    });
  }

  static async createMenuItem(data: {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    isVeg?: boolean;
    spiceLevel?: string;
    preparationTimeMin?: number;
    image?: string;
  }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return prisma.foodItem.create({
      data: {
        ...data,
        slug,
      },
    });
  }
}
