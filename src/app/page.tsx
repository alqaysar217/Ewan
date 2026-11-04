
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Palette, MessageCircle, User, Heart, ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HomePage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-interior');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">إ</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">إيوان</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/shop" className="transition-colors hover:text-primary">المتجر</Link>
              <Link href="/categories" className="transition-colors hover:text-primary">التصنيفات</Link>
              <Link href="/ai-design" className="flex items-center gap-1 transition-colors hover:text-primary text-primary font-bold">
                <Palette className="w-4 h-4" />
                استوديو التصميم الذكي
              </Link>
              <Link href="/about" className="transition-colors hover:text-primary">عن إيوان</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center relative w-64">
              <Search className="absolute right-3 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="ابحث عن أثاث..." 
                className="w-full pr-10 pl-4 py-2 bg-secondary/50 border-none rounded-full text-sm focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full"><Heart className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="rounded-full"><ShoppingBag className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="rounded-full"><MessageCircle className="w-5 h-5" /></Button>
              <Button variant="outline" className="hidden sm:flex gap-2 rounded-full px-6">
                <User className="w-4 h-4" />
                دخول
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center overflow-hidden">
          {heroImage && (
            <div className="absolute inset-0 z-0">
              <Image 
                src={heroImage.imageUrl} 
                alt={heroImage.description}
                fill
                className="object-cover scale-105"
                priority
                data-ai-hint={heroImage.imageHint}
              />
              <div className="absolute inset-0 bg-black/35" />
            </div>
          )}
          <div className="container relative z-10 px-4 md:px-8 text-white">
            <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h1 className="text-6xl md:text-8xl font-extrabold leading-tight tracking-tight">
                إيوان — صمّم واكتشف أثاث منزلك بالذكاء الاصطناعي
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 max-w-xl leading-relaxed">
                حوّل مساحاتك الفارغة إلى غرف أحلامك بلمسة واحدة. ارفع صورة غرفتك ودع الذكاء الاصطناعي يقترح لك أفضل التصاميم بمنتجات حقيقية.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <Link href="/ai-design">
                  <Button size="lg" className="text-xl px-10 py-8 rounded-2xl shadow-2xl hover:scale-105 transition-all bg-primary hover:bg-primary/90">
                    ابدأ التصميم الآن
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" variant="secondary" className="text-xl px-10 py-8 rounded-2xl shadow-2xl hover:scale-105 transition-all">
                    اكتشف الأثاث
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-32 bg-background">
          <div className="container px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
              <h2 className="text-4xl font-bold">لماذا تختار إيوان؟</h2>
              <p className="text-muted-foreground text-lg">نحن نجمع بين تكنولوجيا المستقبل وفن التصميم لنقدم لك تجربة فريدة</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center space-y-6 p-10 rounded-[3rem] bg-card border border-border/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                  <Palette className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold">تصميم ذكي مخصص</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  ارفع صورة غرفتك واختر الطراز المفضل لديك، وسيقوم نظامنا بتحليل المساحة واقتراح تصميم متكامل.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-6 p-10 rounded-[3rem] bg-card border border-border/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold">منتجات حقيقية فقط</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  جميع الاقتراحات هي قطع أثاث متوفرة في متجرنا من بائعين ونجارين موثوقين، وليست مجرد صور خيالية.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-6 p-10 rounded-[3rem] bg-card border border-border/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                  <MessageCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold">تواصل مباشر</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  تواصل مباشرة مع التجار أو النجارين للاستفسار عن المنتجات أو لطلب تفصيل خاص يناسب مساحتك.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Showcase */}
        <section className="py-24 bg-secondary/30 relative overflow-hidden">
           <div className="container px-4 md:px-8 grid lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-8">
               <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold">استوديو التصميم الذكي</span>
               <h2 className="text-5xl font-bold leading-tight">شاهد غرفتك تتحول بلمحة بصر</h2>
               <p className="text-xl text-muted-foreground leading-relaxed">
                 استخدم تقنياتنا المتقدمة لتجربة أنماط ديكور مختلفة على مساحتك الحقيقية. سواء كنت تريد طرازاً مودرن، كلاسيكي أو بوهيمي، إيوان سيساعدك على رؤية النتيجة قبل الشراء.
               </p>
               <ul className="space-y-4">
                 {['تحليل تلقائي لمساحة الغرفة', 'اقتراح قطع أثاث متوافقة', 'تنسيق ألوان احترافي', 'ربط فوري بالبائعين'].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-lg font-medium">
                     <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">✓</div>
                     {item}
                   </li>
                 ))}
               </ul>
               <Button size="lg" className="rounded-2xl px-8 py-7 text-lg group">
                 جرب استوديو التصميم
                 <ArrowRight className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
               </Button>
             </div>
             <div className="relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl">
               <Image 
                 src="https://picsum.photos/seed/ai-show/800/1000" 
                 alt="AI Interior Design Preview"
                 fill
                 className="object-cover"
                 data-ai-hint="luxury interior design"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
                 <div className="bg-white/90 backdrop-blur p-6 rounded-3xl shadow-xl w-full">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">الطراز المختبر:</p>
                        <p className="text-xl font-bold">مودرن إسكندنافي</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground">التكلفة التقديرية:</p>
                        <p className="text-xl font-bold text-primary">12,500 ر.س</p>
                      </div>
                    </div>
                 </div>
               </div>
             </div>
           </div>
        </section>

        {/* Categories Section */}
        <section className="py-32 bg-background">
          <div className="container px-4 md:px-8">
            <div className="flex justify-between items-end mb-16">
              <div className="space-y-3">
                <h2 className="text-4xl font-bold">تسوق حسب الغرفة</h2>
                <p className="text-muted-foreground text-lg">اختر الغرفة التي تود تجديدها واكتشف مجموعاتنا المختارة</p>
              </div>
              <Link href="/shop">
                <Button variant="link" className="text-primary font-bold text-lg">عرض كل الغرف</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { id: 'living-room', name: 'غرفة المعيشة', hint: 'living room furniture' },
                { id: 'bedroom', name: 'غرفة النوم', hint: 'bedroom decor' },
                { id: 'kitchen', name: 'المطبخ', hint: 'modern kitchen' },
                { id: 'office', name: 'المكتب', hint: 'home office setup' }
              ].map((room, idx) => (
                <Link key={idx} href={`/shop?room=${room.id}`} className="group relative h-96 rounded-[3rem] overflow-hidden shadow-lg">
                  <Image 
                    src={`https://picsum.photos/seed/room-${idx}/600/800`} 
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    data-ai-hint={room.hint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-10 right-10 text-white">
                    <h4 className="text-2xl font-bold">{room.name}</h4>
                    <p className="text-sm text-gray-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">تصفح المنتجات ←</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground text-background py-24">
        <div className="container px-4 md:px-8 grid md:grid-cols-4 gap-16 border-b border-background/10 pb-16 mb-16">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">إ</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">إيوان</span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-lg">
              إيوان هو المنصة العربية الأولى التي تجمع بين فن التصميم الداخلي وقوة الذكاء الاصطناعي لمساعدة الجميع في خلق بيوت جميلة.
            </p>
          </div>
          <div>
            <h5 className="text-white text-xl font-bold mb-8">روابط سريعة</h5>
            <ul className="space-y-4 text-gray-400 text-lg">
              <li><Link href="/shop" className="hover:text-primary transition-colors">المتجر</Link></li>
              <li><Link href="/ai-design" className="hover:text-primary transition-colors">استوديو التصميم</Link></li>
              <li><Link href="/vendors" className="hover:text-primary transition-colors">دليل النجارين</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">قصة إيوان</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white text-xl font-bold mb-8">الدعم والمساعدة</h5>
            <ul className="space-y-4 text-gray-400 text-lg">
              <li><Link href="/faq" className="hover:text-primary transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">اتصل بنا</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white text-xl font-bold mb-8">اشترك في نشرتنا</h5>
            <p className="text-gray-400 mb-8 text-lg">احصل على آخر نصائح التصميم والعروض الحصرية.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="bg-background/5 border-none rounded-xl px-5 py-3 w-full focus:ring-1 focus:ring-primary text-white" 
              />
              <Button className="bg-primary hover:bg-primary/90 h-auto px-6 rounded-xl">✓</Button>
            </div>
          </div>
        </div>
        <div className="container px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-4">
          <p>© {new Date().getFullYear()} إيوان. جميع الحقوق محفوظة.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">إنستجرام</Link>
            <Link href="#" className="hover:text-white transition-colors">تويتر</Link>
            <Link href="#" className="hover:text-white transition-colors">بينترست</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
