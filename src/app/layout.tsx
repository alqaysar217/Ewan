import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Cairo } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import { CartProvider } from '@/context/cart-context';
import FloatingActions from '@/components/FloatingActions';

const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'إيوان | تصميم الأثاث والمساحات بالذكاء الاصطناعي',
  description: 'إيوان هو منصتك المتكاملة لتصميم منزلك واكتشاف قطع الأثاث الفاخرة باستخدام أحدث تقنيات الذكاء الاصطناعي.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="antialiased font-sans selection:bg-primary/20">
        <FirebaseClientProvider>
          <CartProvider>
            {children}
            <FloatingActions />
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
