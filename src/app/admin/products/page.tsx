'use client';

import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Filter,
  ArrowUpDown,
  Layers,
  Store
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function AdminProducts() {
  const db = useFirestore();
  const q = query(collection(db, 'products'), orderBy('created_at', 'desc'));
  const { data: products } = useCollection(q);

  const mockProducts = [
    { id: '1', name_ar: 'طقم ديوان حضرمي', price: 450000, category_id: 'living', status: 'approved', store: 'ورشة المكلا' },
    { id: '2', name_ar: 'سرير كلاسيكي فاخر', price: 280000, category_id: 'bedroom', status: 'pending', store: 'أثاث الخليج' },
    { id: '3', name_ar: 'طاولة طعام دائرية', price: 120000, category_id: 'dining', status: 'approved', store: 'مودرن هوم' },
  ];

  const displayed = (products && products.length > 0) ? products : mockProducts;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-secondary">إدارة الكتالوج والمنتجات</h1>
          <p className="text-muted-foreground font-bold mt-1">مراجعة المنتجات المرفوعة من التجار وضمان جودة العرض والبيانات.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl h-12 px-6 font-bold border-border bg-white shadow-sm">
            <Filter className="w-5 h-5 ml-2 text-gray-400" /> تصفية متقدمة
          </Button>
          <Button className="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5 ml-2" /> إضافة منتج
          </Button>
        </div>
      </div>

      <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between space-y-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="ابحث عن منتج بالاسم أو التاجر..." 
              className="pr-12 h-12 bg-gray-50 border-none rounded-xl font-bold"
            />
          </div>
          <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
             <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg"><Layers className="w-4 h-4 text-primary" /> {displayed.length} منتج</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-none">
                <TableHead className="text-right h-16 font-black text-secondary px-8">المنتج</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">التصنيف</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                    السعر <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">التاجر / الورشة</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">الحالة</TableHead>
                <TableHead className="text-left h-16 font-black text-secondary px-8">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.map((p: any) => (
                <TableRow key={p.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                  <TableCell className="px-8 font-black text-secondary">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg relative overflow-hidden shrink-0">
                        <Image src={`https://picsum.photos/seed/${p.id}/100/100`} alt={p.name_ar} fill className="object-cover" />
                      </div>
                      {p.name_ar}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-50 text-muted-foreground border-none font-bold rounded-lg px-3 py-1">
                      {p.category_id === 'living' ? 'غرف معيشة' : p.category_id === 'bedroom' ? 'غرف نوم' : 'طعام'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-black text-primary">{(p.price || 0).toLocaleString()} ر.ي</TableCell>
                  <TableCell className="font-bold text-secondary">
                     <span className="flex items-center gap-2"><Store className="w-4 h-4 text-gray-300" /> {p.store || 'إيوان'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-black px-3 py-1 rounded-lg",
                      p.status === 'approved' ? "bg-emerald-50 text-emerald-600 border-none" : "bg-amber-50 text-amber-600 border-none"
                    )}>
                      {p.status === 'approved' ? 'منشور' : 'بانتظار المراجعة'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left px-8">
                    <div className="flex items-center justify-end gap-2">
                       <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-border"><Eye className="w-4 h-4 text-gray-500" /></Button>
                       <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-border"><Edit3 className="w-4 h-4 text-primary" /></Button>
                       <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-border"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
