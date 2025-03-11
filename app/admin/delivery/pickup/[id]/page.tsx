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

interface PickupDetails {
  orderNumber: string
  customerName: string
  productNumber: string
  productName: string
  productType: string
  pickupLocation: string
  pickupDate: string
  status: string
  notes: string
}

export default function PickupDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [pickupDetails, setPickupDetails] = useState<PickupDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPickupDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const response = await fetch(`${apiUrl}/api/pickups/${params.id}`)

        if (!response.ok) {
          throw new Error("픽업 정보를 불러오는데 실패했습니다.")
        }

        const data: PickupDetails = await response.json()
        setPickupDetails(data)
      } catch (error: any) {
        console.error("픽업 정보를 가져오는 중 오류 발생:", error)
      }
    }

    fetchPickupDetails()
  }, [params.id])

  const handleUpdate = async (updatedInfo: Partial<PickupDetails>) => {
    setIsUpdating(true)
    try {
      const completeData = { ...pickupDetails, ...updatedInfo } as PickupDetails
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(`${apiUrl}/api/pickups/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      })

      if (!response.ok) {
        throw new Error("픽업 정보 업데이트에 실패했습니다.")
      }

      toast.success("픽업 정보가 성공적으로 업데이트되었습니다.")
      router.push("/admin/pickups")
    } catch (error) {
      console.error("픽업 정보 업데이트 오류:", error)
      toast.error("픽업 정보 업데이트에 실패했습니다.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pickupDetails) {
      handleUpdate(pickupDetails)
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
          {pickupDetails ? (
            <>
              <h1 className="text-lg font-bold mb-6">픽업 정보 수정</h1>
              <form id="pickupForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">주문번호</Label>
                  <Input 
                    id="orderNumber"
                    value={pickupDetails.orderNumber}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">고객명</Label>
                  <Input 
                    id="customerName"
                    value={pickupDetails.customerName}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productNumber">상품번호</Label>
                  <Input 
                    id="productNumber"
                    value={pickupDetails.productNumber}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productName">상품명</Label>
                  <Input 
                    id="productName"
                    value={pickupDetails.productName}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productType">상품유형</Label>
                  <Select 
                    value={pickupDetails.productType}
                    onValueChange={(value) => setPickupDetails(prev => prev ? { ...prev, productType: value } : null)}
                  >
                    <SelectTrigger id="productType">
                      <SelectValue placeholder="상품유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="일반상품">일반상품</SelectItem>
                      <SelectItem value="리셀상품">리셀상품</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupLocation">픽업장소</Label>
                  <Input 
                    id="pickupLocation"
                    value={pickupDetails.pickupLocation}
                    onChange={(e) => setPickupDetails(prev => prev ? { ...prev, pickupLocation: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupDate">픽업일</Label>
                  <Input 
                    id="pickupDate"
                    type="date"
                    value={pickupDetails.pickupDate}
                    onChange={(e) => setPickupDetails(prev => prev ? { ...prev, pickupDate: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">픽업상태</Label>
                  <Select 
                    value={pickupDetails.status}
                    onValueChange={(value) => setPickupDetails(prev => prev ? { ...prev, status: value } : null)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="픽업상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="픽업대기">픽업대기</SelectItem>
                      <SelectItem value="픽업중">픽업중</SelectItem>
                      <SelectItem value="픽업완료">픽업완료</SelectItem>
                      <SelectItem value="픽업취소">픽업취소</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">비고</Label>
                  <Textarea 
                    id="notes"
                    value={pickupDetails.notes}
                    onChange={(e) => setPickupDetails(prev => prev ? { ...prev, notes: e.target.value } : null)}
                    placeholder="추가 정보를 입력하세요"
                    rows={4}
                  />
                </div>
              </form>
              <div className="flex justify-end gap-4 mt-6">
                <Button 
                  type="submit" 
                  form="pickupForm" 
                  className="bg-red-500 hover:bg-red-600 w-24"
                  disabled={isUpdating}
                >
                  {isUpdating ? "수정 중..." : "수정"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/admin/delivery/iida')}
                  className="w-24"
                >
                  닫기
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="text-red-500 mb-4">
                픽업 정보를 불러오는데 실패했습니다.
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/delivery/iida")}
              >
                픽업 목록으로 돌아가기
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
