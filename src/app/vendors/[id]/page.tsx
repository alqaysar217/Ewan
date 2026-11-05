
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
  Award,
  Calendar,
  Sparkles,
  Quote,
  Layout,
  Hammer,
  Palette
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

  const vendor = {
    ...vendorData,
    id,
    business_name: vendorData?.business_name || 'اسم الشريك المعتمد',
    description: vendorData?.description || 'هذا الشريك يقدم خدمات ومنتجات عالية الجودة موثقة من قبل إيوان لضمان رضاكم.',
    city: vendorData?.city || 'اليمن',
    average_rating: vendorData?.average_rating || 5.0,
    reviewsCount: 154,
    service_areas: vendorData?.service_areas || ['صنعاء', 'عدن', 'تعز'],
    cover_url: vendorData?.cover_base64 || vendorData?.cover_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    logo_url: vendorData?.logo_base64 || vendorData?.logo_url || 'https://picsum.photos/seed/v1/200/200',
    stats: [
      { label: 'منتج متاح', value: '45+', icon: Package },
      { label: 'سنة خبرة', value: vendorData?.experience_years || '10+', icon: Clock },
      { label: 'تقييم عام', value: vendorData?.average_rating || '5.0', icon: Star },
    ]
  };

  const reviews = [
    { name: 'محمد القاضي', avatar: 'https://picsum.photos/seed/u1/100/100', text: 'شغل نظيف جداً ودقة في المواعيد. القطعة التي طلبتها كانت تحفة فنية حقيقية. شكراً للفريق على هذا المجهود الرائع.', rating: 5, date: 'منذ أسبوع' },
    { name: 'سارة باوزير', avatar: 'https://picsum.photos/seed/u2/100/100', text: 'جودة ممتازة والتعامل راقي جداً. أنصح بالتعامل معهم لأي شخص يبحث عن التميز والقطع التي تدوم طويلاً.', rating: 5, date: 'منذ أسبوعين' },
    { name: 'خالد الريمي', avatar: 'https://picsum.photos/seed/u3/100/100', text: 'احترافية عالية في تنفيذ المطابخ الخشبية. التفاصيل دقيقة جداً والخشب من أجود الأنواع الطبيعية.', rating: 4, date: 'منذ شهر' }
  ];

  if (vendorLoading) return <div className="h-screen flex items-center justify-center font-black text-2xl">جاري تحميل الملف الشخصي للشريك...</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col font-cairo" dir="rtl">
      <Header />

      <main className="flex-1">
        {/* Premium Profile Header */}
        <section className="relative h-[60vh] w-full">
          <Image 
            src={vendor.cover_url} 
            alt={vendor.business_name} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
          
          <div className="container mx-auto px-4 md:px-8 h-full relative z-10 flex flex-col justify-end pb-20">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-12 text-center md:text-right">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-white p-2 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden shrink-0 border-8 border-white/10 -mb-12 z-20">
                <Image src={vendor.logo_url} alt="Logo" fill className="object-cover" />
              </div>
              
              <div className="flex-1 space-y-6 text-white pb-6">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <h1 className="text-4xl md:text-7xl font-black tracking-tight drop-shadow-2xl">{vendor.business_name}</h1>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 animate-pulse"><CheckCircle2 className="w-7 h-7 text-white" /></div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-10 text-lg md:text-2xl font-bold text-gray-200">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-7 h-7 text-primary" />
                    {vendor.city}
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-7 h-7 text-amber-500 fill-current" />
                    {vendor.average_rating} <span className="opacity-60 text-sm">({vendor.reviewsCount} مراجعة حقيقية)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-5 pb-8">
                <Button className="rounded-[20px] bg-primary hover:bg-primary/90 text-white font-black px-14 h-20 shadow-[0_20px_40px_-10px_rgba(22,136,153,0.4)] gap-4 text-2xl group transition-all hover:-translate-y-1">
                  <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" /> محادثة فورية
                </Button>
                <Button variant="outline" size="icon" className="rounded-[20px] bg-white/10 border-white/20 text-white hover:bg-white/20 w-20 h-20 shadow-2xl">
                  <Share2 className="w-8 h-8" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 md:px-8 pt-32 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
            
            {/* Sidebar Details */}
            <div className="lg:col-span-1 space-y-12">
              <div className="bg-white p-12 border border-border/50 rounded-[45px] shadow-sm space-y-12 relative overflow-hidden">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-secondary flex items-center gap-3">
                    <Info className="w-7 h-7 text-primary" /> نبذة عن الشريك
                  </h3>
                  <p className="text-xl text-muted-foreground leading-loose font-medium">
                    {vendor.description}
                  </p>
                </div>

                <Separator className="bg-gray-100" />

                <div className="space-y-8">
                  <h3 className="text-2xl font-black text-secondary">إحصائيات الأداء</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {vendor.stats.map((stat, i) => (
                      <div key={i} className="flex items-center justify-between p-8 bg-gray-50 rounded-[30px] border border-transparent hover:border-primary/10 transition-all group">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                            <stat.icon className="w-7 h-7" />
                          </div>
                          <span className="text-lg font-bold text-muted-foreground">{stat.label}</span>
                        </div>
                        <span className="text-3xl font-black text-secondary">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-secondary">نطاق التغطية</h3>
                  <div className="flex flex-wrap gap-4">
                    {vendor.service_areas.map((area: string) => (
                      <Badge key={area} className="bg-primary/5 text-primary border border-primary/10 rounded-2xl px-6 py-3 font-black text-lg">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-12 bg-secondary text-white rounded-[45px] relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45 transition-transform group-hover:scale-110" />
                 <Award className="w-16 h-16 text-primary mb-10" />
                 <h4 className="text-3xl font-black mb-6">شريك إيوان الذهبي</h4>
                 <p className="text-gray-400 text-lg font-medium leading-relaxed">هذا الشريك يلتزم بأعلى معايير الحرفة اليمنية ويقدم ضمانات استبدال وصيانة حقيقية.</p>
              </div>
            </div>

            {/* Main Tabs Area */}
            <div className="lg:col-span-3 space-y-16">
              <Tabs defaultValue="products" className="w-full">
                <TabsList className="w-full justify-start h-24 bg-white border border-border/50 rounded-[2.5rem] p-3 gap-3 shadow-sm mb-16">
                  <TabsTrigger value="products" className="h-full rounded-[2rem] data-[state=active]:bg-primary data-[state=active]:text-white font-black text-2xl px-12 transition-all gap-3">
                    <Package className="w-6 h-6" /> المنتجات
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="h-full rounded-[2rem] data-[state=active]:bg-primary data-[state=active]:text-white font-black text-2xl px-12 transition-all gap-3">
                    <Quote className="w-6 h-6" /> آراء العملاء
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="h-full rounded-[2rem] data-[state=active]:bg-primary data-[state=active]:text-white font-black text-2xl px-12 transition-all gap-3">
                    <Sparkles className="w-6 h-6" /> معرض الأعمال
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="group bg-white border border-border/40 rounded-[3rem] overflow-hidden hover:shadow-2xl transition-all duration-700 flex flex-col h-full">
                        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                          <Image src={`https://picsum.photos/seed/v-prod-${i}-${id}/600/800`} alt="Product" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                            <Button className="w-full bg-white text-secondary font-black rounded-2xl h-16 text-xl shadow-2xl">طلب السعر النهائي</Button>
                          </div>
                        </div>
                        <div className="p-10 space-y-5">
                          <h4 className="text-2xl font-black text-secondary group-hover:text-primary transition-colors line-clamp-1">منتج إيوان المميز {i}</h4>
                          <div className="flex justify-between items-center">
                             <p className="text-3xl font-black text-primary">٤٥٠,٠٠٠ <span className="text-xs">ر.ي</span></p>
                             <div className="flex text-amber-500 items-center gap-1"><Star className="w-5 h-5 fill-current" /><span className="text-sm font-black text-secondary">5.0</span></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-12">
                  <div className="bg-primary/5 p-16 rounded-[50px] flex flex-col md:flex-row items-center justify-between gap-12 border border-primary/10 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-64 h-64 bg-white/40 blur-3xl -translate-x-1/2 -translate-y-1/2" />
                     <div className="text-center md:text-right relative z-10">
                       <h3 className="text-8xl font-black text-primary mb-3">{vendor.average_rating}</h3>
                       <div className="flex gap-3 justify-center md:justify-start text-amber-500 mb-4">
                         {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="fill-current w-10 h-10" />)}
                       </div>
                       <p className="text-muted-foreground font-black text-xl">بناءً على أكثر من {vendor.reviewsCount} تجربة موثقة</p>
                     </div>
                     <Button className="h-20 px-16 rounded-[25px] bg-secondary text-white font-black text-2xl shadow-2xl shadow-secondary/20 hover:-translate-y-2 transition-all relative z-10">شاركنا تجربتك الخاصة</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {reviews.map((rev, i) => (
                      <div key={i} className="p-12 bg-white border border-border/50 rounded-[3.5rem] space-y-10 shadow-sm hover:shadow-2xl transition-all relative group">
                        <Quote className="absolute top-10 left-10 w-16 h-16 text-primary/5 group-hover:text-primary/10 transition-colors" />
                        <div className="flex justify-between items-start relative z-10">
                          <div className="flex items-center gap-6">
                            <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-4 border-primary/10 shadow-2xl">
                              <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-black text-secondary text-2xl">{rev.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
                                <Calendar className="w-4 h-4" /> {rev.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex text-amber-500 gap-1">
                            {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} className="fill-current w-6 h-6" />)}
                          </div>
                        </div>
                        <p className="text-xl text-muted-foreground leading-loose font-medium italic relative z-10 pr-4 border-r-4 border-primary/20">"{rev.text}"</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="gallery" className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 group cursor-pointer shadow-xl border-4 border-white">
                        <Image src={`https://picsum.photos/seed/gall-v2-${i}${id}/600/800`} alt="Portfolio" fill className="object-cover group-hover:scale-125 transition-transform duration-[2000ms]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                          <p className="text-white font-black text-lg mb-2">مشروع إيوان المتكامل {i}</p>
                          <div className="flex items-center gap-3 text-primary text-xs font-bold bg-white/10 w-fit px-4 py-1.5 rounded-full backdrop-blur-md">
                            <Sparkles className="w-4 h-4" /> تم الإنجاز في 2024
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
