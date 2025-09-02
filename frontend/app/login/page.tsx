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

    const handleEmailPasswordSubmit = async () => {
        setLoading(true);
        try {
            const r: any = await api.post('/auth/login', { email, password: pw });
            dispatch(login(r.data.data));
            router.push('/dashboard');
        } catch {
            alert('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthLogin = async(provider:string) => {
        window.location.href = `http://localhost:5000/auth/${provider}`;
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="p-6 bg-white shadow rounded space-y-4 w-full max-w-sm">
                <h1 className="text-xl font-semibold text-center">Login</h1>

                {/* Email/Password Section */}
                <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} />
                <Button onClick={handleEmailPasswordSubmit} disabled={loading} className="w-full">
                    {loading ? 'Logging in...' : 'Login with Email'}
                </Button>

                {/* Separator */}
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-400"></div>
                    <span className="flex-shrink mx-4 text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                </div>

                {/* Social Login Section */}
                <Button
                    onClick={() => handleOAuthLogin('google')}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                >
                    {/* You can add a Google icon here */}
                    Login with Google
                </Button>
                <Button
                    onClick={() => handleOAuthLogin('github')}
                    className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white"
                >
                    {/* You can add a GitHub icon here */}
                    Login with GitHub
                </Button>
            </div>
        </div>
    );
}