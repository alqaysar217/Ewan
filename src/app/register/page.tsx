'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // توجيه كافة محاولات الوصول لصفحة التسجيل إلى صفحة الدخول
    // حيث أن الحسابات يتم إنشاؤها من قبل الإدارة فقط.
    router.replace('/login');
  }, [router]);

  return null;
}
