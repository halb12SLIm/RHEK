import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely (lazy load so missing key won't crash the server start)
let ai: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return ai;
}

// Global API endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Consultant API
app.post("/api/consultant", async (req, res) => {
  const { query, activeCart } = req.body;

  if (!query) {
    return res.status(400).json({ error: "الرجاء تقديم استفسار للبدء." });
  }

  const client = getGeminiClient();

  if (!client) {
    // Elegant fallback if no key is configured yet
    console.log("No GEMINI_API_KEY set, using rule-based local consultant mode.");
    
    // Simulate high-quality intelligent answers based on keywords
    let responseText = `أهلاً بك يا شريك النجاح! (وضع المحاكاة نشط - يرجى إدخال مفتاح GEMINI_API_KEY لتفعيل مستشار الذكاء الاصطناعي الكامل).
    
بناءً على طلبك، نوصي دائماً باقتناء **أكواب رحيق إكسبريس** ذات الجدار المزدوج العازل، لتقديم تجربة فاخرة لزبائنك في مسكنة ومنطقتنا الحبيبة.`;
    
    let recommendations: any[] = [];

    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("بارد") || lowerQuery.includes("عصير") || lowerQuery.includes("مشروب بارد") || lowerQuery.includes("ice") || lowerQuery.includes("ثلج")) {
      responseText += "\n\n💡 بما أنك ذكرت المشروبات الباردة، قمنا بإدراج *أكواب PET الشفافة* مع *أغطية الدوم المقببة* لتضمن حمايتها وجمالية تقديمها.";
      recommendations.push(
        { productId: "paper-cup-cold", qty: 2, reasonAr: "أكواب ورقية للمشروبات الباردة" },
        { productId: "plastic-cup-clear", qty: 3, reasonAr: "أكواب بلاستيكية PET الشفافة الممتازة" },
        { productId: "lid-dome", qty: 3, reasonAr: "أغطية دوم مقعرة متوافقة للتقديم الفاخر" }
      );
    } else if (lowerQuery.includes("قهوة") || lowerQuery.includes("ساخن") || lowerQuery.includes("اسبريسو") || lowerQuery.includes("كابتشينو") || lowerQuery.includes("hot")) {
      responseText += "\n\n💡 للمشروبات الساخنة والقهوة المختصة، نوصي بشدة بـ *الأكواب الورقية ذات الجدار المزدوج* (سعة 8oz و 12oz) مع أغلفتها المانعة للتسريب لحماية أيدي زبائنك.";
      recommendations.push(
        { productId: "paper-cup-hot", qty: 4, reasonAr: "أكواب ورقية ساخنة مع عزل حراري مضاعف" },
        { productId: "lid-sip", qty: 4, reasonAr: "أغطية أكواب ورقية ساخنة بفتحة شرب محكمة" },
        { productId: "stirrer-wooden", qty: 1, reasonAr: "عيدان تحريك خشبية صديقة للبيئة" }
      );
    } else {
      // Default general recommendation
      responseText += "\n\n💡 لبدء مقهاك أو مطعمك بأساس متكامل، نوصي بالحصول على باقة التجهيز الأساسية التي تحتوي على أكواب ورقية ساخنة، أغطية، أكياس كرافت وحوامل كرتونية ثنائية.";
      recommendations.push(
        { productId: "paper-cup-hot", qty: 2, reasonAr: "الباقة الأساسية للأكواب الساخنة" },
        { productId: "lid-sip", qty: 2, reasonAr: "أغطية للقهوة الساخنة" },
        { productId: "carrier-2cup", qty: 1, reasonAr: "حوامل كرتون للتوصيل" },
        { productId: "bag-kraft-medium", qty: 2, reasonAr: "أكياس كرافت مجهزة بمقابض" }
      );
    }

    responseText += `\n\nتفضل بزيارة مركزنا الرئيسي في **مسكنة - بازار الثلاثاء - طريق حلب الرقة** لمعاينة العينات المجانية ومناقشة تفاصيل الأسعار والكميات!`;

    return res.json({ text: responseText, recommendations });
  }

  try {
    const prompt = `أنت 'مستشار رحيق الذكي'، مستشار مبيعات كفء وودود للغاية يعمل لدى علامة 'رحيق إكسبريس' لمستلزمات وتجهيز المطاعم والكافيهات.
عنواننا هو: مسكنة - بازار الثلاثاء - طريق حلب الرقة. يرجى توجيه الزبون وتقديم النصائح اللوجستية له في مسكنة ومناطق ريف حلب والرقة بأسلوب محلي مهذب وأخوي وبنفس الوقت احترافي للغاية.

سأل الزبون هذا السؤال: "${query}"
سلة الطلبات الحالية للزبون (إذا كانت مهمة): ${JSON.stringify(activeCart || {})}

قوانين مهمة للرد:
1. يجب أن يكون الرد ودوداً للغاية ومهنياً وفيه ترحيب بأهل مسكنة والزبائن الكرام.
2. وجههم دائماً لزيارتنا في مقرنا: "مسكنة - بازار الثلاثاء - طريق حلب الرقة" للمعاينة.
3. اقترح عليهم المنتجات المفيدة من قائمتنا باستخدام السكيما الملحقة.
معرفات المنتجات المتوفرة لدينا فقط هي:
- 'paper-cup-hot': أكواب ورقية ساخنة فاخرة جدار ثنائي
- 'paper-cup-cold': أكواب ورقية للعصائر والمشروبات الباردة
- 'plastic-cup-clear': أكواب بلاستيكية PET شفافة للغاية لتقديم العصائر والميلك شيك
- 'lid-sip': أغطية أكواب ورقية ساخنة بفتحة شرب
- 'lid-dome': أغطية أكواب باردة مقعرة (دوم) بفتحة قشة
- 'stirrer-wooden': عيدان تحريك خشبية معالجة
- 'spoon-plastic': ملاعق بلاستيك متينة ثقيلة
- 'sugar-sachet': أصابع سكر أبيض وأسمر مغلف
- 'carrier-2cup': حامل أكواب كرتوني ثنائي
- 'carrier-4cup': حامل كرتون رباعي للأكواب
- 'bag-kraft-medium': أكياس كرافت ورقية بمقابض
- 'bag-plastic-delivery': أكياس بلاستيكية معززة للوجبات

قم بإرجاع إجابة مهيكلة تحتوي على:
1. الرد النصي الكامل (text) بلغة عربية رائعة بصيغة ماركداون (Markdown).
2. قائمة بالمنتجات الموصى بإضافتها للطلب ومبرر وجيز لعدد الكراتين المقترح.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "The main Arabic conversational advice in Markdown, welcoming them to Raheeq Express, detailing their supply recommendations, and encouraging a visit to Maskana, Tuesday Bazaar, Aleppo-Raqqa Road."
            },
            recommendations: {
              type: Type.ARRAY,
              description: "Array of specific recommended products from the predefined catalog to auto-suggest adding.",
              items: {
                type: Type.OBJECT,
                properties: {
                  productId: {
                    type: Type.STRING,
                    description: "Product ID from available choices."
                  },
                  qty: {
                    type: Type.INTEGER,
                    description: "Quantity of cartons or packs suggested."
                  },
                  reasonAr: {
                    type: Type.STRING,
                    description: "Why this quantity is suggested (in short conversational Arabic)."
                  }
                },
                required: ["productId", "qty", "reasonAr"]
              }
            }
          },
          required: ["text", "recommendations"]
        }
      }
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("No response from AI model.");
    }

    const data = JSON.parse(outputText.trim());
    return res.json(data);

  } catch (error: any) {
    console.error("Gemini Consultant Error: ", error);
    return res.status(500).json({
      error: "حدث خطأ أثناء معالجة طلبك بواسطة الذكاء الاصطناعي.",
      details: error.message
    });
  }
});


// Configure Vite Dev Server & Static Files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in Development Mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in Production Mode serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Raheeq Express Server is running on http://localhost:${PORT}`);
  });
}

startServer();
