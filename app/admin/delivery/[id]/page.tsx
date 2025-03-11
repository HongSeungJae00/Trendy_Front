"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/admin-site-header"
import { MainNav } from "@/components/admin-main-nav"
import { Button } from "@/components/admin-ui/admin-button"
import { Input } from "@/components/admin-ui/admin-input"
import { Textarea } from "@/components/admin-ui/admin-textarea"
import { Label } from "@/components/admin-ui/admin-label"
import { toast } from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin-ui/admin-select"
import { Calendar } from 'lucide-react'

interface DeliveryDetails {
  orderNumber: string
  customerName: string
  address: string
  productType: string
  courier: string
  trackingNumber: string
  deliveryDate: string
  status: string
  notes: string
}

export default function DeliveryDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const response = await fetch(`${apiUrl}/api/delivery/${params.id}`)

        if (!response.ok) {
          throw new Error("배송 정보를 불러오는데 실패했습니다.")
        }

        const data: DeliveryDetails = await response.json()
        setDeliveryDetails(data)
      } catch (error: any) {
        console.error("배송 정보를 가져오는 중 오류 발생:", error)
        setError("배송 정보를 불러오는데 문제가 발생했습니다.")
      }
    }

    fetchDeliveryDetails()
  }, [params.id])

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(`${apiUrl}/api/delivery/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deliveryDetails),
      })

      if (!response.ok) {
        throw new Error("배송 정보 업데이트에 실패했습니다.")
      }

      toast.success("배송 정보가 성공적으로 업데이트되었습니다.")
      router.push("/admin/delivery")
    } catch (error) {
      console.error("배송 정보 업데이트 오류:", error)
      toast.error("배송 정보 업데이트에 실패했습니다.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (deliveryDetails) {
      handleUpdate()
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="flex">
        <aside className="w-64 border-r min-h-[calc(100vh-3.5rem)] p-4">
          <MainNav />
        </aside>
        <main className="flex-1 p-6 bg-gray-50">
          {error && (
            <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          {deliveryDetails ? (
            <>
              <h1 className="text-lg font-bold mb-6">배송 정보 수정</h1>
              <form id="deliveryForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">주문번호</Label>
                  <Input 
                    id="orderNumber"
                    value={deliveryDetails.orderNumber}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">고객명</Label>
                  <Input 
                    id="customerName"
                    value={deliveryDetails.customerName}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">배송 주소</Label>
                  <Input 
                    id="address"
                    value={deliveryDetails.address}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productType">상품 유형</Label>
                  <Select 
                    value={deliveryDetails.productType}
                    onValueChange={(value) => setDeliveryDetails(prev => prev ? { ...prev, productType: value } : null)}
                  >
                    <SelectTrigger id="productType">
                      <SelectValue placeholder="상품 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="일반상품">일반상품</SelectItem>
                      <SelectItem value="리셀상품">리셀상품</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courier">택배사</Label>
                  <Input 
                    id="courier"
                    value={deliveryDetails.courier}
                    onChange={(e) => setDeliveryDetails(prev => prev ? { ...prev, courier: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trackingNumber">운송장번호</Label>
                  <Input 
                    id="trackingNumber"
                    value={deliveryDetails.trackingNumber}
                    onChange={(e) => setDeliveryDetails(prev => prev ? { ...prev, trackingNumber: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">배송일</Label>
                  <div className="relative">
                    <Input 
                      id="deliveryDate"
                      type="date"
                      value={deliveryDetails.deliveryDate}
                      onChange={(e) => setDeliveryDetails(prev => prev ? { ...prev, deliveryDate: e.target.value } : null)}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">배송 상태</Label>
                  <Select 
                    value={deliveryDetails.status}
                    onValueChange={(value) => setDeliveryDetails(prev => prev ? { ...prev, status: value } : null)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="배송 상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="배송준비중">배송준비중</SelectItem>
                      <SelectItem value="배송중">배송중</SelectItem>
                      <SelectItem value="배송완료">배송완료</SelectItem>
                      <SelectItem value="배송취소">배송취소</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">비고</Label>
                  <Textarea 
                    id="notes"
                    value={deliveryDetails.notes}
                    onChange={(e) => setDeliveryDetails(prev => prev ? { ...prev, notes: e.target.value } : null)}
                    placeholder="배송 관련 특이사항을 입력하세요"
                    rows={4}
                  />
                </div>
              </form>
              <div className="flex justify-end gap-4 mt-6">
                <Button 
                  type="submit" 
                  form="deliveryForm" 
                  className="bg-red-500 hover:bg-red-600 w-24"
                  disabled={isUpdating}
                >
                  {isUpdating ? "수정 중..." : "수정"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/admin/delivery')}
                  className="w-24"
                >
                  닫기
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="text-red-500 mb-4">
                배송 정보를 불러오는데 실패했습니다.
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/delivery")}
              >
                배송 목록으로 돌아가기
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
