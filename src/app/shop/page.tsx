'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { 
  Filter, 
  ShoppingBag, 
  LayoutGrid, 
  List,
  Star,
  Store,
  Loader2,
  Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

export default function ShopPage() {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [maxPrice, setMaxPrice] = useState([1000000]);
  const db = useFirestore();
  
  const productsQuery = query(collection(db, 'products'), orderBy('created_at', 'desc'));
  const { data: products, loading: productsLoading } = useCollection(productsQuery);
  const { data: vendors } = useCollection(collection(db, 'vendors'));

  const categories = [
    { id: 'living', name: 'غرف المعيشة' },
    { id: 'bedroom', name: 'النوم' },
    { id: 'dining', name: 'الطعام' },
    { id: 'majlis', name: 'المجالس' },
    { id: 'lighting', name: 'الإضاءة' },
    { id: 'office', name: 'المكاتب' }
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col font-cairo" dir="rtl">
      <Header />

      <section className="relative py-12 md:py-16 bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ffffff' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l10.99-6.35L25 17.9v12.7L13.99 36.95 3 30.6V17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.31zM28 15l-12.98-7.5V0h2v6.35L28 12.69v2.3zm0 18.5l-12.98 7.5v8h2v-6.85l12.98-7.5v-2.31z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="container relative z-10 px-4 md:px-8 mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl md:text-5xl font-black text-white">كتالوج إيوان الفاخر</h1>
            <p className="text-base md:text-lg text-gray-300 font-medium max-w-2xl mx-auto">تصفح أرقى قطع الأثاث من أمهر النجارين والمتاجر المعتمدة في اليمن.</p>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-12 px-4 md:px-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-80 space-y-10">
            <div className="bg-white p-6 rounded-xl border border-border/50 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-xl font-black text-secondary flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" /> تصفية الكتالوج
                </h3>
              </div>

              <Accordion type="multiple" defaultValue={["categories", "price"]} className="w-full">
                <AccordionItem value="categories" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-4 font-bold text-secondary">
                    الأقسام الرئيسية
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-2 space-x-reverse group cursor-pointer">
                          <Checkbox id={`cat-${cat.id}`} className="rounded-sm" />
                          <label htmlFor={`cat-${cat.id}`} className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer pr-2">
                            {cat.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-4 font-bold text-secondary">
                    الميزانية (ر.ي)
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-6 px-2 space-y-6">
                      <Slider defaultValue={[1000000]} max={2000000} step={10000} value={maxPrice} onValueChange={setMaxPrice} />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground">0</span>
                        <span className="text-sm font-black text-primary">حتى {maxPrice[0].toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </aside>

          <div className="flex-1 space-y-8">
            {productsLoading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="font-black text-muted-foreground">جاري عرض الكتالوج...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm border border-border/50">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setViewType('grid')} className={cn("rounded-md", viewType === 'grid' && "text-primary bg-primary/10")}>
                      <LayoutGrid className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setViewType('list')} className={cn("rounded-md", viewType === 'list' && "text-primary bg-primary/10")}>
                      <List className="w-5 h-5" />
                    </Button>
                    <span className="text-sm font-bold text-muted-foreground mr-4">عرض {(products?.length || 0).toLocaleString('en-US')} قطعة فاخرة</span>
                  </div>
                </div>

                <div className={cn("grid gap-8", viewType === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
                  {products?.map((p: any) => {
                    const vendor = vendors?.find(v => v.id === p.vendor_id);
                    return (
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
                            <h4 className="text-base font-black text-secondary flex-1 leading-tight">{p.name_ar}</h4>
                            <div className="flex items-center gap-1 text-amber-500 shrink-0 mr-2">
                              <span className="text-xs font-black">{(p.rating || 5.0).toLocaleString('en-US')}</span>
                              <Star className="w-3 h-3 fill-current" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Store className="w-4 h-4 text-primary" />
                              <span className="text-xs font-bold">{vendor?.business_name || 'إيوان المعتمد'}</span>
                            </div>
                            <div className="w-fit">
                              <Badge variant="outline" className="text-[9px] font-bold text-primary border-primary/20 bg-primary/5 px-2 py-0.5 rounded-full uppercase">
                                {p.category_id}
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-auto pt-2 space-y-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-black text-secondary">
                                {(Number(p.price) || 0).toLocaleString('en-US')} <span className="text-[10px] font-bold">ريال يمني</span>
                              </span>
                              {Number(p.old_price) > 0 && (
                                <span className="text-xs text-muted-foreground line-through font-bold opacity-50">{(Number(p.old_price)).toLocaleString('en-US')}</span>
                              )}
                            </div>
                            <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-black gap-2 h-11 rounded-xl transition-all shadow-sm">
                              <ShoppingBag className="w-4 h-4" /> إضافة للسلة
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
