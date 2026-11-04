'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Layers, 
  MoreVertical, 
  Edit, 
  Trash, 
  ArrowRight,
  LayoutGrid
} from 'lucide-react';
import Image from 'next/image';

export default function AdminCategories() {
  const categories = [
    { id: '1', name: 'غرف المعيشة', count: 124, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400' },
    { id: '2', name: 'غرف النوم', count: 86, img: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=400' },
    { id: '3', name: 'المطابخ', count: 42, img: 'https://images.unsplash.com/photo-1577145000247-a737ad733c99?auto=format&fit=crop&q=80&w=400' },
    { id: '4', name: 'المكاتب', count: 35, img: 'https://images.unsplash.com/photo-1505797149-43b0ad766a0e?auto=format&fit=crop&q=80&w=400' },
    { id: '5', name: 'المجالس التراثية', count: 58, img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-secondary">إدارة التصنيفات</h1>
          <p className="text-muted-foreground font-bold mt-1">تنظيم هيكل المنتجات وتسهيل عملية البحث للمستخدمين.</p>
        </div>
        <Button className="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5 ml-2" /> إضافة تصنيف جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Card key={cat.id} className="rounded-3xl border-none shadow-sm hover:shadow-xl transition-all bg-white overflow-hidden group border border-transparent hover:border-primary/20">
            <CardContent className="p-0">
               <div className="relative h-48 w-full overflow-hidden">
                  <Image src={cat.img} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 right-6 left-6 flex items-end justify-between text-white">
                     <div className="space-y-1">
                        <h3 className="text-xl font-black">{cat.name}</h3>
                        <p className="text-xs font-bold text-primary-foreground/80 flex items-center gap-1">
                           <LayoutGrid className="w-3 h-3" /> {cat.count} منتج
                        </p>
                     </div>
                  </div>
               </div>
               <div className="p-6 flex items-center justify-between">
                  <div className="flex gap-2">
                     <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10 border border-gray-50 hover:bg-gray-50">
                        <Edit className="w-4 h-4 text-primary" />
                     </Button>
                     <Button variant="ghost" size="icon" className="rounded-lg h-10 w-10 border border-gray-50 hover:bg-gray-50">
                        <Trash className="w-4 h-4 text-destructive" />
                     </Button>
                  </div>
                  <Button variant="ghost" className="rounded-xl text-secondary font-black gap-2 group/btn">
                    عرض المنتجات <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                  </Button>
               </div>
            </CardContent>
          </Card>
        ))}

        <button className="rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 p-10 hover:border-primary/40 hover:bg-primary/5 transition-all group">
           <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
              <Plus className="w-8 h-8" />
           </div>
           <span className="font-black text-gray-400 group-hover:text-primary transition-colors">إضافة تصنيف جديد</span>
        </button>
      </div>
    </div>
  );
}
