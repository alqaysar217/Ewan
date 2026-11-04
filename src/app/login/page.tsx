'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك مجدداً في إيوان",
      });
      router.push('/');
    } catch (error: any) {
      let errorMessage = "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "هذا الحساب غير موجود. يرجى التأكد من البريد الإلكتروني.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "البريد الإلكتروني المدخل غير صالح.";
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <Card className="w-full max-w-md border-border/50 shadow-xl rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="space-y-4 text-center pt-10">
          <div className="mx-auto relative w-16 h-16 overflow-hidden rounded-2xl shadow-lg shadow-primary/20 bg-white">
            <Image 
              src="/logo.png" 
              alt="إيوان" 
              fill 
              className="object-contain p-2"
            />
          </div>
          <CardTitle className="text-3xl font-extrabold text-secondary">تسجيل الدخول</CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            مرحباً بك في منصة إيوان لتصميم الأثاث
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="example@mail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl h-12 border-border/60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl h-12 border-border/60"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? "جاري التحميل..." : "دخول"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-10">
          <p className="text-sm text-muted-foreground">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-primary font-bold hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
          <Link href="/" className="text-xs text-muted-foreground hover:text-secondary transition-colors">
            العودة للرئيسية
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
