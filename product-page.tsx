import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-red-500 text-2xl font-bold">Trendy</h1>
          <nav className="hidden md:flex gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">로그인</a>
            <a href="#" className="hover:text-gray-900">마이페이지</a>
            <a href="#" className="hover:text-gray-900">이벤트/공지사항</a>
            <a href="#" className="hover:text-gray-900">장바구니</a>
            <a href="#" className="hover:text-gray-900">고객센터</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Nike Air Force 1</h2>
              <p className="text-gray-600">Nike - White</p>
            </div>
            <div className="text-2xl font-bold">₩129,000</div>
            <Button className="w-48 bg-black hover:bg-gray-800">장바구니에 담기</Button>
          </div>

          {/* Product Image */}
          <Card className="overflow-hidden bg-gray-50 p-6">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Nike Air Force 1"
              width={600}
              height={400}
              className="object-contain"
              priority
            />
          </Card>
        </div>

        {/* Category Navigation */}
        <nav className="sticky top-0 bg-red-500 text-white mt-12 rounded-lg">
          <ul className="flex justify-center space-x-8 py-3">
            <li><a href="#" className="hover:text-gray-200">브랜드</a></li>
            <li><a href="#" className="hover:text-gray-200">색상</a></li>
            <li><a href="#" className="hover:text-gray-200">사이즈</a></li>
            <li><a href="#" className="hover:text-gray-200">매장상품</a></li>
            <li><a href="#" className="hover:text-gray-200">리셀</a></li>
          </ul>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Link href="/products/nike-airforce-1">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="나이키 에어포스 1"
                  width={400}
                  height={400}
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold">나이키</h3>
                <p className="text-sm text-gray-600">나이키 에어포스 1 '07 WB 플랙스</p>
                <div className="mt-2">
                  <span className="font-bold">115,0K</span>
                  <span className="text-sm text-gray-500 ml-2">즉시 구매가</span>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/products/jordan-1">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="조던 1"
                  width={400}
                  height={400}
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold">조던</h3>
                <p className="text-sm text-gray-600">조던 1 x 트래비스 스캇 레트로 로우 OG SP</p>
                <div className="mt-2">
                  <span className="font-bold">495,000원</span>
                  <span className="text-sm text-gray-500 ml-2">즉시 구매가</span>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}

