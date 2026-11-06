'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Zap, 
  Palette, 
  Wallet, 
  Ruler, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft, 
  ArrowRight,
  Info,
  Home,
  ShoppingBag,
  Camera,
  Layers,
  ImageIcon,
  Check,
  Box,
  Bot,
  FileText,
  Quote,
  RefreshCcw,
  Copy,
  ClipboardCheck,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ewanAiChat } from '@/ai/flows/ewan-ai-flow';
import { Badge } from '@/components/ui/badge';

// تفعيل زيادة مهلة التنفيذ لـ Vercel Next.js 15
export const maxDuration = 60;

const ROOM_TYPES = [
  { id: 'living', name: 'غرفة معيشة', icon: Home },
  { id: 'bedroom', name: 'غرفة نوم', icon: Layers },
  { id: 'kitchen', name: 'مطبخ', icon: LayoutGrid },
  { id: 'majlis', name: 'مجلس عربي', icon: Palette },
  { id: 'office', name: 'مكتب منزلي', icon: Ruler }
];

const DESIGN_STYLES = [
  { id: 'modern', name: 'مودرن حديث', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400' },
  { id: 'classic', name: 'كلاسيك فاخر', img: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=400' },
  { id: 'minimalist', name: 'بسيط / مينيمال', img: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=400' },
  { id: 'traditional', name: 'تراثي مطور', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400' }
];

const compressImage = (base64Str: string, maxWidth = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        const maxHeight = 800;
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
  });
};

export default function AIDesignStudio() {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [aiResult, setAiResult] = useState<{text: string, prompt?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const totalSteps = 6;
  const { user } = useUser();
  const db = useFirestore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<string>('living');
  const [selectedStyle, setSelectedStyle] = useState<string>('modern');
  const [selectionMode, setSelectionMode] = useState<'auto' | 'manual'>('auto');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState({ min: '100000', max: '500000' });
  const [roomArea, setRoomArea] = useState<string>('20');

  const productsColl = useMemo(() => collection(db, 'products'), [db]);
  const { data: allProducts } = useCollection(productsColl);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setOriginalImage(compressed);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: "تم النسخ بنجاح" });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1 && !originalImage) {
      toast({ variant: "destructive", title: "تنبيه", description: "يرجى رفع صورة للغرفة أولاً." });
      return;
    }
    if (step === 4 && selectionMode === 'auto') {
      setStep(6);
    } else {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    if (step === 6 && selectionMode === 'auto') {
      setStep(4);
    } else {
      setStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleSubmitRequest = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const aiResponse = await ewanAiChat({
        message: `قم بتحليل وتصميم مساحة لغرفة من نوع ${ROOM_TYPES.find(t => t.id === roomType)?.name} بمساحة ${roomArea}م² ونمط ${DESIGN_STYLES.find(s => s.id === selectedStyle)?.name}.`,
        imageDataUri: originalImage || undefined,
        contextData: {
          roomType,
          style: selectedStyle,
          area: Number(roomArea),
          budget: `${budgetRange.min} - ${budgetRange.max}`,
          products: selectedProductIds
        }
      });

      if (aiResponse.text.includes("❌") || aiResponse.text.includes("⚠️")) {
        throw new Error(aiResponse.text);
      }

      setAiResult({ text: aiResponse.text, prompt: aiResponse.imagePrompt });

      const requestData = {
        user_id: user?.uid || 'guest',
        original_image_url: originalImage,
        room_type: roomType,
        selected_style: selectedStyle,
        selection_mode: selectionMode,
        selected_products: selectedProductIds,
        budget_min: Number(budgetRange.min),
        budget_max: Number(budgetRange.max),
        room_area: Number(roomArea),
        status: 'completed',
        ai_recommendation: aiResponse.text,
        generated_image_prompt: aiResponse.imagePrompt,
        created_at: serverTimestamp()
      };

      await addDoc(collection(db, 'ai_design_requests'), requestData);
      setStep(7);
      toast({ title: "اكتمل تحليل التصميم!" });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "انتهت مهلة الطلب، يرجى المحاولة لاحقاً.");
      toast({ 
        variant: "destructive", 
        title: "فشل المعالجة", 
        description: "تعذر الحصول على رد من الخبير الذكي حالياً." 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setOriginalImage(null);
    setAiResult(null);
    setError(null);
    setSelectedProductIds([]);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col font-cairo" dir="rtl">
      <Header />
      <main className="flex-1 py-4 md:py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            
            {step <= totalSteps && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] md:text-xs font-black text-secondary">
                  <span>المرحلة {step} من {totalSteps}</span>
                  <span>{Math.round((step / totalSteps) * 100)}% مكتمل</span>
                </div>
                <Progress value={(step / totalSteps) * 100} className="h-1 rounded-full" />
              </div>
            )}

            <Card className="border-none shadow-lg rounded-[20px] md:rounded-[24px] overflow-hidden bg-white relative">
              <AnimatePresence>
                {isSaving && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center gap-6 p-6 text-center"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="w-16 h-16 md:w-20 md:h-20 border-4 border-primary/20 border-t-primary rounded-full"
                      />
                      <Bot className="w-8 h-8 md:w-10 md:h-10 text-primary absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-black text-secondary">يتم الآن التحليل الذكي...</h3>
                      <p className="text-xs md:text-sm text-muted-foreground font-bold animate-pulse">يستغرق التصميم حوالي 30-60 ثانية.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <CardContent className="p-0">
                <div className="min-h-[350px] md:min-h-[500px] flex flex-col">
                  <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 md:space-y-6">
                          <div className="text-center space-y-1">
                            <h3 className="text-lg md:text-2xl font-black text-secondary">تحميل صورة الغرفة</h3>
                            <p className="text-[10px] md:text-sm text-muted-foreground font-bold">التقط صورة واضحة لغرفتك الحالية للتحليل.</p>
                          </div>
                          <div onClick={() => fileInputRef.current?.click()} className="group relative border-2 border-dashed border-gray-100 rounded-[15px] md:rounded-[20px] p-6 md:p-12 text-center hover:border-primary/40 transition-all cursor-pointer bg-gray-50/50 flex flex-col items-center justify-center gap-4">
                             {originalImage ? (
                               <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden shadow-lg">
                                  <Image src={originalImage} alt="Preview" fill className="object-cover" />
                               </div>
                             ) : (
                               <>
                                 <div className="w-10 h-10 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                   <Camera className="w-6 h-6 md:w-8 md:h-8" />
                                 </div>
                                 <div className="space-y-1">
                                   <p className="text-sm md:text-lg font-black text-secondary">انقر للاختيار</p>
                                   <p className="text-[9px] md:text-xs text-muted-foreground font-bold">JPG, PNG (بحد أقصى 5MB)</p>
                                 </div>
                               </>
                             )}
                             <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                          </div>
                        </motion.div>
                      )}
                      
                      {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-6">
                          <div className="text-center space-y-1">
                            <h3 className="text-lg md:text-2xl font-black text-secondary">نوع المساحة</h3>
                            <p className="text-[10px] md:text-sm text-muted-foreground font-bold">اختر نوع الغرفة المراد تصميمها.</p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
                            {ROOM_TYPES.map((type) => (
                              <div key={type.id} onClick={() => setRoomType(type.id)} className={cn("p-3 md:p-5 rounded-[12px] md:rounded-[18px] border-2 transition-all cursor-pointer flex flex-col items-center gap-2 md:gap-3 text-center", roomType === type.id ? "border-primary bg-primary/5" : "border-gray-50 bg-gray-50/30")}>
                                <type.icon className={cn("w-5 h-5 md:w-7 md:h-7", roomType === type.id ? "text-primary" : "text-gray-400")} />
                                <span className={cn("font-black text-[9px] md:text-xs", roomType === type.id ? "text-primary" : "text-secondary")}>{type.name}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-6">
                          <div className="text-center space-y-1">
                            <h3 className="text-lg md:text-2xl font-black text-secondary">اختر نمطك المفضل</h3>
                            <p className="text-[10px] md:text-sm text-muted-foreground font-bold">سيعتمد الذكاء الاصطناعي على هذا النمط.</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 md:gap-4">
                            {DESIGN_STYLES.map((style) => (
                              <div key={style.id} onClick={() => setSelectedStyle(style.id)} className={cn("relative h-24 md:h-36 rounded-[12px] md:rounded-[18px] overflow-hidden cursor-pointer transition-all", selectedStyle === style.id ? "ring-4 ring-primary" : "opacity-80 hover:opacity-100")}>
                                <Image src={style.img} alt={style.name} fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-end p-2 md:p-4">
                                  <span className="text-white font-black text-[10px] md:text-sm">{style.name}</span>
                                </div>
                                {selectedStyle === style.id && <div className="absolute top-2 right-2 w-4 h-4 md:w-6 md:h-6 bg-primary rounded-full flex items-center justify-center"><Check className="w-2 md:w-3 h-2 md:h-3 text-white" /></div>}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-6">
                          <div className="text-center space-y-1">
                            <h3 className="text-lg md:text-2xl font-black text-secondary">طريقة اختيار القطع</h3>
                          </div>
                          <div className="flex flex-col gap-3 max-w-sm mx-auto">
                            <div onClick={() => setSelectionMode('auto')} className={cn("p-4 rounded-[12px] md:rounded-[15px] border-2 cursor-pointer flex items-center gap-4", selectionMode === 'auto' ? "border-primary bg-primary/5" : "border-gray-100")}>
                               <Sparkles className={cn("w-5 h-5", selectionMode === 'auto' ? "text-primary" : "text-gray-400")} />
                               <div className="text-right">
                                  <h4 className="font-black text-[11px] md:text-sm text-secondary">اقتراحات تلقائية</h4>
                                  <p className="text-[9px] md:text-xs text-muted-foreground font-bold">دع الذكاء الاصطناعي يختار.</p>
                               </div>
                            </div>
                            <div onClick={() => setSelectionMode('manual')} className={cn("p-4 rounded-[12px] md:rounded-[15px] border-2 cursor-pointer flex items-center gap-4", selectionMode === 'manual' ? "border-primary bg-primary/5" : "border-gray-100")}>
                               <ShoppingBag className={cn("w-5 h-5", selectionMode === 'manual' ? "text-primary" : "text-gray-400")} />
                               <div className="text-right">
                                  <h4 className="font-black text-[11px] md:text-sm text-secondary">اختيار يدوي</h4>
                                  <p className="text-[9px] md:text-xs text-muted-foreground font-bold">من الكتالوج مباشرة.</p>
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 5 && (
                        <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-6">
                          <div className="flex items-center justify-between">
                             <h3 className="text-sm md:text-lg font-black text-secondary">اختر قطعك المفضلة</h3>
                             <Badge variant="outline" className="text-[9px] font-bold">{selectedProductIds.length} مختار</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                            {allProducts?.slice(0, 8).map(product => (
                              <div key={product.id} onClick={() => toggleProductSelection(product.id)} className={cn("relative aspect-[3/4] rounded-lg overflow-hidden border-2 cursor-pointer", selectedProductIds.includes(product.id) ? "border-primary" : "border-transparent")}>
                                <Image src={product.image_base64 || `https://picsum.photos/seed/${product.id}/600/800`} alt="Product" fill className="object-cover" />
                                {selectedProductIds.includes(product.id) && (
                                  <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-lg"><Check className="w-2.5 h-2.5 text-white" /></div>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {step === 6 && (
                        <motion.div key="step6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                          <div className="text-center space-y-1">
                            <h3 className="text-lg md:text-2xl font-black text-secondary">التفاصيل النهائية</h3>
                          </div>
                          <div className="max-w-md mx-auto space-y-4">
                             <div className="space-y-1.5">
                                <Label className="font-black text-[10px] md:text-xs">المساحة التقريبية (م²)</Label>
                                <Input type="number" value={roomArea} onChange={e => setRoomArea(e.target.value)} className="h-10 rounded-xl bg-gray-50 border-none font-black" />
                             </div>
                             <div className="space-y-1.5">
                                <Label className="font-black text-[10px] md:text-xs">الميزانية القصوى (ريال)</Label>
                                <Input type="number" value={budgetRange.max} onChange={e => setBudgetRange({...budgetRange, max: e.target.value})} className="h-10 rounded-xl bg-gray-50 border-none font-black" />
                             </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 7 && aiResult && (
                        <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                           <div className="text-center">
                              <h3 className="text-lg md:text-xl font-black text-secondary">تقرير المصمم الذكي</h3>
                           </div>
                           <div className="p-4 md:p-6 bg-gray-50 rounded-xl space-y-4">
                              <div className="text-muted-foreground leading-relaxed text-sm md:text-base font-medium whitespace-pre-wrap">
                                 {aiResult.text}
                              </div>
                              {aiResult.prompt && (
                                <div className="p-4 bg-secondary text-white rounded-xl space-y-3">
                                   <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-black opacity-50 uppercase tracking-widest">Image Prompt (EN)</span>
                                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(aiResult.prompt!)} className="h-7 text-white text-[10px] gap-1.5">
                                         {copied ? <ClipboardCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />} النسخ
                                      </Button>
                                   </div>
                                   <p className="font-mono text-[10px] leading-tight opacity-80 break-all">{aiResult.prompt}</p>
                                </div>
                              )}
                           </div>
                           <Button onClick={handleReset} variant="outline" className="w-full h-10 rounded-xl font-black text-xs gap-2">
                              <RefreshCcw className="w-3 h-3" /> تصميم مساحة أخرى
                           </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {step <= totalSteps && (
                    <div className="p-4 md:p-6 bg-gray-50/50 border-t flex items-center justify-between gap-3">
                      <Button variant="ghost" onClick={handleBack} disabled={step === 1 || isSaving} className="rounded-xl h-10 md:h-12 px-4 md:px-8 font-black text-[11px] md:text-sm">السابقة</Button>
                      {step < totalSteps ? (
                        <Button onClick={handleNext} disabled={isSaving} className="h-10 md:h-12 bg-secondary text-white font-black rounded-xl md:rounded-2xl px-6 md:px-12 text-[11px] md:text-sm">المتابعة</Button>
                      ) : (
                        <Button onClick={handleSubmitRequest} disabled={isSaving} className="h-10 md:h-12 bg-primary text-white font-black rounded-xl md:rounded-2xl px-6 md:px-12 text-[11px] md:text-sm">
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'توليد التصميم'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}