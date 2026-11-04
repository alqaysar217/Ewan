'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { 
  MapPin, 
  Star, 
  CheckCircle2, 
  Search,
  Filter,
  ArrowLeft,
  Store,
  ChevronLeft,
  Award,
  Layers,
  CircleDollarSign,
  Palette,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const MOCK_STORES = [
  {
    id: 's1',
    business_name: 'المعرض الملكي للأثاث',
    business_type: 'furniture_store',
    description: 'أفخم تشكيلة من غرف النوم الإيطالية والأطقم التركية الجاهزة مع ضمان حقيقي لمدة 5 سنوات.',
    city: 'صنعاء، شارع حدة',
    average_rating: 4.9,
    service_areas: ['صنعاء', 'عمران', 'ذمار'],
    cover_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    logo_url: 'https://picsum.photos/seed/s1/200/200',
    approval_status: 'approved'
  },
  {
    id: 's2',
    business_name: 'أثاث الخليج الحديث',
    business_type: 'furniture_store',
    description: 'نقدم حلولاً عصرية للمكاتب والمنازل بأسعار تنافسية. تشكيلة واسعة من المكاتب والكراسي الطبية.',
    city: 'عدن، المنصورة',
    average_rating: 4.7,
    service_areas: ['عدن', 'لحج', 'أبين'],
    cover_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200',
    logo_url: 'https://picsum.photos/seed/s2/200/200',
    approval_status: 'approved'
  },
  {
    id: 's3',
    business_name: 'مفروشات السعيد',
    business_type: 'furniture_store',
    description: 'الرائدون في عالم المفروشات منذ عام 1990. نجمع بين الجودة العالية والذوق الرفيع.',
    city: 'تعز، شارع جمال',
    average_rating: 4.8,
    service_areas: ['تعز', 'إب'],
    cover_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200',
    logo_url: 'https://picsum.photos/seed/s3/200/200',
    approval_status: 'approved'
  },
  {
    id: 's4',
    business_name: 'مركز المهرة للمفروشات',
    business_type: 'furniture_store',
    description: 'أحدث الموديلات العالمية المستوردة حصرياً لعملائنا في المهرة والمناطق الشرقية.',
    city: 'المهرة، الغيضة',
    average_rating: 4.5,
    service_areas: ['الغيضة', 'سقطرى'],
    cover_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200',
    logo_url: 'https://picsum.photos/seed/s4/200/200',
    approval_status: 'approved'
  },
  {
    id: 's5',
    business_name: 'عالم الديكور للأثاث',
    business_type: 'furniture_store',
    description: 'تخصصنا في الأثاث المودرن والستائر الذكية. اجعل منزلك مواكباً للعصر مع منتجاتنا.',
    city: 'إب، الدائري',
    average_rating: 4.6,
    service_areas: ['إب', 'تعز'],
    cover_url: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=1200',
    logo_url: 'https://picsum.photos/seed/s5/200/200',
    approval_status: 'approved'
  }
];

export default function StoresPage() {
  const db = useFirestore();
  const [maxPrice, setMaxPrice] = useState([500000]);
  
  const vendorsQuery = query(
    collection(db, 'vendors'), 
    where('business_type', '==', 'furniture_store')
  );
    
  const { data: firestoreVendors, loading } = useCollection(vendorsQuery);

  const displayedStores = (firestoreVendors && firestoreVendors.length > 0) 
    ? firestoreVendors 
    : MOCK_STORES;

  const categories = [
    { id: 'living', name: 'غرف المعيشة' },
    { id: 'bedroom', name: 'النوم' },
    { id: 'dining', name: 'الطعام' },
    { id: 'majlis', name: 'المجالس' },
    { id: 'lighting', name: 'الإضاءة' },
    { id: 'rugs', name: 'السجاد' },
    { id: 'antiques', name: 'التحف' }
  ];

  const styles = [
    { id: 'modern', name: 'حديث' },
    { id: 'minimalist', name: 'مينمليست' },
    { id: 'traditional', name: 'طابع تراثي' },
    { id: 'contemporary', name: 'كونتمبوراري' },
    { id: 'scandinavian', name: 'اسكندنافي' }
  ];

  const colors = [
    { id: 'creamy', name: 'كريمي', hex: '#F5F5DC' },
    { id: 'beige', name: 'بيج', hex: '#F5F5DC' },
    { id: 'walnut', name: 'جوز داكن', hex: '#3B2F2F' },
    { id: 'oak', name: 'بلوط', hex: '#9E7E53' }
  ];

  const materials = [
    { id: 'wood', name: 'خشب' },
    { id: 'fabric', name: 'قماش' },
    { id: 'linen', name: 'كتان' },
    { id: 'metal', name: 'معدن' },
    { id: 'copper', name: 'نحاس' },
    { id: 'bamboo', name: 'خيزران' },
    { id: 'woven', name: 'منسوج' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />

      <section className="relative py-16 bg-secondary overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
        <div className="container relative z-10 px-4 md:px-8 mx-auto">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border-r-4 border-primary text-primary text-xs font-black uppercase tracking-widest">
              نخبة المتاجر المعتمدة في اليمن
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              اكتشف <span className="text-primary">أرقى</span> قطع الأثاث
            </h1>
            <p className="text-lg text-gray-300 font-medium max-w-xl">
              تصفح معارض الأثاث الكبرى التي توفر لك الجودة والضمان في مكان واحد.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-12 px-4 md:px-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <aside className="w-full lg:w-80 space-y-8">
            <div className="bg-white p-8 border border-border/50 shadow-sm space-y-8 rounded-[15px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-secondary flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" /> تصفية المتاجر
                  </h3>
                  <button className="text-xs font-bold text-primary hover:underline">إعادة تعيين</button>
                </div>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="ابحث عن متجر..." 
                    className="pr-10 h-12 bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-md" 
                  />
                </div>
              </div>

              <Accordion type="multiple" defaultValue={["categories"]} className="w-full">
                {/* Categories */}
                <AccordionItem value="categories" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-bold text-secondary flex items-center gap-2 text-sm">
                      <Layers className="w-4 h-4 text-primary" /> القسم الرئيسي
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-2 space-x-reverse group cursor-pointer">
                          <Checkbox id={`cat-${cat.id}`} className="rounded-sm" />
                          <label htmlFor={`cat-${cat.id}`} className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer pr-2">
                            {cat.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Styles */}
                <AccordionItem value="styles" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-bold text-secondary flex items-center gap-2 text-sm">
                      <Maximize2 className="w-4 h-4 text-primary" /> الأنماط والتصاميم
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {styles.map((style) => (
                        <div key={style.id} className="flex items-center space-x-2 space-x-reverse group cursor-pointer">
                          <Checkbox id={`style-${style.id}`} className="rounded-sm" />
                          <label htmlFor={`style-${style.id}`} className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer pr-2">
                            {style.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Price */}
                <AccordionItem value="price" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-bold text-secondary flex items-center gap-2 text-sm">
                      <CircleDollarSign className="w-4 h-4 text-primary" /> الميزانية (ر.ي)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4 px-2 space-y-4">
                      <Slider 
                        defaultValue={[500000]} 
                        max={1000000} 
                        step={1000} 
                        value={maxPrice}
                        onValueChange={setMaxPrice}
                        className="cursor-pointer"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground">0</span>
                        <span className="text-xs font-black text-primary">حتى {maxPrice[0].toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Colors */}
                <AccordionItem value="colors" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-bold text-secondary flex items-center gap-2 text-sm">
                      <Palette className="w-4 h-4 text-primary" /> اللون السائد
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {colors.map((color) => (
                        <button 
                          key={color.id}
                          className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-border transition-all text-right"
                        >
                          <div 
                            className="w-3 h-3 rounded-full border border-border" 
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-[10px] font-bold text-muted-foreground">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Materials */}
                <AccordionItem value="materials" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-bold text-secondary flex items-center gap-2 text-sm">
                      <Sparkles className="w-4 h-4 text-primary" /> المادة والخامة
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {materials.map((mat) => (
                        <Badge 
                          key={mat.id} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary hover:text-white hover:border-primary transition-all rounded-md px-2 py-0.5 font-bold text-[10px]"
                        >
                          {mat.name}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="pt-6">
                <div className="p-6 bg-secondary text-white relative overflow-hidden group rounded-[15px]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45" />
                  <div className="relative z-10 space-y-4">
                    <Award className="w-8 h-8 text-primary" />
                    <h4 className="font-black text-lg leading-tight">هل لديك معرض أثاث؟</h4>
                    <Link href="/register" className="block">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-md">
                        سجل معرضك الآن
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-secondary">
                جميع المتاجر المتاحة
                <span className="text-sm font-bold text-muted-foreground mr-3">({displayedStores.length.toLocaleString('en-US')})</span>
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-[15px]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayedStores.map((store: any) => (
                  <Link 
                    href={`/vendors/${store.id}`}
                    key={store.id} 
                    className="group bg-gray-50 border border-border/50 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col rounded-[15px]"
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
                        <div className="w-14 h-14 bg-white p-1 shadow-xl relative overflow-hidden rounded-md">
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
                            <CheckCircle2 className="w-4 h-4 text-primary fill-white" />
                          </div>
                          <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-[10px] uppercase">
                            معرض أثاث
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-sm text-secondary font-black border-none px-2 py-1 flex items-center gap-1 shadow-lg rounded-md">
                          <Star className="w-3 h-3 text-amber-500 fill-current" />
                          {store.average_rating ? store.average_rating.toLocaleString('en-US') : '5.0'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-2">
                        {store.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {store.city}
                        </div>
                        <Button variant="outline" size="sm" className="h-10 font-bold border-secondary/10 hover:bg-secondary hover:text-white transition-all rounded-md">
                          تصفح المنتجات 
                          <ArrowLeft className="w-4 h-4 mr-2" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
