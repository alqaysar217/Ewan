'use client';

import { useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  MoreVertical, 
  ExternalLink, 
  Store, 
  ShieldCheck,
  Ban,
  Mail
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminVendors() {
  const db = useFirestore();
  const vendorsQuery = query(collection(db, 'vendors'), where('business_type', '==', 'furniture_store'));
  const { data: vendors, loading } = useCollection(vendorsQuery);

  const [searchTerm, setSearchTerm] = useState('');

  const mockVendors = [
    { id: '1', business_name: 'المعرض الملكي', city: 'صنعاء', email: 'royal@ewan.ye', status: 'approved', joined: '2024-01-10' },
    { id: '2', business_name: 'أثاث الخليج', city: 'عدن', email: 'gulf@ewan.ye', status: 'pending', joined: '2024-02-15' },
    { id: '3', business_name: 'مودرن هوم', city: 'تعز', email: 'modern@ewan.ye', status: 'approved', joined: '2023-12-05' },
  ];

  const displayedVendors = (vendors && vendors.length > 0) ? vendors : mockVendors;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-secondary">إدارة المتاجر والبائعين</h1>
          <p className="text-muted-foreground font-bold mt-1">تتبع المتاجر المعتمدة ومراجعة طلبات الانضمام الجديدة.</p>
        </div>
        <Button className="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5 ml-2" /> إضافة متجر جديد
        </Button>
      </div>

      <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between space-y-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="ابحث عن متجر بالاسم أو المدينة..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 h-12 bg-gray-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <Badge className="bg-primary/10 text-primary border-none font-bold px-4 py-2 rounded-lg">الكل: {displayedVendors.length}</Badge>
            <Badge className="bg-amber-50 text-amber-600 border-none font-bold px-4 py-2 rounded-lg">معلق: ١</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-none">
                <TableHead className="text-right h-16 font-black text-secondary px-8">المتجر</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">المدينة</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">البريد الإلكتروني</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">الحالة</TableHead>
                <TableHead className="text-left h-16 font-black text-secondary px-8">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedVendors.map((vendor: any) => (
                <TableRow key={vendor.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 group">
                  <TableCell className="px-8 font-black text-secondary">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Store className="w-5 h-5" />
                      </div>
                      {vendor.business_name}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-muted-foreground">{vendor.city}</TableCell>
                  <TableCell className="font-bold text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-300" />
                      {vendor.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-black px-3 py-1 rounded-lg",
                      vendor.status === 'approved' ? "bg-emerald-50 text-emerald-600 border-none" : "bg-amber-50 text-amber-600 border-none"
                    )}>
                      {vendor.status === 'approved' ? 'مفعل' : 'قيد المراجعة'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left px-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-border">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2 w-48 font-bold">
                        <DropdownMenuItem className="rounded-lg gap-3 py-3 cursor-pointer">
                          <ExternalLink className="w-4 h-4" /> عرض الملف
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg gap-3 py-3 cursor-pointer text-emerald-600">
                          <ShieldCheck className="w-4 h-4" /> تفعيل الحساب
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg gap-3 py-3 cursor-pointer text-destructive">
                          <Ban className="w-4 h-4" /> حظر المتجر
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
