'use server';
/**
 * @fileOverview Ewan AI Design Assistant Flow.
 * محرك الذكاء الاصطناعي لمنصة إيوان، يعتمد على نموذج Gemma 2 المتاح عبر OpenRouter.
 * تم تحسينه للعمل في بيئة Vercel مع معالجة أخطاء تفصيلية.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EwanAiChatInputSchema = z.object({
  message: z.string(),
  history: z.array(z.any()).optional(),
  imageDataUri: z.string().optional(),
  contextData: z.object({
    roomType: z.string().optional(),
    style: z.string().optional(),
    area: z.number().optional(),
    budget: z.string().optional(),
    products: z.array(z.string()).optional(),
  }).optional(),
});
export type EwanAiChatInput = z.infer<typeof EwanAiChatInputSchema>;

const EwanAiChatOutputSchema = z.object({
  text: z.string(),
  imagePrompt: z.string().optional(),
});
export type EwanAiChatOutput = z.infer<typeof EwanAiChatOutputSchema>;

/**
 * دالة استدعاء الذكاء الاصطناعي (Server Action)
 */
export async function ewanAiChat(input: EwanAiChatInput): Promise<EwanAiChatOutput> {
  try {
    console.log("Ewan AI: Starting request for message:", input.message);
    const result = await ewanAiChatFlow(input);
    return result;
  } catch (error: any) {
    console.error("CRITICAL: Ewan AI Server Action Crash:", error);
    return { 
      text: `⚠️ فشل الخادم في معالجة الطلب: ${error.message || 'خطأ غير معروف'}. يرجى التحقق من سجلات Vercel ومفتاح API.` 
    };
  }
}

const ewanAiChatFlow = ai.defineFlow(
  {
    name: 'ewanAiChatFlow',
    inputSchema: EwanAiChatInputSchema,
    outputSchema: EwanAiChatOutputSchema,
  },
  async (input) => {
    const { message, history, contextData } = input;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("Ewan AI: OPENROUTER_API_KEY is missing from environment variables.");
      return { text: "⚠️ مفتاح البرمجة (API Key) غير موجود في إعدادات Vercel. يرجى إضافته باسم OPENROUTER_API_KEY." };
    }

    const systemContent = `أنت "إيوان AI"، الخبير الذكي في التصميم الداخلي لمنصة إيوان اليمنية.
هويتك: خبير في دمج الطرازات المودرن مع اللمسات التراثية اليمنية.

قواعد الرد:
1. الرد بالعربية بأسلوب فقرات نظيفة. يمنع تماماً استخدام رموز مثل (***) أو (###) أو (---).
2. قم دائماً بإنشاء وصف تفصيلي بالإنجليزية في نهاية ردك بتنسيق: [PROMPT: نص البرومبت هنا].
3. اجعل البرومبت مخصصاً لمحركات الصور، يصف الغرفة بناءً على المساحة (${contextData?.area}m2) والنمط (${contextData?.style}).

بيانات الغرفة:
- النوع: ${contextData?.roomType || 'غير محدد'}
- المساحة: ${contextData?.area || 'غير محدد'} م²
- النمط: ${contextData?.style || 'غير محدد'}
- الميزانية: ${contextData?.budget || 'غير محدد'}`;

    const apiMessages: any[] = [
      { role: 'system', content: systemContent }
    ];

    if (history && Array.isArray(history)) {
      history.slice(-4).forEach(m => {
        apiMessages.push({ 
          role: m.role === 'user' ? 'user' : 'assistant', 
          content: typeof m.content === 'string' ? m.content : (m.text || "")
        });
      });
    }

    apiMessages.push({ role: 'user', content: message });

    try {
      // استخدام fetch بسيط مع إعدادات متوافقة مع Vercel
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'Ewan Furniture AI',
          'HTTP-Referer': 'https://ewan-furniture.vercel.app',
        },
        body: JSON.stringify({
          model: 'google/gemma-2-27b-it', 
          messages: apiMessages,
          temperature: 0.7,
        }),
        // عدم وضع timeout طويل هنا، نعتمد على مهلة Vercel
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        console.error("OpenRouter API Error Response:", errJson);
        throw new Error(errJson.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      let fullContent = data.choices?.[0]?.message?.content || "";
      
      let imagePrompt = "";
      const promptMatch = fullContent.match(/\[PROMPT: (.*?)\]/is);
      if (promptMatch) {
        imagePrompt = promptMatch[1].replace(/[\*#_~`>\|]/g, '').trim();
        fullContent = fullContent.replace(/\[PROMPT: (.*?)\]/is, "").trim();
      }

      const cleanText = fullContent.replace(/[\*#_~`>\|]/g, '').trim();
      console.log("Ewan AI: Request completed successfully.");
      
      return { text: cleanText, imagePrompt };
    } catch (error: any) {
      console.error("Ewan AI: Fetch Exception:", error.message);
      throw error; // سيتم التقاطه في ewanAiChat
    }
  }
);
