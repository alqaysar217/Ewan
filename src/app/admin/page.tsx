'use client';

import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Store, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  ShoppingBag,
  Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const data = [
  { name: 'السبت', sales: 4000 },
  { name: 'الأحد', sales: 3000 },
  { name: 'الاثنين', sales: 2000 },
  { name: 'الثلاثاء', sales: 2780 },
  { name: 'الأربعاء', sales: 1890 },
  { name: 'الخميس', sales: 2390 },
  { name: 'الجمعة', sales: 3490 },
];

export default function AdminOverview() {
  const stats = [
    { label: 'إجمالي المستخدمين', value: '١,٢٥٤', growth: '+١٢٪', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'المتاجر المفعلة', value: '٨٤', growth: '+٥٪', icon: Store, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'طلبات الشراء', value: '٣٤٢', growth: '-٢٪', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'إجمالي الأرباح', value: '٤٥,٢٠٠ ر.ي', growth: '+١٨٪', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-3xl border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-black rounded-lg px-2 py-1",
                  stat.growth.startsWith('+') ? "text-emerald-600 bg-emerald-50" : "text-destructive bg-destructive/5"
                )}>
                  {stat.growth.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.growth}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-black text-secondary mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 rounded-3xl border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-secondary">إحصائيات المبيعات</h3>
                <p className="text-xs text-muted-foreground font-bold">معدل المبيعات خلال الأسبوع الأخير</p>
              </div>
              <Activity className="text-primary w-6 h-6 opacity-20" />
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94a3b8' }} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(22, 136, 153, 0.05)' }}
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontFamily: 'inherit' }}
                  />
                  <Bar dataKey="sales" fill="#168899" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Vendors */}
        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-8">
            <h3 className="text-xl font-black text-secondary mb-6">أفضل المتاجر أداءً</h3>
            <div className="space-y-6">
              {[
                { name: 'المعرض الملكي', sales: '١٥,٤٠٠', rating: 4.9, img: 'https://picsum.photos/seed/v1/100/100' },
                { name: 'أثاث الخليج', sales: '١٢,١٠٠', rating: 4.8, img: 'https://picsum.photos/seed/v2/100/100' },
                { name: 'مودرن هوم', sales: '٩,٨٠٠', rating: 4.7, img: 'https://picsum.photos/seed/v3/100/100' },
                { name: 'ورشة المكلا', sales: '٨,٢٠٠', rating: 4.6, img: 'https://picsum.photos/seed/v4/100/100' },
              ].map((v, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                    <Image src={v.img} alt={v.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-secondary">{v.name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold">{v.sales} ر.ي مبيعات</p>
                  </div>
                  <div className="text-amber-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs font-black">{v.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
