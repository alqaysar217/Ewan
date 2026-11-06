'use server';
/**
 * @fileOverview Ewan AI Design Assistant Flow.
 * محرك الذكاء الاصطناعي لمنصة إيوان، متخصص في تحليل المساحات وتوليد أوصاف التصميم الداخلي.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EwanAiChatInputSchema = z.object({
  message: z.string(),
  history: z.array(z.any()).optional(),
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
  imagePrompt: z.string().optional(), // برومبت مقترح لتوليد صورة في حال كان الطلب تصميم
});
export type EwanAiChatOutput = z.infer<typeof EwanAiChatOutputSchema>;

export async function ewanAiChat(input: EwanAiChatInput): Promise<EwanAiChatOutput> {
  try {
    return await ewanAiChatFlow(input);
  } catch (error: any) {
    console.error("Ewan AI Flow Error:", error);
    return { text: "❌ أعتذر، واجهت مشكلة في الاتصال بمركز التصميم الذكي حالياً." };
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
      return { text: "⚠️ عذراً، مفتاح تشغيل الذكاء الاصطناعي (API Key) غير موجود في الإعدادات." };
    }

    const systemContent = `أنت "إيوان AI"، الخبير الذكي الرائد في التصميم الداخلي وتنسيق الأثاث لمنصة إيوان اليمنية.

هويتك:
- اسمك "إيوان AI".
- أنت خبير في دمج الطرازات العالمية (مودرن، كلاسيك) مع اللمسات التراثية اليمنية (صنعاني، حضرمي).
- هدفك هو مساعدة العملاء على تخيل مساحاتهم واختيار الأثاث الأنسب لميزانياتهم.

قواعد الرد:
1. إذا طلب العميل تصميم غرفة: قم بتحليل البيانات (المساحة: ${contextData?.area || 'غير محددة'}، النمط: ${contextData?.style || 'غير محدد'}) ثم اقترح توزيعاً احترافياً.
2. توليد البرومبت (Prompt): إذا كان السياق يتطلب تصميم صورة، قم بإنشاء وصف تفصيلي باللغة الإنجليزية في نهاية ردك بتنسيق: [PROMPT: وصف الصورة بالإنجليزية هنا].
3. كن ودوداً، مهنياً، واستخدم مصطلحات تعكس الفخامة والجودة.
4. شجع دائماً على الصناعة الوطنية والنجارين اليمنيين المعتمدين في المنصة.

بيانات الغرفة الحالية (إذا توفرت):
- النوع: ${contextData?.roomType || 'غير محدد'}
- المساحة: ${contextData?.area || 'غير محدد'} م²
- الميزانية المتوقعة: ${contextData?.budget || 'غير محدد'} ريال يمني
- قطع الأثاث المختارة: ${contextData?.products?.join(', ') || 'لا توجد قطع محددة بعد'}`;

    const apiMessages: any[] = [
      { role: 'system', content: systemContent }
    ];

    if (history && Array.isArray(history)) {
      history.slice(-10).forEach(m => {
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
          'HTTP-Referer': 'https://ewan.ye', // اختياري لـ OpenRouter
          'X-Title': 'Ewan Furniture AI',
        },
        body: JSON.stringify({
          model: 'google/gemma-2-27b-it',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      const data = await response.json();
      const fullText = data.choices?.[0]?.message?.content || "";
      
      // استخراج البرومبت إذا وجد
      let text = fullText;
      let imagePrompt = "";
      const promptMatch = fullText.match(/\[PROMPT: (.*?)\]/i);
      if (promptMatch) {
        imagePrompt = promptMatch[1];
        text = fullText.replace(/\[PROMPT: (.*?)\]/i, "").trim();
      }

      return { text, imagePrompt };
    } catch (error: any) {
      return { text: "🌐 عذراً، واجهت صعوبة في معالجة طلبك، تأكد من اتصال الإنترنت." };
    }
  }
);
