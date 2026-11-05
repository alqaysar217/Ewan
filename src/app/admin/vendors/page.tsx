'use client';

import { useState } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, doc, updateDoc } from 'firebase/firestore';
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
  MoreVertical, 
  ExternalLink, 
  Store, 
  ShieldCheck,
  Ban,
  Mail,
  MapPin,
  Filter,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminVendors() {
  const db = useFirestore();
  const vendorsQuery = query(collection(db, 'vendors'));
  const { data: vendors, loading } = useCollection(vendorsQuery);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const mockVendors = [
    { id: '1', business_name: 'المعرض الملكي', city: 'صنعاء', business_type: 'furniture_store', email: 'royal@ewan.ye', approval_status: 'approved', joined: '2024-01-10' },
    { id: '2', business_name: 'أثاث الخليج', city: 'عدن', business_type: 'furniture_store', email: 'gulf@ewan.ye', approval_status: 'pending', joined: '2024-02-15' },
    { id: '3', business_name: 'ورشة إتقان', city: 'تعز', business_type: 'carpenter', email: 'itqan@ewan.ye', approval_status: 'approved', joined: '2023-12-05' },
  ];

  const displayedVendors = (vendors && vendors.length > 0) ? vendors : mockVendors;

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'vendors', id), { approval_status: status });
      toast({ title: "تم تحديث الحالة", description: "تم تغيير حالة المتجر بنجاح" });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل في تحديث الحالة" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-secondary">إدارة المتاجر والشركاء</h1>
          <p className="text-muted-foreground font-bold mt-1">تتبع المتاجر المعتمدة ومراجعة طلبات الانضمام الجديدة لضمان جودة المنصة.</p>
        </div>
        <Button className="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5 ml-2" /> إضافة شريك يدوياً
        </Button>
      </div>

      <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="ابحث عن متجر، ورشة، أو مدينة..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 h-12 bg-gray-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-xl font-bold h-10 px-4"
              onClick={() => setActiveFilter('all')}
            >الكل</Button>
            <Button 
              variant={activeFilter === 'pending' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-xl font-bold h-10 px-4"
              onClick={() => setActiveFilter('pending')}
            >معلق</Button>
            <Button 
              variant={activeFilter === 'furniture_store' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-xl font-bold h-10 px-4"
              onClick={() => setActiveFilter('furniture_store')}
            >متاجر</Button>
            <Button 
              variant={activeFilter === 'carpenter' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-xl font-bold h-10 px-4"
              onClick={() => setActiveFilter('carpenter')}
            >نجارين</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-none">
                <TableHead className="text-right h-16 font-black text-secondary px-8">الشريك</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">النوع</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">المدينة</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">البريد الإلكتروني</TableHead>
                <TableHead className="text-right h-16 font-black text-secondary">الحالة</TableHead>
                <TableHead className="text-left h-16 font-black text-secondary px-8">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedVendors
                .filter(v => {
                  const matchSearch = v.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) || v.city?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchFilter = activeFilter === 'all' || v.approval_status === activeFilter || v.business_type === activeFilter;
                  return matchSearch && matchFilter;
                })
                .map((vendor: any) => (
                <TableRow key={vendor.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 group">
                  <TableCell className="px-8 font-black text-secondary">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        {vendor.business_type === 'carpenter' ? <Plus className="w-5 h-5 rotate-45" /> : <Store className="w-5 h-5" />}
                      </div>
                      {vendor.business_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-bold border-none bg-gray-50 text-muted-foreground">
                      {vendor.business_type === 'carpenter' ? 'ورشة نجارة' : 'معرض أثاث'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-muted-foreground">
                    <div className="flex items-center gap-2">
                       <MapPin className="w-3.5 h-3.5 text-primary" /> {vendor.city}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-300" />
                      {vendor.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "font-black px-3 py-1 rounded-lg border-none",
                      vendor.approval_status === 'approved' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {vendor.approval_status === 'approved' ? 'مفعل' : 'قيد المراجعة'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left px-8">
                    <div className="flex items-center justify-end gap-2">
                       <Link href={`/vendors/${vendor.id}`}>
                         <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-border"><ExternalLink className="w-4 h-4 text-gray-500" /></Button>
                       </Link>
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white shadow-sm">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2 w-48 font-bold">
                          <DropdownMenuItem className="rounded-lg gap-3 py-3 cursor-pointer text-emerald-600" onClick={() => handleStatusChange(vendor.id, 'approved')}>
                            <CheckCircle2 className="w-4 h-4" /> تفعيل الحساب
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg gap-3 py-3 cursor-pointer text-amber-600" onClick={() => handleStatusChange(vendor.id, 'pending')}>
                            <ShieldCheck className="w-4 h-4" /> تعليق مؤقت
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg gap-3 py-3 cursor-pointer text-destructive" onClick={() => handleStatusChange(vendor.id, 'rejected')}>
                            <Ban className="w-4 h-4" /> حظر الشريك
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
