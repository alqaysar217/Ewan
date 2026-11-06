'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, or } from 'firebase/firestore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  Clock,
  Award,
  MessageSquare,
  Loader2,
  Trash2,
  Edit,
  Hammer,
  Palette,
  Camera,
  Layers,
  Sparkles,
  User,
  Mail,
  Info,
  Calendar,
  X,
  Briefcase,
  Quote,
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
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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

export default function AdminProfessionals() {
  const db = useFirestore();
  
  const prosQuery = useMemo(() => query(
    collection(db, 'vendors'), 
    or(where('business_type', '==', 'carpenter'), where('business_type', '==', 'interior_designer'))
  ), [db]);
  
  const { data: professionals, loading } = useCollection(prosQuery);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newArea, setNewArea] = useState('');

  const [proData, setProData] = useState({
    business_name: '',
    business_type: 'carpenter',
    city: 'صنعاء',
    email: '',
    description: '',
    logo_url: '',
    cover_url: '',
    average_rating: 5,
    experience_years: '5',
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
           setProData(prev => ({ ...prev, gallery: [...prev.gallery, compressed] }));
        } else {
           setProData(prev => ({ ...prev, [type === 'logo' ? 'logo_url' : 'cover_url']: compressed }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addArea = () => {
    if (newArea.trim() && !proData.service_areas.includes(newArea.trim())) {
      setProData(prev => ({ ...prev, service_areas: [...prev.service_areas, newArea.trim()] }));
      setNewArea('');
    }
  };

  const removeArea = (area: string) => {
    setProData(prev => ({ ...prev, service_areas: prev.service_areas.filter(a => a !== area) }));
  };

  const handleSavePro = async () => {
    if (isSaving) return;
    if (!proData.business_name || !proData.email) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى ملء الاسم والبريد الإلكتروني." });
      return;
    }

    setIsSaving(true);
    const finalData = {
      ...proData,
      average_rating: Number(proData.average_rating),
      experience_years: Number(proData.experience_years),
      approval_status: 'approved',
      updated_at: serverTimestamp(),
      slug: proData.business_name.toLowerCase().replace(/\s+/g, '-'),
    };

    if (editingUser) {
      updateDoc(doc(db, 'vendors', editingUser.id), finalData)
        .then(() => {
          toast({ title: "تم التحديث بنجاح" });
          setIsDialogOpen(false);
          resetForm();
        })
        .catch(async (e) => {
          const err = new FirestorePermissionError({ path: `vendors/${editingUser.id}`, operation: 'update', requestResourceData: finalData });
          errorEmitter.emit('permission-error', err);
        })
        .finally(() => setIsSaving(false));
    } else {
      addDoc(collection(db, 'vendors'), {
        ...finalData,
        created_at: serverTimestamp(),
      })
        .then(() => {
          toast({ title: "تم تسجيل المهني بنجاح" });
          setIsDialogOpen(false);
          resetForm();
        })
        .catch(async (e) => {
          const err = new FirestorePermissionError({ path: 'vendors', operation: 'create', requestResourceData: finalData });
          errorEmitter.emit('permission-error', err);
        })
        .finally(() => setIsSaving(false));
    }
  };

  const handleDeletePro = (id: string) => {
    deleteDoc(doc(db, 'vendors', id))
      .then(() => toast({ title: "تم الحذف بنجاح" }))
      .catch(async (e) => {
        const err = new FirestorePermissionError({ path: `vendors/${id}`, operation: 'delete' });
        errorEmitter.emit('permission-error', err);
      });
  };

  const openEdit = (pro: any) => {
    setEditingUser(pro);
    setProData({
      ...pro,
      experience_years: pro.experience_years?.toString() || '5',
      service_areas: pro.service_areas || [],
      reviews: pro.reviews || [],
      gallery: pro.gallery || []
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setProData({ 
      business_name: '', business_type: 'carpenter', city: 'صنعاء', email: '', 
      description: '', logo_url: '', cover_url: '', average_rating: 5, 
      experience_years: '5', service_areas: [], 
      reviews: [], gallery: [] 
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary">إدارة النجارين والمصممين</h1>
          <p className="text-muted-foreground font-bold">دعم الحرفيين والمبدعين المعتمدين في منصة إيوان.</p>
        </div>
        <button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="rounded-xl h-14 px-8 font-black bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform hover:-translate-y-1">
          <Plus className="w-5 h-5" /> إضافة مهني جديد
        </button>
      </div>

      <div className="relative w-full max-w-2xl group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="ابحث عن مهني بالاسم أو التخصص..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-12 h-14 bg-white border-none shadow-sm rounded-xl font-bold text-lg"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
           <Loader2 className="w-12 h-12 animate-spin text-primary" />
           <p className="font-black text-muted-foreground text-lg">جاري تحميل البيانات...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {professionals?.filter(v => v.business_name?.toLowerCase().includes(searchTerm.toLowerCase())).map((pro: any) => (
            <Card key={pro.id} className="rounded-2xl border-none shadow-sm hover:shadow-xl transition-all overflow-hidden bg-white flex flex-col group border border-transparent hover:border-primary/10">
              <div className="relative h-40 w-full overflow-hidden bg-secondary/10">
                <Image src={pro.cover_url || `https://picsum.photos/seed/${pro.id}/800/400`} alt={pro.business_name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                   <Button size="icon" onClick={() => openEdit(pro)} className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary">
                      <Edit className="w-4 h-4" />
                   </Button>
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive" className="w-9 h-9 rounded-lg shadow-xl">
                           <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl font-cairo" dir="rtl">
                        <AlertDialogHeader className="space-y-4">
                           <AlertDialogTitle className="text-2xl font-black text-secondary text-center">تأكيد الحذف</AlertDialogTitle>
                           <AlertDialogDescription className="font-bold text-center text-muted-foreground">
                              سيتم مسح كافة البيانات المرتبطة بالمهني "{pro.business_name}" نهائياً.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row gap-3 mt-6">
                           <AlertDialogAction onClick={() => handleDeletePro(pro.id)} className="flex-1 rounded-xl bg-destructive text-white font-black h-12">حذف الآن</AlertDialogAction>
                           <AlertDialogCancel className="flex-1 rounded-xl h-12 font-black border-none bg-gray-50">إلغاء</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                   </AlertDialog>
                </div>

                <div className="absolute bottom-4 right-6 left-6 flex items-center gap-3">
                   <div className="w-12 h-12 bg-white p-1 rounded-xl shadow-2xl relative overflow-hidden shrink-0">
                      <Image src={pro.logo_url || `https://picsum.photos/seed/${pro.id}-logo/200/200`} alt="Logo" fill className="object-cover" />
                   </div>
                   <div className="text-white">
                      <h4 className="font-black text-lg flex items-center gap-1.5">{pro.business_name} <CheckCircle2 className="w-4 h-4 text-primary fill-white" /></h4>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-[9px] uppercase">
                          {pro.business_type === 'carpenter' ? 'نجار' : 'مصمم ديكور'}
                        </Badge>
                        <p className="text-[10px] font-bold opacity-80 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" /> {pro.service_areas?.[0] || pro.city}
                        </p>
                      </div>
                   </div>
                </div>
              </div>

              <CardContent className="p-6 flex-1 flex flex-col space-y-5">
                 <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-2">{pro.description || 'لا يوجد وصف متاح لهذا المهني حالياً.'}</p>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-100 flex flex-col items-center gap-1">
                       <p className="text-[9px] text-muted-foreground font-black uppercase">التقييم العام</p>
                       <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-xs">
                          <Star className="w-3 h-3 fill-current" /> {pro.average_rating || '5.0'}
                       </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl text-center border border-gray-100 flex flex-col items-center gap-1">
                       <p className="text-[9px] text-muted-foreground font-black uppercase">الخبرة</p>
                       <div className="flex items-center justify-center gap-1 text-secondary font-black text-xs">
                          <Clock className="w-3 h-3" /> {pro.experience_years || '1'} سنة
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                    <Button onClick={() => openEdit(pro)} className="flex-1 rounded-lg h-11 bg-secondary text-white font-black shadow-sm text-sm">تعديل الملف</Button>
                    <Button variant="outline" className="flex-1 rounded-lg h-11 border-primary text-primary font-black text-sm gap-2">
                      <MessageSquare className="w-4 h-4" /> تواصل
                    </Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* واجهة الإضافة والتعديل */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!isSaving) setIsDialogOpen(open); }}>
        <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl font-cairo" dir="rtl">
          <Tabs defaultValue="profile" className="w-full">
            <div className="bg-secondary p-6 pb-0 text-white">
              <DialogHeader className="mb-4 text-right">
                <DialogTitle className="text-2xl font-black">{editingUser ? 'تحديث ملف المهني' : 'تسجيل مهني جديد'}</DialogTitle>
                <DialogDescription className="text-gray-400 font-bold text-xs mt-1">أدخل بيانات الهوية المهنية بدقة لضمان ثقة العملاء.</DialogDescription>
              </DialogHeader>
              <TabsList className="bg-white/5 border-none w-full justify-start rounded-none h-12 p-0 gap-4">
                <TabsTrigger value="profile" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">
                  <User className="w-4 h-4" /> الملف التعريفي
                </TabsTrigger>
                <TabsTrigger value="branding" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">
                  <ImageIcon className="w-4 h-4" /> الهوية البصرية
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">
                  <Star className="w-4 h-4" /> آراء العملاء
                </TabsTrigger>
                <TabsTrigger value="gallery" className="rounded-none h-full border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-white font-black text-sm gap-2">
                  <Camera className="w-4 h-4" /> معرض الأعمال
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto bg-white text-right">
              <TabsContent value="profile" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1 flex items-center gap-2"><Briefcase className="w-3 h-3 text-primary" /> الاسم التجاري / الشخصي</label>
                    <Input value={proData.business_name} onChange={e => setProData({...proData, business_name: e.target.value})} placeholder="مثال: ورشة إتقان للنجارة" className="rounded-xl h-12 bg-gray-50 border-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1 flex items-center gap-2"><Mail className="w-3 h-3 text-primary" /> البريد الإلكتروني</label>
                    <Input value={proData.email} onChange={e => setProData({...proData, email: e.target.value})} placeholder="pro@ewan.ye" className="rounded-xl h-12 bg-gray-50 border-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1 flex items-center gap-2"><Hammer className="w-3 h-3 text-primary" /> نوع المهنة</label>
                    <select value={proData.business_type} onChange={e => setProData({...proData, business_type: e.target.value})} className="w-full h-12 rounded-xl border-none bg-gray-50 px-4 font-bold text-sm outline-none shadow-inner">
                      <option value="carpenter">نجار محترف</option>
                      <option value="interior_designer">مصمم ديكور</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1 flex items-center gap-2"><MapPin className="w-3 h-3 text-primary" /> المدينة الرئيسية</label>
                    <select value={proData.city} onChange={e => setProData({...proData, city: e.target.value})} className="w-full h-12 rounded-xl border-none bg-gray-50 px-4 font-bold text-sm outline-none shadow-inner">
                      <option value="صنعاء">صنعاء</option>
                      <option value="عدن">عدن</option>
                      <option value="تعز">تعز</option>
                      <option value="المكلا">المكلا</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-secondary mr-1 flex items-center gap-2"><Clock className="w-3 h-3 text-primary" /> سنوات الخبرة</label>
                    <Input type="number" value={proData.experience_years} onChange={e => setProData({...proData, experience_years: e.target.value})} placeholder="5" className="rounded-xl h-12 bg-gray-50 border-none" />
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
                    {proData.service_areas.length > 0 ? proData.service_areas.map((area, idx) => (
                      <Badge key={idx} className="bg-white text-secondary border border-primary/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold shadow-sm">
                        {area}
                        <button onClick={() => removeArea(area)} className="text-destructive hover:scale-110 transition-transform"><X className="w-3 h-3" /></button>
                      </Badge>
                    )) : (
                      <p className="text-xs text-muted-foreground italic mr-1">لم يتم تحديد مناطق تغطية بعد.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-secondary mr-1 flex items-center gap-2"><Info className="w-3 h-3 text-primary" /> نبذة عن المهني وأسلوب العمل</label>
                  <Textarea value={proData.description} onChange={e => setProData({...proData, description: e.target.value})} placeholder="اكتب وصفاً جذاباً لمهاراتك والخدمات التي تقدمها..." className="rounded-xl min-h-[100px] bg-gray-50 border-none" />
                </div>
              </TabsContent>

              <TabsContent value="branding" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-sm font-black text-secondary flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> شعار المهني</label>
                     <div className="relative aspect-square w-24 border-2 border-dashed border-gray-100 rounded-2xl overflow-hidden bg-gray-50 cursor-pointer hover:border-primary/40 transition-all flex items-center justify-center group">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('logo', e)} className="absolute inset-0 opacity-0 z-20 cursor-pointer" />
                        {proData.logo_url ? <Image src={proData.logo_url} alt="Logo" fill className="object-cover" /> : <Upload className="w-6 h-6 opacity-30 group-hover:scale-110 transition-transform" />}
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-sm font-black text-secondary flex items-center gap-2"><ImageIcon className="w-4 h-4 text-primary" /> صورة الخلفية للملف الشخصي</label>
                     <div className="relative aspect-video w-full border-2 border-dashed border-gray-100 rounded-2xl overflow-hidden bg-gray-50 cursor-pointer hover:border-primary/40 transition-all flex items-center justify-center group">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload('cover', e)} className="absolute inset-0 opacity-0 z-20 cursor-pointer" />
                        {proData.cover_url ? <Image src={proData.cover_url} alt="Cover" fill className="object-cover" /> : <Upload className="w-8 h-8 opacity-30 group-hover:scale-110 transition-transform" />}
                     </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 mt-0">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-black text-secondary flex items-center gap-2"><Quote className="w-4 h-4 text-primary" /> مراجعات العملاء المثبتة</h3>
                    <Button variant="outline" size="sm" onClick={() => setProData(prev => ({...prev, reviews: [...prev.reviews, {name: '', text: '', rating: 5, date: 'الآن'}]}))} className="rounded-lg h-9 font-bold">+ إضافة مراجعة</Button>
                 </div>
                 
                 <div className="space-y-4">
                   {proData.reviews.length > 0 ? proData.reviews.map((rev, i) => (
                      <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group space-y-4 shadow-inner">
                         <button onClick={() => setProData(prev => ({...prev, reviews: prev.reviews.filter((_, idx) => idx !== i)}))} className="absolute top-4 left-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-muted-foreground mr-1 flex items-center gap-1"><User className="w-3 h-3" /> اسم العميل</label>
                               <Input value={rev.name} onChange={e => {
                                  const newRev = [...proData.reviews];
                                  newRev[i].name = e.target.value;
                                  setProData({...proData, reviews: newRev});
                               }} placeholder="مثال: محمد الريمي" className="bg-white border-none h-10 font-bold rounded-lg" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-black text-muted-foreground mr-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> تاريخ التقييم</label>
                               <Input value={rev.date} onChange={e => {
                                  const newRev = [...proData.reviews];
                                  newRev[i].date = e.target.value;
                                  setProData({...proData, reviews: newRev});
                               }} placeholder="مثال: منذ أسبوعين" className="bg-white border-none h-10 font-bold rounded-lg" />
                            </div>
                         </div>

                         <div className="space-y-1">
                            <label className="text-[10px] font-black text-muted-foreground mr-1 flex items-center gap-1"><Quote className="w-3 h-3" /> نص المراجعة</label>
                            <Textarea value={rev.text} onChange={e => {
                               const newRev = [...proData.reviews];
                               newRev[i].text = e.target.value;
                               setProData({...proData, reviews: newRev});
                            }} placeholder="اكتب تجربة العميل بوضوح..." className="bg-white border-none min-h-[60px] font-medium rounded-lg shadow-sm" />
                         </div>

                         <div className="flex items-center gap-4">
                            <label className="text-[10px] font-black text-muted-foreground flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-current" /> التقييم:</label>
                            <select value={rev.rating} onChange={e => {
                               const newRev = [...proData.reviews];
                               newRev[i].rating = Number(e.target.value);
                               setProData({...proData, reviews: newRev});
                            }} className="bg-white border-none rounded-lg h-8 px-3 font-black text-xs outline-none shadow-sm">
                               {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} نجوم</option>)}
                            </select>
                         </div>
                      </div>
                   )) : (
                     <div className="py-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center gap-2 opacity-50">
                        <MessageSquare className="w-10 h-10" />
                        <p className="text-xs font-black">لا توجد مراجعات مضافة لهذا المهني.</p>
                     </div>
                   )}
                 </div>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6 mt-0">
                 <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-secondary">صور من أعمال سابقة (بورتفوليو)</h3>
                    <Badge variant="outline" className="font-bold text-[10px]">{proData.gallery.length} صور مضافة</Badge>
                 </div>
                 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {proData.gallery.map((img, i) => (
                       <div key={i} className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-md group">
                          <Image src={img} alt="Work" fill className="object-cover" />
                          <button onClick={() => setProData(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }))} className="absolute top-1 left-1 bg-destructive text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                             <Trash2 className="w-3 h-3" />
                          </button>
                       </div>
                    ))}
                    <div className="relative aspect-[4/5] border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer group">
                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload('gallery', e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                       <Camera className="w-6 h-6 text-muted-foreground group-hover:scale-110 transition-transform" />
                       <span className="text-[10px] font-black text-muted-foreground mt-2">إضافة صورة</span>
                    </div>
                 </div>
              </TabsContent>
            </div>

            <div className="p-6 bg-gray-50 border-t flex flex-row-reverse justify-start gap-4">
              <Button onClick={handleSavePro} disabled={isSaving} className="rounded-xl px-10 h-12 font-black bg-secondary text-white min-w-[160px] shadow-xl shadow-secondary/10">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingUser ? 'حفظ التعديلات' : 'تسجيل المهني')}
              </Button>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="rounded-xl px-8 h-12 font-black">إلغاء</Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}