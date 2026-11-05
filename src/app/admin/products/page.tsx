'use client';

import { useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Filter,
  ArrowUpDown,
  Layers,
  Store,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';

export default function AdminProducts() {
  const db = useFirestore();
  const q = query(collection(db, 'products'), orderBy('created_at', 'desc'));
  const { data: products, loading } = useCollection(q);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsSearchExpanded] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name_ar: '',
    price: '',
    category_id: 'living',
    status: 'approved'
  });

  const mockProducts = [
    { id: '1', name_ar: 'طقم ديوان حضرمي', price: 450000, category_id: 'living', status: 'approved', store: 'ورشة المكلا' },
    { id: '2', name_ar: 'سرير كلاسيكي فاخر', price: 280000, category_id: 'bedroom', status: 'pending', store: 'أثاث الخليج' },
    { id: '3', name_ar: 'طاولة طعام دائرية', price: 120000, category_id: 'dining', status: 'approved', store: 'مودرن هوم' },
  ];

  const displayed = (products && products.length > 0) ? products : mockProducts;

  const handleSaveProduct = async () => {
    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        updated_at: serverTimestamp()
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), data);
        toast({ title: "تم التحديث", description: "تم تحديث بيانات المنتج بنجاح" });
      } else {
        await addDoc(collection(db, 'products'), {
          ...data,
          created_at: serverTimestamp(),
          vendor_id: 'admin'
        });
        toast({ title: "تمت الإضافة", description: "تم إضافة منتج جديد للكتالوج" });
      }
      setIsSearchExpanded(false);
      setEditingProduct(null);
      setFormData({ name_ar: '', price: '', category_id: 'living', status: 'approved' });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل في حفظ البيانات" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      toast({ title: "تم الحذف", description: "تم حذف المنتج نهائياً من النظام" });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "لا يمكن حذف هذا المنتج" });
    }
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name_ar: product.name_ar,
      price: product.price.toString(),
      category_id: product.category_id || 'living',
      status: product.status || 'approved'
    });
    setIsSearchExpanded(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-secondary">إدارة الكتالوج والمنتجات</h1>
          <p className="text-muted-foreground font-bold mt-1">مراجعة المنتجات المرفوعة من التجار وضمان جودة العرض والبيانات.</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsSearchExpanded}>
            <DialogTrigger asChild>
              <Button className="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20" onClick={() => {setEditingProduct(null); setFormData({name_ar: '', price: '', category_id: 'living', status: 'approved'})}}>
                <Plus className="w-5 h-5 ml-2" /> إضافة منتج
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[24px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-secondary">{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
                <DialogDescription className="font-bold">أدخل تفاصيل المنتج بدقة لضمان أفضل عرض للعملاء.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-secondary mr-1">اسم المنتج بالعربية</label>
                  <Input 
                    value={formData.name_ar} 
                    onChange={e => setFormData({...formData, name_ar: e.target.value})}
                    placeholder="مثال: أريكة مخملية فاخرة" 
                    className="rounded-xl h-12" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-secondary mr-1">السعر (ريال يمني)</label>
                  <Input 
                    type="number"
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00" 
                    className="rounded-xl h-12" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-secondary mr-1">التصنيف</label>
                    <select 
                      value={formData.category_id}
                      onChange={e => setFormData({...formData, category_id: e.target.value})}
                      className="w-full h-12 rounded-xl border border-input bg-background px-3 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="living">غرف معيشة</option>
                      <option value="bedroom">غرف نوم</option>
                      <option value="dining">طعام</option>
                      <option value="office">مكاتب</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-secondary mr-1">الحالة</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full h-12 rounded-xl border border-input bg-background px-3 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="approved">منشور</option>
                      <option value="pending">قيد المراجعة</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" className="rounded-xl h-12 px-6" onClick={() => setIsSearchExpanded(false)}>إلغاء</Button>
                <Button className="rounded-xl h-12 px-10 font-black" onClick={handleSaveProduct}>حفظ التغييرات</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between space-y-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="ابحث عن منتج بالاسم أو التاجر..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pr-12 h-12 bg-gray-50 border-none rounded-xl font-bold"
            />
          </div>
          <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
             <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg"><Layers className="w-4 h-4 text-primary" /> {displayed.length} منتج</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-none">
                <TableHead className="text-right h-16 font-black text-secondary px-8">المنتج</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">التصنيف</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">السعر</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">التاجر / الورشة</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">الحالة</TableHead>
                <TableHead className="text-left h-16 font-black text-secondary px-8">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                    <p className="font-bold text-muted-foreground">جاري تحميل المنتجات...</p>
                  </TableCell>
                </TableRow>
              ) : displayed.filter(p => p.name_ar?.toLowerCase().includes(searchTerm.toLowerCase())).map((p: any) => (
                <TableRow key={p.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                  <TableCell className="px-8 font-black text-secondary">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg relative overflow-hidden shrink-0">
                        <Image src={`https://picsum.photos/seed/${p.id}/100/100`} alt={p.name_ar} fill className="object-cover" />
                      </div>
                      {p.name_ar}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-50 text-muted-foreground border-none font-bold rounded-lg px-3 py-1">
                      {p.category_id === 'living' ? 'غرف معيشة' : p.category_id === 'bedroom' ? 'غرف نوم' : 'طعام'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-black text-primary">{(p.price || 0).toLocaleString()} ر.ي</TableCell>
                  <TableCell className="font-bold text-secondary">
                     <span className="flex items-center gap-2"><Store className="w-4 h-4 text-gray-300" /> {p.store || 'إيوان (داخلي)'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-black px-3 py-1 rounded-lg",
                      p.status === 'approved' ? "bg-emerald-50 text-emerald-600 border-none" : "bg-amber-50 text-amber-600 border-none"
                    )}>
                      {p.status === 'approved' ? 'منشور' : 'بانتظار المراجعة'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left px-8">
                    <div className="flex items-center justify-end gap-2">
                       <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-white shadow-sm" onClick={() => openEdit(p)}>
                         <Edit3 className="w-4 h-4 text-primary" />
                       </Button>
                       
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-white shadow-sm">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[24px]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl font-black text-secondary flex items-center gap-3">
                                <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
                                  <AlertTriangle className="w-6 h-6" />
                                </div>
                                تأكيد الحذف النهائي
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-base font-bold py-4 leading-relaxed">
                                هل أنت متأكد من حذف المنتج <span className="text-secondary">"{p.name_ar}"</span>؟ هذه العملية لا يمكن التراجع عنها وسيتم حذف كافة البيانات المرتبطة به.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2 pt-4">
                              <AlertDialogCancel className="rounded-xl h-12 px-6 border-none bg-gray-100 font-bold">إلغاء</AlertDialogCancel>
                              <AlertDialogAction className="rounded-xl h-12 px-8 bg-destructive text-white font-black hover:bg-destructive/90" onClick={() => handleDelete(p.id)}>
                                نعم، احذف المنتج
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                       </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
