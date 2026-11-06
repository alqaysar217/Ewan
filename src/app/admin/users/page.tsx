
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
  Loader2, 
  MoreVertical,
  User,
  Mail,
  Shield,
  Edit,
  Lock,
  Camera,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle
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
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

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
    password: '',
    avatar_url: '',
    role: 'staff',
    permissions: initialPermissions
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setUserData(prev => ({ ...prev, avatar_url: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUser = async () => {
    if (isSaving) return;
    if (!userData.full_name || !userData.email) {
      toast({ variant: "destructive", title: "بيانات ناقصة" });
      return;
    }

    setIsSaving(true);
    
    // إذا كان مديراً، نمنحه كافة الصلاحيات تلقائياً
    const finalPermissions = userData.role === 'admin' ? {
      can_read: true,
      can_write: true,
      can_edit: true,
      can_delete: true
    } : userData.permissions;

    const finalData = {
      ...userData,
      permissions: finalPermissions,
      updated_at: serverTimestamp(),
      is_active: true
    };

    try {
      if (editingUser) {
        await updateDoc(doc(db, 'users', editingUser.id), finalData);
        toast({ title: "تم تحديث البيانات بنجاح" });
      } else {
        await addDoc(collection(db, 'users'), {
          ...finalData,
          created_at: new Date().toISOString()
        });
        toast({ title: "تمت إضافة المستخدم بنجاح" });
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
      password: '',
      avatar_url: '',
      role: 'staff',
      permissions: initialPermissions
    });
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setUserData({
      full_name: user.full_name || '',
      email: user.email || '',
      password: user.password || '',
      avatar_url: user.avatar_url || '',
      role: user.role || 'staff',
      permissions: user.permissions || initialPermissions
    });
    setIsDialogOpen(true);
  };

  const filteredUsers = users?.filter(u => 
    (u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (u.role === 'admin' || u.role === 'staff')
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-cairo" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" /> إدارة طاقم النظام
          </h1>
          <p className="text-muted-foreground font-bold">إدارة حسابات المدراء والموظفين وتعيين صلاحياتهم.</p>
        </div>
        <button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="rounded-xl h-14 px-8 font-black bg-primary text-white shadow-lg shadow-primary/20 flex items-center gap-2 transition-transform hover:-translate-y-1">
          <UserPlus className="w-5 h-5 ml-2" /> إضافة حساب جديد
        </button>
      </div>

      <div className="relative w-full max-w-2xl group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="ابحث بالاسم أو البريد الإلكتروني..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-12 h-14 bg-white border-none shadow-sm rounded-xl font-bold text-lg"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers?.map((u: any) => (
            <Card key={u.id} className="rounded-2xl border-none shadow-sm bg-white hover:shadow-md transition-all group overflow-hidden border border-transparent hover:border-primary/10">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                   <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-secondary text-2xl shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors overflow-hidden relative">
                      {u.avatar_url ? (
                        <Image src={u.avatar_url} alt={u.full_name} fill className="object-cover" />
                      ) : (
                        u.full_name?.charAt(0)
                      )}
                   </div>
                   
                   <div className="flex-1 text-center md:text-right space-y-1">
                      <h3 className="font-black text-lg text-secondary flex items-center justify-center md:justify-start gap-2">
                        {u.full_name}
                        {u.role === 'admin' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </h3>
                      <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-muted-foreground font-bold">
                         <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {u.email}</span>
                         <Badge className={cn(
                           "font-black text-[10px] px-2 py-0.5 rounded-lg border-none shadow-sm",
                           u.role === 'admin' ? "bg-secondary text-white" : "bg-primary/20 text-primary"
                         )}>
                           {u.role === 'admin' ? 'مدير نظام' : 'موظف'}
                         </Badge>
                      </div>
                   </div>

                   <div className="flex flex-wrap items-center justify-center gap-4 px-6 md:border-r border-gray-100">
                      <div className="flex flex-col items-center gap-1">
                         <p className="text-[9px] font-black text-muted-foreground uppercase">الصلاحيات الممنوحة</p>
                         <div className="flex gap-1.5">
                            {[
                              { key: 'can_read', label: 'قراءة' },
                              { key: 'can_write', label: 'كتابة' },
                              { key: 'can_edit', label: 'تعديل' },
                              { key: 'can_delete', label: 'حذف' }
                            ].map((p) => (
                              <div key={p.key} className={cn(
                                "w-2.5 h-2.5 rounded-full",
                                u.permissions?.[p.key] ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-200"
                              )} title={p.label} />
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(u)} className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                        <Edit className="w-5 h-5" />
                      </Button>
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                               <MoreVertical className="w-5 h-5" />
                            </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent className="font-cairo" align="end">
                            <DropdownMenuItem className="text-right font-bold">تعطيل الحساب مؤقتاً</DropdownMenuItem>
                            <DropdownMenuItem className="text-right font-bold text-destructive">حذف الحساب نهائياً</DropdownMenuItem>
                         </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!isSaving) setIsDialogOpen(open); }}>
        <DialogContent className="rounded-[2rem] border-none shadow-2xl font-cairo max-w-2xl overflow-hidden p-0" dir="rtl">
          <div className="bg-secondary p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rotate-45 -translate-y-16 translate-x-16" />
             <DialogHeader className="text-right relative z-10">
               <DialogTitle className="text-2xl font-black">{editingUser ? 'تحديث بيانات المستخدم' : 'إنشاء حساب إداري'}</DialogTitle>
               <DialogDescription className="text-gray-400 font-bold mt-1">عين الدور والصلاحيات المناسبة لهذا الحساب.</DialogDescription>
             </DialogHeader>
          </div>
          
          <div className="p-8 space-y-8 bg-white max-h-[70vh] overflow-y-auto">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <label className="text-sm font-black text-secondary">صورة الموظف</label>
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-[1.5rem] bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/40">
                  {userData.avatar_url ? (
                    <Image src={userData.avatar_url} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-300 group-hover:scale-110 transition-transform" />
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                </div>
                {userData.avatar_url && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setUserData(prev => ({...prev, avatar_url: ''})); }}
                    className="absolute -top-2 -left-2 bg-destructive text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform z-20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-black text-secondary flex items-center gap-2"><User className="w-4 h-4 text-primary" /> الاسم الكامل</label>
                  <Input value={userData.full_name} onChange={e => setUserData({...userData, full_name: e.target.value})} placeholder="محمد علي" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-black text-secondary flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> البريد الإلكتروني</label>
                  <Input value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} placeholder="staff@ewan.ye" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-black text-secondary flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> كلمة المرور</label>
                  <Input type="password" value={userData.password} onChange={e => setUserData({...userData, password: e.target.value})} placeholder="••••••••" className="rounded-xl h-12 bg-gray-50 border-none shadow-inner" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-black text-secondary flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> نوع الحساب (الدور)</label>
                  <select 
                    value={userData.role} 
                    onChange={e => setUserData({...userData, role: e.target.value as any})}
                    className="w-full h-12 rounded-xl bg-gray-50 border-none px-4 font-bold text-sm outline-none shadow-inner focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="admin">مدير نظام (كامل الصلاحيات)</option>
                    <option value="staff">موظف (صلاحيات محدودة)</option>
                  </select>
               </div>
            </div>

            {userData.role === 'staff' ? (
              <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                 <label className="text-sm font-black text-secondary flex items-center gap-2">الصلاحيات الممنوحة للموظف</label>
                 <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
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
            ) : (
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
                <AlertCircle className="w-6 h-6 text-primary shrink-0" />
                <div className="space-y-1">
                  <p className="font-black text-primary text-sm">حساب مدير النظام</p>
                  <p className="text-xs font-bold text-muted-foreground leading-relaxed">بصفتك مديراً للنظام، ستحصل تلقائياً على كافة صلاحيات القراءة والكتابة والتعديل والحذف عبر جميع واجهات المنصة دون الحاجة لضبطها يدوياً.</p>
                </div>
              </div>
            )}

            <Button onClick={handleSaveUser} disabled={isSaving} className="w-full h-14 rounded-xl bg-secondary text-white font-black text-lg shadow-xl shadow-secondary/10 transition-all hover:-translate-y-1">
              {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : (editingUser ? 'تحديث بيانات الحساب' : 'تفعيل الحساب الآن')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
