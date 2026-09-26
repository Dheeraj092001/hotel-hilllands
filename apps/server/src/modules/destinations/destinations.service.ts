import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../utils/errors";

export class DestinationsService {
  static async list(onlyPublished = true) {
    return prisma.destination.findMany({
      where: { isPublished: onlyPublished ? true : undefined, deletedAt: null },
      include: { _count: { select: { tours: { where: { isPublished: true, deletedAt: null } } } } },
      orderBy: { sortOrder: "asc" },
    });
  }

  static async getBySlug(slug: string) {
    const dest = await prisma.destination.findFirst({
      where: { slug, deletedAt: null },
      include: { tours: { where: { isPublished: true, deletedAt: null }, include: { media: { where: { isPrimary: true } } }, orderBy: { sortOrder: "asc" } } },
    });
    if (!dest) throw new NotFoundError("Destination not found");
    return dest;
  }

  static async create(data: {
    slug: string; name: string; region?: string; description?: string;
    heroImage?: string; heroImageId?: string; highlights?: string[];
    seoTitle?: string; seoDesc?: string; isPublished?: boolean; sortOrder?: number;
  }) {
    return prisma.destination.create({ data });
  }

  static async update(id: string, data: Partial<{ name: string; region: string; description: string; heroImage: string; heroImageId: string; highlights: string[]; seoTitle: string; seoDesc: string; isPublished: boolean; sortOrder: number }>) {
    const existing = await prisma.destination.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new NotFoundError("Destination not found");
    return prisma.destination.update({ where: { id }, data });
  }

  static async softDelete(id: string) {
    return prisma.destination.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}