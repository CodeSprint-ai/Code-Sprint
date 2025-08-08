// app/login/page.tsx
'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const r:any = await api.post('/auth/login', { email, password: pw });
      dispatch(login(r.data.data));
      router.push('/dashboard');
    } catch {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white shadow rounded space-y-4 w-full max-w-sm">
        <h1 className="text-xl font-semibold">Login</h1>
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} />
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </div>
  );
}
