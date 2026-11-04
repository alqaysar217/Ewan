'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Heart, 
  Zap, 
  LayoutGrid, 
  LogOut, 
  Menu, 
  Home, 
  Store, 
  Users, 
  Info, 
  Phone,
  ChevronLeft,
  Bot,
  ArrowLeft,
  Star,
  Quote,
  CheckCircle,
  Hammer,
  Palette,
  MapPin,
  HelpCircle,
  CheckCircle2
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    { href: "/shop", label: "التصنيفات", icon: LayoutGrid },
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
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-lg shadow-secondary/20 bg-white">
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
              "flex items-center bg-gray-50 rounded-lg border border-border/60 transition-all duration-300",
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
                  <Button variant="outline" className="hidden md:flex gap-2 rounded-lg border-primary text-primary hover:bg-primary hover:text-white transition-all px-6 font-bold">
                    <User className="w-4 h-4" />
                    حسابي
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="outline" className="hidden sm:flex gap-2 rounded-lg border-primary text-primary hover:bg-primary hover:text-white transition-all px-6 font-bold">
                    <User className="w-4 h-4" />
                    دخول
                  </Button>
                </Link>
              )
            )}

            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-lg">
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
                          "flex items-center justify-between p-4 rounded-lg transition-all mb-2 group",
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
                          <Button className="w-full h-14 rounded-lg bg-secondary text-white font-bold gap-2">
                            <User className="w-5 h-5" /> تسجيل الدخول
                          </Button>
                        </Link>
                      ) : (
                        <Button 
                          variant="ghost" 
                          onClick={handleLogout}
                          className="w-full h-14 rounded-lg text-destructive hover:bg-destructive/5 font-bold gap-2"
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
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-secondary">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" 
              alt="Modern Interior Design"
              fill
              className="object-cover"
              priority
              data-ai-hint="luxury modern teal living room"
            />
          </div>
          
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-secondary via-secondary/85 to-transparent backdrop-blur-[1px]" />
          
          <div className="container relative z-20 px-4 md:px-8">
            <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-right-12 duration-1000 py-20">
              <div className="relative inline-flex items-center px-6 py-2 bg-secondary/30 backdrop-blur-xl border-r-4 border-primary text-primary overflow-hidden">
                <span className="text-xs font-black tracking-[0.2em] uppercase">المساحات الذكية • إيوان</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.2] tracking-tight">
                اكتشف مساحة أحلامك مع <span className="text-primary">إيوان</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium">
                أثاث يلائم ذوقك، وتصاميم ذكية تحول أفكارك إلى واقع. ارفع صورة غرفتك ودع الذكاء الاصطناعي يقترح لك الأفضل.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Link href="/ai-design">
                  <Button size="lg" className="h-16 px-10 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1">
                    ابدأ التصميم بالذكاء الاصطناعي <Zap className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" variant="outline" className="h-16 px-10 rounded-lg border-white/20 bg-white/5 text-white hover:bg-white/10 font-bold text-lg transition-all">
                    اكتشف المجموعات
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-secondary">تسوق حسب الغرفة</h2>
                <p className="text-muted-foreground text-lg max-w-xl">اختر المساحة التي تود تجديدها واكتشف مجموعاتنا المختارة بعناية.</p>
              </div>
              <Link href="/shop">
                <Button variant="ghost" className="text-primary font-bold text-lg p-0 flex gap-2 group hover:bg-transparent">
                  تصفح كل التصنيفات
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { id: 'living', name: 'غرفة المعيشة', hint: 'teal luxury living room', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600' },
                { id: 'bedroom', name: 'غرفة النوم', hint: 'modern bedroom design', img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=600' },
                { id: 'kitchen', name: 'المطبخ', hint: 'contemporary kitchen', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=crop&q=80&w=600' },
                { id: 'office', name: 'المكتب المنزلي', hint: 'modern home office', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=600' }
              ].map((cat, idx) => (
                <Link key={idx} href={`/shop?category=${cat.id}`} className="group relative h-[450px] rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700">
                  <Image 
                    src={cat.img} 
                    alt={cat.name}
                    fill
                    className="object-cover scale-100 group-hover:scale-110 transition-transform duration-1000"
                    data-ai-hint={cat.hint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
                  <div className="absolute bottom-10 right-10 left-10 text-white">
                    <h4 className="text-2xl font-black mb-2">{cat.name}</h4>
                    <p className="text-sm text-white/70 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">استكشف القطع الآن</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Vendors Section */}
        <section className="py-24 bg-gray-50">
          <div className="container px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-secondary">نخبة النجارين والمصممين</h2>
                <p className="text-muted-foreground text-lg max-w-xl">تعرف على أمهر الحرفيين الذين يحولون الخشب إلى قطع فنية تدوم للأبد.</p>
              </div>
              <Link href="/vendors?type=carpenter">
                <Button variant="ghost" className="text-primary font-bold text-lg p-0 flex gap-2 group hover:bg-transparent">
                  استكشف كل المبدعين
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'ورشة إتقان للنجارة', type: 'نجارة يدوية', rating: 4.9, icon: Hammer, location: 'صنعاء، التحرير', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=600', description: 'متخصصون في صناعة غرف النوم والدواوين الخشبية الفاخرة بجودة يمنية أصيلة.' },
                { name: 'تصاميم رؤية', type: 'تصميم داخلي', rating: 4.8, icon: Palette, location: 'عدن، المنصورة', img: 'https://images.unsplash.com/photo-1554232456-8727aae0cfa4?auto=format&fit=crop&q=80&w=600', description: 'نحول مساحات منزلك إلى لوحات فنية بلمسات عصرية وأسعار تنافسية.' },
                { name: 'الخشب الفاخر', type: 'أثاث مخصص', rating: 5.0, icon: Hammer, location: 'حضرموت، المكلا', img: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=600', description: 'أثاث منزلي ومكتبي مخصص حسب الطلب من أفضل أنواع الأخشاب الطبيعية.' }
              ].map((vendor, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm border border-border/50 group hover:shadow-xl transition-all overflow-hidden flex flex-col">
                  <div className="relative h-56 w-full">
                    <Image src={vendor.img} alt={vendor.name} fill className="object-cover group-hover:scale-105 transition-transform" data-ai-hint="carpentry workshop" />
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button className="bg-white text-secondary hover:bg-white/90 font-bold rounded-lg shadow-xl">عرض المعرض</Button>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <h4 className="text-xl font-black text-secondary">{vendor.name}</h4>
                          <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />
                        </div>
                        <div className="flex items-center gap-2 text-primary">
                          <vendor.icon className="w-4 h-4" />
                          <span className="text-sm font-bold">{vendor.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-lg">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-black">{vendor.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{vendor.description}</p>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold pt-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {vendor.location}
                    </div>
                    <div className="pt-4 mt-auto">
                      <Button variant="outline" className="w-full rounded-lg border-secondary/20 hover:bg-secondary hover:text-white font-bold transition-all h-12">عرض كافة المنتجات</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Showcase Section */}
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-8">
            <div className="bg-secondary rounded-lg p-8 md:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
              <div className="absolute top-0 left-0 w-full h-full bg-primary/5 pointer-events-none" />
              <div className="relative z-10 lg:w-1/2 space-y-8 text-white">
                <h2 className="text-4xl md:text-5xl font-black leading-tight">شاهد خيالك يصبح واقعاً</h2>
                <p className="text-xl text-gray-300 leading-relaxed font-medium">
                  باستخدام تقنياتنا المتقدمة، يمكنك رؤية كيف سيبدو منزلك قبل شراء أي قطعة. ذكاء اصطناعي يفهم ذوقك وميزانيتك ومساحة غرفتك.
                </p>
                <Link href="/ai-design" className="block w-fit">
                  <Button size="lg" className="h-16 px-12 rounded-lg bg-white text-secondary hover:bg-primary hover:text-white font-black text-lg transition-all shadow-xl shadow-white/5">
                    جرب الاستوديو الذكي الآن
                  </Button>
                </Link>
              </div>
              <div className="lg:w-1/2 relative h-[400px] w-full rounded-lg overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=800" 
                  alt="AI Design Preview"
                  fill
                  className="object-cover"
                  data-ai-hint="interior design before and after"
                />
                <div className="absolute top-6 right-6 bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg">
                  معاينة التصميم الذكي
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gray-50">
          <div className="container px-4 md:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest">
                <HelpCircle className="w-5 h-5" /> مركز المساعدة
              </div>
              <h2 className="text-4xl font-black text-secondary">الأسئلة الشائعة</h2>
              <p className="text-muted-foreground text-lg">كل ما تحتاج معرفته حول رحلتك مع إيوان.</p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                { q: "كيف يعمل التصميم بالذكاء الاصطناعي؟", a: "ببساطة، ترفع صورة لغرفتك الحالية، تختار الطراز المفضل (مودرن، كلاسيك..)، وتحدد ميزانيتك. سيقوم نظامنا بتحليل المساحة واقتراح قطع أثاث حقيقية متوفرة في متجرنا تناسب مساحتك." },
                { q: "هل المنتجات المعروضة حقيقية ومتوفرة؟", a: "نعم، كافة قطع الأثاث التي يقترحها الذكاء الاصطناعي هي منتجات حقيقية مسجلة من قبل التجار والنجارين في اليمن، ويمكنك طلبها مباشرة عبر المنصة." },
                { q: "هل توجد خدمة توصيل للمدن اليمنية؟", a: "نعم، نوفر خدمة التوصيل والتركيب في معظم المدن الكبرى (صنعاء، عدن، تعز، حضرموت) بالتنسيق مع شبكة التجار المعتمدين لدينا." },
                { q: "كيف يمكنني الانضمام كتاجر أو نجار؟", a: "يمكنك التسجيل كتاجر من صفحة التسجيل، وبعد مراجعة الإدارة لبياناتك وتوثيق ورشتك أو متجرك، ستتمكن من رفع منتجاتك وبدء استقبال الطلبات." }
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-white border rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-bold text-secondary hover:no-underline">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-[15px] pb-6">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white overflow-hidden border-t">
          <div className="container px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-4xl font-black text-secondary">ماذا يقول عملاؤنا</h2>
              <p className="text-muted-foreground text-lg">قصص نجاح من أشخاص حولوا منازلهم إلى واحات إبداع باستخدام إيوان.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'أحمد السعدني', role: 'صاحب منزل', comment: 'تجربة التصميم بالذكاء الاصطناعي كانت مذهلة! استطعت رؤية الكنب في غرفتي قبل الطلب، والجودة فاقت التوقعات.', rating: 5 },
                { name: 'سارة المطيري', role: 'مصممة مستقلة', comment: 'إيوان سهل علي التواصل مع أفضل النجارين في الرياض. القطع المخصصة التي طلبتها كانت تحفة فنية حقيقية.', rating: 5 },
                { name: 'خالد عبد الله', role: 'عميل جديد', comment: 'سرعة في التوصيل واحترافية في التعامل. المتجر يضم تشكيلة واسعة تناسب كل الأذواق والميزانيات.', rating: 4 }
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-white p-8 rounded-lg shadow-sm border border-border/50 relative group hover:-translate-y-2 transition-all duration-300">
                  <div className="text-primary/10 absolute top-6 left-6">
                    <Quote className="w-12 h-12 fill-current" />
                  </div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("w-4 h-4", i < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                    ))}
                  </div>
                  <p className="text-secondary font-medium leading-relaxed mb-6 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-4 border-t pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-black text-primary">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h5 className="font-black text-secondary">{testimonial.name}</h5>
                      <p className="text-xs text-muted-foreground font-bold">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-white">
          <div className="container px-4 md:px-8 text-center space-y-10">
            <h2 className="text-4xl md:text-5xl font-black">جاهز لتغيير مساحتك؟</h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto font-medium">انضم إلى آلاف المستخدمين الذين بدأوا رحلة تصميم منازلهم بذكاء وسهولة.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="h-16 px-12 rounded-lg bg-white text-primary hover:bg-secondary hover:text-white font-black text-lg transition-all shadow-xl">
                  سجل حسابك الآن
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-16 px-12 rounded-lg border-white/40 text-white hover:bg-white/10 font-black text-lg transition-all">
                  تواصل مع خبير
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Floating AI Assistant Button */}
      <Link href="/ai-design" className="fixed bottom-10 left-10 z-[100] group">
        <div className="relative flex items-center gap-4">
          <div className="bg-secondary text-white px-5 py-2.5 rounded-lg text-xs font-black shadow-2xl border border-white/10 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden md:block whitespace-nowrap">
            صمم غرفتك بذكاء ✨
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg group-hover:bg-primary/50 transition-all duration-500 animate-pulse scale-125" />
            <Button 
              size="icon" 
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 relative flex items-center justify-center transition-all hover:scale-110 duration-300 overflow-hidden border-2 border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <Bot className="w-8 h-8 drop-shadow-lg" />
            </Button>
          </div>
        </div>
      </Link>

      <Footer />
    </div>
  );
}
