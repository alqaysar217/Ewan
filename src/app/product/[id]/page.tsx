'use client';

import { useState, use } from 'react';
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
  ArrowRight,
  Zap,
  MessageSquare,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);

  // Mock data for a product
  const product = {
    id,
    name: 'طقم ديوان حضرمي مطور - خشب زان فاخر',
    category: 'غرف المعيشة',
    price: 450000,
    oldPrice: 520000,
    inStock: true,
    rating: 4.9,
    reviewsCount: 124,
    description: 'تم تصميم هذا الطقم يدوياً بجودة عالية من خشب الزان الطبيعي، يجمع بين الأصالة الحضرية واللمسات العصرية ليوفر لك الراحة والفخامة في غرفة المعيشة الخاصة بك. القماش المستخدم مضاد للبقع وسهل التنظيف.',
    store: 'ورشة المكلا المتميزة',
    location: 'حضرموت، اليمن',
    taxInfo: 'السعر يشمل ضريبة المبيعات والرسوم المحلية',
    technicalSpecs: [
      { label: 'الخامة الرئيسية', value: 'خشب زان طبيعي' },
      { label: 'الأبعاد', value: '300 × 250 سم' },
      { label: 'نوع القماش', value: 'مخمل تركي فاخر' },
      { label: 'الضمان', value: '5 سنوات على الهيكل' }
    ],
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800'
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />
      
      {/* Breadcrumbs */}
      <nav className="bg-white border-b py-4">
        <div className="container mx-auto px-4 flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <Link href="/" className="hover:text-primary">الرئيسية</Link>
          <ChevronRight className="w-4 h-4 rotate-180" />
          <Link href="/shop" className="hover:text-primary">المتجر</Link>
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="text-secondary truncate">{product.name}</span>
        </div>
      </nav>

      <main className="container mx-auto py-12 px-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Images Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-lg overflow-hidden border border-border/50 shadow-sm">
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                className="object-cover"
                priority
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-secondary text-white font-bold text-lg px-4 py-1.5 shadow-xl">خصم 15%</Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-md overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer transition-all">
                  <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info & Purchase Actions */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-primary border-primary font-bold">{product.category}</Badge>
                {product.inStock && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> متوفر في المخزون
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-secondary leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4 fill-current", i >= 4.5 && "fill-none")} />
                  ))}
                  <span className="text-secondary font-black mr-1">{product.rating}</span>
                </div>
                <span className="text-sm font-bold text-muted-foreground">({product.reviewsCount} مراجعة)</span>
                <Separator orientation="vertical" className="h-4" />
                <Button variant="ghost" className="text-primary font-bold gap-2 p-0 h-auto hover:bg-transparent">
                  <Share2 className="w-4 h-4" /> مشاركة
                </Button>
              </div>
            </div>

            <div className="p-8 bg-gray-50 rounded-lg space-y-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-secondary">{product.price.toLocaleString()} <span className="text-lg font-bold">ريال يمني</span></span>
                  <span className="text-xl text-muted-foreground line-through font-bold">{product.oldPrice.toLocaleString()} ريال</span>
                </div>
                <p className="text-xs text-muted-foreground font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> {product.taxInfo}
                </p>
              </div>
              
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-secondary">الكمية</label>
                  <div className="flex items-center gap-4 bg-white border rounded-md p-1 w-fit">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                    <span className="w-8 text-center font-black">{quantity}</span>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-sm" onClick={() => setQuantity(quantity + 1)}>+</Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <Button className="h-14 rounded-md bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 gap-3">
                  <ShoppingBag className="w-5 h-5" /> إضافة للسلة
                </Button>
                <Button variant="secondary" className="h-14 rounded-md bg-secondary text-white font-black text-lg shadow-xl shadow-secondary/20 gap-3">
                  <Zap className="w-5 h-5" /> شراء فوري (دفع مسبق)
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3 p-4 bg-white border rounded-md shadow-sm">
                <Truck className="w-6 h-6 text-primary shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-secondary">توصيل وتركيب</p>
                  <p className="text-[10px] text-muted-foreground font-bold">متاح لمعظم المدن</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white border rounded-md shadow-sm">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-secondary">ضمان الجودة</p>
                  <p className="text-[10px] text-muted-foreground font-bold">5 سنوات حقيقية</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white border rounded-md shadow-sm">
                <Hammer className="w-6 h-6 text-primary shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-secondary">صنع في اليمن</p>
                  <p className="text-[10px] text-muted-foreground font-bold">أخشاب وحرفية وطنية</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs */}
        <div className="mt-20">
          <Tabs defaultValue="specs" className="w-full" dir="rtl">
            <TabsList className="w-full justify-start h-14 bg-transparent border-b rounded-none p-0 gap-8">
              <TabsTrigger value="specs" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-black text-lg px-6">المواصفات الفنية</TabsTrigger>
              <TabsTrigger value="reviews" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-black text-lg px-6">آراء العملاء</TabsTrigger>
              <TabsTrigger value="store" className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-black text-lg px-6">عن المتجر</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specs" className="py-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-secondary">وصف المنتج</h3>
                  <p className="text-muted-foreground leading-loose font-medium text-lg">{product.description}</p>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-secondary">تفاصيل القطعة</h3>
                  <div className="space-y-4">
                    {product.technicalSpecs.map((spec, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                        <span className="font-bold text-muted-foreground">{spec.label}</span>
                        <span className="font-black text-secondary">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="py-10 animate-in fade-in duration-500">
               <div className="space-y-10">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-8 bg-gray-50 rounded-lg">
                    <div className="text-center md:text-right space-y-2">
                      <h3 className="text-5xl font-black text-secondary">{product.rating}</h3>
                      <div className="flex gap-1 justify-center md:justify-start text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="fill-current w-5 h-5" />)}
                      </div>
                      <p className="text-sm font-bold text-muted-foreground">بناءً على {product.reviewsCount} تقييم</p>
                    </div>
                    <Button className="rounded-md font-bold px-10 h-12 bg-secondary text-white">أضف مراجعتك الآن</Button>
                  </div>

                  <div className="space-y-8">
                    {[
                      { user: 'محمد القاضي', date: 'منذ أسبوع', rating: 5, comment: 'طقم رائع جداً، جودة الخشب والنجارة واضحة من أول نظرة. التوصيل كان سريع جداً لصنعاء.' },
                      { user: 'سارة الحضرمي', date: 'منذ أسبوعين', rating: 4, comment: 'جميل جداً ولكن كان هناك تأخير بسيط في الشحن للمكلا. المنتج يستحق الانتظار.' }
                    ].map((rev, i) => (
                      <div key={i} className="space-y-4 pb-8 border-b last:border-0">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="font-black text-secondary">{rev.user}</p>
                            <p className="text-xs text-muted-foreground font-bold">{rev.date}</p>
                          </div>
                          <div className="flex text-amber-500">
                            {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} className="fill-current w-3.5 h-3.5" />)}
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed font-medium">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="store" className="py-10 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center text-4xl font-black text-secondary border shadow-sm">
                  {product.store[0]}
                </div>
                <div className="flex-1 space-y-4 text-center md:text-right">
                   <div className="flex items-center justify-center md:justify-start gap-2">
                     <h3 className="text-2xl font-black text-secondary">{product.store}</h3>
                     <CheckCircle2 className="w-5 h-5 text-primary" />
                   </div>
                   <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                     <MapPin className="w-4 h-4 text-primary" /> {product.location}
                   </p>
                   <p className="text-lg leading-relaxed">ورشة وطنية متخصصة في صناعة الأثاث الحضرمي المطور منذ عام 1995. نستخدم أجود أنواع الأخشاب الطبيعية ونفخر بحرفيتنا اليمنية.</p>
                   <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                     <Button variant="outline" className="rounded-md font-bold px-8 border-secondary text-secondary hover:bg-secondary hover:text-white">مشاهدة المتجر</Button>
                     <Button variant="ghost" className="rounded-md font-bold px-8 text-primary gap-2"><MessageSquare className="w-4 h-4" /> محادثة التاجر</Button>
                   </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
