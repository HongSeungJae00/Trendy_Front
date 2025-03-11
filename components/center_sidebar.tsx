'use client'

import Link from 'next/link'
import { User, ShoppingBag, Heart, MapPin, Bell, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  const isSupport = pathname.includes('/support')
  const isNotice = pathname.includes('/notice')
  const isStoreLocator = pathname.includes('/store-locator')
  const showCustomerServiceSidebar = isSupport || isStoreLocator

  return (
    <aside className="w-60 border-r min-h-screen p-6">
      {showCustomerServiceSidebar ? (
        // 고객센터 사이드바
        <>
          <h2 className="text-lg font-bold mb-4">고객센터</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/support" className="text-gray-900 hover:text-gray-600">
                자주 묻는 질문
              </Link>
            </li>
            <li>
              <Link href="/store-locator" className="text-gray-900 hover:text-gray-600">
                매장위치 안내
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  const width = 500;
                  const height = 700;
                  const left = (window.screen.width - width) / 2;
                  const top = (window.screen.height - height) / 2;
                  window.open(
                    'http://pf.kakao.com/_Ataxln/chat',
                    'kakao_chat',
                    `width=${width},height=${height},left=${left},top=${top},location=no,menubar=no,status=no,scrollbars=yes`
                  );
                }}
                className="flex items-center w-full text-black bg-[#FEE500] hover:bg-[#FEE500]/90 py-3 px-4 rounded-md"
              >
                <div className="w-1.5 h-1.5 bg-black rounded-full mr-2" />
                <span>카카오톡 문의하기</span>
              </button>
            </li>
          </ul>
        </>
      ) : isNotice ? (
        // 공지사항 사이드바
        <>
          <h2 className="text-lg font-bold mb-4">이벤트/공지사항</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/notice" className="text-gray-900 hover:text-gray-600">
                공지사항
              </Link>
            </li>
            <li>
              <Link href="/notice/event" className="text-gray-900 hover:text-gray-600">
                이벤트
              </Link>
            </li>
            <li>
              <Link href="/notice/faq" className="text-gray-900 hover:text-gray-600">
                자주 묻는 질문
              </Link>
            </li>
          </ul>
        </>
      ) : (
        // 마이페이지 사이드바
        <>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h2 className="font-bold">사용자님</h2>
              <Link href="/profile/edit" className="text-sm text-gray-600 hover:text-gray-900">
                프로필 관리
              </Link>
            </div>
          </div>

          <nav className="space-y-6">
            <div>
              <h3 className="text-sm font-bold mb-2">쇼핑 정보</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/mypage/buying" className="flex items-center text-gray-600 hover:text-gray-900">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    구매 내역
                  </Link>
                </li>
                <li>
                  <Link href="/mypage/likes" className="flex items-center text-gray-600 hover:text-gray-900">
                    <Heart className="w-4 h-4 mr-2" />
                    관심 상품
                  </Link>
                </li>
                <li>
                  <Link href="/mypage/shipping" className="flex items-center text-gray-600 hover:text-gray-900">
                    <MapPin className="w-4 h-4 mr-2" />
                    배송지 관리
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-2">내 정보</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/mypage/notifications" className="flex items-center text-gray-600 hover:text-gray-900">
                    <Bell className="w-4 h-4 mr-2" />
                    알림 설정
                  </Link>
                </li>
                <li>
                  <Link href="/mypage/settings" className="flex items-center text-gray-600 hover:text-gray-900">
                    <Settings className="w-4 h-4 mr-2" />
                    개인 정보 설정
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </>
      )}
    </aside>
  )
}

