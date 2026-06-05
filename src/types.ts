export enum CategoryType {
  PAPER_CUPS = "PAPER_CUPS",
  PLASTIC_CUPS = "PLASTIC_CUPS",
  CUP_LIDS = "CUP_LIDS",
  STIRRERS = "STIRRERS",
  SUGAR_SERVING = "SUGAR_SERVING",
  CARRIERS_BOXES = "CARRIERS_BOXES",
  BAGS = "BAGS"
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: CategoryType;
  unitAr: string; // unit name in Arabic e.g. "كرتونة" or "ألف حبة"
  priceSyp: number; // Price in SYP or USD. Let's use local price/points or currency. We can display local pricing or relative values beautifully.
  qtyPerUnit: number; // e.g. 1000 items in carton
  sizes?: string[]; // list of sizes options e.g. ["7oz", "8oz", "9oz", "12oz", "16oz"]
  selectedSize?: string;
}

export interface CartItem {
  product: Product;
  quantity: number; // number of units (cartons/packs)
  selectedSize?: string;
  customNote?: string;
}

export interface CalculationInput {
  dailyOrdersCount: number;
  daysToCover: number; // e.g. 15, 30 days
  growthBuffer: number; // percentage, e.g. 10%
  selectedCategories: CategoryType[];
}

export interface RecommendedBundleItem {
  product: Product;
  recommendedUnits: number;
  reason: string;
}

export interface RecommendedBundle {
  items: RecommendedBundleItem[];
  summaryNote: string;
}

export interface ConsultantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  recommendations?: {
    productId: string;
    qty: number;
    reasonAr: string;
  }[];
}
