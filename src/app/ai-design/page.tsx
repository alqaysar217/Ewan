'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
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
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// تصنيفات الغرف
const ROOM_TYPES = [
  { id: 'living', name: 'غرفة معيشة', icon: Home },
  { id: 'bedroom', name: 'غرفة نوم', icon: Layers },
  { id: 'kitchen', name: 'مطبخ', icon: Layout },
  { id: 'majlis', name: 'مجلس عربي', icon: Palette },
  { id: 'office', name: 'مكتب منزلي', icon: Ruler }
];

// أنماط التصميم
const DESIGN_STYLES = [
  { id: 'modern', name: 'مودرن حديث', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400' },
  { id: 'classic', name: 'كلاسيك فاخر', img: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=400' },
  { id: 'minimalist', name: 'بسيط / مينيمال', img: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=400' },
  { id: 'traditional', name: 'تراثي مطور', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400' }
];

const compressImage = (base64Str: string, maxWidth = 1200): Promise<string> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
  });
};

export default function AIDesignStudio() {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const totalSteps = 6;
  const { user } = useUser();
  const db = useFirestore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // بيانات النموذج
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<string>('living');
  const [selectedStyle, setSelectedStyle] = useState<string>('modern');
  const [selectionMode, setSelectionMode] = useState<'auto' | 'manual'>('auto');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState({ min: '100000', max: '500000' });
  const [searchQuery, setSearchQuery] = useState('');

  // جلب المنتجات للاختيار اليدوي
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
        setStep(2); // الانتقال للخطوة التالية تلقائياً عند رفع الصورة
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
    
    // تخطي خطوة اختيار المنتجات إذا كان الوضع "تلقائي"
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
    try {
      const requestData = {
        user_id: user?.uid || 'guest',
        original_image_url: originalImage,
        room_type: roomType,
        selected_style: selectedStyle,
        selection_mode: selectionMode,
        selected_products: selectedProductIds,
        budget_min: Number(budgetRange.min),
        budget_max: Number(budgetRange.max),
        status: 'queued',
        created_at: serverTimestamp()
      };

      await addDoc(collection(db, 'ai_design_requests'), requestData);
      
      toast({
        title: "تم استلام طلبك بنجاح",
        description: "سيقوم نظام الذكاء الاصطناعي بمعالجة تصميمك وإرساله لبريدك الإلكتروني.",
      });
      
      // إعادة التوجيه للرئيسية بعد النجاح
      setTimeout(() => window.location.href = '/', 3000);
    } catch (error) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل في إرسال الطلب، حاول لاحقاً." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col font-cairo" dir="rtl">
      <Header />
      
      <main className="flex-1 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header Progress */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-black text-secondary">
                <span>المرحلة {step} من {totalSteps}</span>
                <span>{Math.round((step / totalSteps) * 100)}% مكتمل</span>
              </div>
              <Progress value={(step / totalSteps) * 100} className="h-2 rounded-full" />
            </div>

            <Card className="border-none shadow-2xl rounded-[30px] overflow-hidden bg-white/90 backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="min-h-[600px] flex flex-col">
                  
                  {/* Content Area */}
                  <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      {/* Step 1: Upload Photo */}
                      {step === 1 && (
                        <motion.div 
                          key="step1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-10"
                        >
                          <div className="text-center space-y-3">
                            <h3 className="text-3xl font-black text-secondary">ابدأ بتحميل صورة غرفتك</h3>
                            <p className="text-muted-foreground font-bold">التقط صورة واضحة لغرفتك الحالية ليتمكن الذكاء الاصطناعي من تحليلها.</p>
                          </div>
                          
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative border-4 border-dashed border-gray-100 rounded-[30px] p-16 md:p-24 text-center hover:border-primary/40 transition-all cursor-pointer bg-gray-50/50 flex flex-col items-center justify-center gap-6"
                          >
                             {originalImage ? (
                               <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                                  <Image src={originalImage} alt="Preview" fill className="object-cover" />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                     <p className="text-white font-black">تغيير الصورة</p>
                                  </div>
                               </div>
                             ) : (
                               <>
                                 <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                   <Camera className="w-12 h-12" />
                                 </div>
                                 <div className="space-y-2">
                                   <p className="text-xl md:text-2xl font-black text-secondary">اسحب الصورة هنا أو انقر للاختيار</p>
                                   <p className="text-sm text-muted-foreground font-bold">يدعم JPG, PNG (بحد أقصى 5 ميجابايت)</p>
                                 </div>
                               </>
                             )}
                             <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Room Type */}
                      {step === 2 && (
                        <motion.div 
                          key="step2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-10"
                        >
                          <div className="text-center space-y-3">
                            <h3 className="text-3xl font-black text-secondary">ما نوع هذه المساحة؟</h3>
                            <p className="text-muted-foreground font-bold">اختر نوع الغرفة التي ترغب في إعادة تصميمها.</p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {ROOM_TYPES.map((type) => (
                              <div 
                                key={type.id}
                                onClick={() => setRoomType(type.id)}
                                className={cn(
                                  "p-8 rounded-[24px] border-2 transition-all cursor-pointer flex flex-col items-center gap-4 text-center group",
                                  roomType === type.id ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-gray-50 bg-gray-50/30 hover:border-gray-200"
                                )}
                              >
                                <type.icon className={cn("w-10 h-10 transition-colors", roomType === type.id ? "text-primary" : "text-gray-400 group-hover:text-secondary")} />
                                <span className={cn("font-black text-sm", roomType === type.id ? "text-primary" : "text-secondary")}>{type.name}</span>
                                {roomType === type.id && <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Design Style */}
                      {step === 3 && (
                        <motion.div 
                          key="step3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-10"
                        >
                          <div className="text-center space-y-3">
                            <h3 className="text-3xl font-black text-secondary">اختر نمطك المفضل</h3>
                            <p className="text-muted-foreground font-bold">سيعتمد الذكاء الاصطناعي على هذا النمط في توليد الألوان والأثاث.</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {DESIGN_STYLES.map((style) => (
                              <div 
                                key={style.id}
                                onClick={() => setSelectedStyle(style.id)}
                                className={cn(
                                  "relative h-48 rounded-[24px] overflow-hidden cursor-pointer group transition-all",
                                  selectedStyle === style.id ? "ring-4 ring-primary shadow-2xl" : "opacity-70 hover:opacity-100"
                                )}
                              >
                                <Image src={style.img} alt={style.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-6 right-6 left-6 flex justify-between items-center text-white">
                                  <span className="text-xl font-black">{style.name}</span>
                                  {selectedStyle === style.id && <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"><Check className="w-5 h-5" /></div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Step 4: Selection Mode */}
                      {step === 4 && (
                        <motion.div 
                          key="step4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-10"
                        >
                          <div className="text-center space-y-3">
                            <h3 className="text-3xl font-black text-secondary">طريقة اختيار القطع</h3>
                            <p className="text-muted-foreground font-bold">هل تريد أن يقترح النظام قطعاً تلقائياً أم ترغب باختيارها من المتجر؟</p>
                          </div>

                          <div className="flex flex-col gap-6 max-w-lg mx-auto">
                            <div 
                              onClick={() => setSelectionMode('auto')}
                              className={cn(
                                "p-8 rounded-[24px] border-2 cursor-pointer transition-all flex items-center gap-6",
                                selectionMode === 'auto' ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-gray-100 hover:border-gray-200"
                              )}
                            >
                               <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0", selectionMode === 'auto' ? "bg-primary text-white" : "bg-gray-100 text-gray-400")}>
                                  <Sparkles className="w-8 h-8" />
                               </div>
                               <div>
                                  <h4 className="font-black text-lg text-secondary">اقتراحات تلقائية ذكية</h4>
                                  <p className="text-sm text-muted-foreground font-bold">دع الذكاء الاصطناعي يختار القطع المناسبة لمساحتك.</p>
                               </div>
                               {selectionMode === 'auto' && <CheckCircle2 className="w-6 h-6 text-primary mr-auto" />}
                            </div>

                            <div 
                              onClick={() => setSelectionMode('manual')}
                              className={cn(
                                "p-8 rounded-[24px] border-2 cursor-pointer transition-all flex items-center gap-6",
                                selectionMode === 'manual' ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-gray-100 hover:border-gray-200"
                              )}
                            >
                               <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0", selectionMode === 'manual' ? "bg-primary text-white" : "bg-gray-100 text-gray-400")}>
                                  <ShoppingBag className="w-8 h-8" />
                               </div>
                               <div>
                                  <h4 className="font-black text-lg text-secondary">اختيار يدوي من الكتالوج</h4>
                                  <p className="text-sm text-muted-foreground font-bold">تصفح القطع المتوفرة في المتجر وقم بتنسيقها بنفسك.</p>
                               </div>
                               {selectionMode === 'manual' && <CheckCircle2 className="w-6 h-6 text-primary mr-auto" />}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 5: Manual Product Selection (Only if manual mode) */}
                      {step === 5 && (
                        <motion.div 
                          key="step5"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-8"
                        >
                          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                               <h3 className="text-2xl font-black text-secondary">اختر قطعك المفضلة</h3>
                               <p className="text-muted-foreground font-bold">حدد المنتجات التي تريد تضمينها في التصميم.</p>
                            </div>
                            <div className="relative w-full md:w-80 group">
                              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input 
                                placeholder="ابحث في المتجر..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                className="pr-10 h-12 rounded-xl bg-gray-100/50 border-none" 
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {productsLoading ? (
                               [1,2,3,4,5].map(i => <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl" />)
                            ) : filteredProducts.length === 0 ? (
                               <div className="col-span-full py-20 text-center opacity-30 font-black">لم يتم العثور على منتجات.</div>
                            ) : (
                              filteredProducts.map(product => (
                                <div 
                                  key={product.id} 
                                  onClick={() => toggleProductSelection(product.id)} 
                                  className={cn(
                                    "group relative aspect-[3/4] bg-white rounded-2xl border-4 transition-all cursor-pointer overflow-hidden",
                                    selectedProductIds.includes(product.id) ? "border-primary" : "border-transparent"
                                  )}
                                >
                                  <Image src={product.image_base64 || `https://picsum.photos/seed/${product.id}/600/800`} alt={product.name_ar} fill className="object-cover" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                  <div className="absolute bottom-3 right-3 left-3 text-white">
                                    <p className="font-black text-[10px] leading-tight line-clamp-2">{product.name_ar}</p>
                                    <p className="text-primary font-bold text-[10px] mt-1">{product.price.toLocaleString()} ر.ي</p>
                                  </div>
                                  {selectedProductIds.includes(product.id) && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                       <Check className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* Step 6: Budget & Summary */}
                      {step === 6 && (
                        <motion.div 
                          key="step6"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-10"
                        >
                          <div className="text-center space-y-3">
                            <h3 className="text-3xl font-black text-secondary">ميزانية العمل المقترحة</h3>
                            <p className="text-muted-foreground font-bold">حدد نطاق الميزانية الذي تفكر فيه لتنفيذ هذا التصميم.</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                             <div className="space-y-3">
                                <Label className="font-black text-secondary">الميزانية الدنيا (ر.ي)</Label>
                                <Input 
                                  type="number" 
                                  value={budgetRange.min} 
                                  onChange={e => setBudgetRange({...budgetRange, min: e.target.value})}
                                  className="h-14 rounded-2xl bg-gray-50 border-none font-black text-lg"
                                />
                             </div>
                             <div className="space-y-3">
                                <Label className="font-black text-secondary">الميزانية القصوى (ر.ي)</Label>
                                <Input 
                                  type="number" 
                                  value={budgetRange.max} 
                                  onChange={e => setBudgetRange({...budgetRange, max: e.target.value})}
                                  className="h-14 rounded-2xl bg-gray-50 border-none font-black text-lg"
                                />
                             </div>
                          </div>

                          <div className="p-8 bg-primary/5 rounded-[30px] border border-primary/10 space-y-6">
                             <h4 className="font-black text-secondary flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" /> ملخص طلبك الذكي
                             </h4>
                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                                <div>
                                   <p className="text-muted-foreground font-bold mb-1">نوع الغرفة</p>
                                   <p className="font-black text-secondary">{ROOM_TYPES.find(t => t.id === roomType)?.name}</p>
                                </div>
                                <div>
                                   <p className="text-muted-foreground font-bold mb-1">النمط المختار</p>
                                   <p className="font-black text-secondary">{DESIGN_STYLES.find(s => s.id === selectedStyle)?.name}</p>
                                </div>
                                <div>
                                   <p className="text-muted-foreground font-bold mb-1">طريقة الاختيار</p>
                                   <p className="font-black text-secondary">{selectionMode === 'auto' ? 'تلقائي (AI)' : 'يدوي'}</p>
                                </div>
                                <div>
                                   <p className="text-muted-foreground font-bold mb-1">القطع المختارة</p>
                                   <p className="font-black text-secondary">{selectionMode === 'manual' ? `${selectedProductIds.length} قطعة` : 'حسب اقتراح AI'}</p>
                                </div>
                             </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-8 md:p-10 bg-gray-50/50 border-t flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex gap-4 w-full md:w-auto order-2 md:order-1">
                       <Button 
                         variant="ghost" 
                         onClick={handleBack} 
                         disabled={step === 1 || isSaving} 
                         className="flex-1 md:flex-none rounded-2xl h-14 px-10 font-black gap-2"
                       >
                         <ArrowRight className="w-5 h-5" /> المرحلة السابقة
                       </Button>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto order-1 md:order-2">
                       {step < totalSteps ? (
                         <Button 
                           onClick={handleNext} 
                           disabled={isSaving}
                           className="flex-1 md:min-w-[240px] h-14 bg-secondary text-white font-black rounded-2xl shadow-xl shadow-secondary/20 gap-2 text-lg"
                         >
                           المتابعة <ArrowLeft className="w-5 h-5" />
                         </Button>
                       ) : (
                         <Button 
                           onClick={handleSubmitRequest} 
                           disabled={isSaving}
                           className="flex-1 md:min-w-[240px] h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 gap-2 text-lg animate-pulse"
                         >
                           {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <>توليد التصميم الآن <Zap className="w-5 h-5 fill-current" /></>}
                         </Button>
                       )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hint Box */}
            <div className="p-6 bg-white border border-border/50 rounded-2xl flex items-start gap-4">
               <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-amber-600" />
               </div>
               <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                 <span className="font-black text-secondary block mb-1">ملاحظة تقنية:</span>
                 سيقوم نظام إيوان للذكاء الاصطناعي بتحليل الأبعاد، الإضاءة، والمساحة في صورتك لتقديم اقتراح يضمن أفضل استغلال للمكان مع مراعاة طراز الأثاث الذي اخترته.
               </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
