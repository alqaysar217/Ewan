'use client';

import { useState } from 'react';
import { ewanAiChat } from '@/ai/flows/ewan-ai-flow';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Send, Bot, User, Sparkles, Copy, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

// تفعيل زيادة مهلة التنفيذ لـ Vercel Next.js 15
export const maxDuration = 60;

export default function AITestPage() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string, prompt?: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const result = await ewanAiChat({
        message: userMsg,
        history: messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))
      });

      setMessages(prev => [...prev, { role: 'ai', text: result.text, prompt: result.imagePrompt }]);
    } catch (error: any) {
      console.error("AI Test Client Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: `⚠️ حدث خطأ في الاتصال بالذكاء الاصطناعي: ${error.message || 'فشل غير متوقع'}. تأكد من إعدادات Vercel ورصيد OpenRouter.` }]);
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "تم نسخ البرومبت" });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col font-cairo" dir="rtl">
      <Header />
      <main className="flex-1 container mx-auto max-w-4xl py-12 px-4">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-black text-secondary flex items-center justify-center gap-3">
             <Bot className="w-10 h-10 text-primary" /> مختبر إيوان AI
          </h1>
          <p className="text-muted-foreground font-bold">اختبار استجابة Gemma 2 عبر OpenRouter بكفاءة عالية</p>
        </div>

        <Card className="rounded-[32px] border-none shadow-2xl overflow-hidden bg-white min-h-[600px] flex flex-col border border-border/40">
          <CardContent className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-24">
                <Sparkles className="w-20 h-20 mb-6" />
                <p className="font-black text-2xl">أهلاً بك، اسأل المصمم الذكي عن أي شيء يخص أثاثك</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn(
                "flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2",
                m.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                  m.role === 'user' ? "bg-secondary text-white" : "bg-primary text-white"
                )}>
                  {m.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                </div>
                <div className="space-y-4 max-w-[85%]">
                   <div className={cn(
                     "p-5 md:p-6 rounded-3xl font-medium text-base md:text-lg leading-relaxed shadow-sm",
                     m.role === 'user' ? "bg-[#F4F6F5] text-secondary" : "bg-primary/5 text-secondary border border-primary/10"
                   )}>
                     {m.text}
                   </div>
                   {m.prompt && (
                     <div className="p-6 bg-secondary text-white rounded-2xl space-y-3 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                           <p className="text-[10px] font-black text-primary uppercase tracking-widest">Image Generation Prompt:</p>
                           <Button variant="ghost" size="sm" onClick={() => copyPrompt(m.prompt!)} className="h-8 text-white text-[10px] font-black gap-2 hover:bg-white/10">
                              <Copy className="w-3.5 h-3.5" /> نسخ البرومبت
                           </Button>
                        </div>
                        <p className="text-xs md:text-sm font-mono opacity-80 break-words italic">{m.prompt}</p>
                     </div>
                   )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-4 text-muted-foreground animate-pulse bg-primary/5 p-4 rounded-2xl w-fit">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-sm font-black">إيوان AI يقوم بالتحليل الآن... (قد يستغرق 30 ثانية)</span>
              </div>
            )}
          </CardContent>
          <div className="p-6 bg-gray-50 border-t flex gap-4">
             <Input 
               placeholder="اطلب نصيحة تصميم، مثلاً: كيف أرتب غرفة معيشة صغيرة بنمط مودرن؟" 
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
               className="h-16 rounded-2xl border-none shadow-inner bg-white font-bold text-lg px-6"
             />
             <Button onClick={handleSend} disabled={loading} className="h-16 w-16 rounded-2xl bg-secondary hover:bg-primary transition-all shadow-xl shadow-secondary/20">
                <Send className="w-6 h-6 rotate-180" />
             </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
