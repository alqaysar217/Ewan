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
  
  // Memoize query references to prevent infinite re-renders
  const usersQuery = useMemo(() => collection(db, 'users'), [db]);
  const vendorsQuery = useMemo(() => collection(db, 'vendors'), [db]);
  const productsQuery = useMemo(() => collection(db, 'products'), [db]);
  const ordersQuery = useMemo(() => collection(db, 'orders'), [db]);

  const { data: users, loading: usersLoading } = useCollection(usersQuery);
  const { data: vendors, loading: vendorsLoading } = useCollection(vendorsQuery);
  const { data: products, loading: productsLoading } = useCollection(productsQuery);
  const { data: orders, loading: ordersLoading } = useCollection(ordersQuery);

  const isLoading = usersLoading || vendorsLoading || productsLoading || ordersLoading;

  // معالجة الإحصائيات الأربع الرئيسية
  const stats = useMemo(() => {
    const totalUsers = users?.length || 0;
    const totalVendors = vendors?.length || 0;
    const totalProducts = products?.length || 0;
    const totalRevenue = orders?.reduce((acc, order: any) => acc + (Number(order.total) || 0), 0) || 0;

    return [
      { label: 'إجمالي المستخدمين', value: totalUsers.toLocaleString('ar-YE'), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'المتاجر والمهنيين', value: totalVendors.toLocaleString('ar-YE'), icon: Store, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'المنتجات المسجلة', value: totalProducts.toLocaleString('ar-YE'), icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'إجمالي الأرباح', value: totalRevenue.toLocaleString('ar-YE') + ' ر.ي', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    ];
  }, [users, vendors, products, orders]);

  // معالجة بيانات الرسم البياني (توزيع المبيعات حسب أيام الأسبوع)
  const chartData = useMemo(() => {
    const daysAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const salesByDay = daysAr.map(day => ({ name: day, sales: 0 }));

    if (orders && orders.length > 0) {
      orders.forEach((order: any) => {
        let date: Date;
        // التعامل مع تاريخ Firestore Timestamp أو سلسلة نصية
        if (order.created_at?.toDate) {
          date = order.created_at.toDate();
        } else if (order.created_at) {
          date = new Date(order.created_at);
        } else if (order.updated_at?.toDate) {
          date = order.updated_at.toDate();
        } else {
          date = new Date();
        }

        if (!isNaN(date.getTime())) {
          const dayIndex = date.getDay();
          salesByDay[dayIndex].sales += Number(order.total) || 0;
        }
      });
    }
    
    // إعادة ترتيب البيانات لتبدأ من السبت
    const saturday = salesByDay.pop();
    if (saturday) salesByDay.unshift(saturday);
    
    return salesByDay;
  }, [orders]);

  // استخراج أفضل المتاجر أداءً (بناءً على التقييم حالياً)
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
        <p className="font-black text-muted-foreground text-lg">جاري تحليل بيانات المنصة الحقيقية...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-cairo" dir="rtl">
      {/* شبكة الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-3xl border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="text-[9px] font-black text-muted-foreground/50 border-muted/20">بيانات مباشرة</Badge>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-black text-secondary mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* الرسم البياني للمبيعات */}
        <Card className="lg:col-span-2 rounded-3xl border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-secondary">نشاط المبيعات الأسبوعي</h3>
                <p className="text-xs text-muted-foreground font-bold">توزيع قيمة الطلبات المؤكدة عبر أيام الأسبوع</p>
              </div>
              <Activity className="text-primary w-6 h-6 opacity-20" />
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94a3b8' }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(22, 136, 153, 0.05)' }}
                    contentStyle={{ 
                      borderRadius: '15px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
                      fontFamily: 'inherit',
                      textAlign: 'right'
                    }}
                    formatter={(value: any) => [value.toLocaleString() + ' ر.ي', 'قيمة المبيعات']}
                  />
                  <Bar dataKey="sales" radius={[10, 10, 0, 0]} barSize={45}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#168899' : '#073D49'} fillOpacity={0.9} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* أفضل المتاجر والمهنيين */}
        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-secondary">الأعلى تقييماً</h3>
              <Link href="/admin/vendors" className="text-[10px] font-black text-primary hover:underline transition-all">إدارة الشركاء</Link>
            </div>
            <div className="space-y-6">
              {topVendors.length > 0 ? topVendors.map((v: any, i: number) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                    <Image 
                      src={v.logo_url || `https://picsum.photos/seed/${v.id}/100/100`} 
                      alt={v.business_name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-secondary truncate">{v.business_name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" /> {v.city}
                    </p>
                  </div>
                  <div className="text-amber-500 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-black">{(v.average_rating || 5.0).toLocaleString('en-US')}</span>
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center flex flex-col items-center gap-3">
                   <Store className="w-10 h-10 text-gray-100" />
                   <p className="text-xs text-muted-foreground font-bold italic">لا توجد بيانات متاجر بعد.</p>
                </div>
              )}
            </div>
            
            {topVendors.length > 0 && (
              <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed text-center">
                  يتم تحديث هذه القائمة تلقائياً بناءً على تقييمات العملاء الحقيقية.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
