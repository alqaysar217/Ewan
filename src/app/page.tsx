'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  Zap, 
  ShoppingBag, 
  Bot,
  ArrowLeft,
  Star,
  CheckCircle2,
  MapPin,
  Store,
  Layout
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  const featuredProducts = [
    { id: 1, name: 'طقم ديوان حضرمي مطور', category: 'غرف معيشة', price: 450000, oldPrice: 540000, discount: 15, store: 'ورشة المكلا', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600' },
    { id: 2, name: 'سرير خشبي ملكي منحوت', category: 'غرف نوم', price: 280000, oldPrice: 310000, discount: 10, store: 'أثاث الخليج', img: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=600' },
    { id: 3, name: 'طاولة طعام دائرية مودرن', category: 'مطابخ', price: 120000, oldPrice: 150000, discount: 20, store: 'مودرن هوم', img: 'https://images.unsplash.com/photo-1577145000247-a737ad733c99?auto=format&fit=crop&q=80&w=600' },
    { id: 4, name: 'كرسي مكتب مريح', category: 'مكاتب', price: 45000, oldPrice: 60000, discount: 25, store: 'الرويشان للأثاث', img: 'https://images.unsplash.com/photo-1505797149-43b0ad766a0e?auto=format&fit=crop&q=80&w=600' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-secondary">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" 
              alt="Modern Interior Design"
              fill
              className="object-cover"
              priority
              data-ai-hint="luxury modern teal living room"
            />
          </div>
          
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-secondary via-secondary/90 to-transparent backdrop-blur-[2px]" />
          
          <div className="container relative z-20 px-4 md:px-8 mx-auto">
            <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-12 duration-1000 py-16">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/20 backdrop-blur-xl rounded-md text-primary border-r-4 border-secondary shadow-xl shadow-primary/5">
                <span className="text-xs font-black tracking-widest uppercase">ابتكار ذكي لمساحتك الخاصة</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.2] tracking-tight">
                اكتشف مساحة أحلامك مع <span className="text-primary">إيوان</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium">
                أثاث يلائم ذوقك، وتصاميم ذكية تحول أفكارك إلى واقع. ارفع صورة غرفتك ودع الذكاء الاصطناعي يقترح لك الأفضل.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Link href="/ai-design">
                  <Button size="lg" className="h-16 px-10 rounded-md bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1">
                    ابدأ التصميم بالذكاء الاصطناعي <Zap className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" variant="outline" className="h-16 px-10 rounded-md border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold text-lg transition-all">
                    اكتشف المجموعات
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <div className="h-8 w-1 bg-primary inline-block align-middle ml-4"></div>
                <h2 className="text-4xl font-black text-secondary inline-block align-middle">قطع مختارة لك</h2>
                <p className="text-muted-foreground text-lg max-w-xl">أحدث ما تم إنتاجه في ورش النجارين اليمنيين والمتاجر الكبرى.</p>
              </div>
              <Link href="/shop">
                <Button variant="ghost" className="text-primary font-bold text-lg p-0 flex gap-2 group hover:bg-transparent">
                  عرض كافة المنتجات
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col bg-white border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image src={product.img} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" data-ai-hint="furniture product" />
                    
                    <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="bg-white text-secondary font-bold rounded-md shadow-xl px-6 py-2">
                          عرض التفاصيل
                        </span>
                      </div>
                    </Link>

                    <div className="absolute top-3 left-3 z-20">
                      <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-md rounded-full text-secondary hover:text-destructive shadow-sm w-9 h-9">
                        <Heart className="w-5 h-5" />
                      </Button>
                    </div>
                    
                    <div className="absolute top-3 right-3 z-20">
                      <Badge className="bg-secondary text-white font-bold rounded-md px-2 py-1 flex items-center gap-1 shadow-sm border-none">
                         {product.discount}% خصم
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 gap-4">
                    {/* Row 1: Name & Rating */}
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-base font-black text-secondary group-hover:text-primary transition-colors line-clamp-1 leading-tight">{product.name}</h4>
                      <div className="flex items-center gap-1 text-amber-500 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-black">4.9</span>
                      </div>
                    </div>
                    
                    {/* Row 2: Store */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Store className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold">{product.store}</span>
                    </div>

                    {/* Row 3: Category */}
                    <div className="flex items-center gap-2">
                      <Layout className="w-4 h-4 text-primary" />
                      <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/20 bg-primary/5 px-2 py-0">
                        {product.category}
                      </Badge>
                    </div>

                    {/* Row 4: Pricing & Action */}
                    <div className="mt-auto pt-2 space-y-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-secondary leading-none">
                            {product.price.toLocaleString('en-US')} <span className="text-xs font-bold">ر.ي</span>
                          </span>
                          <span className="text-xs font-bold text-muted-foreground line-through">
                            {product.oldPrice.toLocaleString('en-US')}
                          </span>
                        </div>
                      </div>

                      <Button className="w-full bg-secondary hover:bg-primary text-white font-bold gap-2 h-11 rounded-xl transition-all shadow-sm">
                        <ShoppingBag className="w-4 h-4" /> إضافة للسلة
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Vendors Section */}
        <section className="py-24 bg-gray-50">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <div className="h-8 w-1 bg-secondary inline-block align-middle ml-4"></div>
                <h2 className="text-4xl font-black text-secondary inline-block align-middle">نخبة المبدعين</h2>
                <p className="text-muted-foreground text-lg max-w-xl">تعرف على الحرفيين والمصممين الذين يجعلون منزلك مميزاً.</p>
              </div>
              <Link href="/vendors">
                <Button variant="ghost" className="text-primary font-bold text-lg p-0 flex gap-2 group hover:bg-transparent">
                  استكشف كل المبدعين
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { id: 'v1', name: 'ورشة إتقان للنجارة', type: 'نجارة يدوية', rating: 4.9, location: 'صنعاء، التحرير', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=600', desc: 'متخصصون في صناعة غرف النوم والدواوين الخشبية الفاخرة بجودة يمنية أصيلة.' },
                { id: 'v2', name: 'تصاميم رؤية', type: 'تصميم داخلي', rating: 4.8, location: 'عدن، المنصورة', img: 'https://images.unsplash.com/photo-1554232456-8727aae0cfa4?auto=format&fit=crop&q=80&w=600', desc: 'نحول مساحات منزلك إلى لوحات فنية بلمسات عصرية وأسعار تنافسية.' },
                { id: 'v3', name: 'الخشب الفاخر', type: 'أثاث مخصص', rating: 5.0, location: 'حضرموت، المكلا', img: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=600', desc: 'أثاث منزلي ومكتبي مخصص حسب الطلب من أفضل أنواع الأخشاب الطبيعية.' }
              ].map((vendor, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-border/50 group hover:shadow-xl transition-all overflow-hidden flex flex-col">
                  <div className="relative h-56 w-full">
                    <Image src={vendor.img} alt={vendor.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" data-ai-hint="carpentry workshop" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-md shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      <span className="text-[10px] font-black">{vendor.rating}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-black text-secondary">{vendor.name}</h4>
                        <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
                      </div>
                      <p className="text-sm font-bold text-primary">{vendor.type}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{vendor.desc}</p>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold pt-2">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {vendor.location}
                    </div>
                    <div className="pt-4 mt-auto">
                      <Link href={`/vendors/${vendor.id}`}>
                        <Button variant="outline" className="w-full rounded-xl border-secondary/20 hover:bg-secondary hover:text-white font-bold transition-all h-12">
                          عرض الملف الشخصي والمنتجات
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20 bg-white border-t border-gray-50">
          <div className="container px-4 md:px-8 mx-auto">
            <p className="text-center text-sm font-black text-muted-foreground uppercase tracking-[0.3em] mb-12">شركاء النجاح في إيوان</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
               {['شركة الخشب العالمية', 'دهانات جوتن', 'إيكيا المورد المعتمد', 'مصنع الجزيرة', 'هوم سنتر'].map((partner, i) => (
                 <span key={i} className="text-xl md:text-2xl font-black text-secondary">{partner}</span>
               ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-secondary text-white overflow-hidden">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-4xl font-black text-white">ماذا يقول عملاؤنا</h2>
              <p className="text-xl text-gray-400 font-medium">قصص نجاح من أشخاص حولوا منازلهم إلى واحات إبداع باستخدام إيوان.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'أحمد السعدني', role: 'صاحب منزل', comment: 'تجربة التصميم بالذكاء الاصطناعي كانت مذهلة! استطعت رؤية الكنب في غرفتي قبل الطلب، والجودة فاقت التوقعات.', rating: 5 },
                { name: 'سارة المطيري', role: 'مصممة مستقلة', comment: 'إيوان سهل علي التواصل مع أفضل النجارين في اليمن. القطع المخصصة كانت تحفة فنية حقيقية.', rating: 5 },
                { name: 'خالد عبد الله', role: 'عميل جديد', comment: 'سرعة في التوصيل واحترافية في التعامل. المتجر يضم تشكيلة واسعة تناسب كل الأذواق.', rating: 4 }
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-white/5 p-8 rounded-2xl border border-white/10 relative group hover:bg-white/10 transition-all duration-300">
                  <QuoteIcon className="w-10 h-10 text-primary/20 absolute top-6 left-6" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("w-4 h-4", i < testimonial.rating ? "fill-primary text-primary" : "text-white/20")} />
                    ))}
                  </div>
                  <p className="text-gray-300 font-medium leading-relaxed mb-6 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center font-black text-primary">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h5 className="font-black text-white">{testimonial.name}</h5>
                      <p className="text-xs text-gray-500 font-bold">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <div className="h-8 w-1 bg-primary inline-block align-middle ml-4"></div>
                <h2 className="text-4xl font-black text-secondary inline-block align-middle">الأسئلة الشائعة</h2>
                <p className="text-muted-foreground text-lg">كل ما تحتاج معرفته حول رحلتك مع إيوان.</p>
              </div>
              <Link href="/faq">
                <Button variant="ghost" className="text-primary font-bold text-lg p-0 flex gap-2 group hover:bg-transparent">
                  عرض كل الأسئلة
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                { q: "كيف يعمل التصميم بالذكاء الاصطناعي؟", a: "ببساطة، ترفع صورة لغرفتك الحالية، تختار الطراز المفضل (مودرن، كلاسيك..)، وتحدد ميزانيتك. سيقوم نظامنا بتحليل المساحة واقتراح قطع أثاث حقيقية متوفرة في متجرنا تناسب مساحتك." },
                { q: "هل المنتجات المعروضة حقيقية ومتوفرة؟", a: "نعم، كافة قطع الأثاث التي يقترحها الذكاء الاصطناعي هي منتجات حقيقية مسجلة من قبل التجار والنجارين في اليمن، ويمكنك طلبها مباشرة عبر المنصة." },
                { q: "هل توجد خدمة توصيل للمدن اليمنية؟", a: "نعم، نوفر خدمة التوصيل والتركيب في معظم المدن الكبرى (صنعاء، عدن، تعز، حضرموت) بالتنسيق مع شبكة التجار المعتمدين لدينا." }
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-gray-50 border-none rounded-xl px-6 overflow-hidden">
                  <AccordionTrigger className="text-lg font-bold text-secondary hover:no-underline py-6">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-[15px] pb-6">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 translate-y-1/2 -translate-x-1/2 rounded-full blur-3xl" />
          
          <div className="container relative z-10 px-4 md:px-8 text-center space-y-10 mx-auto">
            <h2 className="text-4xl md:text-5xl font-black">جاهز لتغيير مساحتك؟</h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto font-medium">انضم إلى آلاف المستخدمين الذين بدأوا رحلة تصميم منازلهم بذكاء وسهولة.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg" className="h-16 px-12 rounded-xl bg-white text-primary hover:bg-secondary hover:text-white font-black text-lg transition-all shadow-xl">
                  سجل حسابك الآن
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-16 px-12 rounded-xl border-white/40 text-white hover:bg-white/10 font-black text-lg transition-all">
                  تواصل مع خبير
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Floating AI Assistant Button */}
      <Link href="/ai-design" className="fixed bottom-10 left-10 z-[100] group">
        <div className="relative flex items-center gap-4">
          <div className="bg-secondary text-white px-5 py-2.5 rounded-md text-xs font-black shadow-2xl border border-white/10 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden md:block whitespace-nowrap">
            صمم غرفتك بذكاء ✨
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg group-hover:bg-primary/50 transition-all duration-500 animate-pulse scale-125" />
            <Button 
              size="icon" 
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 relative flex items-center justify-center transition-all hover:scale-110 duration-300 overflow-hidden border-2 border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <Bot className="w-8 h-8 drop-shadow-lg" />
            </Button>
          </div>
        </div>
      </Link>

      <Footer />
    </div>
  );
}

function QuoteIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H5c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-4 4-4 4" />
      <path d="M14 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-3c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-4 4-4 4" />
    </svg>
  )
}