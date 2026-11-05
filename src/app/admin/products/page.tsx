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
  Layers,
  CheckCircle2,
  ChevronLeft
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

// وظيفة ضغط الصور التلقائي
const compressImage = (base64Str: string, maxWidth = 1000, maxHeight = 800): Promise<string> => {
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
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-secondary">إدارة الكتالوج</h1>
          <p className="text-muted-foreground font-bold">تحكم كامل في المنتجات المعروضة في المتجر الذكي.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingProduct(null); 
            setFormData({name_ar: '', description_ar: '', price: '', category_id: 'living', status: 'approved', image_base64: ''});
            setIsDialogOpen(true);
          }}
          className="rounded-[15px] h-14 px-10 font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20"
        >
          <Plus className="ml-2 w-6 h-6" /> إضافة قطعة جديدة
        </Button>
      </div>

      <div className="relative w-full max-w-2xl group">
        <div className="absolute inset-0 bg-primary/5 rounded-[20px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="ابحث عن منتج بالاسم أو الفئة..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pr-14 h-16 bg-white border-none shadow-sm rounded-[20px] font-bold text-lg focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <Loader2 className="w-16 h-16 animate-spin text-primary" />
          <p className="font-black text-muted-foreground text-xl">جاري تحميل الكتالوج...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products?.filter(p => p.name_ar?.toLowerCase().includes(searchTerm.toLowerCase())).map((p: any) => (
            <Card key={p.id} className="rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all overflow-hidden bg-white group border border-transparent hover:border-primary/20 flex flex-col">
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <Image 
                  src={p.image_base64 || `https://picsum.photos/seed/${p.id}/600/800`} 
                  alt={p.name_ar} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute top-6 right-6">
                   <Badge className={cn(
                     "font-black px-4 py-1.5 rounded-xl border-none shadow-2xl backdrop-blur-md",
                     p.status === 'approved' ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"
                   )}>
                     {p.status === 'approved' ? 'منشور الآن' : 'قيد المراجعة'}
                   </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <div className="flex w-full gap-3">
                      <Button onClick={() => openEdit(p)} className="flex-1 rounded-[15px] h-14 bg-white text-secondary hover:bg-primary hover:text-white font-black text-lg transition-all">تعديل التفاصيل</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="rounded-[15px] w-14 h-14 shadow-xl"><Trash2 className="w-6 h-6" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[30px] border-none p-10 font-cairo" dir="rtl">
                          <AlertDialogHeader className="space-y-4">
                            <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                               <AlertTriangle className="w-10 h-10" />
                            </div>
                            <AlertDialogTitle className="text-3xl font-black text-secondary text-center">تأكيد الحذف</AlertDialogTitle>
                            <AlertDialogDescription className="font-bold text-center text-lg leading-relaxed">
                              هل أنت متأكد من رغبتك في حذف "{p.name_ar}"؟
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-row gap-4 mt-8">
                            <AlertDialogAction onClick={() => handleDelete(p.id)} className="flex-1 rounded-xl bg-destructive text-white font-black h-14 text-lg">نعم، احذف</AlertDialogAction>
                            <AlertDialogCancel className="flex-1 rounded-xl h-14 font-black text-lg">إلغاء</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                   </div>
                </div>
              </div>
              <CardContent className="p-8 space-y-4 flex-1">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="text-xl font-black text-secondary group-hover:text-primary transition-colors line-clamp-1 leading-tight">{p.name_ar}</h4>
                  <div className="flex items-center gap-1.5 text-amber-500 shrink-0 bg-amber-50 px-3 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-black">4.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                   <p className="text-2xl font-black text-primary">{(p.price || 0).toLocaleString()} <span className="text-xs">ر.ي</span></p>
                   <Badge variant="outline" className="text-xs font-bold border-primary/20 bg-primary/5 px-3 py-1 rounded-lg">{p.category_id}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!isSaving) setIsDialogOpen(open); }}>
        <DialogContent 
          className="sm:max-w-[850px] p-0 overflow-hidden rounded-[35px] border-none shadow-2xl font-cairo" 
          dir="rtl"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <Tabs defaultValue="basic" className="w-full">
            <div className="bg-secondary p-10 pb-0 text-white relative">
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <DialogHeader className="mb-10 relative z-10">
                <DialogTitle className="text-4xl font-black">{editingProduct ? 'تعديل بيانات المنتج' : 'إضافة قطعة جديدة'}</DialogTitle>
                <DialogDescription className="text-gray-400 font-bold text-lg mt-2">إدارة شاملة لكافة تفاصيل المنتج والوسائط.</DialogDescription>
              </DialogHeader>
              <TabsList className="bg-white/5 border-none w-full justify-start rounded-none h-16 p-0 gap-10">
                <TabsTrigger value="basic" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-lg gap-3 transition-all">
                  <Package className="w-6 h-6" /> البيانات الأساسية
                </TabsTrigger>
                <TabsTrigger value="media" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-lg gap-3 transition-all">
                  <ImageIcon className="w-6 h-6" /> الوسائط والصور
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-lg gap-3 transition-all">
                  <Settings className="w-6 h-6" /> إعدادات العرض
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-12 max-h-[60vh] overflow-y-auto bg-white">
              <TabsContent value="basic" className="space-y-10 mt-0">
                <div className="space-y-3">
                  <label className="text-lg font-black text-secondary mr-2">اسم المنتج التجاري</label>
                  <Input value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} placeholder="مثال: أريكة مخملية زرقاء" className="rounded-2xl h-16 text-lg border-gray-100 bg-gray-50 shadow-inner" />
                </div>
                <div className="space-y-3">
                  <label className="text-lg font-black text-secondary mr-2">وصف تفصيلي</label>
                  <Textarea value={formData.description_ar} onChange={e => setFormData({...formData, description_ar: e.target.value})} placeholder="تحدث عن خامات الخشب، نوع القماش..." className="rounded-2xl min-h-[150px] text-lg border-gray-100 bg-gray-50 py-6 shadow-inner" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-lg font-black text-secondary mr-2">السعر (ر.ي)</label>
                    <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="rounded-2xl h-16 text-lg border-gray-100 bg-gray-50 shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-lg font-black text-secondary mr-2">الفئة / القسم</label>
                    <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full h-16 rounded-2xl border-none bg-gray-50 px-6 font-black text-lg outline-none shadow-inner">
                      <option value="living">غرف معيشة</option>
                      <option value="bedroom">غرف نوم</option>
                      <option value="dining">طاولات طعام</option>
                      <option value="office">أثاث مكتبي</option>
                      <option value="majlis">مجالس تراثية</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-10 mt-0">
                <div className="space-y-6">
                  <label className="text-lg font-black text-secondary text-center block">صورة المنتج الرئيسية (يتم ضغطها تلقائياً)</label>
                  <div className="flex flex-col items-center justify-center border-4 border-dashed border-gray-100 rounded-[35px] p-16 bg-gray-50/50 hover:bg-primary/5 transition-all cursor-pointer relative group">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                    {formData.image_base64 ? (
                      <div className="relative w-full aspect-video rounded-[25px] overflow-hidden shadow-2xl group/img">
                        <Image src={formData.image_base64} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="destructive" size="lg" className="rounded-xl font-black gap-2 h-14 px-8" onClick={(e) => { e.stopPropagation(); setFormData({...formData, image_base64: ''})}}>
                               <Trash2 className="w-5 h-5" /> إزالة الصورة
                            </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-6">
                        <div className="w-24 h-24 bg-white rounded-[25px] flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-all duration-500">
                           <Upload className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                           <p className="text-2xl font-black text-secondary">اسحب الصورة هنا أو انقر للتصفح</p>
                           <p className="text-muted-foreground font-bold mt-2">سيتم تحسين الحجم تلقائياً للحفاظ على جودة العرض</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-8 mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-8 bg-gray-50 rounded-[25px] border border-gray-100 transition-all">
                    <div className="space-y-2">
                      <p className="text-xl font-black text-secondary flex items-center gap-3">
                         <CheckCircle2 className="w-6 h-6 text-primary" /> حالة النشر العامة
                      </p>
                      <p className="text-base text-muted-foreground font-medium">تحكم في ظهور هذا المنتج لزوار المنصة.</p>
                    </div>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="h-14 rounded-xl border-none px-6 font-black bg-white shadow-sm outline-none">
                      <option value="approved">منشور (مرئي للجميع)</option>
                      <option value="pending">مسودة (للمراجعة فقط)</option>
                    </select>
                  </div>
                </div>
              </TabsContent>
            </div>

            <div className="p-10 bg-gray-50 border-t flex justify-end gap-5">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="rounded-xl px-10 h-16 font-black text-xl hover:bg-white">إلغاء</Button>
              <Button onClick={handleSaveProduct} disabled={isSaving} className="rounded-xl px-16 h-16 font-black text-xl bg-secondary text-white shadow-2xl shadow-secondary/20 hover:-translate-y-1 transition-all">
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : 'حفظ ونشر'}
              </Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
