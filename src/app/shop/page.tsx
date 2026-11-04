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
  SlidersHorizontal,
  Star,
  Eye,
  Percent
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
                <input type="range" className="w-full accent-primary" min="0" max="1000000" />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-muted-foreground">
                  <span>٠ ريال</span>
                  <span>١,٠٠٠,٠٠٠+ ريال</span>
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
                  className={`rounded-lg ${viewType === 'list' ? 'text-primary bg-primary/10' : ''}`}
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
                  <Card key={product.id} className="group overflow-hidden rounded-lg border-none shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                      <Image 
                        src={`https://picsum.photos/seed/${product.id}/600/800`} 
                        alt={product.name_ar} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        data-ai-hint="furniture product"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                         <Button size="icon" className="w-12 h-12 bg-white text-secondary hover:bg-primary hover:text-white rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
                            <Eye className="w-6 h-6" />
                         </Button>
                         <Button className="bg-white text-secondary hover:bg-primary hover:text-white font-bold rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform delay-75">
                            عرض التفاصيل
                         </Button>
                      </div>

                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-md rounded-lg text-secondary hover:text-destructive shadow-sm">
                          <Heart className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <Badge className="bg-secondary text-white font-bold px-3 py-1 rounded-lg border-none">جديد</Badge>
                        <Badge className="bg-destructive text-white font-bold px-3 py-1 rounded-lg border-none flex items-center gap-1">
                          <Percent className="w-3 h-3" /> ٢٥٪
                        </Badge>
                      </div>

                      <div className="absolute bottom-4 right-4 left-4 flex justify-between items-center translate-y-12 group-hover:translate-y-0 transition-transform bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                        <div className="flex items-center gap-1">
                           <Star className="w-3 h-3 text-amber-500 fill-current" />
                           <span className="text-xs font-black text-secondary">٤.٩</span>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">متجر إتقان</span>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{product.category_id || 'أثاث منزلي'}</p>
                        <h4 className="text-lg font-black text-secondary group-hover:text-primary transition-colors line-clamp-1">{product.name_ar}</h4>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-secondary">
                            {(product.price || 0).toLocaleString()} <span className="text-[10px] font-bold">ريال يمني</span>
                          </span>
                          <span className="text-xs font-bold text-muted-foreground line-through">
                            {(product.price ? product.price * 1.25 : 0).toLocaleString()} ريال
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 mt-auto border-t border-gray-50 flex gap-2">
                        <Button className="flex-1 rounded-lg bg-secondary hover:bg-primary text-white font-bold gap-2 h-11 transition-all">
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
