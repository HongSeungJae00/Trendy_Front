"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/admin-site-header"
import { MainNav } from "@/components/admin-main-nav"
import { Button } from "@/components/admin-ui/admin-button"
import { Input } from "@/components/admin-ui/admin-input"
import { Label } from "@/components/admin-ui/admin-label"
import { Textarea } from "@/components/admin-ui/admin-textarea"
import { toast } from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin-ui/admin-select"

interface Inspection {
  productNumber: string
  productName: string
  color: string
  size: string
  status: string
  result: string
  inspectionDate: string
  inspector: string
  notes: string
  image?: string
}

export default function EditInspectionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInspectionDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const response = await fetch(`${apiUrl}/api/inspections/${params.id}`)

        if (!response.ok) {
          throw new Error("검수 정보를 불러오는데 실패했습니다.")
        }

        const data: Inspection = await response.json()
        setInspection(data)
      } catch (error: any) {
        console.error("검수 정보를 가져오는 중 오류 발생:", error)
      }
    }

    fetchInspectionDetails()
  }, [params.id])

  const handleUpdate = async (updatedInfo: Partial<Inspection>) => {
    setIsUpdating(true)
    try {
      const completeData = { ...inspection, ...updatedInfo } as Inspection
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(`${apiUrl}/api/inspections/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      })

      if (!response.ok) {
        throw new Error("검수 정보 업데이트에 실패했습니다.")
      }

      toast.success("검수 정보가 성공적으로 업데이트되었습니다.")
      router.push("/admin/inspection")
    } catch (error) {
      console.error("검수 정보 업데이트 오류:", error)
      toast.error("검수 정보 업데이트에 실패했습니다.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inspection) {
      handleUpdate(inspection)
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
          {inspection ? (
            <>
              <h1 className="text-lg font-bold mb-6">검수 항목 수정</h1>
              <form id="inspectionForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="productNumber">상품번호</Label>
                  <Input 
                    id="productNumber"
                    value={inspection.productNumber}
                    onChange={(e) => setInspection(prev => prev ? { ...prev, productNumber: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productName">상품명</Label>
                  <Input 
                    id="productName"
                    value={inspection.productName}
                    onChange={(e) => setInspection(prev => prev ? { ...prev, productName: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">컬러</Label>
                  <Select 
                    value={inspection.color}
                    onValueChange={(value) => setInspection(prev => prev ? { ...prev, color: value } : null)}
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
                    value={inspection.size}
                    onValueChange={(value) => setInspection(prev => prev ? { ...prev, size: value } : null)}
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
                  <Label htmlFor="status">상태</Label>
                  <Select 
                    value={inspection.status}
                    onValueChange={(value) => setInspection(prev => prev ? { ...prev, status: value } : null)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waiting">검수대기</SelectItem>
                      <SelectItem value="in_progress">검수중</SelectItem>
                      <SelectItem value="completed">검수완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="result">결과</Label>
                  <Select 
                    value={inspection.result}
                    onValueChange={(value) => setInspection(prev => prev ? { ...prev, result: value } : null)}
                  >
                    <SelectTrigger id="result">
                      <SelectValue placeholder="결과 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pass">합격</SelectItem>
                      <SelectItem value="fail">불합격</SelectItem>
                      <SelectItem value="pending">보류</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspectionDate">검수일</Label>
                  <Input 
                    id="inspectionDate"
                    type="date"
                    value={inspection.inspectionDate}
                    onChange={(e) => setInspection(prev => prev ? { ...prev, inspectionDate: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspector">검수자</Label>
                  <Input 
                    id="inspector"
                    value={inspection.inspector}
                    onChange={(e) => setInspection(prev => prev ? { ...prev, inspector: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">비고</Label>
                  <Textarea 
                    id="notes"
                    value={inspection.notes}
                    onChange={(e) => setInspection(prev => prev ? { ...prev, notes: e.target.value } : null)}
                    rows={4}
                  />
                </div>
              </form>
              <div className="flex justify-end gap-4 mt-6">
                <Button 
                  type="submit" 
                  form="inspectionForm" 
                  className="bg-red-500 hover:bg-red-600 w-24"
                  disabled={isUpdating}
                >
                  {isUpdating ? "수정 중..." : "수정"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/admin/inspection')}
                  className="w-24"
                >
                  닫기
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="text-red-500 mb-4">
                검수 정보를 불러오는데 실패했습니다.
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/inspection")}
              >
                검수 목록으로 돌아가기
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
