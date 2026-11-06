'use client';

import { ReactNode, useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  Layers, 
  Hammer, 
  Scissors, 
  LogOut, 
  Loader2, 
  ShieldCheck, 
  Bell,
  ChevronRight,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // تثبيت مرجع وثيقة المستخدم لمنع حلقات التكرار
  const userDocRef = useMemo(() => user ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: userData, loading: docLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  if (userLoading || docLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-bold font-cairo">جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  if (userData?.role !== 'admin') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-6 text-center font-cairo">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-secondary mb-2">وصول مرفوض</h1>
        <p className="text-muted-foreground mb-6 max-w-md">هذه المنطقة مخصصة للإدارة فقط.</p>
        <Button onClick={() => router.push('/')} className="rounded-xl px-8">العودة للرئيسية</Button>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'ملخص النظام', icon: LayoutDashboard },
    { href: '/admin/vendors', label: 'إدارة المتاجر', icon: Store },
    { href: '/admin/carpenters', label: 'إدارة النجارين', icon: Hammer },
    { href: '/admin/products', label: 'إدارة المنتجات', icon: Package },
    { href: '/admin/categories', label: 'إدارة التصنيفات', icon: Layers },
    { href: '/admin/tailoring', label: 'التفصيل المخصص', icon: Scissors },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#F4F6F5] flex font-cairo" dir="rtl">
        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-secondary text-white hidden lg:flex flex-col border-l border-white/5 sticky top-0 h-screen transition-all duration-300 ease-in-out z-30 shadow-2xl",
            isCollapsed ? "w-24" : "w-72"
          )}
        >
          {/* Collapse Toggle Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -left-3 top-10 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform z-40"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <div className={cn("p-8 flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center px-0")}>
            <div className="relative w-10 h-10 overflow-hidden rounded-md bg-white p-1 shadow-xl shrink-0">
              <Image src="/logo.png" alt="إيوان" fill className="object-contain" />
            </div>
            {!isCollapsed && (
              <span className="text-2xl font-black tracking-tight text-white whitespace-nowrap animate-in fade-in duration-500">إيوان للإدارة</span>
            )}
          </div>
          
          <nav className="flex-1 px-4 space-y-1 mt-4">
            {navItems.map((item) => (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full justify-start gap-4 h-12 rounded-xl transition-all",
                        isCollapsed ? "px-0 justify-center" : "px-6",
                        pathname === item.href 
                          ? "bg-primary text-white hover:bg-primary hover:text-white" 
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <item.icon className="w-5 h-5 shrink-0" /> 
                      {!isCollapsed && <span className="font-bold whitespace-nowrap animate-in fade-in duration-500">{item.label}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="left" className="bg-secondary text-white border-none font-bold">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>

          <div className="p-6 border-t border-white/5 space-y-4">
            <div className={cn("flex items-center gap-3 p-3 bg-white/5 rounded-2xl overflow-hidden", isCollapsed && "justify-center p-2")}>
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center font-black text-primary uppercase shrink-0">
                {userData?.full_name?.charAt(0)}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0 animate-in fade-in duration-500">
                  <p className="text-sm font-bold truncate">{userData?.full_name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">مدير النظام</p>
                </div>
              )}
            </div>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className={cn(
                    "w-full justify-start gap-4 h-12 text-destructive hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all",
                    isCollapsed ? "px-0 justify-center" : "px-6"
                  )}
                >
                  <LogOut className="w-5 h-5 shrink-0" /> 
                  {!isCollapsed && <span className="font-bold animate-in fade-in duration-500">تسجيل الخروج</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="left" className="bg-destructive text-white border-none font-bold">
                  تسجيل الخروج
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          <header className="h-20 bg-white border-b border-border/50 flex items-center justify-between px-8 sticky top-0 z-20">
            <div className="flex items-center gap-4 lg:hidden">
               <Image src="/logo.png" alt="إيوان" width={32} height={32} />
               <span className="text-xl font-black text-secondary">إيوان</span>
            </div>
            <div className="hidden lg:flex items-center gap-4">
               <h2 className="text-lg font-black text-secondary">
                 {navItems.find(i => i.href === pathname)?.label || 'لوحة التحكم'}
               </h2>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-xl relative">
                 <Bell className="w-5 h-5 text-gray-500" />
                 <span className="absolute top-2.5 left-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
              </Button>
              <Link href="/">
                <Button variant="outline" className="rounded-xl h-10 border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all">
                  معاينة المتجر
                </Button>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
