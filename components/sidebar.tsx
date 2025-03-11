'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SidebarProps {
  onItemClick: (href: string) => void;
}

export function Sidebar({ onItemClick }: SidebarProps) {
  const [showProductForm, setShowProductForm] = useState(false);

  const handleRegisterClick = () => {
    setShowProductForm(true);
    onItemClick("/register-product");
  };

  return (
    <aside className="w-[240px] h-[calc(100vh-65px)] flex-shrink-0 border-r bg-white">
      <div className="sticky top-0 h-full">
        <div className="p-4">
          <Button 
            className="w-full bg-red-500 hover:bg-red-600 text-white h-9"
            onClick={handleRegisterClick}
            size="default"
          >
            판매 등록하기
          </Button>
        </div>
        <nav className="px-2">
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => onItemClick("/login-info")}
                className="w-full text-center block px-3 py-1.5 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
              >
                로그인 정보
              </button>
            </li>
            <li>
              <button 
                onClick={() => onItemClick("/")}
                className="w-full text-center block px-3 py-1.5 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
              >
                구매/판매 내역
              </button>
            </li>
            <li>
              <button 
                onClick={() => onItemClick("/review-management")}
                className="w-full text-center block px-3 py-1.5 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
              >
                리뷰관리
              </button>
            </li>
            <li>
              <button 
                onClick={() => onItemClick("/address-book")}
                className="w-full text-center block px-3 py-1.5 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
              >
                주소록
              </button>
            </li>
            <li>
              <button 
                onClick={() => onItemClick("/settlement-account")}
                className="w-full text-center block px-3 py-1.5 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
              >
                판매 정산 계좌
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}

