'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import Cookies from 'js-cookie'

export function SiteHeader() {
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('isAuthenticated')
    router.push('/admin/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 w-full">
        <Link href="/admin" className="flex items-center ml-4">
          <span className="text-xl font-bold text-red-500 italic hover:text-red-600 transition-colors">
            Trendy_Admin
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="text-xs font-medium text-gray-700 hover:text-blue-500 border border-gray-300 rounded px-2 py-1"
          >
            메인 페이지
          </button>
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-gray-700 hover:text-red-500 border border-gray-300 rounded px-2 py-1"
          >
            로그아웃
          </button>
          <span className="text-xs font-medium text-gray-700">관리자님</span>
          <img
            src="/profile.png"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}
