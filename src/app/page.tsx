'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Palette, MessageCircle, User, Heart, ArrowRight, Sparkles, LayoutGrid, LogOut } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

export default function HomePage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-interior');

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="container flex h-20 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-lg shadow-secondary/20 bg-white">
                <Image 
                  src="/logo.png" 
                  alt="إيوان" 
                  fill 
                  className="object-contain p-1"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-secondary">إيوان</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-muted-foreground">
              <Link href="/" className="text-secondary border-b-2 border-primary pb-1">الرئيسية</Link>
              <Link href="/shop" className="transition-colors hover:text-primary">المتجر</Link>
              <Link href="/categories" className="transition-colors hover:text-primary">التصنيفات</Link>
              <Link href="/ai-design" className="flex items-center gap-2 transition-colors hover:text-primary">
                <Sparkles className="w-4 h-4 text-primary" />
                استوديو التصميم الذكي
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center relative w-72">
              <Search className="absolute right-3 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="ابحث عن أثاث، غرف، أو بائعين..." 
                className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-border/60 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary"><Heart className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1 left-1 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">٠</span>
              </Button>
              
              {!loading && (
                user ? (
                  <div className="flex items-center gap-2">
                    <Link href="/vendor/dashboard">
                      <Button variant="outline" className="hidden sm:flex gap-2 rounded-xl border-border hover:bg-secondary hover:text-white transition-all">
                        <User className="w-4 h-4" />
                        حسابي
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-destructive hover:bg-destructive/10">
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button variant="outline" className="hidden sm:flex gap-2 rounded-xl border-border hover:bg-secondary hover:text-white transition-all px-6">
                      <User className="w-4 h-4" />
                      دخول
                    </Button>
                  </Link>
                )
              )}
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
                  <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all">
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
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

        {/* AI Promo Section */}
        <section className="py-24 relative bg-gray-50 border-y border-border/50">
          <div className="container px-4 md:px-8 grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-square max-w-lg mx-auto w-full">
              <div className="absolute -top-6 -right-6 w-full h-full bg-primary/10 rounded-[3rem] animate-pulse" />
              <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                <Image 
                  src="https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=800" 
                  alt="AI Redesign Preview"
                  fill
                  className="object-cover"
                  data-ai-hint="interior design before and after"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 text-center space-y-3 max-w-[80%]">
                    <Palette className="w-10 h-10 text-primary mx-auto" />
                    <h5 className="text-xl font-bold text-secondary">تحويل ذكي للغرف</h5>
                    <p className="text-sm text-muted-foreground">قم برفع صورة لغرفتك ودع ذكاء إيوان يمنحك تجربة واقعية للطراز المفضل لديك.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">الابتكار في متناول يدك</span>
                <h2 className="text-5xl font-extrabold text-secondary leading-tight">صمم، جرب، واشترِ في مكان واحد</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  نحن لا نقدم مجرد صور خيالية. ذكاؤنا الاصطناعي يربط بين رؤيتك التصميمية وبين قطع أثاث حقيقية متوفرة في متجرنا من تجار ونجارين موثوقين.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: 'تحليل دقيق', text: 'فهم أبعاد غرفتك وإضاءتها تلقائياً' },
                  { title: 'منتجات حقيقية', text: 'توصيات بقطع أثاث يمكنك شراؤها فوراً' },
                  { title: 'تواصل مباشر', text: 'تواصل مع النجارين لتعديل القطع حسب رغبتك' },
                  { title: 'توفير الوقت', text: 'شاهد النتيجة النهائية قبل أن تبدأ فعلياً' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-border/50 shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex shrink-0 items-center justify-center text-primary">
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <div>
                      <h6 className="font-bold text-secondary">{item.title}</h6>
                      <p className="text-xs text-muted-foreground mt-1">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button size="lg" className="rounded-2xl px-8 py-7 text-lg group bg-secondary hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 w-full sm:w-auto">
                ابدأ تجربتك الآن
                <Sparkles className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-white py-20">
        <div className="container px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 pb-16 border-b border-white/10 mb-16">
            <div className="space-y-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-white">
                  <Image 
                    src="/logo.png" 
                    alt="إيوان" 
                    fill 
                    className="object-contain p-1"
                  />
                </div>
                <span className="text-2xl font-bold tracking-tight">إيوان</span>
              </Link>
              <p className="text-gray-400 leading-relaxed">
                المنصة العربية الرائدة في دمج الذكاء الاصطناعي مع فن التصميم الداخلي وتجارة الأثاث، لخلق منازل تعبر عن أصحابها.
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-bold mb-8">روابط هامة</h5>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="/shop" className="hover:text-primary transition-colors">تصفح المتجر</Link></li>
                <li><Link href="/ai-design" className="hover:text-primary transition-colors">استوديو التصميم</Link></li>
                <li><Link href="/vendors" className="hover:text-primary transition-colors">دليل المتاجر</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">تواصل معنا</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-8">سياساتنا</h5>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">الأسئلة الشائعة</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-8">النشرة البريدية</h5>
              <p className="text-gray-400 mb-6">احصل على آخر نصائح التصميم والعروض الحصرية.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="بريدك الإلكتروني" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-white" 
                />
                <Button className="bg-primary hover:bg-primary/90 h-auto px-6 rounded-xl">سجل</Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-4">
            <p>© {new Date().getFullYear()} إيوان. جميع الحقوق محفوظة.</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-white transition-colors">Pinterest</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
