'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { CreditCard, Bell, QrCode, User } from 'lucide-react'
import { OrderDetailPopup } from '@/components/OrderDetailPopup'
import { ReviewPopup } from '@/components/ReviewPopup'
import { Sidebar } from "@/components/sidebar"
import TopButton from '@/components/top-button'
import { ReviewManagement } from '@/components/ReviewManagement'
import { AddressList } from '@/components/AddressList'
import { LoginInfo } from '@/components/LoginInfo'
import { PaymentForm } from '@/components/PaymentForm'
import { ProductForm } from '@/components/ProductForm'

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType;
}

const sidebarNavItems: NavItem[] = [
  {
    title: "로그인 정보",
    href: "/login-info",
    icon: User,
  },
  {
    title: "리뷰관리",
    href: "/review-management",
    icon: Bell,
  },
  {
    title: "주소록",
    href: "/address-book",
    icon: QrCode,
  },
  {
    title: "결제 정보",
    href: "/payment-info",
    icon: CreditCard,
  },
  {
    title: "판매 정산 계좌",
    href: "/settlement-account",
    icon: CreditCard,
  },
  {
    title: "상품 등록",
    href: "/register-product",
    icon: QrCode,
  }
]

export default function MyPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false)
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<{
    title: string;
    price: string;
    paymentMethod: string;
  } | null>(null)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleSidebarItemClick = (href: string) => {
    setActiveItem(href)
    setShowPaymentForm(href === '/settlement-account')
    setShowProductForm(href === '/register-product')
  }

  const handleReviewSubmit = (review: { text: string; image: File | null }) => {
    console.log('Review submitted:', review)
  }

  const handlePaymentDetailsOpen = (orderDetails: { title: string; price: string; paymentMethod: string }) => {
    setSelectedOrder(orderDetails)
    setShowPaymentDetails(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Sidebar onItemClick={handleSidebarItemClick} />
        <main className="flex-1 ml-6 space-y-6">
          {showProductForm ? (
            <ProductForm />
          ) : showPaymentForm ? (
            <PaymentForm />
          ) : activeItem === '/login-info' ? (
            <LoginInfo />
          ) : activeItem === '/review-management' ? (
            <ReviewManagement />
          ) : activeItem === '/address-book' ? (
            <AddressList />
          ) : activeItem === '/settlement-account' ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">판매 정산 계좌 관리</h2>
              <div className="space-y-4">
                <p className="text-gray-600">등록된 계좌 정보가 없습니다.</p>
                <Button className="w-full">계좌 등록하기</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatusCard title="진행중" count={4} icon="credit-card" />
                <StatusCard title="입찰중" count={0} icon="bell" />
                <StatusCard title="판매중" count={0} icon="qr-code" />
                <StatusCard title="종료" count={4} icon="user" />
              </div>

              <div className="bg-white rounded-lg shadow">
                <Tabs defaultValue="purchases" className="w-full">
                  <TabsList className="grid grid-cols-2 w-full p-1">
                    <TabsTrigger 
                      value="purchases" 
                      className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-md"
                    >
                      구매 내역
                    </TabsTrigger>
                    <TabsTrigger 
                      value="sales" 
                      className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-md"
                    >
                      판매 내역
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="purchases" className="p-4 space-y-4">
                    <OrderItem
                      image="/placeholder.svg"
                      title="C.P. Company Shell-R Mixed Goggle Vest Black - 23FW"
                      subtitle="Size: M"
                      price="52,000원"
                      date="24/11/01"
                      status="배송완료"
                      paymentMethod="신용카드"
                      address="서울특별시 강남구 테헤란로 152"
                    />
                    <OrderItem
                      image="/placeholder.svg"
                      title="Converse Chuck 70 Ox Wolf Grey"
                      subtitle="Size: US 9"
                      price="275,000원"
                      date="23/06/20"
                      status="배송전"
                      paymentMethod="무통장입금"
                      address="서울특별시 마포구 와우산로 94"
                    />
                    <OrderItem
                      image="/placeholder.svg"
                      title="(Child) Polo Ralph Lauren Cotton Fleece Hoodie Grey"
                      subtitle="Size: 10Y"
                      price="150,000원"
                      date="23/03/22"
                      status="교환완료"
                      paymentMethod="카카오페이"
                      address="서울특별시 용산구 한남대로 42길 22"
                    />
                  </TabsContent>

                  <TabsContent value="sales" className="p-4 space-y-4">
                    <SaleItem
                      image="/placeholder.svg"
                      title="Nike Air Force 1 '07 Low White"
                      subtitle="Size: US 10"
                      price="130,000원"
                      date="24/10/15"
                      status="판매완료"
                      buyerInfo="구매자123"
                      shippingMethod="택배"
                    />
                    <SaleItem
                      image="/placeholder.svg"
                      title="Adidas Originals Superstar"
                      subtitle="Size: US 9"
                      price="110,000원"
                      date="24/09/30"
                      status="배송중"
                      buyerInfo="슈즈매니아"
                      shippingMethod="택배"
                    />
                    <SaleItem
                      image="/placeholder.svg"
                      title="Supreme Box Logo Hoodie"
                      subtitle="Size: L"
                      price="450,000원"
                      date="24/08/22"
                      status="판매완료"
                      buyerInfo="패션러버"
                      shippingMethod="직거래"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </main>
      </div>
      <TopButton />

      {showPaymentDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">결제 내역</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">상품</span>
                <span className="font-medium">{selectedOrder.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">가격</span>
                <span className="font-medium">{selectedOrder.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">결제 방법</span>
                <span className="font-medium">{selectedOrder.paymentMethod}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="destructive"
                onClick={() => setShowConfirmationPopup(true)}
              >
                결제 취소하기
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPaymentDetails(false)}
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}

      {showConfirmationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">결제 취소를 하시겠습니까?</h3>
            <p className="text-gray-600 mb-6">
              취소 후에는 복구할 수 없으며, 환불은 영업일 기준 3-5일 소요됩니다.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="destructive"
                onClick={() => {
                  console.log('Payment cancelled')
                  setShowConfirmationPopup(false)
                  setShowPaymentDetails(false)
                }}
              >
                결제 취소하기
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowConfirmationPopup(false)}
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface StatusCardProps {
  title: string
  count: number
  icon: string
}

function StatusCard({ title, count, icon }: StatusCardProps) {
  const IconComponent = {
    "credit-card": CreditCard,
    "bell": Bell,
    "qr-code": QrCode,
    "user": User
  }[icon]

  return (
    <Card>
      <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
        {IconComponent && <IconComponent className="h-6 w-6 text-muted-foreground" />}
        <div className="text-4xl font-bold">{count}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </CardContent>
    </Card>
  )
}

interface OrderItemProps {
  image: string
  title: string
  subtitle: string
  price: string
  date: string
  status: string
  paymentMethod: string
  address: string
}

function OrderItem({ image, title, subtitle, price, date, status, paymentMethod, address }: OrderItemProps) {
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false)
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false)
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)

  const handleReviewSubmit = (review: { text: string, image: File | null }) => {
    console.log('Review submitted:', review)
    setIsReviewPopupOpen(false)
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent
        className="p-4 cursor-pointer"
        onClick={() => setIsDetailPopupOpen(true)}
      >
        <div className="flex gap-4">
          <div className="relative w-20 h-20">
            <Image
              src={image}
              alt={title}
              fill
              className="rounded-md object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
            <p className="text-sm font-medium">{price}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="text-sm text-muted-foreground">{date}</div>
            <div className="flex items-center gap-2">
              {status === "배송완료" && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsReviewPopupOpen(true)
                  }}
                >
                  리뷰 작성하기
                </Button>
              )}
              {status === "배송전" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowPaymentDetails(true)
                  }}
                >
                  결제 취소
                </Button>
              )}
              <span className="text-sm font-medium">{status}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <OrderDetailPopup
        isOpen={isDetailPopupOpen}
        onClose={() => setIsDetailPopupOpen(false)}
        order={{
          title,
          image,
          price,
          size: subtitle.replace('Size: ', ''),
          date,
          status,
          paymentMethod,
          totalAmount: price,
          address
        }}
      />

      <ReviewPopup
        isOpen={isReviewPopupOpen}
        onClose={() => setIsReviewPopupOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </Card>
  )
}

interface SaleItemProps {
  image: string
  title: string
  subtitle: string
  price: string
  date: string
  status: string
  buyerInfo: string
  shippingMethod: string
}

function SaleItem({ image, title, subtitle, price, date, status, buyerInfo, shippingMethod }: SaleItemProps) {
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false)

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent
        className="p-4 cursor-pointer"
        onClick={() => setIsDetailPopupOpen(true)}
      >
        <div className="flex gap-4">
          <div className="relative w-20 h-20">
            <Image
              src={image}
              alt={title}
              fill
              className="rounded-md object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
            <p className="text-sm font-medium">{price}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="text-sm text-muted-foreground">{date}</div>
            <div className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">
              {status}
            </div>
          </div>
        </div>
      </CardContent>

      <OrderDetailPopup
        isOpen={isDetailPopupOpen}
        onClose={() => setIsDetailPopupOpen(false)}
        order={{
          title,
          image,
          price,
          size: subtitle.replace('Size: ', ''),
          date,
          status,
          paymentMethod: shippingMethod,
          totalAmount: price,
          address: buyerInfo
        }}
      />
    </Card>
  )
}

