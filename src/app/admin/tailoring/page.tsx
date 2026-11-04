'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Scissors, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  User, 
  Hammer,
  ChevronLeft,
  Search,
  Maximize2
} from 'lucide-react';
import Image from 'next/image';

export default function AdminTailoring() {
  const requests = [
    { 
      id: '1', 
      user: 'أحمد القاضي', 
      room: 'غرفة معيشة', 
      style: 'مودرن', 
      status: 'processing', 
      budget: '٥٠٠ ألف - ٨٠٠ ألف', 
      date: 'منذ ٢ ساعة',
      img: 'https://picsum.photos/seed/t1/400/300'
    },
    { 
      id: '2', 
      user: 'سارة باوزير', 
      room: 'مجلس حضرمي', 
      style: 'تراثي مطور', 
      status: 'pending', 
      budget: '١ مليون - ١.٥ مليون', 
      date: 'منذ ٥ ساعات',
      img: 'https://picsum.photos/seed/t2/400/300'
    },
    { 
      id: '3', 
      user: 'خالد علي', 
      room: 'مكتب فاخر', 
      style: 'كلاسيك', 
      status: 'completed', 
      budget: '٣٠٠ ألف - ٤٥٠ ألف', 
      date: 'أمس',
      img: 'https://picsum.photos/seed/t3/400/300'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-secondary">إدارة خدمات التفصيل المخصص</h1>
          <p className="text-muted-foreground font-bold mt-1">طلبات التصميم بالذكاء الاصطناعي والتواصل بين النجارين والعملاء.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="w-full pr-10 pl-4 h-12 bg-white border border-border/50 rounded-xl font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="ابحث برقم الطلب..." />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {requests.map((req) => (
          <Card key={req.id} className="rounded-3xl border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-72 h-48 md:h-auto relative shrink-0">
               <Image src={req.img} alt={req.room} fill className="object-cover" />
               <div className="absolute inset-0 bg-black/20" />
               <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-secondary font-black border-none shadow-xl"># {req.id}</Badge>
               </div>
            </div>
            <CardContent className="p-8 flex-1 flex flex-col md:flex-row gap-8">
               <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 text-primary font-black">
                       <User className="w-5 h-5" /> {req.user}
                    </div>
                    <Badge variant="outline" className={cn(
                      "font-black border-none px-4 py-1.5 rounded-lg",
                      req.status === 'processing' ? "bg-blue-50 text-blue-600" : 
                      req.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {req.status === 'processing' ? 'جاري التنفيذ' : 
                       req.status === 'completed' ? 'مكتمل' : 'بانتظار المراجعة'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                     <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">نوع المساحة</p>
                        <p className="font-bold text-secondary flex items-center gap-2 text-sm"><Scissors className="w-3.5 h-3.5 text-primary" /> {req.room}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">النمط المختار</p>
                        <p className="font-bold text-secondary flex items-center gap-2 text-sm"><Maximize2 className="w-3.5 h-3.5 text-primary" /> {req.style}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">الميزانية</p>
                        <p className="font-bold text-primary flex items-center gap-2 text-sm">{req.budget}</p>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col justify-between items-end gap-6 md:min-w-[200px] border-r md:pr-8 border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" /> {req.date}
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <Button className="w-full rounded-xl bg-secondary text-white font-bold h-11">عرض التفاصيل</Button>
                     <Button variant="ghost" className="w-full rounded-xl text-primary font-bold h-11 gap-2">
                        <MessageSquare className="w-4 h-4" /> محادثة العميل
                     </Button>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
