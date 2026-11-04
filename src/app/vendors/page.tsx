'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { 
  Users, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Hammer, 
  Palette,
  ArrowLeft,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';

export default function VendorsPage() {
  const db = useFirestore();
  const vendorsQuery = collection(db, 'vendors');
  const { data: vendors, loading } = useCollection(vendorsQuery);

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-secondary text-white py-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black">المبدعون والنجارون</h1>
              <p className="text-gray-300 max-w-2xl text-lg font-medium">
                تصفح قائمة بأمهر الحرفيين ومصممي الديكور المعتمدين في اليمن.
              </p>
            </div>
            <div className="flex gap-4">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-md">
                انضم إلينا كتاجر
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto py-12 px-4 flex-1">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-md shadow-sm border border-border/50 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="ابحث عن نجار أو متجر..." 
              className="w-full h-12 pr-12 pl-4 bg-gray-50 border-none rounded-md text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none h-12 rounded-md gap-2 font-bold border-border/60">
              <Filter className="w-4 h-4" /> تصفية
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none h-12 rounded-md gap-2 font-bold border-border/60">
              <MapPin className="w-4 h-4" /> كل المدن
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-md" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {vendors?.map((vendor: any) => (
              <div key={vendor.id} className="bg-white rounded-md shadow-sm border border-border/50 group hover:shadow-xl transition-all overflow-hidden flex flex-col">
                <div className="relative h-56 w-full">
                  <Image 
                    src={vendor.logo_url || `https://picsum.photos/seed/${vendor.id}/600/400`} 
                    alt={vendor.business_name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    data-ai-hint="carpentry workshop" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-md shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                    <span className="text-[10px] font-black">{vendor.average_rating || '5.0'}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-primary text-white font-bold rounded-md px-3 py-1">
                      {vendor.business_type === 'carpenter' ? 'نجارة يدوية' : 'تصميم داخلي'}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-black text-secondary">{vendor.business_name}</h4>
                      <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
                    </div>
                    <p className="text-xs text-muted-foreground font-bold">عضو منذ 2024</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {vendor.description || 'نحن نقدم أفضل خدمات التصميم والتنفيذ بجودة عالية وأسعار تنافسية تناسب الجميع.'}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold pt-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {vendor.city || 'اليمن'}
                  </div>
                  <div className="pt-4 mt-auto">
                    <Button variant="outline" className="w-full rounded-md border-secondary/20 hover:bg-secondary hover:text-white font-bold transition-all h-12">
                      عرض الملف الشخصي والمنتجات
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
