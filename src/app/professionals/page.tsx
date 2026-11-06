'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, or } from 'firebase/firestore';
import { 
  Users, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Hammer, 
  Palette,
  Search,
  Filter,
  ArrowLeft,
  LayoutGrid,
  ChevronLeft,
  Award,
  MessageSquare,
  Map,
  Layers,
  CircleDollarSign,
  Maximize2,
  Sparkles
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
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const MOCK_PROFESSIONALS = [
  {
    id: 'p1',
    business_name: 'ورشة إتقان للنجارة',
    business_type: 'carpenter',
    description: 'متخصصون في صناعة غرف النوم والدواوين الخشبية الفاخرة بجودة يمنية أصيلة وأخشاب زان طبيعية.',
    city: 'صنعاء',
    average_rating: 4.9,
    service_areas: ['صنعاء', 'ذمار', 'إب'],
    cover_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=800',
    logo_url: 'https://picsum.photos/seed/p1/200/200',
    approval_status: 'approved'
  }
];

export default function ProfessionalsPage() {
  const db = useFirestore();
  const [activeType, setActiveType] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState([500000]);
  
  const vendorsQuery = useMemo(() => {
    const coll = collection(db, 'vendors');
    return activeType === 'all' 
      ? query(coll, or(where('business_type', '==', 'carpenter'), where('business_type', '==', 'interior_designer')))
      : query(coll, where('business_type', '==', activeType));
  }, [db, activeType]);
    
  const { data: firestoreVendors, loading } = useCollection(vendorsQuery);

  const displayedProfessionals = (firestoreVendors && firestoreVendors.length > 0) 
    ? firestoreVendors 
    : MOCK_PROFESSIONALS.filter(v => activeType === 'all' || v.business_type === activeType);

  const specialties = [
    { id: 'living', name: 'غرف المعيشة' },
    { id: 'bedroom', name: 'غرف النوم' },
    { id: 'kitchen', name: 'المطابخ' },
    { id: 'majlis', name: 'المجالس العربية' },
    { id: 'office', name: 'المكاتب' }
  ];

  const cities = [
    { id: 'all', name: 'جميع المدن' },
    { id: 'صنعاء', name: 'صنعاء' },
    { id: 'عدن', name: 'عدن' },
    { id: 'تعز', name: 'تعز' },
    { id: 'المكلا', name: 'المكلا' },
    { id: 'إب', name: 'إب' }
  ];

  const styles = [
    { id: 'modern', name: 'حديث / مودرن' },
    { id: 'traditional', name: 'تراثي يمني' },
    { id: 'classic', name: 'كلاسيك' },
    { id: 'minimalist', name: 'مينمليست' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />

      <section className="relative py-12 md:py-16 bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ffffff' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l10.99-6.35L25 17.9v12.7L13.99 36.95 3 30.6V17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.31zM28 15l-12.98-7.5V0h2v6.35L28 12.69v2.3zm0 18.5l-12.98 7.5v8h2v-6.85l12.98-7.5v-2.31z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="container relative z-10 px-4 md:px-8 mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 backdrop-blur-xl border-r-4 border-primary text-primary text-[10px] font-black uppercase tracking-[0.2em] mx-auto rounded-sm">
              نخبة النجارين والمصممين في اليمن
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              تعرف على صُنّاع <span className="text-primary">الإبداع</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 font-medium max-w-xl mx-auto">
              نجمع لك أمهر الحرفيين ومصممي الديكور لتحويل مساحتك إلى واقع ملموس.
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
                    <Filter className="w-4 h-4 text-primary" /> تصفية الخبراء
                  </h3>
                </div>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="ابحث عن خبير..." 
                    className="pr-10 h-12 bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-md" 
                  />
                </div>
              </div>

              <Accordion type="multiple" defaultValue={["type", "cities", "specialties"]} className="w-full">
                <AccordionItem value="type" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-bold text-secondary flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" /> نوع الخبرة
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {[
                        { id: 'all', name: 'الكل' },
                        { id: 'carpenter', name: 'نجارين' },
                        { id: 'interior_designer', name: 'مصممين' }
                      ].map((t) => (
                        <div key={t.id} className="flex items-center space-x-2 space-x-reverse group cursor-pointer" onClick={() => setActiveType(t.id)}>
                          <Checkbox id={`type-${t.id}`} checked={activeType === t.id} className="rounded-sm" />
                          <label htmlFor={`type-${t.id}`} className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer pr-2">
                            {t.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cities" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-bold text-secondary flex items-center gap-2 text-sm">
                      <Map className="w-4 h-4 text-primary" /> المدينة
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {cities.map((city) => (
                        <div key={city.id} className="flex items-center space-x-2 space-x-reverse group cursor-pointer">
                          <Checkbox id={`city-${city.id}`} className="rounded-sm" />
                          <label htmlFor={`city-${city.id}`} className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer pr-2">
                            {city.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="specialties" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-bold text-secondary flex items-center gap-2 text-sm">
                      <Layers className="w-4 h-4 text-primary" /> التخصص
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {specialties.map((spec) => (
                        <div key={spec.id} className="flex items-center space-x-2 space-x-reverse group cursor-pointer">
                          <Checkbox id={`spec-${spec.id}`} className="rounded-sm" />
                          <label htmlFor={`spec-${spec.id}`} className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer pr-2">
                            {spec.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="budget" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="font-bold text-secondary flex items-center gap-2 text-sm">
                      <CircleDollarSign className="w-4 h-4 text-primary" /> نطاق الميزانية (ر.ي)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-6 px-2 space-y-6">
                      <Slider 
                        defaultValue={[500000]} 
                        max={2000000} 
                        step={10000} 
                        value={maxBudget}
                        onValueChange={setMaxBudget}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground">٠</span>
                        <span className="text-xs font-black text-primary">حتى {maxBudget[0].toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="pt-6">
                <div className="p-6 bg-secondary text-white relative overflow-hidden group rounded-[15px]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45 transition-transform group-hover:scale-110" />
                  <div className="relative z-10 space-y-4">
                    <Award className="w-8 h-8 text-primary" />
                    <h4 className="font-black text-lg leading-tight">هل تقدم خدمات نجارة أو ديكور؟</h4>
                    <Link href="/register" className="block">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-md shadow-lg shadow-primary/20">
                        سجل كخبير الآن
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
                {activeType === 'all' ? 'جميع الخبراء' : activeType === 'carpenter' ? 'النجارين' : 'المصممين'}
                <span className="text-sm font-bold text-muted-foreground mr-3">({displayedProfessionals.length.toLocaleString('en-US')})</span>
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
                {displayedProfessionals.map((prof: any) => (
                  <Link 
                    href={`/vendors/${prof.id}`}
                    key={prof.id} 
                    className="group bg-gray-50 border border-border/50 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col rounded-[15px]"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image 
                        src={prof.cover_url || `https://picsum.photos/seed/${prof.id}/800/400`} 
                        alt={prof.business_name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                      
                      <div className="absolute bottom-4 right-4 flex items-center gap-3">
                        <div className="w-14 h-14 bg-white p-1 shadow-xl relative overflow-hidden rounded-md">
                          <Image 
                            src={prof.logo_url || `https://picsum.photos/seed/${prof.id}-logo/200/200`}
                            alt="Logo"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-white">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-black text-lg">{prof.business_name}</h4>
                            <CheckCircle2 className="w-4 h-4 text-primary fill-white" />
                          </div>
                          <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-[10px] uppercase">
                            {prof.business_type === 'carpenter' ? 'نجار معتمد' : 'مصمم ديكور'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-sm text-secondary font-black border-none px-2 py-1 flex items-center gap-1 shadow-lg rounded-md">
                          <Star className="w-3 h-3 text-amber-500 fill-current" />
                          {prof.average_rating ? prof.average_rating.toLocaleString('en-US') : '5.0'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-2">
                        {prof.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {prof.city}
                        </div>
                        <Button variant="outline" size="sm" className="h-10 font-bold border-secondary/10 hover:bg-secondary hover:text-white transition-all rounded-md">
                          طلب خدمة 
                          <MessageSquare className="w-4 h-4 mr-2" />
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
