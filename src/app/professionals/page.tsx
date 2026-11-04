'use client';

import { useState } from 'react';
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
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const MOCK_PROFESSIONALS = [
  {
    id: 'p1',
    business_name: 'ورشة إتقان للنجارة',
    business_type: 'carpenter',
    description: 'متخصصون في صناعة غرف النوم والدواوين الخشبية الفاخرة بجودة يمنية أصيلة وأخشاب زان طبيعية.',
    city: 'صنعاء، التحرير',
    average_rating: 4.9,
    service_areas: ['صنعاء', 'ذمار', 'إب'],
    cover_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=800',
    logo_url: 'https://picsum.photos/seed/p1/200/200',
    approval_status: 'approved'
  },
  {
    id: 'p2',
    business_name: 'تصاميم رؤية للديكور',
    business_type: 'interior_designer',
    description: 'نحول مساحات منزلك إلى لوحات فنية بلمسات عصرية وأسعار تنافسية. متخصصون في الديكورات المودرن.',
    city: 'عدن، المنصورة',
    average_rating: 4.8,
    service_areas: ['عدن', 'لحج', 'أبين'],
    cover_url: 'https://images.unsplash.com/photo-1554232456-8727aae0cfa4?auto=format&fit=crop&q=80&w=800',
    logo_url: 'https://picsum.photos/seed/p2/200/200',
    approval_status: 'approved'
  },
  {
    id: 'p3',
    business_name: 'نجار اليمن الحديث',
    business_type: 'carpenter',
    description: 'خبرة 15 عاماً في تفصيل المطابخ الخشبية والخزائن الحائطية بأحدث التصاميم العالمية.',
    city: 'تعز، بئر باشا',
    average_rating: 4.6,
    service_areas: ['تعز', 'إب'],
    cover_url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800',
    logo_url: 'https://picsum.photos/seed/p3/200/200',
    approval_status: 'approved'
  },
  {
    id: 'p4',
    business_name: 'إبداع للتصميم الداخلي',
    business_type: 'interior_designer',
    description: 'متخصصون في التصميم ثلاثي الأبعاد وتوزيع الإضاءة والأثاث لخلق بيئة مريحة وجذابة.',
    city: 'حضرموت، المكلا',
    average_rating: 5.0,
    service_areas: ['المكلا', 'سيئون'],
    cover_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    logo_url: 'https://picsum.photos/seed/p4/200/200',
    approval_status: 'approved'
  },
  {
    id: 'p5',
    business_name: 'ورشة النجارة المتميزة',
    business_type: 'carpenter',
    description: 'نصنع أثاثك بمواصفاتك الخاصة. نستخدم أجود أنواع الأخشاب المحلية والمستوردة.',
    city: 'إب، المحمول',
    average_rating: 4.7,
    service_areas: ['إب', 'تعز'],
    cover_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
    logo_url: 'https://picsum.photos/seed/p5/200/200',
    approval_status: 'approved'
  },
  {
    id: 'p6',
    business_name: 'فنون الديكور الحضرمي',
    business_type: 'interior_designer',
    description: 'دمج التراث الحضرمي الأصيل مع الحداثة في ديكورات المنازل والمجالس العربية.',
    city: 'حضرموت، سيئون',
    average_rating: 4.9,
    service_areas: ['سيئون', 'تريم'],
    cover_url: 'https://images.unsplash.com/photo-1513519247388-193ad5139b36?auto=format&fit=crop&q=80&w=800',
    logo_url: 'https://picsum.photos/seed/p6/200/200',
    approval_status: 'approved'
  }
];

export default function ProfessionalsPage() {
  const db = useFirestore();
  const [activeType, setActiveType] = useState<string>('all');
  
  const vendorsQuery = activeType === 'all' 
    ? query(collection(db, 'vendors'), or(where('business_type', '==', 'carpenter'), where('business_type', '==', 'interior_designer')))
    : query(collection(db, 'vendors'), where('business_type', '==', activeType));
    
  const { data: firestoreVendors, loading } = useCollection(vendorsQuery);

  const displayedProfessionals = (firestoreVendors && firestoreVendors.length > 0) 
    ? firestoreVendors 
    : MOCK_PROFESSIONALS.filter(v => activeType === 'all' || v.business_type === activeType);

  const profTypes = [
    { id: 'all', name: 'الكل', icon: LayoutGrid },
    { id: 'carpenter', name: 'نجارين', icon: Hammer },
    { id: 'interior_designer', name: 'مصممين', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />

      <section className="relative py-16 bg-secondary overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
        <div className="container relative z-10 px-4 md:px-8 mx-auto">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border-r-4 border-primary text-primary text-xs font-black uppercase tracking-widest">
              نخبة النجارين والمصممين في اليمن
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
              تعرف على صُنّاع <span className="text-primary">الخدمة</span>
            </h1>
            <p className="text-lg text-gray-300 font-medium max-w-xl">
              نجمع لك أمهر الحرفيين ومصممي الديكور لتحويل رؤيتك إلى واقع ملموس.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-12 px-4 md:px-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <aside className="w-full lg:w-80 space-y-8">
            <div className="bg-white p-8 border border-border/50 shadow-sm space-y-8 rounded-[15px]">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-secondary flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" /> تصفية المتخصصين
                </h3>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="ابحث عن محترف..." 
                    className="pr-10 h-12 bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-md" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest">التخصص</h4>
                <div className="space-y-2">
                  {profTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setActiveType(type.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 text-sm font-bold transition-all rounded-md",
                        activeType === type.id 
                          ? "bg-primary/10 text-primary border-r-4 border-primary" 
                          : "text-secondary hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <type.icon className="w-4 h-4" />
                        <span>{type.name}</span>
                      </div>
                      <ChevronLeft className={cn("w-4 h-4 opacity-30", activeType === type.id && "opacity-100")} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <div className="p-6 bg-secondary text-white relative overflow-hidden group rounded-[15px]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45" />
                  <div className="relative z-10 space-y-4">
                    <Award className="w-8 h-8 text-primary" />
                    <h4 className="font-black text-lg leading-tight">هل تقدم خدمات نجارة أو ديكور؟</h4>
                    <Link href="/register" className="block">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-md">
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
                {activeType === 'all' ? 'جميع الحرفيين والمصممين' : profTypes.find(t => t.id === activeType)?.name}
                <span className="text-sm font-bold text-muted-foreground mr-3">({displayedProfessionals.length})</span>
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
                    className="group bg-white border border-border/50 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col rounded-[15px]"
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
