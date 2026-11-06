
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, updateDoc, doc, serverTimestamp, orderBy, addDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Loader2, 
  MoreVertical,
  Check,
  X,
  User,
  Mail,
  Shield,
  Trash2,
  Edit
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminUsers() {
  const db = useFirestore();
  
  const usersQuery = useMemo(() => query(collection(db, 'users'), orderBy('created_at', 'desc')), [db]);
  const { data: users, loading } = useCollection(usersQuery);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const initialPermissions = {
    can_read: true,
    can_write: false,
    can_edit: false,
    can_delete: false
  };

  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    role: 'staff',
    permissions: initialPermissions
  });

  const handleSaveUser = async () => {
    if (isSaving) return;
    if (!userData.full_name || !userData.email) {
      toast({ variant: "destructive", title: "بيانات ناقصة" });
      return;
    }

    setIsSaving(true);
    const finalData = {
      ...userData,
      updated_at: serverTimestamp(),
      is_active: true
    };

    try {
      if (editingUser) {
        await updateDoc(doc(db, 'users', editingUser.id), finalData);
        toast({ title: "تم تحديث الصلاحيات بنجاح" });
      } else {
        // ملاحظة: في بيئة الإنتاج يفضل استخدام Firebase Admin SDK عبر Cloud Functions لإنشاء الحساب
        // هنا نقوم بإنشاء الوثيقة فقط لغرض العرض في النموذج
        await addDoc(collection(db, 'users'), {
          ...finalData,
          created_at: new Date().toISOString()
        });
        toast({ title: "تمت إضافة الموظف بنجاح" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في العملية" });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setUserData({
      full_name: '',
      email: '',
      role: 'staff',
      permissions: initialPermissions
    });
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setUserData({
      full_name: user.full_name || '',
      email: user.email || '',
      role: user.role || 'staff',
      permissions: user.permissions || initialPermissions
    });
    setIsDialogOpen(true);
  };

  const filteredUsers = users?.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" /> إدارة مستخدمي النظام
          </h1>
          <p className="text-muted-foreground font-bold">تحكم في هوية وصلاحيات الموظفين والمدراء.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="rounded-xl h-14 px-8 font-black bg-primary text-white shadow-lg shadow-primary/20">
          <UserPlus className="w-5 h-5 ml-2" /> إضافة موظف جديد
        </Button>
      </div>

      <div className="relative w-full max-w-2xl">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input 
          placeholder="ابحث بالاسم أو البريد الإلكتروني..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-12 h-14 bg-white border-none shadow-sm rounded-xl font-bold"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers?.map((u: any) => (
            <Card key={u.id} className="rounded-2xl border-none shadow-sm bg-white hover:shadow-md transition-all group overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                   <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-secondary text-2xl shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {u.full_name?.charAt(0)}
                   </div>
                   
                   <div className="flex-1 text-center md:text-right space-y-1">
                      <h3 className="font-black text-lg text-secondary">{u.full_name}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-muted-foreground font-bold">
                         <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {u.email}</span>
                         <Badge className={cn(
                           "font-black text-[10px] px-2 py-0.5 rounded-lg border-none shadow-sm",
                           u.role === 'admin' ? "bg-secondary text-white" : 
                           u.role === 'staff' ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-400"
                         )}>
                           {u.role === 'admin' ? 'مدير نظام' : u.role === 'staff' ? 'موظف' : 'عميل'}
                         </Badge>
                      </div>
                   </div>

                   <div className="flex flex-wrap items-center justify-center gap-4 px-6 md:border-r border-gray-100">
                      <div className="flex flex-col items-center gap-1">
                         <p className="text-[9px] font-black text-muted-foreground uppercase">الصلاحيات</p>
                         <div className="flex gap-1.5">
                            {[
                              { key: 'can_read', label: 'قراءة' },
                              { key: 'can_write', label: 'كتابة' },
                              { key: 'can_edit', label: 'تعديل' },
                              { key: 'can_delete', label: 'حذف' }
                            ].map((p) => (
                              <div key={p.key} className={cn(
                                "w-2 h-2 rounded-full",
                                u.permissions?.[p.key] ? "bg-emerald-500" : "bg-gray-200"
                              )} title={p.label} />
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(u)} className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary">
                        <Edit className="w-5 h-5" />
                      </Button>
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                               <MoreVertical className="w-5 h-5" />
                            </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent className="font-cairo" align="end">
                            <DropdownMenuItem className="text-right font-bold">تعطيل الحساب</DropdownMenuItem>
                            <DropdownMenuItem className="text-right font-bold text-destructive">حذف المستخدم</DropdownMenuItem>
                         </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-[2rem] border-none shadow-2xl font-cairo max-w-xl overflow-hidden p-0" dir="rtl">
          <div className="bg-secondary p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rotate-45 -translate-y-16 translate-x-16" />
             <DialogHeader className="text-right relative z-10">
               <DialogTitle className="text-2xl font-black">{editingUser ? 'تحديث بيانات المستخدم' : 'إنشاء حساب إداري'}</DialogTitle>
               <DialogDescription className="text-gray-400 font-bold mt-1">عين الدور والصلاحيات المناسبة لهذا الحساب.</DialogDescription>
             </DialogHeader>
          </div>
          
          <div className="p-8 space-y-8 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-black text-secondary flex items-center gap-2"><User className="w-4 h-4 text-primary" /> الاسم الكامل</label>
                  <Input value={userData.full_name} onChange={e => setUserData({...userData, full_name: e.target.value})} placeholder="محمد علي" className="rounded-xl h-12 bg-gray-50 border-none" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-black text-secondary flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> البريد الإلكتروني</label>
                  <Input value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} placeholder="staff@ewan.ye" className="rounded-xl h-12 bg-gray-50 border-none" />
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-sm font-black text-secondary flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> نوع الحساب (الدور)</label>
               <div className="grid grid-cols-3 gap-3">
                  {['admin', 'staff', 'customer'].map((role) => (
                    <button 
                      key={role}
                      onClick={() => setUserData({...userData, role})}
                      className={cn(
                        "h-12 rounded-xl font-black text-xs transition-all border-2",
                        userData.role === role ? "border-primary bg-primary/5 text-primary" : "border-gray-50 bg-gray-50 text-muted-foreground hover:bg-gray-100"
                      )}
                    >
                      {role === 'admin' ? 'مدير نظام' : role === 'staff' ? 'موظف' : 'عميل عادي'}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-sm font-black text-secondary flex items-center gap-2">الصلاحيات الممنوحة</label>
               <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 rounded-2xl">
                  {[
                    { id: 'can_read', label: 'عرض البيانات (قراءة)' },
                    { id: 'can_write', label: 'إضافة بيانات جديدة' },
                    { id: 'can_edit', label: 'تعديل البيانات الحالية' },
                    { id: 'can_delete', label: 'حذف البيانات' }
                  ].map((p) => (
                    <div key={p.id} className="flex items-center gap-3">
                       <Checkbox 
                        id={p.id} 
                        checked={(userData.permissions as any)[p.id]} 
                        onCheckedChange={(checked) => setUserData({
                          ...userData, 
                          permissions: {...userData.permissions, [p.id]: !!checked}
                        })}
                       />
                       <label htmlFor={p.id} className="text-sm font-bold text-secondary cursor-pointer">{p.label}</label>
                    </div>
                  ))}
               </div>
            </div>

            <Button onClick={handleSaveUser} disabled={isSaving} className="w-full h-14 rounded-xl bg-secondary text-white font-black text-lg shadow-xl shadow-secondary/10">
              {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : (editingUser ? 'حفظ التعديلات' : 'تفعيل الحساب')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
