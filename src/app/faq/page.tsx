
'use client';

import Link from 'next/link';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Phone, 
  Mail,
  ArrowRight,
  ChevronLeft,
  Filter
} from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

export default function FAQPage() {
  const faqs = [
    {
      category: "التصميم والذكاء الاصطناعي",
      items: [
        { q: "كيف يعمل التصميم بالذكاء الاصطناعي؟", a: "ببساطة، ترفع صورة لغرفتك الحالية، تختار الطراز المفضل (مودرن، كلاسيك..)، وتحدد ميزانيتك. سيقوم نظامنا بتحليل المساحة واقتراح قطع أثاث حقيقية متوفرة في متجرنا تناسب مساحتك." },
        { q: "هل أحتاج لدفع رسوم مقابل استخدام استوديو التصميم؟", a: "استخدام استوديو التصميم بالذكاء الاصطناعي مجاني تماماً لجميع مستخدمي إيوان، حيث نهدف لمساعدتك على اتخاذ قرار الشراء الأنسب." },
        { q: "هل يمكنني طلب التصميم الذي تم إنتاجه؟", a: "نعم، كافة القطع المقترحة في التصميم هي منتجات حقيقية مسجلة في المتجر، يمكنك النقر عليها وإضافتها للسلة مباشرة." }
      ]
    },
    {
      category: "الشراء والتوصيل",
      items: [
        { q: "ما هي طرق الدفع المتاحة؟", a: "نقبل حالياً الدفع عبر الكريمي، النجم، وأيضاً الدفع عند الاستلام في بعض المدن الرئيسية." },
        { q: "كم يستغرق التوصيل والتركيب؟", a: "يستغرق التوصيل عادة من 3 إلى 7 أيام عمل داخل المدن الرئيسية، وقد تختلف المدة للقطع المخصصة حسب المتجر." },
        { q: "هل توجد ضمانات على المنتجات؟", a: "نعم، كافة المتاجر والنجارين المعتمدين في إيوان يقدمون ضماناً على الجودة والتركيب حسب سياسة كل متجر." }
      ]
    },
    {
      category: "للتجار والنجارين",
      items: [
        { q: "كيف يمكنني فتح متجر في إيوان؟", a: "يمكنك التسجيل كتاجر من صفحة التسجيل، ورفع الوثائق المطلوبة (الهوية الشخصية، عنوان الورشة)، وبعد المراجعة سيتم تفعيل متجرك." },
        { q: "ما هي العمولات التي تقتطعها المنصة؟", a: "إيوان تتقاضى عمولة رمزية على العمليات الناجحة فقط، وذلك لتغطية تكاليف التشغيل والتسويق لمنتجاتكم." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-secondary text-white py-24 px-4 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10">
          <HelpCircle className="w-96 h-96 absolute -bottom-20 -right-20 rotate-12" />
        </div>
        <div className="container mx-auto relative z-10 space-y-6">
          <h1 className="text-4xl md:text-6xl font-black">مركز المساعدة</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg font-medium">
            كل ما تحتاج لمعرفته حول استخدام منصة إيوان وتطوير مساحتك الخاصة.
          </p>
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="ابحث عن إجابة لسؤالك..." 
              className="w-full h-14 pr-12 pl-6 bg-white rounded-md text-secondary font-bold focus:ring-4 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto py-20 px-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-white rounded-md shadow-sm border border-border/50">
              <h3 className="font-black text-secondary mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" /> الأقسام
              </h3>
              <nav className="space-y-2">
                {faqs.map((cat, i) => (
                  <Button 
                    key={i} 
                    variant="ghost" 
                    className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md font-bold h-12"
                  >
                    {cat.category}
                  </Button>
                ))}
              </nav>
            </div>

            <div className="p-8 bg-primary text-white rounded-md shadow-xl space-y-4">
              <MessageSquare className="w-10 h-10" />
              <h4 className="text-xl font-black">لم تجد إجابتك؟</h4>
              <p className="text-sm opacity-80 leading-relaxed font-medium">فريق الدعم الفني متواجد على مدار الساعة لمساعدتك.</p>
              <Button className="w-full bg-white text-primary hover:bg-secondary hover:text-white font-black rounded-md h-12 transition-all">
                تواصل معنا الآن
              </Button>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-16">
            {faqs.map((category, idx) => (
              <div key={idx} className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-1 bg-primary rounded-full"></div>
                  <h2 className="text-2xl font-black text-secondary">{category.category}</h2>
                </div>
                
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {category.items.map((item, i) => (
                    <AccordionItem 
                      key={i} 
                      value={`${idx}-${i}`} 
                      className="bg-white border rounded-md px-6 shadow-sm hover:border-primary/30 transition-colors"
                    >
                      <AccordionTrigger className="text-lg font-bold text-secondary hover:no-underline py-6">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed text-[15px] pb-6 border-t border-gray-50 pt-4 mt-2">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <section className="mt-32 p-12 bg-gray-50 rounded-md border border-border/50 text-center space-y-8">
          <h2 className="text-3xl font-black text-secondary">ما زلت بحاجة للمساعدة؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-8 bg-white rounded-md shadow-sm space-y-4 border border-transparent hover:border-primary transition-all cursor-pointer">
               <Phone className="w-8 h-8 text-primary mx-auto" />
               <p className="font-black text-secondary">اتصل بنا</p>
               <p className="text-sm text-muted-foreground">+967 770 000 000</p>
            </div>
            <div className="p-8 bg-white rounded-md shadow-sm space-y-4 border border-transparent hover:border-primary transition-all cursor-pointer">
               <Mail className="w-8 h-8 text-primary mx-auto" />
               <p className="font-black text-secondary">راسلنا</p>
               <p className="text-sm text-muted-foreground">help@ewan.ye</p>
            </div>
            <div className="p-8 bg-white rounded-md shadow-sm space-y-4 border border-transparent hover:border-primary transition-all cursor-pointer">
               <MessageSquare className="w-8 h-8 text-primary mx-auto" />
               <p className="font-black text-secondary">محادثة فورية</p>
               <p className="text-sm text-muted-foreground">متاح 24/7</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

