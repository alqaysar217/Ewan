
'use client';

import { useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, deleteDoc, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Filter,
  Layers,
  Store,
  Loader2,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Info,
  Package,
  Settings,
  Star
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

export default function AdminProducts() {
  const db = useFirestore();
  const q = query(collection(db, 'products'), orderBy('created_at', 'desc'));
  const { data: products, loading } = useCollection(q);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form State
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
      reader.onloadend = () => {
        setFormData({ ...formData, image_base64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

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
      setIsDialogOpen(false);
      setEditingProduct(null);
      setFormData({ name_ar: '', description_ar: '', price: '', category_id: 'living', status: 'approved', image_base64: '' });
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-secondary">إدارة الكتالوج</h1>
          <p className="text-muted-foreground font-bold mt-1">إدارة المنتجات، التعديل، والحذف مع معاينة فورية.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingProduct(null); 
            setFormData({name_ar: '', description_ar: '', price: '', category_id: 'living', status: 'approved', image_base64: ''});
            setIsDialogOpen(true);
          }}
          className="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5 ml-2" /> إضافة منتج جديد
        </Button>
      </div>

      <div className="relative w-full max-w-xl">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input 
          placeholder="ابحث عن منتج..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pr-12 h-14 bg-white border-none shadow-sm rounded-xl font-bold focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="font-bold text-muted-foreground">جاري تحميل الكتالوج...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.filter(p => p.name_ar?.toLowerCase().includes(searchTerm.toLowerCase())).map((p: any) => (
            <Card key={p.id} className="rounded-3xl border-none shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white group border border-transparent hover:border-primary/20">
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image 
                  src={p.image_base64 || `https://picsum.photos/seed/${p.id}/600/600`} 
                  alt={p.name_ar} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 flex gap-2">
                   <Badge className={cn(
                     "font-black px-2 py-1 rounded-lg border-none shadow-lg",
                     p.status === 'approved' ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                   )}>
                     {p.status === 'approved' ? 'منشور' : 'مراجعة'}
                   </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                   <div className="flex w-full gap-2">
                      <Button onClick={() => openEdit(p)} className="flex-1 rounded-xl bg-white text-secondary hover:bg-primary hover:text-white font-black">تعديل</Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="rounded-xl"><Trash2 className="w-5 h-5" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-black text-secondary flex items-center gap-3">
                              <AlertTriangle className="text-destructive" /> حذف المنتج
                            </AlertDialogTitle>
                            <AlertDialogDescription className="font-bold">
                              هل أنت متأكد من حذف "{p.name_ar}"؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">إلغاء</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(p.id)} className="rounded-xl bg-destructive text-white font-black">نعم، احذف</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                   </div>
                </div>
              </div>
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-secondary line-clamp-1">{p.name_ar}</h4>
                  <div className="flex items-center gap-1 text-amber-500 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-black">4.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                   <p className="text-lg font-black text-primary">{(p.price || 0).toLocaleString()} <span className="text-[10px]">ر.ي</span></p>
                   <Badge variant="outline" className="text-[10px] font-bold border-primary/20 bg-primary/5">{p.category_id}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Add Dialog with Internal Tabs */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
          <Tabs defaultValue="basic" className="w-full">
            <div className="bg-secondary p-6 pb-0">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-black text-white">{editingProduct ? 'تعديل المنتج' : 'منتج جديد'}</DialogTitle>
                <DialogDescription className="text-gray-400 font-bold">إدارة تفاصيل المنتج، الصور، والإعدادات المتقدمة.</DialogDescription>
              </DialogHeader>
              <TabsList className="bg-white/5 border-none w-full justify-start rounded-none h-14 p-0 gap-6">
                <TabsTrigger value="basic" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black gap-2">
                  <Package className="w-4 h-4" /> البيانات الأساسية
                </TabsTrigger>
                <TabsTrigger value="media" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black gap-2">
                  <ImageIcon className="w-4 h-4" /> الوسائط
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black gap-2">
                  <Settings className="w-4 h-4" /> الإعدادات
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <TabsContent value="basic" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <label className="text-sm font-black text-secondary">اسم المنتج (عربي)</label>
                  <Input value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-secondary">الوصف التفصيلي</label>
                  <Textarea value={formData.description_ar} onChange={e => setFormData({...formData, description_ar: e.target.value})} className="rounded-xl min-h-[120px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-secondary">السعر</label>
                    <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-secondary">التصنيف</label>
                    <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full h-12 rounded-xl border border-input bg-background px-3 font-bold">
                      <option value="living">غرف معيشة</option>
                      <option value="bedroom">غرف نوم</option>
                      <option value="dining">طعام</option>
                      <option value="office">مكاتب</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <label className="text-sm font-black text-secondary">صورة المنتج الرئيسية</label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-10 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    {formData.image_base64 ? (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
                        <Image src={formData.image_base64} alt="Preview" fill className="object-cover" />
                        <Button variant="destructive" size="sm" className="absolute top-2 right-2 rounded-lg" onClick={(e) => { e.stopPropagation(); setFormData({...formData, image_base64: ''})}}>إزالة</Button>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <Upload className="w-12 h-12 text-primary mx-auto opacity-40" />
                        <p className="font-black text-secondary">اسحب الصورة هنا أو انقر للرفع</p>
                        <p className="text-xs text-muted-foreground">سيتم تحويل الصورة إلى نص وتخزينها في قاعدة البيانات</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="space-y-1">
                      <p className="font-black text-secondary">حالة النشر</p>
                      <p className="text-xs text-muted-foreground">تحديد ما إذا كان المنتج سيظهر للعملاء أم لا</p>
                    </div>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="h-10 rounded-lg border px-3 font-bold">
                      <option value="approved">منشور</option>
                      <option value="pending">مسودة / مراجعة</option>
                    </select>
                  </div>
                </div>
              </TabsContent>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl px-8 h-12 font-bold">إلغاء</Button>
              <Button onClick={handleSaveProduct} className="rounded-xl px-12 h-12 font-black shadow-lg shadow-primary/20">حفظ التغييرات</Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

