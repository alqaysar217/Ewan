'use client';

import { useState } from 'react';
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

export default function AdminVendors() {
  const db = useFirestore();
  // جلب معارض الأثاث فقط
  const vendorsQuery = query(
    collection(db, 'vendors'), 
    where('business_type', '==', 'furniture_store')
  );
  const { data: vendors, loading } = useCollection(vendorsQuery);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(null);

  const [vendorData, setVendorData] = useState({
    business_name: '',
    business_type: 'furniture_store',
    city: 'صنعاء',
    email: '',
    description: '',
    logo_base64: '',
    cover_base64: '',
    average_rating: 5,
    experience_years: '5',
    available_products: '0',
    service_areas: ['صنعاء'],
    reviews: [] as any[],
    gallery: [] as string[]
  });

  const handleImageUpload = (type: 'logo' | 'cover' | 'gallery', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'gallery') {
           setVendorData(prev => ({ ...prev, gallery: [...prev.gallery, reader.result as string] }));
        } else {
           setVendorData({ ...vendorData, [type === 'logo' ? 'logo_base64' : 'cover_base64']: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveVendor = async () => {
    try {
      if (!vendorData.business_name || !vendorData.email) {
        toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى ملء اسم المتجر والبريد الإلكتروني." });
        return;
      }

      const finalData = {
        ...vendorData,
        average_rating: Number(vendorData.average_rating),
        experience_years: Number(vendorData.experience_years),
        available_products: Number(vendorData.available_products),
        approval_status: 'approved',
        updated_at: serverTimestamp(),
        slug: vendorData.business_name.toLowerCase().replace(/\s+/g, '-'),
        logo_url: vendorData.logo_base64,
        cover_url: vendorData.cover_base64
      };

      if (editingVendor) {
        await updateDoc(doc(db, 'vendors', editingVendor.id), finalData);
        toast({ title: "تم تحديث بيانات المعرض بنجاح" });
      } else {
        await addDoc(collection(db, 'vendors'), {
          ...finalData,
          created_at: serverTimestamp(),
        });
        toast({ title: "تم تسجيل المعرض بنجاح" });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (e: any) {
      toast({ variant: "destructive", title: "فشل في الحفظ" });
    }
  };

  const handleDeleteVendor = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'vendors', id));
      toast({ title: "تم حذف المعرض نهائياً" });
    } catch (e) {
      toast({ variant: "destructive", title: "فشل في حذف المعرض" });
    }
  };

  const openEdit = (vendor: any) => {
    setEditingVendor(vendor);
    setVendorData({
      business_name: vendor.business_name || '',
      business_type: vendor.business_type || 'furniture_store',
      city: vendor.city || 'صنعاء',
      email: vendor.email || '',
      description: vendor.description || '',
      logo_base64: vendor.logo_url || '',
      cover_base64: vendor.cover_url || '',
      average_rating: vendor.average_rating || 5,
      experience_years: vendor.experience_years?.toString() || '5',
      available_products: vendor.available_products?.toString() || '0',
      service_areas: vendor.service_areas || ['صنعاء'],
      reviews: vendor.reviews || [],
      gallery: vendor.gallery || []
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingVendor(null);
    setVendorData({ 
      business_name: '', business_type: 'furniture_store', city: 'صنعاء', email: '', 
      description: '', logo_base64: '', cover_base64: '', average_rating: 5, 
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
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="rounded-xl h-14 px-8 font-black bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="w-5 h-5" /> إضافة معرض معتمد
        </Button>
      </div>

      <div className="relative w-full max-w-2xl group">
        <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
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
           <p className="font-black text-muted-foreground text-lg">جاري تحميل قائمة المتاجر...</p>
        </div>
      ) : vendors?.length === 0 ? (
        <div className="py-24 text-center space-y-4 bg-white rounded-2xl border-2 border-dashed border-gray-100">
           <Store className="w-16 h-16 text-gray-200 mx-auto" />
           <p className="text-lg font-black text-muted-foreground">لا توجد متاجر مضافة حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors?.filter(v => v.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) || v.city?.toLowerCase().includes(searchTerm.toLowerCase())).map((vendor: any) => (
            <Card key={vendor.id} className="rounded-2xl border-none shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white flex flex-col group border border-transparent hover:border-primary/10">
              <div className="relative h-48 w-full overflow-hidden">
                <Image src={vendor.cover_url || vendor.cover_base64 || `https://picsum.photos/seed/${vendor.id}/800/400`} alt={vendor.business_name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Actions Overlay */}
                <div className="absolute top-4 left-4 flex gap-2">
                   <Button size="icon" onClick={() => openEdit(vendor)} className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:border-primary transition-all">
                      <Edit className="w-5 h-5" />
                   </Button>
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive" className="w-10 h-10 rounded-lg shadow-xl">
                           <Trash2 className="w-5 h-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl border-none p-8 font-cairo">
                        <AlertDialogHeader className="space-y-4">
                           <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                              <AlertTriangle className="w-8 h-8" />
                           </div>
                           <AlertDialogTitle className="text-2xl font-black text-secondary text-center">تأكيد الحذف</AlertDialogTitle>
                           <AlertDialogDescription className="font-bold text-center text-muted-foreground leading-relaxed">
                              هل أنت متأكد من حذف معرض "{vendor.business_name}"؟ سيتم مسح كافة البيانات المرتبطة بهذا المتجر من المنصة نهائياً.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row-reverse gap-3 mt-6">
                           <AlertDialogAction onClick={() => handleDeleteVendor(vendor.id)} className="rounded-xl bg-destructive text-white font-black h-12">نعم، احذف</AlertDialogAction>
                           <AlertDialogCancel className="rounded-xl h-12 font-black border-none bg-gray-50">إلغاء</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                   </AlertDialog>
                </div>

                <div className="absolute bottom-4 right-6 left-6 flex items-center gap-3">
                   <div className="w-12 h-12 bg-white p-1 rounded-xl shadow-2xl relative overflow-hidden shrink-0">
                      <Image src={vendor.logo_url || vendor.logo_base64 || `https://picsum.photos/seed/${vendor.id}-logo/200/200`} alt="Logo" fill className="object-cover" />
                   </div>
                   <div className="text-white">
                      <h4 className="font-black text-lg flex items-center gap-1.5">{vendor.business_name} <CheckCircle2 className="w-4 h-4 text-primary fill-white" /></h4>
                      <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {vendor.city}
                      </p>
                   </div>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col space-y-5">
                 <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">{vendor.description || 'لا يوجد وصف متاح.'}</p>
                 
                 <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 rounded-xl text-center space-y-1 border border-gray-100">
                       <p className="text-[9px] text-muted-foreground font-black uppercase">التقييم</p>
                       <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-xs">
                          <Star className="w-3 h-3 fill-current" /> {vendor.average_rating || '5.0'}
                       </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center space-y-1 border border-gray-100">
                       <p className="text-[9px] text-muted-foreground font-black uppercase">المنتجات</p>
                       <p className="text-xs font-black text-secondary">{vendor.available_products || '0'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center space-y-1 border border-gray-100">
                       <p className="text-[9px] text-muted-foreground font-black uppercase">الخبرة</p>
                       <p className="text-xs font-black text-secondary">{vendor.experience_years || '1'} سنة</p>
                    </div>
                 </div>

                 <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                    <Link href={`/vendors/${vendor.id}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-lg h-10 border-gray-200 font-black hover:bg-gray-50 text-xs">معاينة</Button>
                    </Link>
                    <Button onClick={() => openEdit(vendor)} className="flex-1 rounded-lg h-10 bg-secondary text-white font-black shadow-sm text-xs">تعديل</Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Vendor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl font-cairo" dir="rtl">
          <Tabs defaultValue="branding" className="w-full">
            <div className="bg-secondary p-8 pb-0 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 -translate-y-1/2 translate-x-1/2 rotate-45 rounded-full blur-3xl" />
              <DialogHeader className="mb-6 relative z-10 text-right">
                <DialogTitle className="text-2xl md:text-3xl font-black">{editingVendor ? 'تعديل بيانات المعرض' : 'تسجيل شريك استراتيجي'}</DialogTitle>
                <DialogDescription className="text-gray-400 font-bold text-sm mt-1">أدخل بيانات الهوية التجارية والخدمات بدقة لضمان عرض احترافي.</DialogDescription>
              </DialogHeader>

              <TabsList className="bg-white/5 border-none w-full justify-start rounded-none h-14 p-0 gap-6 overflow-x-auto no-scrollbar">
                <TabsTrigger value="branding" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-base gap-2 transition-all">
                  <Store className="w-5 h-5" /> الهوية التجارية
                </TabsTrigger>
                <TabsTrigger value="performance" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-base gap-2 transition-all">
                  <Award className="w-5 h-5" /> الأداء والخدمة
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-base gap-2 transition-all">
                  <Star className="w-5 h-5" /> الآراء
                </TabsTrigger>
                <TabsTrigger value="gallery" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-base gap-2 transition-all">
                  <ImageIcon className="w-5 h-5" /> معرض الأعمال
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8 max-h-[50vh] overflow-y-auto bg-white text-right">
              <TabsContent value="branding" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-base font-black text-secondary flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" /> شعار المتجر (Logo)
                     </label>
                     <div className="relative aspect-square w-24 border-2 border-dashed border-gray-100 rounded-xl overflow-hidden bg-gray-50 hover:border-primary/40 transition-all cursor-pointer group">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        {vendorData.logo_base64 ? (
                          <Image src={vendorData.logo_base64} alt="Logo" fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground gap-1">
                             <Upload className="w-6 h-6 opacity-30" />
                             <span className="text-[8px] font-black uppercase">Upload</span>
                          </div>
                        )}
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-base font-black text-secondary flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" /> صورة الغلاف (Cover)
                     </label>
                     <div className="relative aspect-video w-full border-2 border-dashed border-gray-100 rounded-xl overflow-hidden bg-gray-50 hover:border-primary/40 transition-all cursor-pointer group">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('cover', e)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        {vendorData.cover_base64 ? (
                          <Image src={vendorData.cover_base64} alt="Cover" fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                             <Upload className="w-8 h-8 opacity-30" />
                             <span className="text-[10px] font-black uppercase">Select Cover</span>
                          </div>
                        )}
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-base font-black text-secondary flex items-center gap-2"><Store className="w-4 h-4 text-primary" /> اسم المتجر / المعرض</label>
                    <Input value={vendorData.business_name} onChange={e => setVendorData({...vendorData, business_name: e.target.value})} placeholder="الاسم التجاري" className="rounded-xl h-12 bg-gray-50 border-none text-base" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-base font-black text-secondary flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> البريد الإلكتروني</label>
                    <Input value={vendorData.email} onChange={e => setVendorData({...vendorData, email: e.target.value})} placeholder="store@ewan.ye" className="rounded-xl h-12 bg-gray-50 border-none text-base" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-base font-black text-secondary flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> المدينة</label>
                    <select value={vendorData.city} onChange={e => setVendorData({...vendorData, city: e.target.value})} className="w-full h-12 rounded-xl border-none bg-gray-50 px-4 font-black text-base outline-none">
                      <option value="صنعاء">صنعاء</option>
                      <option value="عدن">عدن</option>
                      <option value="تعز">تعز</option>
                      <option value="المكلا">المكلا</option>
                      <option value="إب">إب</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-base font-black text-secondary flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> نوع النشاط</label>
                    <select value={vendorData.business_type} disabled className="w-full h-12 rounded-xl border-none bg-gray-100 px-4 font-black text-base outline-none cursor-not-allowed">
                      <option value="furniture_store">معرض أثاث جاهز</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-base font-black text-secondary flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> سنوات الخبرة</label>
                    <Input type="number" value={vendorData.experience_years} onChange={e => setVendorData({...vendorData, experience_years: e.target.value})} className="rounded-xl h-12 bg-gray-50 border-none text-base" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-base font-black text-secondary flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> منتج متاح</label>
                    <Input type="number" value={vendorData.available_products} onChange={e => setVendorData({...vendorData, available_products: e.target.value})} className="rounded-xl h-12 bg-gray-50 border-none text-base" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-base font-black text-secondary flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> التقييم (5/5)</label>
                    <Input type="number" max="5" value={vendorData.average_rating} onChange={e => setVendorData({...vendorData, average_rating: Number(e.target.value)})} className="rounded-xl h-12 bg-gray-50 border-none text-base" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-base font-black text-secondary flex items-center gap-2"><Info className="w-4 h-4 text-primary" /> نبذة تعريفية</label>
                  <Textarea value={vendorData.description} onChange={e => setVendorData({...vendorData, description: e.target.value})} placeholder="تحدث عن فخامة الأثاث والضمانات..." className="rounded-xl min-h-[100px] bg-gray-50 border-none py-3 px-4 text-base" />
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 mt-0">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-black text-secondary flex items-center gap-2">
                       <Quote className="w-5 h-5 text-primary" /> آراء العملاء
                    </h3>
                    <Button variant="outline" size="sm" className="rounded-lg font-black h-9 px-4 border-primary text-primary" onClick={() => setVendorData(prev => ({...prev, reviews: [...prev.reviews, {name: 'عميل جديد', text: '', rating: 5, date: 'الآن', avatar: ''}]}))}>
                       <Plus className="w-3 h-3 ml-1" /> إضافة رأي
                    </Button>
                 </div>
                 <div className="space-y-3">
                    {vendorData.reviews.map((rev, i) => (
                       <div key={i} className="p-4 bg-gray-50 rounded-xl flex items-start gap-4 relative group border border-gray-100">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 border">
                             <User className="w-5 h-5 text-gray-300" />
                          </div>
                          <div className="flex-1 space-y-1">
                             <Input value={rev.name} onChange={e => {
                                const newRev = [...vendorData.reviews];
                                newRev[i].name = e.target.value;
                                setVendorData({...vendorData, reviews: newRev});
                             }} placeholder="اسم العميل" className="bg-transparent border-none h-6 p-0 font-black text-base focus:ring-0" />
                             <Textarea value={rev.text} onChange={e => {
                                const newRev = [...vendorData.reviews];
                                newRev[i].text = e.target.value;
                                setVendorData({...vendorData, reviews: newRev});
                             }} placeholder="نص الرأي..." className="bg-transparent border-none min-h-[40px] p-0 focus:ring-0 text-xs" />
                          </div>
                          <button onClick={() => setVendorData(prev => ({...prev, reviews: prev.reviews.filter((_, idx) => idx !== i)}))} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    ))}
                 </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4 mt-0 text-center">
                 <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    {vendorData.gallery.map((img, i) => (
                       <div key={i} className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-md border-2 border-white group">
                          <Image src={img} alt="Work" fill className="object-cover" />
                          <button onClick={() => setVendorData(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }))} className="absolute top-2 left-2 bg-destructive text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                             <Plus className="w-3 h-3 rotate-45" />
                          </button>
                       </div>
                    ))}
                    <div className="relative aspect-[4/5] border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer overflow-hidden">
                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload('gallery', e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                       <Sparkles className="w-5 h-5 text-primary" />
                       <span className="text-[8px] font-black text-muted-foreground uppercase">Add Photo</span>
                    </div>
                 </div>
              </TabsContent>
            </div>

            <div className="p-8 bg-gray-50 border-t flex flex-row-reverse justify-start gap-4">
              <Button onClick={handleSaveVendor} className="rounded-xl px-10 h-14 font-black text-lg bg-secondary text-white shadow-lg shadow-secondary/20 transition-all">
                {editingVendor ? 'حفظ التعديلات' : 'تفعيل ونشر المعرض'}
              </Button>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl px-8 h-14 font-black text-lg hover:bg-white">إلغاء</Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
