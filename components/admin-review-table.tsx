"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin-ui/admin-table";
import { Button } from "@/components/admin-ui/admin-button";
import { Input } from "@/components/admin-ui/admin-input";
import { ChevronDown, FileText, Trash, Search } from "lucide-react";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/admin-ui/admin-dropdown-menu";
import { useRouter } from "next/navigation";
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

interface Review {
  id: number;
  writer: string;
  userId: string;
  productName: string;
  content: string;
  date: string;
  status: string;
}

export function ReviewTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReviews, setSelectedReviews] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<"userId" | "date" | "status">("date");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const router = useRouter();

  // API: 리뷰 데이터 가져오기
  const fetchReviews = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/reviews`);
      if (!response.ok) {
        throw new Error("리뷰 데이터를 불러오는데 실패했습니다.");
      }
      const data: Review[] = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("리뷰 데이터를 불러오는데 실패했습니다.", error);
    }
  };

  // API: 선택된 리뷰 삭제
  const deleteReviews = async (ids: number[]) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) {
        throw new Error("리뷰 데이터를 삭제하는데 실패했습니다.");
      }
      // 성공적으로 삭제된 경우 로컬 상태 업데이트
      setReviews((prev) => prev.filter((review) => !ids.includes(review.id)));
      setSelectedReviews([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("리뷰 데이터를 삭제하는데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortOption) {
      case "userId":
        return a.userId.localeCompare(b.userId);
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      reviews.map(({ id, ...rest }) => rest) // id는 제외
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "리뷰 데이터");
    XLSX.writeFile(workbook, `리뷰내역_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedReviews(reviews.map((review) => review.id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelectReview = (e: React.MouseEvent, reviewId: number) => {
    e.stopPropagation();
    setSelectedReviews((prev) =>
      prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]
    );
  };

  const filteredReviews = sortedReviews.filter(
    (review) =>
      review.writer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs w-[120px]">
              정렬
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[120px] min-w-[120px]">
            <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("userId")}>
              아이디순
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("date")}>
              작성일순
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("status")}>
              신고대상순
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="작성자, 아이디 또는 상품명 검색"
            className="pl-8 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white"
          onClick={exportToExcel}
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={selectedReviews.length === 0}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-red-500">
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500 w-[30px]">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selectedReviews.length === reviews.length && reviews.length > 0}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">No</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">작성자</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">아이디</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">상품명</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">내용</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">작성일</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">신고대상</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow
                key={review.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push(`/admin/reviews/${review.id}`)}
              >
                <TableCell className="text-xs" onClick={(e) => handleSelectReview(e, review.id)}>
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedReviews.includes(review.id)}
                    readOnly
                  />
                </TableCell>
                <TableCell className="text-xs">{review.id}</TableCell>
                <TableCell className="text-xs">{review.writer}</TableCell>
                <TableCell className="text-xs">{review.userId}</TableCell>
                <TableCell className="text-xs">{review.productName}</TableCell>
                <TableCell className="text-xs">{review.content}</TableCell>
                <TableCell className="text-xs">{review.date}</TableCell>
                <TableCell className="text-xs">{review.status}</TableCell>
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
              이 작업은 되돌릴 수 없습니다. 선택한 리뷰가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => deleteReviews(selectedReviews)}
              className="bg-red-500 hover:bg-red-600"
            >
              삭제
            </AlertDialogAction>
            <AlertDialogCancel>취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
