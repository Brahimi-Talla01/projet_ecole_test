"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authRepository } from '../../data/repositories/AuthRepository';

export function useVerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        const result = await authRepository.verifyEmail(token);
        
        if (result.success) {
          setStatus('success');
          // Lancer le compte à rebours pour la redirection
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                router.push('/'); // Redirection vers l'accueil
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    };

    verify();
  }, [token, router]);

  return { status, countdown, token };
}