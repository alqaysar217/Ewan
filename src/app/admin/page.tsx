'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Store, 
  TrendingUp, 
  Activity,
  Package,
  Loader2,
  Star,
  ShoppingBag
} from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
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
        label: 'المنتجات المسجلة', 
        value: totalProducts.toLocaleString('en-US'), 
        icon: Package, 
        color: 'text-amber-600', 
        bg: 'bg-amber-50' 
      },
      { 
        label: 'إجمالي الأرباح', 
        value: totalRevenue.toLocaleString('en-US') + ' ر.ي', 
        icon: TrendingUp, 
        color: 'text-primary', 
        bg: 'bg-primary/10' 
      },
    ];
  }, [users, vendors, products, orders]);

  const chartData = useMemo(() => {
    const daysAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const salesByDay = daysAr.map(day => ({ name: day, sales: 0 }));

    if (orders && orders.length > 0) {
      orders.forEach((order: any) => {
        let date: Date;
        if (order.created_at?.toDate) {
          date = order.created_at.toDate();
        } else if (order.created_at) {
          date = new Date(order.created_at);
        } else {
          date = new Date();
        }

        if (!isNaN(date.getTime())) {
          const dayIndex = date.getDay();
          salesByDay[dayIndex].sales += Number(order.total) || 0;
        }
      });
    }
    
    const saturday = salesByDay.pop();
    if (saturday) salesByDay.unshift(saturday);
    
    return salesByDay;
  }, [orders]);

  const topVendors = useMemo(() => {
    if (!vendors) return [];
    return [...vendors]
      .sort((a: any, b: any) => (b.average_rating || 0) - (a.average_rating || 0))
      .slice(0, 5);
  }, [vendors]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6 font-cairo" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="font-black text-muted-foreground text-lg">جاري تحليل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 font-cairo" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-[2rem] border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white group border border-transparent hover:border-primary/10">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner", stat.bg, stat.color)}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-wider bg-gray-50 text-gray-400 border-none">Live</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground">{stat.label}</p>
                <h3 className="text-3xl font-black text-secondary tracking-tight">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-secondary">النشاط التجاري الأسبوعي</h3>
                <p className="text-sm text-muted-foreground font-bold mt-1">توزيع قيمة المبيعات الحقيقية بالريال اليمني</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                <Activity className="text-primary w-6 h-6" />
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 13, fontWeight: 'bold', fill: '#64748b' }} 
                    dy={15}
                  />
                  <YAxis hide />
                  <Tooltip 
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
                  <Bar dataKey="sales" radius={[12, 12, 12, 12]} barSize={50}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#168899' : '#073D49'} fillOpacity={0.9} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-secondary">الأكثر تميزاً</h3>
              <Link href="/admin/vendors" className="text-xs font-black text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all">الكل</Link>
            </div>
            <div className="space-y-8">
              {topVendors.length > 0 ? topVendors.map((v: any, i: number) => (
                <div key={i} className="flex items-center gap-5 group cursor-default">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 shrink-0">
                    <Image 
                      src={v.logo_url || `https://picsum.photos/seed/${v.id}/150/150`} 
                      alt={v.business_name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-secondary truncate">{v.business_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-primary opacity-60" />
                      <span className="text-xs text-muted-foreground font-bold">{v.city}</span>
                    </div>
                  </div>
                  <div className="text-amber-500 flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-black">{(v.average_rating || 5.0).toLocaleString('en-US')}</span>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center flex flex-col items-center gap-4 opacity-30">
                   <Store className="w-16 h-16 text-gray-300" />
                   <p className="text-sm font-bold italic">لا توجد بيانات شركاء.</p>
                </div>
              )}
            </div>
            
            <div className="mt-10 p-6 bg-secondary/5 rounded-3xl border border-dashed border-secondary/10">
              <p className="text-[11px] text-muted-foreground font-bold leading-relaxed text-center italic">
                * يتم تحديث هذه البيانات ديناميكياً بناءً على تقييمات العملاء والأرقام المسجلة في النظام.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
