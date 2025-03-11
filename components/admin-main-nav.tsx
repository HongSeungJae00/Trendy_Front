'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Users, CreditCard, Truck, Warehouse, Search, Star, Mail, HelpCircle, TrendingUp, Calculator } from 'lucide-react'

const items = [
  {
    title: "상품 관리",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "회원 관리",
    href: "/admin/members",
    icon: Users,
  },
  {
    title: "주문 및 결제 관리",
    href: "/admin/orders",
    icon: CreditCard,
  },
  {
    title: "배송 관리",
    href: "/admin/delivery",
    icon: Truck,
  },
  {
    title: "창고 및 재고 관리",
    href: "/admin/inventory",
    icon: Warehouse,
  },
  {
    title: "검수 관리",
    href: "/admin/inspection",
    icon: Search,
  },
  {
    title: "리뷰 관리",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    title: "게시글 관리",
    href: "/admin/posts",
    icon: Mail,
  },
  {
    title: "문의사항 관리",
    href: "/admin/inquiries",
    icon: HelpCircle,
  },
  {
    title: "매출 관리",
    href: "/admin/sales",
    icon: TrendingUp,
  },
  {
    title: "정산 관리",
    href: "/admin/settlements",
    icon: Calculator,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="space-y-4">
      <h2 className="px-3 text-lg font-semibold">Category</h2>
      <nav className="flex flex-col space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                isActive 
                  ? "bg-gray-100 text-black font-medium" 
                  : "text-black hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

