'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronLeft
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "الرئيسية", href: "/" },
      { label: "المتاجر", href: "/vendors" },
      { label: "المنتجات", href: "/shop" },
      { label: "المصممين والنجارين", href: "/professionals" },
      { label: "صمم غرفتك", href: "/ai-design" },
    ],
    support: [
      { label: "حول المنصة", href: "/about" },
      { label: "آراء العملاء", href: "/reviews" },
      { label: "تواصل معنا", href: "/contact" },
      { label: "الأسئلة الشائعة", href: "/faq" },
      { label: "سياسة الخصوصية", href: "/privacy" },
    ],
    categories: [
      { label: "غرف المعيشة", href: "/shop?category=living" },
      { label: "غرف النوم", href: "/shop?category=bedroom" },
      { label: "المطابخ", href: "/shop?category=kitchen" },
      { label: "المكاتب المنزلية", href: "/shop?category=office" },
      { label: "الديكورات", href: "/shop?category=decor" },
    ]
  };

  return (
    <footer className="bg-secondary text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Info */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 overflow-hidden rounded-2xl bg-white p-1 shadow-xl shadow-primary/20">
                <Image src="/logo.png" alt="إيوان" fill className="object-contain p-1" />
              </div>
              <span className="text-3xl font-black tracking-tighter">إيوان</span>
            </Link>
            <p className="text-gray-400 leading-relaxed font-medium text-[15px]">
              منصتك الذكية لتصميم واكتشاف الأثاث. نجمع بين ابتكار الذكاء الاصطناعي وخبرة أمهر النجارين والتجار لنحول منزلك إلى تحفة فنية.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all group">
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all group">
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all group">
                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all group">
                <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-xl font-black relative inline-block">
              المنصة
              <span className="absolute -bottom-2 right-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                    <ChevronLeft className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                    <span className="font-bold">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-8">
            <h4 className="text-xl font-black relative inline-block">
              الدعم والمساعدة
              <span className="absolute -bottom-2 right-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                    <ChevronLeft className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                    <span className="font-bold">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="text-xl font-black relative inline-block">
              تواصل معنا
              <span className="absolute -bottom-2 right-0 w-8 h-1 bg-primary rounded-full"></span>
            </h4>
            <div className="space-y-6">
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">اتصل بنا</p>
                  <p className="font-black dir-ltr text-left">+967 770 000 000</p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">البريد الإلكتروني</p>
                  <p className="font-black">info@ewan.ye</p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">المقر الرئيسي</p>
                  <p className="font-black text-sm">اليمن، صنعاء، حي حدة</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Support Links & Copyright */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-gray-500">
             تم التطوير بكل ❤️ في اليمن.
          </div>
          
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500 font-bold">
              © {currentYear} إيوان. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
