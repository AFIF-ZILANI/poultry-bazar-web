export type CategorySlug = "broiler" | "sonali" | "layer" | "deshi" | "duck" | "quail";

export interface Category {
  slug: CategorySlug;
  name: string;
  nameEn: string;
  codePrefix: string;
  typicalWeight: string;
  typicalAge: string;
  blurb: string;
}

export interface Division {
  slug: string;
  name: string;
}

export interface District {
  slug: string;
  name: string;
  nameEn: string;
  division: string;
  upazilas: string[];
  blurb: string;
}

export interface Seller {
  id: string;
  name: string;
  phone: string;
  memberSince: string;
  verified: boolean;
  soldCount: number;
  district: string;
}

export type AdStatus = "ACTIVE" | "SOLD" | "EXPIRED";
export type Health = "HEALTHY" | "SICK";

export interface Ad {
  code: string;
  category: CategorySlug;
  birdCount: number;
  avgWeightG: number;
  ageDays: number;
  health: Health;
  pricePerKg: number | null;
  status: AdStatus;
  soldPricePerKg: number | null;
  district: string;
  upazila: string;
  village: string;
  sellerId: string;
  postedAt: string;
  expiresAt: string;
  photos: number[];
  note: string;
}

export interface WantedPost {
  id: string;
  category: CategorySlug;
  quantity: number;
  minWeightG: number;
  maxWeightG: number;
  district: string;
  neededBy: string;
  offerPerKg: number | null;
  buyerName: string;
  buyerType: string;
  postedAt: string;
}

export interface RatePoint {
  date: string;
  price: number;
  sales: number;
}

export interface CategoryRate {
  category: CategorySlug;
  today: number;
  yesterday: number;
  sales: number;
  series: RatePoint[];
  byDivision: { division: string; price: number | null; sales: number }[];
}

export type SortKey = "newest" | "price_asc" | "weight_desc" | "count_desc";

export interface AdFilters {
  q?: string;
  category?: CategorySlug;
  division?: string;
  district?: string;
  health?: Health;
  minWeight?: number;
  maxWeight?: number;
  minAge?: number;
  maxAge?: number;
  maxPrice?: number;
  sort?: SortKey;
  page?: number;
  includeClosed?: boolean;
}
