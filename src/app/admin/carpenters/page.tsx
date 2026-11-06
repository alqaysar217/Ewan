'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Star, 
  Plus, 
  MoreVertical,
  MessageSquare,
  Clock
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function AdminCarpenters() {
  const db = useFirestore();
  const q = useMemo(() => query(collection(db, 'vendors'), where('business_type', '==', 'carpenter')), [db]);
  const { data: carpenters, loading } = useCollection(q);

  const mockCarpenters = [
    { id: '1', business_name: 'ورشة إتقان للنجارة', city: 'صنعاء', average_rating: 4.9, status: 'approved', logo: 'https://picsum.photos/seed/c1/100/100', exp: '20 سنة' }
  ];

  const list = (carpenters && carpenters.length > 0) ? carpenters : mockCarpenters;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-secondary">إدارة النجارين والورش</h1>
          <p className="text-muted-foreground font-bold mt-1">دعم الحرفيين المحليين ومراقبة جودة أعمال النجارة الوطنية.</p>
        </div>
        <Button className="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5 ml-2" /> إضافة ورشة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((c: any) => (
          <Card key={c.id} className="rounded-3xl border-none shadow-sm hover:shadow-xl transition-all bg-white overflow-hidden group">
            <CardHeader className="p-0 relative h-32 bg-secondary">
               <div className="absolute -bottom-6 right-8 w-20 h-20 rounded-2xl bg-white p-1 shadow-2xl overflow-hidden border-4 border-white">
                  <Image src={c.logo || `https://picsum.photos/seed/${c.id}/100/100`} alt={c.business_name} fill className="object-cover" />
               </div>
               <div className="absolute top-4 left-4">
                  <Badge className={cn("font-black rounded-lg border-none", c.status === 'approved' ? "bg-emerald-500 text-white" : "bg-amber-500 text-white")}>
                    {c.status === 'approved' ? 'معتمد' : 'معلق'}
                  </Badge>
               </div>
            </CardHeader>
            <CardContent className="pt-10 pb-8 px-8 space-y-6">
               <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-secondary">{c.business_name}</h3>
                    <Button variant="ghost" size="icon" className="rounded-xl text-gray-400"><MoreVertical className="w-5 h-5" /></Button>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm"><MapPin className="w-4 h-4 text-primary" /> {c.city}</div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                     <p className="text-[10px] text-muted-foreground font-black uppercase">التقييم</p>
                     <div className="flex items-center gap-1.5 text-amber-500 font-black"><Star className="w-4 h-4 fill-current" /> {c.average_rating}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                     <p className="text-[10px] text-muted-foreground font-black uppercase">الخبرة</p>
                     <div className="flex items-center gap-1.5 text-secondary font-black"><Clock className="w-4 h-4" /> {c.exp || '٥ سنوات'}</div>
                  </div>
               </div>
               <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 rounded-xl h-11 border-border font-bold">تعديل</Button>
                  <Button className="flex-1 rounded-xl h-11 bg-primary text-white font-bold gap-2"><MessageSquare className="w-4 h-4" /> تواصل</Button>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
