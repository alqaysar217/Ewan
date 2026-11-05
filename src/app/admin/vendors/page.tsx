
'use client';

import { useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  Store, 
  ShieldCheck,
  Ban,
  Mail,
  MapPin,
  Filter,
  CheckCircle2,
  XCircle,
  Camera,
  Upload,
  Clock,
  Star,
  Users
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

  // New Vendor Form State
  const [vendorData, setVendorData] = useState({
    business_name: '',
    business_type: 'furniture_store',
    city: 'صنعاء',
    email: '',
    description: '',
    logo_base64: '',
    cover_base64: '',
    average_rating: 5,
    experience_years: '5'
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
      await addDoc(collection(db, 'vendors'), {
        ...vendorData,
        approval_status: 'approved',
        created_at: serverTimestamp()
      });
      toast({ title: "تمت الإضافة", description: "تم إضافة المتجر بنجاح" });
      setIsAddOpen(false);
      setVendorData({ business_name: '', business_type: 'furniture_store', city: 'صنعاء', email: '', description: '', logo_base64: '', cover_base64: '', average_rating: 5, experience_years: '5' });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل في إضافة المتجر" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-secondary">إدارة الشركاء</h1>
          <p className="text-muted-foreground font-bold mt-1">تتبع المتاجر، النجارين، والمصممين المعتمدين.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5 ml-2" /> إضافة شريك جديد
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="ابحث عن اسم أو مدينة..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-12 h-14 bg-white border-none shadow-sm rounded-xl font-bold"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full lg:w-auto p-1 bg-gray-100 rounded-2xl">
          {['all', 'furniture_store', 'carpenter', 'interior_designer'].map((f) => (
            <Button 
              key={f}
              variant={activeFilter === f ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-xl font-bold h-10 px-6 whitespace-nowrap"
              onClick={() => setActiveFilter(f)}
            >
              {f === 'all' ? 'الكل' : f === 'furniture_store' ? 'متاجر' : f === 'carpenter' ? 'نجارين' : 'مصممين'}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vendors?.filter(v => {
          const matchSearch = v.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) || v.city?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchFilter = activeFilter === 'all' || v.business_type === activeFilter;
          return matchSearch && matchFilter;
        }).map((vendor: any) => (
          <Card key={vendor.id} className="rounded-3xl border-none shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white flex flex-col group">
            <div className="relative h-40 w-full overflow-hidden">
              <Image src={vendor.cover_base64 || `https://picsum.photos/seed/${vendor.id}/800/400`} alt={vendor.business_name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                 <div className="w-14 h-14 bg-white p-1 rounded-xl shadow-2xl relative overflow-hidden shrink-0">
                    <Image src={vendor.logo_base64 || `https://picsum.photos/seed/${vendor.id}-logo/200/200`} alt="Logo" fill className="object-cover" />
                 </div>
                 <div className="text-white">
                    <h4 className="font-black text-lg flex items-center gap-1.5">{vendor.business_name} <CheckCircle2 className="w-4 h-4 text-primary fill-white" /></h4>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{vendor.city}</p>
                 </div>
              </div>
            </div>
            <CardContent className="p-6 flex-1 flex flex-col space-y-6">
               <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">{vendor.description || 'لا يوجد وصف متاح لهذا الشريك حالياً.'}</p>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-2xl text-center space-y-1">
                     <p className="text-[10px] text-muted-foreground font-black uppercase">التقييم</p>
                     <div className="flex items-center justify-center gap-1 text-amber-500 font-black">
                        <Star className="w-4 h-4 fill-current" /> {vendor.average_rating || '5.0'}
                     </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-2xl text-center space-y-1">
                     <p className="text-[10px] text-muted-foreground font-black uppercase">النوع</p>
                     <p className="text-xs font-black text-secondary">{vendor.business_type === 'carpenter' ? 'ورشة نجارة' : 'معرض أثاث'}</p>
                  </div>
               </div>

               <div className="flex gap-3 mt-auto pt-4 border-t">
                  <Link href={`/vendors/${vendor.id}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-xl h-11 border-border font-bold hover:bg-gray-50">معاينة</Button>
                  </Link>
                  <Button className="flex-1 rounded-xl h-11 bg-secondary text-white font-bold">إدارة</Button>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Vendor Dialog - Comprehensive Design */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <div className="bg-secondary p-10 text-white relative">
             <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 -translate-y-1/2 translate-x-1/2 rotate-45" />
             <DialogHeader>
                <DialogTitle className="text-3xl font-black">تسجيل شريك جديد</DialogTitle>
                <DialogDescription className="text-gray-400 font-bold mt-2">أدخل كافة تفاصيل المتجر أو الورشة بعناية لضمان أفضل ظهور للعملاء.</DialogDescription>
             </DialogHeader>
          </div>
          
          <div className="p-10 max-h-[65vh] overflow-y-auto space-y-10 bg-white">
             {/* Visual Assets */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <label className="text-sm font-black text-secondary flex items-center gap-2 mr-1">
                      <ImageIcon className="w-4 h-4 text-primary" /> شعار المتجر (Logo)
                   </label>
                   <div className="relative aspect-square w-32 border-2 border-dashed border-gray-100 rounded-3xl overflow-hidden bg-gray-50 group hover:border-primary/40 transition-all">
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      {vendorData.logo_base64 ? (
                        <Image src={vendorData.logo_base64} alt="Logo" fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground"><Upload className="w-6 h-6" /></div>
                      )}
                   </div>
                </div>
                <div className="space-y-4">
                   <label className="text-sm font-black text-secondary flex items-center gap-2 mr-1">
                      <ImageIcon className="w-4 h-4 text-primary" /> صورة الغلاف (Banner)
                   </label>
                   <div className="relative aspect-video w-full border-2 border-dashed border-gray-100 rounded-3xl overflow-hidden bg-gray-50 group hover:border-primary/40 transition-all">
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload('cover', e)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      {vendorData.cover_base64 ? (
                        <Image src={vendorData.cover_base64} alt="Cover" fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground"><Upload className="w-8 h-8" /></div>
                      )}
                   </div>
                </div>
             </div>

             {/* Basic Info */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-sm font-black text-secondary mr-1">الاسم التجاري</label>
                   <Input value={vendorData.business_name} onChange={e => setVendorData({...vendorData, business_name: e.target.value})} placeholder="مثال: معرض النور للأثاث" className="rounded-xl h-14" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-black text-secondary mr-1">البريد الإلكتروني</label>
                   <Input value={vendorData.email} onChange={e => setVendorData({...vendorData, email: e.target.value})} placeholder="shop@ewan.ye" className="rounded-xl h-14" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-black text-secondary mr-1">المدينة المقر</label>
                   <select value={vendorData.city} onChange={e => setVendorData({...vendorData, city: e.target.value})} className="w-full h-14 rounded-xl border px-4 font-bold bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none">
                      <option value="صنعاء">صنعاء</option>
                      <option value="عدن">عدن</option>
                      <option value="تعز">تعز</option>
                      <option value="حضرموت">حضرموت</option>
                      <option value="إب">إب</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-black text-secondary mr-1">نوع الشريك</label>
                   <select value={vendorData.business_type} onChange={e => setVendorData({...vendorData, business_type: e.target.value})} className="w-full h-14 rounded-xl border px-4 font-bold bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none">
                      <option value="furniture_store">معرض أثاث جاهز</option>
                      <option value="carpenter">ورشة نجارة / تفصيل</option>
                      <option value="interior_designer">مصمم ديكور داخلي</option>
                   </select>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-black text-secondary mr-1">وصف المتجر (الفقرة التعريفية)</label>
                <Textarea value={vendorData.description} onChange={e => setVendorData({...vendorData, description: e.target.value})} placeholder="تحدث عن تاريخ المتجر، جودة المنتجات، والضمان المقدم..." className="rounded-xl min-h-[120px] bg-gray-50 py-4" />
             </div>
          </div>

          <div className="p-8 bg-gray-50 border-t flex justify-end gap-3">
             <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl px-8 h-14 font-black">إلغاء</Button>
             <Button onClick={handleAddVendor} className="rounded-xl px-14 h-14 font-black bg-secondary text-white shadow-2xl shadow-secondary/20">تفعيل حساب الشريك ونشره</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
