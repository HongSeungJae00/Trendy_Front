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

interface InventoryItem {
  id: string
  brand: string
  name: string
  productNumber: string
  color: string
  size: string
  quantity: number
  warehouseLocation: string
  stockStatus: string
  inventoryLocation: string
  inventoryStatus: string
  notes: string
  image?: string
}

export default function EditInventoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [inventoryItem, setInventoryItem] = useState<InventoryItem | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInventoryDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const response = await fetch(`${apiUrl}/api/inventory/${params.id}`)

        if (!response.ok) {
          throw new Error("재고 정보를 불러오는데 실패했습니다.")
        }

        const data: InventoryItem = await response.json()
        setInventoryItem(data)
      } catch (error: any) {
        console.error("재고 정보를 가져오는 중 오류 발생:", error)
      }
    }

    fetchInventoryDetails()
  }, [params.id])

  const handleUpdate = async (updatedInfo: Partial<InventoryItem>) => {
    setIsUpdating(true)
    try {
      const completeData = { ...inventoryItem, ...updatedInfo } as InventoryItem
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(`${apiUrl}/api/inventory/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      })

      if (!response.ok) {
        throw new Error("재고 정보 업데이트에 실패했습니다.")
      }

      toast.success("재고 정보가 성공적으로 업데이트되었습니다.")
      router.push("/admin/inventory")
    } catch (error) {
      console.error("재고 정보 업데이트 오류:", error)
      toast.error("재고 정보 업데이트에 실패했습니다.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inventoryItem) {
      handleUpdate(inventoryItem)
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
          {inventoryItem ? (
            <>
              <h1 className="text-lg font-bold mb-6">재고 항목 수정</h1>
              <form id="inventoryForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brand">브랜드</Label>
                  <Input 
                    id="brand"
                    value={inventoryItem.brand}
                    onChange={(e) => setInventoryItem(prev => prev ? { ...prev, brand: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">상품명</Label>
                  <Input 
                    id="name"
                    value={inventoryItem.name}
                    onChange={(e) => setInventoryItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productNumber">상품번호</Label>
                  <Input 
                    id="productNumber"
                    value={inventoryItem.productNumber}
                    onChange={(e) => setInventoryItem(prev => prev ? { ...prev, productNumber: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">컬러</Label>
                  <Select 
                    value={inventoryItem.color}
                    onValueChange={(value) => setInventoryItem(prev => prev ? { ...prev, color: value } : null)}
                  >
                    <SelectTrigger id="color">
                      <SelectValue placeholder="컬러 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="black">블랙</SelectItem>
                      <SelectItem value="white">화이트</SelectItem>
                      <SelectItem value="gray">그레이</SelectItem>
                      <SelectItem value="blue">블루</SelectItem>
                      <SelectItem value="red">레드</SelectItem>
                      <SelectItem value="purple">퍼플</SelectItem>
                      <SelectItem value="yellow">옐로우</SelectItem>
                      <SelectItem value="brown">브라운</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">사이즈</Label>
                  <Select 
                    value={inventoryItem.size}
                    onValueChange={(value) => setInventoryItem(prev => prev ? { ...prev, size: value } : null)}
                  >
                    <SelectTrigger id="size">
                      <SelectValue placeholder="사이즈 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="230">230</SelectItem>
                      <SelectItem value="240">240</SelectItem>
                      <SelectItem value="250">250</SelectItem>
                      <SelectItem value="260">260</SelectItem>
                      <SelectItem value="270">270</SelectItem>
                      <SelectItem value="280">280</SelectItem>
                      <SelectItem value="290">290</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">재고량</Label>
                  <Input 
                    id="quantity"
                    type="number"
                    value={inventoryItem.quantity}
                    onChange={(e) => setInventoryItem(prev => prev ? { ...prev, quantity: parseInt(e.target.value) } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehouseLocation">창고 위치</Label>
                  <Select 
                    value={inventoryItem.warehouseLocation}
                    onValueChange={(value) => setInventoryItem(prev => prev ? { ...prev, warehouseLocation: value } : null)}
                  >
                    <SelectTrigger id="warehouseLocation">
                      <SelectValue placeholder="창고 위치 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warehouse-a">A 창고</SelectItem>
                      <SelectItem value="warehouse-b">B 창고</SelectItem>
                      <SelectItem value="warehouse-c">C 창고</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockStatus">재고 상태</Label>
                  <Select 
                    value={inventoryItem.stockStatus}
                    onValueChange={(value) => setInventoryItem(prev => prev ? { ...prev, stockStatus: value } : null)}
                  >
                    <SelectTrigger id="stockStatus">
                      <SelectValue placeholder="재고 상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-stock">재고 있음</SelectItem>
                      <SelectItem value="out-of-stock">품절</SelectItem>
                      <SelectItem value="low-stock">재고 부족</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inventoryLocation">재고 위치</Label>
                  <Input 
                    id="inventoryLocation"
                    value={inventoryItem.inventoryLocation}
                    onChange={(e) => setInventoryItem(prev => prev ? { ...prev, inventoryLocation: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inventoryStatus">재고 상태</Label>
                  <Select 
                    value={inventoryItem.inventoryStatus}
                    onValueChange={(value) => setInventoryItem(prev => prev ? { ...prev, inventoryStatus: value } : null)}
                  >
                    <SelectTrigger id="inventoryStatus">
                      <SelectValue placeholder="재고 상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">정상</SelectItem>
                      <SelectItem value="damaged">손상</SelectItem>
                      <SelectItem value="reserved">예약됨</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">비고</Label>
                  <Textarea 
                    id="notes"
                    value={inventoryItem.notes}
                    onChange={(e) => setInventoryItem(prev => prev ? { ...prev, notes: e.target.value } : null)}
                    rows={4}
                  />
                </div>
              </form>
              <div className="flex justify-end gap-4 mt-6">
                <Button 
                  type="submit" 
                  form="inventoryForm" 
                  className="bg-red-500 hover:bg-red-600 w-24"
                  disabled={isUpdating}
                >
                  {isUpdating ? "수정 중..." : "수정"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/admin/inventory')}
                  className="w-24"
                >
                  닫기
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="text-red-500 mb-4">
                재고 정보를 불러오는데 실패했습니다.
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/inventory")}
              >
                재고 목록으로 돌아가기
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
