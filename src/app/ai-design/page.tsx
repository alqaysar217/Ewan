'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  Trash2,
  Maximize2,
  Home,
  Plus,
  Coins,
  Search,
  Layout,
  ChevronRight,
  ChevronLeft
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

export default function AIDesignStudio() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'auto' | 'manual' | null>(null);
  const [roomType, setRoomType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const totalSteps = 6;

  const styles = [
    { id: 'modern', name: 'مودرن حديث', img: 'https://picsum.photos/seed/style-modern/400/300', hint: 'modern interior' },
    { id: 'classic', name: 'كلاسيك ملكي', img: 'https://picsum.photos/seed/style-classic/400/300', hint: 'classic luxury interior' },
    { id: 'boho', name: 'بوهيمي ريفي', img: 'https://picsum.photos/seed/style-boho/400/300', hint: 'bohemian room' },
    { id: 'scandi', name: 'اسكندنافي هادئ', img: 'https://picsum.photos/seed/style-scandi/400/300', hint: 'scandinavian design' },
    { id: 'industrial', name: 'صناعي جريء', img: 'https://picsum.photos/seed/style-industrial/400/300', hint: 'industrial loft' },
    { id: 'arabic', name: 'تراثي يمني مطور', img: 'https://picsum.photos/seed/style-arabic/400/300', hint: 'modern arabic majlis' }
  ];

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
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />
      
      <main className="flex-1 py-6 md:py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Header Section */}
          <div className="text-center space-y-3 mb-8 md:mb-12">
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 border-r-2 border-primary text-primary mx-auto rounded-l-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider">استوديو إيوان الذكي</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-secondary">صمم مساحتك بالذكاء الاصطناعي</h1>
            <p className="text-muted-foreground text-xs md:text-base max-w-xl mx-auto font-medium">
              حول صورتك إلى تصميم واقعي يجمع بين خيالك وأفضل منتجات إيوان.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 space-y-3 max-w-md mx-auto">
            <div className="flex justify-between items-center text-[10px] md:text-xs font-bold text-secondary">
              <span className="bg-secondary text-white px-2 py-0.5 rounded-sm">الخطوة {step}</span>
              <span className="text-muted-foreground">{Math.round((step / totalSteps) * 100)}% مكتمل</span>
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-1.5 rounded-full bg-gray-100" />
          </div>

          {/* Main Content Area - Reduced rounding to [10px] for sharper look */}
          <Card className="rounded-[10px] border border-border/50 shadow-xl overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="p-4 md:p-10 min-h-[450px] flex flex-col">
                
                {/* Step 1: Upload */}
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6 flex-1">
                    <div className="text-center space-y-1">
                      <h3 className="text-lg md:text-xl font-black text-secondary flex items-center justify-center gap-2">
                        <Upload className="text-primary w-5 h-5" /> ارفع صورة الغرفة
                      </h3>
                      <p className="text-xs text-muted-foreground">تأكد من وضوح الإضاءة وزاوية التصوير</p>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-100 rounded-[10px] p-8 md:p-16 text-center hover:border-primary/30 transition-all cursor-pointer group bg-gray-50/50 flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-[10px] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm md:text-base font-black text-secondary">اسحب الصورة أو اضغط هنا للرفع</p>
                        <p className="text-[10px] text-muted-foreground">PNG, JPG (حد أقصى 10MB)</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Dimensions & Budget */}
                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6 flex-1">
                    <div className="text-center space-y-1">
                      <h3 className="text-lg md:text-xl font-black text-secondary flex items-center justify-center gap-2">
                        <Maximize2 className="text-primary w-5 h-5" /> أبعاد الغرفة والميزانية
                      </h3>
                      <p className="text-xs text-muted-foreground">تحديد الأبعاد يساعد في دقة توزيع الأثاث</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-secondary">
                          <Home className="w-4 h-4 text-primary" />
                          <Label className="font-bold text-xs">نوع الغرفة</Label>
                        </div>
                        <Select onValueChange={setRoomType}>
                          <SelectTrigger className="rounded-[8px] h-11 bg-gray-50 border-none font-bold text-xs">
                            <SelectValue placeholder="اختر نوع الغرفة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="living">غرفة معيشة</SelectItem>
                            <SelectItem value="bedroom">غرفة نوم</SelectItem>
                            <SelectItem value="majlis">مجلس عربي</SelectItem>
                            <SelectItem value="office">مكتب</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-secondary">
                          <Coins className="w-4 h-4 text-primary" />
                          <Label className="font-bold text-xs">الميزانية (ريال يمني)</Label>
                        </div>
                        <div className="flex gap-2">
                          <Input placeholder="من" type="number" className="rounded-[8px] h-11 bg-gray-50 border-none font-bold text-xs" />
                          <Input placeholder="إلى" type="number" className="rounded-[8px] h-11 bg-gray-50 border-none font-bold text-xs" />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center gap-2 text-secondary">
                          <Ruler className="w-4 h-4 text-primary" />
                          <Label className="font-bold text-xs">مقاسات المساحة (متر)</Label>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                             <Input placeholder="الطول" type="number" className="rounded-[8px] h-11 bg-gray-50 border-none font-bold text-center text-xs" />
                          </div>
                          <div className="space-y-1">
                             <Input placeholder="العرض" type="number" className="rounded-[8px] h-11 bg-gray-50 border-none font-bold text-center text-xs" />
                          </div>
                          <div className="space-y-1">
                             <Input placeholder="الارتفاع" type="number" className="rounded-[8px] h-11 bg-gray-50 border-none font-bold text-center text-xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Selection Strategy */}
                {step === 3 && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6 flex-1">
                    <div className="text-center space-y-1">
                      <h3 className="text-lg md:text-xl font-black text-secondary flex items-center justify-center gap-2">
                        <MousePointerClick className="text-primary w-5 h-5" /> كيف نختار الأثاث؟
                      </h3>
                      <p className="text-xs text-muted-foreground">اختر الطريقة التي تفضلها لتنسيق غرفتك</p>
                    </div>

                    <RadioGroup 
                      value={selectionMode || ''} 
                      onValueChange={(val: any) => setSelectionMode(val)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 max-w-xl mx-auto"
                    >
                      <Label
                        htmlFor="mode-auto"
                        className={cn(
                          "flex flex-col items-center gap-4 p-6 rounded-[10px] border-2 transition-all cursor-pointer text-center",
                          selectionMode === 'auto' ? "border-primary bg-primary/5" : "border-gray-50 hover:bg-gray-50"
                        )}
                      >
                        <RadioGroupItem value="auto" id="mode-auto" className="sr-only" />
                        <div className="w-12 h-12 bg-primary/10 rounded-[8px] flex items-center justify-center shadow-inner">
                          <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-secondary">اختيار ذكي تلقائي</p>
                          <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">سيتولى النظام اختيار القطع الأكثر تناسقاً مع مساحتك.</p>
                        </div>
                      </Label>

                      <Label
                        htmlFor="mode-manual"
                        className={cn(
                          "flex flex-col items-center gap-4 p-6 rounded-[10px] border-2 transition-all cursor-pointer text-center",
                          selectionMode === 'manual' ? "border-primary bg-primary/5" : "border-gray-50 hover:bg-gray-50"
                        )}
                      >
                        <RadioGroupItem value="manual" id="mode-manual" className="sr-only" />
                        <div className="w-12 h-12 bg-secondary/10 rounded-[8px] flex items-center justify-center shadow-inner">
                          <MousePointerClick className="w-6 h-6 text-secondary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-secondary">اختيار يدوي مخصص</p>
                          <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">تصفح الكتالوج واختر القطع التي تحبها لنضعها في التصميم.</p>
                        </div>
                      </Label>
                    </RadioGroup>
                  </div>
                )}

                {/* Step 4: Product Picking (Manual Mode Only) */}
                {step === 4 && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4 flex-1">
                    <div className="text-center space-y-1">
                      <h3 className="text-lg font-black text-secondary">حدد المنتجات المطلوبة</h3>
                      <p className="text-[10px] text-muted-foreground">اختر 3 قطع على الأقل ليتم دمجها في صورتك</p>
                    </div>

                    <div className="relative max-w-md mx-auto">
                       <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <Input 
                        placeholder="ابحث عن أريكة، طاولة، سجاد..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-9 h-10 rounded-[8px] border-gray-100 bg-gray-50 text-xs font-bold" 
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-square bg-gray-50 rounded-[8px] border border-transparent hover:border-primary cursor-pointer relative overflow-hidden group shadow-sm">
                           <Image 
                            src={`https://picsum.photos/seed/product-${i}/300/300`} 
                            alt="Product" 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform"
                            data-ai-hint="furniture item"
                           />
                           <div className="absolute top-1 right-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                             <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                           </div>
                           <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/60 text-white text-[9px] font-bold">
                             منتج إيوان المختار {i}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Design Style with Images */}
                {step === 5 && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6 flex-1">
                    <div className="text-center space-y-1">
                      <h3 className="text-lg md:text-xl font-black text-secondary flex items-center justify-center gap-2">
                        <Palette className="text-primary w-5 h-5" /> اختر طابع التصميم
                      </h3>
                      <p className="text-xs text-muted-foreground">حدد التوجه البصري الذي ترغب برؤيته</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                      {styles.map((style) => (
                        <div 
                          key={style.id}
                          className="group relative aspect-[4/3] rounded-[10px] overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer shadow-sm transition-all"
                        >
                          <Image src={style.img} alt={style.name} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint={style.hint} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                             <p className="text-[10px] md:text-xs font-black text-white">{style.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 6: Final Confirm */}
                {step === 6 && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6 flex-1 text-center py-6">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl md:text-2xl font-black text-secondary">جاهز لتوليد الإبداع</h3>
                      <p className="text-[10px] md:text-xs text-muted-foreground font-medium">تم تجميع كافة تفضيلاتك، سنقوم الآن بإنتاج التصميم الخاص بك.</p>
                    </div>
                    
                    <div className="max-w-xs mx-auto bg-gray-50 border-none rounded-[10px] p-4 text-right space-y-3">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-muted-foreground font-bold flex items-center gap-1.5"><MousePointerClick className="w-3 h-3"/> النمط:</span>
                        <span className="font-black text-primary">{selectionMode === 'auto' ? 'تلقائي ذكي' : 'يدوي مخصص'}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-muted-foreground font-bold flex items-center gap-1.5"><Home className="w-3 h-3"/> الغرفة:</span>
                        <span className="font-black text-secondary">غرفة معيشة</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-muted-foreground font-bold flex items-center gap-1.5"><Palette className="w-3 h-3"/> الطراز:</span>
                        <span className="font-black text-secondary">مودرن حديث</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Swapped Navigation Buttons - "Next" on the Right, "Back" on the Left (in RTL context) */}
              <div className="p-4 md:p-6 bg-gray-50/50 border-t border-border/50 flex flex-row items-center justify-between gap-4">
                
                {/* Back Button (Moved to Right relative to text order, but visually Left in RTL) */}
                <Button 
                  variant="ghost" 
                  onClick={handleBack} 
                  disabled={step === 1}
                  className="rounded-[8px] h-10 px-6 font-bold text-secondary text-xs flex items-center gap-1.5 order-2"
                >
                  <ArrowRight className="w-4 h-4" /> السابق
                </Button>

                {/* Continue Button (Moved to Left relative to text order, but visually Right in RTL) */}
                <div className="flex-1 max-w-[200px] order-1">
                   {step < totalSteps ? (
                    <Button 
                      onClick={handleNext} 
                      className="w-full h-10 px-6 bg-secondary hover:bg-secondary/90 text-white font-black text-xs shadow-md rounded-[8px] flex items-center gap-1.5"
                    >
                      متابعة الخطوات <ArrowLeft className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      className="w-full h-10 px-6 bg-primary hover:bg-primary/90 text-white font-black text-xs shadow-md rounded-[8px] animate-pulse flex items-center gap-1.5"
                    >
                      توليد التصميم <Zap className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
              </div>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'دقة التصوير', desc: 'استخدم صوراً واضحة لنتائج دقيقة.', icon: Info },
              { title: 'أثاث حقيقي', desc: 'كافة المقترحات متوفرة في إيوان.', icon: Sparkles },
              { title: 'تنسيق ذكي', desc: 'الذكاء الاصطناعي يراعي مقاساتك.', icon: Ruler }
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-[10px] border border-border/50 shadow-sm">
                <div className="w-8 h-8 bg-primary/10 rounded-[6px] flex items-center justify-center shrink-0">
                  <tip.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-black text-secondary text-[11px]">{tip.title}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
