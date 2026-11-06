'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  CheckCircle2, 
  Upload,
  Star,
  Image as ImageIcon,
  MapPin,
  Store,
  Clock,
  Award,
  MessageSquare,
  Info,
  Loader2,
  Mail,
  Layers,
  Sparkles,
  User,
  Trash2,
  Package,
  Quote,
  Edit,
  AlertTriangle
} from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';

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

export default function AdminVendors() {
  const db = useFirestore();
  const vendorsQuery = useMemo(() => query(
    collection(db, 'vendors'), 
    where('business_type', '==', 'furniture_store')
  ), [db]);
  const { data: vendors, loading } = useCollection(vendorsQuery);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(null);

  const [vendorData, setVendorData] = useState({
    business_name: '',
    business_type: 'furniture_store',
    city: 'صنعاء',
    email: '',
    description: '',
    logo_url: '',
    cover_url: '',
    average_rating: 5,
    experience_years: '5',
    available_products: '0',
    service_areas: ['صنعاء'],
    reviews: [] as any[],
    gallery: [] as string[]
  });

  const handleImageUpload = async (type: 'logo' | 'cover' | 'gallery', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        if (type === 'gallery') {
           setVendorData(prev => ({ ...prev, gallery: [...prev.gallery, compressed] }));
        } else {
           setVendorData(prev => ({ ...prev, [type === 'logo' ? 'logo_url' : 'cover_url']: compressed }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveVendor = async () => {
    if (isSaving) return;
    try {
      if (!vendorData.business_name || !vendorData.email) {
        toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى ملء اسم المتجر والبريد الإلكتروني." });
        return;
      }
      setIsSaving(true);
      const finalData = {
        ...vendorData,
        average_rating: Number(vendorData.average_rating),
        experience_years: Number(vendorData.experience_years),
        available_products: Number(vendorData.available_products),
        approval_status: 'approved',
        updated_at: serverTimestamp(),
        slug: vendorData.business_name.toLowerCase().replace(/\s+/g, '-'),
      };
      if (editingVendor) {
        await updateDoc(doc(db, 'vendors', editingVendor.id), finalData);
        toast({ title: "تم التحديث بنجاح" });
      } else {
        await addDoc(collection(db, 'vendors'), {
          ...finalData,
          created_at: serverTimestamp(),
        });
        toast({ title: "تم الحفظ بنجاح" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (e: any) {
      toast({ variant: "destructive", title: "فشل في الحفظ" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'vendors', id));
      toast({ title: "تم الحذف بنجاح" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل في الحذف" });
    }
  };

  const openEdit = (vendor: any) => {
    setEditingVendor(vendor);
    setVendorData({
      ...vendor,
      experience_years: vendor.experience_years?.toString() || '5',
      available_products: vendor.available_products?.toString() || '0',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingVendor(null);
    setVendorData({ 
      business_name: '', business_type: 'furniture_store', city: 'صنعاء', email: '', 
      description: '', logo_url: '', cover_url: '', average_rating: 5, 
      experience_years: '5', available_products: '0', service_areas: ['صنعاء'], 
      reviews: [], gallery: [] 
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary">إدارة معارض الأثاث</h1>
          <p className="text-muted-foreground font-bold">التحكم الحصري في المتاجر والمعارض الكبرى المعتمدة.</p>
        </div>
        <button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="rounded-xl h-14 px-8 font-black bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform hover:-translate-y-1">
          <Plus className="w-5 h-5" /> إضافة معرض معتمد
        </button>
      </div>

      <div className="relative w-full max-w-2xl group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="ابحث عن معرض بالاسم أو المدينة..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-12 h-14 bg-white border-none shadow-sm rounded-xl font-bold text-lg"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
           <Loader2 className="w-12 h-12 animate-spin text-primary" />
           <p className="font-black text-muted-foreground text-lg">جاري تحميل المتاجر...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors?.filter(v => v.business_name?.toLowerCase().includes(searchTerm.toLowerCase())).map((vendor: any) => (
            <Card key={vendor.id} className="rounded-2xl border-none shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white flex flex-col group border border-transparent hover:border-primary/10">
              <div className="relative h-48 w-full overflow-hidden">
                <Image src={vendor.cover_url || `https://picsum.photos/seed/${vendor.id}/800/400`} alt={vendor.business_name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                   <Button size="icon" onClick={() => openEdit(vendor)} className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary">
                      <Edit className="w-5 h-5" />
                   </Button>
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive" className="w-10 h-10 rounded-lg shadow-xl">
                           <Trash2 className="w-5 h-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl font-cairo" dir="rtl">
                        <AlertDialogHeader className="space-y-4">
                           <AlertDialogTitle className="text-2xl font-black text-secondary text-center">تأكيد الحذف</AlertDialogTitle>
                           <AlertDialogDescription className="font-bold text-center text-muted-foreground">
                              سيتم مسح كافة البيانات المرتبطة بمتجر "{vendor.business_name}" نهائياً.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-3 mt-6">
                           <AlertDialogAction onClick={() => handleDeleteVendor(vendor.id)} className="flex-1 rounded-xl bg-destructive text-white font-black h-12">حذف الآن</AlertDialogAction>
                           <AlertDialogCancel className="flex-1 rounded-xl h-12 font-black border-none bg-gray-50">إلغاء</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                   </AlertDialog>
                </div>
                <div className="absolute bottom-4 right-6 left-6 flex items-center gap-3">
                   <div className="w-12 h-12 bg-white p-1 rounded-xl shadow-2xl relative overflow-hidden shrink-0">
                      <Image src={vendor.logo_url || `https://picsum.photos/seed/${vendor.id}-logo/200/200`} alt="Logo" fill className="object-cover" />
                   </div>
                   <div className="text-white">
                      <h4 className="font-black text-lg flex items-center gap-1.5">{vendor.business_name} <CheckCircle2 className="w-4 h-4 text-primary fill-white" /></h4>
                      <p className="text-[10px] font-bold opacity-80 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {vendor.city}
                      </p>
                   </div>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col space-y-5">
                 <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">{vendor.description}</p>
                 <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-100">
                       <p className="text-[9px] text-muted-foreground font-black uppercase">التقييم</p>
                       <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-xs">
                          <Star className="w-3 h-3 fill-current" /> {vendor.average_rating || '5.0'}
                       </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-100">
                       <p className="text-[9px] text-muted-foreground font-black uppercase">المنتجات</p>
                       <p className="text-xs font-black text-secondary">{vendor.available_products || '0'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-100">
                       <p className="text-[9px] text-muted-foreground font-black uppercase">الخبرة</p>
                       <p className="text-xs font-black text-secondary">{vendor.experience_years || '1'} سنة</p>
                    </div>
                 </div>
                 <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                    <Link href={`/vendors/${vendor.id}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-lg h-10 border-gray-200 font-black text-xs">معاينة</Button>
                    </Link>
                    <Button onClick={() => openEdit(vendor)} className="flex-1 rounded-lg h-10 bg-secondary text-white font-black shadow-sm text-xs">تعديل</Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!isSaving) setIsDialogOpen(open); }}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl font-cairo" dir="rtl">
          <Tabs defaultValue="branding" className="w-full">
            <div className="bg-secondary p-6 pb-0 text-white">
              <DialogHeader className="mb-4 text-right">
                <DialogTitle className="text-2xl font-black">{editingVendor ? 'تعديل بيانات المعرض' : 'تسجيل شريك استراتيجي'}</DialogTitle>
                <DialogDescription className="text-gray-400 font-bold text-xs mt-1">أدخل بيانات الهوية التجارية بدقة لضمان عرض احترافي.</DialogDescription>
              </DialogHeader>
              <TabsList className="bg-white/5 border-none w-full justify-start rounded-none h-12 p-0 gap-4">
                <TabsTrigger value="branding" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">
                  <Store className="w-4 h-4" /> الهوية التجارية
                </TabsTrigger>
                <TabsTrigger value="performance" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">
                  <Award className="w-4 h-4" /> الأداء
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">
                  <Star className="w-4 h-4" /> الآراء
                </TabsTrigger>
                <TabsTrigger value="gallery" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">
                  <ImageIcon className="w-4 h-4" /> المعرض
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 max-h-[50vh] overflow-y-auto bg-white text-right">
              <TabsContent value="branding" className="space-y-5 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-sm font-black text-secondary flex items-center gap-2"><ImageIcon className="w-4 h-4 text-primary" /> شعار المتجر</label>
                     <div className="relative aspect-square w-20 border-2 border-dashed border-gray-100 rounded-xl overflow-hidden bg-gray-50 cursor-pointer">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} className="absolute inset-0 opacity-0 z-20" />
                        {vendorData.logo_url ? <Image src={vendorData.logo_url} alt="Logo" fill className="object-cover" /> : <div className="h-full w-full flex items-center justify-center"><Upload className="w-5 h-5 opacity-30" /></div>}
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-black text-secondary flex items-center gap-2"><ImageIcon className="w-4 h-4 text-primary" /> صورة الغلاف</label>
                     <div className="relative aspect-video w-full border-2 border-dashed border-gray-100 rounded-xl overflow-hidden bg-gray-50 cursor-pointer">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('cover', e)} className="absolute inset-0 opacity-0 z-20" />
                        {vendorData.cover_url ? <Image src={vendorData.cover_url} alt="Cover" fill className="object-cover" /> : <div className="h-full w-full flex items-center justify-center"><Upload className="w-6 h-6 opacity-30" /></div>}
                     </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input value={vendorData.business_name} onChange={e => setVendorData({...vendorData, business_name: e.target.value})} placeholder="الاسم التجاري" className="rounded-xl h-11 bg-gray-50 border-none" />
                  <Input value={vendorData.email} onChange={e => setVendorData({...vendorData, email: e.target.value})} placeholder="البريد الإلكتروني" className="rounded-xl h-11 bg-gray-50 border-none" />
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-5 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input type="number" value={vendorData.experience_years} onChange={e => setVendorData({...vendorData, experience_years: e.target.value})} placeholder="سنوات الخبرة" className="rounded-xl h-11 bg-gray-50 border-none" />
                  <Input type="number" value={vendorData.available_products} onChange={e => setVendorData({...vendorData, available_products: e.target.value})} placeholder="المنتجات" className="rounded-xl h-11 bg-gray-50 border-none" />
                  <Input type="number" max="5" value={vendorData.average_rating} onChange={e => setVendorData({...vendorData, average_rating: Number(e.target.value)})} placeholder="التقييم" className="rounded-xl h-11 bg-gray-50 border-none" />
                </div>
                <Textarea value={vendorData.description} onChange={e => setVendorData({...vendorData, description: e.target.value})} placeholder="نبذة عن المتجر..." className="rounded-xl min-h-[80px] bg-gray-50 border-none" />
              </TabsContent>

              <TabsContent value="reviews" className="space-y-3 mt-0">
                 <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black text-secondary">آراء العملاء</h3>
                    <Button variant="outline" size="sm" onClick={() => setVendorData(prev => ({...prev, reviews: [...prev.reviews, {name: 'عميل جديد', text: '', rating: 5, date: 'الآن'}]}))}>+ إضافة</Button>
                 </div>
                 {vendorData.reviews.map((rev, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 relative group">
                       <Input value={rev.name} onChange={e => {
                          const newRev = [...vendorData.reviews];
                          newRev[i].name = e.target.value;
                          setVendorData({...vendorData, reviews: newRev});
                       }} className="bg-transparent border-none h-8 font-black" />
                       <button onClick={() => setVendorData(prev => ({...prev, reviews: prev.reviews.filter((_, idx) => idx !== i)}))} className="absolute top-2 left-2 text-destructive opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                 ))}
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4 mt-0">
                 <div className="grid grid-cols-4 gap-3">
                    {vendorData.gallery.map((img, i) => (
                       <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-md group">
                          <Image src={img} alt="Work" fill className="object-cover" />
                          <button onClick={() => setVendorData(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }))} className="absolute top-1 left-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><Plus className="w-3 h-3 rotate-45" /></button>
                       </div>
                    ))}
                    <div className="relative aspect-square border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center hover:bg-primary/5 cursor-pointer">
                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload('gallery', e)} className="absolute inset-0 opacity-0" />
                       <Plus className="w-5 h-5 text-muted-foreground" />
                    </div>
                 </div>
              </TabsContent>
            </div>

            <div className="p-6 bg-gray-50 border-t flex flex-row-reverse justify-start gap-4">
              <Button onClick={handleSaveVendor} disabled={isSaving} className="rounded-xl px-8 h-12 font-black bg-secondary text-white min-w-[150px]">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingVendor ? 'حفظ التغييرات' : 'تفعيل المعرض')}
              </Button>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="rounded-xl px-6 h-12 font-black">إلغاء</Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
