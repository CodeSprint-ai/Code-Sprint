// app/register/page.tsx
'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handle = async () => {
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      alert('Check email for verification');
      router.push('/login');
    } catch {
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white shadow rounded space-y-4 w-full max-w-sm">
        <h1 className="text-xl font-semibold">Register</h1>
        <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <Input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <Button onClick={handle} disabled={loading} className="w-full">
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </div>
    </div>
  );
}
