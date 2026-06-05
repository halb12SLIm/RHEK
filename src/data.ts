import { Product, CategoryType } from "./types";

export const PRODUCTS: Product[] = [
  // 1. Paper Cups
  {
    id: "paper-cup-hot",
    name: "Premium Hot Paper Cups",
    nameAr: "أكواب ورقية ساخنة فاخرة (سميكة جدار ثنائي)",
    description: "Double wall insulated paper cups for absolute hot drink heat protection.",
    descriptionAr: "جدار مزدوج سميك لعزل ممتاز للحرارة، مثالي للقهوة الساخنة واللاتيه الكابتشينو.",
    category: CategoryType.PAPER_CUPS,
    unitAr: "كرتونة (1000 حبة)",
    priceSyp: 145000,
    qtyPerUnit: 1000,
    sizes: ["4oz", "7oz", "8oz", "9oz", "12oz", "16oz"]
  },
  {
    id: "paper-cup-cold",
    name: "Cold Drinks Paper Cups",
    nameAr: "أكواب ورقية للعصائر والمشروبات الباردة",
    description: "Sturdy single-wall wax coated design for elegant iced coffees and milkshakes.",
    descriptionAr: "أكواب ورقية مخصصة للمشروبات الباردة والمثلجة مع طبقة حماية داخلية تمنع الرطوبة.",
    category: CategoryType.PAPER_CUPS,
    unitAr: "كرتونة (1000 حبة)",
    priceSyp: 130000,
    qtyPerUnit: 1000,
    sizes: ["9oz", "12oz", "16oz", "20oz"]
  },

  // 2. Plastic Cups
  {
    id: "plastic-cup-clear",
    name: "Ultra Clear PET Plastic Cups",
    nameAr: "أكواب بلاستيكية PET شفافة للغاية",
    description: "Premium injection clear cups for signature summer drinks.",
    descriptionAr: "مثالية للمشروبات الباردة والآيس كوفي والسموذي، شفافة وعالية الفخامة والمتانة.",
    category: CategoryType.PLASTIC_CUPS,
    unitAr: "كرتونة (1000 حبة)",
    priceSyp: 165000,
    qtyPerUnit: 1000,
    sizes: ["9oz", "12oz", "16oz", "20oz"]
  },

  // 3. Cup Lids
  {
    id: "lid-sip",
    name: "Hot Sip Lids with Resealable Cap",
    nameAr: "أغطية أكواب ورقية ساخنة بفتحة شرب",
    description: "Snug fit spill-proof travel lids for warm drinks.",
    descriptionAr: "غطاء محكم الإغلاق عالي الجودة مانع للتسرب متوافق مع أكواب القهوة الساخنة.",
    category: CategoryType.CUP_LIDS,
    unitAr: "كرتونة (1000 حبة)",
    priceSyp: 55000,
    qtyPerUnit: 1000,
    sizes: ["8-9oz", "12-16oz"]
  },
  {
    id: "lid-dome",
    name: "Dome Lids for Iced Drinks",
    nameAr: "أغطية أكواب باردة مقعرة (دوم) بفتحة قشة",
    description: "High clearance crystal clear dome lids for thick whip creams.",
    descriptionAr: "غطاء دوم مقعر به فتحة لوضع الماصة، مناسب للكريمة المخفوقة ومختلف العصائر.",
    category: CategoryType.CUP_LIDS,
    unitAr: "كرتونة (1000 حبة)",
    priceSyp: 60000,
    qtyPerUnit: 1000,
    sizes: ["9-12oz", "16-20oz"]
  },

  // 4. Stirrers and Spoons
  {
    id: "stirrer-wooden",
    name: "Natural Birchwood Stirrers",
    nameAr: "عيدان تحريك خشبية طبيعية ناعمة المعالجة",
    description: "Sanded biological wooden stirrers for hot cafes.",
    descriptionAr: "عيدان خشبية طبيعية ممتازة للتحريك لا تؤثر على نكهة المشروب وصديقة للبيئة.",
    category: CategoryType.STIRRERS,
    unitAr: "كرتونة (5000 حبة)",
    priceSyp: 45000,
    qtyPerUnit: 5000
  },
  {
    id: "spoon-plastic",
    name: "Heavy Duty Plastic Spoons",
    nameAr: "ملاعق بلاستيك متينة وسميكة شفافة",
    description: "Heavy style spoons for sundaes, ice cream, and desserts.",
    descriptionAr: "ملاعق ملساء ومتينة ممتازة لتقديم الحلويات، السلطات والمأكولات الخفيفة.",
    category: CategoryType.STIRRERS,
    unitAr: "باكيت (1000 حبة)",
    priceSyp: 35000,
    qtyPerUnit: 1000
  },

  // 5. Sugar & Serving
  {
    id: "sugar-sachet",
    name: "White & Brown Sugar Single Sachets",
    nameAr: "أصابع سكر أبيض وأسمر مغلف (شعار كلاسيكي)",
    description: "Individually wrapped high quality sugar sticks for fast hospitality.",
    descriptionAr: "سكر نقي مغلف بأصابع ورقية أنيقة سهلة الاستعمال بوزن مثالي 5 غرام للحبة.",
    category: CategoryType.SUGAR_SERVING,
    unitAr: "كرتونة (2000 حبة)",
    priceSyp: 80000,
    qtyPerUnit: 2000
  },

  // 6. Carriers & Delivery boxes
  {
    id: "carrier-2cup",
    name: "Double Cup Sturdy Takeaway Trays",
    nameAr: "حامل أكواب كرتوني ثنائي للتوصيل السريع",
    description: "Biodegradable composite cardboard carrier for secure carrying of two cups.",
    descriptionAr: "حامل أكواب كرتوني سميك ومتين يتسع لكوبين ويمنع الانسكاب أثناء النقل.",
    category: CategoryType.CARRIERS_BOXES,
    unitAr: "ربطة (250 حبة)",
    priceSyp: 75000,
    qtyPerUnit: 250
  },
  {
    id: "carrier-4cup",
    name: "Four Cup Takeaway Bottle Holder Trays",
    nameAr: "حامل كرتون رباعي للأكواب ذو مقبض قوي",
    description: "Large 4-position cup carrier tray for large groups deliveries.",
    descriptionAr: "صينية حامل رباعي للأكواب لتجربة شحن مريحة ومنظمة لطلبات المجموعات.",
    category: CategoryType.CARRIERS_BOXES,
    unitAr: "ربطة (200 حبة)",
    priceSyp: 85000,
    qtyPerUnit: 200
  },

  // 7. Bags
  {
    id: "bag-kraft-medium",
    name: "Medium Brown Kraft Takeaway Bags",
    nameAr: "أكياس كرافت ورقية بنية متينة مع مقابض",
    description: "Classic robust handles takeaway bag for meal orders.",
    descriptionAr: "أكياس ورقية بنية أنيقة بمقابض قوية ومثالية لتعبئة السندوتشات وتوصيل المأكولات.",
    category: CategoryType.BAGS,
    unitAr: "ربطة (250 حبة)",
    priceSyp: 95000,
    qtyPerUnit: 250
  },
  {
    id: "bag-plastic-delivery",
    name: "Heavy Duty Plastic Carrier Bags",
    nameAr: "أكياس بلاستيكية متينة ومعززة لتوصيل الوجبات",
    description: "Spacious bottom-gusset plastic bag that fits takeout trays cleanly.",
    descriptionAr: "أكياس بلاستيكية سميكة مانعة لتسرب السوائل، بقاعدة عريضة لتناسب علب الوجبات.",
    category: CategoryType.BAGS,
    unitAr: "ربطة (500 حبة)",
    priceSyp: 65000,
    qtyPerUnit: 500
  }
];

export const CATEGORIES_WITH_ARABIC = [
  { type: CategoryType.PAPER_CUPS, nameAr: "أكواب ورقية", icon: "Cup" },
  { type: CategoryType.PLASTIC_CUPS, nameAr: "أكواب بلاستيكية", icon: "Coffee" },
  { type: CategoryType.CUP_LIDS, nameAr: "أغطية عالية الجودة", icon: "Disc" },
  { type: CategoryType.STIRRERS, nameAr: "ملاعق ومحركات", icon: "Spline" },
  { type: CategoryType.SUGAR_SERVING, nameAr: "سكر ومستلزمات", icon: "Sparkles" },
  { type: CategoryType.CARRIERS_BOXES, nameAr: "حاملات وكرتون", icon: "Box" },
  { type: CategoryType.BAGS, nameAr: "أكياس ورقية وبلاستيك", icon: "ShoppingBag" }
];
