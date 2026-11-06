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
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Truck,
  Hammer,
  Quote,
  ChevronRight,
  Sparkles,
  Loader2,
  HelpCircle
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
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const db = useFirestore();
  const { addToCart } = useCart();

  const productsQuery = useMemo(() => query(
    collection(db, 'products'),
    orderBy('created_at', 'desc'),
    limit(4)
  ), [db]);
  const { data: productsData, loading: productsLoading } = useCollection(productsQuery);

  const storesQuery = useMemo(() => query(
    collection(db, 'vendors'),
    limit(3)
  ), [db]);
  const { data: storesData, loading: storesLoading } = useCollection(storesQuery);

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
    limit(3)
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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemFadeUp = {
    hidden: { y: 60, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const itemFadeRight = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1, ease: "easeOut" } }
  };

  const itemFadeLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1, ease: "easeOut" } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background" dir="rtl">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-secondary scroll-mt-20">
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
              variants={itemFadeRight}
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
        <section className="pt-32 pb-12 bg-background relative overflow-hidden scroll-mt-20">
          <div className="container px-4 md:px-8 mx-auto text-center relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={itemFadeUp}
              className="mb-20 space-y-5 text-center"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="h-1 w-12 bg-accent rounded-full"></div>
                <span className="text-accent font-black tracking-widest text-xs uppercase">لماذا نحن الأفضل</span>
                <div className="h-1 w-12 bg-accent rounded-full"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-secondary tracking-tight">لماذا تختار إيوان؟</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">نجمع بين التكنولوجيا المتطورة وحرفية النجار اليمني لنقدم لك تجربة تأثيث لا تُنسى.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
            >
              {features.map((feature, i) => (
                <motion.div 
                  key={i} 
                  variants={itemFadeUp}
                  className="group relative p-10 bg-primary border border-white/5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center overflow-hidden transform hover:-translate-y-2"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors" />
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-8 bg-accent text-white shadow-lg shadow-accent/20 transition-all duration-500 group-hover:scale-110 relative z-10">
                    <feature.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 relative z-10 tracking-tight">{feature.title}</h3>
                  <p className="text-gray-300 font-bold leading-relaxed text-sm relative z-10">{feature.desc}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 bg-background scroll-mt-20">
          <div className="container px-4 md:px-8 mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={itemFadeLeft}
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
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {featuredProducts.map((product, idx) => (
                  <motion.div 
                    key={product.id} 
                    variants={itemFadeUp}
                    className="bg-card rounded-[20px] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group border border-border/40"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted/10">
                      <Image 
                        src={product.img} 
                        alt={product.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-[2px] opacity-40" />
                      
                      <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" />
                      {product.discount > 0 && (
                        <div className="absolute top-3 right-3 z-20">
                          <Badge className="bg-accent text-white font-black rounded-lg px-2 py-1 shadow-sm border-none text-[10px]">
                            %{product.discount.toLocaleString('en-US')} خصم
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1 gap-3">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-black text-secondary flex-1 leading-tight line-clamp-1">{product.name}</h4>
                        <div className="flex items-center gap-1 text-accent shrink-0 mr-2">
                          <span className="text-xs font-black">{product.rating.toLocaleString('en-US')}</span>
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Store className="w-4 h-4 text-accent" />
                          <span className="text-xs font-bold">{product.store}</span>
                        </div>
                        <div className="w-fit">
                          <Badge variant="outline" className="text-[9px] font-bold text-accent border-accent/20 bg-accent/5 px-2 py-0.5 rounded-full uppercase">
                            {product.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-auto pt-2 space-y-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                             <span className="text-lg font-black text-secondary">{product.price.toLocaleString('en-US')} <span className="text-[10px] font-bold">ريال</span></span>
                             {product.oldPrice > product.price && (
                               <span className="text-xs font-bold text-muted-foreground line-through opacity-50">{product.oldPrice.toLocaleString('en-US')}</span>
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
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black gap-2 h-11 rounded-xl transition-all shadow-sm"
                        >
                          <ShoppingBag className="w-4 h-4" /> إضافة للسلة
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Stores Section */}
        <section className="py-24 bg-secondary relative overflow-hidden scroll-mt-20">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ffffff' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l10.99-6.35L25 17.9v12.7L13.99 36.95 3 30.6V17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.31zM28 15l-12.98-7.5V0h2v6.35L28 12.69v2.3zm0 18.5l-12.98 7.5v8h2v-6.85l12.98-7.5v-2.31z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
          
          <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 translate-x-1/2" />
          <div className="container relative z-10 px-4 md:px-8 mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={itemFadeUp}
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
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {storesData?.map((store: any, i: number) => (
                  <motion.div
                    key={i}
                    variants={i % 2 === 0 ? itemFadeRight : itemFadeLeft}
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
                          <div className="w-14 h-14 bg-card p-1 shadow-xl relative overflow-hidden rounded-md">
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
                              <CheckCircle2 className="w-4 h-4 text-accent fill-white" />
                            </div>
                            <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-[10px] uppercase">
                              معرض أثاث
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 backdrop-blur-sm text-secondary font-black border-none px-2 py-1 flex items-center gap-1 shadow-lg rounded-md">
                            <Star className="w-3 h-3 text-accent fill-current" />
                            {(store.average_rating || 5.0).toLocaleString('en-US')}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-2 italic">
                          "{store.description || 'شريك معتمد في منصة إيوان للأثاث الفاخر.'}"
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                          <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
                            <MapPin className="w-3.5 h-3.5 text-accent" />
                            {store.city}
                          </div>
                          <Button variant="outline" size="sm" className="h-10 font-bold border-secondary/10 hover:bg-secondary hover:text-white transition-all rounded-md">
                            تصفح المنتجات 
                            <ArrowLeft className="w-4 h-4 mr-2" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemFadeUp}
              className="mt-16 text-center"
            >
               <Link href="/vendors">
                 <Button size="lg" className="h-16 px-12 rounded-xl bg-accent hover:bg-accent/90 text-white font-black text-xl shadow-2xl shadow-accent/40 transition-all hover:-translate-y-1">
                   شاهد كافة المتاجر <ChevronRight className="w-6 h-6 mr-2 rotate-180" />
                 </Button>
               </Link>
            </motion.div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-28 bg-background border-y border-border/50 scroll-mt-20">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="space-y-20">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={itemFadeUp}
                className="text-center space-y-4 max-w-2xl mx-auto"
              >
                <div className="h-1 w-12 bg-accent mx-auto rounded-full mb-4"></div>
                <h3 className="text-3xl font-black text-secondary">شركاء النجاح</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  نتعاون مع أفضل الخبرات المحلية والعالمية لتقديم الجودة والابتكار التي يستحقها عملاؤنا في اليمن.
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
                  viewport={{ once: true, amount: 0.2 }}
                  variants={containerVariants}
                  className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                >
                  {partnersData?.map((partner: any, i: number) => (
                    <motion.div 
                      key={i} 
                      variants={itemFadeUp}
                      whileHover={{ scale: 1.1 }}
                      className="relative w-32 h-14 md:w-40 md:h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 group"
                    >
                      <Image 
                        src={partner.logo_url} 
                        alt={partner.name} 
                        fill 
                        className="object-contain opacity-70 group-hover:opacity-100 transition-opacity" 
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-secondary text-white relative overflow-hidden scroll-mt-20">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ffffff' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l10.99-6.35L25 17.9v12.7L13.99 36.95 3 30.6V17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.31zM28 15l-12.98-7.5V0h2v6.35L28 12.69v2.3zm0 18.5l-12.98 7.5v8h2v-6.85l12.98-7.5v-2.31z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
          
          <Quote className="absolute -top-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
          <Quote className="absolute -bottom-10 -left-10 w-64 h-64 text-white/5 -rotate-12" />
          
          <div className="container px-4 md:px-8 mx-auto relative z-10">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={itemFadeUp}
              className="text-center mb-20 space-y-6"
            >
              <div className="w-20 h-20 bg-accent/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Quote className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black">ماذا يقول عملاؤنا؟</h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">قصص نجاح حقيقية بدأت بلمسة من إيوان وانتهت بمساحات مذهلة.</p>
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
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {testimonialsData?.map((t: any, i: number) => (
                  <motion.div 
                    key={i} 
                    variants={itemFadeUp}
                    className="group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[15px] space-y-6 hover:bg-white/10 transition-all duration-500 shadow-xl flex flex-col h-full text-right"
                  >
                    <div className="flex gap-1 text-accent justify-start">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star key={starIdx} className={cn("w-4 h-4", starIdx >= (t.rating || 5) ? "fill-none" : "fill-current")} />
                      ))}
                    </div>
                    
                    <div className="relative flex-1">
                      <Quote className="absolute -top-4 -right-4 w-10 h-10 text-accent opacity-20" />
                      <p className="text-lg font-medium leading-relaxed text-right relative z-10 italic">
                        "{t.text}"
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg border-2 border-accent/20 shrink-0 bg-white/10">
                        {t.avatar_url ? (
                          <Image src={t.avatar_url} alt={t.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-black text-accent text-xl">{t.name?.charAt(0)}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <h4 className="font-black text-white text-base">{t.name}</h4>
                        <p className="text-xs text-accent font-bold mt-0.5">{t.role || 'عميل إيوان'}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemFadeUp}
              className="mt-16 text-center"
            >
               <Link href="/reviews">
                 <Button variant="outline" size="lg" className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 font-black px-12 h-14 transition-all">
                   عرض كافة الآراء <ArrowLeft className="w-5 h-5 mr-2" />
                 </Button>
               </Link>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 md:py-24 bg-background scroll-mt-20">
          <div className="container px-4 md:px-8 max-w-4xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={itemFadeRight}
              className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-right"
            >
              <div className="space-y-3 md:space-y-4">
                <div className="h-6 md:h-8 w-1 bg-accent inline-block align-middle ml-3 md:ml-4 rounded-full"></div>
                <h2 className="text-2xl md:text-4xl font-black text-secondary inline-block align-middle">الأسئلة الشائعة</h2>
                <p className="text-muted-foreground text-sm md:text-lg">كل ما تحتاج معرفته حول رحلتك مع إيوان.</p>
              </div>
              <Link href="/faq">
                <Button variant="ghost" className="text-accent font-black text-base md:text-lg p-0 flex gap-2 group hover:bg-transparent">
                  عرض كل الأسئلة
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {faqsLoading ? (
               <div className="flex justify-center py-10">
                 <Loader2 className="w-10 h-10 animate-spin text-accent" />
               </div>
            ) : faqsData?.length === 0 ? (
               <div className="text-center py-10 bg-muted/30 rounded-xl border-2 border-dashed">لا توجد أسئلة مضافة حالياً.</div>
            ) : (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={itemFadeUp}
              >
                <Accordion type="single" collapsible className="w-full space-y-3 md:space-y-4">
                  {faqsData?.map((item: any, i: number) => (
                    <AccordionItem key={i} value={`item-${i}`} className="bg-muted/30 border-none rounded-[15px] px-4 md:px-6 overflow-hidden">
                      <AccordionTrigger className="text-sm md:text-lg font-bold text-secondary hover:no-underline py-4 md:py-6 text-right leading-snug">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed text-[13px] md:text-[15px] pb-4 md:pb-6 text-right">
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
