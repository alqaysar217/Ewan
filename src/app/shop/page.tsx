'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { 
  Filter, 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  LayoutGrid, 
  List,
  Star,
  ChevronDown,
  Palette,
  Layers,
  CircleDollarSign,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ShopPage() {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [maxPrice, setMaxPrice] = useState([500000]);
  const db = useFirestore();
  
  const productsQuery = collection(db, 'products');
  const { data: products, loading } = useCollection(productsQuery);

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

      <div className="bg-secondary text-white py-16 px-4">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4">متجر إيوان</h1>
          <p className="text-gray-300 max-w-2xl text-lg font-medium">
            تصفح أرقى قطع الأثاث المختارة بعناية لتناسب ذوقك الرفيع.
          </p>
        </div>
      </div>

      <main className="container mx-auto py-12 px-4 md:px-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 space-y-10">
            <div className="bg-white p-6 rounded-[15px] border border-border/50 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-xl font-black text-secondary flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" /> تصفية المنتجات
                </h3>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-primary h-auto p-0">إعادة تعيين</Button>
              </div>

              <Accordion type="multiple" defaultValue={["categories", "price"]} className="w-full">
                {/* Categories Section */}
                <AccordionItem value="categories" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="font-bold text-secondary flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" /> الأقسام الرئيسية
                    </span>
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

                {/* Style Section */}
                <AccordionItem value="styles" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="font-bold text-secondary flex items-center gap-2">
                      <Maximize2 className="w-4 h-4 text-primary" /> الأنماط والتصاميم
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {styles.map((style) => (
                        <div key={style.id} className="flex items-center space-x-2 space-x-reverse group cursor-pointer">
                          <Checkbox id={`style-${style.id}`} className="rounded-sm" />
                          <label htmlFor={`style-${style.id}`} className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer pr-2">
                            {style.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Price Range Section */}
                <AccordionItem value="price" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="font-bold text-secondary flex items-center gap-2">
                      <CircleDollarSign className="w-4 h-4 text-primary" /> الميزانية (ر.ي)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-6 px-2 space-y-6">
                      <Slider 
                        defaultValue={[500000]} 
                        max={1000000} 
                        step={1000} 
                        value={maxPrice}
                        onValueChange={setMaxPrice}
                        className="cursor-pointer"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground">0</span>
                        <span className="text-sm font-black text-primary">حتى {maxPrice[0].toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Colors Section */}
                <AccordionItem value="colors" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="font-bold text-secondary flex items-center gap-2">
                      <Palette className="w-4 h-4 text-primary" /> اللون السائد
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {colors.map((color) => (
                        <button 
                          key={color.id}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 border border-transparent hover:border-border transition-all text-right"
                        >
                          <div 
                            className="w-4 h-4 rounded-full border border-border" 
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-xs font-bold text-muted-foreground">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Materials Section */}
                <AccordionItem value="materials" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="font-bold text-secondary flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" /> المادة والخامة
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {materials.map((mat) => (
                        <Badge 
                          key={mat.id} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary hover:text-white hover:border-primary transition-all rounded-md px-3 py-1 font-bold text-xs"
                        >
                          {mat.name}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="p-8 bg-secondary text-white rounded-[15px] space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rotate-45 -translate-y-16 translate-x-16 transition-transform group-hover:scale-110" />
              <Sparkles className="w-10 h-10 text-primary relative z-10" />
              <h4 className="font-black text-xl relative z-10">تحتاج مساعدة في الاختيار؟</h4>
              <p className="text-sm text-gray-400 font-medium relative z-10 leading-relaxed">دع المصمم الذكي يساعدك في تنسيق مساحتك بأفضل القطع.</p>
              <Link href="/ai-design" className="block relative z-10 pt-4">
                <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white font-black h-12 shadow-xl shadow-primary/20">
                  ابدأ استوديو التصميم
                </Button>
              </Link>
            </div>
          </aside>

          {/* Product Listing */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm border border-border/50">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewType('grid')}
                  className={`rounded-md w-10 h-10 ${viewType === 'grid' ? 'text-primary bg-primary/10' : ''}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewType('list')}
                  className={`rounded-md w-10 h-10 ${viewType === 'list' ? 'text-primary bg-primary/10' : ''}`}
                >
                  <List className="w-5 h-5" />
                </Button>
                <span className="text-sm font-bold text-muted-foreground mr-4">عرض {(products?.length || 0).toLocaleString('en-US')} منتج</span>
              </div>

              <div className="flex items-center gap-4">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px] rounded-xl h-11 border-border/60 font-bold">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="newest" className="font-bold">الأحدث</SelectItem>
                    <SelectItem value="price-asc" className="font-bold">السعر: من الأقل</SelectItem>
                    <SelectItem value="price-desc" className="font-bold">السعر: من الأعلى</SelectItem>
                    <SelectItem value="rating" className="font-bold">الأعلى تقييماً</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={`grid ${viewType === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
              {products?.map((product: any) => (
                <div key={product.id} className="group bg-gray-50 border border-border/50 rounded-[15px] overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                  <div className="relative aspect-square overflow-hidden bg-white/50">
                    <Image 
                      src={`https://picsum.photos/seed/${product.id}/600/600`} 
                      alt={product.name_ar} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-secondary font-black rounded-xl shadow-xl px-8 py-3">عرض التفاصيل</span>
                      </div>
                    </Link>
                    
                    <div className="absolute top-4 left-4 z-20">
                      <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-md rounded-full text-secondary hover:text-destructive shadow-sm w-10 h-10">
                        <Heart className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="bg-secondary text-white font-black rounded-lg px-3 py-1.5 shadow-sm border-none">
                         15% خصم
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-lg font-black text-secondary group-hover:text-primary transition-colors line-clamp-1 leading-tight">{product.name_ar}</h4>
                      <div className="flex items-center gap-1 text-amber-500 shrink-0 bg-white px-2 py-0.5 rounded-lg shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-black">{(4.9).toLocaleString('en-US')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-[10px] font-black text-primary">
                        {product.vendor_id ? 'م' : 'إ'}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">متجر إيوان المعتمد</span>
                    </div>

                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/20 bg-primary/5 px-2 py-0 rounded-md">
                        {product.category_id || 'أثاث منزلي'}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-bold text-secondary border-secondary/20 bg-secondary/5 px-2 py-0 rounded-md">
                        خشب طبيعي
                      </Badge>
                    </div>

                    <div className="mt-auto pt-4 border-t">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-secondary leading-none">
                          {(product.price || 0).toLocaleString('en-US')} <span className="text-sm font-bold">ر.ي</span>
                        </span>
                      </div>
                      <Button className="w-full mt-4 bg-secondary hover:bg-primary text-white font-black gap-2 h-12 rounded-xl transition-all shadow-xl shadow-secondary/10">
                        <ShoppingBag className="w-5 h-5" /> إضافة للسلة
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Placeholder */}
            {products && products.length > 0 && (
              <div className="pt-10 flex justify-center">
                <Button variant="outline" className="rounded-xl px-10 h-12 font-black border-primary text-primary hover:bg-primary/5">
                  تحميل المزيد من المنتجات
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
