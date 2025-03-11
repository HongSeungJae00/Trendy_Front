"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/admin-site-header"
import { MainNav } from "@/components/admin-main-nav"
import { OrderDetailsForm } from "@/components/admin-order-details-form"
import { Button } from "@/components/admin-ui/admin-button"

// OrderDetails 타입 정의
interface OrderDetails {
  id: string;
  // 필요한 주문 상세 필드들을 추가하세요
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 주문 상세 정보 조회
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/api/orders/${params.id}`)
        if (!response.ok) throw new Error('주문 정보를 불러오는데 실패했습니다')
        const data = await response.json()
        setOrderDetails(data)
      } catch (error) {
        console.error('Error:', error)
        // 에러 처리 로직 추가 (예: 토스트 메시지)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [params.id])

  // 주문 정보 업데이트
  const handleUpdate = async (updatedInfo: OrderDetails) => {
    setIsUpdating(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/orders/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInfo)
      })

      if (!response.ok) throw new Error('주문 정보 업데이트에 실패했습니다')
      
      // 성공적으로 업데이트된 경우
      router.push('/admin/orders')
    } catch (error) {
      console.error('Error:', error)
      // 에러 처리 로직 추가 (예: 토스트 메시지)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="flex">
        <aside className="w-64 border-r min-h-[calc(100vh-3.5rem)] p-4">
          <MainNav />
        </aside>
        <main className="flex-1 p-6 bg-gray-50 flex flex-col">
          {orderDetails ? (
            <>
              <div className="flex-grow">
                <h1 className="text-lg font-bold mb-6">주문 상세 정보</h1>
                <OrderDetailsForm
                  orderId={params.id}
                />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button 
                  className="w-24 bg-red-500 hover:bg-red-600" 
                  onClick={() => handleUpdate(orderDetails)}
                  disabled={isUpdating}
                >
                  {isUpdating ? "수정 중..." : "수정"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-24"
                  onClick={() => router.push('/admin/orders')}
                >
                  닫기
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="text-red-500 mb-4">
                주문 정보를 불러오는데 실패했습니다.
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/orders')}
              >
                주문 목록으로 돌아가기
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


