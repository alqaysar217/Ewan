'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Store, 
  TrendingUp, 
  Package,
  Loader2,
  Star,
  ShoppingBag,
  PieChart as PieIcon,
  Smile
} from 'lucide-react';
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function AdminOverview() {
  const db = useFirestore();
  
  const usersQuery = useMemo(() => collection(db, 'users'), [db]);
  const vendorsQuery = useMemo(() => collection(db, 'vendors'), [db]);
  const productsQuery = useMemo(() => collection(db, 'products'), [db]);
  const ordersQuery = useMemo(() => collection(db, 'orders'), [db]);

  const { data: users, loading: usersLoading } = useCollection(usersQuery);
  const { data: vendors, loading: vendorsLoading } = useCollection(vendorsQuery);
  const { data: products, loading: productsLoading } = useCollection(productsQuery);
  const { data: orders, loading: ordersLoading } = useCollection(ordersQuery);

  const isLoading = usersLoading || vendorsLoading || productsLoading || ordersLoading;

  // إحصائيات عامة
  const stats = useMemo(() => {
    const totalUsers = users?.length || 0;
    const totalVendors = vendors?.length || 0;
    const totalProducts = products?.length || 0;
    const totalRevenue = orders?.reduce((acc, order: any) => acc + (Number(order.total) || 0), 0) || 0;

    return [
      { 
        label: 'إجمالي المستخدمين', 
        value: totalUsers.toLocaleString('en-US'), 
        icon: Users, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50' 
      },
      { 
        label: 'المتاجر والمهنيين', 
        value: totalVendors.toLocaleString('en-US'), 
        icon: Store, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50' 
      },
      { 
        label: 'المنتجات المعروضة', 
        value: totalProducts.toLocaleString('en-US'), 
        icon: Package, 
        color: 'text-amber-600', 
        bg: 'bg-amber-50' 
      },
      { 
        label: 'إجمالي الأرباح (ر.ي)', 
        value: totalRevenue.toLocaleString('en-US'), 
        icon: TrendingUp, 
        color: 'text-primary', 
        bg: 'bg-primary/10' 
      },
    ];
  }, [users, vendors, products, orders]);

  // بيانات مبيعات افتراضية (للنمو)
  const salesChartData = useMemo(() => {
    return [
      { name: 'السبت', sales: 120000 },
      { name: 'الأحد', sales: 150000 },
      { name: 'الاثنين', sales: 110000 },
      { name: 'الثلاثاء', sales: 240000 },
      { name: 'الأربعاء', sales: 190000 },
      { name: 'الخميس', sales: 320000 },
      { name: 'الجمعة', sales: 450000 },
    ];
  }, []);

  // توزيع مقدمي الخدمة
  const vendorDistribution = useMemo(() => {
    if (!vendors) return [];
    const counts = {
      furniture_store: 0,
      carpenter: 0,
      interior_designer: 0
    };
    vendors.forEach((v: any) => {
      if (v.business_type in counts) {
        counts[v.business_type as keyof typeof counts]++;
      }
    });
    return [
      { name: 'معارض أثاث', value: counts.furniture_store, color: '#168899' },
      { name: 'نجارين', value: counts.carpenter, color: '#073D49' },
      { name: 'مصممين', value: counts.interior_designer, color: '#F59E0B' },
    ].filter(item => item.value > 0);
  }, [vendors]);

  // رضا العملاء (متوسط التقييمات)
  const satisfactionRate = useMemo(() => {
    if (!vendors || vendors.length === 0) return 100;
    const total = vendors.reduce((acc, v: any) => acc + (v.average_rating || 5), 0);
    return ((total / vendors.length) / 5) * 100;
  }, [vendors]);

  const topVendors = useMemo(() => {
    if (!vendors) return [];
    return [...vendors]
      .sort((a: any, b: any) => (b.average_rating || 0) - (a.average_rating || 0))
      .slice(0, 4);
  }, [vendors]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6 font-cairo" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="font-black text-muted-foreground text-lg">جاري تحليل بيانات النظام...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 font-cairo" dir="rtl">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-[2rem] border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white group border border-transparent hover:border-primary/10">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner", stat.bg, stat.color)}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-wider bg-gray-50 text-gray-400 border-none">مباشر</Badge>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs font-bold text-muted-foreground">{stat.label}</p>
                <h3 className="text-3xl font-black text-secondary tracking-tight">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart (Default/Growth) */}
        <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="px-10 pt-10 pb-0">
             <div className="flex items-center justify-between">
                <div className="text-right">
                  <CardTitle className="text-2xl font-black text-secondary">توجه نمو المبيعات</CardTitle>
                  <p className="text-sm text-muted-foreground font-bold mt-1">توقعات النشاط الأسبوعي الافتراضية (ر.ي)</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-10">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesChartData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 13, fontWeight: 'bold', fill: '#64748b' }} 
                    dy={15}
                  />
                  <YAxis hide />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(22, 136, 153, 0.03)' }}
                    contentStyle={{ 
                      borderRadius: '20px', 
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', 
                      fontFamily: 'inherit',
                      textAlign: 'right',
                      padding: '15px'
                    }}
                    formatter={(value: any) => [value.toLocaleString('en-US') + ' ر.ي', 'المبيعات']}
                  />
                  <Bar dataKey="sales" radius={[10, 10, 10, 10]} barSize={45}>
                    {salesChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#168899' : '#073D49'} fillOpacity={0.9} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Satisfaction Metric */}
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-secondary text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rotate-45 -translate-y-16 translate-x-16" />
           <CardContent className="p-10 flex flex-col h-full justify-between relative z-10 text-right">
              <div className="space-y-4">
                 <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Smile className="w-10 h-10 text-primary" />
                 </div>
                 <h3 className="text-2xl font-black">مؤشر ثقة العملاء</h3>
                 <p className="text-white/60 text-sm font-medium leading-relaxed">الرضا العام بناءً على تقييمات المتاجر والعمليات الناجحة.</p>
              </div>
              <div className="mt-8 space-y-2">
                 <div className="flex justify-between items-end">
                    <span className="text-5xl font-black text-primary">{Math.round(satisfactionRate)}%</span>
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">ممتاز</span>
                 </div>
                 <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${satisfactionRate}%` }} />
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vendor Distribution (Pie Chart) */}
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
           <CardHeader className="px-10 pt-10 pb-0 text-right">
              <CardTitle className="text-xl font-black text-secondary flex items-center justify-end gap-3">
                 توزيع الخبرات في المنصة <PieIcon className="w-5 h-5 text-primary" />
              </CardTitle>
           </CardHeader>
           <CardContent className="p-10">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vendorDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {vendorDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                       contentStyle={{ borderRadius: '15px', border: 'none', shadow: 'xl', textAlign: 'right' }}
                    />
                    <Legend verticalAlign="bottom" align="center" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
           </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-10">
            <div className="flex items-center justify-between mb-10 text-right">
               <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <Star className="w-6 h-6 fill-current" />
               </div>
               <div className="text-right">
                 <h3 className="text-2xl font-black text-secondary">شركاء النخبة</h3>
                 <p className="text-sm text-muted-foreground font-bold">أكثر المتاجر موثوقية بناءً على آراء العملاء الحقيقية.</p>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topVendors.length > 0 ? topVendors.map((v: any, i: number) => (
                <div key={i} className="flex items-center gap-5 p-5 bg-gray-50 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl transition-all duration-500 cursor-default">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-white bg-white shrink-0">
                    <Image 
                      src={v.logo_url || `https://picsum.photos/seed/${v.id}/150/150`} 
                      alt={v.business_name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <p className="text-lg font-black text-secondary truncate">{v.business_name}</p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <span className="text-xs text-muted-foreground font-bold">{v.city}</span>
                      <ShoppingBag className="w-3.5 h-3.5 text-primary opacity-60" />
                    </div>
                  </div>
                  <div className="text-amber-500 flex flex-col items-center justify-center gap-0.5 bg-white w-14 h-14 rounded-2xl shadow-sm border border-amber-100">
                    <span className="text-lg font-black">{(v.average_rating || 5.0).toLocaleString('en-US')}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 opacity-30">
                   <Store className="w-16 h-16 text-gray-300" />
                   <p className="text-sm font-bold italic">لا توجد بيانات لشركاء حالياً.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Footnote */}
      <div className="p-6 bg-secondary/5 rounded-3xl border border-dashed border-secondary/10 flex items-center justify-center gap-4">
         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
            <TrendingUp className="w-5 h-5" />
         </div>
         <p className="text-[12px] text-muted-foreground font-bold leading-relaxed italic text-center">
           يتم جلب وتحليل كافة البيانات بأمان وبشكل فوري من البنية السحابية لإيوان.
         </p>
      </div>
    </div>
  );
}
