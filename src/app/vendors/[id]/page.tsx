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
  Store
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
    description: 'متخصصون في صناعة غرف النوم والدواوين الخشبية الفاخرة بجودة يمنية أصيلة وأخشاب زان طبيعية مستوردة. خبرة أكثر من 20 عاماً في السوق اليمني.',
    city: 'صنعاء، التحرير',
    average_rating: 4.9,
    reviewsCount: 342,
    service_areas: ['صنعاء', 'عدن', 'تعز', 'المكلا'],
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

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />

      <main className="flex-1">
        {/* Profile Header */}
        <section className="relative h-[40vh] w-full">
          <Image 
            src={vendor.cover_url} 
            alt={vendor.business_name} 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="container mx-auto px-4 md:px-8 h-full relative z-10 flex flex-col justify-end pb-12">
            <div className="flex flex-col md:flex-row items-end gap-8">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white p-1 rounded-[15px] shadow-2xl relative overflow-hidden shrink-0 border-4 border-white/20">
                <Image src={vendor.logo_url} alt="Logo" fill className="object-cover" />
              </div>
              
              <div className="flex-1 space-y-4 text-white text-center md:text-right">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl md:text-5xl font-black">{vendor.business_name}</h1>
                  <CheckCircle2 className="w-6 h-6 text-primary fill-white" />
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20 font-bold backdrop-blur-md">
                    {vendor.business_type === 'carpenter' ? 'ورشة نجارة معتمدة' : 'معرض أثاث'}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm md:text-base font-bold text-gray-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {vendor.city}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-current" />
                    {vendor.average_rating.toLocaleString('en-US')} ({vendor.reviewsCount.toLocaleString('en-US')} مراجعة)
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="rounded-[15px] bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 shadow-xl shadow-primary/20 gap-2">
                  <MessageSquare className="w-5 h-5" /> محادثة فورية
                </Button>
                <Button variant="outline" size="icon" className="rounded-[15px] bg-white/10 border-white/20 text-white hover:bg-white/20 w-12 h-12">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar Info (Right Side) */}
            <div className="lg:col-span-1 space-y-8 order-1">
              <div className="bg-white p-8 border border-border/50 rounded-[15px] shadow-sm space-y-8">
                <div className="space-y-4">
                  <h3 className="font-black text-secondary flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" /> نبذة عن المتجر
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {vendor.description}
                  </p>
                </div>

                <Separator />

                <div className="space-y-6">
                  <h3 className="font-black text-secondary">إحصائيات سريعة</h3>
                  <div className="space-y-4">
                    {vendor.stats.map((stat, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-[10px]">
                        <div className="flex items-center gap-3">
                          <stat.icon className="w-5 h-5 text-primary" />
                          <span className="text-xs font-bold text-muted-foreground">{stat.label}</span>
                        </div>
                        <span className="font-black text-secondary">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-black text-secondary">مناطق الخدمة</h3>
                  <div className="flex flex-wrap gap-2">
                    {vendor.service_areas.map((area) => (
                      <Badge key={area} variant="secondary" className="bg-primary/5 text-primary border-none rounded-md px-3">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Areas (Left Side) */}
            <div className="lg:col-span-3 space-y-12 order-2">
              <Tabs defaultValue="products" className="w-full" dir="rtl">
                <TabsList className="w-full justify-start h-14 bg-transparent border-b rounded-none p-0 gap-8 overflow-x-auto no-scrollbar">
                  <TabsTrigger value="products" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-black text-lg px-6">منتجات المتجر</TabsTrigger>
                  <TabsTrigger value="reviews" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-black text-lg px-6">تقييمات العملاء</TabsTrigger>
                  <TabsTrigger value="gallery" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-black text-lg px-6">معرض الأعمال</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="py-10 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockProducts.map((product) => (
                      <div key={product.id} className="group bg-white border border-border/50 rounded-[15px] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                        <div className="relative aspect-square overflow-hidden bg-gray-50">
                          <Image src={product.img} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                          <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button className="bg-white text-secondary font-bold rounded-md shadow-xl px-6">تفاصيل القطعة</Button>
                            </div>
                          </Link>
                        </div>
                        <div className="p-4 space-y-3 flex-1 flex flex-col">
                          {/* Row 1: Name & Rating */}
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-base font-black text-secondary group-hover:text-primary transition-colors truncate">{product.name}</h4>
                            <div className="flex items-center gap-1 text-amber-500 shrink-0">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs font-black">{product.rating.toLocaleString('en-US')}</span>
                            </div>
                          </div>

                          {/* Row 2: Store */}
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Store className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold">{product.store}</span>
                          </div>

                          {/* Row 3: Category */}
                          <div className="flex">
                            <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/20 bg-primary/5 px-2 py-0">
                              {product.category}
                            </Badge>
                          </div>

                          {/* Row 4: Price & Action */}
                          <div className="mt-auto pt-2">
                            <p className="text-lg font-black text-secondary">{product.price.toLocaleString('en-US')} <span className="text-xs font-bold">ريال يمني</span></p>
                            <Button className="w-full mt-4 bg-secondary hover:bg-primary text-white font-bold gap-2 rounded-xl h-10 transition-all">
                              <ShoppingBag className="w-4 h-4" /> إضافة للسلة
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="py-10 animate-in fade-in duration-500">
                  <div className="space-y-8">
                    {[
                      { user: 'صالح اليافعي', date: 'منذ شهر', rating: 5, comment: 'شغل نظيف جداً ودقة في المواعيد. الطقم الحضرمي الذي طلبته كان تحفة فنية حقيقية.' },
                      { user: 'أروى باوزير', date: 'منذ شهرين', rating: 4, comment: 'جودة الخشب ممتازة والتعامل راقي جداً. أنصح بالتعامل معهم لأي شخص يبحث عن التميز.' }
                    ].map((rev, i) => (
                      <div key={i} className="p-8 bg-gray-50 rounded-[15px] space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center font-black text-primary border">{rev.user[0]}</div>
                            <div>
                              <p className="font-black text-secondary">{rev.user}</p>
                              <p className="text-xs text-muted-foreground font-bold">{rev.date}</p>
                            </div>
                          </div>
                          <div className="flex text-amber-500">
                            {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} className="fill-current w-4 h-4" />)}
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed font-medium italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="gallery" className="py-10 animate-in fade-in duration-500">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="relative aspect-square rounded-[15px] overflow-hidden bg-gray-100 group cursor-pointer">
                        <Image src={`https://picsum.photos/seed/gallery-${i}/400/400`} alt="Gallery" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Badge className="bg-white text-secondary font-bold">عرض العمل</Badge>
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
