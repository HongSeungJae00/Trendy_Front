'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const checkLoginStatus = () => {
    console.log('Checking login status');
    const token = localStorage.getItem('jwtToken');
    console.log('Token exists:', !!token);

    if (token) {
      try {
        const [, payload] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        const currentTime = Math.floor(Date.now() / 1000);

        console.log('Token info:', {
          exp: new Date(decodedPayload.exp * 1000).toLocaleString(),
          currentTime: new Date(currentTime * 1000).toLocaleString(),
          email: decodedPayload.sub,
          username: decodedPayload.username
        });

        if (decodedPayload.exp > currentTime) {
          console.log('Token is valid, updating login state');
          setIsLoggedIn(true);
          setUsername(decodedPayload.username || '');
          return true;
        } else {
          console.log('Token is expired, cleaning up');
          localStorage.removeItem('jwtToken');
          setIsLoggedIn(false);
          setUsername('');
          return false;
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
        setUsername('');
        return false;
      }
    } else {
      console.log('No token found');
      setIsLoggedIn(false);
      setUsername('');
      return false;
    }
  };

  const handleLogout = async () => {
    console.log('Logging out');
    try {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        await fetch(`${apiUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('jwtToken');
      setIsLoggedIn(false);
      setUsername('');
      window.dispatchEvent(new Event('loginStateChange'));
      alert('로그아웃 되었습니다.');
      router.push('/');
    }
  };

  useEffect(() => {
    console.log('Navigation component mounted');
    checkLoginStatus();

    const handleLoginStateChange = () => {
      console.log('Login state change event received');
      checkLoginStatus();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jwtToken') {
        console.log('JWT storage changed');
        checkLoginStatus();
      }
    };

    window.addEventListener('loginStateChange', handleLoginStateChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      console.log('Navigation component unmounting');
      window.removeEventListener('loginStateChange', handleLoginStateChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleProtectedNavigation = (path: string) => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스 입니다.');
      router.push('/login');
    } else {
      router.push(path);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-red-500 italic ml-24">
          Trendy
        </Link>
        <ul className="flex items-center gap-6 text-sm">
          <li>
            {isLoggedIn && username && (
              <span className="text-gray-600">{username}</span>
            )}
          </li>
          <li>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="text-gray-600 hover:text-gray-900"
              >
                로그아웃
              </button>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                로그인
              </Link>
            )}
          </li>
          <li>
            <button 
              onClick={() => handleProtectedNavigation('/mypage')} 
              className="text-gray-600 hover:text-gray-900"
            >
              마이페이지
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleProtectedNavigation('/cart')} 
              className="text-gray-600 hover:text-gray-900"
            >
              장바구니
            </button>
          </li>
          <li>
            <Link href="/notices" className="text-gray-600 hover:text-gray-900">
              이벤트/공지사항
            </Link>
          </li>
          <li>
            <Link href="/support" className="text-gray-600 hover:text-gray-900">
              고객센터
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
