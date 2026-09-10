import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../utils/errors";

export class CmsService {
  static async getPageBySlug(slug: string) {
    let page = await prisma.page.findUnique({
      where: { slug },
      include: {
        sections: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
        seo: true,
      },
    });

    if (!page) {
      // Create initial page if accessing first time
      page = await prisma.page.create({
        data: {
          slug,
          title: slug.charAt(0).toUpperCase() + slug.slice(1) + " Page",
          status: "PUBLISHED",
        },
        include: {
          sections: true,
          seo: true,
        },
      });
    }

    return page;
  }

  static async getAllPagesAdmin() {
    return prisma.page.findMany({
      include: {
        sections: true,
        seo: true,
      },
      orderBy: { slug: "asc" },
    });
  }

  static async upsertPageSection(
    pageSlug: string,
    key: string,
    payload: {
      blockType: string;
      data: any;
      sortOrder?: number;
      updatedBy?: string;
    }
  ) {
    let page = await prisma.page.findUnique({ where: { slug: pageSlug } });
    if (!page) {
      page = await prisma.page.create({
        data: {
          slug: pageSlug,
          title: pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1),
          status: "PUBLISHED",
        },
      });
    }

    return prisma.pageSection.upsert({
      where: {
        pageId_key: {
          pageId: page.id,
          key,
        },
      },
      update: {
        blockType: payload.blockType,
        data: payload.data,
        sortOrder: payload.sortOrder || 0,
        updatedBy: payload.updatedBy,
      },
      create: {
        pageId: page.id,
        key,
        blockType: payload.blockType,
        data: payload.data,
        sortOrder: payload.sortOrder || 0,
        updatedBy: payload.updatedBy,
      },
    });
  }

  static async upsertSeo(
    pageSlug: string,
    payload: {
      title?: string;
      description?: string;
      ogTitle?: string;
      ogDescription?: string;
      ogImage?: string;
      keywords?: string;
    }
  ) {
    let page = await prisma.page.findUnique({ where: { slug: pageSlug } });
    if (!page) {
      page = await prisma.page.create({
        data: {
          slug: pageSlug,
          title: pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1),
          status: "PUBLISHED",
        },
      });
    }

    return prisma.seoMetadata.upsert({
      where: { pageId: page.id },
      update: payload,
      create: {
        pageId: page.id,
        ...payload,
      },
    });
  }
}
