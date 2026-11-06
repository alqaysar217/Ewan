'use client';

import { useState } from 'react';
import { ewanAiChat } from '@/ai/flows/ewan-ai-flow';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Send, Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col font-cairo" dir="rtl">
      <Header />
      <main className="flex-1 container mx-auto max-w-3xl py-12 px-4">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-black text-secondary flex items-center justify-center gap-3">
             <Bot className="w-8 h-8 text-primary" /> اختبار إيوان AI
          </h1>
          <p className="text-muted-foreground font-bold">اختبار استجابة Gemma 2 عبر OpenRouter بكفاءة عالية</p>
        </div>

        <Card className="rounded-[30px] border-none shadow-2xl overflow-hidden bg-white min-h-[500px] flex flex-col">
          <CardContent className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                <Sparkles className="w-16 h-16 mb-4" />
                <p className="font-black text-xl">ابدأ المحادثة للاختبار</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn(
                "flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2",
                m.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  m.role === 'user' ? "bg-secondary text-white" : "bg-primary text-white"
                )}>
                  {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className="space-y-3 max-w-[80%]">
                   <div className={cn(
                     "p-4 rounded-2xl font-medium text-sm leading-relaxed shadow-sm",
                     m.role === 'user' ? "bg-gray-100 text-secondary" : "bg-primary/5 text-secondary border border-primary/10"
                   )}>
                     {m.text}
                   </div>
                   {m.prompt && (
                     <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-2">
                        <p className="text-[10px] font-black text-amber-600 uppercase">البرومبت المقترح للصورة:</p>
                        <p className="text-xs font-mono text-amber-800 break-all">{m.prompt}</p>
                     </div>
                   )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3 text-muted-foreground animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs font-bold">إيوان AI يفكر... (قد يستغرق 30-60 ثانية)</span>
              </div>
            )}
          </CardContent>
          <div className="p-4 bg-gray-50 border-t flex gap-3">
             <Input 
               placeholder="اطلب تصميماً أو اسأل سؤالاً..." 
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
               className="h-14 rounded-xl border-none shadow-inner bg-white font-bold"
             />
             <Button onClick={handleSend} disabled={loading} className="h-14 w-14 rounded-xl bg-secondary hover:bg-primary transition-all">
                <Send className="w-5 h-5 rotate-180" />
             </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}