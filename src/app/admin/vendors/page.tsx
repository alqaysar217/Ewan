
'use client';

import { useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
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
  Quote
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';

export default function AdminVendors() {
  const db = useFirestore();
  // جلب معارض الأثاث فقط وحصرياً
  const vendorsQuery = query(
    collection(db, 'vendors'), 
    where('business_type', '==', 'furniture_store')
  );
  const { data: vendors, loading } = useCollection(vendorsQuery);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

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

  const handleAddVendor = async () => {
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
        created_at: serverTimestamp(),
        slug: vendorData.business_name.toLowerCase().replace(/\s+/g, '-'),
        // تخزين الصور كنصوص طويلة (Base64) لتجاوز قيود التخزين
        logo_url: vendorData.logo_base64,
        cover_url: vendorData.cover_base64
      };

      await addDoc(collection(db, 'vendors'), finalData);

      toast({ title: "تم تسجيل المعرض بنجاح" });
      setIsAddOpen(false);
      setVendorData({ 
        business_name: '', business_type: 'furniture_store', city: 'صنعاء', email: '', 
        description: '', logo_base64: '', cover_base64: '', average_rating: 5, 
        experience_years: '5', available_products: '0', service_areas: ['صنعاء'], 
        reviews: [], gallery: [] 
      });
    } catch (e: any) {
      toast({ variant: "destructive", title: "فشل في الحفظ", description: "تأكد من الصلاحيات والاتصال." });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-secondary">إدارة معارض الأثاث</h1>
          <p className="text-muted-foreground font-bold">التحكم الحصري في المتاجر والمعارض الكبرى المعتمدة.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="rounded-[15px] h-14 px-10 font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 flex items-center gap-2">
          <Plus className="w-6 h-6" /> إضافة معرض معتمد
        </button>
      </div>

      <div className="relative w-full max-w-2xl group">
        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="ابحث عن معرض بالاسم أو المدينة..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-14 h-16 bg-white border-none shadow-sm rounded-2xl font-bold text-lg"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
           <Loader2 className="w-16 h-16 animate-spin text-primary" />
           <p className="font-black text-muted-foreground text-xl">جاري تحميل قائمة المتاجر الحقيقية...</p>
        </div>
      ) : vendors?.length === 0 ? (
        <div className="py-32 text-center space-y-4 bg-white rounded-[2rem] border-2 border-dashed">
           <Store className="w-20 h-20 text-gray-200 mx-auto" />
           <p className="text-xl font-black text-muted-foreground">لا توجد متاجر مضافة حالياً. ابدأ بإضافة أول معرض!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors?.filter(v => v.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) || v.city?.toLowerCase().includes(searchTerm.toLowerCase())).map((vendor: any) => (
            <Card key={vendor.id} className="rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all overflow-hidden bg-white flex flex-col group border border-transparent hover:border-primary/10">
              <div className="relative h-56 w-full overflow-hidden">
                <Image src={vendor.cover_url || vendor.cover_base64 || `https://picsum.photos/seed/${vendor.id}/800/400`} alt={vendor.business_name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-6 right-8 left-8 flex items-center gap-4">
                   <div className="w-16 h-16 bg-white p-1 rounded-2xl shadow-2xl relative overflow-hidden shrink-0 border-2 border-white/20">
                      <Image src={vendor.logo_url || vendor.logo_base64 || `https://picsum.photos/seed/${vendor.id}-logo/200/200`} alt="Logo" fill className="object-cover" />
                   </div>
                   <div className="text-white">
                      <h4 className="font-black text-xl flex items-center gap-2">{vendor.business_name} <CheckCircle2 className="w-5 h-5 text-primary fill-white" /></h4>
                      <p className="text-xs font-bold opacity-80 uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {vendor.city}
                      </p>
                   </div>
                </div>
              </div>
              <CardContent className="p-8 flex-1 flex flex-col space-y-6">
                 <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3">{vendor.description || 'لم يتم إضافة وصف لهذا المعرض بعد.'}</p>
                 
                 <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl text-center space-y-1 border border-gray-100 shadow-inner">
                       <p className="text-[10px] text-muted-foreground font-black uppercase">التقييم</p>
                       <div className="flex items-center justify-center gap-1 text-amber-500 font-black">
                          <Star className="w-4 h-4 fill-current" /> {vendor.average_rating || '5.0'}
                       </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl text-center space-y-1 border border-gray-100 shadow-inner">
                       <p className="text-[10px] text-muted-foreground font-black uppercase">المنتجات</p>
                       <p className="text-sm font-black text-secondary">{vendor.available_products || '0'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl text-center space-y-1 border border-gray-100 shadow-inner">
                       <p className="text-[10px] text-muted-foreground font-black uppercase">الخبرة</p>
                       <p className="text-sm font-black text-secondary">{vendor.experience_years || '1'} سنة</p>
                    </div>
                 </div>

                 <div className="flex gap-3 mt-auto pt-6 border-t border-gray-50">
                    <Link href={`/vendors/${vendor.id}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl h-12 border-gray-200 font-black hover:bg-gray-50">معاينة</Button>
                    </Link>
                    <Button className="flex-1 rounded-xl h-12 bg-secondary text-white font-black shadow-lg">إدارة</Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Vendor Dialog - RTL FIXED AND COMPACT */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-[3rem] border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] font-cairo" dir="rtl">
          <Tabs defaultValue="branding" className="w-full">
            <div className="bg-secondary p-10 pb-0 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 -translate-y-1/2 translate-x-1/2 rotate-45 rounded-full blur-3xl" />
              <DialogHeader className="mb-8 relative z-10 text-right">
                <DialogTitle className="text-3xl md:text-4xl font-black">تسجيل شريك استراتيجي</DialogTitle>
                <DialogDescription className="text-gray-400 font-bold text-lg mt-2">قم بتقسيم بيانات الهوية التجارية والنشاط لضمان دقة العرض للعملاء.</DialogDescription>
              </DialogHeader>

              <TabsList className="bg-white/5 border-none w-full justify-start rounded-none h-16 p-0 gap-8 overflow-x-auto no-scrollbar">
                <TabsTrigger value="branding" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-lg gap-3 transition-all">
                  <Store className="w-6 h-6" /> الهوية التجارية
                </TabsTrigger>
                <TabsTrigger value="performance" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-lg gap-3 transition-all">
                  <Award className="w-6 h-6" /> الأداء والخدمة
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-lg gap-3 transition-all">
                  <Star className="w-6 h-6" /> الآراء
                </TabsTrigger>
                <TabsTrigger value="gallery" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-lg gap-3 transition-all">
                  <ImageIcon className="w-6 h-6" /> معرض الأعمال
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-10 max-h-[50vh] overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-200 text-right">
              <TabsContent value="branding" className="space-y-8 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-lg font-black text-secondary flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" /> شعار العلامة التجارية (Logo)
                     </label>
                     <div className="relative aspect-square w-32 border-4 border-dashed border-gray-100 rounded-[2rem] overflow-hidden bg-gray-50 hover:border-primary/40 transition-all cursor-pointer group">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        {vendorData.logo_base64 ? (
                          <Image src={vendorData.logo_base64} alt="Logo" fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                             <Upload className="w-8 h-8 opacity-30" />
                             <span className="text-[10px] font-black uppercase">Upload</span>
                          </div>
                        )}
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-lg font-black text-secondary flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" /> صورة غلاف المتجر (Cover)
                     </label>
                     <div className="relative aspect-video w-full border-4 border-dashed border-gray-100 rounded-[2rem] overflow-hidden bg-gray-50 hover:border-primary/40 transition-all cursor-pointer group">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('cover', e)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        {vendorData.cover_base64 ? (
                          <Image src={vendorData.cover_base64} alt="Cover" fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                             <Upload className="w-10 h-10 opacity-30" />
                             <span className="text-xs font-black uppercase tracking-widest">Select Cover Photo</span>
                          </div>
                        )}
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-lg font-black text-secondary flex items-center gap-2"><Store className="w-5 h-5 text-primary" /> اسم المتجر / المعرض</label>
                    <Input value={vendorData.business_name} onChange={e => setVendorData({...vendorData, business_name: e.target.value})} placeholder="الاسم التجاري الرسمي" className="rounded-2xl h-14 bg-gray-50 border-none shadow-inner text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-lg font-black text-secondary flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /> البريد الإلكتروني المهني</label>
                    <Input value={vendorData.email} onChange={e => setVendorData({...vendorData, email: e.target.value})} placeholder="store@ewan.ye" className="rounded-2xl h-14 bg-gray-50 border-none shadow-inner text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-lg font-black text-secondary flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> المقر الرئيسي (المدينة)</label>
                    <select value={vendorData.city} onChange={e => setVendorData({...vendorData, city: e.target.value})} className="w-full h-14 rounded-2xl border-none bg-gray-50 px-6 font-black text-lg outline-none shadow-inner">
                      <option value="صنعاء">صنعاء</option>
                      <option value="عدن">عدن</option>
                      <option value="تعز">تعز</option>
                      <option value="المكلا">المكلا</option>
                      <option value="إب">إب</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-lg font-black text-secondary flex items-center gap-2"><Layers className="w-5 h-5 text-primary" /> نوع النشاط التجاري</label>
                    <select value={vendorData.business_type} disabled className="w-full h-14 rounded-2xl border-none bg-gray-100 px-6 font-black text-lg outline-none shadow-inner cursor-not-allowed">
                      <option value="furniture_store">معرض أثاث جاهز</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-8 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-lg font-black text-secondary flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> سنوات الخبرة</label>
                    <Input type="number" value={vendorData.experience_years} onChange={e => setVendorData({...vendorData, experience_years: e.target.value})} className="rounded-2xl h-14 bg-gray-50 border-none shadow-inner text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-lg font-black text-secondary flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> منتج متاح</label>
                    <Input type="number" value={vendorData.available_products} onChange={e => setVendorData({...vendorData, available_products: e.target.value})} className="rounded-2xl h-14 bg-gray-50 border-none shadow-inner text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-lg font-black text-secondary flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> التقييم الأولي (5/5)</label>
                    <Input type="number" max="5" value={vendorData.average_rating} onChange={e => setVendorData({...vendorData, average_rating: Number(e.target.value)})} className="rounded-2xl h-14 bg-gray-50 border-none shadow-inner text-lg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-lg font-black text-secondary flex items-center gap-2"><Info className="w-5 h-5 text-primary" /> نبذة تعريفية كاملة (عن المتجر)</label>
                  <Textarea value={vendorData.description} onChange={e => setVendorData({...vendorData, description: e.target.value})} placeholder="تحدث عن فخامة الأثاث، بلد المنشأ، والضمانات الممنوحة للعملاء..." className="rounded-[1.5rem] min-h-[140px] bg-gray-50 border-none shadow-inner py-4 px-6 text-lg leading-relaxed" />
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6 mt-0">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-black text-secondary flex items-center gap-2">
                       <Quote className="w-6 h-6 text-primary" /> آراء العملاء الموثقة
                    </h3>
                    <Button variant="outline" size="sm" className="rounded-xl font-black h-10 px-6 border-primary text-primary hover:bg-primary/5" onClick={() => setVendorData(prev => ({...prev, reviews: [...prev.reviews, {name: 'عميل جديد', text: '', rating: 5, date: 'الآن', avatar: ''}]}))}>
                       <Plus className="w-4 h-4 ml-2" /> إضافة رأي يدوي
                    </Button>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    {vendorData.reviews.map((rev, i) => (
                       <div key={i} className="p-6 bg-gray-50 rounded-[2rem] flex items-start gap-6 relative group border border-gray-100 shadow-sm">
                          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border">
                             <User className="w-6 h-6 text-gray-300" />
                          </div>
                          <div className="flex-1 space-y-2">
                             <Input value={rev.name} onChange={e => {
                                const newRev = [...vendorData.reviews];
                                newRev[i].name = e.target.value;
                                setVendorData({...vendorData, reviews: newRev});
                             }} placeholder="اسم العميل" className="bg-transparent border-none h-8 p-0 font-black text-lg focus:ring-0" />
                             <Textarea value={rev.text} onChange={e => {
                                const newRev = [...vendorData.reviews];
                                newRev[i].text = e.target.value;
                                setVendorData({...vendorData, reviews: newRev});
                             }} placeholder="اكتب نص الرأي هنا..." className="bg-transparent border-none min-h-[60px] p-0 focus:ring-0 text-sm leading-relaxed" />
                          </div>
                          <button onClick={() => {
                             const newRev = vendorData.reviews.filter((_, idx) => idx !== i);
                             setVendorData({...vendorData, reviews: newRev});
                          }} className="text-destructive absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Trash2 className="w-5 h-5" />
                          </button>
                       </div>
                    ))}
                 </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6 mt-0 text-center">
                 <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {vendorData.gallery.map((img, i) => (
                       <div key={i} className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden shadow-xl border-4 border-white group">
                          <Image src={img} alt="Work" fill className="object-cover" />
                          <button onClick={() => setVendorData(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }))} className="absolute top-2 left-2 bg-destructive text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl">
                             <Plus className="w-4 h-4 rotate-45" />
                          </button>
                       </div>
                    ))}
                    <div className="relative aspect-[4/5] border-4 border-dashed border-gray-100 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer overflow-hidden group">
                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload('gallery', e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Sparkles className="w-6 h-6 text-primary" />
                       </div>
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Add Photo</span>
                    </div>
                 </div>
              </TabsContent>
            </div>

            <div className="p-10 bg-gray-50 border-t flex flex-row-reverse justify-start gap-4">
              <Button onClick={handleAddVendor} className="rounded-2xl px-12 h-16 font-black text-lg bg-secondary text-white shadow-2xl shadow-secondary/20 hover:-translate-y-1 transition-all">تفعيل حساب المعرض ونشره</Button>
              <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-2xl px-10 h-16 font-black text-lg hover:bg-white transition-all">إلغاء الأمر</Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

