
'use client';

import { useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  CheckCircle2, 
  Camera,
  Upload,
  Star,
  Image as ImageIcon,
  MapPin,
  Store,
  Clock,
  Award,
  ChevronLeft,
  Mail,
  Info
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    service_areas: ['صنعاء']
  });

  const handleImageUpload = (type: 'logo' | 'cover', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVendorData({ ...vendorData, [type === 'logo' ? 'logo_base64' : 'cover_base64']: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVendor = async () => {
    try {
      if (!vendorData.business_name || !vendorData.email) {
        toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى ملء الحقول الأساسية" });
        return;
      }
      await addDoc(collection(db, 'vendors'), {
        ...vendorData,
        approval_status: 'approved',
        average_rating: Number(vendorData.average_rating),
        created_at: serverTimestamp()
      });
      toast({ title: "تم تسجيل الشريك بنجاح" });
      setIsAddOpen(false);
      setVendorData({ business_name: '', business_type: 'furniture_store', city: 'صنعاء', email: '', description: '', logo_base64: '', cover_base64: '', average_rating: 5, experience_years: '5', service_areas: ['صنعاء'] });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل في تسجيل الشريك" });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-secondary">إدارة الشركاء</h1>
          <p className="text-muted-foreground font-bold">إدارة المتاجر، النجارين، والمصممين المعتمدين في المنصة.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="rounded-[15px] h-14 px-10 font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20">
          <Plus className="ml-2 w-6 h-6" /> إضافة شريك معتمد
        </Button>
      </div>

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
                <Image src={vendor.cover_base64 || `https://picsum.photos/seed/${vendor.id}/800/400`} alt={vendor.business_name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 right-6 flex items-center gap-4">
                   <div className="w-16 h-16 bg-white p-1 rounded-2xl shadow-2xl relative overflow-hidden shrink-0 border-2 border-white/20">
                      <Image src={vendor.logo_base64 || `https://picsum.photos/seed/${vendor.id}-logo/200/200`} alt="Logo" fill className="object-cover" />
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

      {/* Add Vendor Dialog - Premium Multi-Step Design */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-[3rem] border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] font-cairo">
          <div className="bg-secondary p-12 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 -translate-y-1/2 translate-x-1/2 rotate-45 rounded-full blur-3xl" />
             <DialogHeader className="relative z-10">
                <DialogTitle className="text-4xl font-black">تسجيل شريك استراتيجي</DialogTitle>
                <DialogDescription className="text-gray-400 font-bold text-lg mt-3">أدخل تفاصيل الهوية التجارية للبدء في عرض المنتجات والخدمات للعملاء.</DialogDescription>
             </DialogHeader>
          </div>
          
          <div className="p-12 max-h-[65vh] overflow-y-auto space-y-12 bg-white">
             {/* Visual Branding Section */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                   <label className="text-lg font-black text-secondary flex items-center gap-3 mr-1">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><ImageIcon className="w-4 h-4" /></div>
                      شعار العلامة التجارية (Logo)
                   </label>
                   <div className="relative aspect-square w-40 border-4 border-dashed border-gray-50 rounded-[2.5rem] overflow-hidden bg-gray-50/50 group hover:border-primary/40 transition-all shadow-inner">
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                      {vendorData.logo_base64 ? (
                        <Image src={vendorData.logo_base64} alt="Logo" fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                           <Upload className="w-8 h-8 opacity-20" />
                           <span className="text-[10px] font-black uppercase">ارفع الشعار</span>
                        </div>
                      )}
                   </div>
                </div>
                <div className="space-y-4">
                   <label className="text-lg font-black text-secondary flex items-center gap-3 mr-1">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><ImageIcon className="w-4 h-4" /></div>
                      صورة غلاف المتجر (Cover)
                   </label>
                   <div className="relative aspect-video w-full border-4 border-dashed border-gray-50 rounded-[2.5rem] overflow-hidden bg-gray-50/50 group hover:border-primary/40 transition-all shadow-inner">
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload('cover', e)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                      {vendorData.cover_base64 ? (
                        <Image src={vendorData.cover_base64} alt="Cover" fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                           <Upload className="w-10 h-10 opacity-20" />
                           <span className="text-[10px] font-black uppercase">ارفع صورة الغلاف</span>
                        </div>
                      )}
                   </div>
                </div>
             </div>

             {/* Detailed Info Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-lg font-black text-secondary mr-2">اسم المتجر / الورشة</label>
                   <Input value={vendorData.business_name} onChange={e => setVendorData({...vendorData, business_name: e.target.value})} placeholder="الاسم الرسمي المعتمد" className="rounded-2xl h-16 text-lg bg-gray-50 border-gray-100 shadow-inner" />
                </div>
                <div className="space-y-3">
                   <label className="text-lg font-black text-secondary mr-2">البريد الإلكتروني المهني</label>
                   <Input value={vendorData.email} onChange={e => setVendorData({...vendorData, email: e.target.value})} placeholder="professional@ewan.ye" className="rounded-2xl h-16 text-lg bg-gray-50 border-gray-100 shadow-inner" />
                </div>
                <div className="space-y-3">
                   <label className="text-lg font-black text-secondary mr-2">المقر الرئيسي (المدينة)</label>
                   <select value={vendorData.city} onChange={e => setVendorData({...vendorData, city: e.target.value})} className="w-full h-16 rounded-2xl border border-gray-100 px-6 font-black text-lg bg-gray-50 outline-none focus:ring-2 focus:ring-primary/20 shadow-inner">
                      <option value="صنعاء">صنعاء</option>
                      <option value="عدن">عدن</option>
                      <option value="تعز">تعز</option>
                      <option value="المكلا">المكلا</option>
                      <option value="إب">إب</option>
                   </select>
                </div>
                <div className="space-y-3">
                   <label className="text-lg font-black text-secondary mr-2">نوع النشاط التجاري</label>
                   <select value={vendorData.business_type} onChange={e => setVendorData({...vendorData, business_type: e.target.value})} className="w-full h-16 rounded-2xl border border-gray-100 px-6 font-black text-lg bg-gray-50 outline-none focus:ring-2 focus:ring-primary/20 shadow-inner">
                      <option value="furniture_store">معرض أثاث جاهز</option>
                      <option value="carpenter">ورشة نجارة وتفصيل</option>
                      <option value="interior_designer">مصمم ديكور داخلي</option>
                   </select>
                </div>
                <div className="space-y-3">
                   <label className="text-lg font-black text-secondary mr-2">سنوات الخبرة</label>
                   <Input type="number" value={vendorData.experience_years} onChange={e => setVendorData({...vendorData, experience_years: e.target.value})} className="rounded-2xl h-16 text-lg bg-gray-50 border-gray-100 shadow-inner" />
                </div>
                <div className="space-y-3">
                   <label className="text-lg font-black text-secondary mr-2">التقييم الأولي (5/5)</label>
                   <Input type="number" max="5" min="1" value={vendorData.average_rating} onChange={e => setVendorData({...vendorData, average_rating: Number(e.target.value)})} className="rounded-2xl h-16 text-lg bg-gray-50 border-gray-100 shadow-inner" />
                </div>
             </div>

             <div className="space-y-4">
                <label className="text-lg font-black text-secondary flex items-center gap-3 mr-2">
                   <Info className="w-6 h-6 text-primary" /> نبذة تعريفية كاملة (عن المتجر)
                </label>
                <Textarea value={vendorData.description} onChange={e => setVendorData({...vendorData, description: e.target.value})} placeholder="اكتب تاريخ المتجر، جودة الخشب المستخدم، والضمانات التي يتم تقديمها للعملاء..." className="rounded-[25px] min-h-[220px] text-lg bg-gray-50 border-gray-100 py-8 px-8 leading-loose shadow-inner focus:bg-white transition-all" />
             </div>
          </div>

          <div className="p-12 bg-gray-50 border-t flex justify-end gap-6">
             <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl px-12 h-16 font-black text-xl hover:bg-white">إلغاء الأمر</Button>
             <Button onClick={handleAddVendor} className="rounded-xl px-20 h-16 font-black text-xl bg-secondary text-white shadow-[0_20px_40px_-10px_rgba(7,61,73,0.3)] hover:-translate-y-1 transition-all">تفعيل حساب الشريك ونشره</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
