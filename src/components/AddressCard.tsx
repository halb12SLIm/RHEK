import React from "react";
import { MapPin, Phone, MessageSquare, Clock, Map, Navigation, Share2 } from "lucide-react";

export default function AddressCard() {
  const [copied, setCopied] = React.useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("مسكنة، بازار الثلاثاء، طريق حلب الرقة - شركة رحيق إكسبريس");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="address-location-section"
      className="bg-gradient-to-b from-[#16181d] to-[#0e0f11] border border-white/5 rounded-3xl p-6 md:p-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Text and Details */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            الموقع الجغرافي والفرع الرئيسي
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-100 leading-tight">
              تفضّل بزيارتنا في مقر <span className="text-[#c5a059]">رحيق إكسبريس</span> الرئيسي
            </h2>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              نوفر لشركاء النجاح وأصحاب المطاعم عينات مجانية بالكامل من الأكواب الورقية والبلاستيكية والعلب الكرتونية لمعاينتها والتأكد من جودتها وسماكتها قبل تأكيد الطلبيات الكبرى.
            </p>
          </div>

          <div className="space-y-4">
            {/* Main Address Bullet */}
            <div className="flex items-start gap-3.5 p-4 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block">العنوان الدقيق والتفصيلي:</span>
                <span className="text-base font-bold text-amber-400 leading-normal block mt-0.5">
                  مسكنة • بازار الثلاثاء • طريق حلب الرقة الدولي
                </span>
                <span className="text-[11px] text-gray-400 block mt-1">
                  (بجوار بازار الثلاثاء الشهير، مباشرة على الطريق السريع الرابط بين ريف حلب ومحافظة الرقة)
                </span>
              </div>
            </div>

            {/* Working Hours Bullet */}
            <div className="flex items-start gap-3.5 p-4 bg-black/20 border border-white/5 rounded-2xl">
              <div className="p-2.5 bg-white/5 border border-white/10 text-gray-400 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block">أوقات العمل واستقبال العملاء:</span>
                <span className="text-sm font-semibold text-gray-200 block mt-0.5">
                  يومياً من السبت إلى الخميس: 9:00 صباحاً - 8:00 مساءً
                </span>
                <span className="text-xs text-amber-200/70 block mt-1 font-medium">
                  💡 تنويه: يوم الثلاثاء هو يوم البازار الكبير بمسكنة، نتواجد طوال الـ 24 ساعة لخدمتكم بشكل استثنائي وتوفير كافة العينات اللوجستية!
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              id="btn-copy-address"
              onClick={handleCopyAddress}
              className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 text-xs font-bold text-gray-100 rounded-xl transition-all duration-150 flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              {copied ? "تم نسخ العنوان!" : "نسخ العنوان كأكواد وتوجيه"}
            </button>
            
            <a
              href="tel:+96390000000"
              className="px-5 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500 text-xs font-bold text-amber-400 rounded-xl transition-all duration-150 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              الاتصال بدعم المبيعات
            </a>
          </div>
        </div>

        {/* Right Side: High-End Custom SVG/CSS Simulated Interactive Map */}
        <div className="relative h-[360px] bg-black/40 border border-white/5 rounded-3xl overflow-hidden p-6 shadow-2xl flex flex-col justify-between">
          
          {/* Grid visual overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

          {/* Map details representation */}
          <div className="relative w-full h-full border border-amber-500/10 rounded-2xl bg-[#141519] overflow-hidden flex flex-col justify-between p-4">
            
            {/* Header map ribbon */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"></div>
                <span className="text-[10px] text-gray-300 font-mono font-bold uppercase tracking-wider">
                  Raheeq Hub Live Track
                </span>
              </div>
              
              <span className="text-[9px] text-[#c5a059] font-mono tracking-widest block bg-black/75 px-2 py-1 rounded">
                Mskna Main
              </span>
            </div>

            {/* Graphic representation of Aleppo - Raqqa Highway passing through Maskana next to Al-Assad Lake */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              
              {/* Assad Lake blue polygon representation */}
              <div className="absolute top-[20%] left-[8%] w-[180px] h-[100px] bg-sky-950/20 border border-sky-500/10 rounded-[50%] blur-[2px] rotate-[20deg] flex items-center justify-center">
                <span className="text-[10px] text-sky-400/40 font-bold block rotate-[-20deg]">بحيرة الأسد</span>
              </div>

              {/* The Highway lines */}
              {/* Aleppo Road */}
              <div className="absolute right-0 top-[35%] w-[110px] h-0 md:h-[2px] bg-gradient-to-l from-gray-700 to-amber-500/80 -rotate-[15deg]">
                <span className="absolute -top-4 right-2 text-[9px] text-gray-500">طريق حلب</span>
              </div>
              {/* Joint Hub Point */}
              <div className="absolute left-[38%] top-[20%] w-[130px] h-[110px] border-t-2 border-l-2 border-dashed border-amber-500/30 rounded-tl-[80px]"></div>

              {/* Maskana Main Hub */}
              <div className="relative z-20 flex flex-col items-center">
                {/* Glow ring */}
                <div className="absolute w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-full animate-ping"></div>
                
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-950/50 border border-amber-400/30 transform hover:scale-115 transition-transform duration-300 cursor-pointer">
                  <MapPin className="w-7 h-7 text-gray-950 animate-bounce" />
                </div>
                
                <span className="mt-2 text-xs font-black text-amber-400 bg-black/90 px-3 py-1 rounded-xl border border-amber-500/20 shadow-lg text-center leading-normal">
                  فرع مسكنة - بازار الثلاثاء
                </span>
              </div>

              {/* Raqqa Road */}
              <div className="absolute left-0 bottom-[25%] w-[100px] h-[2px] bg-gradient-to-r from-gray-700 to-amber-500/80 -rotate-[10deg]">
                <span className="absolute -bottom-4 left-2 text-[9px] text-gray-500">طريق الرقة</span>
              </div>

              {/* Secondary roads decoration */}
              <div className="absolute bottom-5 right-[15%] text-[9px] text-amber-500/50 flex flex-col items-center text-center">
                <Map className="w-4 h-4 mb-1" />
                سوق ثلاثاء مسكنة
              </div>

            </div>

            {/* Footer coordinates indicator */}
            <div className="flex items-center justify-between z-10 mt-auto bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/5">
              <span className="text-[9px] text-gray-400 font-mono">
                Lat: 35.7275° N, Lon: 38.0289° E
              </span>
              <span className="text-[9px] text-emerald-400 font-mono font-bold">
                ● جاهز لاستقبالكم
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
