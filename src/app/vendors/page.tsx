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
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const MOCK_STORES = [
  {
    id: 'v3',
    business_name: 'معرض الخشب الفاخر',
    business_type: 'furniture_store',
    description: 'أكبر تشكيلة من الأثاث المنزلي والمكتبي الجاهز والمصنع حسب الطلب من أفضل أنواع الأخشاب.',
    city: 'حضرموت، المكلا',
    average_rating: 5.0,
    service_areas: ['المكلا', 'الشحر', 'سيئون'],
    cover_url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=800',
    logo_url: 'https://picsum.photos/seed/v3/200/200',
    approval_status: 'approved'
  },
];

export default function StoresPage() {
  const db = useFirestore();
  
  const vendorsQuery = query(
    collection(db, 'vendors'), 
    where('business_type', '==', 'furniture_store')
  );
    
  const { data: firestoreVendors, loading } = useCollection(vendorsQuery);

  const displayedStores = (firestoreVendors && firestoreVendors.length > 0) 
    ? firestoreVendors 
    : MOCK_STORES;

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
            <div className="bg-white p-8 border border-border/50 shadow-sm space-y-8 rounded-md">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-secondary flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" /> تصفية المتاجر
                </h3>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="ابحث عن متجر..." 
                    className="pr-10 h-12 bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-md" 
                  />
                </div>
              </div>

              <div className="pt-6">
                <div className="p-6 bg-secondary text-white relative overflow-hidden group rounded-md">
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
                <span className="text-sm font-bold text-muted-foreground mr-3">({displayedStores.length})</span>
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map(i => (
                  <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-md" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayedStores.map((store: any) => (
                  <Link 
                    href={`/vendors/${store.id}`}
                    key={store.id} 
                    className="group bg-white border border-border/50 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col rounded-md"
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
