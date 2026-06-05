import React from "react";
import { Product, CategoryType, CartItem } from "../types";
import { Calculator, Sparkles, Check, HelpCircle, ArrowRight } from "lucide-react";

interface BundlePlannerProps {
  products: Product[];
  onAddRecommendedItems: (items: { product: Product; quantity: number; selectedSize: string }[]) => void;
}

export default function BundlePlanner({ products, onAddRecommendedItems }: BundlePlannerProps) {
  const [dailyOrders, setDailyOrders] = React.useState(250);
  const [days, setDays] = React.useState(30);
  const [safetyBuffer, setSafetyBuffer] = React.useState(10); // percentage

  const totalExpectedDrinks = dailyOrders * days;
  const safetyFactor = 1 + safetyBuffer / 100;
  const totalDrinksWithSafety = Math.round(totalExpectedDrinks * safetyFactor);

  // Heuristics:
  // - 65% of drinks are hot drinks
  // - 35% of drinks are cold drinks
  const hotDrinksCount = Math.round(totalDrinksWithSafety * 0.65);
  const coldDrinksCount = Math.round(totalDrinksWithSafety * 0.35);

  const recommendations = React.useMemo(() => {
    const recs: { product: Product; qty: number; designQty: number; size: string; reason: string }[] = [];

    // 1. Hot cups (1000 per carton)
    const hotCupProd = products.find((p) => p.id === "paper-cup-hot");
    if (hotCupProd) {
      const neededCartons = Math.ceil(hotDrinksCount / hotCupProd.qtyPerUnit);
      recs.push({
        product: hotCupProd,
        qty: neededCartons,
        designQty: hotDrinksCount,
        size: "8oz",
        reason: `تغطي حوالي ${hotDrinksCount.toLocaleString("ar-SY")} مشروب ساخن في ${days} يوماً`
      });
    }

    // 2. Hot lids (1000 per carton)
    const hotLidsProd = products.find((p) => p.id === "lid-sip");
    if (hotLidsProd) {
      const neededCartons = Math.ceil(hotDrinksCount / hotLidsProd.qtyPerUnit);
      recs.push({
        product: hotLidsProd,
        qty: neededCartons,
        designQty: hotDrinksCount,
        size: "8-9oz",
        reason: "أغطية سيب عازلة محكمة متطابقة مع أكوابك الساخنة"
      });
    }

    // 3. Cold cups PET (1000 per carton)
    const coldCupProd = products.find((p) => p.id === "plastic-cup-clear");
    if (coldCupProd) {
      const neededCartons = Math.ceil(coldDrinksCount / coldCupProd.qtyPerUnit);
      recs.push({
        product: coldCupProd,
        qty: neededCartons,
        designQty: coldDrinksCount,
        size: "12oz",
        reason: `تغطي حوالي ${coldDrinksCount.toLocaleString("ar-SY")} مشروب بارد/ميلك شيك`
      });
    }

    // 4. Dome Lids (1000 per carton)
    const coldLidsProd = products.find((p) => p.id === "lid-dome");
    if (coldLidsProd) {
      const neededCartons = Math.ceil(coldDrinksCount / coldLidsProd.qtyPerUnit);
      recs.push({
        product: coldLidsProd,
        qty: neededCartons,
        designQty: coldDrinksCount,
        size: "16-20oz",
        reason: "أغطية باردة دوم مقببة متوافقة ومثالية للكريمة"
      });
    }

    // 5. Stirrers (5000 per carton)
    const stirrerProd = products.find((p) => p.id === "stirrer-wooden");
    if (stirrerProd) {
      const neededCartons = Math.ceil(hotDrinksCount / stirrerProd.qtyPerUnit);
      recs.push({
        product: stirrerProd,
        qty: neededCartons,
        designQty: hotDrinksCount,
        size: "",
        reason: "ملاعق وعيدان خشب طبيعي للمشروبات الساخنة والتحضير"
      });
    }

    // 6. Medium Kraft Bags (250 items per pack) - assuming 35% of orders need bags
    const bagProd = products.find((p) => p.id === "bag-kraft-medium");
    if (bagProd) {
      const neededBags = Math.round(totalDrinksWithSafety * 0.35);
      const neededUnits = Math.ceil(neededBags / bagProd.qtyPerUnit);
      recs.push({
        product: bagProd,
        qty: neededUnits,
        designQty: neededBags,
        size: "",
        reason: `لتسليم ما يقارب ${neededBags.toLocaleString("ar-SY")} طلب خارجي وتيك أوي بأناقة`
      });
    }

    // 7. Double cup carriers (250 items per pack) - assuming 20% of orders require carry trays
    const carrierProd = products.find((p) => p.id === "carrier-2cup");
    if (carrierProd) {
      const neededCarriers = Math.round(totalDrinksWithSafety * 0.2);
      const neededUnits = Math.ceil(neededCarriers / carrierProd.qtyPerUnit);
      recs.push({
        product: carrierProd,
        qty: neededUnits,
        designQty: neededCarriers,
        size: "",
        reason: "حوامل كرتون ثنائية من مستويات عالية الجودة لتفادي السوائل المنقسِمة"
      });
    }

    return recs;
  }, [products, dailyOrders, days, safetyBuffer, hotDrinksCount, coldDrinksCount, totalDrinksWithSafety]);

  const totalCost = recommendations.reduce((sum, item) => sum + item.product.priceSyp * item.qty, 0);

  const handleBulkAdd = () => {
    const formatted = recommendations.map((r) => ({
      product: r.product,
      quantity: r.qty,
      selectedSize: r.size,
    }));
    onAddRecommendedItems(formatted);
  };

  return (
    <div
      id="bundle-planner-section"
      className="bg-gradient-to-[#111] via-[#16181c] to-[#0d0e11] border border-amber-500/10 rounded-3xl p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
              حاسبة تجهيز مخصصات المقاهي والمطاعم
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 font-sans">
                تكامل ذكي
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              أدخل توقعات مبيعاتك اليومية واعرف كمية الكراتين الدقيقة التي يحتاجها مشروعك لنصف شهر أو شهر كامل!
            </p>
          </div>
        </div>

        {/* Quick Summary Badge */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] text-gray-500 block uppercase font-mono tracking-wider">الحجم الإجمالي المتوقع التغطية</span>
          <span className="text-2xl font-bold text-amber-400 font-mono mt-1">
            {totalDrinksWithSafety.toLocaleString("ar-SY")}{" "}
            <span className="text-sm font-semibold text-gray-300">مشروب</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        {/* Dynamic Inputs Slider Block */}
        <div className="lg:col-span-1 bg-black/25 border border-white/5 rounded-2xl p-6 flex flex-col justify-between gap-6">
          <h3 className="text-sm font-bold text-gray-300 border-b border-white/5 pb-3 block">
            ⚙️ إعدادات حجم المبيعات والدورة اللوجستية:
          </h3>

          <div className="space-y-5">
            {/* 1. Daily Volume Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-gray-300 font-medium">متوسط المبيعات اليومي (كوب/وجبة):</label>
                <span className="text-sm font-bold text-amber-400 font-mono">{dailyOrders} وحدة</span>
              </div>
              <input
                id="input-daily-orders"
                type="range"
                min="50"
                max="1500"
                step="25"
                value={dailyOrders}
                onChange={(e) => setDailyOrders(Number(e.target.value))}
                className="w-full accent-amber-500 bg-gray-800 rounded-lg cursor-pointer max-h-1.5"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-mono">
                <span>50 حبة</span>
                <span>500 حبة</span>
                <span>1500 حبة</span>
              </div>
            </div>

            {/* 2. Days Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-gray-300 font-medium">الأيام المستهدفة للتخزين (أيام التغطية):</label>
                <span className="text-sm font-bold text-amber-400 font-mono">{days} يوماً</span>
              </div>
              <input
                id="input-days"
                type="range"
                min="7"
                max="90"
                step="1"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-amber-500 bg-gray-800 rounded-lg cursor-pointer max-h-1.5"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-mono">
                <span>أسبوع </span>
                <span>شهر كامل</span>
                <span>3 أشهر</span>
              </div>
            </div>

            {/* 3. Safety Margin Booster */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-gray-300 font-medium">هامش الأمان واحتياطي النمو الأسبوعي:</label>
                <span className="text-sm font-bold text-amber-400 font-mono">+{safetyBuffer}%</span>
              </div>
              <input
                id="input-safety-buffer"
                type="range"
                min="0"
                max="50"
                step="5"
                value={safetyBuffer}
                onChange={(e) => setSafetyBuffer(Number(e.target.value))}
                className="w-full accent-amber-500 bg-gray-800 rounded-lg cursor-pointer max-h-1.5"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-[#fff] font-mono">
                <span>0% حد أدنى</span>
                <span>احتياطي متوسط</span>
                <span>+50% أمان كامل</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[11px] text-amber-200/80 leading-relaxed mt-2 text-right">
            🔍 نقوم باحتساب حزمة متكاملة تتضمن الأكواب، الأغطية المتطابقة، المعالق المساعدة والأكياس بناءً على نسب الاستهلاك لماتشات المشروبات الساخنة (65%) والباردة (35%).
          </div>
        </div>

        {/* Dynamic Recommended Items Results List */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-black/10 border border-white/5 rounded-2xl p-5">
          <div>
            <h4 className="text-sm font-bold text-gray-200 flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              الكمية المقترحة لمستلزمات مقهاك:
            </h4>

            <div className="max-h-[310px] overflow-y-auto space-y-3 pr-1">
              {recommendations.map((rec) => (
                <div
                  key={rec.product.id}
                  className="flex items-center justify-between gap-4 p-3 bg-black/40 hover:bg-[#1b1c20] border border-white/5 rounded-xl transition-all duration-150"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0 animate-pulse"></div>
                    <div>
                      <span className="text-sm font-semibold text-gray-200 block">{rec.product.nameAr}</span>
                      <span className="text-[11px] text-gray-400 leading-relaxed block">{rec.reason}</span>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-bold rounded-lg block">
                      {rec.qty} {rec.product.unitAr.split(" ")[0]} 
                    </span>
                    <span className="text-[10px] text-gray-500 block font-mono mt-1">
                      ≈ {(rec.product.priceSyp * rec.qty).toLocaleString("ar-SY")} ل.س
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Total Cost Bar */}
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-right">
              <span className="text-xs text-gray-500 block">التكلفة التقديرية للحزمة اللوجستية بالكامل:</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {totalCost.toLocaleString("ar-SY")} ل.س
              </span>
            </div>

            <button
              id="btn-apply-recommended"
              onClick={handleBulkAdd}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold rounded-xl shadow-xl shadow-amber-950/20 hover:shadow-amber-500/10 mt-1 sm:mt-0 transition-all duration-150 active:scale-95 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              أضف كامل التجهيزات الموصى بها للطلب
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
