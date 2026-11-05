
'use client';

import { use, useState, useEffect } from 'react';
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
  Maximize2,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

type VendorDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function VendorDetailPage({ params }: VendorDetailPageProps) {
  const { id } = use(params);
  const db = useFirestore();
  const { data: vendorData, loading: vendorLoading } = useDoc(doc(db, 'vendors', id));

  // Mock data for cases where DB fields are missing
  const vendor = {
    ...vendorData,
    id,
    business_name: vendorData?.business_name || 'اسم الشريك المعتمد',
    description: vendorData?.description || 'هذا الشريك يقدم خدمات ومنتجات عالية الجودة موثقة من قبل إيوان لضمان رضاكم.',
    city: vendorData?.city || 'اليمن',
    average_rating: vendorData?.average_rating || 4.9,
    reviewsCount: 154,
    service_areas: vendorData?.service_areas || ['صنعاء', 'عدن', 'تعز'],
    cover_url: vendorData?.cover_base64 || vendorData?.cover_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    logo_url: vendorData?.logo_base64 || vendorData?.logo_url || 'https://picsum.photos/seed/v1/200/200',
    stats: [
      { label: 'منتج متاح', value: '45+', icon: Package },
      { label: 'سنة خبرة', value: vendorData?.experience_years || '10+', icon: Clock },
      { label: 'تقييم عام', value: vendorData?.average_rating || '4.9', icon: Star },
    ]
  };

  const reviews = [
    { name: 'محمد القاضي', avatar: 'https://picsum.photos/seed/u1/100/100', text: 'شغل نظيف جداً ودقة في المواعيد. القطعة التي طلبتها كانت تحفة فنية حقيقية. شكراً للفريق على هذا المجهود الرائع.', rating: 5, date: 'منذ شهر' },
    { name: 'أروى باوزير', avatar: 'https://picsum.photos/seed/u2/100/100', text: 'جودة ممتازة والتعامل راقي جداً. أنصح بالتعامل معهم لأي شخص يبحث عن التميز والقطع التي تدوم طويلاً.', rating: 4, date: 'منذ شهرين' }
  ];

  if (vendorLoading) return <div className="h-screen flex items-center justify-center font-black">جاري تحميل بيانات الشريك...</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans" dir="rtl">
      <Header />

      <main className="flex-1">
        {/* Profile Header - Premium Layout */}
        <section className="relative h-[50vh] w-full">
          <Image 
            src={vendor.cover_url} 
            alt={vendor.business_name} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          <div className="container mx-auto px-4 md:px-8 h-full relative z-10 flex flex-col justify-end pb-16">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-10 text-center md:text-right">
              <div className="w-40 h-40 md:w-56 md:h-56 bg-white p-2 rounded-[2rem] shadow-2xl relative overflow-hidden shrink-0 border-4 border-white/20 -mb-8 z-20">
                <Image src={vendor.logo_url} alt="Logo" fill className="object-cover" />
              </div>
              
              <div className="flex-1 space-y-4 text-white pb-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <h1 className="text-4xl md:text-7xl font-black tracking-tight">{vendor.business_name}</h1>
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg"><CheckCircle2 className="w-6 h-6 text-white" /></div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-sm md:text-xl font-bold text-gray-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-primary" />
                    {vendor.city}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-amber-500 fill-current" />
                    {vendor.average_rating} ({vendor.reviewsCount} تقييم)
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pb-6">
                <Button className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-black px-12 h-16 shadow-2xl shadow-primary/40 gap-4 text-xl group">
                  <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" /> محادثة فورية
                </Button>
                <Button variant="outline" size="icon" className="rounded-2xl bg-white/10 border-white/20 text-white hover:bg-white/20 w-16 h-16 shadow-xl">
                  <Share2 className="w-7 h-7" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 md:px-8 pt-20 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar Info (Right Side) */}
            <div className="lg:col-span-1 space-y-10 order-2 lg:order-1">
              <div className="bg-white p-10 border border-border/50 rounded-[35px] shadow-sm space-y-10 relative overflow-hidden">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-secondary flex items-center gap-3">
                    <Info className="w-6 h-6 text-primary" /> نبذة عن الشريك
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    {vendor.description}
                  </p>
                </div>

                <Separator className="bg-gray-100" />

                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-secondary">إحصائيات الأداء</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {vendor.stats.map((stat, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-primary/10 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                            <stat.icon className="w-6 h-6" />
                          </div>
                          <span className="text-base font-bold text-muted-foreground">{stat.label}</span>
                        </div>
                        <span className="text-2xl font-black text-secondary">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-secondary">مناطق الخدمة</h3>
                  <div className="flex flex-wrap gap-3">
                    {vendor.service_areas.map((area: string) => (
                      <Badge key={area} className="bg-primary/5 text-primary border border-primary/10 rounded-xl px-5 py-2 font-black text-sm">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-10 bg-secondary text-white rounded-[35px] relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45 transition-transform group-hover:scale-110" />
                 <Award className="w-14 h-14 text-primary mb-8" />
                 <h4 className="text-3xl font-black mb-4">شريك إيوان الذهبي</h4>
                 <p className="text-gray-400 text-base font-medium leading-relaxed">هذا المتجر يلتزم بأعلى معايير الجودة اليمنية ويقدم ضمانات حقيقية لعملائه.</p>
              </div>
            </div>

            {/* Main Content Areas (Left Side) */}
            <div className="lg:col-span-3 space-y-12 order-1 lg:order-2">
              <Tabs defaultValue="products" className="w-full">
                <TabsList className="w-full justify-start h-20 bg-white border border-border/50 rounded-[2rem] p-2 gap-2 shadow-sm mb-12">
                  <TabsTrigger value="products" className="h-full rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white font-black text-xl px-10 transition-all">المنتجات المعروضة</TabsTrigger>
                  <TabsTrigger value="reviews" className="h-full rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white font-black text-xl px-10 transition-all">آراء العملاء</TabsTrigger>
                  <TabsTrigger value="gallery" className="h-full rounded-2xl data-[state=active]:bg-primary data-[state=active]:text-white font-black text-xl px-10 transition-all">معرض الأعمال</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="group bg-white border border-border/40 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                          <Image src={`https://picsum.photos/seed/p${i}${id}/600/800`} alt="Product" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                            <Button className="w-full bg-white text-secondary font-black rounded-2xl h-14 text-lg">طلب تفاصيل السعر</Button>
                          </div>
                        </div>
                        <div className="p-8 space-y-4">
                          <h4 className="text-xl font-black text-secondary group-hover:text-primary transition-colors line-clamp-1">منتج إيوان المختار {i}</h4>
                          <div className="flex justify-between items-center">
                             <p className="text-2xl font-black text-primary">٤٥٠,٠٠٠ <span className="text-xs">ر.ي</span></p>
                             <div className="flex text-amber-500"><Star className="w-4 h-4 fill-current" /><span className="text-xs font-black mr-1 text-secondary">4.9</span></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                  <div className="bg-primary/5 p-12 rounded-[35px] flex flex-col md:flex-row items-center justify-between gap-10 border border-primary/10">
                     <div className="text-center md:text-right">
                       <h3 className="text-7xl font-black text-primary mb-2">{vendor.average_rating}</h3>
                       <div className="flex gap-2 justify-center md:justify-start text-amber-500 mb-2">
                         {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="fill-current w-8 h-8" />)}
                       </div>
                       <p className="text-muted-foreground font-bold text-lg">بناءً على {vendor.reviewsCount} رأي حقيقي</p>
                     </div>
                     <Button className="h-16 px-12 rounded-2xl bg-secondary text-white font-black text-xl shadow-2xl shadow-secondary/20 hover:-translate-y-1 transition-all">أضف تجربتك الآن</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviews.map((rev, i) => (
                      <div key={i} className="p-10 bg-white border border-border/50 rounded-[2.5rem] space-y-8 shadow-sm hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-5">
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/10 shadow-inner">
                              <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                            </div>
                            <div>
                              <p className="font-black text-secondary text-xl">{rev.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                                <Calendar className="w-4 h-4" /> {rev.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex text-amber-500">
                            {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} className="fill-current w-5 h-5" />)}
                          </div>
                        </div>
                        <div className="relative">
                          <Quote className="absolute -top-4 -right-4 w-12 h-12 text-primary opacity-10" />
                          <p className="text-lg text-muted-foreground leading-relaxed font-medium italic relative z-10 pr-6">"{rev.text}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="gallery" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-50 group cursor-pointer shadow-sm border border-border/20">
                        <Image src={`https://picsum.photos/seed/gall-${i}${id}/600/800`} alt="Portfolio" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                          <p className="text-white font-black text-sm mb-2">مشروع نجارة متكامل</p>
                          <div className="flex items-center gap-2 text-primary text-[10px] font-bold">
                            <Sparkles className="w-3 h-3" /> تم التنفيذ في 2024
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
