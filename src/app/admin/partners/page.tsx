'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Upload, 
  Loader2, 
  ExternalLink,
  Handshake,
  Image as ImageIcon
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

const compressImage = (base64Str: string, maxWidth = 400): Promise<string> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png', 0.8));
    };
  });
};

export default function AdminPartners() {
  const db = useFirestore();
  const partnersQuery = useMemo(() => query(collection(db, 'partners'), orderBy('created_at', 'desc')), [db]);
  const { data: partners, loading } = useCollection(partnersQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: ''
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setFormData(prev => ({ ...prev, logo_url: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!formData.name || !formData.logo_url) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى إدخال الاسم والشعار." });
      return;
    }

    setIsSaving(true);
    const data = { ...formData, updated_at: serverTimestamp() };

    try {
      if (editingPartner) {
        await updateDoc(doc(db, 'partners', editingPartner.id), data);
        toast({ title: "تم التحديث بنجاح" });
      } else {
        await addDoc(collection(db, 'partners'), { ...data, created_at: serverTimestamp() });
        toast({ title: "تمت الإضافة بنجاح" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في الحفظ" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await deleteDoc(doc(db, 'partners', id));
      toast({ title: "تم الحذف بنجاح" });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في الحذف" });
    }
  };

  const resetForm = () => {
    setEditingPartner(null);
    setFormData({ name: '', logo_url: '', website_url: '' });
  };

  const openEdit = (partner: any) => {
    setEditingPartner(partner);
    setFormData({ name: partner.name, logo_url: partner.logo_url, website_url: partner.website_url || '' });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary flex items-center gap-3">
            <Handshake className="w-8 h-8 text-primary" /> إدارة شركاء النجاح
          </h1>
          <p className="text-muted-foreground font-bold">إضافة شعارات العلامات التجارية والمصانع التي نتعامل معها.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="rounded-xl h-14 px-8 font-black bg-primary text-white shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5 ml-2" /> إضافة شريك جديد
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {partners?.map((p: any) => (
            <Card key={p.id} className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all bg-white group overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
                <div className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden p-4">
                  <Image src={p.logo_url} alt={p.name} fill className="object-contain" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-secondary text-sm truncate w-full">{p.name}</h4>
                  {p.website_url && (
                    <a href={p.website_url} target="_blank" className="text-xs text-primary font-bold flex items-center justify-center gap-1 hover:underline">
                      <ExternalLink className="w-3 h-3" /> الموقع
                    </a>
                  )}
                </div>
                <div className="flex gap-2 w-full pt-2 border-t border-gray-50">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)} className="flex-1 h-8 rounded-lg hover:bg-primary/10 hover:text-primary"><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)} className="flex-1 h-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl border-none shadow-2xl font-cairo" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-xl font-black">{editingPartner ? 'تعديل الشريك' : 'إضافة شريك جديد'}</DialogTitle>
            <DialogDescription>أدخل بيانات الشريك لظهوره في الصفحة الرئيسية.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 text-right">
            <div className="space-y-2">
              <label className="text-sm font-black text-secondary">شعار الشريك (صورة شفافة مفضلة)</label>
              <div className="relative aspect-video border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center bg-gray-50 cursor-pointer group hover:border-primary transition-all">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 z-10" />
                {formData.logo_url ? <Image src={formData.logo_url} alt="Logo" fill className="object-contain p-4" /> : <div className="flex flex-col items-center gap-2 opacity-30"><ImageIcon className="w-8 h-8" /> <span className="text-xs font-bold">رفع الشعار</span></div>}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-secondary">اسم الشريك</label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="مثال: ايكيا العالمية" className="rounded-xl h-12 bg-gray-50 border-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-secondary">رابط الموقع (اختياري)</label>
              <Input value={formData.website_url} onChange={e => setFormData({...formData, website_url: e.target.value})} placeholder="https://..." className="rounded-xl h-12 bg-gray-50 border-none" />
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="w-full h-14 rounded-xl bg-secondary text-white font-black text-lg">
              {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : 'حفظ البيانات'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
