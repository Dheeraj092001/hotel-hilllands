import { prisma } from "../../lib/prisma";
import { NotFoundError, AppError } from "../../utils/errors";

export interface CreateRoomInput {
  roomNumber: string;
  name: string;
  slug?: string;
  typeId: string;
  description: string;
  shortDescription: string;
  maxAdults: number;
  maxChildren?: number;
  bedType: string;
  numberOfBeds: number;
  sizeInSqft: number;
  floor?: number;
  viewType: string;
  basePrice: number;
  weekendPrice: number;
  seasonalPrice?: number;
  discount?: number;
  isFeatured?: boolean;
  isPublished?: boolean;
}

export class RoomsService {
  static async getPublicRooms(filters?: {
    typeId?: string;
    maxAdults?: number;
    bedType?: string;
    search?: string;
  }) {
    const where: any = {
      isPublished: true,
      deletedAt: null,
    };

    if (filters?.typeId) where.typeId = filters.typeId;
    if (filters?.maxAdults) where.maxAdults = { gte: filters.maxAdults };
    if (filters?.bedType) where.bedType = filters.bedType;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    return prisma.room.findMany({
      where,
      include: {
        type: { select: { id: true, name: true, slug: true } },
        images: { select: { id: true, url: true, isPrimary: true, altText: true } },
        amenities: {
          include: {
            amenity: { select: { id: true, name: true, icon: true, category: true } },
          },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { basePrice: "asc" }],
    });
  }

  static async getRoomBySlug(slug: string) {
    const room = await prisma.room.findUnique({
      where: { slug },
      include: {
        type: true,
        images: true,
        amenities: {
          include: { amenity: true },
        },
      },
    });

    if (!room || room.deletedAt) {
      throw new NotFoundError("Room not found");
    }

    return room;
  }

  static async getAllRoomsAdmin() {
    return prisma.room.findMany({
      where: { deletedAt: null },
      include: {
        type: { select: { id: true, name: true } },
        images: { select: { id: true, url: true, isPrimary: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { roomNumber: "asc" },
    });
  }

  static async createRoom(data: CreateRoomInput) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const existing = await prisma.room.findFirst({
      where: { OR: [{ roomNumber: data.roomNumber }, { slug }] },
    });

    if (existing) {
      throw new AppError("A room with this number or name already exists", 400);
    }

    return prisma.room.create({
      data: {
        ...data,
        slug,
        status: "AVAILABLE",
        housekeepingStatus: "CLEAN",
      },
      include: { type: true },
    });
  }

  static async updateRoom(id: string, data: Partial<CreateRoomInput>) {
    const existing = await prisma.room.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Room not found");
    }

    return prisma.room.update({
      where: { id },
      data,
      include: { type: true, images: true },
    });
  }

  static async updateStatus(id: string, status: string) {
    return prisma.room.update({
      where: { id },
      data: { status },
    });
  }

  static async createBlock(data: {
    roomId: string;
    startDate: string;
    endDate: string;
    reason: string;
    createdBy?: string;
  }) {
    return prisma.roomBlock.create({
      data: {
        roomId: data.roomId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        reason: data.reason,
        createdBy: data.createdBy || "ADMIN",
      },
    });
  }

  static async getRoomTypes() {
    return prisma.roomType.findMany({
      orderBy: { name: "asc" },
    });
  }
}
