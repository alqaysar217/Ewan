'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Zap, 
  Upload, 
  Palette, 
  Wallet, 
  Ruler, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft, 
  ArrowRight,
  Info,
  Maximize2,
  Home,
  Coins,
  Search,
  Layout,
  ShoppingBag,
  Camera,
  Layers,
  ChevronRight,
  Star,
  ImageIcon,
  Check,
  Box,
  Scaling,
  Bot,
  FileText,
  Quote,
  RefreshCcw,
  AlertTriangle
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

const ROOM_TYPES = [
  { id: 'living', name: 'غرفة معيشة', icon: Home },
  { id: 'bedroom', name: 'غرفة نوم', icon: Layers },
  { id: 'kitchen', name: 'مطبخ', icon: Layout },
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
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

export default function AIDesignStudio() {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [aiResult, setAiResult] = useState<{text: string, prompt?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
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
  const [roomStatus, setRoomStatus] = useState<string>('empty');
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
      // استدعاء محرك إيوان AI (Gemma 2)
      const aiResponse = await ewanAiChat({
        message: `قم بتحليل وتصميم مساحة لغرفة من نوع ${ROOM_TYPES.find(t => t.id === roomType)?.name} بمساحة ${roomArea}م² ونمط ${DESIGN_STYLES.find(s => s.id === selectedStyle)?.name}. الحالة الحالية للغرفة هي ${getRoomStatusLabel(roomStatus)}. اقترح أفضل توزيع للأثاث وتنسيق للألوان.`,
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

      // حفظ الطلب في Firestore
      const requestData = {
        user_id: user?.uid || 'guest',
        original_image_url: originalImage,
        room_type: roomType,
        selected_style: selectedStyle,
        selection_mode: selectionMode,
        selected_products: selectedProductIds,
        budget_min: Number(budgetRange.min),
        budget_max: Number(budgetRange.max),
        room_status: roomStatus,
        room_area: Number(roomArea),
        status: 'completed',
        ai_recommendation: aiResponse.text,
        generated_image_prompt: aiResponse.imagePrompt,
        created_at: serverTimestamp()
      };

      await addDoc(collection(db, 'ai_design_requests'), requestData);
      
      // الانتقال لعرض النتائج بوضوح
      setStep(7);
      
      toast({
        title: "اكتمل تحليل التصميم!",
        description: "لقد أعد لك المصمم الذكي رؤية فنية لمساحتك.",
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "حدث خطأ في الاتصال بالذكاء الاصطناعي.");
      toast({ 
        variant: "destructive", 
        title: "فشل المعالجة", 
        description: "يرجى التأكد من مفتاح OpenRouter واستقرار الإنترنت." 
      });
    } finally {
      setIsSaving(false);
    }
  };

  function getRoomStatusLabel(id: string) {
    if (id === 'empty') return 'فارغة تماماً';
    if (id === 'partially_furnished') return 'مؤثثة جزئياً';
    if (id === 'fully_furnished') return 'مؤثثة بالكامل';
    return id;
  }

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
      <main className="flex-1 py-4 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">
            
            {step <= totalSteps && (
              <div className="space-y-2 md:space-y-4">
                <div className="flex justify-between items-center text-xs md:text-sm font-black text-secondary">
                  <span>المرحلة {step} من {totalSteps}</span>
                  <span>{Math.round((step / totalSteps) * 100)}% مكتمل</span>
                </div>
                <Progress value={(step / totalSteps) * 100} className="h-1.5 md:h-2 rounded-full" />
              </div>
            )}

            <Card className="border-none shadow-xl md:shadow-2xl rounded-[20px] md:rounded-[30px] overflow-hidden bg-white/90 backdrop-blur-xl relative">
              <AnimatePresence>
                {isSaving && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center gap-6 md:gap-8 p-6 md:p-12 text-center"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="w-16 h-16 md:w-24 md:h-24 border-4 border-primary/20 border-t-primary rounded-full"
                      />
                      <Bot className="w-8 h-8 md:w-12 md:h-12 text-primary absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div className="space-y-3 md:space-y-4 max-w-sm">
                      <h3 className="text-xl md:text-3xl font-black text-secondary">يتم الآن التحليل الذكي...</h3>
                      <div className="space-y-1.5 md:space-y-2">
                        <p className="flex items-center justify-center gap-2 text-primary font-bold text-xs md:text-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> معالجة البيانات المدخلة
                        </p>
                        <p className="flex items-center justify-center gap-2 text-primary font-bold text-xs md:text-sm">
                          <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> مطابقة الأنماط المعمارية
                        </p>
                        <p className="flex items-center justify-center gap-2 text-muted-foreground font-bold text-xs md:text-sm animate-pulse">
                          <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> صياغة تقرير المصمم الخبير
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <CardContent className="p-0">
                <div className="min-h-[400px] md:min-h-[600px] flex flex-col">
                  <div className="flex-1 p-4 md:p-12 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 md:space-y-10">
                          <div className="text-center space-y-2">
                            <h3 className="text-xl md:text-3xl font-black text-secondary">ابدأ بتحميل صورة غرفتك</h3>
                            <p className="text-xs md:text-muted-foreground font-bold">التقط صورة واضحة لغرفتك الحالية ليتمكن الذكاء الاصطناعي من تحليلها.</p>
                          </div>
                          <div onClick={() => fileInputRef.current?.click()} className="group relative border-2 md:border-4 border-dashed border-gray-100 rounded-[20px] md:rounded-[30px] p-8 md:p-24 text-center hover:border-primary/40 transition-all cursor-pointer bg-gray-50/50 flex flex-col items-center justify-center gap-4 md:gap-6">
                             {originalImage ? (
                               <div className="relative w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-xl">
                                  <Image src={originalImage} alt="Preview" fill className="object-cover" />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                     <p className="text-white font-black text-sm">تغيير الصورة</p>
                                  </div>
                               </div>
                             ) : (
                               <>
                                 <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                   <Camera className="w-8 h-8 md:w-12 md:h-12" />
                                 </div>
                                 <div className="space-y-1">
                                   <p className="text-lg md:text-2xl font-black text-secondary">انقر للاختيار أو سحب الصورة</p>
                                   <p className="text-[10px] md:text-sm text-muted-foreground font-bold">يدعم JPG, PNG (بحد أقصى 5 ميجابايت)</p>
                                 </div>
                               </>
                             )}
                             <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                          </div>
                        </motion.div>
                      )}
                      
                      {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-10">
                          <div className="text-center space-y-2">
                            <h3 className="text-xl md:text-3xl font-black text-secondary">ما نوع هذه المساحة؟</h3>
                            <p className="text-xs md:text-muted-foreground font-bold">اختر نوع الغرفة التي ترغب في إعادة تصميمها.</p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                            {ROOM_TYPES.map((type) => (
                              <div key={type.id} onClick={() => setRoomType(type.id)} className={cn("p-4 md:p-8 rounded-[15px] md:rounded-[24px] border-2 transition-all cursor-pointer flex flex-col items-center gap-3 md:gap-4 text-center group", roomType === type.id ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-gray-50 bg-gray-50/30 hover:border-gray-200")}>
                                <type.icon className={cn("w-6 h-6 md:w-10 md:h-10 transition-colors", roomType === type.id ? "text-primary" : "text-gray-400 group-hover:text-secondary")} />
                                <span className={cn("font-black text-xs md:text-sm", roomType === type.id ? "text-primary" : "text-secondary")}>{type.name}</span>
                                {roomType === type.id && <div className="w-4 h-4 md:w-5 md:h-5 bg-primary rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" /></div>}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-10">
                          <div className="text-center space-y-2">
                            <h3 className="text-xl md:text-3xl font-black text-secondary">اختر نمطك المفضل</h3>
                            <p className="text-xs md:text-muted-foreground font-bold">سيعتمد الذكاء الاصطناعي على هذا النمط في توليد الألوان والأثاث.</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            {DESIGN_STYLES.map((style) => (
                              <div key={style.id} onClick={() => setSelectedStyle(style.id)} className={cn("relative h-32 md:h-48 rounded-[15px] md:rounded-[24px] overflow-hidden cursor-pointer group transition-all", selectedStyle === style.id ? "ring-4 ring-primary shadow-xl" : "opacity-70 hover:opacity-100")}>
                                <Image src={style.img} alt={style.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-4 right-4 left-4 md:bottom-6 md:right-6 md:left-6 flex justify-between items-center text-white">
                                  <span className="text-sm md:text-xl font-black">{style.name}</span>
                                  {selectedStyle === style.id && <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"><Check className="w-4 h-4 md:w-5 md:h-5" /></div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-10">
                          <div className="text-center space-y-2">
                            <h3 className="text-xl md:text-3xl font-black text-secondary">طريقة اختيار القطع</h3>
                            <p className="text-xs md:text-muted-foreground font-bold">هل تريد أن يقترح النظام قطعاً تلقائياً أم ترغب باختيارها من المتجر؟</p>
                          </div>
                          <div className="flex flex-col gap-4 md:gap-6 max-w-lg mx-auto">
                            <div onClick={() => setSelectionMode('auto')} className={cn("p-4 md:p-8 rounded-[15px] md:rounded-[24px] border-2 cursor-pointer transition-all flex items-center gap-4 md:gap-6", selectionMode === 'auto' ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-gray-100 hover:border-gray-200")}>
                               <div className={cn("w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0", selectionMode === 'auto' ? "bg-primary text-white" : "bg-gray-100 text-gray-400")}>
                                  <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
                               </div>
                               <div>
                                  <h4 className="font-black text-sm md:text-lg text-secondary">اقتراحات تلقائية ذكية</h4>
                                  <p className="text-[10px] md:text-sm text-muted-foreground font-bold">دع الذكاء الاصطناعي يختار القطع المناسبة.</p>
                               </div>
                               {selectionMode === 'auto' && <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primary mr-auto" />}
                            </div>
                            <div onClick={() => setSelectionMode('manual')} className={cn("p-4 md:p-8 rounded-[15px] md:rounded-[24px] border-2 cursor-pointer transition-all flex items-center gap-4 md:gap-6", selectionMode === 'manual' ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-gray-100 hover:border-gray-200")}>
                               <div className={cn("w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0", selectionMode === 'manual' ? "bg-primary text-white" : "bg-gray-100 text-gray-400")}>
                                  <ShoppingBag className="w-6 h-6 md:w-8 md:h-8" />
                               </div>
                               <div>
                                  <h4 className="font-black text-sm md:text-lg text-secondary">اختيار يدوي من الكتالوج</h4>
                                  <p className="text-[10px] md:text-sm text-muted-foreground font-bold">تصفح القطع المتوفرة في المتجر.</p>
                               </div>
                               {selectionMode === 'manual' && <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-primary mr-auto" />}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 5 && (
                        <motion.div key="step5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 md:space-y-8">
                          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                            <div>
                               <h3 className="text-xl md:text-2xl font-black text-secondary">اختر قطعك المفضلة</h3>
                               <p className="text-[10px] md:text-muted-foreground font-bold">حدد المنتجات التي تريد تضمينها في التصميم.</p>
                            </div>
                            <div className="relative w-full md:w-80 group">
                              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input placeholder="ابحث في المتجر..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10 h-11 md:h-12 rounded-xl bg-gray-100/50 border-none" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                            {productsLoading ? (
                               [1,2,3,4,5].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-xl md:rounded-2xl" />)
                            ) : filteredProducts.length === 0 ? (
                               <div className="col-span-full py-16 text-center opacity-30 font-black text-sm">لم يتم العثور على منتجات.</div>
                            ) : (
                              filteredProducts.map(product => (
                                <div key={product.id} onClick={() => toggleProductSelection(product.id)} className={cn("group relative aspect-[3/4] bg-white rounded-xl md:rounded-2xl border-2 md:border-4 transition-all cursor-pointer overflow-hidden", selectedProductIds.includes(product.id) ? "border-primary" : "border-transparent")}>
                                  <Image src={product.image_base64 || `https://picsum.photos/seed/${product.id}/600/800`} alt={product.name_ar} fill className="object-cover" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                  <div className="absolute bottom-2 right-2 left-2 md:bottom-3 md:right-3 md:left-3 text-white">
                                    <p className="font-black text-[9px] md:text-[10px] leading-tight line-clamp-2">{product.name_ar}</p>
                                    <p className="text-primary font-bold text-[9px] md:text-[10px] mt-0.5">{(Number(product.price)).toLocaleString()} ر.ي</p>
                                  </div>
                                  {selectedProductIds.includes(product.id) && (
                                    <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-5 h-5 md:w-6 md:h-6 bg-primary rounded-full flex items-center justify-center shadow-lg"><Check className="w-3 h-3 md:w-4 md:h-4 text-white" /></div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}

                      {step === 6 && (
                        <motion.div key="step6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
                          <div className="text-center space-y-2">
                            <h3 className="text-xl md:text-3xl font-black text-secondary">تفاصيل التنفيذ والميزانية</h3>
                            <p className="text-xs md:text-muted-foreground font-bold">ساعدنا في فهم أبعاد مساحتك وميزانيتك المتوقعة.</p>
                          </div>
                          <div className="max-w-3xl mx-auto space-y-6 md:space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                               <div className="space-y-2 md:space-y-3">
                                  <Label className="font-black text-xs md:text-sm text-secondary flex items-center gap-2"><Box className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" /> حالة الغرفة الحالية</Label>
                                  <select value={roomStatus} onChange={e => setRoomStatus(e.target.value)} className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-gray-50 border-none px-4 font-bold text-xs md:text-sm outline-none shadow-inner">
                                    <option value="empty">فارغة تماماً</option>
                                    <option value="partially_furnished">مؤثثة جزئياً</option>
                                    <option value="fully_furnished">مؤثثة بالكامل</option>
                                  </select>
                               </div>
                               <div className="space-y-2 md:space-y-3">
                                  <Label className="font-black text-xs md:text-sm text-secondary flex items-center gap-2"><Scaling className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" /> المساحة (م²)</Label>
                                  <Input type="number" value={roomArea} onChange={e => setRoomArea(e.target.value)} placeholder="مثال: 25" className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-gray-50 border-none font-black text-base md:text-lg" />
                               </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                               <div className="space-y-2 md:space-y-3">
                                  <Label className="font-black text-xs md:text-sm text-secondary flex items-center gap-2"><Wallet className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" /> الميزانية الدنيا (ر.ي)</Label>
                                  <Input type="number" value={budgetRange.min} onChange={e => setBudgetRange({...budgetRange, min: e.target.value})} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-gray-50 border-none font-black text-base md:text-lg" />
                               </div>
                               <div className="space-y-2 md:space-y-3">
                                  <Label className="font-black text-xs md:text-sm text-secondary flex items-center gap-2"><Wallet className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" /> الميزانية القصوى (ر.ي)</Label>
                                  <Input type="number" value={budgetRange.max} onChange={e => setBudgetRange({...budgetRange, max: e.target.value})} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-gray-50 border-none font-black text-base md:text-lg" />
                               </div>
                            </div>
                            <div className="p-5 md:p-8 bg-primary/5 rounded-[20px] md:rounded-[30px] border border-primary/10 space-y-4 md:space-y-6">
                               <h4 className="font-black text-sm md:text-base text-secondary flex items-center gap-2"><Info className="w-4 h-4 md:w-5 md:h-5 text-primary" /> ملخص طلبك الذكي</h4>
                               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] md:text-sm">
                                  <div>
                                     <p className="text-muted-foreground font-bold mb-0.5 md:mb-1">نوع الغرفة</p>
                                     <p className="font-black text-secondary">{ROOM_TYPES.find(t => t.id === roomType)?.name}</p>
                                  </div>
                                  <div>
                                     <p className="text-muted-foreground font-bold mb-0.5 md:mb-1">المساحة</p>
                                     <p className="font-black text-secondary">{roomArea} م²</p>
                                  </div>
                                  <div>
                                     <p className="text-muted-foreground font-bold mb-0.5 md:mb-1">النمط</p>
                                     <p className="font-black text-secondary">{DESIGN_STYLES.find(s => s.id === selectedStyle)?.name}</p>
                                  </div>
                                  <div>
                                     <p className="text-muted-foreground font-bold mb-0.5 md:mb-1">الاختيار</p>
                                     <p className="font-black text-secondary">{selectionMode === 'auto' ? 'تلقائي' : 'يدوي'}</p>
                                  </div>
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 7 && aiResult && (
                        <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 md:space-y-12">
                           <div className="text-center space-y-2 md:space-y-4">
                              <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                 <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" />
                              </div>
                              <div className="space-y-1 md:space-y-2">
                                <h3 className="text-xl md:text-3xl font-black text-secondary">اكتمل تقرير التصميم</h3>
                                <p className="text-xs md:text-muted-foreground font-bold italic">إليك الرؤية الفنية المقترحة لمساحتك الجديدة.</p>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                              <div className="space-y-6 md:space-y-8">
                                 <div className="p-6 md:p-8 bg-primary/5 rounded-[20px] md:rounded-[30px] border border-primary/10 relative shadow-sm">
                                    <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/10" />
                                    <h4 className="font-black text-sm md:text-base text-primary flex items-center gap-2 mb-4 md:mb-6">
                                      <Bot className="w-5 h-5 md:w-6 md:h-6" /> توصيات المصمم الذكي
                                    </h4>
                                    <div className="text-muted-foreground leading-relaxed md:leading-loose font-medium text-sm md:text-lg text-justify space-y-4 whitespace-pre-wrap">
                                       {aiResult.text}
                                    </div>
                                 </div>
                                 
                                 {aiResult.prompt && (
                                   <div className="p-6 md:p-8 bg-amber-50 rounded-[20px] md:rounded-[30px] border border-amber-100 space-y-3 md:space-y-4 shadow-inner">
                                      <h5 className="text-[9px] md:text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                                         <ImageIcon className="w-3.5 h-3.5 md:w-4 md:h-4" /> وصف التخيل البصري (Visual Prompt)
                                      </h5>
                                      <p className="text-[10px] md:text-xs font-mono text-amber-800 leading-relaxed bg-white/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-amber-200 select-all cursor-pointer">
                                         {aiResult.prompt}
                                      </p>
                                   </div>
                                 )}
                              </div>

                              <div className="space-y-6 md:space-y-8">
                                 <div className="relative aspect-video rounded-[20px] md:rounded-[30px] overflow-hidden shadow-xl border-4 md:border-8 border-white group ring-1 ring-black/5">
                                    <Image src={originalImage!} alt="Original Room" fill className="object-cover" />
                                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase">الصورة الأصلية</div>
                                 </div>
                                 
                                 <Card className="rounded-[20px] md:rounded-[30px] border-none bg-gray-50 overflow-hidden shadow-inner">
                                    <CardContent className="p-6 md:p-10 space-y-6 md:space-y-8">
                                      <h4 className="font-black text-sm md:text-base text-secondary flex items-center gap-2 border-b pb-4 md:pb-6"><FileText className="w-5 h-5 md:w-6 md:h-6 text-primary" /> ملخص البيانات</h4>
                                      <div className="grid grid-cols-1 gap-3 md:gap-4 text-xs md:text-sm">
                                         <div className="flex justify-between items-center bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-black/5">
                                            <span className="font-bold text-muted-foreground">نوع المساحة:</span> 
                                            <span className="font-black text-secondary">{ROOM_TYPES.find(t => t.id === roomType)?.name}</span>
                                         </div>
                                         <div className="flex justify-between items-center bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-black/5">
                                            <span className="font-bold text-muted-foreground">المساحة:</span> 
                                            <span className="font-black text-secondary">{roomArea} م²</span>
                                         </div>
                                         <div className="flex justify-between items-center bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-black/5">
                                            <span className="font-bold text-muted-foreground">النمط:</span> 
                                            <span className="font-black text-secondary">{DESIGN_STYLES.find(s => s.id === selectedStyle)?.name}</span>
                                         </div>
                                         <div className="flex justify-between items-center bg-white p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-black/5">
                                            <span className="font-bold text-muted-foreground">الميزانية:</span> 
                                            <span className="font-black text-primary">{(Number(budgetRange.max)).toLocaleString()} ر.ي</span>
                                         </div>
                                      </div>
                                      <div className="pt-4 md:pt-6 space-y-3 md:space-y-4">
                                         <Link href="/shop" className="block w-full">
                                            <Button className="w-full h-14 md:h-16 bg-secondary text-white font-black rounded-xl md:rounded-2xl shadow-xl shadow-secondary/10 text-base md:text-lg gap-2">
                                               تسوق القطع المقترحة <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                                            </Button>
                                         </Link>
                                         <Button variant="ghost" onClick={handleReset} className="w-full font-black text-xs md:text-sm text-muted-foreground gap-2 h-12 md:h-14 rounded-xl md:rounded-2xl border-2 border-dashed border-gray-200">
                                            <RefreshCcw className="w-4 h-4 md:w-5 md:h-5" /> بدء تصميم آخر
                                         </Button>
                                      </div>
                                    </CardContent>
                                 </Card>
                              </div>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {step <= totalSteps && (
                    <div className="p-4 md:p-10 bg-gray-50/50 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex gap-3 w-full sm:w-auto order-2 sm:order-1">
                         <Button variant="ghost" onClick={handleBack} disabled={step === 1 || isSaving} className="flex-1 sm:flex-none rounded-xl md:rounded-2xl h-12 md:h-14 px-6 md:px-10 font-black text-xs md:text-sm gap-2"><ArrowRight className="w-4 h-4 md:w-5 md:h-5" /> المرحلة السابقة</Button>
                      </div>
                      <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
                         {step < totalSteps ? (
                           <Button onClick={handleNext} disabled={isSaving} className="flex-1 sm:min-w-[200px] h-12 md:h-14 bg-secondary text-white font-black rounded-xl md:rounded-2xl shadow-lg text-sm md:text-lg gap-2">المتابعة <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" /></Button>
                         ) : (
                           <Button onClick={handleSubmitRequest} disabled={isSaving} className="flex-1 sm:min-w-[200px] h-12 md:h-14 bg-primary text-white font-black rounded-xl md:rounded-2xl shadow-lg text-sm md:text-lg gap-2">
                             {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <>توليد التصميم الآن <Sparkles className="w-4 h-4 md:w-5 md:h-5" /></>}
                           </Button>
                         )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {step <= totalSteps && (
              <div className="p-4 md:p-8 bg-white border border-border/50 rounded-[20px] md:rounded-[24px] flex items-start gap-4 md:gap-5 shadow-sm">
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0"><Info className="w-5 h-5 md:w-6 md:h-6 text-amber-600" /></div>
                 <p className="text-[10px] md:text-sm lg:text-base text-muted-foreground font-medium leading-relaxed">
                   <span className="font-black text-secondary block mb-0.5 md:mb-1">ملاحظة تقنية حول "إيوان AI":</span> 
                   يستخدم نظامنا نموذج (Gemma 2) لتحليل المعطيات وتقديم توصيات فنية دقيقة لدمج الأثاث الوطني مع التصاميم العالمية. يتم حفظ طلبك ليتم مراجعته من قبل الحرفيين عند الرغبة.
                 </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
