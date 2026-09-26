export interface Destination {
  id: string;
  slug: string;
  name: string;
  region: string | null;
  description: string | null;
  heroImage: string | null;
  heroImageId: string | null;
  highlights: string[] | null;
  seoTitle: string | null;
  seoDesc: string | null;
  isPublished: boolean;
  sortOrder: number;
  toursCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationListResponse {
  data: Destination[];
  meta: {
    total: number;
  };
}