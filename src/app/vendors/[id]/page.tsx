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
  Award,
  Calendar,
  Sparkles,
  Quote,
  Layout,
  ShoppingBag,
  Loader2,
  Store,
  Images,
  Map,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { useDoc, useFirestore, useCollection } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';

type VendorDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function VendorDetailPage({ params }: VendorDetailPageProps) {
  const { id } = use(params);
  const db = useFirestore();
  
  const { data: vendorData, loading: vendorLoading } = useDoc(doc(db, 'vendors', id));
  const productsQuery = query(collection(db, 'products'), where('vendor_id', '==', id));
  const { data: vendorProducts, loading: productsLoading } = useCollection(productsQuery);

  const vendor = {
    ...vendorData,
    id,
    business_name: vendorData?.business_name || 'اسم الشريك المعتمد',
    description: vendorData?.description || 'هذا الشريك يقدم خدمات ومنتجات عالية الجودة موثقة من قبل إيوان لضمان رضاكم.',
    city: vendorData?.city || 'اليمن',
    average_rating: vendorData?.average_rating || 5.0,
    reviewsCount: (vendorData?.reviews?.length || 0),
    cover_url: vendorData?.cover_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    logo_url: vendorData?.logo_url || 'https://picsum.photos/seed/v1/200/200',
    gallery: vendorData?.gallery || [],
    stats: [
      { label: 'منتج متاح', value: (vendorProducts?.length || 0).toLocaleString('en-US'), icon: Package },
      { label: 'سنة خبرة', value: (vendorData?.experience_years || 1).toLocaleString('en-US'), icon: Clock },
      { label: 'تقييم عام', value: (vendorData?.average_rating || 5.0).toLocaleString('en-US'), icon: Star },
    ]
  };

  if (vendorLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4 font-cairo" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="font-black text-xl text-secondary">جاري جلب ملف الشريك الفاخر...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col font-cairo" dir="rtl">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">
          <Image 
            src={vendor.cover_url} 
            alt={vendor.business_name} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
          
          <div className="container mx-auto px-4 md:px-8 h-full relative z-10 flex flex-col justify-end pb-12 md:pb-16">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 text-center md:text-right">
              <div className="w-32 h-32 md:w-52 md:h-52 bg-white p-1.5 rounded-2xl shadow-2xl relative overflow-hidden shrink-0 border-4 border-white/20 -mb-6 md:-mb-10 z-20">
                <Image src={vendor.logo_url} alt="Logo" fill className="object-cover" />
              </div>
              
              <div className="flex-1 space-y-3 md:space-y-4 text-white pb-2 md:pb-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-2xl md:text-5xl font-black tracking-tight drop-shadow-lg">{vendor.business_name}</h1>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 text-sm md:text-xl font-bold text-gray-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    {vendor.city}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-500 fill-current" />
                    {vendor.average_rating.toLocaleString('en-US')} <span className="opacity-60 text-xs md:text-sm">({vendor.reviewsCount.toLocaleString('en-US')} تقييم)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 md:gap-3 pb-2 md:pb-4">
                <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-black px-6 md:px-8 h-12 md:h-16 shadow-xl gap-2 md:gap-3 text-sm md:text-lg transition-all hover:-translate-y-1">
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6" /> تواصل مباشر
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 w-12 h-12 md:w-16 md:h-16">
                  <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-24">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="w-full flex flex-row-reverse justify-start items-center h-16 bg-white border border-border/50 rounded-xl p-2 gap-2 shadow-sm mb-12 overflow-x-auto no-scrollbar">
              <TabsTrigger value="products" className="h-full rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-black text-sm md:text-lg px-6 md:px-10 transition-all gap-2 shrink-0">
                <Package className="w-4 h-4 md:w-5 md:h-5" /> منتجات المتجر
              </TabsTrigger>
              <TabsTrigger value="gallery" className="h-full rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-black text-sm md:text-lg px-6 md:px-10 transition-all gap-2 shrink-0">
                <Images className="w-4 h-4 md:w-5 md:h-5" /> معرض الأعمال
              </TabsTrigger>
              <TabsTrigger value="reviews" className="h-full rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-black text-sm md:text-lg px-6 md:px-10 transition-all gap-2 shrink-0">
                <Quote className="w-4 h-4 md:w-5 md:h-5" /> آراء العملاء
              </TabsTrigger>
              <TabsTrigger value="about" className="h-full rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-black text-sm md:text-lg px-6 md:px-10 transition-all gap-2 shrink-0">
                <Info className="w-4 h-4 md:w-5 md:h-5" /> حول المتجر
              </TabsTrigger>
            </TabsList>

            {/* منتجات المتجر */}
            <TabsContent value="products" className="animate-in fade-in duration-700">
              {productsLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="font-bold text-muted-foreground">جاري عرض منتجات المتجر...</p>
                </div>
              ) : vendorProducts?.length === 0 ? (
                <div className="py-24 text-center space-y-4 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                   <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto" />
                   <p className="text-lg font-black text-muted-foreground">لا توجد منتجات معروضة حالياً لهذا الشريك.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {vendorProducts?.map((p: any) => (
                    <div key={p.id} className="bg-white rounded-[20px] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group border border-border/40">
                      <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <Image 
                          src={p.image_base64 || `https://picsum.photos/seed/${p.id}/600/800`} 
                          alt={p.name_ar} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent backdrop-blur-[2px] opacity-60" />
                        
                        <Link href={`/product/${p.id}`} className="absolute inset-0 z-10" />
                        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                          {Number(p.discount) > 0 && (
                            <Badge className="bg-secondary text-white font-black rounded-lg px-2 py-1 shadow-sm border-none text-[10px]">
                              %{p.discount.toLocaleString('en-US')} خصم
                            </Badge>
                          )}
                          <Badge className={cn("font-black px-2 py-1 rounded-md border-none shadow-sm text-[9px]", p.in_stock ? "bg-emerald-500 text-white" : "bg-destructive text-white")}>
                             {p.in_stock ? 'متوفر' : 'غير متوفر'}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1 gap-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-base font-black text-secondary flex-1 leading-tight line-clamp-1">{p.name_ar}</h4>
                          <div className="flex items-center gap-1 text-amber-500 shrink-0 mr-2">
                            <span className="text-xs font-black">{(p.rating || 5.0).toLocaleString('en-US')}</span>
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Store className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-bold">{vendor.business_name}</span>
                          </div>
                          <div className="w-fit">
                            <Badge variant="outline" className="text-[9px] font-bold text-primary border-primary/20 bg-primary/5 px-2 py-0.5 rounded-full uppercase">
                              {p.category_id}
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-auto pt-2 space-y-4">
                           <div className="flex items-center gap-2">
                              <span className="text-lg font-black text-secondary">{(Number(p.price) || 0).toLocaleString('en-US')} <span className="text-[10px] font-bold">ريال يمني</span></span>
                              {Number(p.old_price) > 0 && <span className="text-xs text-muted-foreground line-through font-bold opacity-50">{(Number(p.old_price)).toLocaleString('en-US')}</span>}
                           </div>
                           <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-black gap-2 h-11 rounded-xl transition-all shadow-sm">
                              <ShoppingBag className="w-4 h-4" /> إضافة للسلة
                           </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* معرض الأعمال */}
            <TabsContent value="gallery" className="animate-in fade-in duration-700">
               {vendor.gallery.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {vendor.gallery.map((img: string, i: number) => (
                      <div key={i} className="group relative aspect-[4/5] rounded-[20px] overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all cursor-pointer">
                        <Image src={img} alt={`Work ${i}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"><Sparkles className="w-6 h-6" /></div>
                        </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="py-32 text-center space-y-4 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                    <Images className="w-16 h-16 text-gray-200 mx-auto" />
                    <p className="text-lg font-black text-muted-foreground">لا يوجد معرض أعمال مضاف لهذا الشريك حتى الآن.</p>
                 </div>
               )}
            </TabsContent>

            {/* آراء العملاء */}
            <TabsContent value="reviews" className="animate-in fade-in duration-700 space-y-10">
               <div className="bg-primary/5 p-10 md:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-primary/10">
                 <div className="text-center md:text-right">
                   <h3 className="text-6xl md:text-7xl font-black text-primary mb-2">{vendor.average_rating.toLocaleString('en-US')}</h3>
                   <div className="flex gap-2 justify-center md:justify-start text-amber-500 mb-2">
                     {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn("w-8 h-8", i < Math.floor(vendor.average_rating) ? "fill-current" : "fill-none")} />)}
                   </div>
                   <p className="text-muted-foreground font-black text-lg">بناءً على {vendor.reviewsCount.toLocaleString('en-US')} تجربة عملاء موثقة</p>
                 </div>
                 <Button className="w-full md:w-auto h-16 px-12 rounded-xl bg-secondary text-white font-black text-xl shadow-2xl">أضف تقييمك الآن</Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {(vendorData?.reviews || []).length > 0 ? (
                   vendorData.reviews.map((rev: any, i: number) => (
                    <div key={i} className="p-8 bg-white border border-border/50 rounded-2xl space-y-6 shadow-sm hover:shadow-lg transition-all relative">
                      <Quote className="absolute top-6 left-6 w-10 h-10 text-primary/5" />
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center font-black text-secondary text-xl border-2 border-primary/10">
                            {rev.name?.[0] || 'ع'}
                          </div>
                          <div className="space-y-1">
                            <p className="font-black text-secondary text-lg">{rev.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                              <Calendar className="w-3.5 h-3.5" /> {rev.date || 'الآن'}
                            </div>
                          </div>
                        </div>
                        <div className="flex text-amber-500 gap-1">
                          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn("w-4 h-4", i < (rev.rating || 5) ? "fill-current" : "fill-none")} />)}
                        </div>
                      </div>
                      <p className="text-base text-muted-foreground leading-relaxed font-medium italic pr-4 border-r-2 border-primary/20">"{rev.text}"</p>
                    </div>
                   ))
                 ) : (
                   <div className="col-span-full py-24 text-center space-y-4 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                     <Quote className="w-16 h-16 text-gray-200 mx-auto" />
                     <p className="text-lg font-black text-muted-foreground">لا توجد مراجعات مكتوبة بعد. كن أول من يكتب رأيه!</p>
                   </div>
                 )}
               </div>
            </TabsContent>

            {/* حول المتجر */}
            <TabsContent value="about" className="animate-in fade-in duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* النبذة والإحصائيات */}
                <div className="lg:col-span-2 space-y-10">
                  <div className="bg-white p-10 rounded-2xl border border-border/50 shadow-sm space-y-6">
                    <h3 className="text-2xl font-black text-secondary flex items-center gap-3">
                       <Info className="w-6 h-6 text-primary" /> نبذة عن الشريك
                    </h3>
                    <p className="text-xl leading-relaxed text-muted-foreground font-medium text-justify">
                      {vendor.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                      {vendor.stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-primary/5 transition-all text-center">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <stat.icon className="w-7 h-7" />
                          </div>
                          <span className="text-3xl font-black text-secondary mb-1">{stat.value}</span>
                          <span className="text-sm font-bold text-muted-foreground">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* مناطق الخدمة */}
                  {vendor.service_areas && vendor.service_areas.length > 0 && (
                    <div className="bg-white p-10 rounded-2xl border border-border/50 shadow-sm space-y-6">
                      <h3 className="text-2xl font-black text-secondary flex items-center gap-3">
                         <Map className="w-6 h-6 text-primary" /> نطاق التغطية والخدمة
                      </h3>
                      <p className="text-muted-foreground font-medium">يقدم هذا الشريك خدماته اللوجستية وتوصيل المنتجات للمناطق التالية:</p>
                      <div className="flex flex-wrap gap-4 pt-2">
                        {vendor.service_areas.map((area: string) => (
                          <div key={area} className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-xl px-6 py-3 transition-all hover:bg-primary hover:text-white group">
                            <MapPin className="w-4 h-4 text-primary group-hover:text-white" />
                            <span className="font-black text-lg">{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* معلومات جانبية إضافية */}
                <div className="space-y-10">
                   <div className="bg-secondary text-white p-10 rounded-2xl space-y-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rotate-45 -translate-y-16 translate-x-16 transition-transform group-hover:scale-125" />
                      <div className="relative z-10 space-y-4">
                        <Award className="w-12 h-12 text-primary" />
                        <h4 className="text-2xl font-black">ضمان إيوان المعتمد</h4>
                        <p className="text-gray-300 font-medium leading-relaxed">
                          هذا الشريك يخضع لرقابة دورية من قبل منصة إيوان لضمان جودة التصنيع والالتزام بمواعيد التوصيل والتركيب.
                        </p>
                      </div>
                      <Separator className="bg-white/10" />
                      <div className="flex items-center gap-4 text-primary">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <span className="font-black text-lg">شريك استراتيجي معتمد</span>
                      </div>
                   </div>

                   <div className="bg-white p-8 rounded-2xl border border-border/50 shadow-sm space-y-6">
                      <h4 className="font-black text-secondary text-lg border-b pb-4">هل لديك استفسار خاص؟</h4>
                      <div className="space-y-4">
                         <Button className="w-full h-14 rounded-xl bg-gray-50 text-secondary border-none hover:bg-gray-100 font-black gap-3">
                            <Info className="w-5 h-5 text-primary" /> طلب مواصفات مخصصة
                         </Button>
                         <Button variant="outline" className="w-full h-14 rounded-xl border-primary text-primary font-black gap-3">
                            <Calendar className="w-5 h-5" /> حجز موعد زيارة للموقع
                         </Button>
                      </div>
                   </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
}
