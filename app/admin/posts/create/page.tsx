"use client"

import { useState } from "react"
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

interface PostForm {
  title: string
  category: string
  content: string
  author: string
  createdAt: string
}

export default function CreatePostPage() {
  const router = useRouter()
  const [isRegistering, setIsRegistering] = useState(false)
  const [formData, setFormData] = useState<PostForm>({
    title: "",
    category: "",
    content: "",
    author: "",
    createdAt: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(`${apiUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("게시글 등록에 실패했습니다")

      alert("게시글이 성공적으로 등록되었습니다")
      router.push("/admin/posts")
    } catch (error) {
      console.error("게시글 등록 오류:", error)
      alert("게시글 등록에 실패했습니다")
    } finally {
      setIsRegistering(false)
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
          <h1 className="text-lg font-bold mb-6">게시글 등록</h1>
          <form id="postForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input 
                id="title"
                placeholder="게시글 제목을 입력하세요"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select 
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notice">공지사항</SelectItem>
                  <SelectItem value="event">이벤트</SelectItem>
                  <SelectItem value="info">안내</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea 
                id="content"
                placeholder="게시글 내용을 입력하세요"
                className="min-h-[200px] resize-none"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">작성자</Label>
              <Input 
                id="author"
                placeholder="작성자 이름을 입력하세요"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="createdAt">작성일</Label>
              <Input 
                id="createdAt"
                type="date"
                value={formData.createdAt}
                onChange={(e) => setFormData(prev => ({ ...prev, createdAt: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button 
                type="submit" 
                className="bg-red-500 hover:bg-red-600 w-24"
                disabled={isRegistering}
              >
                {isRegistering ? "등록 중..." : "등록"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/admin/posts')}
                className="w-24"
              >
                닫기
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

