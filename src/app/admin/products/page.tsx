'use client';

import { useState } from 'react';
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
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Package,
  Settings,
  Star,
  CheckCircle2,
  Edit
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

// وظيفة ضغط الصور التلقائي لضمان الحفظ في Firestore
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
  const q = query(collection(db, 'products'), orderBy('created_at', 'desc'));
  const { data: products, loading } = useCollection(q);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name_ar: '',
    description_ar: '',
    price: '',
    category_id: 'living',
    status: 'approved',
    image_base64: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setFormData(prev => ({ ...prev, image_base64: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async () => {
    if (isSaving) return;
    try {
      if (!formData.name_ar || !formData.price) {
        toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى إدخال اسم المنتج وسعره." });
        return;
      }

      setIsSaving(true);
      const data = {
        ...formData,
        price: Number(formData.price),
        updated_at: serverTimestamp()
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), data);
        toast({ title: "تم التحديث بنجاح" });
      } else {
        await addDoc(collection(db, 'products'), {
          ...data,
          created_at: serverTimestamp(),
          vendor_id: 'admin_store'
        });
        toast({ title: "تمت إضافة المنتج بنجاح" });
      }
      setIsDialogOpen(false);
      setEditingProduct(null);
    } catch (e) {
      console.error("Save error:", e);
      toast({ variant: "destructive", title: "فشل في الحفظ", description: "قد يكون حجم الصور كبيراً جداً." });
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
      name_ar: product.name_ar || '',
      description_ar: product.description_ar || '',
      price: product.price?.toString() || '',
      category_id: product.category_id || 'living',
      status: product.status || 'approved',
      image_base64: product.image_base64 || ''
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary">إدارة الكتالوج والمنتجات</h1>
          <p className="text-muted-foreground font-bold">مراجعة المنتجات المرفوعة من التجار وضمان جودة العرض والبيانات.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingProduct(null); 
            setFormData({name_ar: '', description_ar: '', price: '', category_id: 'living', status: 'approved', image_base64: ''});
            setIsDialogOpen(true);
          }}
          className="rounded-xl h-12 px-8 font-black bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
        >
          <Plus className="ml-2 w-5 h-5" /> إضافة منتج جديد
        </Button>
      </div>

      <div className="relative w-full max-w-xl group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="ابحث عن منتج بالاسم..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pr-12 h-14 bg-white border-none shadow-sm rounded-xl font-bold"
        />
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
                <Image 
                  src={p.image_base64 || `https://picsum.photos/seed/${p.id}/600/800`} 
                  alt={p.name_ar} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                   <Badge className={cn(
                     "font-black px-3 py-1 rounded-lg border-none shadow-lg backdrop-blur-md",
                     p.status === 'approved' ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"
                   )}>
                     {p.status === 'approved' ? 'منشور' : 'معلق'}
                   </Badge>
                </div>

                <div className="absolute top-3 left-3 flex gap-2">
                   <Button size="icon" onClick={() => openEdit(p)} className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary transition-all">
                      <Edit className="w-4 h-4" />
                   </Button>
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive" className="w-9 h-9 rounded-lg shadow-xl">
                           <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-xl border-none p-8 font-cairo" dir="rtl">
                        <AlertDialogHeader className="space-y-4">
                           <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                              <AlertTriangle className="w-8 h-8" />
                           </div>
                           <AlertDialogTitle className="text-2xl font-black text-secondary text-center">تأكيد الحذف</AlertDialogTitle>
                           <AlertDialogDescription className="font-bold text-center text-muted-foreground">
                              هل أنت متأكد من حذف المنتج "{p.name_ar}"؟ لا يمكن التراجع عن هذا الإجراء.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-3 mt-6">
                           <AlertDialogAction onClick={() => handleDelete(p.id)} className="flex-1 rounded-xl bg-destructive text-white font-black h-12">حذف المنتج</AlertDialogAction>
                           <AlertDialogCancel className="flex-1 rounded-xl h-12 font-black border-none bg-gray-50">تراجع</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                   </AlertDialog>
                </div>
              </div>
              <CardContent className="p-5 space-y-4 flex-1">
                <div className="flex justify-between items-start gap-3">
                  <h4 className="text-lg font-black text-secondary group-hover:text-primary transition-colors line-clamp-1 leading-tight">{p.name_ar}</h4>
                  <div className="flex items-center gap-1 text-amber-500 shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-black">4.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                   <p className="text-xl font-black text-primary">{(p.price || 0).toLocaleString()} <span className="text-xs font-bold">ر.ي</span></p>
                   <Badge variant="outline" className="text-[10px] font-bold border-gray-100 bg-gray-50 text-muted-foreground px-2 py-0.5 rounded-md uppercase tracking-tighter">{p.category_id}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!isSaving) setIsDialogOpen(open); }}>
        <DialogContent 
          className="sm:max-w-[800px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl font-cairo" 
          dir="rtl"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <Tabs defaultValue="basic" className="w-full">
            <div className="bg-secondary p-8 pb-0 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <DialogHeader className="mb-6 relative z-10 text-right">
                <DialogTitle className="text-2xl font-black">{editingProduct ? 'تعديل بيانات المنتج' : 'إضافة قطعة جديدة'}</DialogTitle>
                <DialogDescription className="text-gray-400 font-bold text-sm mt-1">أدخل تفاصيل المنتج بدقة لضمان أفضل عرض للعملاء.</DialogDescription>
              </DialogHeader>
              <TabsList className="bg-white/5 border-none w-full justify-start rounded-none h-12 p-0 gap-6">
                <TabsTrigger value="basic" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2 transition-all">
                  <Package className="w-4 h-4" /> البيانات الأساسية
                </TabsTrigger>
                <TabsTrigger value="media" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2 transition-all">
                  <ImageIcon className="w-4 h-4" /> الصور والوسائط
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2 transition-all">
                  <Settings className="w-4 h-4" /> الإعدادات
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8 max-h-[50vh] overflow-y-auto bg-white text-right">
              <TabsContent value="basic" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <label className="text-sm font-black text-secondary mr-1">اسم المنتج التجاري</label>
                  <Input value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} placeholder="مثال: أريكة مخملية فاخرة" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-secondary mr-1">الوصف التفصيلي</label>
                  <Textarea value={formData.description_ar} onChange={e => setFormData({...formData, description_ar: e.target.value})} placeholder="تحدث عن الخامة، الجودة، الضمان..." className="rounded-xl min-h-[100px] bg-gray-50 border-none py-3 shadow-inner" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-secondary mr-1">السعر (ر.ي)</label>
                    <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-secondary mr-1">الفئة / القسم</label>
                    <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full h-12 rounded-xl border-none bg-gray-50 px-4 font-black text-sm outline-none shadow-inner">
                      <option value="living">غرف معيشة</option>
                      <option value="bedroom">غرف نوم</option>
                      <option value="dining">طاولات طعام</option>
                      <option value="office">أثاث مكتبي</option>
                      <option value="majlis">مجالس تراثية</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <label className="text-sm font-black text-secondary text-center block">صورة المنتج الرئيسية</label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl p-10 bg-gray-50/50 hover:bg-primary/5 transition-all cursor-pointer relative group">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                    {formData.image_base64 ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg group/img">
                        <Image src={formData.image_base64} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="destructive" size="sm" className="rounded-lg font-black gap-2 h-10" onClick={(e) => { e.stopPropagation(); setFormData({...formData, image_base64: ''})}}>
                               <Trash2 className="w-4 h-4" /> إزالة الصورة
                            </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-all duration-500">
                           <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                           <p className="text-lg font-black text-secondary">انقر لرفع صورة المنتج</p>
                           <p className="text-muted-foreground font-bold text-xs">سيتم تحسين الحجم تلقائياً للحفظ</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="space-y-1">
                      <p className="text-lg font-black text-secondary flex items-center gap-2">
                         <CheckCircle2 className="w-5 h-5 text-primary" /> حالة المنتج
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">تحكم في ظهور المنتج في المتجر العام.</p>
                    </div>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="h-10 rounded-lg border-none px-4 font-black bg-white shadow-sm outline-none">
                      <option value="approved">منشور الآن</option>
                      <option value="pending">مسودة / معلق</option>
                    </select>
                  </div>
                </div>
              </TabsContent>
            </div>

            <div className="p-8 bg-gray-50 border-t flex flex-row-reverse justify-start gap-4">
              <Button 
                onClick={handleSaveProduct} 
                disabled={isSaving} 
                className="rounded-xl px-10 h-12 font-black text-base bg-secondary text-white shadow-lg transition-all min-w-[140px]"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ المنتج'}
              </Button>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="rounded-xl px-6 h-12 font-black text-base hover:bg-white">إلغاء</Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

