import { Input } from "@/components/admin-ui/admin-input"
import { Label } from "@/components/admin-ui/admin-label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin-ui/admin-card"

export function PostForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>게시글 관리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="postTitle">게시글 제목</Label>
          <Input id="postTitle" placeholder="게시글 제목을 입력하세요" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">작성자</Label>
          <Input id="author" placeholder="작성자를 입력하세요" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postDate">게시일</Label>
          <Input id="postDate" placeholder="게시일을 입력하세요" />
        </div>
      </CardContent>
    </Card>
  )
}

