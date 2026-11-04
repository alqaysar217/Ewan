'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Upload, Palette, Wallet, Layout, CheckCircle2, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import Footer from '@/components/Footer';

export default function AIDesignStudio() {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const totalSteps = 4;

  const styles = [
    { id: 'modern', name: 'مودرن', icon: '🛋️' },
    { id: 'classic', name: 'كلاسيك', icon: '🏛️' },
    { id: 'boho', name: 'بوهيمي', icon: '🌿' },
    { id: 'scandi', name: 'اسكندنافي', icon: '❄️' },
    { id: 'industrial', name: 'صناعي', icon: '🏭' },
    { id: 'arabic', name: 'تراثي عصري', icon: '🕌' }
  ];

  const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <div className="container mx-auto py-12 px-4 max-w-5xl flex-1">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-black border border-primary/20">
            <Sparkles className="w-4 h-4" /> استوديو إيوان الذكي
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-secondary">صمم غرفتك بذكاء</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ارفع صورة لغرفتك الحالية، اختر طرازك المفضل، ودع ذكاءنا الاصطناعي يقترح لك التصميم المثالي بقطع أثاث حقيقية.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 space-y-4 max-w-2xl mx-auto">
          <div className="flex justify-between text-sm font-bold text-secondary">
            <span>الخطوة {step} من {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% مكتمل</span>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-3 rounded-full bg-gray-100" />
        </div>

        {/* Wizard Content */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-secondary/5 border border-border/50 overflow-hidden min-h-[500px] flex flex-col mb-12">
          
          <div className="flex-1 p-8 md:p-12">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-secondary flex items-center justify-center gap-3">
                    <Upload className="text-primary w-6 h-6" /> ارفع صورة غرفتك
                  </h3>
                  <p className="text-muted-foreground">تأكد من أن الغرفة مضاءة جيداً والزاوية واسعة</p>
                </div>
                
                <div className="border-4 border-dashed border-gray-100 rounded-[2.5rem] p-12 text-center hover:border-primary/30 transition-colors cursor-pointer group bg-gray-50/50">
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-lg font-bold text-secondary mb-2">اضغط هنا لرفع الصورة</p>
                  <p className="text-sm text-muted-foreground">يدعم ملفات JPG, PNG حتى 10MB</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 text-center">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-secondary flex items-center justify-center gap-3">
                    <Palette className="text-primary w-6 h-6" /> اختر طراز التصميم
                  </h3>
                  <p className="text-muted-foreground">أي الأنماط تصف ذوقك الشخصي؟</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {styles.map((style) => (
                    <div 
                      key={style.id}
                      className="p-8 rounded-[2rem] border-2 border-gray-50 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group text-center space-y-4"
                    >
                      <span className="text-4xl block">{style.icon}</span>
                      <p className="font-black text-secondary group-hover:text-primary">{style.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-secondary flex items-center justify-center gap-3">
                    <Wallet className="text-primary w-6 h-6" /> حدد ميزانيتك
                  </h3>
                  <p className="text-muted-foreground">سنقترح قطع أثاث تناسب قدرتك الشرائية</p>
                </div>

                <div className="max-w-md mx-auto space-y-8 py-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="font-bold text-secondary">من (SAR)</Label>
                      <input type="number" placeholder="1,000" className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 font-bold focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-bold text-secondary">إلى (SAR)</Label>
                      <input type="number" placeholder="5,000" className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 font-bold focus:ring-2 focus:ring-primary" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 text-center">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-secondary">كل شيء جاهز!</h3>
                  <p className="text-muted-foreground text-lg">سيقوم الذكاء الاصطناعي الآن بتحليل صورتك وإنتاج 3 خيارات تصميم مذهلة.</p>
                </div>
                <div className="p-8 bg-gray-50 rounded-[2rem] max-w-md mx-auto text-right space-y-3">
                  <div className="flex justify-between items-center"><span className="text-muted-foreground font-bold">الغرفة:</span> <span className="font-black text-secondary">غرفة معيشة</span></div>
                  <div className="flex justify-between items-center"><span className="text-muted-foreground font-bold">الطراز:</span> <span className="font-black text-secondary">مودرن</span></div>
                  <div className="flex justify-between items-center"><span className="text-muted-foreground font-bold">الميزانية:</span> <span className="font-black text-secondary">1000 - 5000 SAR</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-8 bg-gray-50/50 border-t border-border/50 flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              disabled={step === 1}
              className="rounded-2xl h-14 px-8 font-bold text-secondary hover:bg-white"
            >
              <ArrowRight className="w-5 h-5 ml-2" /> السابق
            </Button>

            {step < totalSteps ? (
              <Button 
                onClick={handleNext} 
                className="rounded-2xl h-14 px-12 bg-secondary hover:bg-secondary/90 text-white font-bold text-lg shadow-xl shadow-secondary/20"
              >
                التالي <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            ) : (
              <Button 
                className="rounded-2xl h-14 px-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 animate-pulse"
              >
                إنتاج التصميم الآن <Sparkles className="w-5 h-5 mr-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
