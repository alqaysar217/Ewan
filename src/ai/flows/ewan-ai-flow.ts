'use server';
/**
 * @fileOverview Ewan AI Design Assistant Flow.
 * محرك الذكاء الاصطناعي لمنصة إيوان، يعتمد على نموذج Gemma 2 المتاح مجاناً عبر OpenRouter.
 * تم تحسينه لتوليد نصوص نظيفة وبرومبت إنجليزي دقيق وتفصيلي مع معالجة أخطاء متقدمة.
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
    console.error("Ewan AI Flow Server Error:", error);
    // إرجاع رسالة خطأ واضحة في حال فشل الـ Flow نفسه لمساعدة المستخدم في Debugging
    return { text: `⚠️ حدث خطأ في الخادم (Vercel) أثناء المعالجة: ${error.message || 'فشل غير متوقع'}. تأكد من إضافة OPENROUTER_API_KEY في الإعدادات.` };
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
      return { text: "⚠️ عذراً، لم يتم العثور على مفتاح OPENROUTER_API_KEY في إعدادات Vercel. يرجى إضافته في (Environment Variables) ثم الضغط على Redeploy ليعمل النظام." };
    }

    const systemContent = `أنت "إيوان AI"، الخبير الذكي الرائد في التصميم الداخلي وتنسيق الأثاث لمنصة إيوان اليمنية.

هويتك:
- خبير في دمج الطرازات العالمية (مودرن، كلاسيك) مع اللمسات التراثية اليمنية العريقة.
- وظيفتك تحليل مساحات العملاء وتقديم نصائح احترافية لتوزيع الأثاث بناءً على معطيات دقيقة.

قواعد الرد الصارمة:
1. اللغة والتنسيق: الرد النصي بالعربية، يجب أن يكون بأسلوب فقرات واضحة ومرتبة. يمنع منعاً باتاً استخدام أي رموز تنسيق مثل النجوم (***) أو المربعات (###) أو الخطوط (---) أو الأشرطة (||). نريد نصاً نقياً فقط.
2. الهوية اليمنية: شجع دائماً على استخدام قطع الأثاث الوطنية والنجارين المحليين مع لمسات تراثية (صنعاني، حضرمي).
3. توليد البرومبت (Prompt): قم دائماً بإنشاء وصف تفصيلي واحترافي باللغة الإنجليزية في نهاية ردك بتنسيق: [PROMPT: نص البرومبت هنا].
   - يجب أن يكون البرومبت مفصلاً لمحركات توليد الصور (مثل Midjourney أو Stable Diffusion).
   - يجب أن يصف تحويل الغرفة بناءً على "الصورة الأصلية المرفقة كمرجع" (Referencing the uploaded photo), مع دمج النمط المختار (${contextData?.style}), والمساحة (${contextData?.area}m2), والميزانية، وتنسيق الألوان المناسب، مع قطع الأثاث المحددة.
   - اجعل الوصف سينمائياً وبجودة 8K، مع ذكر الإضاءة والخامات.

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

    apiMessages.push({ role: 'user', content: message });

    try {
      // إعداد طلب الـ Fetch مع مهلة زمنية (Abort Controller)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000); // 55 ثانية مهلة

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'Ewan Furniture AI',
          'HTTP-Referer': 'https://ewan-furniture.vercel.app', // الرابط المرجعي لـ OpenRouter
        },
        body: JSON.stringify({
          model: 'google/gemma-2-27b-it', 
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 2000
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("OpenRouter API Detailed Error:", errData);
        const detail = errData.error?.message || response.statusText;
        return { text: `⚠️ خطأ من مزود الخدمة (OpenRouter): ${detail}. يرجى التأكد من أن الرصيد كافٍ وأن المفتاح فعال.` };
      }

      const data = await response.json();
      let fullContent = data.choices?.[0]?.message?.content || "";
      
      // استخراج البرومبت وتنظيف النص
      let imagePrompt = "";
      const promptMatch = fullContent.match(/\[PROMPT: (.*?)\]/is);
      if (promptMatch) {
        imagePrompt = promptMatch[1].replace(/[\*#_~`>\|]/g, '').trim();
        fullContent = fullContent.replace(/\[PROMPT: (.*?)\]/is, "").trim();
      }

      // تنظيف النص النهائي من أي رموز تنسيق متبقية لضمان مظهر احترافي
      const cleanText = fullContent.replace(/[\*#_~`>\|]/g, '').trim();

      return { text: cleanText, imagePrompt };
    } catch (error: any) {
      console.error("AI Fetch Exception:", error);
      if (error.name === 'AbortError') {
        return { text: "⚠️ انتهت مهلة الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى، قد يكون الضغط عالياً على النموذج حالياً." };
      }
      return { text: `⚠️ فشل الاتصال بالنموذج: ${error.message || 'مشكلة في الشبكة'}. يرجى التأكد من استقرار الإنترنت على الخادم.` };
    }
  }
);
