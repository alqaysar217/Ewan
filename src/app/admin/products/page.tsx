'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Trash2, 
  Loader2, 
  Upload,
  Star,
  Edit,
  Store,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 600): Promise<string> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
  });
};

export default function AdminProducts() {
  const db = useFirestore();
  
  const productsQuery = useMemo(() => query(collection(db, 'products'), orderBy('created_at', 'desc')), [db]);
  const { data: products, loading } = useCollection(productsQuery);

  const vendorsQuery = useMemo(() => collection(db, 'vendors'), [db]);
  const { data: vendors } = useCollection(vendorsQuery);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const initialFormData = {
    vendor_id: '',
    name_ar: '',
    description_ar: '',
    price: '',
    old_price: '',
    discount: '0',
    category_id: 'living',
    rating: '5.0',
    in_stock: true,
    approval_status: 'approved',
    image_base64: '',
    gallery: [] as string[],
    material: '',
    dimensions: '',
    fabric: '',
    warranty: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleImageUpload = (type: 'main' | 'gallery', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        if (type === 'main') {
          setFormData(prev => ({ ...prev, image_base64: compressed }));
        } else {
          setFormData(prev => ({ ...prev, gallery: [...prev.gallery, compressed] }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async () => {
    if (isSaving) return;
    try {
      if (!formData.name_ar || !formData.price || !formData.vendor_id) {
        toast({ variant: "destructive", title: "بيانات ناقصة" });
        return;
      }
      setIsSaving(true);
      const data = {
        ...formData,
        price: Number(formData.price),
        old_price: Number(formData.old_price || 0),
        discount: Number(formData.discount || 0),
        rating: Number(formData.rating || 5.0),
        updated_at: serverTimestamp()
      };
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), data);
        toast({ title: "تم التحديث بنجاح" });
      } else {
        await addDoc(collection(db, 'products'), {
          ...data,
          created_at: serverTimestamp(),
        });
        toast({ title: "تمت إضافة المنتج بنجاح" });
      }
      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData(initialFormData);
    } catch (e) {
      toast({ variant: "destructive", title: "فشل في الحفظ" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      toast({ title: "تم حذف المنتج" });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في الحذف" });
    }
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      ...initialFormData,
      ...product,
      price: product.price?.toString() || '',
      old_price: product.old_price?.toString() || '',
      discount: product.discount?.toString() || '0',
      rating: product.rating?.toString() || '5.0',
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary">إدارة الكتالوج والمنتجات</h1>
          <p className="text-muted-foreground font-bold text-sm">أضف قطع الأثاث وادمجها مع المتاجر المعتمدة بتفاصيل كاملة.</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setFormData(initialFormData); setIsDialogOpen(true); }} className="rounded-xl h-12 px-8 font-black bg-primary text-white">
          <Plus className="ml-2 w-5 h-5" /> إضافة منتج جديد
        </Button>
      </div>

      <div className="relative w-full max-w-xl group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input placeholder="ابحث عن منتج بالاسم..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pr-12 h-14 bg-white border-none shadow-sm rounded-xl font-bold" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="font-black text-muted-foreground text-lg">جاري تحميل الكتالوج...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.filter(p => p.name_ar?.toLowerCase().includes(searchTerm.toLowerCase())).map((p: any) => (
            <Card key={p.id} className="rounded-xl border-none shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white flex flex-col group border border-transparent hover:border-primary/10">
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <Image src={p.image_base64 || `https://picsum.photos/seed/${p.id}/600/800`} alt={p.name_ar} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                   <Badge className={cn("font-black px-3 py-1 rounded-lg border-none shadow-lg", p.in_stock ? "bg-emerald-500 text-white" : "bg-destructive text-white")}>{p.in_stock ? 'متوفر' : 'نفذت الكمية'}</Badge>
                </div>
                <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button size="icon" onClick={() => openEdit(p)} className="w-9 h-9 rounded-lg bg-white text-secondary shadow-xl hover:bg-primary hover:text-white">
                      <Edit className="w-4 h-4" />
                   </Button>
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive" className="w-9 h-9 rounded-lg shadow-xl"><Trash2 className="w-4 h-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-xl font-cairo" dir="rtl">
                        <AlertDialogHeader className="space-y-4">
                           <AlertDialogTitle className="text-2xl font-black text-secondary text-center">تأكيد الحذف</AlertDialogTitle>
                           <AlertDialogDescription className="font-bold text-center text-muted-foreground">هل أنت متأكد من حذف المنتج "{p.name_ar}"؟</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-3 mt-6">
                           <AlertDialogAction onClick={() => handleDelete(p.id)} className="flex-1 rounded-xl bg-destructive text-white font-black h-12">حذف</AlertDialogAction>
                           <AlertDialogCancel className="flex-1 rounded-xl h-12 font-black border-none bg-gray-50">تراجع</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                   </AlertDialog>
                </div>
              </div>
              <CardContent className="p-5 space-y-4 flex-1">
                <p className="text-[10px] font-bold text-primary flex items-center gap-1"><Store className="w-3 h-3" /> {vendors?.find(v => v.id === p.vendor_id)?.business_name || 'متجر غير معروف'}</p>
                <div className="flex justify-between items-start gap-3">
                  <h4 className="text-lg font-black text-secondary line-clamp-1 leading-tight">{p.name_ar}</h4>
                  <div className="flex items-center gap-1 text-amber-500 shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg"><Star className="w-3 h-3 fill-current" /><span className="text-xs font-black">{p.rating}</span></div>
                </div>
                <div className="flex items-center justify-between pt-2">
                   <p className="text-xl font-black text-secondary">{(p.price || 0).toLocaleString()} <span className="text-xs font-bold">ر.ي</span></p>
                   <Badge variant="outline" className="text-[10px] font-bold uppercase">{p.category_id}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!isSaving) setIsDialogOpen(open); }}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl font-cairo" dir="rtl">
          <Tabs defaultValue="basic" className="w-full">
            <div className="bg-secondary p-8 pb-0 text-white">
              <DialogHeader className="mb-6 text-right">
                <DialogTitle className="text-2xl font-black">{editingProduct ? 'تعديل بيانات المنتج' : 'إضافة قطعة جديدة'}</DialogTitle>
                <DialogDescription className="text-gray-400 font-bold text-sm mt-1">قم بتعبئة كافة التبويبات لضمان تجربة شراء مثالية للعملاء.</DialogDescription>
              </DialogHeader>
              <TabsList className="bg-white/5 border-none w-full justify-start rounded-none h-14 p-0 gap-6">
                <TabsTrigger value="basic" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">البيانات الأساسية</TabsTrigger>
                <TabsTrigger value="pricing" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">السعر والمخزون</TabsTrigger>
                <TabsTrigger value="media" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">الصور</TabsTrigger>
                <TabsTrigger value="specs" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">المواصفات</TabsTrigger>
              </TabsList>
            </div>
            <div className="p-8 max-h-[50vh] overflow-y-auto bg-white text-right">
              <TabsContent value="basic" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1">المتجر أو المعرض</label>
                    <select value={formData.vendor_id} onChange={e => setFormData({...formData, vendor_id: e.target.value})} className="w-full h-12 rounded-xl border-none bg-gray-50 px-4 font-black text-sm outline-none shadow-inner">
                      <option value="">اختر المتجر...</option>
                      {vendors?.map(v => <option key={v.id} value={v.id}>{v.business_name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1">اسم المنتج بالعربية</label>
                    <Input value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} placeholder="مثال: طقم كنب تركي فاخر" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary mr-1">وصف المنتج</label>
                  <Textarea value={formData.description_ar} onChange={e => setFormData({...formData, description_ar: e.target.value})} placeholder="اكتب وصفاً جذاباً للمنتج..." className="rounded-xl min-h-[100px] bg-gray-50 border-none shadow-inner" />
                </div>
              </TabsContent>
              <TabsContent value="pricing" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1">السعر الحالي (ر.ي)</label>
                    <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="السعر" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1">السعر قبل الخصم (ر.ي)</label>
                    <Input type="number" value={formData.old_price} onChange={e => setFormData({...formData, old_price: e.target.value})} placeholder="اختياري" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-secondary mr-1">حالة التوفر</label>
                      <select value={formData.in_stock ? 'true' : 'false'} onChange={e => setFormData({...formData, in_stock: e.target.value === 'true'})} className="w-full h-12 rounded-xl border-none bg-gray-50 px-4 font-black text-sm outline-none shadow-inner">
                        <option value="true">متوفر في المخزون</option>
                        <option value="false">نفذت الكمية</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-secondary mr-1">التصنيف</label>
                      <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full h-12 rounded-xl border-none bg-gray-50 px-4 font-black text-sm outline-none shadow-inner">
                        <option value="living">غرف معيشة</option>
                        <option value="bedroom">غرف نوم</option>
                        <option value="kitchen">مطابخ</option>
                        <option value="office">مكاتب</option>
                        <option value="majlis">مجالس عربية</option>
                      </select>
                   </div>
                </div>
              </TabsContent>
              <TabsContent value="media" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-secondary">الصورة الأساسية</label>
                    <div className="relative aspect-square border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center bg-gray-50 cursor-pointer overflow-hidden group hover:border-primary/40 transition-all">
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload('main', e)} className="absolute inset-0 opacity-0 z-10" />
                      {formData.image_base64 ? <Image src={formData.image_base64} alt="Main" fill className="object-cover" /> : <Upload className="w-10 h-10 opacity-30 group-hover:scale-110 transition-transform" />}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-black text-secondary">معرض الصور ({formData.gallery.length})</label>
                    <div className="grid grid-cols-3 gap-3">
                       {formData.gallery.map((img, i) => (
                         <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-sm group">
                            <Image src={img} alt="Gallery" fill className="object-cover" />
                            <button onClick={() => setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }))} className="absolute top-1 left-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                         </div>
                       ))}
                       <div className="relative aspect-square border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-primary/5 transition-all">
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload('gallery', e)} className="absolute inset-0 opacity-0" />
                          <Plus className="w-6 h-6 opacity-30" />
                       </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="specs" className="space-y-6 mt-0">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-secondary mr-1">المادة الخام (خشب، معدن...)</label>
                       <Input value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} placeholder="مثال: خشب زان طبيعي" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-secondary mr-1">الأبعاد (طول x عرض x ارتفاع)</label>
                       <Input value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} placeholder="مثال: 200x180x90 سم" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-secondary mr-1">نوع القماش / التنجيد</label>
                       <Input value={formData.fabric} onChange={e => setFormData({...formData, fabric: e.target.value})} placeholder="مثال: مخمل تركي فاخر" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-secondary mr-1">فترة الضمان</label>
                       <Input value={formData.warranty} onChange={e => setFormData({...formData, warranty: e.target.value})} placeholder="مثال: 5 سنوات ضد عيوب التصنيع" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
                    </div>
                 </div>
              </TabsContent>
            </div>
            <div className="p-8 bg-gray-50 border-t flex flex-row-reverse justify-start gap-4">
              <Button onClick={handleSaveProduct} disabled={isSaving} className="rounded-xl px-12 h-14 font-black bg-secondary text-white min-w-[180px]">
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : (editingProduct ? 'حفظ التعديلات' : 'نشر المنتج')}
              </Button>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="rounded-xl px-8 h-14 font-black">إلغاء</Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}