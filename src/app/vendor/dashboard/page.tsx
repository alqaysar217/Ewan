'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Plus, ShoppingBag, MessageSquare, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function VendorDashboard() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'products'), {
        vendor_id: user.uid,
        name_ar: productName,
        price: Number(productPrice),
        category_id: productCategory,
        approval_status: 'pending',
        created_at: new Date().toISOString(),
      });

      toast({
        title: "تم إضافة المنتج بنجاح",
        description: "سيتم مراجعة المنتج من قبل الإدارة قريباً",
      });

      setProductName('');
      setProductPrice('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في الإضافة",
        description: error.message,
      });
    }
  };

  if (userLoading) return <div className="p-10 text-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-secondary">لوحة تحكم التاجر</h1>
            <p className="text-muted-foreground mt-1">مرحباً بك مجدداً، أدر منتجاتك وطلباتك من هنا.</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/')} className="rounded-xl border-primary text-primary">العودة للمتجر</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المنتجات</CardTitle>
              <CardDescription className="text-2xl font-bold text-secondary">0</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">الطلبات الجديدة</CardTitle>
              <CardDescription className="text-2xl font-bold text-secondary">0</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">المبيعات (SAR)</CardTitle>
              <CardDescription className="text-2xl font-bold text-secondary">0.00</CardDescription>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">الرسائل الجديدة</CardTitle>
              <CardDescription className="text-2xl font-bold text-secondary">0</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="products" className="w-full space-y-6">
          <TabsList className="bg-muted p-1 rounded-xl h-14 w-full md:w-auto flex overflow-x-auto">
            <TabsTrigger value="products" className="rounded-lg px-8 flex gap-2 font-bold"><Package className="w-4 h-4" /> المنتجات</TabsTrigger>
            <TabsTrigger value="add" className="rounded-lg px-8 flex gap-2 font-bold"><Plus className="w-4 h-4" /> إضافة جديد</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-lg px-8 flex gap-2 font-bold"><ShoppingBag className="w-4 h-4" /> الطلبات</TabsTrigger>
            <TabsTrigger value="messages" className="rounded-lg px-8 flex gap-2 font-bold"><MessageSquare className="w-4 h-4" /> المحادثات</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg px-8 flex gap-2 font-bold"><Settings className="w-4 h-4" /> الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle>قائمة منتجاتك</CardTitle>
                <CardDescription>هنا تظهر جميع المنتجات التي قمت بإضافتها.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 text-center text-muted-foreground">
                <p>لا توجد منتجات حالياً. ابدأ بإضافة أول منتج لك!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card className="rounded-2xl border-border/50 max-w-2xl">
              <CardHeader>
                <CardTitle>إضافة منتج جديد</CardTitle>
                <CardDescription>املأ البيانات أدناه لإضافة قطعة أثاث جديدة لمتجرك.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pname">اسم المنتج</Label>
                    <Input id="pname" value={productName} onChange={(e) => setProductName(e.target.value)} required placeholder="مثال: أريكة زاوية مودرن" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pprice">السعر (SAR)</Label>
                    <Input id="pprice" type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required placeholder="0.00" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pcat">التصنيف (مؤقت)</Label>
                    <Input id="pcat" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} placeholder="مثال: غرف معيشة" className="rounded-xl" />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold">حفظ ونشر المنتج</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
