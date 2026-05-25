'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    window.location.href = '/api/auth/feishu/login';
  };

  // Check for error from URL
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const errorMsg = params.get('error');
    if (errorMsg) {
      setError('登录失败，请重试');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white rounded-xl border border-border p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">正</span>
          </div>
          <h1 className="text-2xl font-bold text-text">正新新品推广作战平台</h1>
          <p className="text-muted mt-2">使用飞书账号登录</p>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full h-12 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors btn-press flex items-center justify-center gap-3"
        >
          <LogIn size={20} />
          飞书登录
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-error/10 text-error rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted mt-8">
          仅限正新内部员工使用
        </p>
      </div>
    </div>
  );
}