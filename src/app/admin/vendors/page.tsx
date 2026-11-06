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
  X,
  Calendar,
  Briefcase,
  Map
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
  const [newArea, setNewArea] = useState('');

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
    service_areas: [] as string[],
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

  const addArea = () => {
    if (newArea.trim() && !vendorData.service_areas.includes(newArea.trim())) {
      setVendorData(prev => ({ ...prev, service_areas: [...prev.service_areas, newArea.trim()] }));
      setNewArea('');
    }
  };

  const removeArea = (area: string) => {
    setVendorData(prev => ({ ...prev, service_areas: prev.service_areas.filter(a => a !== area) }));
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
      service_areas: vendor.service_areas || [],
      reviews: vendor.reviews || [],
      gallery: vendor.gallery || []
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingVendor(null);
    setVendorData({ 
      business_name: '', business_type: 'furniture_store', city: 'صنعاء', email: '', 
      description: '', logo_url: '', cover_url: '', average_rating: 5, 
      experience_years: '5', available_products: '0', service_areas: [], 
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
                        <MapPin className="w-3 h-3 text-primary" /> {vendor.service_areas?.[0] || vendor.city}
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
        <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl font-cairo" dir="rtl">
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
                  <Award className="w-4 h-4" /> الأداء والمناطق
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">
                  <Star className="w-4 h-4" /> مراجعات العملاء
                </TabsTrigger>
                <TabsTrigger value="gallery" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">
                  <ImageIcon className="w-4 h-4" /> معرض الأعمال
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto bg-white text-right">
              <TabsContent value="branding" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-sm font-black text-secondary flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" /> شعار المتجر الرسمي
                     </label>
                     <div className="relative aspect-square w-24 border-2 border-dashed border-gray-100 rounded-2xl overflow-hidden bg-gray-50 cursor-pointer hover:border-primary/40 transition-all flex items-center justify-center group">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} className="absolute inset-0 opacity-0 z-20 cursor-pointer" />
                        {vendorData.logo_url ? <Image src={vendorData.logo_url} alt="Logo" fill className="object-cover" /> : <Upload className="w-6 h-6 opacity-30 group-hover:scale-110 transition-transform" />}
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-sm font-black text-secondary flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" /> صورة غلاف الملف الشخصي
                     </label>
                     <div className="relative aspect-video w-full border-2 border-dashed border-gray-100 rounded-2xl overflow-hidden bg-gray-50 cursor-pointer hover:border-primary/40 transition-all flex items-center justify-center group">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('cover', e)} className="absolute inset-0 opacity-0 z-20 cursor-pointer" />
                        {vendorData.cover_url ? <Image src={vendorData.cover_url} alt="Cover" fill className="object-cover" /> : <Upload className="w-8 h-8 opacity-30 group-hover:scale-110 transition-transform" />}
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1 flex items-center gap-2"><Briefcase className="w-3 h-3 text-primary" /> الاسم التجاري للمعرض</label>
                    <Input value={vendorData.business_name} onChange={e => setVendorData({...vendorData, business_name: e.target.value})} placeholder="مثال: عالم الأثاث الفاخر" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1 flex items-center gap-2"><Mail className="w-3 h-3 text-primary" /> البريد الإلكتروني للتواصل</label>
                    <Input value={vendorData.email} onChange={e => setVendorData({...vendorData, email: e.target.value})} placeholder="store@ewan.ye" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary mr-1 flex items-center gap-2"><Info className="w-3 h-3 text-primary" /> نبذة تعريفية وقصة المتجر</label>
                  <Textarea value={vendorData.description} onChange={e => setVendorData({...vendorData, description: e.target.value})} placeholder="اكتب وصفاً جذاباً لخدماتك ومنتجاتك..." className="rounded-xl min-h-[100px] bg-gray-50 border-none shadow-inner" />
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1 flex items-center gap-2"><Clock className="w-3 h-3 text-primary" /> سنوات الخبرة</label>
                    <Input type="number" value={vendorData.experience_years} onChange={e => setVendorData({...vendorData, experience_years: e.target.value})} placeholder="5" className="rounded-xl h-12 bg-gray-50 border-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1 flex items-center gap-2"><Package className="w-3 h-3 text-primary" /> عدد المنتجات</label>
                    <Input type="number" value={vendorData.available_products} onChange={e => setVendorData({...vendorData, available_products: e.target.value})} placeholder="50" className="rounded-xl h-12 bg-gray-50 border-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1 flex items-center gap-2"><Star className="w-3 h-3 text-primary" /> التقييم العام (0-5)</label>
                    <Input type="number" max="5" value={vendorData.average_rating} onChange={e => setVendorData({...vendorData, average_rating: Number(e.target.value)})} placeholder="4.5" className="rounded-xl h-12 bg-gray-50 border-none" />
                  </div>
                </div>

                <div className="space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <label className="text-sm font-black text-secondary flex items-center gap-2"><Map className="w-4 h-4 text-primary" /> نطاق التغطية ومناطق الخدمة</label>
                  <div className="flex gap-2">
                    <Input 
                      value={newArea} 
                      onChange={e => setNewArea(e.target.value)} 
                      placeholder="أدخل اسم المدينة أو المنطقة (مثال: عدن)" 
                      className="rounded-xl h-12 bg-white border-none shadow-sm flex-1" 
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addArea())}
                    />
                    <Button onClick={addArea} type="button" className="h-12 px-6 rounded-xl bg-primary text-white font-black">إضافة</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {vendorData.service_areas.length > 0 ? vendorData.service_areas.map((area, idx) => (
                      <Badge key={idx} className="bg-white text-secondary border border-primary/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold shadow-sm">
                        {area}
                        <button onClick={() => removeArea(area)} className="text-destructive hover:scale-110 transition-transform"><X className="w-3 h-3" /></button>
                      </Badge>
                    )) : (
                      <p className="text-xs text-muted-foreground italic mr-1">لم يتم تحديد مناطق تغطية بعد.</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 mt-0">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-black text-secondary flex items-center gap-2"><Quote className="w-4 h-4 text-primary" /> مراجعات العملاء المثبتة</h3>
                    <Button variant="outline" size="sm" onClick={() => setVendorData(prev => ({...prev, reviews: [...prev.reviews, {name: '', text: '', rating: 5, date: 'الآن'}]}))} className="rounded-lg h-9 font-bold">+ إضافة مراجعة</Button>
                 </div>
                 
                 <div className="space-y-4">
                   {vendorData.reviews.length > 0 ? vendorData.reviews.map((rev, i) => (
                      <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group space-y-4 shadow-inner">
                         <button onClick={() => setVendorData(prev => ({...prev, reviews: prev.reviews.filter((_, idx) => idx !== i)}))} className="absolute top-4 left-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-muted-foreground mr-1 flex items-center gap-1"><User className="w-3 h-3" /> اسم العميل</label>
                               <Input value={rev.name} onChange={e => {
                                  const newRev = [...vendorData.reviews];
                                  newRev[i].name = e.target.value;
                                  setVendorData({...vendorData, reviews: newRev});
                               }} placeholder="مثال: محمد الريمي" className="bg-white border-none h-10 font-bold rounded-lg" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-muted-foreground mr-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> تاريخ التقييم</label>
                               <Input value={rev.date} onChange={e => {
                                  const newRev = [...vendorData.reviews];
                                  newRev[i].date = e.target.value;
                                  setVendorData({...vendorData, reviews: newRev});
                               }} placeholder="مثال: منذ أسبوعين" className="bg-white border-none h-10 font-bold rounded-lg" />
                            </div>
                         </div>

                         <div className="space-y-1">
                            <label className="text-[10px] font-black text-muted-foreground mr-1 flex items-center gap-1"><Quote className="w-3 h-3" /> نص المراجعة</label>
                            <Textarea value={rev.text} onChange={e => {
                               const newRev = [...vendorData.reviews];
                               newRev[i].text = e.target.value;
                               setVendorData({...vendorData, reviews: newRev});
                            }} placeholder="اكتب تجربة العميل بوضوح..." className="bg-white border-none min-h-[60px] font-medium rounded-lg shadow-sm" />
                         </div>

                         <div className="flex items-center gap-4">
                            <label className="text-[10px] font-black text-muted-foreground flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-current" /> التقييم:</label>
                            <select value={rev.rating} onChange={e => {
                               const newRev = [...vendorData.reviews];
                               newRev[i].rating = Number(e.target.value);
                               setVendorData({...vendorData, reviews: newRev});
                            }} className="bg-white border-none rounded-lg h-8 px-3 font-black text-xs outline-none shadow-sm">
                               {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} نجوم</option>)}
                            </select>
                         </div>
                      </div>
                   )) : (
                     <div className="py-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center gap-2 opacity-50">
                        <MessageSquare className="w-10 h-10" />
                        <p className="text-xs font-black">لا توجد مراجعات مضافة لهذا المتجر.</p>
                     </div>
                   )}
                 </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4 mt-0">
                 <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-secondary flex items-center gap-2"><ImageIcon className="w-4 h-4 text-primary" /> صور المعرض وبورتفوليو الأعمال</h3>
                    <Badge variant="outline" className="font-bold text-[10px]">{vendorData.gallery.length} صور مضافة</Badge>
                 </div>
                 <div className="grid grid-cols-4 gap-3">
                    {vendorData.gallery.map((img, i) => (
                       <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-md group">
                          <Image src={img} alt="Work" fill className="object-cover" />
                          <button onClick={() => setVendorData(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }))} className="absolute top-1 left-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><Trash2 className="w-3 h-3" /></button>
                       </div>
                    ))}
                    <div className="relative aspect-square border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center hover:bg-primary/5 cursor-pointer transition-all group overflow-hidden">
                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload('gallery', e)} className="absolute inset-0 opacity-0 z-20 cursor-pointer" />
                       <Plus className="w-6 h-6 text-muted-foreground group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-black text-muted-foreground mt-1">إضافة صورة</span>
                    </div>
                 </div>
              </TabsContent>
            </div>

            <div className="p-6 bg-gray-50 border-t flex flex-row-reverse justify-start gap-4">
              <Button onClick={handleSaveVendor} disabled={isSaving} className="rounded-xl px-12 h-14 font-black bg-secondary text-white min-w-[180px] shadow-xl shadow-secondary/10">
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : (editingVendor ? 'حفظ التغييرات' : 'تفعيل المعرض')}
              </Button>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="rounded-xl px-8 h-14 font-black">إلغاء</Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}