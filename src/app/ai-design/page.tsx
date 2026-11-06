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
  Scaling,
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

// تفعيل زيادة مهلة التنفيذ لـ 60 ثانية على خوادم Vercel (Next.js 15)
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
  const [searchQuery, setSearchQuery] = useState('');

  const productsColl = useMemo(() => collection(db, 'products'), [db]);
  const { data: allProducts, loading: productsLoading } = useCollection(productsColl);

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter(p => 
      p.name_ar?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allProducts, searchQuery]);

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
      toast({ title: "تم نسخ البرومبت بنجاح" });
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
      // إرسال البيانات للذكاء الاصطناعي مع تعليمات واضحة
      const aiResponse = await ewanAiChat({
        message: `أرغب في تصميم غرفة ${ROOM_TYPES.find(t => t.id === roomType)?.name} بمساحة ${roomArea}م² ونمط ${DESIGN_STYLES.find(s => s.id === selectedStyle)?.name}. ميزانيتي هي ${budgetRange.max} ريال.`,
        imageDataUri: originalImage || undefined,
        contextData: {
          roomType,
          style: selectedStyle,
          area: Number(roomArea),
          budget: budgetRange.max,
          products: selectedProductIds
        }
      });

      if (aiResponse.text.includes("⚠️")) {
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
        budget_max: Number(budgetRange.max),
        room_area: Number(roomArea),
        status: 'completed',
        ai_recommendation: aiResponse.text,
        generated_image_prompt: aiResponse.imagePrompt,
        created_at: serverTimestamp()
      };

      await addDoc(collection(db, 'ai_design_requests'), requestData);
      setStep(7);
      toast({ title: "اكتمل تحليل التصميم بنجاح!" });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "فشل الاتصال بالذكاء الاصطناعي.");
      toast({ variant: "destructive", title: "فشل المعالجة", description: "تعذر الاتصال بالخادم أو انتهت المهلة." });
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
                <Progress value={(step / totalSteps) * 100} className="h-1.5 rounded-full" />
              </div>
            )}

            <Card className="border-none shadow-2xl rounded-[24px] md:rounded-[32px] overflow-hidden bg-white relative">
              <AnimatePresence>
                {isSaving && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center gap-6 p-8 text-center"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                        className="w-20 h-20 md:w-24 md:h-24 border-4 border-primary/10 border-t-primary rounded-full"
                      />
                      <Bot className="w-10 h-10 md:w-12 md:h-12 text-primary absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-black text-secondary">يتم الآن التحليل الذكي لمساحتك...</h3>
                      <p className="text-xs md:text-sm text-muted-foreground font-bold animate-pulse">تتم المعالجة الآن، قد يستغرق الرد من 30 إلى 60 ثانية.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <CardContent className="p-0">
                <div className="min-h-[400px] md:min-h-[550px] flex flex-col">
                  <div className="flex-1 p-4 md:p-10 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                          <div className="text-center space-y-2">
                            <h3 className="text-xl md:text-3xl font-black text-secondary">تحميل صورة الغرفة</h3>
                            <p className="text-xs md:text-base text-muted-foreground font-bold">التقط صورة واضحة لغرفتك الحالية ليتمكن المصمم الذكي من تحليلها.</p>
                          </div>
                          <div onClick={() => fileInputRef.current?.click()} className="group relative border-2 border-dashed border-gray-100 rounded-[20px] md:rounded-[30px] p-8 md:p-16 text-center hover:border-primary/40 transition-all cursor-pointer bg-gray-50/50 flex flex-col items-center justify-center gap-6">
                             {originalImage ? (
                               <div className="relative w-full max-w-md aspect-video rounded-2xl overflow-hidden shadow-2xl">
                                  <Image src={originalImage} alt="Preview" fill className="object-cover" />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                     <RefreshCcw className="w-10 h-10 text-white" />
                                  </div>
                               </div>
                             ) : (
                               <>
                                 <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                   <Camera className="w-8 h-8 md:w-10 md:h-10" />
                                 </div>
                                 <div className="space-y-1">
                                   <p className="text-base md:text-xl font-black text-secondary">انقر لاختيار صورة</p>
                                   <p className="text-xs text-muted-foreground font-bold">JPG, PNG (بحد أقصى 5MB)</p>
                                 </div>
                               </>
                             )}
                             <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                          </div>
                        </motion.div>
                      )}
                      
                      {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                          <div className="text-center space-y-2">
                            <h3 className="text-xl md:text-3xl font-black text-secondary">ما نوع هذه المساحة؟</h3>
                            <p className="text-xs md:text-base text-muted-foreground font-bold">تحديد نوع الغرفة يساعدنا في اختيار قطع الأثاث الملائمة.</p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                            {ROOM_TYPES.map((type) => (
                              <div key={type.id} onClick={() => setRoomType(type.id)} className={cn("p-4 md:p-6 rounded-[20px] border-2 transition-all cursor-pointer flex flex-col items-center gap-3 md:gap-4 text-center group", roomType === type.id ? "border-primary bg-primary/5" : "border-gray-50 bg-gray-50/30 hover:border-gray-200")}>
                                <type.icon className={cn("w-6 h-6 md:w-10 md:h-10 transition-colors", roomType === type.id ? "text-primary" : "text-gray-400 group-hover:text-secondary")} />
                                <span className={cn("font-black text-xs md:text-sm", roomType === type.id ? "text-primary" : "text-secondary")}>{type.name}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                          <div className="text-center space-y-2">
                            <h3 className="text-xl md:text-3xl font-black text-secondary">اختر نمطك المفضل</h3>
                            <p className="text-xs md:text-base text-muted-foreground font-bold">سيعتمد الذكاء الاصطناعي على هذا النمط في توليد الألوان والأثاث.</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3 md:gap-6">
                            {DESIGN_STYLES.map((style) => (
                              <div key={style.id} onClick={() => setSelectedStyle(style.id)} className={cn("relative h-32 md:h-44 rounded-[20px] overflow-hidden cursor-pointer transition-all group", selectedStyle === style.id ? "ring-4 ring-primary shadow-2xl scale-[1.02]" : "opacity-80 hover:opacity-100")}>
                                <Image src={style.img} alt={style.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 md:p-6">
                                  <span className="text-white font-black text-xs md:text-xl">{style.name}</span>
                                </div>
                                {selectedStyle === style.id && (
                                  <div className="absolute top-3 right-3 w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                                    <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                          <div className="text-center space-y-2">
                            <h3 className="text-xl md:text-3xl font-black text-secondary">طريقة اختيار القطع</h3>
                            <p className="text-xs md:text-base text-muted-foreground font-bold">هل ترغب في اختيار قطع محددة أم ترك الأمر لذكاء إيوان؟</p>
                          </div>
                          <div className="flex flex-col gap-4 max-w-sm mx-auto">
                            <div onClick={() => setSelectionMode('auto')} className={cn("p-6 rounded-[20px] border-2 cursor-pointer flex items-center gap-5 transition-all", selectionMode === 'auto' ? "border-primary bg-primary/5 shadow-inner" : "border-gray-100 hover:border-gray-200")}>
                               <Sparkles className={cn("w-7 h-7", selectionMode === 'auto' ? "text-primary" : "text-gray-400")} />
                               <div className="text-right">
                                  <h4 className="font-black text-sm md:text-base text-secondary">اقتراحات تلقائية ذكية</h4>
                                  <p className="text-xs text-muted-foreground font-bold">دع النظام يختار لك أفضل القطع المتناسقة.</p>
                               </div>
                            </div>
                            <div onClick={() => setSelectionMode('manual')} className={cn("p-6 rounded-[20px] border-2 cursor-pointer flex items-center gap-5 transition-all", selectionMode === 'manual' ? "border-primary bg-primary/5 shadow-inner" : "border-gray-100 hover:border-gray-200")}>
                               <ShoppingBag className={cn("w-7 h-7", selectionMode === 'manual' ? "text-primary" : "text-gray-400")} />
                               <div className="text-right">
                                  <h4 className="font-black text-sm md:text-base text-secondary">اختيار يدوي من الكتالوج</h4>
                                  <p className="text-xs text-muted-foreground font-bold">حدد القطع التي تعجبك لدمجها في التصميم.</p>
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 5 && (
                        <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                          <div className="flex items-center justify-between">
                             <h3 className="text-lg md:text-2xl font-black text-secondary">اختر قطعك المفضلة</h3>
                             <Badge className="bg-primary text-white font-black px-4">{selectedProductIds.length} قطعة مختارة</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {filteredProducts.slice(0, 12).map(product => (
                              <div key={product.id} onClick={() => toggleProductSelection(product.id)} className={cn("relative aspect-[3/4] rounded-2xl overflow-hidden border-4 transition-all cursor-pointer", selectedProductIds.includes(product.id) ? "border-primary shadow-xl scale-[1.02]" : "border-transparent opacity-80 hover:opacity-100")}>
                                <Image src={product.image_base64 || `https://picsum.photos/seed/${product.id}/600/800`} alt="Product" fill className="object-cover" />
                                {selectedProductIds.includes(product.id) && (
                                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg"><Check className="w-4 h-4 text-white" /></div>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {step === 6 && (
                        <motion.div key="step6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                          <div className="text-center space-y-2">
                            <h3 className="text-xl md:text-3xl font-black text-secondary">التفاصيل النهائية للمساحة</h3>
                            <p className="text-xs md:text-base text-muted-foreground font-bold">هذه المعلومات تساعدنا في ضبط المقاسات وتقدير التكلفة بدقة.</p>
                          </div>
                          <div className="max-w-md mx-auto space-y-6">
                             <div className="space-y-2 text-right">
                                <Label className="font-black text-xs md:text-sm text-secondary mr-1">المساحة التقريبية (متر مربع)</Label>
                                <Input type="number" value={roomArea} onChange={e => setRoomArea(e.target.value)} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-lg shadow-inner" />
                             </div>
                             <div className="space-y-2 text-right">
                                <Label className="font-black text-xs md:text-sm text-secondary mr-1">الميزانية القصوى (ريال يمني)</Label>
                                <Input type="number" value={budgetRange.max} onChange={e => setBudgetRange({...budgetRange, max: e.target.value})} className="h-14 rounded-2xl bg-gray-50 border-none font-black text-lg shadow-inner" />
                             </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 7 && aiResult && (
                        <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                           <div className="text-center space-y-2">
                              <h3 className="text-2xl md:text-4xl font-black text-secondary">تقرير المصمم الذكي لـ "إيوان"</h3>
                              <p className="text-xs md:text-lg text-muted-foreground font-bold">بناءً على صورتك المرفوعة، إليك التحليل المخصص لمساحتك.</p>
                           </div>
                           
                           <div className="space-y-6">
                              <div className="p-6 md:p-10 bg-[#F4F6F5] rounded-[24px] border border-border/50 space-y-6 shadow-inner">
                                 <h4 className="text-lg md:text-2xl font-black text-secondary flex items-center gap-3 border-b pb-4">
                                    <Bot className="w-6 h-6 md:w-8 md:h-8 text-primary" /> توصيات المصمم الخبير
                                 </h4>
                                 <div className="text-secondary leading-loose text-sm md:text-xl font-medium whitespace-pre-wrap text-justify">
                                    {aiResult.text}
                                 </div>
                              </div>

                              {aiResult.prompt && (
                                <div className="p-6 md:p-8 bg-secondary text-white rounded-[24px] space-y-4 shadow-2xl relative overflow-hidden group">
                                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rotate-45 -translate-y-16 translate-x-16 transition-transform group-hover:scale-110" />
                                   <div className="flex items-center justify-between relative z-10">
                                      <div className="flex items-center gap-3">
                                         <Sparkles className="w-5 h-5 text-primary" />
                                         <span className="text-xs md:text-sm font-black opacity-60 uppercase tracking-widest">Image Generation Prompt (EN)</span>
                                      </div>
                                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(aiResult.prompt!)} className="h-10 text-white font-black text-xs gap-2 hover:bg-white/10 px-4">
                                         {copied ? <ClipboardCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} 
                                         {copied ? 'تم النسخ' : 'نسخ النص'}
                                      </Button>
                                   </div>
                                   <div className="p-4 md:p-6 bg-white/5 rounded-xl border border-white/10 relative z-10">
                                      <p className="font-mono text-xs md:text-sm leading-relaxed opacity-90 break-words italic selection:bg-primary">
                                        {aiResult.prompt}
                                      </p>
                                   </div>
                                   <p className="text-[10px] md:text-xs text-white/40 font-bold italic relative z-10">* يمكنك استخدام هذا النص في محركات الصور مثل Midjourney أو Flux للحصول على تصور بصري دقيق.</p>
                                </div>
                              )}
                           </div>

                           <div className="flex flex-col sm:flex-row gap-4">
                              <Button onClick={handleReset} variant="outline" className="flex-1 h-14 rounded-2xl font-black text-base gap-3 border-2 border-secondary text-secondary">
                                 <RefreshCcw className="w-5 h-5" /> تصميم مساحة جديدة
                              </Button>
                              <Link href="/shop" className="flex-1">
                                <Button className="w-full h-14 rounded-2xl bg-secondary text-white font-black text-base gap-3 shadow-xl">
                                   <ShoppingBag className="w-5 h-5" /> تصفح القطع المقترحة
                                </Button>
                              </Link>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {step <= totalSteps && (
                    <div className="p-5 md:p-8 bg-gray-50/50 border-t flex items-center justify-between gap-4">
                      <Button variant="ghost" onClick={handleBack} disabled={step === 1 || isSaving} className="rounded-xl h-12 md:h-14 px-6 md:px-10 font-black text-xs md:text-base text-muted-foreground hover:bg-gray-100">رجوع</Button>
                      {step < totalSteps ? (
                        <Button onClick={handleNext} disabled={isSaving} className="h-12 md:h-14 bg-secondary text-white font-black rounded-xl md:rounded-2xl px-10 md:px-20 text-xs md:text-base shadow-xl transition-all active:scale-95">المتابعة</Button>
                      ) : (
                        <Button onClick={handleSubmitRequest} disabled={isSaving} className="h-12 md:h-14 bg-primary text-white font-black rounded-xl md:rounded-2xl px-10 md:px-20 text-xs md:text-base shadow-2xl shadow-primary/30 flex gap-2">
                          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'توليد التصميم الآن'}
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