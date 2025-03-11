"use client";

import { useState, useMemo, useEffect } from "react";
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

type SortOption = "name" | "id" | "joinDate" | "status";

interface Member {
  id: string;
  name: string;
  password: string;
  nickname: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  status: string;
}

export function MemberTable() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchMembers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/members`);
      if (!response.ok) {
        throw new Error("회원 데이터를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("회원 데이터를 불러오는데 실패했습니다.", error);
    }
  };

  const deleteMembers = async (memberIds: string[]) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: memberIds }),
      });
      if (!response.ok) {
        throw new Error("회원 데이터를 삭제하는데 실패했습니다.");
      }
      setMembers((prev) => prev.filter((member) => !memberIds.includes(member.id)));
      setSelectedMembers([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("회원 데이터를 삭제하는데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      members.map(({ password, ...rest }) => rest)
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "회원 데이터");
    XLSX.writeFile(workbook, `회원내역_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedMembers(members.map((member) => member.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleCheckboxChange = (e: React.MouseEvent, memberId: string) => {
    e.stopPropagation();
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      switch (sortOption) {
        case "name":
          return a.name.localeCompare(b.name);
        case "id":
          return a.id.localeCompare(b.id);
        case "joinDate":
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [members, sortOption]);

  const filteredMembers = sortedMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase())
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
            <DropdownMenuItem onClick={() => setSortOption("name")} className="text-xs px-3 py-2">
              이름순
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("id")} className="text-xs px-3 py-2">
              아이디순
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("joinDate")} className="text-xs px-3 py-2">
              가입일순
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("status")} className="text-xs px-3 py-2">
              상태순
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="회원 검색"
            className="text-xs pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={exportToExcel}>
          <FileText className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={selectedMembers.length === 0}
          onClick={() => setIsDeleteDialogOpen(true)}
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
                  checked={selectedMembers.length === members.length && members.length > 0}
                />
              </TableHead>
              <TableHead className="text-white text-xs">이름</TableHead>
              <TableHead className="text-white text-xs">아이디</TableHead>
              <TableHead className="text-white text-xs">닉네임</TableHead>
              <TableHead className="text-white text-xs">이메일</TableHead>
              <TableHead className="text-white text-xs">가입일</TableHead>
              <TableHead className="text-white text-xs">상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow
                key={member.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push(`/admin/members/${member.id}`)}
              >
                <TableCell className="text-xs" onClick={(e) => handleCheckboxChange(e, member.id)}>
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedMembers.includes(member.id)}
                    readOnly
                  />
                </TableCell>
                <TableCell className="text-xs">{member.name}</TableCell>
                <TableCell className="text-xs">{member.id}</TableCell>
                <TableCell className="text-xs">{member.nickname}</TableCell>
                <TableCell className="text-xs">{member.email}</TableCell>
                <TableCell className="text-xs">{member.joinDate}</TableCell>
                <TableCell className="text-xs">{member.status}</TableCell>
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
              이 작업은 되돌릴 수 없습니다. 선택한 회원 정보가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => deleteMembers(selectedMembers)} className="bg-red-500 hover:bg-red-600">
              삭제
            </AlertDialogAction>
            <AlertDialogCancel>취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
