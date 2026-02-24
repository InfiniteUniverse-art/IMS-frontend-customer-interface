"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "../../context/AuthContext"; // Import your new context hook

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/v1/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        // CRITICAL: This allows the browser to receive and save the HttpOnly cookie
        credentials: 'include', 
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        
        const target = data.user.role === 'admin' ? '/customers' : '/policies';
        router.push(target);
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Unable to connect to the login server.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 tracking-tighter italic">INSUREPRO</h1>
          <p className="text-slate-500 mt-2 text-sm">Sign in to manage your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}