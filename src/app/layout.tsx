
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Cairo } from 'next/font/google';

const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'إيوان | تصميم وأثاث بالذكاء الاصطناعي',
  description: 'إيوان هو منصتك الذكية لتصميم منزلك واكتشاف أرقى قطع الأثاث باستخدام الذكاء الاصطناعي.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body className="antialiased font-sans selection:bg-primary/20">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
