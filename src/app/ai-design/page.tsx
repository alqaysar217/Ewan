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
  Coins
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
  const totalSteps = 6;

  const styles = [
    { id: 'modern', name: 'مودرن', icon: '🛋️' },
    { id: 'classic', name: 'كلاسيك', icon: '🏛️' },
    { id: 'boho', name: 'بوهيمي', icon: '🌿' },
    { id: 'scandi', name: 'اسكندنافي', icon: '❄️' },
    { id: 'industrial', name: 'صناعي', icon: '🏭' },
    { id: 'arabic', name: 'تراثي عصري', icon: '🕌' }
  ];

  const handleNext = () => {
    if (step === 3 && selectionMode === 'auto') {
      setStep(5); // Skip manual product selection
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
      
      <main className="flex-1 py-8 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header Section */}
          <div className="text-center space-y-4 mb-10 md:mb-16">
            <div className="relative inline-flex items-center px-4 py-1.5 bg-primary/10 border-r-4 border-primary text-primary overflow-hidden mx-auto rounded-l-md">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase">استوديو إيوان الذكي</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-secondary leading-tight">صمم مساحتك بالذكاء الاصطناعي</h1>
            <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium">
              رحلة ابتكارية تبدأ بصورة وتنتهي بتصميم واقعي يجمع بين خيالك وأفضل منتجات إيوان.
            </p>
          </div>

          {/* Progress Section */}
          <div className="mb-10 space-y-4 max-w-xl mx-auto">
            <div className="flex justify-between items-center text-xs md:text-sm font-bold text-secondary">
              <span className="bg-secondary text-white px-3 py-1 rounded-full">الخطوة {step}</span>
              <span className="text-muted-foreground">{Math.round((step / totalSteps) * 100)}% مكتمل</span>
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2 rounded-full bg-gray-100" />
          </div>

          {/* Wizard Card */}
          <Card className="rounded-[20px] md:rounded-[30px] border-none shadow-2xl shadow-secondary/5 overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="p-6 md:p-12 min-h-[500px] flex flex-col">
                
                {/* Step 1: Image Upload */}
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 flex-1">
                    <div className="text-center space-y-2">
                      <h3 className="text-xl md:text-2xl font-black text-secondary flex items-center justify-center gap-3">
                        <Upload className="text-primary w-6 h-6" /> ارفع صورة الغرفة
                      </h3>
                      <p className="text-sm text-muted-foreground">يفضل أن تكون الصورة بزاوية واسعة وإضاءة جيدة</p>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-100 rounded-[20px] p-10 md:p-16 text-center hover:border-primary/30 transition-all cursor-pointer group bg-gray-50/50 flex flex-col items-center justify-center gap-6">
                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="w-10 h-10 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-black text-secondary">اسحب الصورة أو اضغط هنا</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG (حد أقصى 10MB)</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Room Details & Dimensions */}
                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 flex-1">
                    <div className="text-center space-y-2">
                      <h3 className="text-xl md:text-2xl font-black text-secondary flex items-center justify-center gap-3">
                        <Maximize2 className="text-primary w-6 h-6" /> تفاصيل المساحة والميزانية
                      </h3>
                      <p className="text-sm text-muted-foreground">أدخل معلومات دقيقة لضمان تناسق التصميم</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-secondary">
                          <Home className="w-4 h-4 text-primary" />
                          <Label className="font-black text-sm">نوع الغرفة</Label>
                        </div>
                        <Select onValueChange={setRoomType}>
                          <SelectTrigger className="rounded-xl h-12 bg-gray-50 border-none font-bold">
                            <SelectValue placeholder="اختر نوع الغرفة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="living">غرفة معيشة</SelectItem>
                            <SelectItem value="bedroom">غرفة نوم</SelectItem>
                            <SelectItem value="majlis">مجلس عربي</SelectItem>
                            <SelectItem value="office">مكتب</SelectItem>
                            <SelectItem value="dining">غرفة طعام</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-secondary">
                          <Coins className="w-4 h-4 text-primary" />
                          <Label className="font-black text-sm">الميزانية التقديرية (ر.ي)</Label>
                        </div>
                        <div className="flex gap-4">
                          <Input placeholder="من" type="number" className="rounded-xl h-12 bg-gray-50 border-none font-bold" />
                          <Input placeholder="إلى" type="number" className="rounded-xl h-12 bg-gray-50 border-none font-bold" />
                        </div>
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center gap-2 text-secondary">
                          <Ruler className="w-4 h-4 text-primary" />
                          <Label className="font-black text-sm">أبعاد الغرفة (بالأمتار)</Label>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <Input placeholder="الطول" type="number" className="rounded-xl h-12 bg-gray-50 border-none font-bold text-center" />
                          <Input placeholder="العرض" type="number" className="rounded-xl h-12 bg-gray-50 border-none font-bold text-center" />
                          <Input placeholder="الارتفاع" type="number" className="rounded-xl h-12 bg-gray-50 border-none font-bold text-center" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Selection Mode */}
                {step === 3 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 flex-1">
                    <div className="text-center space-y-2">
                      <h3 className="text-xl md:text-2xl font-black text-secondary flex items-center justify-center gap-3">
                        <MousePointerClick className="text-primary w-6 h-6" /> طريقة اختيار المنتجات
                      </h3>
                      <p className="text-sm text-muted-foreground">كيف تود اختيار قطع الأثاث في تصميمك؟</p>
                    </div>

                    <RadioGroup 
                      value={selectionMode || ''} 
                      onValueChange={(val: any) => setSelectionMode(val)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 max-w-2xl mx-auto"
                    >
                      <Label
                        htmlFor="mode-auto"
                        className={cn(
                          "flex flex-col items-center gap-6 p-8 rounded-[25px] border-2 transition-all cursor-pointer text-center",
                          selectionMode === 'auto' ? "border-primary bg-primary/5" : "border-gray-50 hover:bg-gray-50"
                        )}
                      >
                        <RadioGroupItem value="auto" id="mode-auto" className="sr-only" />
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                          <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-black text-secondary">اختيار ذكي تلقائي</p>
                          <p className="text-xs text-muted-foreground font-medium">سيتولى الذكاء الاصطناعي اختيار أفضل القطع المتوافقة مع ذوقك وميزانيتك.</p>
                        </div>
                      </Label>

                      <Label
                        htmlFor="mode-manual"
                        className={cn(
                          "flex flex-col items-center gap-6 p-8 rounded-[25px] border-2 transition-all cursor-pointer text-center",
                          selectionMode === 'manual' ? "border-primary bg-primary/5" : "border-gray-50 hover:bg-gray-50"
                        )}
                      >
                        <RadioGroupItem value="manual" id="mode-manual" className="sr-only" />
                        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center shadow-inner">
                          <MousePointerClick className="w-8 h-8 text-secondary" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-black text-secondary">اختيار يدوي مخصص</p>
                          <p className="text-xs text-muted-foreground font-medium">تصفح الكتالوج بنفسك واختر القطع التي تريد رؤيتها في غرفتك.</p>
                        </div>
                      </Label>
                    </RadioGroup>
                  </div>
                )}

                {/* Step 4: Manual Selection (If Manual Mode) */}
                {step === 4 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 flex-1 text-center">
                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-black text-secondary">تصفح واختر المنتجات</h3>
                      <p className="text-sm text-muted-foreground">حدد 3-5 قطع ليقوم النظام بدمجها في صورتك</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-square bg-gray-50 rounded-2xl border border-transparent hover:border-primary cursor-pointer relative overflow-hidden group">
                           <Image src={`https://picsum.photos/seed/manual-p${i}/300/300`} alt="Product" fill className="object-cover group-hover:scale-110 transition-transform" />
                           <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                             <CheckCircle2 className="w-4 h-4 text-primary" />
                           </div>
                           <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-[10px] font-bold">طقم ديوان {i}</div>
                        </div>
                      ))}
                      <Link href="/shop" target="_blank" className="aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground hover:bg-gray-50 transition-colors">
                        <Plus className="w-6 h-6" />
                        <span className="text-xs font-bold">تصفح المتجر</span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Step 5: Style Selection */}
                {step === 5 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 flex-1">
                    <div className="text-center space-y-2">
                      <h3 className="text-xl md:text-2xl font-black text-secondary flex items-center justify-center gap-3">
                        <Palette className="text-primary w-6 h-6" /> اختر نمط التصميم
                      </h3>
                      <p className="text-sm text-muted-foreground">أي الأنماط تصف ذوقك المفضل؟</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pt-4">
                      {styles.map((style) => (
                        <div 
                          key={style.id}
                          className="p-6 rounded-2xl border-2 border-gray-50 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group text-center space-y-4"
                        >
                          <span className="text-4xl block group-hover:scale-125 transition-transform">{style.icon}</span>
                          <p className="font-black text-secondary group-hover:text-primary">{style.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 6: Summary & Generation */}
                {step === 6 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 flex-1 text-center py-10">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/5">
                      <CheckCircle2 className="w-14 h-14" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-3xl font-black text-secondary">كل شيء جاهز للبدء!</h3>
                      <p className="text-muted-foreground text-lg font-medium">سيقوم محرك إيوان الذكي الآن بتحويل خياراتك إلى واقع بصري مذهل.</p>
                    </div>
                    <Card className="max-w-md mx-auto bg-gray-50 border-none rounded-2xl p-6 text-right space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-bold">طريقة الاختيار:</span>
                        <span className="font-black text-primary">{selectionMode === 'auto' ? 'تلقائي ذكي' : 'يدوي مخصص'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-bold">نوع الغرفة:</span>
                        <span className="font-black text-secondary">غرفة معيشة</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-bold">الطراز المختار:</span>
                        <span className="font-black text-secondary">مودرن</span>
                      </div>
                    </Card>
                  </div>
                )}
              </div>

              {/* Bottom Navigation */}
              <div className="p-6 md:p-10 bg-gray-50/50 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                   {step < totalSteps ? (
                    <Button 
                      onClick={handleNext} 
                      className="w-full md:w-64 h-14 px-12 bg-secondary hover:bg-secondary/90 text-white font-black text-lg shadow-xl shadow-secondary/20 rounded-xl flex items-center gap-2"
                    >
                      <ArrowRight className="w-5 h-5" /> متابعة الخطوات
                    </Button>
                  ) : (
                    <Button 
                      className="w-full md:w-64 h-14 px-12 bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 animate-pulse rounded-xl"
                    >
                      توليد التصميم <Zap className="w-5 h-5 mr-2" />
                    </Button>
                  )}
                </div>

                <Button 
                  variant="ghost" 
                  onClick={handleBack} 
                  disabled={step === 1}
                  className="w-full md:w-auto rounded-xl h-14 px-10 font-black text-secondary hover:bg-white flex items-center gap-2"
                >
                  السابق <ArrowLeft className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'دقة عالية', desc: 'استخدم صوراً واضحة لنتائج أفضل.', icon: Info },
              { title: 'منتجات حقيقية', desc: 'كل ما تراه في التصميم متوفر للشراء.', icon: Sparkles },
              { title: 'أبعاد دقيقة', desc: 'تحديد الأبعاد يساعد في تناسق الأحجام.', icon: Ruler }
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-border/50 shadow-sm">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <tip.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-black text-secondary text-sm">{tip.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{tip.desc}</p>
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
