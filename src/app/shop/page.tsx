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
  Percent
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
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Helper to convert numbers to Arabic numerals
const toArabicNums = (num: number | string) => {
  return num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
};

export default function ShopPage() {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const db = useFirestore();
  
  const productsQuery = collection(db, 'products');
  const { data: products, loading } = useCollection(productsQuery);

  const categories = [
    { id: 'living', name: 'غرفة المعيشة' },
    { id: 'bedroom', name: 'غرفة النوم' },
    { id: 'kitchen', name: 'المطبخ' },
    { id: 'office', name: 'المكتب' },
    { id: 'decor', name: 'ديكورات' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />

      {/* Header Section */}
      <div className="bg-secondary text-white py-16 px-4">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-black mb-4">متجر إيوان</h1>
          <p className="text-gray-300 max-w-2xl text-lg font-medium">
            تصفح أرقى قطع الأثاث المختارة بعناية.
          </p>
        </div>
      </div>

      <main className="container mx-auto py-12 px-4 md:px-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 space-y-10">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-secondary flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" /> التصنيفات
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Button 
                    key={cat.id} 
                    variant="ghost" 
                    className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md h-12 font-bold"
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-lg border border-primary/10 space-y-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <h4 className="font-black text-secondary">تحتاج مساعدة في الاختيار؟</h4>
              <Link href="/ai-design" className="block">
                <Button className="w-full rounded-md bg-primary hover:bg-primary/90 text-white font-bold">ابدأ التصميم</Button>
              </Link>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-border/50">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewType('grid')}
                  className={`rounded-md ${viewType === 'grid' ? 'text-primary bg-primary/10' : ''}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewType('list')}
                  className={`rounded-md ${viewType === 'list' ? 'text-primary bg-primary/10' : ''}`}
                >
                  <List className="w-5 h-5" />
                </Button>
                <span className="text-sm font-bold text-muted-foreground mr-4">عرض {toArabicNums(products?.length || 0)} منتج</span>
              </div>

              <div className="flex items-center gap-4">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px] rounded-md border-border/60">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">الأحدث</SelectItem>
                    <SelectItem value="price-asc">السعر: من الأقل</SelectItem>
                    <SelectItem value="price-desc">السعر: من الأعلى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={`grid ${viewType === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
              {products?.map((product: any) => (
                <div key={product.id} className="group bg-white border border-border/50 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image 
                      src={`https://picsum.photos/seed/${product.id}/600/600`} 
                      alt={product.name_ar} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-secondary font-bold rounded-md shadow-xl px-6 py-2">عرض التفاصيل</span>
                      </div>
                    </Link>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col">
                    {/* Row 1: Name & Rating */}
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-base font-black text-secondary group-hover:text-primary transition-colors line-clamp-1 leading-tight">{product.name_ar}</h4>
                      <div className="flex items-center gap-1 text-amber-500 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-black">{toArabicNums(4.9)}</span>
                      </div>
                    </div>

                    {/* Row 2: Store */}
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-[10px] font-black text-primary">
                        {product.vendor_id ? 'م' : 'م'}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">متجر إيوان المعتمد</span>
                    </div>

                    {/* Row 3: Category */}
                    <div className="flex">
                      <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/20 bg-primary/5 px-2 py-0">
                        {product.category_id || 'أثاث منزلي'}
                      </Badge>
                    </div>

                    {/* Row 4: Price */}
                    <div className="mt-auto pt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-secondary">
                          {toArabicNums((product.price || 0).toLocaleString())} <span className="text-xs font-bold">ر.ي</span>
                        </span>
                      </div>
                      <Button className="w-full mt-4 bg-secondary hover:bg-primary text-white font-bold gap-2 h-11 rounded-md transition-all shadow-sm">
                        <ShoppingBag className="w-4 h-4" /> إضافة للسلة
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
