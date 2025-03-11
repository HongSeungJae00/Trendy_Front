"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/admin-site-header"
import { MainNav } from "@/components/admin-main-nav"
import { Button } from "@/components/admin-ui/admin-button"
import { Input } from "@/components/admin-ui/admin-input"
import { Textarea } from "@/components/admin-ui/admin-textarea"
import { Label } from "@/components/admin-ui/admin-label"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin-ui/admin-select"
import { toast } from "@/components/admin-ui/admin-use-toast"

interface Review {
  id: number
  productNumber: string
  productName: string
  writer: string
  size: string
  reportStatus: string
  purchaseDate: string
  writeDate: string
  content: string
  images: string[]
}

export default function ReviewDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [review, setReview] = useState<Review | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const response = await fetch(`${apiUrl}/api/reviews/${params.id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("리뷰 정보를 불러오는데 실패했습니다.")
        }

        const data = await response.json()
        setReview(data)
        setError(null)
      } catch (error) {
        console.error("리뷰 정보 조회 오류:", error)
      }
    }

    fetchReviewDetails()
  }, [params.id])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(`${apiUrl}/api/reviews/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      })

      if (!response.ok) {
        throw new Error("리뷰 정보 업데이트에 실패했습니다.")
      }

      toast({
        title: "리뷰가 성공적으로 수정되었습니다.",
        description: "리뷰 관리 페이지로 이동합니다.",
      })
      router.push('/admin/reviews')
    } catch (error) {
      console.error('리뷰 정보 업데이트 오류:', error)
      toast({
        title: "리뷰 수정 실패",
        description: "리뷰를 수정하는 중 오류가 발생했습니다. 다시 시도해 주세요.",
        variant: "destructive",
      })
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
        <main className="flex-1 p-6 bg-gray-50">
          {error && (
            <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          {review ? (
            <>
              <h1 className="text-lg font-bold mb-6">리뷰 상세 정보</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Section */}
                <div className="relative bg-gray-100 rounded-lg aspect-square overflow-hidden">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                  >
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Product review ${index + 1}`}
                        className="w-full h-full object-contain flex-shrink-0"
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                    disabled={currentImageIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => Math.min(review.images.length - 1, prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                    disabled={currentImageIndex === review.images.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {review.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-black' : 'bg-gray-300'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="productNumber">상품번호</Label>
                    <Input id="productNumber" value={review.productNumber} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="productName">상품명</Label>
                    <Input id="productName" value={review.productName} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="writer">작성자</Label>
                    <Input id="writer" value={review.writer} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="size">사이즈</Label>
                    <Input id="size" value={review.size} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="purchaseDate">구매일</Label>
                    <Input id="purchaseDate" value={review.purchaseDate} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="writeDate">작성일</Label>
                    <Input id="writeDate" value={review.writeDate} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="content">리뷰 내용</Label>
                    <Textarea 
                      id="content" 
                      value={review.content} 
                      readOnly 
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reportStatus">신고대상</Label>
                    <Select defaultValue={review.reportStatus}>
                      <SelectTrigger id="reportStatus">
                        <SelectValue placeholder="신고대상 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="해당없음">해당없음</SelectItem>
                        <SelectItem value="욕설/비방">욕설/비방</SelectItem>
                        <SelectItem value="광고/스팸">광고/스팸</SelectItem>
                        <SelectItem value="부적절한 내용">부적절한 내용</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="submit" 
                      className="bg-red-500 hover:bg-red-600 w-24" 
                      disabled={isUpdating}
                    >
                      {isUpdating ? "수정 중..." : "수정"}
                    </Button>
                    <Button variant="outline" className="w-24" onClick={() => router.push('/admin/reviews')}>
                      닫기
                    </Button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="text-red-500 mb-4">
                리뷰 정보를 불러오는데 실패했습니다.
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/reviews")}
              >
                리뷰 목록으로 돌아가기
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

