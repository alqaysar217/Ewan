'use server';
/**
 * @fileOverview Ewan AI Design Assistant Flow.
 * محرك الذكاء الاصطناعي لمنصة إيوان، يعتمد على نموذج Gemma 2 المتاح مجاناً عبر OpenRouter.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EwanAiChatInputSchema = z.object({
  message: z.string(),
  history: z.array(z.any()).optional(),
  imageDataUri: z.string().optional().describe("صورة الغرفة (للتوثيق، النموذج يعتمد حالياً على الوصف النصي)"),
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
- خبير في دمج الطرازات العالمية (مودرن، كلاسيك) مع اللمسات التراثية اليمنية العريقة.
- وظيفتك تحليل مساحات العملاء وتقديم نصائح احترافية لتوزيع الأثاث.

قواعد الرد:
1. الهوية اليمنية: شجع دائماً على استخدام قطع الأثاث الوطنية والنجارين المحليين مع لمسات تراثية (صنعاني، حضرمي).
2. توليد البرومبت (Prompt): قم دائماً بإنشاء وصف تفصيلي باللغة الإنجليزية في نهاية ردك بتنسيق: [PROMPT: وصف الصورة بالإنجليزية هنا]. اجعل الوصف احترافياً لبرامج توليد الصور.
3. التفاعل: كن ودوداً وملهماً وقدم حلولاً عملية للمساحة المحددة.

بيانات الغرفة الحالية للتحليل:
- النوع: ${contextData?.roomType || 'غير محدد'}
- المساحة: ${contextData?.area || 'غير محدد'} م²
- النمط المفضل: ${contextData?.style || 'غير محدد'}
- الميزانية المتوقعة: ${contextData?.budget || 'غير محدد'} ر.ي`;

    const apiMessages: any[] = [
      { role: 'system', content: systemContent }
    ];

    if (history && Array.isArray(history)) {
      history.slice(-6).forEach(m => {
        apiMessages.push({ 
          role: m.role === 'user' ? 'user' : 'assistant', 
          content: typeof m.content === 'string' ? m.content : (m.text || "")
        });
      });
    }

    // إرسال الرسالة كنص فقط لضمان التوافق مع Gemma 2
    apiMessages.push({ role: 'user', content: message });

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'Ewan Furniture AI',
        },
        body: JSON.stringify({
          model: 'google/gemma-2-27b-it', 
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      const data = await response.json();
      const fullText = data.choices?.[0]?.message?.content || "";
      
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