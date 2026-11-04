'use client';

import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  Clock, 
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ArrowRight
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export default function ContactPage() {
  const contactInfo = [
    { 
      title: 'اتصل بنا', 
      value: '+967 770 000 000', 
      desc: 'متاح من 9 صباحاً حتى 9 مساءً',
      icon: Phone,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    { 
      title: 'راسلنا', 
      value: 'hello@ewan.ye', 
      desc: 'سنرد عليك خلال 24 ساعة',
      icon: Mail,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      title: 'مقرنا الرئيسي', 
      value: 'صنعاء - حي حدة', 
      desc: 'نتشرف بزيارتكم لمقرنا',
      icon: MapPin,
      color: 'text-amber-600',
      bg: 'bg-emerald-50'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />

      <main className="flex-1">
        {/* Header Hero Section */}
        <section className="bg-secondary text-white py-16 md:py-20 relative overflow-hidden">
          {/* Subtle Hexagonal Pattern */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ffffff' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9l10.99-6.35L25 17.9v12.7L13.99 36.95 3 30.6V17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.31zM28 15l-12.98-7.5V0h2v6.35L28 12.69v2.3zm0 18.5l-12.98 7.5v8h2v-6.85l12.98-7.5v-2.31z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
          
          <div className="container relative z-10 px-4 md:px-8 mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 backdrop-blur-xl border-r-4 border-primary text-primary text-[10px] font-black uppercase tracking-[0.2em] mx-auto rounded-sm">
              تواصل مع إيوان
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight">
              نحن هنا <span className="text-primary">لنسمع</span> منك
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto text-base md:text-lg font-medium leading-relaxed">
              سواء كنت عميلاً يبحث عن التميز، أو تاجراً يرغب في الانضمام، فريقنا جاهز للإجابة على جميع استفساراتك.
            </p>
          </div>
        </section>

        <section className="container mx-auto py-24 px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Sidebar Contact Cards */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, i) => (
                <div key={i} className="bg-white p-8 rounded-[15px] border border-border/50 shadow-sm hover:shadow-xl transition-all flex items-start gap-6 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 group-hover:rotate-6 ${info.bg} ${info.color}`}>
                    <info.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-secondary mb-1">{info.title}</h3>
                    <p className="text-base font-black text-primary dir-ltr text-right">{info.value}</p>
                    <p className="text-sm text-muted-foreground font-medium mt-1">{info.desc}</p>
                  </div>
                </div>
              ))}

              <div className="p-10 bg-secondary text-white rounded-[15px] space-y-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rotate-45 -translate-y-16 translate-x-16" />
                <div className="space-y-4">
                  <h4 className="text-2xl font-black">مجتمع إيوان</h4>
                  <p className="text-sm text-white/70 font-medium leading-relaxed">
                    تابعنا على منصات التواصل الاجتماعي لتبقى على اطلاع بآخر الصيحات والعروض.
                  </p>
                </div>
                <div className="flex gap-4">
                  {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                    <a key={i} href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-primary transition-all group shadow-inner">
                      <Icon className="w-5 h-5 group-hover:scale-110" />
                    </a>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">ساعات العمل</p>
                    <p className="text-xs font-bold text-white/80 mt-0.5">السبت - الخميس (9ص - 9م)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Contact Form */}
            <div className="lg:col-span-2">
              <Card className="rounded-[15px] border border-border/50 shadow-2xl overflow-hidden bg-white">
                <CardContent className="p-8 md:p-16">
                  <div className="flex items-center gap-5 mb-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                      <MessageSquare className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-secondary">أرسل لنا رسالة</h2>
                      <p className="text-muted-foreground font-medium mt-1">نسعد باستقبال رسائلك وسيقوم فريقنا بالرد خلال 24 ساعة.</p>
                    </div>
                  </div>

                  <form className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="font-black text-secondary text-base">الاسم الكامل</Label>
                        <Input id="name" placeholder="أدخل اسمك هنا" className="h-14 rounded-[10px] border-gray-100 bg-gray-50 focus:ring-primary font-bold text-secondary" />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="font-black text-secondary text-base">البريد الإلكتروني</Label>
                        <Input id="email" type="email" placeholder="example@mail.com" className="h-14 rounded-[10px] border-gray-100 bg-gray-50 focus:ring-primary font-bold text-secondary" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="subject" className="font-black text-secondary text-base">الموضوع</Label>
                      <Input id="subject" placeholder="كيف يمكننا مساعدتك؟" className="h-14 rounded-[10px] border-gray-100 bg-gray-50 focus:ring-primary font-bold text-secondary" />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="message" className="font-black text-secondary text-base">تفاصيل الرسالة</Label>
                      <Textarea id="message" placeholder="اكتب تفاصيل استفسارك هنا بوضوح..." className="min-h-[180px] rounded-[10px] border-gray-100 bg-gray-50 focus:ring-primary py-5 px-6 font-medium text-secondary" />
                    </div>

                    <Button className="w-full md:w-64 h-16 rounded-[12px] bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl shadow-primary/30 gap-3 group transition-all">
                      إرسال الرسالة الآن <Send className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Real Google Maps Integration */}
        <section className="h-[550px] relative w-full overflow-hidden bg-gray-100 border-t border-border/50">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.755444585145!2d44.20468925!3d15.352011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1603db0260467777%3A0x1d3783a388f8c44c!2z2LXYp9ix2LHYjCDYp9mE2YrZhdmG!5e0!3m2!1sar!2sye!4v1710000000000!5m2!1sar!2sye" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1) brightness(0.9)' }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
            title="موقع إيوان"
          ></iframe>
          
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-secondary/30 via-transparent to-transparent" />
          
          <div className="container relative h-full mx-auto px-4 flex items-center justify-center md:justify-end pointer-events-none">
             <div className="p-8 md:p-10 bg-white/95 backdrop-blur-md rounded-[20px] shadow-2xl border-4 border-primary/20 flex flex-col items-center gap-6 max-w-sm pointer-events-auto transform hover:scale-105 transition-all duration-500">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                   <MapPin className="text-primary w-8 h-8 animate-bounce" />
                </div>
                <div className="text-center space-y-3">
                   <h4 className="text-xl font-black text-secondary">تفضل بزيارة مكتبنا</h4>
                   <p className="text-sm text-muted-foreground font-bold leading-relaxed">الجمهورية اليمنية، صنعاء، حي حدة، الطابق الثالث - مبنى إيوان.</p>
                   <Button asChild variant="outline" className="w-full rounded-xl border-primary text-primary font-black mt-4 hover:bg-primary hover:text-white h-12 transition-all">
                      <a href="https://www.google.com/maps/search/?api=1&query=15.352011,44.204689" target="_blank" rel="noopener noreferrer">
                         فتح في خرائط جوجل <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                      </a>
                   </Button>
                </div>
             </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
