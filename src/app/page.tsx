
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Palette, MessageCircle, User, Heart } from 'lucide-react';
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
              <Link href="/ai-design" className="flex items-center gap-1 transition-colors hover:text-primary text-primary">
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
              <Button variant="ghost" size="icon"><Heart className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon"><ShoppingBag className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon"><MessageCircle className="w-5 h-5" /></Button>
              <Button variant="outline" className="hidden sm:flex gap-2">
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
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          )}
          <div className="container relative z-10 px-4 md:px-8 text-white">
            <div className="max-w-2xl space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                إيوان — صمّم واكتشف أثاث منزلك بالذكاء الاصطناعي
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 max-w-xl">
                حوّل مساحاتك الفارغة إلى غرف أحلامك بلمسة واحدة. ارفع صورة غرفتك ودع الذكاء الاصطناعي يقترح لك أفضل التصاميم بمنتجات حقيقية.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-xl hover:scale-105 transition-transform bg-primary">
                  ابدأ التصميم الآن
                </Button>
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-xl shadow-xl hover:scale-105 transition-transform">
                  اكتشف الأثاث
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-20 bg-background">
          <div className="container px-4 md:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Palette className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">تصميم ذكي مخصص</h3>
                <p className="text-muted-foreground leading-relaxed">
                  ارفع صورة غرفتك واختر الطراز المفضل لديك، وسيقوم نظامنا بتحليل المساحة واقتراح تصميم متكامل.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">منتجات حقيقية فقط</h3>
                <p className="text-muted-foreground leading-relaxed">
                  جميع الاقتراحات هي قطع أثاث متوفرة في متجرنا من بائعين ونجارين موثوقين، وليست مجرد صور خيالية.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-card border border-border/50 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">تواصل مباشر</h3>
                <p className="text-muted-foreground leading-relaxed">
                  تواصل مباشرة مع التجار أو النجارين للاستفسار عن المنتجات أو لطلب تفصيل خاص يناسب مساحتك.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section Preview */}
        <section className="py-20 bg-secondary/30">
          <div className="container px-4 md:px-8">
            <div className="flex justify-between items-end mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">تسوق حسب الغرفة</h2>
                <p className="text-muted-foreground">اختر الغرفة التي تود تجديدها واكتشف مجموعاتنا المختارة</p>
              </div>
              <Button variant="link" className="text-primary font-bold">عرض الكل</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['living-room', 'bedroom', 'living-room', 'bedroom'].map((id, idx) => {
                const img = PlaceHolderImages.find(p => p.id === id);
                return (
                  <Link key={idx} href={`/shop?room=${id}`} className="group relative h-80 rounded-3xl overflow-hidden shadow-md">
                    {img && (
                      <Image 
                        src={img.imageUrl} 
                        alt={img.description}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        data-ai-hint={img.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-6 right-6 text-white">
                      <h4 className="text-xl font-bold">
                        {idx === 0 ? 'غرفة المعيشة' : idx === 1 ? 'غرفة النوم' : idx === 2 ? 'المطبخ' : 'المكتب'}
                      </h4>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground text-background py-16">
        <div className="container px-4 md:px-8 grid md:grid-cols-4 gap-12 border-b border-background/10 pb-12 mb-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">إ</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">إيوان</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              إيوان هو المنصة العربية الأولى التي تجمع بين فن التصميم الداخلي وقوة الذكاء الاصطناعي لمساعدة الجميع في خلق بيوت جميلة.
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6">روابط سريعة</h5>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/shop" className="hover:text-primary transition-colors">المتجر</Link></li>
              <li><Link href="/ai-design" className="hover:text-primary transition-colors">استوديو التصميم</Link></li>
              <li><Link href="/vendors" className="hover:text-primary transition-colors">دليل النجارين</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">قصة إيوان</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6">الدعم والمساعدة</h5>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/faq" className="hover:text-primary transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">اتصل بنا</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6">اشترك في نشرتنا</h5>
            <p className="text-gray-400 mb-6">احصل على آخر نصائح التصميم والعروض الحصرية.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="البريد الإلكتروني" className="bg-background/10 border-none rounded-lg px-4 py-2 w-full focus:ring-1 focus:ring-primary" />
              <Button size="icon" className="bg-primary hover:bg-primary/90">✓</Button>
            </div>
          </div>
        </div>
        <div className="container px-4 md:px-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} إيوان. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
