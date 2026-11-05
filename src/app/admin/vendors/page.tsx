'use client';

import { useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, doc, addDoc, serverTimestamp } from 'firebase/firestore';
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
  Trash2
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
  const vendorsQuery = query(collection(db, 'vendors'));
  const { data: vendors, loading } = useCollection(vendorsQuery);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // الحالة الموسعة لتشمل كافة تفاصيل المتجر
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
    reviews: [
       { name: 'عميل افتراضي', text: 'شغل ممتاز وجيد جداً', rating: 5, date: 'منذ يوم', avatar: '' }
    ],
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
        toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى ملء اسم المتجر والبريد الإلكتروني على الأقل." });
        return;
      }

      console.log("Saving Vendor Data...", vendorData);

      // تنظيف البيانات والتأكد من الأنواع الصحيحة قبل الحفظ
      const finalData = {
        business_name: vendorData.business_name,
        business_type: vendorData.business_type,
        city: vendorData.city,
        email: vendorData.email,
        description: vendorData.description,
        logo_url: vendorData.logo_base64, // استخدام base64 كـ url حالياً
        cover_url: vendorData.cover_base64,
        average_rating: Number(vendorData.average_rating),
        experience_years: Number(vendorData.experience_years),
        available_products: Number(vendorData.available_products),
        service_areas: vendorData.service_areas,
        approval_status: 'approved',
        created_at: serverTimestamp(),
        slug: vendorData.business_name.toLowerCase().replace(/\s+/g, '-'),
        reviews: vendorData.reviews,
        gallery: vendorData.gallery
      };

      const docRef = await addDoc(collection(db, 'vendors'), finalData);
      console.log("Vendor saved with ID: ", docRef.id);

      toast({ title: "تم تسجيل الشريك بنجاح", description: "تمت إضافة الشريك وتفعيل حسابه فوراً." });
      setIsAddOpen(false);
      // إعادة تعيين الحالة
      setVendorData({ 
        business_name: '', business_type: 'furniture_store', city: 'صنعاء', email: '', 
        description: '', logo_base64: '', cover_base64: '', average_rating: 5, 
        experience_years: '5', available_products: '0', service_areas: ['صنعاء'], 
        reviews: [], gallery: [] 
      });
    } catch (e: any) {
      console.error("Error adding vendor: ", e);
      toast({ 
        variant: "destructive", 
        title: "فشل في الحفظ", 
        description: "تأكد من اتصالك بالإنترنت وصلاحيات قاعدة البيانات. الخطأ: " + e.message 
      });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-secondary">إدارة الشركاء والمتاجر</h1>
          <p className="text-muted-foreground font-bold">التحكم في المتاجر، النجارين، والمصممين المعتمدين في المنصة.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="rounded-[15px] h-14 px-10 font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20">
          <Plus className="ml-2 w-6 h-6" /> إضافة شريك معتمد
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full max-w-xl group">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="ابحث عن شريك باسم المتجر أو المدينة..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-14 h-16 bg-white border-none shadow-sm rounded-2xl font-bold text-lg"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto w-full lg:w-auto p-2 bg-gray-100 rounded-[20px] shadow-inner">
          {[
            { id: 'all', name: 'الكل' },
            { id: 'furniture_store', name: 'المتاجر' },
            { id: 'carpenter', name: 'النجارين' },
            { id: 'interior_designer', name: 'المصممين' }
          ].map((f) => (
            <Button 
              key={f.id}
              variant={activeFilter === f.id ? 'default' : 'ghost'} 
              size="lg" 
              className={cn(
                "rounded-xl font-black h-12 px-8 whitespace-nowrap transition-all",
                activeFilter === f.id ? "bg-secondary text-white shadow-lg" : "text-muted-foreground hover:text-secondary"
              )}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.name}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
           <Loader2 className="w-16 h-16 animate-spin text-primary" />
           <p className="font-black text-muted-foreground text-xl">جاري تحميل قائمة الشركاء...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {vendors?.filter(v => {
            const matchSearch = v.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) || v.city?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchFilter = activeFilter === 'all' || v.business_type === activeFilter;
            return matchSearch && matchFilter;
          }).map((vendor: any) => (
            <Card key={vendor.id} className="rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all overflow-hidden bg-white flex flex-col group border border-transparent hover:border-primary/10">
              <div className="relative h-48 w-full overflow-hidden">
                <Image src={vendor.cover_url || `https://picsum.photos/seed/${vendor.id}/800/400`} alt={vendor.business_name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 right-6 flex items-center gap-4">
                   <div className="w-16 h-16 bg-white p-1 rounded-2xl shadow-2xl relative overflow-hidden shrink-0 border-2 border-white/20">
                      <Image src={vendor.logo_url || `https://picsum.photos/seed/${vendor.id}-logo/200/200`} alt="Logo" fill className="object-cover" />
                   </div>
                   <div className="text-white">
                      <h4 className="font-black text-xl flex items-center gap-2">{vendor.business_name} <CheckCircle2 className="w-5 h-5 text-primary fill-white" /></h4>
                      <p className="text-xs font-bold opacity-80 uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {vendor.city}
                      </p>
                   </div>
                </div>
              </div>
              <CardContent className="p-10 flex-1 flex flex-col space-y-8">
                 <p className="text-sm text-muted-foreground font-medium leading-loose line-clamp-3">{vendor.description || 'هذا الشريك يقدم خدمات ومنتجات عالية الجودة موثقة من قبل إيوان لضمان رضاكم.'}</p>
                 
                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-5 bg-gray-50 rounded-[20px] text-center space-y-1 shadow-inner border border-gray-100">
                       <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">التقييم العام</p>
                       <div className="flex items-center justify-center gap-1.5 text-amber-500 font-black text-lg">
                          <Star className="w-5 h-5 fill-current" /> {vendor.average_rating || '5.0'}
                       </div>
                    </div>
                    <div className="p-5 bg-gray-50 rounded-[20px] text-center space-y-1 shadow-inner border border-gray-100">
                       <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">نوع الشريك</p>
                       <p className="text-sm font-black text-secondary">{vendor.business_type === 'carpenter' ? 'ورشة تفصيل' : vendor.business_type === 'furniture_store' ? 'معرض أثاث' : 'مصمم ديكور'}</p>
                    </div>
                 </div>

                 <div className="flex gap-4 mt-auto pt-6 border-t border-gray-100">
                    <Link href={`/vendors/${vendor.id}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl h-14 border-gray-200 font-black text-lg hover:bg-gray-50 transition-all">معاينة المتجر</Button>
                    </Link>
                    <Button className="flex-1 rounded-xl h-14 bg-secondary text-white font-black text-lg shadow-xl shadow-secondary/10">إدارة الحساب</Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Vendor Dialog - Tabbed Interface */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden rounded-[3rem] border-none shadow-2xl font-cairo">
          <Tabs defaultValue="branding" className="w-full">
            <div className="bg-secondary p-12 pb-0 text-white relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 -translate-y-1/2 translate-x-1/2 rotate-45 rounded-full blur-3xl" />
              <DialogHeader className="mb-10 relative z-10">
                <DialogTitle className="text-4xl font-black">تسجيل شريك استراتيجي</DialogTitle>
                <DialogDescription className="text-gray-400 font-bold text-lg mt-3">قم بتقسيم بيانات الهوية التجارية والنشاط لضمان دقة العرض للعملاء.</DialogDescription>
              </DialogHeader>

              <TabsList className="bg-white/5 border-none w-full justify-start rounded-none h-16 p-0 gap-8">
                <TabsTrigger value="branding" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-lg gap-2 transition-all">
                  <Store className="w-5 h-5" /> الهوية التجارية
                </TabsTrigger>
                <TabsTrigger value="performance" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-lg gap-2 transition-all">
                  <Award className="w-5 h-5" /> الأداء والخدمة
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-lg gap-2 transition-all">
                  <Star className="w-5 h-5" /> الآراء
                </TabsTrigger>
                <TabsTrigger value="gallery" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-lg gap-2 transition-all">
                  <ImageIcon className="w-5 h-5" /> معرض الأعمال
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-12 max-h-[60vh] overflow-y-auto bg-white">
              {/* BRANDING TAB */}
              <TabsContent value="branding" className="space-y-10 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="text-lg font-black text-secondary flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-primary" /> شعار المتجر (Logo)
                     </label>
                     <div className="relative aspect-square w-32 border-4 border-dashed border-gray-100 rounded-[2rem] overflow-hidden bg-gray-50 hover:border-primary/40 transition-all cursor-pointer group">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        {vendorData.logo_base64 ? (
                          <Image src={vendorData.logo_base64} alt="Logo" fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
                             <Upload className="w-6 h-6 opacity-30" />
                          </div>
                        )}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-lg font-black text-secondary flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-primary" /> صورة الغلاف (Cover)
                     </label>
                     <div className="relative aspect-video w-full border-4 border-dashed border-gray-100 rounded-[2rem] overflow-hidden bg-gray-50 hover:border-primary/40 transition-all cursor-pointer group">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('cover', e)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        {vendorData.cover_base64 ? (
                          <Image src={vendorData.cover_base64} alt="Cover" fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
                             <Upload className="w-8 h-8 opacity-30" />
                          </div>
                        )}
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-lg font-black text-secondary mr-2 flex items-center gap-2"><Store className="w-4 h-4 text-primary" /> اسم المتجر / الورشة</label>
                    <Input value={vendorData.business_name} onChange={e => setVendorData({...vendorData, business_name: e.target.value})} placeholder="الاسم الرسمي" className="rounded-2xl h-14 bg-gray-50 border-none shadow-inner text-lg" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-lg font-black text-secondary mr-2 flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> البريد الإلكتروني</label>
                    <Input value={vendorData.email} onChange={e => setVendorData({...vendorData, email: e.target.value})} placeholder="professional@ewan.ye" className="rounded-2xl h-14 bg-gray-50 border-none shadow-inner text-lg" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-lg font-black text-secondary mr-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> المدينة المقر</label>
                    <select value={vendorData.city} onChange={e => setVendorData({...vendorData, city: e.target.value})} className="w-full h-14 rounded-2xl border-none bg-gray-50 px-6 font-black text-lg outline-none shadow-inner">
                      <option value="صنعاء">صنعاء</option>
                      <option value="عدن">عدن</option>
                      <option value="تعز">تعز</option>
                      <option value="المكلا">المكلا</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-lg font-black text-secondary mr-2 flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> نوع النشاط</label>
                    <select value={vendorData.business_type} onChange={e => setVendorData({...vendorData, business_type: e.target.value})} className="w-full h-14 rounded-2xl border-none bg-gray-50 px-6 font-black text-lg outline-none shadow-inner">
                      <option value="furniture_store">معرض أثاث</option>
                      <option value="carpenter">ورشة نجارة</option>
                      <option value="interior_designer">مصمم ديكور</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              {/* PERFORMANCE TAB */}
              <TabsContent value="performance" className="space-y-10 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-lg font-black text-secondary flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> سنوات الخبرة</label>
                    <Input type="number" value={vendorData.experience_years} onChange={e => setVendorData({...vendorData, experience_years: e.target.value})} className="rounded-2xl h-14 bg-gray-50 border-none shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-lg font-black text-secondary flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> منتج متاح</label>
                    <Input type="number" value={vendorData.available_products} onChange={e => setVendorData({...vendorData, available_products: e.target.value})} className="rounded-2xl h-14 bg-gray-50 border-none shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-lg font-black text-secondary flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> تقييم أولي</label>
                    <Input type="number" max="5" value={vendorData.average_rating} onChange={e => setVendorData({...vendorData, average_rating: Number(e.target.value)})} className="rounded-2xl h-14 bg-gray-50 border-none shadow-inner" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-lg font-black text-secondary flex items-center gap-2"><Info className="w-4 h-4 text-primary" /> نبذة تعريفية كاملة</label>
                  <Textarea value={vendorData.description} onChange={e => setVendorData({...vendorData, description: e.target.value})} placeholder="تحدث عن جودة الأخشاب، الضمانات، وتاريخ الورشة..." className="rounded-[25px] min-h-[150px] bg-gray-50 border-none shadow-inner py-6 px-6 text-lg leading-loose" />
                </div>
              </TabsContent>

              {/* REVIEWS TAB */}
              <TabsContent value="reviews" className="space-y-8 mt-0">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-black text-secondary">آراء العملاء الموثقة</h3>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={() => setVendorData(prev => ({...prev, reviews: [...prev.reviews, {name: 'عميل جديد', text: '', rating: 5, date: 'الآن', avatar: ''}]}))}>
                       <Plus className="w-4 h-4 ml-1" /> إضافة رأي يدوي
                    </Button>
                 </div>
                 <div className="grid grid-cols-1 gap-6">
                    {vendorData.reviews.map((rev, i) => (
                       <div key={i} className="p-6 bg-gray-50 rounded-[25px] flex items-start gap-6 relative group">
                          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                             <User className="w-6 h-6 text-gray-300" />
                          </div>
                          <div className="flex-1 space-y-3">
                             <Input value={rev.name} onChange={e => {
                                const newRev = [...vendorData.reviews];
                                newRev[i].name = e.target.value;
                                setVendorData({...vendorData, reviews: newRev});
                             }} placeholder="اسم العميل" className="bg-transparent border-b border-gray-200 h-8 rounded-none px-0 font-black" />
                             <Textarea value={rev.text} onChange={e => {
                                const newRev = [...vendorData.reviews];
                                newRev[i].text = e.target.value;
                                setVendorData({...vendorData, reviews: newRev});
                             }} placeholder="نص الرأي..." className="bg-transparent border-none min-h-[60px] p-0 focus:ring-0" />
                          </div>
                          <Button variant="ghost" size="icon" className="text-destructive absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                             const newRev = vendorData.reviews.filter((_, idx) => idx !== i);
                             setVendorData({...vendorData, reviews: newRev});
                          }}>
                             <Trash2 className="w-4 h-4" />
                          </Button>
                       </div>
                    ))}
                 </div>
              </TabsContent>

              {/* GALLERY TAB */}
              <TabsContent value="gallery" className="space-y-8 mt-0 text-center">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {vendorData.gallery.map((img, i) => (
                       <div key={i} className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg group">
                          <Image src={img} alt="Work" fill className="object-cover" />
                          <button onClick={() => setVendorData(prev => ({...prev, gallery: prev.gallery.filter((_, idx) => idx !== i)}))} className="absolute top-2 left-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                             <Plus className="w-4 h-4 rotate-45" />
                          </button>
                       </div>
                    ))}
                    <div className="relative aspect-[4/5] border-4 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-gray-50 transition-all cursor-pointer overflow-hidden">
                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload('gallery', e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                       <Sparkles className="w-10 h-10 text-primary opacity-20" />
                       <span className="text-xs font-black text-muted-foreground uppercase">أضف للغاليري</span>
                    </div>
                 </div>
              </TabsContent>
            </div>

            <div className="p-10 bg-gray-50 border-t flex justify-end gap-6">
              <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl px-12 h-16 font-black text-xl hover:bg-white transition-all">إلغاء الأمر</Button>
              <Button onClick={handleAddVendor} className="rounded-xl px-20 h-16 font-black text-xl bg-secondary text-white shadow-2xl shadow-secondary/20 hover:-translate-y-1 transition-all">تفعيل حساب الشريك ونشره</Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
