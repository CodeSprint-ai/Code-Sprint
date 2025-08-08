// hooks/useAuth.ts
'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function useAuth() {
  const { accessToken }: any = useSelector((s: RootState) => s.auth);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) router.replace('/login');
  }, [accessToken, router]);
}
