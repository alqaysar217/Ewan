'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  Zap, 
  ShoppingBag, 
  Star,
  ArrowLeft,
  Store,
  Layout,
  CheckCircle2,
  MapPin,
  MessageSquare
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
    { id: 1, name: 'طقم ديوان حضرمي مطور', category: 'غرف معيشة', price: 450000, oldPrice: 540000, discount: 15, store: 'ورشة المكلا', rating: 4.9, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600' },
    { id: 2, name: 'سرير خشبي ملكي منحوت', category: 'غرف نوم', price: 280000, oldPrice: 310000, discount: 10, store: 'أثاث الخليج', rating: 4.8, img: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=600' },
    { id: 3, name: 'طاولة طعام دائرية مودرن', category: 'مطابخ', price: 120000, oldPrice: 150000, discount: 20, store: 'مودرن هوم', rating: 4.7, img: 'https://images.unsplash.com/photo-1577145000247-a737ad733c99?auto=format&fit=crop&q=80&w=600' },
    { id: 4, name: 'كرسي مكتب مريح', category: 'مكاتب', price: 45000, oldPrice: 60000, discount: 25, store: 'الرويشان للأثاث', rating: 4.5, img: 'https://images.unsplash.com/photo-1505797149-43b0ad766a0e?auto=format&fit=crop&q=80&w=600' }
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
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-4">
                <Link href="/ai-design">
                  <Button size="lg" className="h-14 px-10 rounded-md bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1">
                    صمم غرفتك <Zap className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" variant="outline" className="h-14 px-10 rounded-md border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold text-lg transition-all">
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
                <div key={product.id} className="group flex flex-col bg-white border border-border/50 rounded-[15px] overflow-hidden hover:shadow-xl transition-all duration-300">
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
                         {(product.discount || 0).toLocaleString('en-US')}% خصم
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 gap-4">
                    {/* Row 1: Name & Rating */}
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-base font-black text-secondary group-hover:text-primary transition-colors line-clamp-1 leading-tight">{product.name}</h4>
                      <div className="flex items-center gap-1 text-amber-500 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-black">{(product.rating || 0).toLocaleString('en-US')}</span>
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

                    {/* Row 4: Prices & Action */}
                    <div className="mt-auto pt-2 space-y-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-secondary leading-none">
                            {(product.price || 0).toLocaleString('en-US')} <span className="text-xs font-bold">ر.ي</span>
                          </span>
                          <span className="text-xs font-bold text-muted-foreground line-through">
                            {(product.oldPrice || 0).toLocaleString('en-US')}
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
      </main>

      <Footer />
    </div>
  );
}