'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Heart, 
  LayoutGrid, 
  LogOut, 
  Menu, 
  Home, 
  Store, 
  Users, 
  Info, 
  Phone,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser, useAuth, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // جلب بيانات المستخدم لمعرفة الدور (Role) مع تثبيت المرجع
  const userDocRef = useMemo(() => user ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: userData, loading: docLoading } = useDoc(userDocRef);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "تم تسجيل الخروج",
        description: "إلى اللقاء قريباً",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const navLinks = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/vendors", label: "المتاجر", icon: Store },
    { href: "/shop", label: "المنتجات", icon: LayoutGrid },
    { href: "/professionals", label: "النجارين والتجار", icon: Users },
    { href: "/about", label: "حول المنصة", icon: Info },
    { href: "/contact", label: "التواصل", icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 overflow-hidden rounded-md shadow-lg shadow-secondary/20 bg-white">
              <Image src="/logo.png" alt="إيوان" fill className="object-contain p-1" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-secondary hidden sm:block">إيوان</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-muted-foreground">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={cn(
                  "transition-all hover:text-primary relative py-1 flex items-center gap-2 group"
                )}
              >
                <link.icon className={cn(
                  "w-4 h-4 transition-colors", 
                  "text-muted-foreground/60 group-hover:text-primary"
                )} />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className={cn(
            "flex items-center bg-gray-50 rounded-md border border-border/60 transition-all duration-300",
            isSearchExpanded ? "w-48 md:w-64 px-3" : "w-10 h-10 justify-center border-none bg-transparent hover:bg-primary/5"
          )}>
            <button 
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="text-muted-foreground hover:text-primary transition-colors shrink-0"
            >
              <Search className="w-5 h-5" />
            </button>
            {isSearchExpanded && (
              <input 
                type="text" 
                placeholder="ابحث هنا..." 
                autoFocus
                className="bg-transparent border-none outline-none w-full mr-2 text-sm text-secondary font-medium"
              />
            )}
          </div>

          <Button variant="ghost" size="icon" className="rounded-md hover:bg-primary/10 hover:text-primary hidden sm:flex">
            <Heart className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-md hover:bg-primary/10 hover:text-primary relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 left-1 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">0</span>
          </Button>

          {!userLoading && (
            user ? (
              <div className="flex items-center gap-2">
                {userData?.role === 'admin' && (
                  <Link href="/admin">
                    <Button className="hidden md:flex gap-2 rounded-md bg-secondary text-white hover:bg-secondary/90 transition-all px-6 font-bold shadow-lg shadow-secondary/10">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      لوحة الإدارة
                    </Button>
                  </Link>
                )}
                {userData?.role === 'vendor' && (
                  <Link href="/vendor/dashboard">
                    <Button variant="outline" className="hidden md:flex gap-2 rounded-md border-primary text-primary hover:bg-primary hover:text-white transition-all px-6 font-bold">
                      <User className="w-4 h-4" />
                      حسابي
                    </Button>
                  </Link>
                )}
                {userData?.role === 'customer' && (
                  <Button variant="ghost" className="hidden md:flex gap-2 font-bold text-secondary">
                    <User className="w-4 h-4 text-primary" /> {userData?.full_name?.split(' ')[0]}
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="hidden sm:flex gap-2 rounded-md border-primary text-primary hover:bg-primary hover:text-white transition-all px-6 font-bold">
                  <User className="w-4 h-4" />
                  دخول
                </Button>
              </Link>
            )
          )}

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-md">
                  <Menu className="w-6 h-6 text-secondary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 border-l border-border/50">
                <SheetHeader className="p-6 border-b border-border/50 bg-secondary text-white">
                  <SheetTitle className="text-right text-white flex items-center gap-3">
                    <div className="relative w-8 h-8 overflow-hidden rounded-md bg-white">
                      <Image src="/logo.png" alt="إيوان" fill className="object-contain p-1" />
                    </div>
                    <span className="font-bold text-xl">قائمة إيوان</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className={cn(
                        "flex items-center justify-between p-4 rounded-md transition-all mb-2 group",
                        "hover:bg-gray-50 text-secondary"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <link.icon className={cn("w-5 h-5", "text-muted-foreground group-hover:text-primary")} />
                        <span className="font-bold text-[15px]">{link.label}</span>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-muted-foreground/50" />
                    </Link>
                  ))}
                  <div className="mt-8 pt-8 border-t border-border/50 space-y-4">
                    {!user ? (
                      <Link href="/login" className="block">
                        <Button className="w-full h-14 rounded-md bg-secondary text-white font-bold gap-2">
                          <User className="w-5 h-5" /> تسجيل الدخول
                        </Button>
                      </Link>
                    ) : (
                      <div className="space-y-4">
                         {userData?.role === 'admin' ? (
                            <Link href="/admin" className="block">
                              <Button className="w-full h-14 rounded-md bg-secondary text-white font-bold gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary" /> لوحة الإدارة
                              </Button>
                            </Link>
                         ) : (
                            <Link href="/vendor/dashboard" className="block">
                              <Button className="w-full h-14 rounded-md bg-primary text-white font-bold gap-2">
                                <User className="w-5 h-5" /> حسابي
                              </Button>
                            </Link>
                         )}
                        <Button 
                          variant="ghost" 
                          onClick={handleLogout}
                          className="w-full h-14 rounded-md text-destructive hover:bg-destructive/5 font-bold gap-2"
                        >
                          <LogOut className="w-5 h-5" /> تسجيل الخروج
                        </Button>
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
