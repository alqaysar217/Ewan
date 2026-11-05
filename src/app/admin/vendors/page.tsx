'use client';

import { useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, addDoc, serverTimestamp } from 'firebase/firestore';
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
  const vendorsQuery = query(collection(db, 'vendors'));
  const { data: vendors, loading } = useCollection(vendorsQuery);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
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

      const finalData = {
        business_name: vendorData.business_name,
        business_type: vendorData.business_type,
        city: vendorData.city,
        email: vendorData.email,
        description: vendorData.description,
        logo_url: vendorData.logo_base64,
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

      await addDoc(collection(db, 'vendors'), finalData);

      toast({ title: "تم تسجيل الشريك بنجاح", description: "تمت إضافة الشريك وتفعيل حسابه فوراً." });
      setIsAddOpen(false);
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
        description: "تأكد من اتصالك بالإنترنت وصلاحيات قاعدة البيانات." 
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary">إدارة الشركاء والمتاجر</h1>
          <p className="text-muted-foreground font-bold">التحكم في المتاجر، النجارين، والمصممين المعتمدين في المنصة.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="rounded-[12px] h-12 px-8 font-black bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="w-5 h-5" /> إضافة شريك معتمد
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-xl group">
          <div className="absolute inset-0 bg-primary/5 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="ابحث عن شريك باسم المتجر أو المدينة..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-12 h-14 bg-white border-none shadow-sm rounded-xl font-bold text-base"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full lg:w-auto p-1 bg-gray-100 rounded-xl shadow-inner">
          {[
            { id: 'all', name: 'الكل' },
            { id: 'furniture_store', name: 'المتاجر' },
            { id: 'carpenter', name: 'النجارين' },
            { id: 'interior_designer', name: 'المصممين' }
          ].map((f) => (
            <button 
              key={f.id}
              className={cn(
                "rounded-lg font-black h-10 px-6 whitespace-nowrap transition-all text-sm",
                activeFilter === f.id ? "bg-white text-secondary shadow-md" : "text-muted-foreground hover:text-secondary"
              )}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <Loader2 className="w-12 h-12 animate-spin text-primary" />
           <p className="font-black text-muted-foreground text-lg">جاري تحميل قائمة الشركاء...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors?.filter(v => {
            const matchSearch = v.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) || v.city?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchFilter = activeFilter === 'all' || v.business_type === activeFilter;
            return matchSearch && matchFilter;
          }).map((vendor: any) => (
            <Card key={vendor.id} className="rounded-[2rem] border-none shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white flex flex-col group border border-transparent hover:border-primary/10">
              <div className="relative h-44 w-full overflow-hidden">
                <Image src={vendor.cover_url || `https://picsum.photos/seed/${vendor.id}/800/400`} alt={vendor.business_name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 right-6 left-6 flex items-center gap-3">
                   <div className="w-14 h-14 bg-white p-1 rounded-xl shadow-xl relative overflow-hidden shrink-0 border-2 border-white/20">
                      <Image src={vendor.logo_url || `https://picsum.photos/seed/${vendor.id}-logo/200/200`} alt="Logo" fill className="object-cover" />
                   </div>
                   <div className="text-white">
                      <h4 className="font-black text-lg flex items-center gap-1.5">{vendor.business_name} <CheckCircle2 className="w-4 h-4 text-primary fill-white" /></h4>
                      <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {vendor.city}
                      </p>
                   </div>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col space-y-4">
                 <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">{vendor.description || 'هذا الشريك يقدم خدمات ومنتجات عالية الجودة موثقة من قبل إيوان لضمان رضاكم.'}</p>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-[15px] text-center space-y-1 shadow-inner border border-gray-100">
                       <p className="text-[9px] text-muted-foreground font-black uppercase tracking-wider">التقييم</p>
                       <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-sm">
                          <Star className="w-3.5 h-3.5 fill-current" /> {vendor.average_rating || '5.0'}
                       </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-[15px] text-center space-y-1 shadow-inner border border-gray-100">
                       <p className="text-[9px] text-muted-foreground font-black uppercase tracking-wider">النشاط</p>
                       <p className="text-[10px] font-black text-secondary truncate">{vendor.business_type === 'carpenter' ? 'ورشة تفصيل' : vendor.business_type === 'furniture_store' ? 'معرض أثاث' : 'مصمم ديكور'}</p>
                    </div>
                 </div>

                 <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                    <Link href={`/vendors/${vendor.id}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-lg h-10 border-gray-200 font-black text-xs hover:bg-gray-50 transition-all">معاينة</Button>
                    </Link>
                    <Button className="flex-1 rounded-lg h-10 bg-secondary text-white font-black text-xs shadow-md">إدارة</Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Vendor Dialog - Fixed RTL and Height */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl font-cairo" dir="rtl">
          <Tabs defaultValue="branding" className="w-full">
            <div className="bg-secondary p-6 pb-0 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 -translate-y-1/2 translate-x-1/2 rotate-45 rounded-full blur-3xl" />
              <DialogHeader className="mb-4 relative z-10 text-right">
                <DialogTitle className="text-2xl md:text-3xl font-black">تسجيل شريك استراتيجي</DialogTitle>
                <DialogDescription className="text-gray-400 font-bold text-sm mt-1">قم بتقسيم بيانات الهوية التجارية والنشاط لضمان دقة العرض للعملاء.</DialogDescription>
              </DialogHeader>

              <TabsList className="bg-white/5 border-none w-full justify-start rounded-none h-12 p-0 gap-4 overflow-x-auto no-scrollbar">
                <TabsTrigger value="branding" className="rounded-none h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2 transition-all">
                  <Store className="w-4 h-4" /> الهوية التجارية
                </TabsTrigger>
                <TabsTrigger value="performance" className="rounded-none h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2 transition-all">
                  <Award className="w-4 h-4" /> الأداء والخدمة
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2 transition-all">
                  <Star className="w-4 h-4" /> الآراء
                </TabsTrigger>
                <TabsTrigger value="gallery" className="rounded-none h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2 transition-all">
                  <ImageIcon className="w-4 h-4" /> معرض الأعمال
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8 max-h-[50vh] overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-200 text-right">
              <TabsContent value="branding" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-sm font-black text-secondary flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" /> شعار المتجر (Logo)
                     </label>
                     <div className="relative aspect-square w-20 border-2 border-dashed border-gray-100 rounded-xl overflow-hidden bg-gray-50 hover:border-primary/40 transition-all cursor-pointer group">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        {vendorData.logo_base64 ? (
                          <Image src={vendorData.logo_base64} alt="Logo" fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
                             <Upload className="w-4 h-4 opacity-30" />
                          </div>
                        )}
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-black text-secondary flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-primary" /> صورة الغلاف (Cover)
                     </label>
                     <div className="relative aspect-video w-full border-2 border-dashed border-gray-100 rounded-xl overflow-hidden bg-gray-50 hover:border-primary/40 transition-all cursor-pointer group">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('cover', e)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        {vendorData.cover_base64 ? (
                          <Image src={vendorData.cover_base64} alt="Cover" fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
                             <Upload className="w-5 h-5 opacity-30" />
                          </div>
                        )}
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-black text-secondary flex items-center gap-2"><Store className="w-4 h-4 text-primary" /> اسم المتجر / الورشة</label>
                    <Input value={vendorData.business_name} onChange={e => setVendorData({...vendorData, business_name: e.target.value})} placeholder="الاسم الرسمي للمنشأة" className="rounded-lg h-11 bg-gray-50 border-none shadow-inner" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-black text-secondary flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> البريد الإلكتروني</label>
                    <Input value={vendorData.email} onChange={e => setVendorData({...vendorData, email: e.target.value})} placeholder="professional@ewan.ye" className="rounded-lg h-11 bg-gray-50 border-none shadow-inner" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-black text-secondary flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> المدينة المقر</label>
                    <select value={vendorData.city} onChange={e => setVendorData({...vendorData, city: e.target.value})} className="w-full h-11 rounded-lg border-none bg-gray-50 px-4 font-bold outline-none shadow-inner text-sm">
                      <option value="صنعاء">صنعاء</option>
                      <option value="عدن">عدن</option>
                      <option value="تعز">تعز</option>
                      <option value="المكلا">المكلا</option>
                      <option value="إب">إب</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-black text-secondary flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> نوع النشاط</label>
                    <select value={vendorData.business_type} onChange={e => setVendorData({...vendorData, business_type: e.target.value})} className="w-full h-11 rounded-lg border-none bg-gray-50 px-4 font-bold outline-none shadow-inner text-sm">
                      <option value="furniture_store">معرض أثاث</option>
                      <option value="carpenter">ورشة نجارة</option>
                      <option value="interior_designer">مصمم ديكور</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-black text-secondary flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> سنوات الخبرة</label>
                    <Input type="number" value={vendorData.experience_years} onChange={e => setVendorData({...vendorData, experience_years: e.target.value})} className="rounded-lg h-11 bg-gray-50 border-none shadow-inner" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-black text-secondary flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> منتج متاح</label>
                    <Input type="number" value={vendorData.available_products} onChange={e => setVendorData({...vendorData, available_products: e.target.value})} className="rounded-lg h-11 bg-gray-50 border-none shadow-inner" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-black text-secondary flex items-center gap-2"><Star className="w-4 h-4 text-primary" /> تقييم أولي</label>
                    <Input type="number" max="5" value={vendorData.average_rating} onChange={e => setVendorData({...vendorData, average_rating: Number(e.target.value)})} className="rounded-lg h-11 bg-gray-50 border-none shadow-inner" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-black text-secondary flex items-center gap-2"><Info className="w-4 h-4 text-primary" /> نبذة تعريفية كاملة</label>
                  <Textarea value={vendorData.description} onChange={e => setVendorData({...vendorData, description: e.target.value})} placeholder="تحدث عن جودة الأخشاب، الضمانات، وتاريخ الورشة..." className="rounded-xl min-h-[100px] bg-gray-50 border-none shadow-inner py-3 px-4 text-sm leading-relaxed" />
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 mt-0">
                 <div className="flex justify-between items-center mb-1">
                    <h3 className="text-base font-black text-secondary flex items-center gap-2">
                       <Quote className="w-4 h-4 text-primary" /> آراء العملاء الموثقة
                    </h3>
                    <Button variant="outline" size="sm" className="rounded-lg font-bold text-xs h-8" onClick={() => setVendorData(prev => ({...prev, reviews: [...prev.reviews, {name: 'عميل جديد', text: '', rating: 5, date: 'الآن', avatar: ''}]}))}>
                       <Plus className="w-3 h-3 ml-1" /> إضافة رأي
                    </Button>
                 </div>
                 <div className="grid grid-cols-1 gap-3">
                    {vendorData.reviews.map((rev, i) => (
                       <div key={i} className="p-4 bg-gray-50 rounded-xl flex items-start gap-4 relative group border border-gray-100">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                             <User className="w-4 h-4 text-gray-300" />
                          </div>
                          <div className="flex-1 space-y-1">
                             <Input value={rev.name} onChange={e => {
                                const newRev = [...vendorData.reviews];
                                newRev[i].name = e.target.value;
                                setVendorData({...vendorData, reviews: newRev});
                             }} placeholder="اسم العميل" className="bg-transparent border-b border-gray-200 h-8 rounded-none px-0 font-black text-xs" />
                             <Textarea value={rev.text} onChange={e => {
                                const newRev = [...vendorData.reviews];
                                newRev[i].text = e.target.value;
                                setVendorData({...vendorData, reviews: newRev});
                             }} placeholder="نص الرأي..." className="bg-transparent border-none min-h-[40px] p-0 focus:ring-0 text-xs" />
                          </div>
                          <button onClick={() => {
                             const newRev = vendorData.reviews.filter((_, idx) => idx !== i);
                             setVendorData({...vendorData, reviews: newRev});
                          }} className="text-destructive absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Trash2 className="w-3.5 h-3.5" />
                          </button>
                       </div>
                    ))}
                 </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4 mt-0 text-center">
                 <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {vendorData.gallery.map((img, i) => (
                       <div key={i} className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-md group">
                          <Image src={img} alt="Work" fill className="object-cover" />
                          <button onClick={() => setVendorData(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }))} className="absolute top-1 left-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                             <Plus className="w-3 h-3 rotate-45" />
                          </button>
                       </div>
                    ))}
                    <div className="relative aspect-[4/5] border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-all cursor-pointer overflow-hidden">
                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload('gallery', e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                       <Sparkles className="w-6 h-6 text-primary opacity-20" />
                       <span className="text-[9px] font-black text-muted-foreground uppercase">إضافة صورة</span>
                    </div>
                 </div>
              </TabsContent>
            </div>

            <div className="p-6 bg-gray-50 border-t flex flex-row-reverse justify-start gap-3">
              <Button onClick={handleAddVendor} className="rounded-lg px-8 h-12 font-black text-sm bg-secondary text-white shadow-xl shadow-secondary/20 hover:-translate-y-0.5 transition-all">تفعيل حساب الشريك ونشره</Button>
              <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-lg px-6 h-12 font-black text-sm hover:bg-white transition-all">إلغاء الأمر</Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
