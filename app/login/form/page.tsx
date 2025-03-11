'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginFormPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if we're on the login page
    if (window.location.pathname === '/login') {
      if (!localStorage.getItem('redirectUrl') && document.referrer) {
        const referrerUrl = new URL(document.referrer);
        if (referrerUrl.hostname === window.location.hostname && 
            !referrerUrl.pathname.includes('/login')) {
          localStorage.setItem('redirectUrl', referrerUrl.pathname);
        }
      }
    }

    const token = localStorage.getItem('jwtToken');
    setIsLoggedIn(!!token);
    if (token) {
      const redirectUrl = localStorage.getItem('redirectUrl') || '/';
      localStorage.removeItem('redirectUrl');
      if (redirectUrl !== '/login') {
        router.push(redirectUrl);
      } else {
        router.push('/');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    if (!username || !password) {
      setErrorMessage('아이디와 비밀번호를 입력하세요.');
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        try {
          localStorage.setItem('jwtToken', data.token);
          const redirectUrl = localStorage.getItem('redirectUrl') || '/';
          localStorage.removeItem('redirectUrl');
          if (redirectUrl !== '/login') {
            router.push(redirectUrl);
          } else {
            router.push('/');
          }
        } catch (storageError) {
          console.error('Failed to save JWT:', storageError);
          setErrorMessage('토큰 저장 중 오류가 발생했습니다.');
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || '로그인에 실패했습니다. 입력 정보를 확인하거나 다시 시도하세요.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const callProtectedApi = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/login');
      return null;
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}${url}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        localStorage.removeItem('jwtToken');
        router.push('/login');
        return null;
      }

      return response;
    } catch (error) {
      console.error('API call error:', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-[400px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full"
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
          <Button 
            type="submit" 
            className="w-full bg-red-500 hover:bg-red-600 text-white h-12"
            disabled={isLoading}
          >
            {isLoading ? '로딩 중...' : '로그인'}
          </Button>
        </form>
        {errorMessage && (
          <div className="mt-4 text-red-500 text-center">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}