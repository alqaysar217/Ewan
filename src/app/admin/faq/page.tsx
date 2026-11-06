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
  HelpCircle, 
  Loader2, 
  Layers,
  ChevronDown
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function AdminFAQ() {
  const db = useFirestore();
  const faqQuery = useMemo(() => query(collection(db, 'faqs'), orderBy('created_at', 'desc')), [db]);
  const { data: faqs, loading } = useCollection(faqQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'عام'
  });

  const handleSave = async () => {
    if (isSaving) return;
    if (!formData.question || !formData.answer) {
      toast({ variant: "destructive", title: "بيانات ناقصة" });
      return;
    }

    setIsSaving(true);
    const data = { ...formData, updated_at: serverTimestamp() };

    try {
      if (editingFaq) {
        await updateDoc(doc(db, 'faqs', editingFaq.id), data);
        toast({ title: "تم التحديث بنجاح" });
      } else {
        await addDoc(collection(db, 'faqs'), { ...data, created_at: serverTimestamp() });
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
    if (!confirm('هل تريد حذف هذا السؤال؟')) return;
    try {
      await deleteDoc(doc(db, 'faqs', id));
      toast({ title: "تم الحذف" });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ" });
    }
  };

  const resetForm = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '', category: 'عام' });
  };

  const openEdit = (faq: any) => {
    setEditingFaq(faq);
    setFormData({ 
      question: faq.question, 
      answer: faq.answer, 
      category: faq.category || 'عام' 
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-primary" /> إدارة الأسئلة الشائعة
          </h1>
          <p className="text-muted-foreground font-bold">إضافة وتعديل الأجوبة على استفسارات العملاء المتكررة.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="rounded-xl h-14 px-8 font-black bg-primary text-white shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5 ml-2" /> إضافة سؤال جديد
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : (
        <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
          <CardContent className="p-8">
            {faqs?.length === 0 ? (
               <div className="text-center py-10 opacity-30 font-black">لا توجد أسئلة مضافة حالياً.</div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs?.map((f: any) => (
                  <AccordionItem key={f.id} value={f.id} className="border border-gray-100 rounded-xl px-6 data-[state=open]:border-primary/20 transition-all">
                    <div className="flex items-center gap-4 py-2">
                       <AccordionTrigger className="text-right font-black text-secondary hover:no-underline flex-1">
                          <div className="flex flex-col items-start gap-1">
                             <Badge variant="outline" className="text-[9px] font-bold text-primary border-primary/20 bg-primary/5">{f.category}</Badge>
                             <span className="text-lg">{f.question}</span>
                          </div>
                       </AccordionTrigger>
                       <div className="flex gap-2 shrink-0">
                          <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); openEdit(f); }} className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"><Edit className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDelete(f.id); }} className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                       </div>
                    </div>
                    <AccordionContent className="text-muted-foreground leading-loose font-medium text-[15px] pt-4 border-t border-gray-50 pb-6">
                      {f.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl border-none shadow-2xl font-cairo max-w-2xl" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-xl font-black">{editingFaq ? 'تعديل السؤال' : 'إضافة سؤال وإجابة'}</DialogTitle>
            <DialogDescription>سيظهر هذا السؤال في مركز المساعدة للعملاء.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 text-right">
            <div className="space-y-2">
              <label className="text-sm font-black text-secondary">التصنيف</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full h-12 rounded-xl bg-gray-50 border-none px-4 font-bold text-sm outline-none">
                <option value="عام">عام</option>
                <option value="الطلبات والتوصيل">الطلبات والتوصيل</option>
                <option value="الذكاء الاصطناعي">الذكاء الاصطناعي</option>
                <option value="للمصممين والنجارين">للمصممين والنجارين</option>
                <option value="الضمان والاسترجاع">الضمان والاسترجاع</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-secondary">السؤال</label>
              <Input value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} placeholder="مثال: كيف يعمل التصميم بالذكاء الاصطناعي؟" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-secondary">الإجابة التفصيلية</label>
              <Textarea value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} placeholder="اكتب الإجابة بوضوح هنا..." className="rounded-xl min-h-[150px] bg-gray-50 border-none shadow-inner" />
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="w-full h-14 rounded-xl bg-secondary text-white font-black text-lg">
              {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : 'حفظ السؤال'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
