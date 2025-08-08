// app/dashboard/page.tsx
'use client';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import api from '@/lib/axios';
import { logout } from '@/redux/slices/authSlice';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user } = useSelector((s: RootState) => s.auth);
  const [profile, setProfile] = useState<any>(null);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   api.get('/users/me').then(r => setProfile(r.data)).catch(() => dispatch(logout()));
  // }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button variant="destructive" onClick={() => dispatch(logout())}>Logout</Button>
      </div>
      <div>Welcome, {profile?.name || user?.name}</div>
    </div>
  );
}
