'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  Share2, 
  Info,
  Package,
  Clock,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  Heart,
  Store,
  Quote,
  Calendar,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

type VendorDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function VendorDetailPage({ params }: VendorDetailPageProps) {
  const { id } = use(params);

  // Mock data for a vendor
  const vendor = {
    id,
    business_name: 'ورشة إتقان للنجارة',
    business_type: 'carpenter',
    description: 'متخصصون في صناعة غرف النوم والدواوين الخشبية الفاخرة بجودة يمنية أصيلة وأخشاب زان طبيعية مستوردة. نفخر بتقديم ضمان حقيقي يمتد لـ 5 سنوات على كافة أعمالنا الخشبية والتنجيد. خبرة أكثر من 20 عاماً في السوق اليمني جعلتنا الخيار الأول للباحثين عن الفخامة والاستدامة.',
    city: 'صنعاء، حي حدة',
    average_rating: 4.9,
    reviewsCount: 342,
    service_areas: ['صنعاء', 'عدن', 'تعز', 'المكلا', 'إب'],
    cover_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=1200',
    logo_url: 'https://picsum.photos/seed/v1/200/200',
    stats: [
      { label: 'منتج متاح', value: '45', icon: Package },
      { label: 'سنة خبرة', value: '20+', icon: Clock },
      { label: 'تقييم عام', value: '4.9', icon: Star },
    ]
  };

  const mockProducts = [
    { id: 1, name: 'طقم ديوان حضرمي مطور', category: 'غرف معيشة', price: 450000, rating: 4.9, store: 'ورشة إتقان', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600' },
    { id: 2, name: 'سرير خشبي ملكي', category: 'غرف نوم', price: 280000, rating: 4.8, store: 'ورشة إتقان', img: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=600' },
    { id: 3, name: 'طاولة طعام دائرية', category: 'مطابخ', price: 120000, rating: 4.7, store: 'ورشة إتقان', img: 'https://images.unsplash.com/photo-1577145000247-a737ad733c99?auto=format&fit=crop&q=80&w=600' },
    { id: 4, name: 'خزانة ملابس 4 أبواب', category: 'غرف نوم', price: 350000, rating: 4.6, store: 'ورشة إتقان', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600' }
  ];

  const reviews = [
    { name: 'محمد القاضي', avatar: 'https://picsum.photos/seed/u1/100/100', text: 'شغل نظيف جداً ودقة في المواعيد. الطقم الحضرمي الذي طلبته كان تحفة فنية حقيقية. شكراً لفريق ورشة إتقان على هذا المجهود الرائع.', rating: 5, date: 'منذ شهر' },
    { name: 'أروى باوزير', avatar: 'https://picsum.photos/seed/u2/100/100', text: 'جودة الخشب ممتازة والتعامل راقي جداً. أنصح بالتعامل معهم لأي شخص يبحث عن التميز والقطع التي تدوم طويلاً.', rating: 4, date: 'منذ شهرين' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans" dir="rtl">
      <Header />

      <main className="flex-1">
        {/* Profile Header */}
        <section className="relative h-[45vh] w-full">
          <Image 
            src={vendor.cover_url} 
            alt={vendor.business_name} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          <div className="container mx-auto px-4 md:px-8 h-full relative z-10 flex flex-col justify-end pb-12">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-right">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-white p-1 rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden shrink-0 border-4 border-white/20">
                <Image src={vendor.logo_url} alt="Logo" fill className="object-cover" />
              </div>
              
              <div className="flex-1 space-y-4 text-white">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight">{vendor.business_name}</h1>
                  <CheckCircle2 className="w-7 h-7 text-primary fill-white" />
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm md:text-lg font-bold text-gray-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {vendor.city}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-current" />
                    {vendor.average_rating.toLocaleString('en-US')} ({vendor.reviewsCount.toLocaleString('en-US')} تقييم)
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pb-2">
                <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-black px-10 h-14 shadow-2xl shadow-primary/30 gap-3 text-lg">
                  <MessageSquare className="w-6 h-6" /> محادثة فورية
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 w-14 h-14">
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar Info (Right Side) */}
            <div className="lg:col-span-1 space-y-10 order-2 lg:order-1">
              <div className="bg-white p-8 border border-border/50 rounded-[24px] shadow-sm space-y-10">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-secondary flex items-center gap-3">
                    <Info className="w-5 h-5 text-primary" /> نبذة عن الشريك
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    {vendor.description}
                  </p>
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="text-xl font-black text-secondary">إحصائيات الأداء</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {vendor.stats.map((stat, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-primary/10 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                            <stat.icon className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold text-muted-foreground">{stat.label}</span>
                        </div>
                        <span className="text-xl font-black text-secondary">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-secondary">مناطق الخدمة المتاحة</h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {vendor.service_areas.map((area) => (
                      <Badge key={area} variant="secondary" className="bg-primary/10 text-primary border-none rounded-lg px-4 py-1.5 font-bold">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verified Badge Side Card */}
              <div className="p-8 bg-secondary text-white rounded-[24px] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45" />
                 <CheckCircle2 className="w-12 h-12 text-primary mb-6" />
                 <h4 className="text-2xl font-black mb-2">شريك معتمد</h4>
                 <p className="text-gray-400 text-sm font-medium leading-relaxed">هذا المتجر خضع لعملية التحقق من الهوية وجودة المنتجات من قبل فريق إيوان الفني.</p>
              </div>
            </div>

            {/* Main Content Areas (Left Side) */}
            <div className="lg:col-span-3 space-y-12 order-1 lg:order-2">
              <Tabs defaultValue="products" className="w-full" dir="rtl">
                <TabsList className="w-full justify-start h-16 bg-transparent border-b rounded-none p-0 gap-10 overflow-x-auto no-scrollbar">
                  <TabsTrigger value="products" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-black text-xl px-4">المنتجات المعروضة</TabsTrigger>
                  <TabsTrigger value="reviews" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-black text-xl px-4">آراء العملاء</TabsTrigger>
                  <TabsTrigger value="gallery" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-black text-xl px-4">معرض الأعمال</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="py-12 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockProducts.map((product) => (
                      <div key={product.id} className="group bg-gray-50 border border-border/50 rounded-[20px] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                        <div className="relative aspect-square overflow-hidden bg-white/50">
                          <Image src={product.img} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                          <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button className="bg-white text-secondary font-black rounded-xl shadow-xl px-8 py-3">عرض التفاصيل</Button>
                            </div>
                          </Link>
                          <div className="absolute top-4 right-4 z-20">
                             <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-md rounded-full text-secondary hover:text-destructive w-10 h-10 shadow-sm"><Heart className="w-5 h-5" /></Button>
                          </div>
                        </div>
                        <div className="p-6 space-y-4 flex-1 flex flex-col">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-lg font-black text-secondary group-hover:text-primary transition-colors line-clamp-1">{product.name}</h4>
                            <div className="flex items-center gap-1 text-amber-500 shrink-0">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="text-xs font-black">{product.rating.toLocaleString('en-US')}</span>
                            </div>
                          </div>

                          <div className="flex">
                            <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/20 bg-primary/5 px-2 py-0">
                              {product.category}
                            </Badge>
                          </div>

                          <div className="mt-auto pt-4 border-t border-gray-100">
                            <p className="text-2xl font-black text-secondary">{product.price.toLocaleString('en-US')} <span className="text-sm font-bold">ريال يمني</span></p>
                            <Button className="w-full mt-4 bg-secondary hover:bg-primary text-white font-black gap-2 rounded-xl h-12 transition-all shadow-xl shadow-secondary/10">
                              <ShoppingBag className="w-5 h-5" /> إضافة للسلة
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="py-12 animate-in fade-in duration-500">
                  <div className="space-y-8">
                    <div className="bg-primary/5 p-10 rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-8 border border-primary/10">
                       <div className="text-center md:text-right">
                         <h3 className="text-5xl font-black text-primary mb-2">{vendor.average_rating.toLocaleString('en-US')}</h3>
                         <div className="flex gap-1 justify-center md:justify-start text-amber-500 mb-2">
                           {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="fill-current w-6 h-6" />)}
                         </div>
                         <p className="text-muted-foreground font-bold">بناءً على {vendor.reviewsCount.toLocaleString('en-US')} رأي حقيقي</p>
                       </div>
                       <Button className="h-14 px-10 rounded-xl bg-secondary text-white font-black text-lg shadow-xl shadow-secondary/20">أضف تجربتك مع المتجر</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {reviews.map((rev, i) => (
                        <div key={i} className="p-8 bg-white border border-border/50 rounded-[24px] space-y-6 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="relative w-14 h-14 rounded-xl overflow-hidden border shadow-inner">
                                <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                              </div>
                              <div>
                                <p className="font-black text-secondary text-lg">{rev.name}</p>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                                  <Calendar className="w-3.5 h-3.5" /> {rev.date}
                                </div>
                              </div>
                            </div>
                            <div className="flex text-amber-500">
                              {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} className="fill-current w-4 h-4" />)}
                            </div>
                          </div>
                          <div className="relative">
                            <Quote className="absolute -top-2 -right-2 w-8 h-8 text-primary opacity-10" />
                            <p className="text-muted-foreground leading-relaxed font-medium italic relative z-10 pr-4">"{rev.text}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="gallery" className="py-12 animate-in fade-in duration-500">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-gray-100 group cursor-pointer shadow-sm">
                        <Image src={`https://picsum.photos/seed/gall-${i}/600/800`} alt="Gallery" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                          <p className="text-white font-black text-sm mb-2">مشروع تفصيل متكامل</p>
                          <div className="flex items-center gap-2 text-primary-foreground/80 text-[10px] font-bold">
                            <Maximize2 className="w-3 h-3" /> صنعاء، 2024
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
