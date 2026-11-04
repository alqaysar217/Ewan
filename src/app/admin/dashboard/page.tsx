'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, limit, orderBy } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  ShoppingBag, 
  Settings, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  // جلب البيانات الإحصائية (أمثلة)
  const { data: usersList } = useCollection(query(collection(db, 'users'), limit(5)));
  const { data: recentProducts } = useCollection(query(collection(db, 'products'), limit(5)));
  const { data: vendorsList } = useCollection(query(collection(db, 'vendors'), limit(5)));

  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        router.push('/login');
      } else {
        // نتحقق من الدور هنا (في تطبيق حقيقي يفضل استخدام Custom Claims أو التحقق من Firestore)
        // سنفترض أننا سنقرأ من المستند للتأكيد
        setIsAdmin(true); // سيتم التحقق الفعلي في القواعد (Security Rules)
        setCheckingRole(false);
      }
    }
  }, [user, userLoading, router]);

  if (userLoading || checkingRole) return <div className="h-screen flex items-center justify-center font-sans">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="font-bold text-lg">إ</span>
          </div>
          <span className="text-xl font-bold">لوحة الإدارة</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-white/10 text-white rounded-xl">
            <LayoutDashboard className="w-5 h-5" /> ملخص النظام
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:text-white rounded-xl">
            <Users className="w-5 h-5" /> إدارة المستخدمين
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:text-white rounded-xl">
            <Store className="w-5 h-5" /> طلبات التجار
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:text-white rounded-xl">
            <Package className="w-5 h-5" /> الكتالوج
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:text-white rounded-xl">
            <ShoppingBag className="w-5 h-5" /> المبيعات
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-gray-400 hover:text-white rounded-xl">
            <Settings className="w-5 h-5" /> إعدادات المنصة
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-border/50 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-secondary">لوحة التحكم الشاملة</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-xl" onClick={() => router.push('/')}>معاينة الموقع</Button>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'إجمالي المستخدمين', value: '١,٢٥٤', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'المتاجر المفعلة', value: '٨٤', icon: Store, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'طلبات الشراء', value: '٣٤٢', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'أرباح الشهر (SAR)', value: '٤٥,٢٠٠', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/5' },
            ].map((stat, i) => (
              <Card key={i} className="rounded-3xl border-none shadow-sm overflow-hidden">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-secondary mt-1">{stat.value}</h3>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 rounded-3xl border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">المنتجات المضافة حديثاً</CardTitle>
                  <CardDescription>آخر قطع الأثاث التي تم رفعها للمراجعة</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary font-bold">عرض الكل</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المنتج</TableHead>
                      <TableHead className="text-right">التاجر</TableHead>
                      <TableHead className="text-right">السعر</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-left">الإجراء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProducts.length > 0 ? (
                      recentProducts.map((product: any) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name_ar}</TableCell>
                          <TableCell>متجر الأناقة</TableCell>
                          <TableCell>{product.price} SAR</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">معلق</Badge>
                          </TableCell>
                          <TableCell className="text-left">
                            <Button variant="ghost" size="sm">مراجعة</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">لا توجد منتجات معلقة حالياً</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">طلبات انضمام التجار</CardTitle>
                <CardDescription>تجار جدد بانتظار الموافقة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#F4F6F5] rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-secondary">ن</div>
                      <div>
                        <p className="text-sm font-bold text-secondary">نجارة الشرق</p>
                        <p className="text-xs text-muted-foreground">منذ ٢ ساعة</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10">
                      <ArrowUpRight className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
                <Button className="w-full rounded-xl bg-secondary hover:bg-secondary/90 mt-2">عرض جميع الطلبات</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
