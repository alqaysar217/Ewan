'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Star, Quote, MessageSquare, ThumbsUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ReviewsPage() {
  const allReviews = [
    { 
      name: 'محمد القاضي', 
      role: 'عميل من صنعاء', 
      text: 'تجربة التصميم بالذكاء الاصطناعي كانت مذهلة، ساعدتني كثيراً في اختيار اللون المناسب لمجلسي الجديد وبكل سهولة. الخدمة سريعة والنتائج مبهرة.', 
      rating: 5,
      date: 'منذ أسبوع',
      avatar: 'https://picsum.photos/seed/user1/100/100'
    },
    { 
      name: 'سارة باوزير', 
      role: 'عميلة من المكلا', 
      text: 'جودة الخشب في الطقم الحضرمي الذي طلبته تفوقت على توقعاتي، والتوصيل كان في الموعد تماماً وبكل احترافية. أنصح الجميع بالتعامل معهم.', 
      rating: 5,
      date: 'منذ أسبوعين',
      avatar: 'https://picsum.photos/seed/user2/100/100'
    },
    { 
      name: 'أحمد علي', 
      role: 'عميل من عدن', 
      text: 'أفضل منصة أثاث في اليمن حالياً، التنوع بين الجاهز والمصنع حسب الطلب يعطي خيارات رائعة جداً. الأسعار منافسة والجودة عالمية.', 
      rating: 4,
      date: 'منذ شهر',
      avatar: 'https://picsum.photos/seed/user3/100/100'
    },
    { 
      name: 'ليلى الحداد', 
      role: 'مصممة ديكور', 
      text: 'كخبير في الديكور، أجد أن إيوان توفر أدوات تساعدنا على تصور المساحات بشكل دقيق. المنتجات المعروضة ذات تصاميم فخمة وتلبي أذواقاً مختلفة.', 
      rating: 5,
      date: 'منذ شهرين',
      avatar: 'https://picsum.photos/seed/user4/100/100'
    },
    { 
      name: 'خالد الريمي', 
      role: 'عميل من تعز', 
      text: 'طلبت تفصيل مطبخ متكامل وتم التنفيذ بدقة متناهية. النجارين المحترفين في المنصة على مستوى عالٍ من الخبرة والالتزام بالمواعيد.', 
      rating: 5,
      date: 'منذ ٣ أشهر',
      avatar: 'https://picsum.photos/seed/user5/100/100'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-secondary text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Quote className="w-full h-full scale-150 rotate-12" />
          </div>
          <div className="container relative z-10 px-4 mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-black">آراء ومراجعات عملائنا</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-medium">
              نحن نفخر بثقة آلاف المستخدمين الذين حولوا منازلهم إلى مساحات إبداعية بلمسة من إيوان.
            </p>
          </div>
        </section>

        <section className="container mx-auto py-20 px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Summary Stats */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-[15px] border border-border/50 shadow-sm text-center space-y-6">
                <h3 className="text-2xl font-black text-secondary">التقييم العام</h3>
                <div className="text-6xl font-black text-primary">4.9</div>
                <div className="flex justify-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground font-bold">بناءً على أكثر من 5000 تقييم حقيقي</p>
                <Button className="w-full h-12 rounded-xl bg-secondary text-white font-bold">أضف تقييمك الآن</Button>
              </div>

              <div className="bg-primary/5 p-8 rounded-[15px] border border-primary/10 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <ThumbsUp className="w-6 h-6" />
                  <h4 className="font-black">ثقة مضمونة</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  جميع المراجعات المنشورة تعود لعملاء حقيقيين قاموا بتجربة خدماتنا أو شراء منتجات من متاجرنا المعتمدة.
                </p>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-secondary flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-primary" /> مراجعات حديثة
                </h2>
                <div className="text-sm font-bold text-muted-foreground">عرض {allReviews.length} من أصل 5234</div>
              </div>

              <div className="space-y-6">
                {allReviews.map((rev, i) => (
                  <Card key={i} className="rounded-[15px] border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-gray-50">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-primary/10 shadow-sm">
                            <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-black text-secondary text-lg">{rev.name}</h4>
                            <p className="text-xs text-primary font-bold">{rev.role}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-1 text-amber-500">
                            {Array.from({ length: 5 }).map((_, starIdx) => (
                              <Star key={starIdx} className={cn("w-3.5 h-3.5", starIdx >= rev.rating ? "fill-none text-gray-300" : "fill-current")} />
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                            <Calendar className="w-3 h-3" /> {rev.date}
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <Quote className="absolute -top-2 -right-4 w-8 h-8 text-primary opacity-10" />
                        <p className="text-muted-foreground leading-loose font-medium italic relative z-10 pr-4">
                          "{rev.text}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="pt-10 text-center">
                <Button variant="outline" className="rounded-xl border-primary text-primary font-black px-10 h-14 hover:bg-primary/5">
                  تحميل المزيد من الآراء
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
