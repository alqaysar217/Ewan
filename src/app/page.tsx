'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
  Zap, 
  ShoppingBag, 
  Star,
  ArrowLeft,
  Store,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Truck,
  Hammer,
  Quote,
  Loader2,
  Award
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
import { useCollection, useFirestore } from '@/firebase';
import { useCart } from '@/context/cart-context';
import { collection, query, limit, orderBy, where, or } from 'firebase/firestore';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const db = useFirestore();
  const { addToCart } = useCart();

  // جلب المنتجات المميزة
  const productsQuery = useMemo(() => query(
    collection(db, 'products'),
    orderBy('created_at', 'desc'),
    limit(4)
  ), [db]);
  const { data: productsData, loading: productsLoading } = useCollection(productsQuery);

  // جلب المتاجر فقط (Furniture Stores)
  const storesQuery = useMemo(() => query(
    collection(db, 'vendors'),
    where('business_type', '==', 'furniture_store'),
    limit(3)
  ), [db]);
  const { data: storesData, loading: storesLoading } = useCollection(storesQuery);

  // جلب المصممين والنجارين فقط (Professionals)
  const prosQuery = useMemo(() => query(
    collection(db, 'vendors'),
    or(where('business_type', '==', 'carpenter'), where('business_type', '==', 'interior_designer')),
    limit(3)
  ), [db]);
  const { data: prosData, loading: prosLoading } = useCollection(prosQuery);

  const allVendorsQuery = useMemo(() => collection(db, 'vendors'), [db]);
  const { data: allVendors } = useCollection(allVendorsQuery);

  const partnersQuery = useMemo(() => query(
    collection(db, 'partners'),
    orderBy('created_at', 'desc'),
    limit(12)
  ), [db]);
  const { data: partnersData, loading: partnersLoading } = useCollection(partnersQuery);

  const testimonialsQuery = useMemo(() => query(
    collection(db, 'testimonials'),
    orderBy('created_at', 'desc'),
    limit(4)
  ), [db]);
  const { data: testimonialsData, loading: testimonialsLoading } = useCollection(testimonialsQuery);

  const faqsQuery = useMemo(() => query(
    collection(db, 'faqs'),
    orderBy('created_at', 'desc'),
    limit(5)
  ), [db]);
  const { data: faqsData, loading: faqsLoading } = useCollection(faqsQuery);

  const featuredProducts = useMemo(() => {
    if (!productsData || productsData.length === 0) return [];
    return productsData.map((p: any) => {
      const vendor = allVendors?.find(v => v.id === p.vendor_id);
      const price = Number(p.price) || 0;
      const oldPrice = Number(p.old_price) || 0;
      const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
      
      return {
        id: p.id,
        name: p.name_ar || 'منتج غير مسمى',
        category: p.category_id || 'عام',
        price: price,
        oldPrice: oldPrice,
        discount: discount,
        store: vendor?.business_name || 'إيوان المعتمد',
        rating: p.rating || 5.0,
        img: p.image_base64 || `https://picsum.photos/seed/${p.id}/600/600`
      };
    });
  }, [productsData, allVendors]);

  const features = [
    { title: 'تصميم ذكي', desc: 'استخدم الذكاء الاصطناعي لتخيل غرفتك قبل الشراء.', icon: Zap },
    { title: 'جودة وطنية', desc: 'أفخر الصناعات اليدوية اليمنية بأيدي أمهر النجارين.', icon: Hammer },
    { title: 'توصيل سريع', desc: 'توصيل وتركيب احترافي لكافة المدن الكبرى.', icon: Truck },
    { title: 'ضمان حقيقي', desc: 'ضمان يصل إلى 5 سنوات على جودة الخشب والنجارة.', icon: ShieldCheck }
  ];

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden" dir="rtl">
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
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
              className="max-w-3xl space-y-8 py-16"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-accent/20 backdrop-blur-xl rounded-[15px] text-accent border-r-4 border-secondary shadow-xl shadow-accent/5 mx-auto lg:mx-0">
                <span className="text-xs font-black tracking-widest uppercase">ابتكار ذكي لمساحتك الخاصة</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.2] tracking-tight text-center lg:text-right">
                اكتشف مساحة أحلامك مع <span className="text-accent">إيوان</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium max-w-xl text-center lg:text-right mx-auto lg:mx-0">
                أثاث يلائم ذوقك، وتصاميم ذكية تحول أفكارك إلى واقع. ارفع صورة غرفتك ودع الذكاء الاصطناعي يقترح لك الأفضل.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
                <Link href="/ai-design" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-64 h-14 px-10 rounded-xl bg-accent hover:bg-accent/90 text-white font-black text-lg shadow-2xl shadow-accent/30 transition-all hover:-translate-y-1">
                    صمم غرفتك <Zap className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
                <Link href="/shop" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-64 h-14 px-10 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 font-black text-lg transition-all">
                    اكتشف المجموعات
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="pt-32 pb-12 bg-background relative overflow-hidden">
          <div className="container px-4 md:px-8 mx-auto text-center relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInVariants}
              className="mb-20 space-y-5 text-center"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="h-1 w-12 bg-accent rounded-full"></div>
                <span className="text-accent font-black tracking-widest text-xs uppercase">لماذا نحن الأفضل</span>
                <div className="h-1 w-12 bg-accent rounded-full"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-secondary tracking-tight">لماذا تختار إيوان؟</h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-medium px-4">نجمع بين التكنولوجيا المتطورة وحرفية النجار اليمني لنقدم لك تجربة تأثيث لا تُنسى.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10"
            >
              {features.map((feature, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeInVariants}
                  className="group relative p-4 md:p-10 bg-primary border border-white/5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
                  <div className="w-10 h-10 md:w-20 md:h-20 rounded-xl flex items-center justify-center mb-3 md:mb-8 bg-accent text-white shadow-lg shadow-accent/20 transition-all duration-500 group-hover:scale-110 relative z-10">
                    <feature.icon className="w-5 h-5 md:w-10 md:h-10" />
                  </div>
                  <h3 className="text-sm md:text-2xl font-black text-white mb-1 md:mb-4 relative z-10 tracking-tight">{feature.title}</h3>
                  <p className="text-gray-300 font-bold leading-relaxed text-[10px] md:text-sm relative z-10">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 bg-background">
          <div className="container px-4 md:px-8 mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInVariants}
              className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-right"
            >
              <div className="space-y-4">
                <div className="h-8 w-1 bg-accent inline-block align-middle ml-4 rounded-full"></div>
                <h2 className="text-4xl font-black text-secondary inline-block align-middle">قطع مختارة لك</h2>
                <p className="text-muted-foreground text-lg max-w-xl">أحدث ما تم إنتاجه في ورش النجارين اليمنيين والمتاجر الكبرى.</p>
              </div>
              <Link href="/shop">
                <Button variant="ghost" className="text-accent font-black text-lg p-0 flex gap-2 group hover:bg-transparent">
                  عرض كافة المنتجات
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            
            {productsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <Loader2 className="w-10 h-10 animate-spin text-accent" />
                 <p className="font-bold text-muted-foreground">جاري تحميل أحدث القطع...</p>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="py-20 text-center bg-muted/30 rounded-2xl border-2 border-dashed">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="font-black text-muted-foreground">لا توجد منتجات معروضة حالياً.</p>
              </div>
            ) : (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8"
              >
                {featuredProducts.map((product) => (
                  <motion.div 
                    key={product.id} 
                    variants={fadeInVariants}
                    className="bg-card rounded-[15px] md:rounded-[20px] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group border border-border/40"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted/10">
                      <Image 
                        src={product.img} 
                        alt={product.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" />
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20">
                          <Badge className="bg-accent text-white font-black rounded-md md:rounded-lg px-1.5 py-0.5 md:px-2 md:py-1 shadow-sm border-none text-[8px] md:text-[10px]">
                            %{product.discount.toLocaleString('en-US')} خصم
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-3 md:p-4 flex flex-col flex-1 gap-2 md:gap-3">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm md:text-base font-black text-secondary flex-1 leading-tight line-clamp-1">{product.name}</h4>
                        <div className="flex items-center gap-0.5 md:gap-1 text-accent shrink-0 mr-1 md:mr-2">
                          <span className="text-[10px] md:text-xs font-black">{product.rating.toLocaleString('en-US')}</span>
                          <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                        </div>
                      </div>
                      
                      <div className="space-y-1 md:space-y-2">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Store className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                          <span className="text-[10px] md:text-xs font-bold">{product.store}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-1 md:pt-2 space-y-2 md:space-y-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1 md:gap-2">
                             <span className="text-base md:text-lg font-black text-secondary">{product.price.toLocaleString('en-US')} <span className="text-[9px] md:text-[10px] font-bold">ريال</span></span>
                             {product.oldPrice > product.price && (
                               <span className="text-[10px] md:text-xs font-bold text-muted-foreground line-through opacity-50">{product.oldPrice.toLocaleString('en-US')}</span>
                             )}
                          </div>
                        </div>
                        <Button 
                          onClick={() => addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.img,
                            quantity: 1
                          })}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black gap-1 md:gap-2 h-9 md:h-11 rounded-lg md:rounded-xl transition-all shadow-sm text-[10px] md:text-sm px-2"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" /> إضافة للسلة
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Stores Section - معارض الأثاث فقط */}
        <section className="py-24 bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ffffff' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l10.99-6.35L25 17.9v12.7L13.99 36.95 3 30.6V17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.31zM28 15l-12.98-7.5V0h2v6.35L28 12.69v2.3zm0 18.5l-12.98 7.5v8h2v-6.85l12.98-7.5v-2.31z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
          
          <div className="container relative z-10 px-4 md:px-8 mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInVariants}
              className="text-center mb-16 space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-black text-white">أبرز المتاجر المعتمدة</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto font-medium">نخبة من أفضل معارض الأثاث التي تقدم أرقى المجموعات الجاهزة والمصنعة.</p>
            </motion.div>
            
            {storesLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-accent" />
              </div>
            ) : storesData?.length === 0 ? (
              <div className="py-20 text-center text-gray-400 font-bold">لا توجد متاجر معروضة حالياً.</div>
            ) : (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {storesData?.map((store: any) => (
                  <motion.div
                    key={store.id}
                    variants={fadeInVariants}
                  >
                    <Link 
                      href={`/vendors/${store.id}`}
                      className="group bg-card/95 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col rounded-[15px] h-full"
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
                          <div className="w-12 h-12 bg-card p-1 shadow-xl relative overflow-hidden rounded-md">
                            <Image 
                              src={store.logo_url || `https://picsum.photos/seed/${store.id}-logo/200/200`}
                              alt="Logo"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="text-white">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-black text-base">{store.business_name}</h4>
                              <CheckCircle2 className="w-3.5 h-3.5 text-accent fill-white" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-2 italic">
                          "{store.description || 'شريك معتمد في منصة إيوان للأثاث الفاخر.'}"
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                          <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
                            <MapPin className="w-3.5 h-3.5 text-accent" />
                            {store.service_areas && store.service_areas.length > 0 ? store.service_areas[0] : store.city || 'اليمن'}
                          </div>
                          <Button variant="outline" size="sm" className="h-9 font-bold border-secondary/10 hover:bg-secondary hover:text-white transition-all rounded-md">
                            تصفح المتجر 
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-24 bg-background border-y border-border/50">
          <div className="container px-4 md:px-8 mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInVariants}
              className="text-center space-y-4 max-w-2xl mx-auto mb-16"
            >
              <h3 className="text-3xl font-black text-secondary">شركاء النجاح</h3>
              <p className="text-muted-foreground font-medium">
                نتعاون مع أفضل الخبرات المحلية والعالمية لتقديم الجودة والابتكار.
              </p>
            </motion.div>
            
            {partnersLoading ? (
              <div className="flex justify-center py-10">
                 <Loader2 className="w-10 h-10 animate-spin text-accent" />
              </div>
            ) : partnersData?.length === 0 ? (
              <div className="text-center text-muted-foreground font-bold">انضم إلينا كشريك نجاح اليوم.</div>
            ) : (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-12"
              >
                {partnersData?.map((partner: any) => (
                  <motion.div 
                    key={partner.id} 
                    variants={fadeInVariants}
                    className="relative w-full h-12 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500"
                  >
                    <Image 
                      src={partner.logo_url} 
                      alt={partner.name} 
                      fill 
                      className="object-contain" 
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Professionals Section - المصممين والنجارين */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="container px-4 md:px-8 mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInVariants}
              className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6"
            >
              <div className="text-center md:text-right space-y-4">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-lg text-primary font-black text-xs uppercase">
                    <Award className="w-4 h-4" /> نخبة الحرفيين
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-secondary">نجارين ومصممين مبدعين</h2>
                 <p className="text-muted-foreground text-lg max-w-xl">تعاون مع أمهر المحترفين لتنفيذ قطع أثاث مخصصة وفريدة لمساحتك.</p>
              </div>
              <Link href="/professionals">
                 <Button variant="ghost" className="text-accent font-black text-lg p-0 flex gap-2 group hover:bg-transparent">
                   عرض كافة الخبراء
                   <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                 </Button>
              </Link>
            </motion.div>

            {prosLoading ? (
               <div className="flex justify-center py-20">
                 <Loader2 className="w-10 h-10 animate-spin text-accent" />
               </div>
            ) : prosData?.length === 0 ? (
               <div className="py-20 text-center text-muted-foreground font-bold italic">لا يوجد مهنيون مسجلون حالياً.</div>
            ) : (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {prosData?.map((pro: any) => (
                  <motion.div key={pro.id} variants={fadeInVariants}>
                    <Link 
                      href={`/vendors/${pro.id}`}
                      className="group bg-[#F4F6F5]/50 border border-border/40 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col rounded-[24px] h-full"
                    >
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image src={pro.cover_url || `https://picsum.photos/seed/${pro.id}/800/400`} alt={pro.business_name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent" />
                        <div className="absolute bottom-4 right-6 left-6 flex items-center gap-4">
                          <div className="w-16 h-16 bg-white p-1 shadow-2xl relative overflow-hidden rounded-xl shrink-0 border-2 border-white/20">
                            <Image src={pro.logo_url || `https://picsum.photos/seed/${pro.id}-logo/200/200`} alt="Logo" fill className="object-cover" />
                          </div>
                          <div className="text-white space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-xl tracking-tight leading-none">{pro.business_name}</h4>
                              <CheckCircle2 className="w-5 h-5 text-primary fill-white" />
                            </div>
                            <Badge variant="outline" className="bg-white/10 text-[10px] text-white border-white/20 font-bold uppercase py-0 px-2 rounded-md">
                              {pro.business_type === 'carpenter' ? 'نجار معتمد' : 'مصمم ديكور'}
                            </Badge>
                          </div>
                        </div>
                        <div className="absolute top-4 left-4">
                           <Badge className="bg-white/90 backdrop-blur-sm text-secondary font-black border-none px-3 py-1.5 flex items-center gap-1 shadow-xl rounded-lg">
                             <Star className="w-4 h-4 text-amber-500 fill-current" />
                             {pro.average_rating ? pro.average_rating.toLocaleString('en-US') : '5.0'}
                           </Badge>
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col space-y-6">
                        <p className="text-[15px] text-muted-foreground leading-relaxed font-medium line-clamp-3">
                          {pro.description || 'يقدم هذا الخبير خدمات احترافية موثقة لضمان جودة التصنيع والتركيب.'}
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                          <div className="flex items-center gap-2 text-secondary font-black text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            {pro.service_areas && pro.service_areas.length > 0 ? pro.service_areas[0] : pro.city || 'اليمن'}
                          </div>
                          <Button variant="ghost" size="sm" className="h-11 font-black text-primary hover:bg-primary/5 transition-all rounded-xl gap-2 group/btn">
                            طلب خدمة 
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ffffff' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l10.99-6.35L25 17.9v12.7L13.99 36.95 3 30.6V17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.31zM28 15l-12.98-7.5V0h2v6.35L28 12.69v2.3zm0 18.5l-12.98 7.5v8h2v-6.85l12.98-7.5v-2.31z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
          
          <div className="container px-4 md:px-8 mx-auto relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInVariants}
              className="text-center mb-16 space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-black">ماذا يقول عملاؤنا؟</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">قصص نجاح حقيقية بدأت بلمسة من إيوان وانتهت بمساحات مذهلة.</p>
            </motion.div>
            
            {testimonialsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-accent" />
              </div>
            ) : testimonialsData?.length === 0 ? (
              <div className="text-center text-gray-400 font-bold">كن أول من يشاركنا تجربته مع إيوان.</div>
            ) : (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8"
              >
                {testimonialsData?.map((t: any) => (
                  <motion.div 
                    key={t.id} 
                    variants={fadeInVariants}
                    className="group relative p-4 md:p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[15px] space-y-4 hover:bg-white/10 transition-all duration-500 shadow-xl flex flex-col h-full text-right"
                  >
                    <div className="flex gap-0.5 text-accent justify-start">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star key={starIdx} className={cn("w-3 h-3 md:w-4 md:h-4", starIdx >= (t.rating || 5) ? "fill-none" : "fill-current")} />
                      ))}
                    </div>
                    <p className="text-xs md:text-base font-medium leading-relaxed italic line-clamp-4 flex-1">
                      "{t.text}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-lg overflow-hidden shrink-0 bg-white/10 flex items-center justify-center font-black text-accent text-xs">
                        {t.avatar_url ? <Image src={t.avatar_url} alt={t.name} fill className="object-cover" /> : t.name?.charAt(0)}
                      </div>
                      <div className="text-right min-w-0">
                        <h4 className="font-black text-white text-[10px] md:text-sm truncate">{t.name}</h4>
                        <p className="text-[8px] md:text-xs text-accent font-bold mt-0.5 truncate">{t.role || 'عميل إيوان'}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-background">
          <div className="container px-4 md:px-8 max-w-4xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInVariants}
              className="text-center mb-16 space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-black text-secondary">الأسئلة الشائعة</h2>
              <p className="text-muted-foreground">كل ما تحتاج معرفته حول رحلتك مع إيوان.</p>
            </motion.div>

            {faqsLoading ? (
               <div className="flex justify-center py-10">
                 <Loader2 className="w-10 h-10 animate-spin text-accent" />
               </div>
            ) : (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
              >
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {faqsData?.map((item: any, i: number) => (
                    <AccordionItem key={i} value={`item-${i}`} className="bg-muted/30 border-none rounded-[15px] px-6">
                      <AccordionTrigger className="text-sm md:text-lg font-bold text-secondary hover:no-underline py-5 text-right">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed text-sm md:text-base pb-5 text-right">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}