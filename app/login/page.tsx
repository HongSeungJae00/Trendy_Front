'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KakaoIcon, GoogleIcon } from "@/components/icons";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for existing JWT and redirect if logged in
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsLoggedIn(true);
      const redirectUrl = localStorage.getItem('redirectUrl') || '/';
      localStorage.removeItem('redirectUrl');
      router.push(redirectUrl !== '/login' ? redirectUrl : '/');
    }
  }, [router]);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('Checking for OAuth callback...');
      
      // URL 파라미터 확인
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      console.log('URL parameters:', {
        hasToken: !!token,
        fullUrl: window.location.href
      });

      // 이미 로그인되어 있는지 확인
      const existingToken = localStorage.getItem('jwtToken');
      if (existingToken) {
        console.log('Already logged in, redirecting...');
        const redirectUrl = localStorage.getItem('redirectUrl') || '/';
        localStorage.removeItem('redirectUrl');
        router.push(redirectUrl !== '/login' ? redirectUrl : '/');
        return;
      }

      if (token) {
        try {
          console.log('Token found in URL, saving to localStorage');
          localStorage.setItem('jwtToken', token);
          window.dispatchEvent(new Event('loginStateChange'));
          console.log('Login state change event dispatched');

          const redirectUrl = localStorage.getItem('redirectUrl') || '/';
          console.log('Redirecting to:', redirectUrl);
          
          localStorage.removeItem('redirectUrl');
          router.push(redirectUrl !== '/login' ? redirectUrl : '/');
        } catch (error) {
          console.error('Failed to save token:', error);
          setConfirmationMessage('로그인 정보 저장 중 오류가 발생했습니다.');
        } finally {
          setSocialLoading(false);
        }
      } else {
        console.log('No token found in URL');
        setSocialLoading(false);
      }
    };

    handleOAuthCallback();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localLoading) return;
    setLocalLoading(true);

    if (!loginId || !loginPassword) {
      setConfirmationMessage('아이디와 비밀번호를 입력하세요.');
      setLocalLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginId, password: loginPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('jwtToken', data.token);
        setIsLoggedIn(true);
        const redirectUrl = localStorage.getItem('redirectUrl') || '/';
        localStorage.removeItem('redirectUrl');
        router.push(redirectUrl !== '/login' ? redirectUrl : '/');
      } else {
        const errorData = await response.json();
        setConfirmationMessage(errorData.message || '로그인 실패. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setConfirmationMessage('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'kakao' | 'google' | 'naver') => {
    setSocialLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    window.location.href = `${apiUrl}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        <Link href="/" className="text-2xl font-bold text-red-500 italic mb-6">
          Trendy
        </Link>
        <div className="w-full mb-6 rounded-lg overflow-hidden">
          <div className="relative aspect-video">
            <iframe
              src="https://www.youtube.com/embed/rKo-vh1GNM8?autoplay=1&loop=1&playlist=rKo-vh1GNM8&mute=1"
              title="Nike - Believe in Your Greatness"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg"
            />
          </div>
        </div>
        <div className="w-full space-y-3">
          {!showLoginForm ? (
            <>
              <Button
                onClick={() => handleSocialLogin('kakao')}
                disabled={socialLoading}
                className={`w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black h-12 ${socialLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {socialLoading ? '로딩 중...' : (<><KakaoIcon className="w-5 h-5 mr-2" />카카오로 시작하기</>)}
              </Button>
              <Button
                onClick={() => handleSocialLogin('google')}
                disabled={socialLoading}
                className={`w-full bg-white hover:bg-gray-50 text-black border h-12 ${socialLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {socialLoading ? '로딩 중...' : (<><GoogleIcon className="w-5 h-5 mr-2" />Google로 시작하기</>)}
              </Button>
              <Button
                onClick={() => handleSocialLogin('naver')}
                disabled={socialLoading}
                className={`w-full bg-[#03C75A] hover:bg-[#03C75A]/90 text-white h-12 ${socialLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {socialLoading ? '로딩 중...' : (<><span className="font-bold mr-2">N</span>네이버로 시작하기</>)}
              </Button>
              <Button
                onClick={() => setShowLoginForm(true)}
                className="w-full bg-red-500 hover:bg-red-600 text-white h-12"
              >
                로그인
              </Button>
              <Link href="/signup" passHref>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 h-12" variant="ghost">
                  회원가입
                </Button>
              </Link>
            </>
          ) : (
            <form onSubmit={handleLogin} className="space-y-3 w-full">
              <Input
                type="text"
                placeholder="아이디"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="비밀번호"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white h-12"
                disabled={localLoading}
              >
                {localLoading ? '로딩 중...' : '로그인'}
              </Button>
            </form>
          )}
        </div>
        {confirmationMessage && (
          <div className="mt-4 text-red-500">{confirmationMessage}</div>
        )}
      </div>
    </div>
  );
}
