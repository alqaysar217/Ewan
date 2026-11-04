'use client';

import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Target, 
  Users, 
  Zap, 
  ShieldCheck, 
  History, 
  Award,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const stats = [
    { label: 'متجر معتمد', value: '80+' },
    { label: 'نجار ومصمم', value: '150+' },
    { label: 'تصميم ذكي', value: '5,000+' },
    { label: 'عملاء سعداء', value: '10,000+' }
  ];

  const values = [
    { 
      title: 'الابتكار التقني', 
      desc: 'نسخر أحدث تقنيات الذكاء الاصطناعي لتسهيل عملية اختيار وتصميم الأثاث المنزلي.',
      icon: Zap
    },
    { 
      title: 'دعم الحرفيين', 
      desc: 'نؤمن بمهارة النجار اليمني ونسعى لفتح أسواق جديدة له لتقديم إبداعاته للعالم.',
      icon: Users
    },
    { 
      title: 'الجودة الموثوقة', 
      desc: 'لا نقبل سوى المتاجر والورش التي تلتزم بأعلى معايير الجودة والضمان الحقيقي.',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-secondary overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Target className="w-96 h-96 absolute -top-20 -left-20 rotate-12" />
          </div>
          <div className="container relative z-10 px-4 md:px-8 mx-auto text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 backdrop-blur-xl border-r-4 border-primary text-primary text-xs font-black uppercase tracking-[0.2em]">
                قصة إيوان
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                نعيد تعريف تجربة <span className="text-primary">تصميم</span> منزلك
              </h1>
              <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed">
                إيوان ليست مجرد منصة أثاث، بل هي جسر يربط بين عراقة الحرفة اليدوية اليمنية ومستقبل التكنولوجيا الذكية.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-square rounded-[15px] overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
                  alt="Ewan Vision"
                  fill
                  className="object-cover"
                  data-ai-hint="modern luxury office interior"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
              </div>
              
              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-black text-secondary">رؤيتنا</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    نسعى لأن نكون المنصة الرائدة في المنطقة التي تمكّن كل شخص من تحويل خياله إلى واقع ملموس في مساحته الخاصة، من خلال توفير أدوات ذكية ومنتجات عالية الجودة بلمسة وطنية.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-black text-secondary">مهمتنا</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    تبسيط رحلة تأثيث المنزل، ودعم النجارين والمتاجر المحلية عبر منصة تقنية متكاملة تضمن الشفافية، الجودة، وسهولة الوصول.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center p-4 bg-gray-50 rounded-[15px] border border-border/50">
                      <p className="text-2xl font-black text-primary">{stat.value}</p>
                      <p className="text-xs font-bold text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-gray-50">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-secondary">القيم التي تحركنا</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">نلتزم بمبادئ أساسية تضمن تقديم أفضل خدمة لعملائنا وشركائنا.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((val, i) => (
                <div key={i} className="bg-white p-10 rounded-[15px] border border-border/50 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                    <val.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-secondary mb-4">{val.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* History / Timeline */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2 space-y-8">
                <h2 className="text-3xl md:text-4xl font-black text-secondary flex items-center gap-4">
                  <History className="text-primary w-8 h-8" /> مسيرتنا حتى الآن
                </h2>
                <div className="space-y-8 border-r-2 border-primary/20 pr-8 relative">
                  {[
                    { year: '2023', event: 'انطلاق فكرة إيوان لدمج الذكاء الاصطناعي في قطاع الأثاث.' },
                    { year: '2024', event: 'توقيع شراكات مع أكثر من 50 ورشة نجارة وطنية رائدة.' },
                    { year: '2025', event: 'إطلاق النسخة المتكاملة للمنصة وخدمة التصميم الذكي للجمهور.' }
                  ].map((item, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -right-[41px] top-1.5 w-5 h-5 bg-primary rounded-full border-4 border-white shadow-sm" />
                      <h4 className="text-xl font-black text-primary">{item.year}</h4>
                      <p className="text-muted-foreground font-medium mt-2">{item.event}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 relative aspect-video rounded-[15px] overflow-hidden shadow-2xl">
                 <Image 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800"
                  alt="Our Team"
                  fill
                  className="object-cover"
                  data-ai-hint="team collaborating in office"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Zap className="w-full h-full text-white scale-150 rotate-12" />
          </div>
          <div className="container relative z-10 px-4 md:px-8 mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-black text-white">هل أنت مستعد لبدء التغيير؟</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto font-medium">
              انضم إلى آلاف المستخدمين الذين وثقوا في إيوان لتحويل منازلهم إلى مساحات إبداعية.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-secondary hover:text-white font-black px-10 h-14 rounded-[15px] shadow-2xl">
                ابدأ التصميم الآن
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
