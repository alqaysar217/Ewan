'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  ShoppingBag, 
  Settings, 
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  
  // جلب وثيقة المستخدم للتحقق من الدور (Role) مع تثبيت المرجع
  const userDocRef = useMemo(() => user ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: userData, loading: docLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  if (userLoading || docLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold">جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  // التحقق من أن المستخدم هو مسؤول بالفعل
  if (userData?.role !== 'admin') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-secondary mb-2">وصول مرفوض</h1>
        <p className="text-muted-foreground mb-6 max-w-md">عذراً، هذه المنطقة مخصصة لإدارة المنصة فقط. يرجى العودة للصفحة الرئيسية أو تسجيل الدخول بحساب مسؤول.</p>
        <Button onClick={() => router.push('/')} className="rounded-xl px-8">العودة للرئيسية</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-secondary text-white hidden lg:flex flex-col border-l border-white/5">
        <div className="p-8 flex items-center gap-3">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-lg shadow-primary/20 bg-white">
            <Image 
              src="/logo.png" 
              alt="إيوان" 
              fill 
              className="object-contain p-1"
            />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">إيوان للإدارة</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Button variant="ghost" className="w-full justify-start gap-4 h-14 bg-white/10 text-white rounded-2xl px-6">
            <LayoutDashboard className="w-5 h-5 text-primary" /> ملخص النظام
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-4 h-14 text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl px-6">
            <Users className="w-5 h-5" /> إدارة المستخدمين
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-4 h-14 text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl px-6">
            <Store className="w-5 h-5" /> طلبات المتاجر
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-4 h-14 text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl px-6">
            <Package className="w-5 h-5" /> إدارة الكتالوج
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-4 h-14 text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl px-6">
            <ShoppingBag className="w-5 h-5" /> المبيعات والطلبات
          </Button>
          <div className="pt-8 pb-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">الإعدادات</div>
          <Button variant="ghost" className="w-full justify-start gap-4 h-14 text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl px-6">
            <Settings className="w-5 h-5" /> إعدادات المنصة
          </Button>
        </nav>

        <div className="p-6 mt-auto">
           <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xs text-gray-400 mb-1">المسؤول الحالي</p>
              <p className="text-sm font-bold truncate">{user?.email}</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-24 bg-white border-b border-border/50 flex items-center justify-between px-10">
          <div>
            <h1 className="text-2xl font-extrabold text-secondary">لوحة التحكم الشاملة</h1>
            <p className="text-sm text-muted-foreground mt-1">مرحباً بك مجدداً في نظام إدارة إيوان الذكي</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-xl h-12 px-6 border-primary text-primary hover:bg-primary/5" onClick={() => router.push('/')}>
              معاينة الموقع
            </Button>
            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-secondary/10">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'إجمالي المستخدمين', value: '١,٢٥٤', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'المتاجر المفعلة', value: '٨٤', icon: Store, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'طلبات الشراء', value: '٣٤٢', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'أرباح الشهر (SAR)', value: '٤٥,٢٠٠', icon: TrendingUp, color: 'text-secondary', bg: 'bg-secondary/10' },
            ].map((stat, i) => (
              <Card key={i} className="rounded-[2rem] border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardContent className="p-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-muted-foreground mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-black text-secondary">{stat.value}</h3>
                  </div>
                  <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Card className="lg:col-span-2 rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-gray-50">
                <div>
                  <CardTitle className="text-xl font-black text-secondary">المنتجات المضافة حديثاً</CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">آخر قطع الأثاث التي تم رفعها للمراجعة من قبل التجار</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5 px-4 rounded-xl">عرض الكتالوج</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow className="border-none">
                      <TableHead className="text-right h-14 font-bold text-secondary px-8">المنتج</TableHead>
                      <TableHead className="text-right h-14 font-bold text-secondary">التاجر</TableHead>
                      <TableHead className="text-right h-14 font-bold text-secondary">السعر</TableHead>
                      <TableHead className="text-right h-14 font-bold text-secondary">الحالة</TableHead>
                      <TableHead className="text-left h-14 font-bold text-secondary px-8">الإجراء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                      <TableCell className="font-bold px-8">طاولة طعام خشبية</TableCell>
                      <TableCell>أثاث الخليج</TableCell>
                      <TableCell>١,٥٠٠ SAR</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 font-bold px-3 py-1">قيد المراجعة</Badge>
                      </TableCell>
                      <TableCell className="text-left px-8">
                        <Button variant="ghost" size="sm" className="font-bold text-primary">مراجعة</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                      <TableCell className="font-bold px-8">أريكة مخملية زرقاء</TableCell>
                      <TableCell>متجر الأناقة</TableCell>
                      <TableCell>٢,٨٠٠ SAR</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 font-bold px-3 py-1">مفعل</Badge>
                      </TableCell>
                      <TableCell className="text-left px-8">
                        <Button variant="ghost" size="sm" className="font-bold text-primary">تعديل</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="p-8 text-center bg-gray-50/30">
                  <p className="text-sm text-muted-foreground">يتم تحديث هذه القائمة تلقائياً عند إضافة منتجات جديدة.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-gray-50">
                <CardTitle className="text-xl font-black text-secondary">طلبات انضمام التجار</CardTitle>
                <CardDescription className="text-muted-foreground">متاجر ونجارين جدد يرغبون بالانضمام</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {[
                  { name: 'نجارة الشرق', time: 'منذ ٢ ساعة', icon: 'ن' },
                  { name: 'تصاميم مودرن', time: 'منذ ٥ ساعات', icon: 'ت' },
                  { name: 'ورشة الابتكار', time: 'منذ يوم', icon: 'و' }
                ].map((vendor, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-[#F4F6F5] rounded-[1.5rem] hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-secondary text-lg shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                        {vendor.icon}
                      </div>
                      <div>
                        <p className="text-sm font-black text-secondary">{vendor.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{vendor.time}</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10 rounded-xl">
                      <ArrowUpRight className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
                <Button className="w-full h-14 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-bold text-lg mt-4 shadow-xl shadow-secondary/20">
                  عرض جميع الطلبات المعلقة
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
