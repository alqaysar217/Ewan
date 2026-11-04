'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Heart, 
  Sparkles, 
  LayoutGrid, 
  LogOut, 
  Menu, 
  Home, 
  Store, 
  Users, 
  Info, 
  Phone,
  X,
  ChevronLeft,
  Bot
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUser, useAuth } from '@/firebase';
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
import Footer from '@/components/Footer';

export default function HomePage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

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
    { href: "/categories", label: "التصنيفات", icon: LayoutGrid },
    { href: "/vendors?type=carpenter", label: "النجارين والتجار", icon: Users },
    { href: "/about", label: "حول المنصة", icon: Info },
    { href: "/contact", label: "التواصل", icon: Phone },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/90 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between px-4 md:px-8">
          
          <div className="flex items-center gap-6 lg:gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-lg shadow-secondary/20 bg-white">
                <Image src="/logo.png" alt="إيوان" fill className="object-contain p-1" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-secondary hidden sm:block">إيوان</span>
            </Link>

            {/* Desktop Navigation */}
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

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Bar Logic */}
            <div className={cn(
              "flex items-center bg-gray-50 rounded-2xl border border-border/60 transition-all duration-300",
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

            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary hidden sm:flex">
              <Heart className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 left-1 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">٠</span>
            </Button>

            {!loading && (
              user ? (
                <Link href="/vendor/dashboard">
                  <Button variant="outline" className="hidden md:flex gap-2 rounded-xl border-primary text-primary hover:bg-primary hover:text-white transition-all px-6 font-bold">
                    <User className="w-4 h-4" />
                    حسابي
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="outline" className="hidden sm:flex gap-2 rounded-xl border-primary text-primary hover:bg-primary hover:text-white transition-all px-6 font-bold">
                    <User className="w-4 h-4" />
                    دخول
                  </Button>
                </Link>
              )
            )}

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Menu className="w-6 h-6 text-secondary" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 border-l border-border/50">
                  <SheetHeader className="p-6 border-b border-border/50 bg-secondary text-white">
                    <SheetTitle className="text-right text-white flex items-center gap-3">
                      <div className="relative w-8 h-8 overflow-hidden rounded-lg bg-white">
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
                          "flex items-center justify-between p-4 rounded-2xl transition-all mb-2 group",
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
                          <Button className="w-full h-14 rounded-2xl bg-secondary text-white font-bold gap-2">
                            <User className="w-5 h-5" /> تسجيل الدخول
                          </Button>
                        </Link>
                      ) : (
                        <Button 
                          variant="ghost" 
                          onClick={handleLogout}
                          className="w-full h-14 rounded-2xl text-destructive hover:bg-destructive/5 font-bold gap-2"
                        >
                          <LogOut className="w-5 h-5" /> تسجيل الخروج
                        </Button>
                      )}
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center bg-secondary overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
            <div className="relative w-full h-full">
              <Image 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" 
                alt="Modern Interior Design"
                fill
                className="object-cover"
                priority
                data-ai-hint="luxury modern teal living room"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-secondary" />
            </div>
          </div>
          
          <div className="container relative z-10 px-4 md:px-8 text-white">
            <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-primary border border-white/10">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold">مستقبل التصميم الداخلي هنا</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.15] tracking-tight">
                اكتشف مساحة أحلامك مع <span className="text-primary underline decoration-primary/30">إيوان</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed font-medium">
                أثاث يلائم ذوقك، وتصاميم ذكية تحول أفكارك إلى واقع. ارفع صورة غرفتك ودع الذكاء الاصطناعي يقترح لك الأفضل.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/ai-design">
                  <Button size="lg" className="text-lg px-10 py-7 rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
                    ابدأ التصميم بالذكاء الاصطناعي
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all font-bold">
                    اكتشف المجموعات
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold text-secondary">تسوق حسب الغرفة</h2>
                <p className="text-muted-foreground text-lg max-w-xl">اختر المساحة التي تود تجديدها واكتشف مجموعاتنا المختارة بعناية لتناسب كل الأذواق.</p>
              </div>
              <Link href="/shop">
                <Button variant="link" className="text-primary font-bold text-lg p-0 flex gap-2 group">
                  كل التصنيفات
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { id: 'living', name: 'غرفة المعيشة', hint: 'teal luxury living room', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600' },
                { id: 'bedroom', name: 'غرفة النوم', hint: 'modern bedroom design', img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600' },
                { id: 'kitchen', name: 'المطبخ', hint: 'contemporary kitchen', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600' },
                { id: 'office', name: 'المكتب المنزلي', hint: 'modern home office', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=600' }
              ].map((cat, idx) => (
                <Link key={idx} href={`/shop?category=${cat.id}`} className="group relative h-96 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/50">
                  <Image 
                    src={cat.img} 
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    data-ai-hint={cat.hint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent" />
                  <div className="absolute bottom-8 right-8 text-white">
                    <h4 className="text-2xl font-bold mb-2">{cat.name}</h4>
                    <span className="text-sm text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">اكتشف المجموعة ←</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Floating AI Assistant Button */}
      <Link href="/ai-design" className="fixed bottom-8 left-8 z-50 group">
        <div className="relative">
          <div className="absolute -inset-2 bg-primary/40 rounded-full blur-2xl group-hover:bg-primary/60 transition-all duration-500 animate-pulse" />
          <Button 
            size="icon" 
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 relative flex items-center justify-center transition-transform hover:-translate-y-2 duration-300"
          >
            <Bot className="w-8 h-8" />
            <span className="absolute -top-12 left-0 bg-secondary text-white text-[13px] font-black px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl border border-white/10">
              صمم غرفتك بذكاء ✨
            </span>
          </Button>
        </div>
      </Link>

      <Footer />
    </div>
  );
}
