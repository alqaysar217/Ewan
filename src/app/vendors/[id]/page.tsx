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
  Loader2
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
    reviewsCount: (vendorData?.reviews?.length || 0) + 120,
    cover_url: vendorData?.cover_url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    logo_url: vendorData?.logo_url || 'https://picsum.photos/seed/v1/200/200',
    stats: [
      { label: 'منتج متاح', value: (vendorProducts?.length || vendorData?.available_products || 0).toLocaleString('en-US'), icon: Package },
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
        <section className="relative h-[55vh] w-full overflow-hidden">
          <Image 
            src={vendor.cover_url} 
            alt={vendor.business_name} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
          
          <div className="container mx-auto px-4 md:px-8 h-full relative z-10 flex flex-col justify-end pb-16">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-right">
              <div className="w-40 h-40 md:w-56 md:h-56 bg-white p-1.5 rounded-2xl shadow-2xl relative overflow-hidden shrink-0 border-4 border-white/20 -mb-8 z-20">
                <Image src={vendor.logo_url} alt="Logo" fill className="object-cover" />
              </div>
              
              <div className="flex-1 space-y-4 text-white pb-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-lg">{vendor.business_name}</h1>
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20"><CheckCircle2 className="w-6 h-6 text-white" /></div>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-base md:text-xl font-bold text-gray-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {vendor.city}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-current" />
                    {vendor.average_rating.toLocaleString('en-US')} <span className="opacity-60 text-sm">({vendor.reviewsCount.toLocaleString('en-US')} تقييم)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pb-4">
                <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-black px-8 h-16 shadow-xl gap-3 text-lg group transition-all hover:-translate-y-1">
                  <MessageSquare className="w-6 h-6" /> تواصل مباشر
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 w-16 h-16">
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 md:px-8 pt-20 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            <div className="lg:col-span-1 space-y-10">
              <div className="bg-white p-10 border border-border/50 rounded-2xl shadow-sm space-y-10">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-secondary flex items-center gap-2">
                    <Info className="w-6 h-6 text-primary" /> عن الشريك
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    {vendor.description}
                  </p>
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="text-xl font-black text-secondary">إحصائيات الموثوقية</h3>
                  <div className="space-y-4">
                    {vendor.stats.map((stat, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl group transition-all hover:bg-primary/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                            <stat.icon className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold text-muted-foreground">{stat.label}</span>
                        </div>
                        <span className="text-xl font-black text-secondary">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {vendor.service_areas && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-xl font-black text-secondary">مناطق الخدمة</h3>
                      <div className="flex flex-wrap gap-2">
                        {vendor.service_areas.map((area: string) => (
                          <Badge key={area} variant="outline" className="bg-primary/5 text-primary border-primary/10 rounded-lg px-4 py-1.5 font-bold">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-12">
              <Tabs defaultValue="products" className="w-full">
                <TabsList className="w-full justify-start h-16 bg-white border border-border/50 rounded-xl p-2 gap-2 shadow-sm mb-10">
                  <TabsTrigger value="products" className="h-full rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-black text-lg px-10 transition-all gap-2">
                    <Package className="w-5 h-5" /> المنتجات
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="h-full rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-black text-lg px-10 transition-all gap-2">
                    <Quote className="w-5 h-5" /> الآراء
                  </TabsTrigger>
                </TabsList>

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {vendorProducts?.map((p: any) => (
                        <div key={p.id} className="bg-white rounded-[20px] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group border border-border/40">
                          <div className="relative aspect-square overflow-hidden bg-gray-50">
                            <Image 
                              src={p.image_base64 || `https://picsum.photos/seed/${p.id}/600/800`} 
                              alt={p.name_ar} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                            {/* Blurry layer at bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-[2px] opacity-40" />
                            
                            <Link href={`/product/${p.id}`} className="absolute inset-0 z-10" />
                            {Number(p.discount) > 0 && (
                              <div className="absolute top-3 right-3 z-20">
                                <Badge className="bg-secondary text-white font-black rounded-lg px-2 py-1 shadow-sm border-none text-[10px]">
                                  %{p.discount.toLocaleString('en-US')} خصم
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="p-4 flex flex-col flex-1 gap-3">
                            <div className="flex justify-between items-start">
                              <h4 className="text-base font-black text-secondary flex-1 leading-tight">{p.name_ar}</h4>
                              <div className="flex items-center gap-1 text-amber-500 shrink-0 mr-2">
                                <span className="text-xs font-black">{(p.rating || 5.0).toLocaleString('en-US')}</span>
                                <Star className="w-3 h-3 fill-current" />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Store className="w-4 h-4 text-primary" />
                                <span className="text-xs font-bold">{vendor.business_name}</span>
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

                <TabsContent value="reviews" className="animate-in fade-in duration-700 space-y-10">
                   <div className="bg-primary/5 p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-primary/10">
                     <div className="text-center md:text-right">
                       <h3 className="text-7xl font-black text-primary mb-2">{vendor.average_rating.toLocaleString('en-US')}</h3>
                       <div className="flex gap-2 justify-center md:justify-start text-amber-500 mb-2">
                         {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="fill-current w-8 h-8" />)}
                       </div>
                       <p className="text-muted-foreground font-black text-lg">بناءً على تجارب العملاء الموثقة</p>
                     </div>
                     <Button className="h-16 px-12 rounded-xl bg-secondary text-white font-black text-xl shadow-2xl">أضف تقييمك الآن</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {(vendorData?.reviews || [
                      { name: 'محمد القاضي', text: 'شغل نظيف جداً ودقة في المواعيد. القطعة التي طلبتها كانت تحفة فنية حقيقية.', rating: 5, date: 'منذ أسبوع' },
                      { name: 'سارة باوزير', text: 'جودة ممتازة والتعامل راقي جداً. أنصح بالتعامل معهم للتميز.', rating: 5, date: 'منذ أسبوعين' }
                    ]).map((rev: any, i: number) => (
                      <div key={i} className="p-8 bg-white border border-border/50 rounded-2xl space-y-6 shadow-sm hover:shadow-lg transition-all relative">
                        <Quote className="absolute top-6 left-6 w-10 h-10 text-primary/5" />
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center font-black text-secondary text-xl border-2 border-primary/10">
                              {rev.name[0]}
                            </div>
                            <div className="space-y-1">
                              <p className="font-black text-secondary text-lg">{rev.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                                <Calendar className="w-3.5 h-3.5" /> {rev.date || 'الآن'}
                              </div>
                            </div>
                          </div>
                          <div className="flex text-amber-500 gap-1">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => <Star key={i} className="fill-current w-4 h-4" />)}
                          </div>
                        </div>
                        <p className="text-base text-muted-foreground leading-relaxed font-medium italic pr-4 border-r-2 border-primary/20">"{rev.text}"</p>
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
