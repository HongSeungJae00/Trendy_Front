"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/admin-site-header"
import { MainNav } from "@/components/admin-main-nav"
import { Button } from "@/components/admin-ui/admin-button"
import { Input } from "@/components/admin-ui/admin-input"
import { Textarea } from "@/components/admin-ui/admin-textarea"
import { Label } from "@/components/admin-ui/admin-label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin-ui/admin-select"
import { Trash2, User, Shield } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/admin-ui/admin-alert-dialog"
import { toast } from "@/components/ui/use-toast"

interface Comment {
  id: number
  author: string
  content: string
  timestamp: string
  isAdmin?: boolean
}

interface Inquiry {
  id: number
  title: string
  category: string
  content: string
  author: string
  date: string
  status: string
  comments: Comment[]
}

export default function InquiryDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [newComment, setNewComment] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null)

  useEffect(() => {
    const fetchInquiryDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const response = await fetch(`${apiUrl}/api/inquiries/${params.id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("문의사항 정보를 불러오는데 실패했습니다.")
        }

        const data = await response.json()
        setInquiry(data)
        setError(null)
      } catch (error) {
        console.error("문의사항 정보 조회 오류:", error)
      }
    }

    fetchInquiryDetails()
  }, [params.id])

  const handleAddComment = async () => {
    if (!newComment.trim() || !inquiry) return
    setIsUpdating(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(`${apiUrl}/api/inquiries/${params.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          isAdmin: true
        }),
      })

      if (!response.ok) {
        throw new Error("댓글 추가에 실패했습니다.")
      }

      const newCommentData = await response.json()
      setInquiry(prev => ({
        ...prev!,
        comments: [...prev!.comments, newCommentData]
      }))
      setNewComment("")
    } catch (error) {
      console.error("댓글 추가 오류:", error)
      toast({
        title: "댓글 추가 실패",
        description: "댓글을 추가하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    setCommentToDelete(commentId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteComment = async () => {
    if (commentToDelete === null || !inquiry) return
    setIsUpdating(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(
        `${apiUrl}/api/inquiries/${params.id}/comments/${commentToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        throw new Error("댓글 삭제에 실패했습니다.")
      }

      setInquiry(prev => ({
        ...prev!,
        comments: prev!.comments.filter(comment => comment.id !== commentToDelete)
      }))
      setIsDeleteDialogOpen(false)
      setCommentToDelete(null)
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
      toast({
        title: "댓글 삭제 실패",
        description: "댓글을 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSave = async () => {
    if (!inquiry) return
    setIsUpdating(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(`${apiUrl}/api/inquiries/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiry),
      })

      if (!response.ok) {
        throw new Error("문의사항 업데이트에 실패했습니다.")
      }

      toast({
        title: "저장 완료",
        description: "문의사항이 성공적으로 수정되었습니다.",
      })
      router.push('/admin/inquiries')
    } catch (error) {
      console.error("문의사항 업데이트 오류:", error)
      toast({
        title: "저장 실패",
        description: "문의사항을 수정하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const iconClasses = "h-5 w-5"
  const circleClasses = "rounded-full p-1.5 flex items-center justify-center"

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
          {inquiry ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">제목</Label>
                  <Input id="title" value={inquiry.title} readOnly />
                </div>
                
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select defaultValue={inquiry.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="배송문의">배송문의</SelectItem>
                      <SelectItem value="환불문의">환불문의</SelectItem>
                      <SelectItem value="상품문의">상품문의</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content">내용</Label>
                  <Textarea 
                    id="content" 
                    value={inquiry.content}
                    className="min-h-[200px]"
                    readOnly
                  />
                </div>

                <div>
                  <Label htmlFor="author">작성자</Label>
                  <Input id="author" value={inquiry.author} readOnly />
                </div>

                <div>
                  <Label htmlFor="date">작성일</Label>
                  <Input id="date" type="text" value={inquiry.date} readOnly />
                </div>

                <div>
                  <Label htmlFor="status">상태</Label>
                  <Select defaultValue={inquiry.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="답변대기">답변대기</SelectItem>
                      <SelectItem value="답변완료">답변완료</SelectItem>
                      <SelectItem value="답변중">답변중</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-6 border-t bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-bold mb-4">댓글</h2>
                <div className="space-y-4">
                  {inquiry.comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className="p-4 rounded-lg border relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {comment.isAdmin ? (
                            <div className={`${circleClasses} bg-gray-100`}>
                              <User className={`${iconClasses} text-gray-500`} />
                            </div>
                          ) : (
                            <div className={`${circleClasses} bg-gray-100`}>
                              <User className={`${iconClasses} text-gray-500`} />
                            </div>
                          )}
                          <span className="font-bold text-black">{comment.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-black">{comment.timestamp}</span>
                          {comment.isAdmin && (
                            <button 
                              className="text-gray-400 hover:text-red-500"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-black ml-9">{comment.content}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 relative">
                  <Textarea
                    placeholder="댓글을 입력하세요"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-2 pr-24"
                  />
                  <Button 
                    onClick={handleAddComment}
                    className="bg-red-500 hover:bg-red-600 absolute bottom-2 right-2"
                  >
                    댓글 추가
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  className="bg-red-500 hover:bg-red-600"
                  size="lg"
                  onClick={handleSave}
                >
                  저장
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/admin/inquiries')}
                  size="lg"
                >
                  닫기
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-6">
              <div className="text-red-500 mb-4">
                문의사항 정보를 불러오는데 실패했습니다.
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/inquiries")}
              >
                문의사항 목록으로 돌아가기
              </Button>
            </div>
          )}
        </main>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>댓글을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 댓글이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={confirmDeleteComment} className="bg-red-500 hover:bg-red-600">
              삭제
            </AlertDialogAction>
            <AlertDialogCancel>취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

