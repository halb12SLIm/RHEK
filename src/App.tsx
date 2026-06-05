import React from "react";
import { PRODUCTS, CATEGORIES_WITH_ARABIC } from "./data";
import { Product, CategoryType, CartItem } from "./types";
import ProductCard from "./components/ProductCard";
import BundlePlanner from "./components/BundlePlanner";
import AiConsultant from "./components/AiConsultant";
import AddressCard from "./components/AddressCard";
import { motion } from "motion/react";
import {
  ShoppingBag,
  Trash2,
  Phone,
  MessageSquare,
  Sparkles,
  Zap,
  CheckCircle,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Package,
  FileText,
  Send,
  Coffee,
  HelpCircle
} from "lucide-react";

export default function App() {
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryType | "ALL">("ALL");
  const [cart, setCart] = React.useState<CartItem[]>([]);
  
  // Checkout Form states
  const [cafeName, setCafeName] = React.useState("");
  const [contactName, setContactName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [checkoutStep, setCheckoutStep] = React.useState<"DRAFT" | "SENT">("DRAFT");

  // Handle Adding and Quantity changes
  const handleAddToCart = (product: Product, size: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== product.id));
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -indexCheckHelper(existingIndex)) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          selectedSize: size,
          quantity: quantity
        };
        return updated;
      } else {
        return [...prev, { product, quantity, selectedSize: size }];
      }
    });
  };

  const indexCheckHelper = (idx: number) => {
    return idx === -1 ? 0 : 2;
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في إفراغ سلة عينات عرض الأسعار الدائم؟")) {
      setCart([]);
    }
  };

  // Bulk add of Recommended Items from Calculator / AI Advisor
  const handleBulkAddRecommended = (recommendedItems: { product: Product; quantity: number; selectedSize: string }[]) => {
    setCart((prev) => {
      let updated = [...prev];
      recommendedItems.forEach((rec) => {
        const existingIndex = updated.findIndex((item) => item.product.id === rec.product.id);
        if (existingIndex > -1) {
          // Update to suggested quantity if it is larger or merge
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: Math.max(updated[existingIndex].quantity, rec.quantity),
            selectedSize: rec.selectedSize || updated[existingIndex].selectedSize
          };
        } else {
          updated.push({
            product: rec.product,
            quantity: rec.quantity,
            selectedSize: rec.selectedSize
          });
        }
      });
      return updated;
    });

    // Smooth scroll down to the quotation section
    const quoteElement = document.getElementById("quote-cart-section");
    if (quoteElement) {
      quoteElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filtered Products Selection
  const filteredProducts = React.useMemo(() => {
    if (selectedCategory === "ALL") return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Totals calculations
  const totalCartons = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPriceSyp = cart.reduce((acc, item) => acc + item.product.priceSyp * item.quantity, 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.product.qtyPerUnit * item.quantity, 0);
  
  // Weight estimation: roughly 10kg per cup carton, 4kg per lid packet, etc.
  const estimatedWeightKg = React.useMemo(() => {
    return cart.reduce((acc, item) => {
      let itemWeight = 10; // default 10kg per unit
      if (item.product.id.includes("lid")) itemWeight = 6;
      if (item.product.id.includes("stirrer")) itemWeight = 3;
      if (item.product.id.includes("bag")) itemWeight = 12;
      return acc + itemWeight * item.quantity;
    }, 0);
  }, [cart]);

  // Generate WhatsApp Message Body in beautiful format matching user style
  const computedWhatsAppMessage = React.useMemo(() => {
    const d = new Date();
    const dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    
    let msg = `*طلب تسعيرة ومعاينة عينات - رحيق إكسبريس* ☕📊\n`;
    msg += `--------------------------------------\n`;
    msg += `*🏢 اسم المنشأة:* ${cafeName || "مقهى / مطعم جديد"}\n`;
    msg += `*👤 اسم المفوض المباشر:* ${contactName || "غير محدد"}\n`;
    msg += `*📞 رقم اتصال الواتساب:* ${phone || "غير محدد"}\n`;
    msg += `*📅 تاريخ إرسال الطلب:* ${dateStr}\n`;
    msg += `*📍 موقع تسليم العينات:* مسكنة، ريف حلب الرقة\n`;
    if (notes) {
      msg += `*📝 ملاحظات إضافية:* ${notes}\n`;
    }
    msg += `--------------------------------------\n`;
    msg += `*📦 تفاصيل المواد المطلوبة:* \n\n`;

    cart.forEach((item, index) => {
      const sizeStr = item.selectedSize ? ` [مقاس: ${item.selectedSize}]` : "";
      msg += `${index + 1}. *${item.product.nameAr}*${sizeStr}\n`;
      msg += `   • الكمية: ${item.quantity} ${item.product.unitAr}\n`;
      msg += `   • القيمة التقريبية: ${(item.product.priceSyp * item.quantity).toLocaleString("ar-SY")} ل.س\n\n`;
    });

    msg += `--------------------------------------\n`;
    msg += `*📊 الحجم الإجمالي للطلبية:* ${totalCartons} كرتونة/ربطة\n`;
    msg += `*⚖️ الوزن الإجمالي التقديري:* ${estimatedWeightKg} كغ\n`;
    msg += `*💰 القيمة التقديرية الكلية:* ${totalPriceSyp.toLocaleString("ar-SY")} ل.س\n`;
    msg += `--------------------------------------\n`;
    msg += `⚠️ نود جدولة موعد لزيارتكم في فرعكم بمسكنة (بازار الثلاثاء - طريق حلب الرقة الدولي) لمعاينة جودة وسماكة هذه العينات وتقديم خصومات طلبيات الجملة.`;
    
    return msg;
  }, [cart, cafeName, contactName, phone, notes, totalCartons, totalPriceSyp, estimatedWeightKg]);

  const handleShareOnWhatsApp = () => {
    const encoded = encodeURIComponent(computedWhatsAppMessage);
    // Raheeq Express simulated WhatsApp sales channel number
    const targetPhone = "963955555555"; 
    window.open(`https://wa.me/${targetPhone}?text=${encoded}`, "_blank");
    setCheckoutStep("SENT");
  };

  return (
    <div className="min-h-screen bg-[#090a0c] text-gray-200 selection:bg-amber-500 selection:text-gray-950 flex flex-col justify-between overflow-x-hidden font-sans">
      
      {/* 1. Header Navigation Bar */}
      <nav id="navbar" className="sticky top-0 z-50 bg-[#090a0c]/85 backdrop-blur-xl border-b border-white/5 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo in circle directly matched to the image provided */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#252018] to-black border-2 border-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/10">
              {/* Cup Vector Design resembling logo */}
              <div className="flex flex-col items-center justify-center text-amber-400">
                <Coffee className="w-6 h-6 animate-pulse" />
                <div className="text-[6px] font-black tracking-widest font-mono">EXPRES</div>
              </div>
            </div>
            
            <div>
              <h1 className="text-xl font-black text-gray-100 tracking-wide font-sans flex items-center gap-1.5 leading-none">
                رحِـيـق <span className="text-[#c5a059]">إكسبريس</span>
              </h1>
              <span className="text-[10px] text-gray-400 font-medium block mt-1 font-mono tracking-wider">
                مستلزمات المطاعم والكافيهات • مسكنة
              </span>
            </div>
          </div>

          {/* Specified Address and Quick Navigation (Shown on desktop) */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>المدخل الرئيسي: مسكنة - بازار الثلاثاء - طريق حلب الرقة</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>مفتوح بقوة الثلاثاء (يوم البازار)</span>
            </div>
          </div>

          {/* Floating Cart Launcher Button */}
          <div className="flex items-center gap-2">
            <a
              href="#contact-section"
              className="px-4 py-2 bg-[#121316] hover:bg-[#1b1d22] border border-white/5 text-xs font-bold text-amber-400 rounded-xl transition-all duration-150"
            >
              اتصل بنا
            </a>

            <a
              href="#quote-cart-section"
              className="relative p-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 border border-amber-400/20 text-gray-950 rounded-xl transition-all duration-150 flex items-center gap-2 font-bold text-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>عرض الأسعار</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-red-600 text-white border border-[#090a0c] text-[10px] font-black rounded-full flex items-center justify-center animate-bounce">
                  {cart.length}
                </span>
              )}
            </a>
          </div>

        </div>
      </nav>

      {/* 2. Hero Interactive Brand Showcase Section */}
      <header className="relative bg-gradient-to-b from-[#090a0c] via-[#101217] to-[#090a0c] py-12 md:py-16 px-4 md:px-8 border-b border-white/5 overflow-hidden">
        
        {/* Ambient floating blur particles */}
        <div className="absolute top-[30%] left-[10%] w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-amber-600/5 rounded-full blur-[100px] pointer-events-none animate-pulse delay-700"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Slogan Left Side */}
          <div className="lg:col-span-7 space-y-6 text-right lg:text-right flex flex-col items-end">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
               جودة عالية • أسعار مناسبة ومنافسة • تجهيز سريع
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-gray-100 leading-tight">
              خيارات التعبئة والأكواب الفاخرة التي <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3cd6a] to-[#c5a059] drop-shadow-sm">
                تمنح مقهاك طابعاً استثنائياً
              </span>
            </h2>

            <p className="text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed">
              كل ما يحتاجه مشروع مأكولاتك أو كافيه العصائر والمشروبات الساخنة من كاسات ورقية دبل وعادية، أكواب PET كولد، أغطية سيب مقاومة للانسكاب، ملاعق ومحركات، حوامل للتوصيل، وأكياس كرافت. نحن ركيزتك اللوجستية التي تدعم جودة منتجاتك وتوفر لزبائنك فرصة استهلاك آمنة وبأقل تكلفة!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full pt-4 font-mono select-none">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold">معدل سماكة الكرتون</span>
                <span className="text-xl font-bold text-amber-400 mt-1">350+ GSM</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold">المنتجات المتوفرة</span>
                <span className="text-xl font-bold text-amber-400 mt-1">20+ صنفاً</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 col-span-2 sm:col-span-1 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold">التسليم بمسكنة</span>
                <span className="text-xl font-bold text-emerald-400 mt-1">فوري</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#catalog-section"
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-black rounded-xl text-sm shadow-xl shadow-amber-950/20 active:scale-95 transition-all duration-150"
              >
                تصفح الكتالوج الشامل
              </a>
              <a
                href="#ai-consultant-section"
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl text-sm transition-all duration-150 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                المستشار الذكي (Gemini AI)
              </a>
            </div>

          </div>

          {/* Hero Right Side: Generated Image displayed in custom luxury card frame */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Elegant metallic double border */}
            <div className="relative p-2.5 bg-gradient-to-br from-[#c5a059]/30 to-black rounded-[2.5rem] border border-amber-500/20 shadow-2xl">
              
              {/* Outer frame */}
              <div className="overflow-hidden rounded-[2rem] bg-zinc-950 border-4 border-[#090a0c] aspect-video sm:aspect-square lg:aspect-[4/3] w-full max-w-[440px] relative group">
                
                {/* Glowing lens overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-[#c5a059]/10 pointer-events-none mix-blend-overlay z-10"></div>
                
                <img
                  src="./assets/images/raheeq_hero_banner_1780685000782.png"
                  alt="Raheeq Express packaging collections"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform scale-102 group-hover:scale-110 transition-transform duration-700"
                />

                {/* Localized Floating address Label inside image */}
                <div className="absolute bottom-4 right-4 left-4 bg-black/80 backdrop-blur-md border border-amber-500/20 p-3.5 rounded-2xl z-20 flex items-center justify-between">
                  <div className="text-right">
                    <span className="text-[10px] text-amber-400/90 font-bold block">مقر المعاينة الرَّئيسي والمبيعات:</span>
                    <span className="text-xs font-semibold text-gray-100 block mt-0.5">
                      مسكنة، بازار الثلاثاء، طريق حلب الرقة الدولي
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </header>

      {/* 3. Main Body Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-16 flex-1 w-full">
        
        {/* SECTION: AI Packaging Consultant Workspace */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-gray-100">
              💬 خطط مخصصات التعبئة بمساعدة الذكاء الاصطناعي
            </h2>
            <p className="text-xs md:text-sm text-gray-400">
              قم بكتابة تفاصيل مشروعك أو مبيعاتك اليومية، وسيتولى مستشارنا اللوجستي الذكي اقتراح الأعداد المناسبة من التجهيزات وصياغتها فورياً لتسهيل طلب عيناتك المجانية!
            </p>
          </div>

          <AiConsultant products={PRODUCTS} onAddRecommendedItems={handleBulkAddRecommended} />
        </section>

        {/* SECTION: Dynamic Interactive Volume Calculator */}
        <section id="planner-section" className="scroll-mt-24">
          <BundlePlanner products={PRODUCTS} onAddRecommendedItems={handleBulkAddRecommended} />
        </section>

        {/* SECTION: Catalog and Products Filter Block */}
        <section id="catalog-section" className="space-y-8 scroll-mt-24">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
            <div className="text-right">
              <h2 className="text-2xl font-black text-gray-100 flex items-center gap-2">
                📦 كتالوج المنتجات ومستلزمات التقديم الفاخرة
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                تصفح المنتجات المتوفرة بفرع مسكنة، اختر الأحجام والكميات المطلوبة للمعاينة وعرض أسعار فوري.
              </p>
            </div>

            {/* Selected stats tag in corner */}
            <span className="text-xs text-amber-400 font-mono bg-amber-500/5 border border-amber-500/10 px-3 py-1.5 rounded-lg shrink-0">
              إجمالي المنتجات المعروضة: {filteredProducts.length} صنفاً
            </span>
          </div>

          {/* Filtering Categories Chips Container */}
          <div className="flex flex-wrap gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/5">
            <button
              id="filter-category-all"
              onClick={() => setSelectedCategory("ALL")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedCategory === "ALL"
                  ? "bg-gradient-to-r from-amber-600 to-amber-500 text-gray-950 shadow-lg shadow-amber-500/10"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5"
              }`}
            >
              جميع مستلزمات رحيق إكسبريس
            </button>

            {CATEGORIES_WITH_ARABIC.map((cat) => (
              <button
                key={cat.type}
                id={`filter-category-${cat.type}`}
                onClick={() => setSelectedCategory(cat.type)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.type
                    ? "bg-gradient-to-r from-amber-600 to-amber-500 text-gray-950 shadow-lg shadow-amber-500/10"
                    : "bg-[#121316] hover:bg-[#1b1c20] text-gray-300 border border-white/5"
                }`}
              >
                {cat.nameAr}
              </button>
            ))}
          </div>

          {/* Responsive Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => {
              const inCartItem = cart.find((item) => item.product.id === p.id);
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  quantityInCart={inCartItem ? inCartItem.quantity : 0}
                  selectedSize={inCartItem ? inCartItem.selectedSize || "" : ""}
                  onAddToCart={(size, qty) => handleAddToCart(p, size, qty)}
                  onRemoveFromCart={() => handleRemoveFromCart(p.id)}
                />
              );
            })}
          </div>

        </section>

        {/* SECTION: The Dynamic Quotation & WhatsApp Form drafting block */}
        <section id="quote-cart-section" className="scroll-mt-24 bg-[#121316] border border-white/5 rounded-3xl p-6 md:p-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">
                📄
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-100">
                  تفاصيل سلة عينات معروض الأسعار المحددة
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  تستطيع التعديل المباشر على طلبيتك قبل نسخ البيانات للواتساب وإرسالها لدعم المبيعات بمسكنة.
                </p>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                id="btn-clear-quote-cart"
                onClick={handleClearCart}
                className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors duration-150 flex items-center gap-1.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 px-3 py-2 rounded-xl cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                مسح قائمة عينات التسعير بالكامل
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            /* Empty Basket visual state */
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-300">سلة عينات التسعير الخاصة بك فارغة</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  تفضل بإضافة بعض مواد الأكواب والأكياس من الكتالوج بالأعلى، أو تفاعل مع الحاسبة التلقائية الذكية ومستشار رحيق لترشيح الكميات في كرتونتك الخاصة!
                </p>
              </div>
              <a
                href="#catalog-section"
                className="inline-flex px-5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-xl transition duration-150"
              >
                ابدأ بتصفح مستلزمات الأكواب والعلب
              </a>
            </div>
          ) : (
            /* Quotation interactive grid and details */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Products Table */}
              <div className="lg:col-span-7 space-y-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">قائمة المواد الحالية:</span>
                
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-4 p-4 bg-black/35 hover:bg-black/50 border border-white/5 rounded-2xl transition-all duration-150"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-gray-100">{item.product.nameAr}</h4>
                          {item.selectedSize && (
                            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono font-bold rounded">
                              {item.selectedSize}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500 block font-mono mt-0.5">
                          {item.product.name} • {item.product.unitAr}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {/* Interactive local adjuster */}
                        <div className="flex items-center bg-[#17181c] border border-white/5 rounded-xl p-1 overflow-hidden">
                          <button
                            id={`btn-cart-dec-${item.product.id}`}
                            onClick={() => handleAddToCart(item.product, item.selectedSize || "", item.quantity - 1)}
                            className="p-1 text-gray-400 hover:text-white transition-colors duration-150 text-xs font-bold px-2"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-300 font-mono">{item.quantity}</span>
                          <button
                            id={`btn-cart-inc-${item.product.id}`}
                            onClick={() => handleAddToCart(item.product, item.selectedSize || "", item.quantity + 1)}
                            className="p-1 text-[#c5a059] hover:text-white transition-colors duration-150 text-xs font-bold px-2"
                          >
                            +
                          </button>
                        </div>

                        {/* Price representation */}
                        <span className="text-right text-xs font-bold font-mono text-amber-400 min-w-[70px]">
                          {(item.product.priceSyp * item.quantity).toLocaleString("ar-SY")} ل.س
                        </span>

                        <button
                          id={`btn-cart-delete-item-${item.product.id}`}
                          onClick={() => handleRemoveFromCart(item.product.id)}
                          className="p-2 text-gray-600 hover:text-red-400 rounded-lg transition-colors duration-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sub totals metadata summary panel */}
                <div className="bg-black/25 border border-white/5 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-center">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-bold">إجمالي كمية الكراتين</span>
                    <span className="text-base font-bold text-gray-300 block mt-1">{totalCartons} كرتونة/ربطة</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-bold">العدد الإجمالي التقريبي للقطع</span>
                    <span className="text-base font-bold text-gray-300 block mt-1">{totalItemsCount.toLocaleString("ar-SY")} حبة</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-r border-white/5 pt-3 sm:pt-0">
                    <span className="text-[10px] text-[#c5a059] block uppercase font-bold">الوزن التقديري اللوجستي</span>
                    <span className="text-base font-bold text-amber-400 block mt-1">~ {estimatedWeightKg} كيلو غرام</span>
                  </div>
                </div>
              </div>

              {/* Check-out details and Delivery contact draft */}
              <div className="lg:col-span-5 bg-[#17181c] border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-6">
                
                <div className="space-y-4">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">✍️ إرسال الطلبية وحجز موعد المعاينة:</span>
                  
                  {/* Text inputs form */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1 font-medium text-right">اسم الكافيه أو المشروع الحقيقي:</label>
                      <input
                        id="form-cafe-name"
                        type="text"
                        value={cafeName}
                        onChange={(e) => setCafeName(e.target.value)}
                        placeholder="مثال: كافيه الأصدقاء بمسكنة"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-400 text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1 font-medium text-right">اسم المفوّض المباشر للطلب بالكامل:</label>
                      <input
                        id="form-contact-name"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="مثال: خالد أبو سليمان"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-400 text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1 font-medium text-right">رقم هاتف الاتصال / الواتساب:</label>
                      <input
                        id="form-phone"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="مثال: 0955555555"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-400 text-right font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1 font-medium text-right">أي رغبات خاصة أو متطلبات ومقاسات أخرى:</label>
                      <textarea
                        id="form-notes"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="مثال: أريد عينات سميكة جدار ثنائي لمعاينة القهوة التركية أيضاً..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-400 text-right"
                      />
                    </div>
                  </div>
                </div>

                {/* Draft Summary value block */}
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">القيمة الإجمالية التقريبية:</span>
                    <span className="text-xl font-bold text-amber-400 font-mono">
                      {totalPriceSyp.toLocaleString("ar-SY")} ل.س
                    </span>
                  </div>

                  {/* Immediate Action Buttons */}
                  <div className="space-y-2">
                    <button
                      id="btn-whatsapp-submit"
                      onClick={handleShareOnWhatsApp}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-gray-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition duration-150 active:scale-95 shadow-lg shadow-emerald-900/10 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      إرسال تفاصيل التسعيرة وحجز موعد بالواتساب
                    </button>

                    <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                      💡 سيتم توليد رسالة نصية منظمة بالكامل وإرسالها لمندوبنا بمسكنة، تمهيداً لتجهيز كرتونة المعينة المجانية، وتأكيد موعد تسليمها على طريق حلب الرقة الدولي (بازار الثلاثاء).
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

        </section>

        {/* SECTION: Address details showcasing user request specified address */}
        <section id="location-details-section">
          <AddressCard />
        </section>

      </main>

      {/* 4. Luxury Footer Area */}
      <footer id="contact-section" className="bg-[#050608] border-t border-white/5 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-right md:text-right">
          
          {/* Brand info column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-mono">
              شركة رحيق إكسبريس للتعبئة ومستلزمات المقاهي
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              سلسلة التوريد المعتمدة والأقوى لأصحاب المشاريع الفاخرة، المطاعم، محلات العصائر والأيس كريم في مسكنة ومناطق ريف حلب الشرقي بالكامل. جودة بلا حدود وخدمة دقيقة.
            </p>
            <div className="text-[10px] text-amber-500/70 font-semibold font-mono">
              مسكنه بازار الثلاثاء طريق حلب الرقه • جميع الحقوق محفوظة © 2026
            </div>
          </div>

          {/* Quick links column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
              أصناف التجهيزات الرئيسية بمسكنة:
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>• أكواب ورقية ساخنة (ذات جدار ثنائي وثلاثي عازل)</li>
              <li>• أكواب باردة PET سميكة ومدرجة للعصائر والسموذيز</li>
              <li>• أغطية سيب ساخنة محكمة الإغلاق ومقوّسة باردة بفتحة شفاط</li>
              <li>• عيدان خشب وملاعق تقديم سميكة خشب وبلاستيك</li>
              <li>• أكياس كرافت ورقية مجهزة بمقابض قوية وحوامل النقل</li>
            </ul>
          </div>

          {/* Contact Details with address highlight once more */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
              مكتب مبيعات مسكنة المباشر:
            </h4>
            
            <div className="space-y-2.5 text-xs text-gray-400 font-mono">
              <div className="flex items-center gap-2 justify-end">
                <span>مسكنة، بازار الثلاثاء، طريق حلب الرقة الدولي</span>
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span>+963 933 123 456 / +963 955 789 012</span>
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span>السبت إلى الخميس | 8:30 ص إلى 8:00 م</span>
                <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-amber-400 font-bold block">
                ⭐ متواجدون بقوة طوال يوم الثلاثاء (يوم بازار مسكنة الكبير) لتوفير خدمات المعاينة والبيع الفوري المباشر!
              </span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
