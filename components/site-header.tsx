'use client'

import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-red-500 italic ml-24">
          Trendy
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            로그인
          </Link>
          <Link href="/mypage" className="text-gray-600 hover:text-gray-900">
            마이페이지
          </Link>
          <Link href="/cart" className="text-gray-600 hover:text-gray-900">
            장바구니
          </Link>
          <Link href="/events" className="text-gray-600 hover:text-gray-900">
            이벤트/공지사항
          </Link>
          <Link href="/customer" className="text-gray-600 hover:text-gray-900">
            고객센터
          </Link>
        </nav>
      </div>
    </header>
  )
}

