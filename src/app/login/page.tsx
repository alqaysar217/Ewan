
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useUser, useFirestore, useDoc } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock, ArrowRight, ShieldCheck, Loader2, UserPlus, Copy, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const auth = useAuth();
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userDocRef = useMemo(() => user ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: userData } = useDoc(userDocRef);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      // جلب بيانات الدور مباشرة بعد الدخول للتوجه الصحيح
      const userSnap = await getDoc(doc(db, 'users', uid));
      const role = userSnap.data()?.role;

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك مجدداً في إيوان",
      });

      if (role === 'admin' || role === 'staff') {
        router.push('/admin');
      } else if (role === 'vendor') {
        router.push('/vendor/dashboard');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "بيانات الاعتماد غير صالحة. يرجى التأكد من البريد وكلمة المرور.";
      }
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyUid = () => {
    if (user) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "تم نسخ المعرف (UID)", description: "تم النسخ بنجاح." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4" dir="rtl">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23073D49' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l10.99-6.35L25 17.9v12.7L13.99 36.95 3 30.6V17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.31zM28 15l-12.98-7.5V0h2v6.35L28 12.69v2.3zm0 18.5l-12.98 7.5v8h2v-6.85l12.98-7.5v-2.31z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
      
      <Card className="w-full max-w-md border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl relative z-10">
        <CardHeader className="space-y-6 text-center pt-12 pb-8">
          <div className="mx-auto relative w-20 h-20 overflow-hidden rounded-xl shadow-2xl shadow-primary/20 bg-white p-3 flex items-center justify-center border border-gray-50">
            <Image 
              src="/logo.png" 
              alt="إيوان" 
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black text-secondary tracking-tight">تسجيل الدخول</CardTitle>
            <CardDescription className="text-muted-foreground font-bold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> الوصول الآمن لمنصة إيوان
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {user && !userData && (
            <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-3">
              <p className="text-[11px] font-bold text-primary leading-relaxed text-center">أنت مسجل الدخول، لكن حسابك غير مفعل كمسؤول في قاعدة البيانات.</p>
              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-100">
                <code className="text-[10px] font-mono text-secondary truncate max-w-[200px]">{user.uid}</code>
                <Button size="sm" variant="ghost" className="h-8 px-2 text-primary" onClick={copyUid}>
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="font-black text-secondary mr-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                البريد الإلكتروني
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-[12px] h-14 border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 font-bold transition-all text-secondary"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center mr-1">
                <Label htmlFor="password" className="font-black text-secondary flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  كلمة المرور
                </Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-[12px] h-14 border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary/20 font-bold transition-all text-secondary"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-[15px] text-lg font-black bg-secondary hover:bg-secondary/90 text-white transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-3 group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  دخول آمن
                  <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-6 pb-12 pt-4 px-8 border-t border-gray-50">
          <div className="flex flex-col gap-4 w-full">
            <Link href="/register" className="text-sm font-black text-primary hover:underline flex items-center justify-center gap-2">
               <UserPlus className="w-4 h-4" /> إنشاء حساب جديد للمعاينة
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
