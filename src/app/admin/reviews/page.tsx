'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Star, 
  Quote, 
  Loader2, 
  User,
  Calendar
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminReviews() {
  const db = useFirestore();
  const reviewsQuery = useMemo(() => query(collection(db, 'testimonials'), orderBy('created_at', 'desc')), [db]);
  const { data: reviews, loading } = useCollection(reviewsQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    text: '',
    rating: 5,
    date: ''
  });

  const handleSave = async () => {
    if (isSaving) return;
    if (!formData.name || !formData.text) {
      toast({ variant: "destructive", title: "بيانات ناقصة" });
      return;
    }

    setIsSaving(true);
    const data = { ...formData, rating: Number(formData.rating), updated_at: serverTimestamp() };

    try {
      if (editingReview) {
        await updateDoc(doc(db, 'testimonials', editingReview.id), data);
        toast({ title: "تم التحديث بنجاح" });
      } else {
        await addDoc(collection(db, 'testimonials'), { ...data, created_at: serverTimestamp() });
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
    if (!confirm('هل تريد حذف هذا التقييم؟')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      toast({ title: "تم الحذف" });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ" });
    }
  };

  const resetForm = () => {
    setEditingReview(null);
    setFormData({ name: '', role: '', text: '', rating: 5, date: '' });
  };

  const openEdit = (review: any) => {
    setEditingReview(review);
    setFormData({ 
      name: review.name, 
      role: review.role || '', 
      text: review.text, 
      rating: review.rating || 5, 
      date: review.date || '' 
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary flex items-center gap-3">
            <Quote className="w-8 h-8 text-primary" /> إدارة آراء العملاء
          </h1>
          <p className="text-muted-foreground font-bold">إدارة الشهادات والآراء التي تظهر لزوار المنصة.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="rounded-xl h-14 px-8 font-black bg-primary text-white shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5 ml-2" /> إضافة رأي جديد
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews?.map((r: any) => (
            <Card key={r.id} className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all bg-white relative overflow-hidden flex flex-col group">
              <div className="absolute top-4 left-4 flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(r)} className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"><Edit className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(r.id)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
              <CardContent className="p-8 space-y-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center font-black text-primary text-xl">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-secondary text-base">{r.name}</h4>
                    <p className="text-xs text-muted-foreground font-bold">{r.role || 'عميل إيوان'}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn("w-3.5 h-3.5", i < (r.rating || 5) ? "fill-current" : "fill-none")} />)}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic pr-4 border-r-2 border-primary/20 flex-1">"{r.text}"</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold pt-4">
                  <Calendar className="w-3 h-3" /> {r.date || 'منذ فترة'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl border-none shadow-2xl font-cairo max-w-xl" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-xl font-black">{editingReview ? 'تعديل الرأي' : 'إضافة رأي عميل'}</DialogTitle>
            <DialogDescription>أدخل تفاصيل تجربة العميل بدقة.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 text-right">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-black text-secondary">اسم العميل</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="مثال: أحمد القاضي" className="rounded-xl h-12 bg-gray-50 border-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-secondary">الصفة / الموقع</label>
                <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="مثال: عميل من صنعاء" className="rounded-xl h-12 bg-gray-50 border-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-black text-secondary">التقييم (1-5)</label>
                <select value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full h-12 rounded-xl bg-gray-50 border-none px-4 font-bold text-sm outline-none">
                  {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} نجوم</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-secondary">التاريخ التقريبي</label>
                <Input value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} placeholder="مثال: منذ أسبوع" className="rounded-xl h-12 bg-gray-50 border-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-secondary">نص الرأي</label>
              <Textarea value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} placeholder="اكتب تجربة العميل هنا..." className="rounded-xl min-h-[120px] bg-gray-50 border-none" />
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="w-full h-14 rounded-xl bg-secondary text-white font-black text-lg">
              {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : 'حفظ ونشر الرأي'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
