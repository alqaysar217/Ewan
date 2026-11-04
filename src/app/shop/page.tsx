'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  LayoutGrid, 
  List,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Footer from '@/components/Footer';

export default function ShopPage() {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const db = useFirestore();
  
  // جلب المنتجات المعتمدة فقط
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
      {/* Header Section */}
      <div className="bg-secondary text-white py-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-4">متجر إيوان</h1>
          <p className="text-gray-300 max-w-2xl text-lg font-medium">
            تصفح أرقى قطع الأثاث المختارة بعناية من أفضل المتاجر والنجارين في المنطقة.
          </p>
        </div>
      </div>

      <main className="container mx-auto py-12 px-4 flex-1">
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
                    className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg h-12 font-bold"
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-secondary">نطاق السعر</h3>
              <div className="px-2">
                <input type="range" className="w-full accent-primary" min="0" max="10000" />
                <div className="flex justify-between mt-2 text-sm font-bold text-muted-foreground">
                  <span>0 SAR</span>
                  <span>10,000+ SAR</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-lg border border-primary/10 space-y-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <h4 className="font-black text-secondary">تحتاج مساعدة في الاختيار؟</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">استخدم استوديو التصميم الذكي لترى كيف تبدو هذه القطع في غرفتك قبل الشراء.</p>
              <Link href="/ai-design" className="block">
                <Button className="w-full rounded-lg bg-primary hover:bg-primary/90 text-white font-bold">ابدأ التصميم</Button>
              </Link>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 space-y-8">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-border/50">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewType('grid')}
                  className={`rounded-lg ${viewType === 'grid' ? 'text-primary bg-primary/10' : ''}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setViewType('list')}
                  className={`rounded-xl ${viewType === 'list' ? 'text-primary bg-primary/10' : ''}`}
                >
                  <List className="w-5 h-5" />
                </Button>
                <span className="text-sm font-bold text-muted-foreground mr-4">عرض {products?.length || 0} منتج</span>
              </div>

              <div className="flex items-center gap-4">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px] rounded-lg border-border/60">
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

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className={`grid ${viewType === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
                {products?.map((product: any) => (
                  <Card key={product.id} className="group overflow-hidden rounded-lg border-none shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                      <Image 
                        src={`https://picsum.photos/seed/${product.id}/600/800`} 
                        alt={product.name_ar} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        data-ai-hint="furniture product"
                      />
                      <Button variant="ghost" size="icon" className="absolute top-4 left-4 bg-white/80 backdrop-blur-md rounded-full text-secondary hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-5 h-5" />
                      </Button>
                      <Badge className="absolute top-4 right-4 bg-secondary text-white font-bold px-3 py-1 rounded-lg">جديد</Badge>
                    </div>
                    <CardContent className="p-6 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">{product.category_id || 'أثاث'}</p>
                          <h4 className="text-lg font-black text-secondary group-hover:text-primary transition-colors">{product.name_ar}</h4>
                        </div>
                        <p className="text-xl font-black text-secondary">{product.price} <span className="text-xs">SAR</span></p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <p className="text-xs text-muted-foreground font-medium">بواسطة: <span className="text-secondary font-bold">متجر إيوان</span></p>
                        <Button size="sm" className="rounded-lg bg-secondary hover:bg-primary text-white font-bold gap-2">
                          <ShoppingBag className="w-4 h-4" /> إضافة للسلة
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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