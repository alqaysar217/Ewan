'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { toast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      toast({
        variant: "destructive",
        title: "خطأ في الصلاحيات",
        description: `ليس لديك الصلاحية الكافية للقيام بهذه العملية: ${error.context.operation} على المسار ${error.context.path}`,
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);
    
    return () => {
      errorEmitter.removeListener('permission-error', handlePermissionError);
    };
  }, []);

  return null;
}
