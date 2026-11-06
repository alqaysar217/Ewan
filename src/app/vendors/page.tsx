
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
  Sparkles,
  Map,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MOCK_STORES = [
  {
    id: 's1',
    business_name: 'المعرض الملكي للأثاث',
    business_type: 'furniture_store',
    description: 'أفخم تشكيلة من غرف النوم الإيطالية والأطقم التركية الجاهزة مع ضمان حقيقي لمدة 5 سنوات.',
    city: 'صنعاء',
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
    city: 'عدن',
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
    city: 'تعز',
    average_rating: 4.8,
    service_areas: ['تعز', 'إب'],
    cover_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200',
    logo_url: 'https://picsum.photos/seed/s3/200/200',
    approval_status: 'approved'
  }
];

export default function StoresPage() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  
  const vendorsQuery = query(
    collection(db, 'vendors'), 
    where('business_type', '==', 'furniture_store')
  );
    
  const { data: firestoreVendors, loading } = useCollection(vendorsQuery);

  let displayedStores = (firestoreVendors && firestoreVendors.length > 0) 
    ? firestoreVendors 
    : MOCK_STORES;

  // تصفية النتائج
  displayedStores = displayedStores.filter(store => {
    const matchesSearch = store.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'all' || store.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  const cities = [
    { id: 'all', name: 'جميع المدن اليمنية' },
    { id: 'صنعاء', name: 'صنعاء' },
    { id: 'عدن', name: 'عدن' },
    { id: 'تعز', name: 'تعز' },
    { id: 'المكلا', name: 'المكلا' },
    { id: 'إب', name: 'إب' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col font-cairo" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ffffff' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l10.99-6.35L25 17.9v12.7L13.99 36.95 3 30.6V17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.31zM28 15l-12.98-7.5V0h2v6.35L28 12.69v2.3zm0 18.5l-12.98 7.5v8h2v-6.85l12.98-7.5v-2.31z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="container relative z-10 px-4 md:px-8 mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 backdrop-blur-xl border-r-4 border-primary text-primary text-[11px] font-black uppercase tracking-[0.2em] mx-auto rounded-sm shadow-2xl shadow-primary/5">
              نخبة المعارض المعتمدة
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg">
              شركاء <span className="text-primary">إيوان</span> للفخامة
            </h1>
            <p className="text-base md:text-xl text-gray-300 font-medium max-w-xl mx-auto opacity-80 leading-relaxed">
              تصفح معارض الأثاث الكبرى التي توفر لك الجودة والضمان في مكان واحد.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-12 px-4 md:px-8 flex-1">
        <div className="space-y-12">
          
          {/* Horizontal Top Filter Bar */}
          <div className="bg-white p-6 md:p-8 rounded-[20px] border border-border/50 shadow-sm space-y-6">
             <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                
                {/* Search - Growable */}
                <div className="w-full lg:flex-1 relative group">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="ابحث عن معرض أثاث بالاسم..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-12 h-14 bg-gray-50 border-none shadow-inner rounded-xl font-bold text-lg focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>

                {/* Filters and Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                  <div className="w-full sm:w-56">
                    <Select value={cityFilter} onValueChange={setCityFilter}>
                      <SelectTrigger className="h-14 rounded-xl border-none bg-gray-50 font-bold px-6 shadow-inner focus:ring-2 focus:ring-primary/20">
                        <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-primary" />
                           <SelectValue placeholder="تصفية حسب المدينة" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-none shadow-2xl font-cairo" dir="rtl">
                        {cities.map(city => (
                          <SelectItem key={city.id} value={city.id} className="font-bold py-3">{city.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Link href="/register" className="w-full sm:w-auto">
                    <Button className="w-full h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-base shadow-lg shadow-primary/20 gap-3 transition-transform hover:-translate-y-1">
                      <Plus className="w-5 h-5" /> سجل معرضك الآن
                    </Button>
                  </Link>
                </div>
             </div>

             {/* Stats Counter */}
             <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2 text-sm font-black text-secondary">
                   <Store className="w-4 h-4 text-primary" />
                   تم العثور على {displayedStores.length.toLocaleString('en-US')} معرض معتمد
                </div>
             </div>
          </div>

          {/* Stores Listing Grid */}
          <div className="space-y-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[450px] bg-white rounded-[20px] animate-pulse shadow-sm" />
                ))}
              </div>
            ) : displayedStores.length === 0 ? (
               <div className="py-32 text-center space-y-6 bg-white rounded-[20px] border-2 border-dashed border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                     <Search className="w-10 h-10 text-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-black text-secondary">لا توجد نتائج تطابق بحثك</p>
                    <p className="text-muted-foreground font-bold">جرب تغيير المدينة أو مسح نص البحث.</p>
                  </div>
                  <Button variant="outline" onClick={() => { setSearchTerm(''); setCityFilter('all'); }} className="rounded-xl font-black h-12 px-8">إظهار كافة المتاجر</Button>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {displayedStores.map((store: any) => (
                  <Link 
                    href={`/vendors/${store.id}`}
                    key={store.id} 
                    className="group bg-white border border-border/40 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col rounded-[20px] transform hover:-translate-y-2"
                  >
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image 
                        src={store.cover_url || `https://picsum.photos/seed/${store.id}/800/400`} 
                        alt={store.business_name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent" />
                      
                      <div className="absolute bottom-4 right-6 left-6 flex items-center gap-4">
                        <div className="w-16 h-16 bg-white p-1 shadow-2xl relative overflow-hidden rounded-xl shrink-0 border-2 border-white/20">
                          <Image 
                            src={store.logo_url || `https://picsum.photos/seed/${store.id}-logo/200/200`}
                            alt="Logo"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-white space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-xl tracking-tight leading-none">{store.business_name}</h4>
                            <CheckCircle2 className="w-5 h-5 text-primary fill-white" />
                          </div>
                          <Badge variant="outline" className="bg-white/10 text-[10px] text-white border-white/20 font-bold uppercase py-0 px-2 rounded-md">
                            شريك معتمد
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-sm text-secondary font-black border-none px-3 py-1.5 flex items-center gap-1.5 shadow-xl rounded-lg">
                          <Star className="w-4 h-4 text-amber-500 fill-current" />
                          {store.average_rating ? store.average_rating.toLocaleString('en-US') : '5.0'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col space-y-6">
                      <p className="text-[15px] text-muted-foreground leading-relaxed font-medium line-clamp-3 italic">
                        "{store.description || 'يقدم هذا المعرض أفخر أنواع الأثاث المنزلي والديكورات العصرية بجودة عالية وضمان معتمد.'}"
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                        <div className="flex items-center gap-2 text-secondary font-black text-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                             <MapPin className="w-4 h-4" />
                          </div>
                          {store.city}
                        </div>
                        <Button variant="ghost" size="sm" className="h-11 font-black text-primary hover:bg-primary/5 transition-all rounded-xl gap-2 group/btn">
                          زيارة المعرض 
                          <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
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
