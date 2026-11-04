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
  Linkedin
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
      title: 'مقرنا', 
      value: 'صنعاء - شارع حدة', 
      desc: 'تفضل بزيارة مكتبنا الرئيسي',
      icon: MapPin,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-secondary text-white py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <Globe className="w-full h-full scale-125" />
          </div>
          <div className="container relative z-10 px-4 md:px-8 mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-black">تواصل معنا</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg font-medium">
              نحن هنا لمساعدتك في كل خطوة. سواء كان لديك استفسار عن منتج، أو ترغب في الانضمام كتاجر، أو تحتاج لمساعدة تقنية.
            </p>
          </div>
        </section>

        <section className="container mx-auto py-24 px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Cards */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, i) => (
                <div key={i} className="bg-white p-8 rounded-[15px] border border-border/50 shadow-sm hover:shadow-md transition-all flex items-start gap-6 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${info.bg} ${info.color}`}>
                    <info.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-secondary mb-1">{info.title}</h3>
                    <p className="text-base font-black text-primary dir-ltr text-right">{info.value}</p>
                    <p className="text-sm text-muted-foreground font-medium mt-1">{info.desc}</p>
                  </div>
                </div>
              ))}

              <div className="p-8 bg-secondary text-white rounded-[15px] space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rotate-45 -translate-y-12 translate-x-12" />
                <h4 className="text-xl font-black">تابعنا على التواصل</h4>
                <div className="flex gap-4">
                  {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-primary transition-colors">
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold opacity-80">ساعات العمل: السبت - الخميس</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="rounded-[15px] border border-border/50 shadow-sm overflow-hidden bg-white">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-secondary">أرسل لنا رسالة</h2>
                      <p className="text-muted-foreground font-medium">املأ النموذج أدناه وسنتواصل معك بأسرع وقت.</p>
                    </div>
                  </div>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="font-bold text-secondary">الاسم الكامل</Label>
                        <Input id="name" placeholder="أدخل اسمك هنا" className="h-12 rounded-md border-gray-100 bg-gray-50 focus:ring-primary" />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="font-bold text-secondary">البريد الإلكتروني</Label>
                        <Input id="email" type="email" placeholder="example@mail.com" className="h-12 rounded-md border-gray-100 bg-gray-50 focus:ring-primary" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="subject" className="font-bold text-secondary">الموضوع</Label>
                      <Input id="subject" placeholder="كيف يمكننا مساعدتك؟" className="h-12 rounded-md border-gray-100 bg-gray-50 focus:ring-primary" />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="message" className="font-bold text-secondary">رسالتك</Label>
                      <Textarea id="message" placeholder="اكتب تفاصيل استفسارك هنا..." className="min-h-[150px] rounded-md border-gray-100 bg-gray-50 focus:ring-primary py-4" />
                    </div>

                    <Button className="w-full md:w-64 h-14 rounded-md bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 gap-3">
                      إرسال الرسالة <Send className="w-5 h-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="h-[450px] relative bg-gray-200 w-full overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center grayscale opacity-50 bg-[url('https://picsum.photos/seed/map/1920/600')] bg-cover bg-center">
            {/* Overlay for Map Look */}
            <div className="absolute inset-0 bg-secondary/10" />
            <div className="relative z-10 p-6 bg-white rounded-[15px] shadow-2xl border flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <MapPin className="text-primary w-6 h-6 animate-bounce" />
               </div>
               <div>
                  <p className="font-black text-secondary">مكتب إيوان الرئيسي</p>
                  <p className="text-xs text-muted-foreground font-bold">صنعاء، حي حدة السكني</p>
               </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
