'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { LogIn, Loader2, CheckSquare, Zap, Users, BarChart3, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await login(name || undefined);
      router.push('/tasks');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-secondary">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-gray-900" />
            </div>
            <span className="text-2xl font-bold">TaskFlow</span>
          </div>
          <p className="text-gray-400 mt-1">Modern task management for teams</p>
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Lightning Fast</h3>
              <p className="text-gray-400 text-sm">Manage tasks with instant updates and real-time collaboration.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Team Collaboration</h3>
              <p className="text-gray-400 text-sm">Assign tasks, leave comments, and track progress together.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Smart Organization</h3>
              <p className="text-gray-400 text-sm">Organize with projects, priorities, labels, and status tracking.</p>
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-sm">&copy; 2026 TaskFlow. Built for AbleSpace Assessment.</p>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white dark:text-gray-900" />
            </div>
            <span className="text-2xl font-bold text-primary">TaskFlow</span>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-primary">Welcome</h1>
          <p className="mb-8 text-secondary">Sign in as a guest to get started instantly</p>

          <div className="rounded-2xl border p-8 bg-primary border-primary">
            <div className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm animate-in fade-in zoom-in duration-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="name-input" className="block text-sm font-medium mb-2 text-secondary">Your Name (optional)</label>
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleGuestLogin(); }}
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-secondary border-primary text-primary"
                />
              </div>

              <button
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-sm bg-blue-600 hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900 shadow-md"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                {isLoading ? 'Signing in...' : 'Continue as Guest'}
              </button>
            </div>

            <p className="text-center text-xs mt-4 text-tertiary">
              No account needed. Your session will persist across refreshes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
