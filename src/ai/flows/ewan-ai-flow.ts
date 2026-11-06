'use server';
/**
 * @fileOverview Ewan AI Design Assistant Flow.
 * محرك الذكاء الاصطناعي لمنصة إيوان، يعتمد على نموذج Gemma 2 المتاح عبر OpenRouter.
 * تم تحسينه للعمل في بيئة Vercel مع معالجة أخطاء تفصيلية وتوفير مخرجات عربية نقية.
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
    console.log("Ewan AI: Request received for:", input.message);
    const result = await ewanAiChatFlow(input);
    return result;
  } catch (error: any) {
    console.error("CRITICAL: Ewan AI Server Action Crash:", error);
    return { 
      text: `⚠️ فشل الخادم في معالجة الطلب: ${error.message || 'خطأ غير معروف'}. يرجى التحقق من متغيرات البيئة ورصيد OpenRouter.` 
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
      console.error("Ewan AI: API KEY MISSING");
      return { text: "⚠️ مفتاح البرمجة (OPENROUTER_API_KEY) غير موجود في إعدادات النشر." };
    }

    const systemContent = `أنت "إيوان AI"، الخبير الذكي في التصميم الداخلي لمنصة إيوان اليمنية.
هويتك: خبير في دمج الطرازات المودرن مع اللمسات التراثية اليمنية العريقة.

قواعد الرد:
1. الرد باللغة العربية بأسلوب فقرات واضحة ومهنية. يمنع تماماً استخدام رموز التنسيق مثل (***) أو (###) أو (---).
2. قدم نصائح عملية بناءً على المساحة (${contextData?.area}m2) والنمط (${contextData?.style}).
3. في نهاية الرد، قم دائماً بإنشاء وصف تفصيلي بالإنجليزية مخصص لمحركات الصور بتنسيق: [PROMPT: نص البرومبت هنا].

بيانات الغرفة الحالية:
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
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
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

      // تنظيف النص من أي رموز ماركداون زائدة لضمان عرض نظيف
      const cleanText = fullContent.replace(/[\*#_~`>\|]/g, '').trim();
      
      return { text: cleanText, imagePrompt };
    } catch (error: any) {
      console.error("Ewan AI Fetch Exception:", error.message);
      throw error;
    }
  }
);