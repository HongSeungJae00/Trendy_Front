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

interface Post {
  id: number
  title: string
  category: string
  content: string
  author: string
  createdAt: string
  views: number
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [post, setPost] = useState<Post | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
        const response = await fetch(`${apiUrl}/api/posts/${params.id}`)

        if (!response.ok) {
          throw new Error("게시글 정보를 불러오는데 실패했습니다.")
        }

        const data: Post = await response.json()
        setPost(data)
      } catch (error: any) {
        console.error("게시글 정보를 가져오는 중 오류 발생:", error)
      }
    }

    fetchPostDetails()
  }, [params.id])

  const handleUpdate = async (updatedInfo: Partial<Post>) => {
    setIsUpdating(true)
    try {
      const completeData = { ...post, ...updatedInfo } as Post
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      const response = await fetch(`${apiUrl}/api/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      })

      if (!response.ok) {
        throw new Error("게시글 정보 업데이트에 실패했습니다.")
      }

      toast.success("게시글이 성공적으로 업데이트되었습니다.")
      router.push("/admin/posts")
    } catch (error) {
      console.error("게시글 정보 업데이트 오류:", error)
      toast.error("게시글 정보 업데이트에 실패했습니다.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (post) {
      handleUpdate(post)
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
          {post ? (
            <>
              <h1 className="text-lg font-bold mb-6">게시글 수정</h1>
              <form id="postForm" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">제목</Label>
                  <Input 
                    id="title"
                    value={post.title}
                    onChange={(e) => setPost(prev => prev ? { ...prev, title: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select 
                    value={post.category}
                    onValueChange={(value) => setPost(prev => prev ? { ...prev, category: value } : null)}
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
                    className="min-h-[200px] resize-none"
                    value={post.content}
                    onChange={(e) => setPost(prev => prev ? { ...prev, content: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">작성자</Label>
                  <Input 
                    id="author"
                    value={post.author}
                    onChange={(e) => setPost(prev => prev ? { ...prev, author: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="createdAt">작성일</Label>
                  <Input 
                    id="createdAt"
                    type="date"
                    value={post.createdAt}
                    onChange={(e) => setPost(prev => prev ? { ...prev, createdAt: e.target.value } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="views">조회수</Label>
                  <Input 
                    id="views"
                    type="number"
                    value={post.views}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
              </form>
              <div className="flex justify-end gap-4 mt-6">
                <Button 
                  type="submit" 
                  form="postForm" 
                  className="bg-red-500 hover:bg-red-600 w-24"
                  disabled={isUpdating}
                >
                  {isUpdating ? "수정 중..." : "수정"}
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
            </>
          ) : (
            <div className="text-center p-6">
              <div className="text-red-500 mb-4">
                게시글 정보를 불러오는데 실패했습니다.
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/posts")}
              >
                게시글 목록으로 돌아가기
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

