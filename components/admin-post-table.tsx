"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin-ui/admin-table";
import { Button } from "@/components/admin-ui/admin-button";
import { Input } from "@/components/admin-ui/admin-input";
import { ChevronDown, FileText, Plus, Trash, Search } from "lucide-react";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/admin-ui/admin-dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/admin-ui/admin-alert-dialog";

type SortOption = "title" | "category" | "author";

interface Post {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
  views: number;
  status?: string;
}

export function PostTable() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("title");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPosts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/posts`);
      if (!response.ok) {
        throw new Error("게시글 데이터를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("게시글 데이터를 불러오는데 실패했습니다.", error);
    }
  };

  const deletePosts = async (postIds: number[]) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/posts`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: postIds }),
      });
      if (!response.ok) {
        throw new Error("게시글 데이터를 삭제하는데 실패했습니다.");
      }
      setPosts((prev) => prev.filter((post) => !postIds.includes(post.id)));
      setSelectedPosts([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("게시글 데이터를 삭제하는데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      posts.map(({ id, ...rest }: Post) => rest)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "게시글 관리");
    XLSX.writeFile(workbook, `게시글내역_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPosts(posts.map((post) => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    setSelectedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleRowClick = (postId: number) => {
    router.push(`/admin/posts/edit/${postId}`);
  };

  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) =>
      [post.title.toLowerCase(), post.author.toLowerCase()].some((value) =>
        value.includes(searchTerm.toLowerCase())
      )
    );

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "title":
          return a.title.localeCompare(b.title);
        case "category":
          return a.category.localeCompare(b.category);
        case "author":
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });
  }, [posts, searchTerm, sortOption]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">게시글 관리</h1>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs w-[120px]">
              정렬
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[120px] min-w-[120px]">
            <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("title")}>
              제목순
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("category")}>
              카테고리순
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("author")}>
              작성자순
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="게시글 제목 또는 작성자 검색"
            className="text-xs pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" onClick={exportToExcel} className="h-8 w-8">
          <FileText className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/posts/create")} className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="h-8 w-8"
          disabled={selectedPosts.length === 0}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-red-500 hover:bg-red-500">
              <TableHead className="text-white text-xs">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  onChange={handleSelectAll}
                  checked={selectedPosts.length === posts.length && posts.length > 0}
                />
              </TableHead>
              <TableHead className="text-white text-xs">No</TableHead>
              <TableHead className="text-white text-xs">작성일</TableHead>
              <TableHead className="text-white text-xs">제목</TableHead>
              <TableHead className="text-white text-xs">카테고리</TableHead>
              <TableHead className="text-white text-xs">조회수</TableHead>
              <TableHead className="text-white text-xs">작성자</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(post.id)}>
                <TableCell className="text-xs" onClick={(e) => handleSelectPost(e, post.id)}>
                  <input type="checkbox" className="h-4 w-4" checked={selectedPosts.includes(post.id)} readOnly />
                </TableCell>
                <TableCell className="text-xs">{post.id}</TableCell>
                <TableCell className="text-xs">{post.date}</TableCell>
                <TableCell className="text-xs">{post.title}</TableCell>
                <TableCell className="text-xs">{post.category}</TableCell>
                <TableCell className="text-xs">{post.views.toLocaleString()}</TableCell>
                <TableCell className="text-xs">{post.author}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 선택한 게시글이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => deletePosts(selectedPosts)} className="bg-red-500 hover:bg-red-600">
              삭제
            </AlertDialogAction>
            <AlertDialogCancel>취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
