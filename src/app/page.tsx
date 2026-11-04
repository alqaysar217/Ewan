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
  MessageSquare,
  ShieldCheck,
  Truck,
  Hammer,
  Quote,
  ChevronRight,
  Sparkles
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

  const features = [
    { title: 'تصميم ذكي', desc: 'استخدم الذكاء الاصطناعي لتخيل غرفتك قبل الشراء.', icon: Zap, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'جودة وطنية', desc: 'أفخر الصناعات اليدوية اليمنية بأيدي أمهر النجارين.', icon: Hammer, color: 'text-secondary', bg: 'bg-secondary/10' },
    { title: 'توصيل سريع', desc: 'توصيل وتركيب احترافي لكافة المدن الكبرى.', icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'ضمان حقيقي', desc: 'ضمان يصل إلى 5 سنوات على جودة الخشب والنجارة.', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  const partners = [
    { name: 'IKEA Global', logo: 'https://picsum.photos/seed/p1/200/200' },
    { name: 'Gulf Furniture', logo: 'https://picsum.photos/seed/p2/200/200' },
    { name: 'Yemen Wood', logo: 'https://picsum.photos/seed/p3/200/200' },
    { name: 'Modern Living', logo: 'https://picsum.photos/seed/p4/200/200' },
    { name: 'Royal Decor', logo: 'https://picsum.photos/seed/p5/200/200' },
    { name: 'Elite Stores', logo: 'https://picsum.photos/seed/p6/200/200' }
  ];

  const testimonials = [
    { 
      name: 'محمد القاضي', 
      role: 'عميل من صنعاء', 
      text: 'تجربة التصميم بالذكاء الاصطناعي كانت مذهلة، ساعدتني كثيراً في اختيار اللون المناسب لمجلسي الجديد وبكل سهولة.', 
      rating: 4.9,
      avatar: 'https://picsum.photos/seed/user1/100/100'
    },
    { 
      name: 'سارة باوزير', 
      role: 'عميلة من المكلا', 
      text: 'جودة الخشب في الطقم الحضرمي الذي طلبته تفوقت على توقعاتي، والتوصيل كان في الموعد تماماً وبكل احترافية.', 
      rating: 5.0,
      avatar: 'https://picsum.photos/seed/user2/100/100'
    },
    { 
      name: 'أحمد علي', 
      role: 'عميل من عدن', 
      text: 'أفضل منصة أثاث في اليمن حالياً، التنوع بين الجاهز والمصنع حسب الطلب يعطي خيارات رائعة جداً.', 
      rating: 4.8,
      avatar: 'https://picsum.photos/seed/user3/100/100'
    }
  ];

  const featuredStores = [
    { 
      id: 's1', 
      business_name: 'المعرض الملكي', 
      city: 'صنعاء', 
      average_rating: 4.9, 
      cover_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600',
      logo_url: 'https://picsum.photos/seed/s1/200/200',
      description: 'تشكيلة واسعة من الأثاث العصري الذي يجمع بين الجودة والفخامة، موثقة ومعتمدة من إيوان لضمان رضاكم.'
    },
    { 
      id: 's2', 
      business_name: 'أثاث الخليج', 
      city: 'عدن', 
      average_rating: 4.8, 
      cover_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
      logo_url: 'https://picsum.photos/seed/s2/200/200',
      description: 'تشكيلة واسعة من الأثاث العصري الذي يجمع بين الجودة والفخامة، موثقة ومعتمدة من إيوان لضمان رضاكم.'
    },
    { 
      id: 's3', 
      business_name: 'مودرن هوم', 
      city: 'تعز', 
      average_rating: 4.7, 
      cover_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600',
      logo_url: 'https://picsum.photos/seed/s3/200/200',
      description: 'تشكيلة واسعة من الأثاث العصري الذي يجمع بين الجودة والفخامة، موثقة ومعتمدة من إيوان لضمان رضاكم.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background" dir="rtl">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-secondary">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" 
              alt="Modern Interior Design"
              fill
              className="object-cover opacity-60"
              priority
              data-ai-hint="luxury modern teal living room"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-secondary via-secondary/80 to-transparent" />
          
          <div className="container relative z-20 px-4 md:px-8 mx-auto">
            <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-right-12 duration-1000 py-16">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/20 backdrop-blur-xl rounded-[15px] text-primary border-r-4 border-secondary shadow-xl shadow-primary/5 mx-auto lg:mx-0">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-black tracking-widest uppercase">ابتكار ذكي لمساحتك الخاصة</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.2] tracking-tight text-center lg:text-right">
                اكتشف مساحة أحلامك مع <span className="text-primary">إيوان</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium max-w-xl text-center lg:text-right mx-auto lg:mx-0">
                أثاث يلائم ذوقك، وتصاميم ذكية تحول أفكارك إلى واقع. ارفع صورة غرفتك ودع الذكاء الاصطناعي يقترح لك الأفضل.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
                <Link href="/ai-design" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-64 h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1">
                    صمم غرفتك <Zap className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
                <Link href="/shop" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-64 h-14 px-10 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 font-black text-lg transition-all">
                    اكتشف المجموعات
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="h-8 w-1 bg-primary inline-block align-middle ml-4 rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-black text-secondary inline-block align-middle">لماذا تختار إيوان؟</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">نقدم لك تجربة فريدة تجمع بين التكنولوجيا المتطورة والحرفية التقليدية.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="group p-8 bg-gray-50 border border-border/50 rounded-[15px] shadow-sm hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-110", feature.bg, feature.color)}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-secondary mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-right">
              <div className="space-y-4">
                <div className="h-8 w-1 bg-primary inline-block align-middle ml-4 rounded-full"></div>
                <h2 className="text-4xl font-black text-secondary inline-block align-middle">قطع مختارة لك</h2>
                <p className="text-muted-foreground text-lg max-w-xl">أحدث ما تم إنتاجه في ورش النجارين اليمنيين والمتاجر الكبرى.</p>
              </div>
              <Link href="/shop">
                <Button variant="ghost" className="text-primary font-black text-lg p-0 flex gap-2 group hover:bg-transparent">
                  عرض كافة المنتجات
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group flex flex-col bg-gray-50 border border-border/50 rounded-[15px] overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden bg-white/50">
                    <Image src={product.img} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" data-ai-hint="furniture product" />
                    <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="bg-white text-secondary font-black rounded-[10px] shadow-xl px-6 py-2">عرض التفاصيل</span>
                      </div>
                    </Link>
                    <div className="absolute top-3 right-3 z-20">
                      <Badge className="bg-secondary text-white font-black rounded-[10px] px-3 py-1 shadow-sm border-none">
                         {product.discount.toLocaleString('en-US')}% خصم
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-4">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-base font-black text-secondary group-hover:text-primary transition-colors line-clamp-1">{product.name}</h4>
                      <div className="flex items-center gap-1 text-amber-500 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-black">{product.rating.toLocaleString('en-US')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Store className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold">{product.store}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layout className="w-4 h-4 text-primary" />
                      <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/20 bg-primary/5 px-2 py-0">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="mt-auto pt-2 space-y-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-secondary">{product.price.toLocaleString('en-US')} <span className="text-xs font-bold">ر.ي</span></span>
                        <span className="text-xs font-bold text-muted-foreground line-through">{product.oldPrice.toLocaleString('en-US')}</span>
                      </div>
                      <Button className="w-full bg-secondary hover:bg-primary text-white font-black gap-2 h-11 rounded-[12px] transition-all shadow-sm">
                        <ShoppingBag className="w-4 h-4" /> إضافة للسلة
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Stores Section */}
        <section className="py-24 bg-secondary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
          <div className="container relative z-10 px-4 md:px-8 mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white">أبرز المتاجر المعتمدة</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto font-medium">نخبة من أفضل معارض الأثاث التي تقدم أرقى المجموعات الجاهزة والمصنعة.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredStores.map((store, i) => (
                <Link 
                  href={`/vendors/${store.id}`}
                  key={i} 
                  className="group bg-gray-50 border border-border/50 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col rounded-[15px]"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image 
                      src={store.cover_url || `https://picsum.photos/seed/${store.id}/800/400`} 
                      alt={store.business_name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                    
                    <div className="absolute bottom-4 right-4 flex items-center gap-3">
                      <div className="w-14 h-14 bg-white p-1 shadow-xl relative overflow-hidden rounded-md">
                        <Image 
                          src={store.logo_url || `https://picsum.photos/seed/${store.id}-logo/200/200`}
                          alt="Logo"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-white">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-black text-lg">{store.business_name}</h4>
                          <CheckCircle2 className="w-4 h-4 text-primary fill-white" />
                        </div>
                        <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-[10px] uppercase">
                          معرض أثاث
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 backdrop-blur-sm text-secondary font-black border-none px-2 py-1 flex items-center gap-1 shadow-lg rounded-md">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        {store.average_rating ? store.average_rating.toLocaleString('en-US') : '5.0'}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-2">
                      {store.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {store.city}
                      </div>
                      <Button variant="outline" size="sm" className="h-10 font-bold border-secondary/10 hover:bg-secondary hover:text-white transition-all rounded-md">
                        تصفح المنتجات 
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-16 text-center">
               <Link href="/vendors">
                 <Button size="lg" className="h-16 px-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-2xl shadow-primary/40 transition-all hover:-translate-y-1">
                   شاهد كافة المتاجر <ChevronRight className="w-6 h-6 mr-2 rotate-180" />
                 </Button>
               </Link>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20 bg-gray-50">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="flex flex-col gap-12">
              <h3 className="text-center text-lg font-black text-muted-foreground">شركاء النجاح العالميين والمحليين</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {partners.map((partner, i) => (
                  <div key={i} className="flex justify-center">
                    <div className="relative w-24 h-24 overflow-hidden rounded-xl border border-border/50 bg-gray-50 p-2">
                      <Image src={partner.logo} alt={partner.name} fill className="object-contain p-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-secondary text-white relative overflow-hidden">
          <Quote className="absolute -top-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
          <Quote className="absolute -bottom-10 -left-10 w-64 h-64 text-white/5 -rotate-12" />
          
          <div className="container px-4 md:px-8 mx-auto relative z-10">
            <div className="text-center mb-20 space-y-6">
              <div className="w-20 h-20 bg-primary/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Quote className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black">ماذا يقول عملاؤنا؟</h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">قصص نجاح حقيقية بدأت بلمسة من إيوان وانتهت بمساحات مذهلة.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[15px] space-y-6 hover:bg-white/10 transition-all duration-500 shadow-xl flex flex-col h-full">
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star key={starIdx} className={cn("w-4 h-4", starIdx >= Math.floor(t.rating) ? "fill-none" : "fill-current")} />
                    ))}
                  </div>
                  
                  <div className="relative flex-1">
                    <Quote className="absolute -top-4 -right-4 w-10 h-10 text-primary opacity-20" />
                    <p className="text-lg font-medium leading-relaxed text-right relative z-10 italic">
                      "{t.text}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg border-2 border-primary/20 shrink-0">
                      <Image 
                        src={t.avatar} 
                        alt={t.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="text-right">
                      <h4 className="font-black text-white text-base">{t.name}</h4>
                      <p className="text-xs text-primary font-bold mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
               <Link href="/faq">
                 <Button variant="outline" size="lg" className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 font-black px-12 h-14 transition-all">
                   عرض كافة الآراء <ArrowLeft className="w-5 h-5 mr-2" />
                 </Button>
               </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 md:py-24 bg-white">
          <div className="container px-4 md:px-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-16 gap-6 text-center md:text-right">
              <div className="space-y-3 md:space-y-4">
                <div className="h-6 md:h-8 w-1 bg-primary inline-block align-middle ml-3 md:ml-4 rounded-full"></div>
                <h2 className="text-2xl md:text-4xl font-black text-secondary inline-block align-middle">الأسئلة الشائعة</h2>
                <p className="text-muted-foreground text-sm md:text-lg">كل ما تحتاج معرفته حول رحلتك مع إيوان.</p>
              </div>
              <Link href="/faq">
                <Button variant="ghost" className="text-primary font-black text-base md:text-lg p-0 flex gap-2 group hover:bg-transparent">
                  عرض كل الأسئلة
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3 md:space-y-4">
              {[
                { q: "كيف يعمل التصميم بالذكاء الاصطناعي؟", a: "ببساطة، ترفع صورة لغرفتك الحالية، تختار الطراز المفضل (مودرن، كلاسيك..)، وتحدد ميزانيتك. سيقوم نظامنا بتحليل المساحة واقتراح قطع أثاث حقيقية متوفرة في متجرنا تناسب مساحتك." },
                { q: "هل المنتجات المعروضة حقيقية ومتوفرة؟", a: "نعم، كافة قطع الأثاث التي يقترحها الذكاء الاصطناعي هي منتجات حقيقية مسجلة من قبل التجار والنجارين في اليمن، ويمكنك طلبها مباشرة عبر المنصة." },
                { q: "هل توجد خدمة توصيل للمدن اليمنية؟", a: "نعم، نوفر خدمة التوصيل والتركيب في معظم المدن الكبرى (صنعاء، عدن، تعز، حضرموت) بالتنسيق مع شبكة التجار المعتمدين لدينا." }
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-gray-50 border-none rounded-[15px] px-4 md:px-6 overflow-hidden">
                  <AccordionTrigger className="text-sm md:text-lg font-bold text-secondary hover:no-underline py-4 md:py-6 text-right leading-snug">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-[13px] md:text-[15px] pb-4 md:pb-6 text-right">
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
