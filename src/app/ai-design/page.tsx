'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  Zap, 
  Upload, 
  Palette, 
  Wallet, 
  Ruler, 
  MousePointerClick, 
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
  Star
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
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';

const MOCK_PRODUCTS = [
  { id: 'm1', name_ar: 'أريكة مخملية زرقاء', price: 250000, category_id: 'living' },
  { id: 'm2', name_ar: 'طاولة طعام خشبية', price: 120000, category_id: 'dining' },
  { id: 'm3', name_ar: 'سرير كلاسيكي فاخر', price: 380000, category_id: 'bedroom' },
  { id: 'm4', name_ar: 'مصباح أرضي مودرن', price: 45000, category_id: 'lighting' },
  { id: 'm5', name_ar: 'خزانة ملابس خشب زان', price: 550000, category_id: 'bedroom' },
  { id: 'm6', name_ar: 'طقم ديوان حضرمي مطور', price: 450000, category_id: 'majlis' },
  { id: 'm7', name_ar: 'كرسي مكتب مريح', price: 65000, category_id: 'office' },
  { id: 'm8', name_ar: 'سجاد يدوي تراثي', price: 85000, category_id: 'decor' },
];

const STYLES = [
  { id: 'modern', name: 'مودرن حديث', img: 'https://picsum.photos/seed/style-modern/600/400', hint: 'modern interior' },
  { id: 'classic', name: 'كلاسيك ملكي', img: 'https://picsum.photos/seed/style-classic/600/400', hint: 'classic luxury interior' },
  { id: 'boho', name: 'بوهيمي ريفي', img: 'https://picsum.photos/seed/style-boho/600/400', hint: 'bohemian room' },
  { id: 'scandi', name: 'اسكندنافي هادئ', img: 'https://picsum.photos/seed/style-scandi/600/400', hint: 'scandinavian design' },
  { id: 'industrial', name: 'صناعي جريء', img: 'https://picsum.photos/seed/style-industrial/600/400', hint: 'industrial loft' },
  { id: 'arabic', name: 'تراثي يمني مطور', img: 'https://picsum.photos/seed/style-arabic/600/400', hint: 'modern arabic majlis' }
];

export default function AIDesignStudio() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'auto' | 'manual' | null>(null);
  const [roomType, setRoomType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const totalSteps = 6;

  const db = useFirestore();
  const { data: allProducts, loading: productsLoading } = useCollection(collection(db, 'products'));

  const displayProducts = useMemo(() => {
    return (allProducts && allProducts.length > 0) ? allProducts : MOCK_PRODUCTS;
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return displayProducts.filter(p => 
      p.name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [displayProducts, searchQuery]);

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 3 && selectionMode === 'auto') {
      setStep(5); 
    } else {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    if (step === 5 && selectionMode === 'auto') {
      setStep(3);
    } else {
      setStep(prev => Math.max(prev - 1, 1));
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col font-sans" dir="rtl">
      <Header />
      
      <main className="flex-1 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Main Content Area */}
            <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[24px] overflow-hidden bg-white/80 backdrop-blur-xl relative">
              <div className="absolute inset-0 border border-white/40 rounded-[24px] pointer-events-none" />
              
              <CardContent className="p-0">
                <div className="min-h-[550px] flex flex-col">
                  
                  <div className="flex-1 p-8 md:p-16">
                    
                    {step === 1 && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                        <div className="text-center space-y-3">
                          <h3 className="text-2xl md:text-3xl font-black text-secondary">البداية تبدأ بصورة</h3>
                          <p className="text-muted-foreground font-medium">ارفع صورة واضحة لغرفتك الحالية لتمكين الذكاء الاصطناعي من تحليل المساحة.</p>
                        </div>
                        
                        <div className="group relative">
                          <div className="absolute inset-0 bg-primary/5 rounded-[20px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative border-2 border-dashed border-gray-100 rounded-[20px] p-12 md:p-24 text-center hover:border-primary/40 transition-all cursor-pointer bg-gray-50/30 flex flex-col items-center justify-center gap-6">
                            <div className="w-24 h-24 bg-white rounded-[24px] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                              <Camera className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-lg md:text-xl font-black text-secondary">انقر هنا أو اسحب الصورة</p>
                              <p className="text-xs text-muted-foreground font-bold tracking-wide uppercase">JPG, PNG up to 10MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                        <div className="text-center space-y-3">
                          <h3 className="text-2xl md:text-3xl font-black text-secondary">المعايير التقنية</h3>
                          <p className="text-muted-foreground font-medium">تحديد أبعاد المساحة يساعدنا في اختيار القطع ذات الحجم المثالي.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <Label className="flex items-center gap-3 text-secondary font-black text-sm uppercase tracking-wider">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Home className="w-4 h-4" /></div>
                              نوع الغرفة
                            </Label>
                            <Select onValueChange={setRoomType}>
                              <SelectTrigger className="h-16 rounded-[16px] border-none bg-gray-50 px-6 font-bold text-base shadow-sm focus:ring-2 focus:ring-primary/20">
                                <SelectValue placeholder="حدد نوع الغرفة..." />
                              </SelectTrigger>
                              <SelectContent className="rounded-[16px] border-none shadow-2xl">
                                <SelectItem value="living" className="font-bold py-3">غرفة معيشة</SelectItem>
                                <SelectItem value="bedroom" className="font-bold py-3">غرفة نوم</SelectItem>
                                <SelectItem value="majlis" className="font-bold py-3">مجلس يمني تراثي</SelectItem>
                                <SelectItem value="office" className="font-bold py-3">مكتب فاخر</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-4">
                            <Label className="flex items-center gap-3 text-secondary font-black text-sm uppercase tracking-wider">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Coins className="w-4 h-4" /></div>
                              الميزانية التقديرية
                            </Label>
                            <div className="flex gap-4">
                              <Input placeholder="من" type="number" className="h-16 rounded-[16px] border-none bg-gray-50 px-6 font-bold text-base shadow-sm focus:ring-2 focus:ring-primary/20" />
                              <Input placeholder="إلى" type="number" className="h-16 rounded-[16px] border-none bg-gray-50 px-6 font-bold text-base shadow-sm focus:ring-2 focus:ring-primary/20" />
                            </div>
                          </div>

                          <div className="space-y-4 md:col-span-2">
                            <Label className="flex items-center gap-3 text-secondary font-black text-sm uppercase tracking-wider">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Ruler className="w-4 h-4" /></div>
                              مقاسات المساحة الفعلية (بالمتر)
                            </Label>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="relative group">
                                <Input placeholder="الطول" type="number" className="h-16 rounded-[16px] border-none bg-gray-50 px-6 font-black text-center text-lg shadow-sm focus:ring-2 focus:ring-primary/20" />
                                <span className="absolute bottom-2 right-1/2 translate-x-1/2 text-[9px] font-black text-muted-foreground/40 uppercase">Length</span>
                              </div>
                              <div className="relative group">
                                <Input placeholder="العرض" type="number" className="h-16 rounded-[16px] border-none bg-gray-50 px-6 font-black text-center text-lg shadow-sm focus:ring-2 focus:ring-primary/20" />
                                <span className="absolute bottom-2 right-1/2 translate-x-1/2 text-[9px] font-black text-muted-foreground/40 uppercase">Width</span>
                              </div>
                              <div className="relative group">
                                <Input placeholder="الارتفاع" type="number" className="h-16 rounded-[16px] border-none bg-gray-50 px-6 font-black text-center text-lg shadow-sm focus:ring-2 focus:ring-primary/20" />
                                <span className="absolute bottom-2 right-1/2 translate-x-1/2 text-[9px] font-black text-muted-foreground/40 uppercase">Height</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                        <div className="text-center space-y-3">
                          <h3 className="text-2xl md:text-3xl font-black text-secondary">من يضع اللمسة الأخيرة؟</h3>
                          <p className="text-muted-foreground font-medium">اختر بين ذكاء الآلة أو ذوقك الشخصي في تنسيق المنتجات.</p>
                        </div>

                        <RadioGroup 
                          value={selectionMode || ''} 
                          onValueChange={(val: any) => setSelectionMode(val)}
                          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto pt-4"
                        >
                          <Label
                            htmlFor="mode-auto"
                            className={cn(
                              "relative group flex flex-col items-center gap-6 p-10 rounded-[24px] border-2 transition-all cursor-pointer text-center",
                              selectionMode === 'auto' ? "border-primary bg-primary/[0.03] shadow-xl" : "border-gray-50 bg-gray-50/50 hover:bg-white hover:shadow-lg"
                            )}
                          >
                            <RadioGroupItem value="auto" id="mode-auto" className="sr-only" />
                            <div className={cn(
                              "w-20 h-20 rounded-[20px] flex items-center justify-center shadow-inner transition-all duration-500",
                              selectionMode === 'auto' ? "bg-primary text-white scale-110" : "bg-white text-primary"
                            )}>
                              <Sparkles className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-xl font-black text-secondary">تنسيق ذكي كامل</p>
                              <p className="text-sm text-muted-foreground font-medium leading-relaxed">دع نظامنا يحلل صورتك ويختار المنتجات الأكثر فخامة وتناسقاً لك.</p>
                            </div>
                            {selectionMode === 'auto' && <div className="absolute top-4 left-4"><CheckCircle2 className="w-6 h-6 text-primary" /></div>}
                          </Label>

                          <Label
                            htmlFor="mode-manual"
                            className={cn(
                              "relative group flex flex-col items-center gap-6 p-10 rounded-[24px] border-2 transition-all cursor-pointer text-center",
                              selectionMode === 'manual' ? "border-secondary bg-secondary/[0.03] shadow-xl" : "border-gray-50 bg-gray-50/50 hover:bg-white hover:shadow-lg"
                            )}
                          >
                            <RadioGroupItem value="manual" id="mode-manual" className="sr-only" />
                            <div className={cn(
                              "w-20 h-20 rounded-[20px] flex items-center justify-center shadow-inner transition-all duration-500",
                              selectionMode === 'manual' ? "bg-secondary text-white scale-110" : "bg-white text-secondary"
                            )}>
                              <MousePointerClick className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-xl font-black text-secondary">اختيار يدوي دقيق</p>
                              <p className="text-sm text-muted-foreground font-medium leading-relaxed">تصفح أرقى المجموعات الحصرية في إيوان وحدد ما ترغب في رؤيته بمساحتك.</p>
                            </div>
                            {selectionMode === 'manual' && <div className="absolute top-4 left-4"><CheckCircle2 className="w-6 h-6 text-secondary" /></div>}
                          </Label>
                        </RadioGroup>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 flex-1">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                          <div className="space-y-2">
                            <h3 className="text-2xl font-black text-secondary flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><ShoppingBag className="w-5 h-5" /></div>
                              تنسيق الكتالوج
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium">اختر قطعة واحدة على الأقل ليتم دمجها في صورتك الشخصية.</p>
                          </div>
                          
                          <div className="relative w-full md:w-80">
                             <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                             <Input 
                              placeholder="ابحث في المجموعة..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pr-12 h-14 rounded-[16px] border-none bg-gray-100/50 font-bold focus:ring-2 focus:ring-primary/20" 
                             />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pt-4">
                          {productsLoading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                              <div key={i} className="aspect-[3/4] bg-gray-50 rounded-[20px] animate-pulse" />
                            ))
                          ) : filteredProducts.length > 0 ? (
                            filteredProducts.map(product => {
                              const isSelected = selectedProductIds.includes(product.id);
                              return (
                                <div 
                                  key={product.id} 
                                  onClick={() => toggleProductSelection(product.id)}
                                  className={cn(
                                    "aspect-[3/4] bg-white rounded-[20px] border-2 transition-all cursor-pointer relative overflow-hidden group shadow-sm",
                                    isSelected ? "border-primary ring-4 ring-primary/10" : "border-transparent hover:border-primary/30"
                                  )}
                                >
                                  <Image 
                                    src={`https://picsum.photos/seed/${product.id}/600/800`} 
                                    alt={product.name_ar} 
                                    fill 
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    data-ai-hint="furniture product"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                  
                                  {isSelected && (
                                    <div className="absolute top-3 right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-xl animate-in zoom-in-50 duration-300 z-20">
                                      <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                  )}
                                  
                                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                                    <p className="text-xs font-black truncate mb-1">{product.name_ar}</p>
                                    <div className="flex justify-between items-center">
                                      <p className="text-[10px] font-bold text-primary-foreground">{(product.price || 0).toLocaleString()} ر.ي</p>
                                      <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"><ChevronRight className="w-3 h-3" /></div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="col-span-full py-24 text-center space-y-4">
                              <Search className="w-16 h-16 text-muted-foreground mx-auto opacity-10" />
                              <p className="text-lg text-muted-foreground font-black">عذراً، لم نجد قطعاً تطابق بحثك</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {step === 5 && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                        <div className="text-center space-y-3">
                          <h3 className="text-2xl md:text-3xl font-black text-secondary">الهوية البصرية</h3>
                          <p className="text-muted-foreground font-medium">حدد الطابع الفني الذي ترغب في أن يتبعه الذكاء الاصطناعي.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          {STYLES.map((style) => (
                            <div 
                              key={style.id}
                              className="group relative aspect-[16/10] rounded-[20px] overflow-hidden border-4 border-transparent hover:border-primary cursor-pointer shadow-xl transition-all duration-500"
                            >
                              <Image src={style.img} alt={style.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" data-ai-hint={style.hint} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-6">
                                 <div className="space-y-1">
                                   <p className="text-sm font-black text-white">{style.name}</p>
                                   <div className="h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                                 </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 6 && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10 text-center py-10">
                        <div className="relative inline-block">
                          <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full" />
                          <div className="w-32 h-32 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl relative border-4 border-white">
                            <CheckCircle2 className="w-16 h-16" />
                          </div>
                        </div>
                        
                        <div className="space-y-3 max-w-xl mx-auto">
                          <h3 className="text-3xl md:text-4xl font-black text-secondary">اكتمال المخطط الذكي</h3>
                          <p className="text-muted-foreground font-medium">تم تجميع كافة تفضيلاتك بنجاح. نحن الآن جاهزون لتحويل صورتك إلى لوحة فنية احترافية.</p>
                        </div>
                        
                        <div className="max-w-md mx-auto grid grid-cols-1 gap-4 text-right pt-4">
                          <div className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm"><Layers className="w-5 h-5" /></div>
                              <span className="text-muted-foreground font-bold">وضع المعالجة</span>
                            </div>
                            <span className="font-black text-secondary">{selectionMode === 'auto' ? 'تنسيق ذكي كامل' : 'اختيار يدوي مخصص'}</span>
                          </div>
                          
                          <div className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm"><Home className="w-5 h-5" /></div>
                              <span className="text-muted-foreground font-bold">المساحة المستهدفة</span>
                            </div>
                            <span className="font-black text-secondary">{roomType || 'غرفة معيشة (افتراضي)'}</span>
                          </div>

                          <div className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm"><Layout className="w-5 h-5" /></div>
                              <span className="text-muted-foreground font-bold">القطع المدرجة</span>
                            </div>
                            <span className="font-black text-secondary">{selectedProductIds.length || (selectionMode === 'auto' ? 'تلقائي' : 0)} قطعة</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Bar */}
                  <div className="p-8 md:p-12 bg-gray-50/80 border-t border-white/50 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    
                    <div className="flex-1 w-full md:max-w-[280px] order-1 md:order-2">
                       {step < totalSteps ? (
                        <Button 
                          onClick={handleNext} 
                          disabled={step === 4 && selectionMode === 'manual' && selectedProductIds.length === 0}
                          className="w-full h-16 bg-secondary hover:bg-secondary/90 text-white font-black text-lg shadow-[0_20px_40px_-10px_rgba(7,61,73,0.3)] rounded-[16px] flex items-center justify-center gap-3 transition-all active:scale-95 group"
                        >
                          المتابعة للمرحلة التالية <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        </Button>
                      ) : (
                        <Button 
                          className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-[0_20px_40px_-10px_rgba(22,136,153,0.3)] rounded-[16px] flex items-center justify-center gap-3 animate-pulse transition-all active:scale-95"
                        >
                          بدء التوليد الإبداعي <Zap className="w-5 h-5 fill-current" />
                        </Button>
                      )}
                    </div>

                    <Button 
                      variant="ghost" 
                      onClick={handleBack} 
                      disabled={step === 1}
                      className="rounded-[16px] h-16 px-10 font-black text-secondary text-lg flex items-center gap-3 order-2 md:order-1 hover:bg-white transition-all disabled:opacity-30 group"
                    >
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /> المرحلة السابقة
                    </Button>
                    
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Professional Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'دقة عالية (8K)', desc: 'نستخدم أقوى محركات الذكاء الاصطناعي لضمان نتائج واقعية تماماً.', icon: Star },
                { title: 'أثاث حقيقي فقط', desc: 'كل ما تراه في النتيجة النهائية متوفر للشراء الفوري من متجرنا.', icon: ShoppingBag },
                { title: 'توصيات ذكية', desc: 'يراعي النظام أبعاد غرفتك وإضاءتها في توزيع قطع الأثاث.', icon: Sparkles }
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-5 p-6 bg-white/40 rounded-[24px] border border-white/60 shadow-sm backdrop-blur-sm group hover:bg-white/80 transition-all duration-500">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <tip.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-secondary text-sm uppercase tracking-wide">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
