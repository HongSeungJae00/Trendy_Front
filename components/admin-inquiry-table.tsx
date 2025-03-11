"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

interface Inquiry {
  id: number;
  date: string;
  title: string;
  category: string;
  author: string;
  status: string;
}

export function InquiryTable() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiries, setSelectedInquiries] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // API: 문의사항 데이터 가져오기
  const fetchInquiriesData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/inquiries`); // API 엔드포인트
      if (!response.ok) {
        throw new Error("문의사항 데이터를 불러오는데 실패했습니다.");
      }
      const data: Inquiry[] = await response.json();
      setInquiries(data);
    } catch (error) {
      console.error("문의사항 데이터를 불러오는데 실패했습니다.", error);
    }
  };

  // API: 선택된 문의사항 삭제
  const deleteInquiriesData = async (ids: number[]) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/inquiries`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) {
        throw new Error("문의사항 데이터를 삭제하는데 실패했습니다.");
      }
      // 성공적으로 삭제된 경우 로컬 상태 업데이트
      setInquiries((prev) => prev.filter((inquiry) => !ids.includes(inquiry.id)));
      setSelectedInquiries([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("문의사항 데이터를 삭제하는데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchInquiriesData();
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedInquiries(inquiries.map((inquiry) => inquiry.id));
    } else {
      setSelectedInquiries([]);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      inquiries.map(({ id, ...rest }) => rest) // `id` 제외
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inquiries");
    XLSX.writeFile(workbook, `문의사항내역_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleSelectInquiry = (e: React.MouseEvent, inquiryId: number) => {
    e.stopPropagation();
    setSelectedInquiries((prev) =>
      prev.includes(inquiryId) ? prev.filter((id) => id !== inquiryId) : [...prev, inquiryId]
    );
  };

  const handleRowClick = (inquiryId: number) => {
    router.push(`/admin/inquiries/${inquiryId}`);
  };

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      (selectedCategory ? inquiry.category === selectedCategory : true) &&
      (inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.author.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSelectedCategory("배송")}>
              배송문의
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSelectedCategory("환불")}>
              환불문의
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSelectedCategory("상품")}>
              상품문의
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="제목 또는 작성자 검색"
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
          disabled={selectedInquiries.length === 0}
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
                  checked={selectedInquiries.length === inquiries.length && inquiries.length > 0}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">No</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">작성일</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">제목</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">카테고리</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">작성자</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInquiries.map((inquiry, index) => (
              <TableRow
                key={inquiry.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(inquiry.id)}
              >
                <TableCell className="text-xs" onClick={(e) => handleSelectInquiry(e, inquiry.id)}>
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedInquiries.includes(inquiry.id)}
                    readOnly
                  />
                </TableCell>
                <TableCell className="text-xs">{index + 1}</TableCell>
                <TableCell className="text-xs">{inquiry.date}</TableCell>
                <TableCell className="text-xs">{inquiry.title}</TableCell>
                <TableCell className="text-xs">{inquiry.category}</TableCell>
                <TableCell className="text-xs">{inquiry.author}</TableCell>
                <TableCell className="text-xs">{inquiry.status}</TableCell>
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
              이 작업은 되돌릴 수 없습니다. 선택한 문의사항이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => deleteInquiriesData(selectedInquiries)}
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
