'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
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
  Store,
  LayoutGrid,
  ChevronLeft,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

// البيانات الافتراضية للمتاجر والورش
const MOCK_VENDORS = [
  {
    id: 'v1',
    business_name: 'ورشة إتقان للنجارة',
    business_type: 'carpenter',
    description: 'متخصصون في صناعة غرف النوم والدواوين الخشبية الفاخرة بجودة يمنية أصيلة وأخشاب زان طبيعية.',
    city: 'صنعاء، التحرير',
    average_rating: 4.9,
    service_areas: ['صنعاء', 'ذمار', 'إب'],
    cover_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=800',
    logo_url: 'https://picsum.photos/seed/v1/200/200',
    approval_status: 'approved'
  },
  {
    id: 'v2',
    business_name: 'تصاميم رؤية للديكور',
    business_type: 'interior_designer',
    description: 'نحول مساحات منزلك إلى لوحات فنية بلمسات عصرية وأسعار تنافسية. متخصصون في الديكورات المودرن.',
    city: 'عدن، المنصورة',
    average_rating: 4.8,
    service_areas: ['عدن', 'لحج', 'أبين'],
    cover_url: 'https://images.unsplash.com/photo-1554232456-8727aae0cfa4?auto=format&fit=crop&q=80&w=800',
    logo_url: 'https://picsum.photos/seed/v2/200/200',
    approval_status: 'approved'
  },
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
  {
    id: 'v4',
    business_name: 'مودرن هوم للأثاث',
    business_type: 'furniture_store',
    description: 'نقدم حلول أثاث مبتكرة تناسب المساحات الصغيرة وتجمع بين الأناقة والعملية بأسعار مدروسة.',
    city: 'تعز، الحوبان',
    average_rating: 4.7,
    service_areas: ['تعز', 'إب'],
    cover_url: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=800',
    logo_url: 'https://picsum.photos/seed/v4/200/200',
    approval_status: 'approved'
  },
  {
    id: 'v5',
    business_name: 'أثاث الخليج المتميز',
    business_type: 'furniture_store',
    description: 'استيراد وتصنيع أرقى أطقم الكنب والمجالس العربية بأحدث التصاميم العالمية وأقمشة فاخرة.',
    city: 'صنعاء، حدة',
    average_rating: 4.9,
    service_areas: ['صنعاء', 'عدن'],
    cover_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    logo_url: 'https://picsum.photos/seed/v5/200/200',
    approval_status: 'approved'
  },
  {
    id: 'v6',
    business_name: 'نجارة السعادة',
    business_type: 'carpenter',
    description: 'خبرة أكثر من 20 عاماً في صناعة غرف النوم والأسرة الخشبية المتينة بتصاميم كلاسيكية ومودرن.',
    city: 'إب، الظهار',
    average_rating: 4.6,
    service_areas: ['إب', 'تعز'],
    cover_url: 'https://images.unsplash.com/photo-1544450610-ad597ea31c9d?auto=format&fit=crop&q=80&w=800',
    logo_url: 'https://picsum.photos/seed/v6/200/200',
    approval_status: 'approved'
  }
];

export default function VendorsPage() {
  const db = useFirestore();
  const [activeType, setActiveType] = useState<string>('all');
  
  const vendorsQuery = activeType === 'all' 
    ? collection(db, 'vendors') 
    : query(collection(db, 'vendors'), where('business_type', '==', activeType));
    
  const { data: firestoreVendors, loading } = useCollection(vendorsQuery);

  // دمج البيانات الحقيقية مع الافتراضية إذا كانت قاعدة البيانات فارغة
  const displayedVendors = (firestoreVendors && firestoreVendors.length > 0) 
    ? firestoreVendors 
    : MOCK_VENDORS.filter(v => activeType === 'all' || v.business_type === activeType);

  const vendorTypes = [
    { id: 'all', name: 'الكل', icon: LayoutGrid },
    { id: 'carpenter', name: 'نجارين', icon: Hammer },
    { id: 'furniture_store', name: 'متاجر أثاث', icon: Store },
    { id: 'interior_designer', name: 'مصممين', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 bg-secondary overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border-r-4 border-primary text-primary text-xs font-black uppercase tracking-widest">
              نخبة المبدعين في اليمن
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              تعرف على صُنّاع <span className="text-primary">الجمال</span>
            </h1>
            <p className="text-lg text-gray-300 font-medium max-w-xl">
              نجمع لك أمهر الحرفيين ومصممي الديكور والمتاجر الكبرى في منصة واحدة، لنضمن لك جودة التنفيذ وروعة التصميم.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-12 px-4 flex-1">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-80 space-y-8">
            <div className="bg-white p-8 border border-border/50 shadow-sm space-y-8 rounded-lg">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-secondary flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" /> تصفية النتائج
                </h3>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="ابحث عن اسم..." 
                    className="pr-10 h-12 bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-primary" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest">نوع العمل</h4>
                <div className="space-y-2">
                  {vendorTypes.map((type) => (
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

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest">المدينة</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['صنعاء', 'عدن', 'تعز', 'المكلا'].map((city) => (
                    <Button key={city} variant="outline" size="sm" className="h-10 text-xs font-bold border-gray-200">
                      {city}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <div className="p-6 bg-secondary text-white relative overflow-hidden group rounded-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -translate-y-1/2 translate-x-1/2 rotate-45" />
                  <div className="relative z-10 space-y-4">
                    <Award className="w-8 h-8 text-primary" />
                    <h4 className="font-black text-lg leading-tight">هل أنت نجار أو مصمم؟</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">انضم إلى أكبر منصة أثاث في اليمن وابدأ بعرض إبداعاتك لآلاف العملاء.</p>
                    <Link href="/register" className="block">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11">
                        سجل متجرك الآن
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Vendors Grid */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-secondary">
                {activeType === 'all' ? 'جميع المبدعين' : vendorTypes.find(t => t.id === activeType)?.name}
                <span className="text-sm font-bold text-muted-foreground mr-3">({displayedVendors.length})</span>
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : displayedVendors.length === 0 ? (
              <div className="py-24 text-center space-y-4 bg-white border border-dashed border-gray-200 rounded-lg">
                <Users className="w-16 h-16 text-gray-200 mx-auto" />
                <h3 className="text-xl font-bold text-secondary">لا يوجد مبدعون في هذا القسم حالياً</h3>
                <p className="text-muted-foreground">كن أول من ينضم إلينا في هذا التصنيف!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayedVendors.map((vendor: any) => (
                  <div 
                    key={vendor.id} 
                    className="group bg-white border border-border/50 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col rounded-lg"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image 
                        src={vendor.cover_url || `https://picsum.photos/seed/${vendor.id}/800/400`} 
                        alt={vendor.business_name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700" 
                        data-ai-hint="carpentry workshop cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                      
                      <div className="absolute bottom-4 right-4 flex items-center gap-3">
                        <div className="w-14 h-14 bg-white p-1 shadow-xl relative overflow-hidden rounded-md">
                          <Image 
                            src={vendor.logo_url || `https://picsum.photos/seed/${vendor.id}-logo/200/200`}
                            alt="Logo"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-white">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-black text-lg">{vendor.business_name}</h4>
                            <CheckCircle2 className="w-4 h-4 text-primary fill-white" />
                          </div>
                          <p className="text-[10px] font-bold opacity-80">
                            {vendor.business_type === 'carpenter' ? 'ورشة نجارة' : 
                             vendor.business_type === 'furniture_store' ? 'معرض أثاث' : 
                             'مصمم ديكور'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-white/90 backdrop-blur-sm text-secondary font-black border-none px-2 py-1 flex items-center gap-1 shadow-lg rounded-md">
                          <Star className="w-3 h-3 text-amber-500 fill-current" />
                          {vendor.average_rating || '5.0'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-2">
                        {vendor.description || 'نحن نقدم أفضل خدمات التصميم والتنفيذ بجودة عالية وأسعار تنافسية تناسب الجميع، مع ضمان حقيقي على كافة المنتجات.'}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {vendor.city || 'اليمن'}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                          {vendor.service_areas?.length || 0} مناطق خدمة
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link href={`/vendors/${vendor.id}`}>
                          <Button variant="outline" className="w-full h-12 font-bold border-secondary/10 hover:bg-secondary hover:text-white transition-all group rounded-md">
                            زيارة المتجر 
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Partners/Success Stories CTA */}
      <section className="py-24 bg-gray-50 border-t border-border/50">
        <div className="container px-4 text-center space-y-8">
          <h2 className="text-3xl font-black text-secondary">هل تبحث عن تصميم مخصص؟</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
            تواصل مع خبرائنا مباشرة لمناقشة مشروعك الخاص والحصول على عروض أسعار تنافسية من أفضل النجارين في منطقتك.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
             <Button size="lg" className="h-14 px-10 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-md">
               تحدث مع مستشار تصميم
             </Button>
             <Link href="/ai-design">
               <Button size="lg" variant="outline" className="h-14 px-10 border-primary text-primary hover:bg-primary/5 font-bold rounded-md">
                 جرب الذكاء الاصطناعي
               </Button>
             </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
