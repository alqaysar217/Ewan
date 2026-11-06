'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  Zap, 
  Upload, 
  Palette, 
  Wallet, 
  Ruler, 
  MousePointerClick, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft, 
  ArrowRight,
  Info,
  Maximize2,
  Home,
  Coins,
  Search,
  Layout,
  ShoppingBag,
  Camera,
  Layers,
  ChevronRight,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';

const MOCK_PRODUCTS = [
  { id: 'm1', name_ar: 'أريكة مخملية زرقاء', price: 250000, category_id: 'living' }
];

const STYLES = [
  { id: 'modern', name: 'مودرن حديث', img: 'https://picsum.photos/seed/style-modern/600/400', hint: 'modern interior' }
];

export default function AIDesignStudio() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'auto' | 'manual' | null>(null);
  const [roomType, setRoomType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const totalSteps = 6;

  const db = useFirestore();
  const productsColl = useMemo(() => collection(db, 'products'), [db]);
  const { data: allProducts, loading: productsLoading } = useCollection(productsColl);

  const displayProducts = useMemo(() => {
    return (allProducts && allProducts.length > 0) ? allProducts : MOCK_PRODUCTS;
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return displayProducts.filter(p => 
      p.name_ar?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [displayProducts, searchQuery]);

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 3 && selectionMode === 'auto') {
      setStep(5); 
    } else {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    if (step === 5 && selectionMode === 'auto') {
      setStep(3);
    } else {
      setStep(prev => Math.max(prev - 1, 1));
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col font-sans" dir="rtl">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="border-none shadow-xl rounded-[24px] overflow-hidden bg-white/80 backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="min-h-[550px] flex flex-col">
                  <div className="flex-1 p-8 md:p-16">
                    {step === 1 && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                        <div className="text-center space-y-3">
                          <h3 className="text-2xl md:text-3xl font-black text-secondary">البداية تبدأ بصورة</h3>
                          <p className="text-muted-foreground font-medium">ارفع صورة واضحة لغرفتك الحالية.</p>
                        </div>
                        <div className="relative border-2 border-dashed border-gray-100 rounded-[20px] p-12 md:p-24 text-center hover:border-primary/40 transition-all cursor-pointer bg-gray-50/30 flex flex-col items-center justify-center gap-6">
                           <Camera className="w-10 h-10 text-primary" />
                           <p className="text-lg md:text-xl font-black text-secondary">انقر هنا أو اسحب الصورة</p>
                        </div>
                      </div>
                    )}
                    {step === 4 && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                          <h3 className="text-2xl font-black text-secondary">تنسيق الكتالوج</h3>
                          <Input placeholder="ابحث..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:w-80 h-14 rounded-[16px] bg-gray-100/50" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                          {productsLoading ? <div className="animate-pulse h-40 bg-gray-100 rounded-xl" /> : filteredProducts.map(product => (
                            <div key={product.id} onClick={() => toggleProductSelection(product.id)} className={cn("aspect-[3/4] bg-white rounded-[20px] border-2 transition-all cursor-pointer relative overflow-hidden", selectedProductIds.includes(product.id) ? "border-primary" : "border-transparent")}>
                              <Image src={`https://picsum.photos/seed/${product.id}/600/800`} alt={product.name_ar} fill className="object-cover" />
                              <div className="absolute inset-0 bg-black/40" />
                              <div className="absolute bottom-2 right-2 text-white font-black text-xs">{product.name_ar}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-8 md:p-12 bg-gray-50/80 border-t flex flex-col md:flex-row items-center justify-between gap-6">
                    <Button onClick={handleNext} className="w-full md:max-w-[280px] h-16 bg-secondary text-white font-black rounded-[16px]">المتابعة</Button>
                    <Button variant="ghost" onClick={handleBack} disabled={step === 1} className="rounded-[16px] h-16 px-10 font-black">المرحلة السابقة</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
