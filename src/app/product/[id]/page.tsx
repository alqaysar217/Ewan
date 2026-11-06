'use client';

import { useState, use, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronRight, 
  Star, 
  Heart, 
  ShoppingBag, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Info, 
  Truck, 
  Hammer, 
  Zap,
  MessageSquare,
  MapPin,
  Loader2,
  Calendar,
  Quote,
  Layout
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

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const db = useFirestore();

  // تثبيت مرجع المنتج
  const productRef = useMemo(() => doc(db, 'products', id), [db, id]);
  const { data: productData, loading: productLoading } = useDoc(productRef);
  
  // استخراج معرف المتجر بشكل آمن
  const vendorId = productData?.vendor_id;
  
  // تثبيت مرجع المتجر وجلب بياناته
  const vendorRef = useMemo(() => vendorId ? doc(db, 'vendors', vendorId) : null, [db, vendorId]);
  const { data: vendorData, loading: vendorLoading } = useDoc(vendorRef);

  if (productLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4 font-cairo" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="font-black text-xl text-secondary">جاري تحميل تفاصيل القطعة...</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-6 font-cairo" dir="rtl">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
          <Info className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-secondary">عذراً، المنتج غير موجود</h2>
        <Link href="/shop"><Button className="rounded-xl px-8">العودة للمتجر</Button></Link>
      </div>
    );
  }

  const product = {
    ...productData,
    name: productData.name_ar || 'منتج بدون اسم',
    category: productData.category_id || 'عام',
    price: Number(productData.price) || 0,
    oldPrice: Number(productData.old_price) || 0,
    discount: Number(productData.discount) || 0,
    rating: Number(productData.rating) || 5.0,
    reviewsCount: (productData.reviews?.length || 0),
    description: productData.description_ar || productData.technical_specs || 'لا يوجد وصف متاح لهذا المنتج حالياً.',
    images: [productData.image_base64, ...(productData.gallery || [])].filter(Boolean),
    specs: [
      { label: 'الخامة الرئيسية', value: productData.material || 'خشب طبيعي' },
      { label: 'الأبعاد', value: productData.dimensions || 'حسب الطلب' },
      { label: 'نوع القماش', value: productData.fabric || 'فاخر' },
      { label: 'الضمان', value: productData.warranty || 'ضمان معتمد' }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-cairo" dir="rtl">
      <Header />
      
      <nav className="bg-white border-b py-3">
        <div className="container mx-auto px-4 md:px-8 flex items-center gap-2 text-xs font-bold text-muted-foreground overflow-x-auto whitespace-nowrap no-scrollbar">
          <Link href="/" className="hover:text-primary">الرئيسية</Link>
          <ChevronRight className="w-4 h-4 rotate-180 shrink-0" />
          <Link href="/shop" className="hover:text-primary">المتجر</Link>
          <ChevronRight className="w-4 h-4 rotate-180 shrink-0" />
          <span className="text-secondary truncate">{product.name}</span>
        </div>
      </nav>

      <main className="container mx-auto py-8 md:py-16 px-4 md:px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[15px] overflow-hidden border border-border/50 shadow-sm bg-gray-50 group">
              <Image 
                src={product.images[0] || `https://picsum.photos/seed/${id}/800/800`} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {product.discount > 0 && (
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-secondary text-white font-black text-lg px-4 py-1.5 shadow-2xl border-none">
                    %{product.discount.toLocaleString('en-US')} خصم
                  </Badge>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img: string, i: number) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer transition-all bg-gray-50 shadow-sm">
                    <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="space-y-4 text-right">
              <div className="flex flex-wrap items-center justify-start gap-3">
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 font-black uppercase px-3 py-1">
                  {product.category}
                </Badge>
                {product.in_stock !== false && (
                  <span className="flex items-center gap-1.5 text-xs font-black text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" /> متوفر في المخزون
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-secondary leading-tight">{product.name}</h1>
              
              <div className="flex flex-wrap items-center justify-start gap-6">
                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-lg">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-secondary font-black text-lg">{product.rating.toLocaleString('en-US')}</span>
                </div>
                <span className="text-sm font-bold text-muted-foreground">({product.reviewsCount.toLocaleString('en-US')} مراجعة موثقة)</span>
                <Separator orientation="vertical" className="hidden md:block h-6" />
                <Button variant="ghost" className="text-primary font-black gap-2 p-0 h-auto hover:bg-transparent">
                  <Share2 className="w-5 h-5" /> مشاركة القطعة
                </Button>
              </div>
            </div>

            <div className="p-8 md:p-10 bg-gray-50 rounded-2xl space-y-6 border border-gray-100 shadow-inner text-right">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-4 justify-start">
                  <span className="text-4xl md:text-5xl font-black text-secondary">{product.price.toLocaleString('en-US')} <span className="text-sm md:text-xl font-bold">ريال يمني</span></span>
                  {product.oldPrice > 0 && (
                    <span className="text-xl md:text-2xl text-muted-foreground line-through font-bold opacity-50">{product.oldPrice.toLocaleString('en-US')} ريال</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-bold flex items-center gap-2 justify-start">
                  <Info className="w-4 h-4" /> شامل كافة الرسوم والضرائب المحلية
                </p>
              </div>
              
              <Separator />

              <div className="space-y-4 pt-2">
                <label className="text-sm font-black text-secondary block">تحديد الكمية</label>
                <div className="flex items-center gap-6 bg-white border border-gray-200 rounded-xl p-2 w-fit shadow-sm">
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg hover:bg-gray-50" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                  <span className="w-10 text-center font-black text-xl">{quantity.toLocaleString('en-US')}</span>
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg hover:bg-gray-50" onClick={() => setQuantity(quantity + 1)}>+</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <Button className="h-16 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-2xl shadow-primary/30 gap-3">
                  <ShoppingBag className="w-6 h-6" /> إضافة للسلة
                </Button>
                <Button variant="secondary" className="h-16 rounded-xl bg-secondary text-white font-black text-xl shadow-2xl shadow-secondary/30 gap-3">
                  <Zap className="w-6 h-6 fill-current" /> شراء فوري
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Truck, title: 'توصيل وتركيب', desc: 'متاح لمدينتك' },
                { icon: ShieldCheck, title: 'ضمان الجودة', desc: '5 سنوات حقيقية' },
                { icon: Hammer, title: 'صنع في اليمن', desc: 'حرفية وطنية' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-white border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <item.icon className="w-8 h-8 text-primary shrink-0" />
                  <div className="space-y-0.5 text-right">
                    <p className="text-sm font-black text-secondary">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground font-bold">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-32">
          <Tabs defaultValue="specs" className="w-full" dir="rtl">
            <TabsList className="w-full flex justify-start items-center h-16 bg-white border-b border-gray-100 rounded-none p-0 gap-10">
              <TabsTrigger value="specs" className="h-full rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-black text-lg px-8">المواصفات الفنية</TabsTrigger>
              <TabsTrigger value="reviews" className="h-full rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-black text-lg px-8">آراء العملاء</TabsTrigger>
              <TabsTrigger value="store" className="h-full rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-black text-lg px-8">عن المتجر</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specs" className="py-12 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                <div className="space-y-6 text-right">
                  <h3 className="text-2xl font-black text-secondary flex items-center gap-3">
                    <Info className="w-6 h-6 text-primary" /> وصف المنتج
                  </h3>
                  <p className="text-muted-foreground leading-loose font-medium text-lg text-justify">{product.description}</p>
                </div>
                <div className="space-y-6 text-right">
                  <h3 className="text-2xl font-black text-secondary flex items-center gap-3">
                    <Layout className="w-6 h-6 text-primary" /> تفاصيل القطعة
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="flex justify-between items-center p-5 bg-gray-50 rounded-xl border border-gray-100 group hover:bg-primary/5 transition-colors">
                        <span className="text-base font-bold text-muted-foreground">{spec.label}</span>
                        <span className="text-base font-black text-secondary">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="py-12 animate-in fade-in duration-700">
               <div className="space-y-12">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-10 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="text-right space-y-2">
                      <h3 className="text-6xl font-black text-primary">{product.rating.toLocaleString('en-US')}</h3>
                      <div className="flex gap-1.5 justify-start text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("w-6 h-6 fill-current", i >= Math.floor(product.rating) ? "fill-none text-gray-200" : "")} />
                        ))}
                      </div>
                      <p className="text-sm font-black text-muted-foreground">بناءً على {product.reviewsCount.toLocaleString('en-US')} مراجعة حقيقية</p>
                    </div>
                    <Button className="w-full md:w-auto rounded-xl font-black px-10 h-14 bg-secondary text-white shadow-xl">شاركنا رأيك بالمنتج</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {(productData.reviews || []).length > 0 ? (
                      productData.reviews.map((rev: any, i: number) => (
                        <div key={i} className="p-8 bg-white border border-gray-100 rounded-2xl space-y-6 shadow-sm relative group text-right">
                          <Quote className="absolute top-6 left-6 w-10 h-10 text-primary/5" />
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center font-black text-secondary text-xl border shadow-inner">
                                {rev.name?.[0]}
                              </div>
                              <div className="space-y-1 text-right">
                                <p className="font-black text-secondary text-lg">{rev.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                                  <Calendar className="w-4 h-4" /> {rev.date || 'منذ فترة'}
                                </div>
                              </div>
                            </div>
                            <div className="flex text-amber-500 gap-1">
                              {Array.from({ length: 5 }).map((_, starIdx) => (
                                <Star key={starIdx} className={cn("w-4 h-4 fill-current", starIdx >= rev.rating ? "fill-none text-gray-200" : "")} />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed font-medium italic border-r-2 border-primary/20 pr-4">{rev.text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-20 text-center space-y-4 bg-gray-50 rounded-2xl border-2 border-dashed">
                        <MessageSquare className="w-16 h-16 text-gray-200 mx-auto" />
                        <p className="text-xl font-black text-muted-foreground">لا توجد مراجعات لهذه القطعة بعد. كن أول من يقيّمها!</p>
                      </div>
                    )}
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="store" className="py-12 animate-in fade-in duration-700">
              {vendorLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
              ) : vendorData ? (
                <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start text-right">
                  <div className="relative w-40 h-40 md:w-56 md:h-56 bg-white p-2 rounded-2xl shadow-2xl shrink-0 border-4 border-white/50 overflow-hidden">
                    <Image src={vendorData.logo_url || `https://picsum.photos/seed/${vendorData.id}/400/400`} alt={vendorData.business_name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-6 text-right">
                     <div className="space-y-2">
                        <div className="flex items-center justify-start gap-3">
                          <h3 className="text-3xl md:text-4xl font-black text-secondary">{vendorData.business_name}</h3>
                          <CheckCircle2 className="w-6 h-6 text-primary fill-white" />
                        </div>
                        <p className="text-lg text-muted-foreground font-bold flex items-center justify-start gap-2">
                          <MapPin className="w-5 h-5 text-primary" /> {vendorData.city}
                        </p>
                     </div>
                     <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-medium text-justify">{vendorData.description || 'شريك معتمد في منصة إيوان للأثاث الفاخر.'}</p>
                     <div className="flex flex-wrap justify-start gap-4 pt-6">
                       <Link href={`/vendors/${vendorData.id}`}>
                        <Button variant="outline" className="rounded-xl font-black px-10 h-14 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all text-lg">زيارة معرض المتجر</Button>
                       </Link>
                       <Button variant="ghost" className="rounded-xl font-black px-10 h-14 text-primary gap-3 text-lg hover:bg-primary/5">
                        <MessageSquare className="w-6 h-6" /> محادثة التاجر الآن
                       </Button>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground font-bold">بيانات المتجر غير متوفرة حالياً.</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
