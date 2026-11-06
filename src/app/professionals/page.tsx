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
  Award,
  MessageSquare,
  Map,
  Layers,
  CircleDollarSign,
  Sparkles,
  ChevronDown,
  Loader2
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
    approval_status: 'approved',
    specialty: 'bedroom'
  }
];

export default function ProfessionalsPage() {
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [maxBudget, setMaxBudget] = useState([2000000]);
  
  const vendorsQuery = useMemo(() => {
    const coll = collection(db, 'vendors');
    return query(coll, or(where('business_type', '==', 'carpenter'), where('business_type', '==', 'interior_designer')));
  }, [db]);
    
  const { data: firestoreVendors, loading } = useCollection(vendorsQuery);

  const displayedProfessionals = useMemo(() => {
    const base = (firestoreVendors && firestoreVendors.length > 0) ? firestoreVendors : MOCK_PROFESSIONALS;
    return base.filter((prof: any) => {
      const matchesSearch = prof.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = activeType === 'all' || prof.business_type === activeType;
      const matchesCity = cityFilter === 'all' || prof.city === cityFilter;
      const matchesSpecialty = specialtyFilter === 'all' || prof.specialty === specialtyFilter;
      return matchesSearch && matchesType && matchesCity && matchesSpecialty;
    });
  }, [firestoreVendors, searchTerm, activeType, cityFilter, specialtyFilter]);

  const specialties = [
    { id: 'all', name: 'جميع التخصصات' },
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

  const resetFilters = () => {
    setSearchTerm('');
    setActiveType('all');
    setCityFilter('all');
    setSpecialtyFilter('all');
    setMaxBudget([2000000]);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col font-cairo" dir="rtl">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ffffff' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l10.99-6.35L25 17.9v12.7L13.99 36.95 3 30.6V17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.31zM28 15l-12.98-7.5V0h2v6.35L28 12.69v2.3zm0 18.5l-12.98 7.5v8h2v-6.85l12.98-7.5v-2.31z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <div className="container relative z-10 px-4 md:px-8 mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <Badge className="bg-primary/20 text-primary border-none px-4 py-1 font-black uppercase tracking-widest text-[10px]">نخبة الحرفيين والمصممين</Badge>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
              تعرف على صُنّاع <span className="text-primary">الإبداع</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 font-medium max-w-xl mx-auto">
              نجمع لك أمهر النجارين ومصممي الديكور في اليمن لتحويل خيالك إلى واقع.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-8 px-4 md:px-8 flex-1">
        <div className="space-y-10">
          
          {/* Top Horizontal Filter Bar */}
          <div className="bg-white p-4 md:p-6 rounded-[24px] border border-border/50 shadow-sm">
             <div className="flex flex-col gap-6">
                {/* Search Row */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="w-full lg:flex-1 relative group">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="ابحث عن خبير أو ورشة بالاسم..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-12 h-14 bg-gray-50 border-none shadow-inner rounded-xl font-bold text-base focus-visible:ring-2 focus-visible:ring-primary/20"
                    />
                  </div>
                  <Link href="/register">
                    <Button className="h-14 px-8 rounded-xl bg-secondary text-white font-black shadow-xl shadow-secondary/10 flex gap-2">
                       <Award className="w-5 h-5 text-primary" /> سجل كخبير الآن
                    </Button>
                  </Link>
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Experience Type */}
                  <Select value={activeType} onValueChange={setActiveType}>
                    <SelectTrigger className="h-12 rounded-xl border-none bg-gray-50 font-bold px-4 shadow-inner">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <SelectValue placeholder="نوع الخبرة" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="font-cairo" dir="rtl">
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="carpenter">نجارين</SelectItem>
                      <SelectItem value="interior_designer">مصممين</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* City Filter */}
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger className="h-12 rounded-xl border-none bg-gray-50 font-bold px-4 shadow-inner">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <SelectValue placeholder="المدينة" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="font-cairo" dir="rtl">
                      {cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  {/* Specialty Filter */}
                  <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                    <SelectTrigger className="h-12 rounded-xl border-none bg-gray-50 font-bold px-4 shadow-inner">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" />
                        <SelectValue placeholder="التخصص" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="font-cairo" dir="rtl">
                      {specialties.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  {/* Budget Filter */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-12 rounded-xl bg-gray-50 border-none px-4 font-bold shadow-inner flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <CircleDollarSign className="w-4 h-4 text-primary" />
                           <span>الميزانية</span>
                        </div>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-6 rounded-2xl border-none shadow-2xl font-cairo" dir="rtl">
                       <div className="space-y-6">
                         <h4 className="font-black text-secondary text-sm">حدد سقف الميزانية (ر.ي)</h4>
                         <Slider 
                           defaultValue={[2000000]} 
                           max={5000000} 
                           step={50000} 
                           value={maxBudget}
                           onValueChange={setMaxBudget}
                         />
                         <div className="flex items-center justify-between">
                           <span className="text-xs font-bold text-muted-foreground">0</span>
                           <span className="text-sm font-black text-primary">حتى {maxBudget[0].toLocaleString('en-US')}</span>
                         </div>
                       </div>
                    </PopoverContent>
                  </Popover>
                </div>
             </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-secondary">
                الخبراء المتاحون
                <span className="text-sm font-bold text-muted-foreground mr-3">({displayedProfessionals.length.toLocaleString('en-US')})</span>
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white animate-pulse rounded-[24px] shadow-sm" />)}
              </div>
            ) : displayedProfessionals.length === 0 ? (
               <div className="py-32 text-center space-y-6 bg-white rounded-[24px] border-2 border-dashed border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                     <Search className="w-10 h-10 text-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-black text-secondary">لم يتم العثور على خبراء</p>
                    <p className="text-muted-foreground font-bold">جرب تغيير معايير البحث أو تصفية المدن.</p>
                  </div>
                  <Button variant="outline" onClick={resetFilters} className="rounded-xl font-black h-12 px-8">إعادة تعيين كافة الفلاتر</Button>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {displayedProfessionals.map((prof: any) => (
                  <Link 
                    href={`/vendors/${prof.id}`}
                    key={prof.id} 
                    className="group bg-white border border-border/40 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col rounded-[24px] transform hover:-translate-y-2"
                  >
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image 
                        src={prof.cover_url || `https://picsum.photos/seed/${prof.id}/800/400`} 
                        alt={prof.business_name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent" />
                      
                      <div className="absolute bottom-4 right-6 left-6 flex items-center gap-4">
                        <div className="w-16 h-16 bg-white p-1 shadow-2xl relative overflow-hidden rounded-xl shrink-0 border-2 border-white/20">
                          <Image 
                            src={prof.logo_url || `https://picsum.photos/seed/${prof.id}-logo/200/200`}
                            alt="Logo"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-white space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-xl tracking-tight leading-none">{prof.business_name}</h4>
                            <CheckCircle2 className="w-5 h-5 text-primary fill-white" />
                          </div>
                          <Badge variant="outline" className="bg-white/10 text-[10px] text-white border-white/20 font-bold uppercase py-0 px-2 rounded-md">
                            {prof.business_type === 'carpenter' ? 'نجار معتمد' : 'مصمم ديكور'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 backdrop-blur-sm text-secondary font-black border-none px-3 py-1.5 flex items-center gap-1 shadow-xl rounded-lg">
                          <Star className="w-4 h-4 text-amber-500 fill-current" />
                          {prof.average_rating ? prof.average_rating.toLocaleString('en-US') : '5.0'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col space-y-6">
                      <p className="text-[15px] text-muted-foreground leading-relaxed font-medium line-clamp-3">
                        {prof.description || 'هذا الخبير يقدم خدمات احترافية موثقة من قبل منصة إيوان لضمان جودة التصنيع والتركيب.'}
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                        <div className="flex items-center gap-2 text-secondary font-black text-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                             <MapPin className="w-4 h-4" />
                          </div>
                          {prof.service_areas && prof.service_areas.length > 0 ? prof.service_areas[0] : prof.city || 'اليمن'}
                        </div>
                        <Button variant="ghost" size="sm" className="h-11 font-black text-primary hover:bg-primary/5 transition-all rounded-xl gap-2 group/btn">
                          طلب خدمة 
                          <MessageSquare className="w-4 h-4" />
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
