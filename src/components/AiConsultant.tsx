import React from "react";
import { Product, ConsultantMessage } from "../types";
import { MessageSquare, Send, Sparkles, User, Bot, Plus, Check, Trash2, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AiConsultantProps {
  products: Product[];
  onAddRecommendedItems: (items: { product: Product; quantity: number; selectedSize: string }[]) => void;
}

const QUICK_PROMPTS = [
  "أريد تجهيز مشروع مقهى جديد بالكامل للمشروبات الباردة والساخنة، بم ماذا تنصحني؟",
  "ما الفرق بين الكرافت الثنائي والأكواب الورقية العادية من حيث عزل الحرارة؟",
  "أبيع حوالي 200 كوب قهوة ساخنة و 100 عصير بارد يومياً، احسب مخصصات شهري."
];

export default function AiConsultant({ products, onAddRecommendedItems }: AiConsultantProps) {
  const [messages, setMessages] = React.useState<ConsultantMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `أهلاً وسهلاً بك يا شريك نجاحنا! 🌸 أنا **مُستشار رحيق الرائد الذكي** للتعبئة والتغليف.

يسعدني خدمتك اليوم من فرعنا الرئيسي في **مسكنة - بازار الثلاثاء - طريق حلب الرقة**. 

تستطيع هنا اختصار الوقت ومناقشتي في جميع احتياجات مقهاك أو مطعمك، وسأقوم باحتساب كميات الأكواب والعلب المناسبة لك وتجهيز كرتونة عيناتك لمعاينتها. **أخبرني عن طبيعة مشروعك أو مبيعاتك اليومية لتبدأ الاقتراحات الفورية!**`,
      timestamp: new Date().toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsgId = `msg-${Date.now()}`;
    const userMessage: ConsultantMessage = {
      id: userMsgId,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          activeCart: {}
        }),
      });

      if (!response.ok) {
        throw new Error("فشل الاتصال بخادم مستشار رحيق الذكي.");
      }

      const data = await response.json();

      const assistantMsg: ConsultantMessage = {
        id: `msg-ai-${Date.now()}`,
        role: "assistant",
        content: data.text || "عذراً، لم أستطع صياغة رد مناسب حالياً.",
        recommendations: data.recommendations || [],
        timestamp: new Date().toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: ConsultantMessage = {
        id: `msg-err-${Date.now()}`,
        role: "assistant",
        content: `⚠️ عذراً يا شريكنا، يبدو أن هناك ضغطاً مؤقتاً على خوادم الاستشارة الذكية.
        
يمكنك تفقد مفتاح الـ **GEMINI_API_KEY** في واجهة الإعدادات بموقعك، أو الاستمرار بتصفح المنتجات يدوياً وإضافتها لسلة عينات التسعير.`,
        timestamp: new Date().toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("هل ترغب في إعادة ضبط الاستشارة ومسح سجل المحادثة الحالي؟")) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `أهلاً وسهلاً بك مجدداً يا شريك نجاحنا! 🌸 أنا **مُستشار رحيق الرائد الذكي** للتعبئة والتغليف.

يسعدني خدمتك مجدداً من فرعنا في **مسكنة - بازار الثلاثاء - طريق حلب الرقة**. أخبرني بأي احتياجات لوجستية لمقهى أو مطعم وسنقوم بالاحتساب الدقيق لك!`,
          timestamp: new Date().toLocaleTimeString("ar-SY", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }
  };

  const handleApplyRecommendationSet = (recList: any[]) => {
    const itemsToAdd = recList.map((rec) => {
      const liveProduct = products.find((p) => p.id === rec.productId);
      if (liveProduct) {
        return {
          product: liveProduct,
          quantity: rec.qty || 1,
          selectedSize: liveProduct.sizes && liveProduct.sizes.length > 0 ? liveProduct.sizes[0] : ""
        };
      }
      return null;
    }).filter(Boolean) as { product: Product; quantity: number; selectedSize: string }[];

    if (itemsToAdd.length > 0) {
      onAddRecommendedItems(itemsToAdd);
      alert("🎉 تمت إضافة المنتجات المقترحة بنجاح إلى عرض أسعارك!");
    }
  };

  return (
    <div
      id="ai-consultant-section"
      className="bg-[#121316] border border-amber-500/10 rounded-3xl overflow-hidden flex flex-col h-[640px]"
    >
      {/* Consultant Header */}
      <div className="bg-gradient-to-r from-[#1c1e22] to-[#121316] border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-100 flex items-center gap-1.5">
              مُستشار رحيق الرّقمي الذَّكي
              <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">GEMINI PRO</span>
            </h3>
            <span className="text-[10px] text-gray-400 font-sans block">
              خبير تجهيز وتحديد كميات مستلزمات الكافيهات بمسكنة
            </span>
          </div>
        </div>

        <button
          id="btn-clear-chat"
          onClick={clearChat}
          className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-red-400 transition-colors duration-150"
          title="إعادة ضبط المحادثة"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-black/15 scrollbar-thin scrollbar-thumb-white/5"
      >
        {messages.map((msg) => {
          const isAi = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 md:gap-4 max-w-[85%] md:max-w-[75%] ${
                isAi ? "mr-0 ml-auto" : "ml-0 mr-auto flex-row-reverse"
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${
                  isAi
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    : "bg-white/5 border-white/10 text-gray-300"
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Chat Message Box */}
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-2xl leading-relaxed text-sm ${
                    isAi
                      ? "bg-[#18191d] border border-white/5 text-gray-200 rounded-tr-none"
                      : "bg-[#252018] border border-amber-500/10 text-gray-100 rounded-tl-none font-medium"
                  }`}
                >
                  <div className="markdown-body prose prose-invert max-w-none text-right">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  <span className="text-[9px] text-gray-500 block font-mono mt-2 text-left">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Recommendations UI directly injected after AI responses with recommended products array */}
                {isAi && msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 space-y-3 mt-1.5">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 border-b border-amber-500/10 pb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      المنتجات الموصى بإضافتها لطلب التسعير الخاص بك:
                    </span>

                    <div className="space-y-2">
                      {msg.recommendations.map((rec, index) => {
                        const productDetails = products.find((p) => p.id === rec.productId);
                        return (
                          <div key={index} className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5 text-xs">
                            <div>
                              <span className="font-semibold text-gray-200 block">
                                {productDetails ? productDetails.nameAr : rec.productId}
                              </span>
                              <span className="text-[10px] text-gray-400 leading-normal block">
                                {rec.reasonAr}
                              </span>
                            </div>
                            <span className="font-mono text-amber-300 font-bold bg-amber-500/5 border border-amber-500/10 px-2 py-1 rounded">
                              {rec.qty} {productDetails ? productDetails.unitAr.split(" ")[0] : "وحدة"}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      id={`btn-apply-rec-${msg.id}`}
                      onClick={() => handleApplyRecommendationSet(msg.recommendations!)}
                      className="w-full mt-2 py-2 px-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer"
                    >
                      أضف كامل مخصصات المستشار لعرض الأسعار
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-4 max-w-[70%] mr-0 ml-auto">
            <div className="w-8 h-8 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#18191d] border border-white/5 p-4 rounded-2xl rounded-tr-none text-xs text-gray-400 flex items-center gap-1.5">
              <span>جاري صياغة الاستشارة الذكية من مقر مسكنة...</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-200"></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-300"></span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompt Chips Container */}
      <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((promptText, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(promptText)}
            className="text-[11px] text-gray-400 hover:text-amber-200 bg-white/5 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/20 px-3 py-1.5 rounded-full transition-all duration-150 text-right cursor-pointer"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Chat Input Field Container */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-4 bg-gradient-to-t from-black to-[#121316] border-t border-white/5 flex gap-3.5"
      >
        <input
          id="input-consultant-query"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="اكتب استفسارك هنا (مثال: أريد كراتين وباقات تكفي كافيه صغير)..."
          className="flex-1 bg-[#18191d] border border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-amber-400 placeholder-gray-500 transition-all duration-150 text-right"
        />
        <button
          id="btn-send-consultant-query"
          type="submit"
          disabled={!inputValue.trim() || loading}
          className="p-3.5 bg-amber-500 hover:bg-amber-400 rounded-2xl text-gray-950 font-bold transition-all duration-150 active:scale-95 disabled:opacity-30 flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4 rotate-180" />
        </button>
      </form>
    </div>
  );
}
