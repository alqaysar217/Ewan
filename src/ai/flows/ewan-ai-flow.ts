'use server';
/**
 * @fileOverview Ewan AI Design Assistant Flow.
 * محرك الذكاء الاصطناعي لمنصة إيوان، يعتمد على نموذج Gemma 2 المتاح عبر OpenRouter.
 * تم تحسينه للعمل في بيئة Vercel مع معالجة أخطاء تفصيلية وتنظيف شامل للمخرجات.
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
 * يتم تصدير الدوال غير المتزامنة فقط هنا لضمان توافق Next.js 15
 */
export async function ewanAiChat(input: EwanAiChatInput): Promise<EwanAiChatOutput> {
  try {
    console.log("Ewan AI: Starting production request...");
    return await ewanAiChatFlow(input);
  } catch (error: any) {
    console.error("CRITICAL: Ewan AI Server Action Crash:", error);
    return { 
      text: `⚠️ فشل في معالجة الطلب: ${error.message || 'خطأ غير معروف'}. يرجى التحقق من رصيد OpenRouter ومفتاح API في Vercel.` 
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
      return { text: "⚠️ مفتاح OPENROUTER_API_KEY غير موجود في إعدادات Vercel. يرجى إضافته وإعادة النشر (Redeploy)." };
    }

    // بناء سياق النظام بلهجة خبير تصميم وبدون رموز تنسيق
    const systemContent = `You are "Ewan AI", a high-end interior design expert for the Yemeni platform "Ewan". 
Your task is to provide design recommendations in clear, clean Arabic paragraphs. 

STRICT RULES:
1. RESPONSE IN ARABIC ONLY (except for the prompt).
2. DO NOT use markdown symbols like (***, ###, ---, ||, __, ++). Keep the text plain and elegant.
3. At the very end of your response, provide a highly detailed English Image Prompt for an AI image generator (like Midjourney/Flux).
4. Format the prompt EXACTLY as: [PROMPT: Your detailed English text here].
5. The prompt must describe the room using the provided data: Area (${contextData?.area}m2), Style (${contextData?.style}), and Budget (${contextData?.budget}).

Context:
- Room Type: ${contextData?.roomType || 'Living Room'}
- Style: ${contextData?.style || 'Modern'}
- Area: ${contextData?.area || '20'} m2
- Budget: ${contextData?.budget || 'Not specified'}`;

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
          'X-Title': 'Ewan AI Studio',
          'HTTP-Referer': 'https://ewan-furniture.vercel.app',
        },
        body: JSON.stringify({
          model: 'google/gemma-2-27b-it', 
          messages: apiMessages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      let rawContent = data.choices?.[0]?.message?.content || "";
      
      // استخراج البرومبت الإنجليزي
      let imagePrompt = "";
      const promptMatch = rawContent.match(/\[PROMPT: (.*?)\]/is);
      if (promptMatch) {
        imagePrompt = promptMatch[1].replace(/[\*#_~`>\|]/g, '').trim();
        rawContent = rawContent.replace(/\[PROMPT: (.*?)\]/is, "").trim();
      }

      // تنظيف النص العربي من كافة الرموز المزعجة
      const cleanText = rawContent
        .replace(/[\*#_~`>\|]/g, '') // إزالة الرموز
        .replace(/\n{3,}/g, '\n\n') // إزالة المسافات الزائدة جداً
        .trim();

      return { text: cleanText, imagePrompt };
    } catch (error: any) {
      throw error;
    }
  }
);