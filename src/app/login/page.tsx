'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Mail, ArrowRight, ShieldCheck, Loader2, Key } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      const userSnap = await getDoc(doc(db, 'users', uid));
      
      if (!userSnap.exists()) {
        toast({
          variant: "destructive",
          title: "وصول غير مصرح",
          description: "حسابك مسجل في النظام ولكن لا يملك صلاحيات وصول إدارية.",
        });
        setLoading(false);
        return;
      }

      const role = userSnap.data()?.role;

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك مجدداً ${userSnap.data()?.full_name || ''}`,
      });

      if (role === 'admin' || role === 'staff') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      console.error("Login error:", error.code, error.message);
      let errorMessage = "تأكد من البريد الإلكتروني وكلمة المرور.";
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      }

      toast({
        variant: "destructive",
        title: "فشل الدخول",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4 font-cairo" dir="rtl">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%232C200E' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l10.99-6.35L25 17.9v12.7L13.99 36.95 3 30.6V17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.31zM28 15l-12.98-7.5V0h2v6.35L28 12.69v2.3zm0 18.5l-12.98 7.5v8h2v-6.85l12.98-7.5v-2.31z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
      
      <Card className="w-full max-w-md border-none shadow-[0_32px_64px_-12px_rgba(44,32,14,0.1)] rounded-[2.5rem] overflow-hidden bg-card/80 backdrop-blur-xl relative z-10">
        <CardHeader className="space-y-6 text-center pt-12 pb-8">
          <div className="mx-auto relative w-20 h-20 overflow-hidden rounded-xl shadow-2xl shadow-accent/20 bg-card p-3 flex items-center justify-center border border-border/50">
            <Image 
              src="/logo.png" 
              alt="إيوان" 
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black text-primary tracking-tight">تسجيل الدخول</CardTitle>
            <CardDescription className="text-muted-foreground font-bold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" /> الوصول الآمن للمدراء والموظفين
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="font-black text-primary mr-1 flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-accent" />
                البريد الإلكتروني
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@ewan.ye" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-[12px] h-14 border-border/50 bg-background/50 focus:bg-card focus:ring-2 focus:ring-accent/20 font-bold transition-all text-primary"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="font-black text-primary flex items-center gap-2 text-sm mr-1">
                <Key className="w-4 h-4 text-accent" />
                كلمة المرور
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-[12px] h-14 border-border/50 bg-background/50 focus:bg-card focus:ring-2 focus:ring-accent/20 font-bold transition-all text-primary"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-[15px] text-lg font-black bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  دخول للنظام
                  <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pb-12 pt-4 px-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center font-bold">
            منصة إيوان للأثاث - نظام الإدارة الموحد
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}