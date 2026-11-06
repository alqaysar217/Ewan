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
  Trash2,
  X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser, useAuth, useFirestore, useDoc } from '@/firebase';
import { useCart } from '@/context/cart-context';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function Header() {
  const { user, loading: userLoading } = useUser();
  const { cart, removeFromCart, clearCart, cartCount } = useCart();
  const db = useFirestore();
  const auth = useAuth();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const userDocRef = useMemo(() => user ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
  const { data: userData } = useDoc(userDocRef);

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
    { href: "/professionals", label: "المصممين والنجارين", icon: Users },
    { href: "/about", label: "حول المنصة", icon: Info },
    { href: "/contact", label: "التواصل", icon: Phone },
  ];

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/90 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-10 h-10 overflow-hidden rounded-md shadow-lg shadow-primary/10 bg-card">
              <Image src="/logo.png" alt="إيوان" fill className="object-contain p-1" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-primary hidden sm:block font-cairo">إيوان</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-muted-foreground font-cairo">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={cn(
                  "transition-all hover:text-accent relative py-1 flex items-center gap-2 group"
                )}
              >
                <link.icon className={cn(
                  "w-4 h-4 transition-colors", 
                  "text-muted-foreground/60 group-hover:text-accent"
                )} />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4 font-cairo">
          <div className={cn(
            "flex items-center bg-muted/30 rounded-md border border-border/60 transition-all duration-300",
            isSearchExpanded ? "w-48 md:w-64 px-3" : "w-10 h-10 justify-center border-none bg-transparent hover:bg-accent/5"
          )}>
            <button 
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="text-muted-foreground hover:text-accent transition-colors shrink-0"
            >
              <Search className="w-5 h-5" />
            </button>
            {isSearchExpanded && (
              <input 
                type="text" 
                placeholder="ابحث هنا..." 
                autoFocus
                className="bg-transparent border-none outline-none w-full mr-2 text-sm text-primary font-medium"
              />
            )}
          </div>

          <Button variant="ghost" size="icon" className="rounded-md hover:bg-accent/10 hover:text-accent hidden sm:flex">
            <Heart className="w-5 h-5" />
          </Button>
          
          {/* سلة المشتريات */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-md hover:bg-accent/10 hover:text-accent relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1 left-1 w-4 h-4 bg-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-[400px] p-0 border-r border-border/50 flex flex-col font-cairo" dir="rtl">
              <SheetHeader className="p-6 border-b border-border/50 bg-secondary text-white">
                <SheetTitle className="text-right text-white flex items-center justify-between">
                  <span className="text-xl font-black">سلة المشتريات</span>
                  <ShoppingBag className="w-5 h-5 text-accent" />
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex-1 overflow-hidden flex flex-col">
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-black text-secondary">سلتك فارغة حالياً</p>
                      <p className="text-sm text-muted-foreground font-medium">ابدأ بتصفح المنتجات وأضف ما يعجبك هنا.</p>
                    </div>
                    <Link href="/shop" className="w-full">
                      <Button className="w-full rounded-xl bg-primary h-12 font-black">تسوق الآن</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="flex-1 p-6">
                      <div className="space-y-6">
                        {cart.map((item) => (
                          <div key={item.id} className="flex gap-4 group">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted/10 border border-border/50 shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div className="space-y-1">
                                <h4 className="text-sm font-black text-secondary truncate">{item.name}</h4>
                                <p className="text-xs font-bold text-accent">
                                  {item.price.toLocaleString('en-US')} ريال <span className="text-muted-foreground">× {item.quantity}</span>
                                </p>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-secondary">{(item.price * item.quantity).toLocaleString('en-US')} ريال</span>
                                <button 
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-destructive opacity-40 hover:opacity-100 transition-opacity p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="p-6 border-t border-border/50 bg-gray-50/50 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-muted-foreground">المجموع الفرعي:</span>
                          <span className="text-secondary">{cartTotal.toLocaleString('en-US')} ريال</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-black">
                          <span className="text-secondary">الإجمالي الكلي:</span>
                          <span className="text-primary">{cartTotal.toLocaleString('en-US')} ريال</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 pt-2">
                        <Button className="w-full h-14 rounded-xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20">
                          إتمام الطلب الآن
                        </Button>
                        <Button variant="ghost" onClick={clearCart} className="w-full h-10 rounded-xl text-destructive hover:bg-destructive/5 font-bold">
                          تفريغ السلة
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {!userLoading && (
            user ? (
              <div className="flex items-center gap-2">
                {userData?.role === 'admin' && (
                  <Link href="/admin">
                    <Button className="hidden md:flex gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all px-6 font-bold shadow-lg shadow-primary/10">
                      <ShieldCheck className="w-4 h-4 text-accent" />
                      لوحة الإدارة
                    </Button>
                  </Link>
                )}
                {userData?.role === 'vendor' && (
                  <Link href="/vendor/dashboard">
                    <Button variant="outline" className="hidden md:flex gap-2 rounded-md border-accent text-accent hover:bg-accent hover:text-white transition-all px-6 font-bold">
                      <User className="w-4 h-4" />
                      حسابي
                    </Button>
                  </Link>
                )}
                {userData?.role === 'customer' && (
                  <Button variant="ghost" className="hidden md:flex gap-2 font-bold text-primary">
                    <User className="w-4 h-4 text-accent" /> {userData?.full_name?.split(' ')[0]}
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="hidden sm:flex gap-2 rounded-md border-accent text-accent hover:bg-accent hover:text-white transition-all px-6 font-bold">
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
                  <Menu className="w-6 h-6 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 border-l border-border/50 font-cairo">
                <SheetHeader className="p-6 border-b border-border/50 bg-secondary text-white">
                  <SheetTitle className="text-right text-white flex items-center gap-3">
                    <div className="relative w-8 h-8 overflow-hidden rounded-md bg-card">
                      <Image src="/logo.png" alt="إيوان" fill className="object-contain p-1" />
                    </div>
                    <span className="font-bold text-xl">قائمة إيوان</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-4 bg-background h-full">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className={cn(
                        "flex items-center justify-between p-4 rounded-md transition-all mb-2 group",
                        "hover:bg-muted/30 text-primary"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <link.icon className={cn("w-5 h-5", "text-muted-foreground group-hover:text-accent")} />
                        <span className="font-bold text-[15px]">{link.label}</span>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-muted-foreground/50" />
                    </Link>
                  ))}
                  <div className="mt-8 pt-8 border-t border-border/50 space-y-4">
                    {!user ? (
                      <Link href="/login" className="block">
                        <Button className="w-full h-14 rounded-md bg-primary text-primary-foreground font-bold gap-2">
                          <User className="w-5 h-5" /> تسجيل الدخول
                        </Button>
                      </Link>
                    ) : (
                      <div className="space-y-4">
                         {userData?.role === 'admin' ? (
                            <Link href="/admin" className="block">
                              <Button className="w-full h-14 rounded-md bg-primary text-primary-foreground font-bold gap-2">
                                <ShieldCheck className="w-4 h-4 text-accent" /> لوحة الإدارة
                              </Button>
                            </Link>
                         ) : (
                            <Link href="/vendor/dashboard" className="block">
                              <Button className="w-full h-14 rounded-md bg-accent text-white font-bold gap-2">
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
