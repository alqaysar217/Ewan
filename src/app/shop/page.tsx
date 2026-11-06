'use client';

import { useState, useMemo } from 'react';
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
  Search,
  Layers,
  CircleDollarSign,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

export default function ShopPage() {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState([2000000]);
  
  const db = useFirestore();
  
  const productsQuery = useMemo(() => query(collection(db, 'products'), orderBy('created_at', 'desc')), [db]);
  const { data: products, loading: productsLoading } = useCollection(productsQuery);
  
  const vendorsQuery = useMemo(() => collection(db, 'vendors'), [db]);
  const { data: vendors } = useCollection(vendorsQuery);

  const categories = [
    { id: 'all', name: 'جميع الأقسام' },
    { id: 'living', name: 'غرف المعيشة' },
    { id: 'bedroom', name: 'غرف النوم' },
    { id: 'dining', name: 'طاولات الطعام' },
    { id: 'majlis', name: 'المجالس العربية' },
    { id: 'lighting', name: 'الإضاءة والديكور' },
    { id: 'office', name: 'الأثاث المكتبي' }
  ];

  // تصفية المنتجات محلياً بناءً على الفلاتر
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p: any) => {
      const matchesSearch = p.name_ar?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category_id === categoryFilter;
      const matchesPrice = (Number(p.price) || 0) <= maxPrice[0];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, categoryFilter, maxPrice]);

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col font-cairo" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ffffff' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l10.99-6.35L25 17.9v12.7L13.99 36.95 3 30.6V17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.31zM28 15l-12.98-7.5V0h2v6.35L28 12.69v2.3zm0 18.5l-12.98 7.5v8h2v-6.85l12.98-7.5v-2.31z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="container relative z-10 px-4 md:px-8 mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl md:text-5xl font-black text-white">كتالوج إيوان الفاخر</h1>
            <p className="text-base md:text-lg text-gray-300 font-medium max-w-2xl mx-auto">تصفح أرقى قطع الأثاث من أمهر النجارين والمتاجر المعتمدة في اليمن.</p>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4 md:px-8 flex-1">
        <div className="space-y-8">
          
          {/* Top Horizontal Filter Bar */}
          <div className="bg-white p-4 md:p-6 rounded-[20px] border border-border/50 shadow-sm">
             <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
                
                {/* Search Field */}
                <div className="w-full lg:flex-1 relative group">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="ابحث عن قطعة أثاث بالاسم..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-12 h-12 bg-gray-50 border-none shadow-inner rounded-xl font-bold text-base focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  {/* Category Filter */}
                  <div className="min-w-[160px] flex-1 sm:flex-initial">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-12 rounded-xl border-none bg-gray-50 font-bold px-4 shadow-inner focus:ring-2 focus:ring-primary/20">
                        <div className="flex items-center gap-2">
                           <Layers className="w-4 h-4 text-primary" />
                           <SelectValue placeholder="القسم" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl font-cairo" dir="rtl">
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id} className="font-bold py-3">{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-12 rounded-xl bg-gray-50 border-none px-6 font-bold shadow-inner flex items-center gap-2 flex-1 sm:flex-initial">
                        <CircleDollarSign className="w-4 h-4 text-primary" />
                        الميزانية
                        <ChevronDown className="w-4 h-4 opacity-50 mr-auto" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-6 rounded-2xl border-none shadow-2xl font-cairo" dir="rtl">
                      <div className="space-y-6">
                        <h4 className="font-black text-secondary text-sm">حدد سقف السعر (ر.ي)</h4>
                        <Slider 
                          defaultValue={[2000000]} 
                          max={3000000} 
                          step={50000} 
                          value={maxPrice} 
                          onValueChange={setMaxPrice} 
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-muted-foreground">0</span>
                          <span className="text-sm font-black text-primary">حتى {maxPrice[0].toLocaleString('en-US')}</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* View Toggles */}
                  <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl shadow-inner ml-auto sm:ml-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setViewType('grid')} 
                      className={cn("h-10 w-10 rounded-lg transition-all", viewType === 'grid' ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-secondary")}
                    >
                      <LayoutGrid className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setViewType('list')} 
                      className={cn("h-10 w-10 rounded-lg transition-all", viewType === 'list' ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-secondary")}
                    >
                      <List className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
             </div>
          </div>

          {/* Products Results */}
          <div className="space-y-8">
            {productsLoading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="font-black text-muted-foreground">جاري عرض الكتالوج...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-32 text-center space-y-6 bg-white rounded-[24px] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                   <Search className="w-10 h-10 text-gray-200" />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-black text-secondary">لا توجد قطع تطابق بحثك</p>
                  <p className="text-muted-foreground font-bold">جرب تغيير الفلاتر أو الميزانية لرؤية المزيد.</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setMaxPrice([2000000]); }} 
                  className="rounded-xl font-black h-12 px-8"
                >
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-secondary">
                    النتائج المتاحة
                    <span className="text-sm font-bold text-muted-foreground mr-3">({filteredProducts.length.toLocaleString('en-US')} قطعة فاخرة)</span>
                  </h2>
                </div>

                <div className={cn(
                  "grid gap-8", 
                  viewType === 'grid' 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-1"
                )}>
                  {filteredProducts.map((p: any) => {
                    const vendor = vendors?.find(v => v.id === p.vendor_id);
                    return (
                      <div key={p.id} className={cn(
                        "bg-white rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex group border border-border/40",
                        viewType === 'grid' ? "flex-col" : "flex-col md:flex-row h-auto md:h-64"
                      )}>
                        <div className={cn(
                          "relative bg-gray-50 overflow-hidden",
                          viewType === 'grid' ? "aspect-square" : "aspect-square md:w-64"
                        )}>
                          <Image 
                            src={p.image_base64 || `https://picsum.photos/seed/${p.id}/600/800`} 
                            alt={p.name_ar} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <Link href={`/product/${p.id}`} className="absolute inset-0 z-10" />
                          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                             {Number(p.discount) > 0 && (
                               <Badge className="bg-secondary text-white font-black rounded-lg px-2 py-1 shadow-sm border-none text-[10px]">
                                 %{p.discount.toLocaleString('en-US')} خصم
                               </Badge>
                             )}
                             <Badge className={cn(
                               "font-black px-2 py-1 rounded-md border-none shadow-sm text-[9px]", 
                               p.in_stock ? "bg-emerald-500 text-white" : "bg-destructive text-white"
                             )}>
                               {p.in_stock ? 'متوفر' : 'غير متوفر'}
                             </Badge>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1 gap-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1 flex-1">
                              <h4 className="text-lg font-black text-secondary leading-tight line-clamp-1 group-hover:text-primary transition-colors">{p.name_ar}</h4>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Store className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-bold">{vendor?.business_name || 'إيوان المعتمد'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500 shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg">
                              <span className="text-xs font-black">{(p.rating || 5.0).toLocaleString('en-US')}</span>
                              <Star className="w-3 h-3 fill-current" />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-[9px] font-bold text-primary border-primary/20 bg-primary/5 px-2 py-0.5 rounded-full uppercase">
                              {p.category_id}
                            </Badge>
                            {p.material && (
                              <Badge variant="outline" className="text-[9px] font-bold text-muted-foreground border-border px-2 py-0.5 rounded-full">
                                {p.material}
                              </Badge>
                            )}
                          </div>

                          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
                            <div className="flex flex-col">
                              <span className="text-xl font-black text-secondary">
                                {(Number(p.price) || 0).toLocaleString('en-US')} <span className="text-[10px] font-bold">ر.ي</span>
                              </span>
                              {Number(p.old_price) > 0 && (
                                <span className="text-xs text-muted-foreground line-through font-bold opacity-50">{(Number(p.old_price)).toLocaleString('en-US')}</span>
                              )}
                            </div>
                            <Button className="bg-secondary hover:bg-secondary/90 text-white font-black gap-2 h-10 px-6 rounded-xl transition-all shadow-sm">
                              <ShoppingBag className="w-4 h-4" /> إضافة
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
