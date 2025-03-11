"use client";

import { useState, useEffect, useMemo } from "react";
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

interface Inspection {
  id: string;
  productNumber: string;
  productName: string;
  productType: string;
  arrivalStatus: string;
  status: string;
  inspector: string;
  inspectionDate: string;
  result: string;
}

export function InspectionTable() {
  const router = useRouter();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [selectedInspections, setSelectedInspections] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const response = await fetch(`${apiUrl}/api/inspection`);
        if (!response.ok) {
          throw new Error("검수 데이터를 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setInspections(data);
      } catch (error) {
        console.error("검수 데이터를 불러오는데 실패했습니다.", error);
      }
    };

    fetchInspections();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      inspections.map(({ id, ...rest }) => rest)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "검수 데이터");
    XLSX.writeFile(workbook, `검수내역_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedInspections(inspections.map((inspection) => inspection.id));
    } else {
      setSelectedInspections([]);
    }
  };

  const handleSelectInspection = (inspectionId: string) => {
    setSelectedInspections((prev) =>
      prev.includes(inspectionId) ? prev.filter((id) => id !== inspectionId) : [...prev, inspectionId]
    );
  };

  const filteredInspections = useMemo(() => {
    return inspections.filter(
      (inspection) =>
        inspection.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.productNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inspections, searchTerm]);

  const deleteInspections = async (inspectionIds: string[]) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/inspection`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: inspectionIds }),
      });

      if (!response.ok) {
        throw new Error("검수 데이터 삭제에 실패했습니다.");
      }

      setInspections(prev => prev.filter(inspection => !inspectionIds.includes(inspection.id)));
      setSelectedInspections([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("검수 데이터 삭제에 실패했습니다.", error);
    }
  };

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
            <DropdownMenuItem className="text-xs px-3 py-2">상품번호</DropdownMenuItem>
            <DropdownMenuItem className="text-xs px-3 py-2">상품명</DropdownMenuItem>
            <DropdownMenuItem className="text-xs px-3 py-2">상태</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="상품명 또는 검수자 검색"
            className="pl-8 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={exportToExcel}>
          <FileText className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push("/admin/inspection/register")}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={selectedInspections.length === 0}
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
                  checked={selectedInspections.length === inspections.length && inspections.length > 0}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-white text-xs">상품번호</TableHead>
              <TableHead className="text-white text-xs">상품명</TableHead>
              <TableHead className="text-white text-xs">상품유형</TableHead>
              <TableHead className="text-white text-xs">도착여부</TableHead>
              <TableHead className="text-white text-xs">상태</TableHead>
              <TableHead className="text-white text-xs">검수자</TableHead>
              <TableHead className="text-white text-xs">검수일</TableHead>
              <TableHead className="text-white text-xs">결과</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInspections.map((inspection) => (
              <TableRow
                key={inspection.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push(`/admin/inspection/edit/${inspection.id}`)}
              >
                <TableCell className="text-xs">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedInspections.includes(inspection.id)}
                    onChange={() => handleSelectInspection(inspection.id)}
                  />
                </TableCell>
                <TableCell className="text-xs">{inspection.productNumber}</TableCell>
                <TableCell className="text-xs">{inspection.productName}</TableCell>
                <TableCell className="text-xs">{inspection.productType}</TableCell>
                <TableCell className="text-xs">{inspection.arrivalStatus}</TableCell>
                <TableCell className="text-xs">{inspection.status}</TableCell>
                <TableCell className="text-xs">{inspection.inspector}</TableCell>
                <TableCell className="text-xs">{inspection.inspectionDate}</TableCell>
                <TableCell className="text-xs">{inspection.result}</TableCell>
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
              이 작업은 되돌릴 수 없습니다. 선택한 검수 항목이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => deleteInspections(selectedInspections)} className="bg-red-500 hover:bg-red-600">
              삭제
            </AlertDialogAction>
            <AlertDialogCancel>취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
