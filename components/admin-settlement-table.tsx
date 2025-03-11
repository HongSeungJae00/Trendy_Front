"use client";

import { useState, useMemo, useEffect } from "react";
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
import { SettlementDetailsDialog } from "./admin-settlement-details-dialog";

type SortOption = "date" | "amount" | "status";

interface Settlement {
  id: number;
  sellerName: string;
  productName: string;
  bankName: string;
  accountNumber: string;
  amount: string;
  date: string;
  status: string;
}

// API 호출 함수
const fetchSettlements = async (): Promise<Settlement[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const response = await fetch(`${apiUrl}/api/settlements`); // API 엔드포인트
  if (!response.ok) {
    throw new Error("정산 데이터를 불러오는데 실패했습니다.");
  }
  return response.json();
};

const deleteSettlements = async (ids: number[]): Promise<void> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const response = await fetch(`${apiUrl}/api/settlements`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) {
    throw new Error("정산 데이터를 삭제하는데 실패했습니다.");
  }
};

export function SettlementTable() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [selectedSettlements, setSelectedSettlements] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("date");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchSettlements();
        setSettlements(data);
      } catch (error) {
        console.error("정산 데이터를 불러오는데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedSettlements(settlements.map((settlement) => settlement.id));
    } else {
      setSelectedSettlements([]);
    }
  };

  const handleSelectSettlement = (settlementId: number) => {
    setSelectedSettlements((prev) =>
      prev.includes(settlementId)
        ? prev.filter((id) => id !== settlementId)
        : [...prev, settlementId]
    );
  };

  const handleExcelDownload = () => {
    const excelData = settlements.map((settlement) => ({
      번호: settlement.id,
      판매자명: settlement.sellerName,
      상품명: settlement.productName,
      은행명: settlement.bankName,
      계좌번호: settlement.accountNumber,
      정산금액: settlement.amount,
      정산일: settlement.date,
      상태: settlement.status,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "정산내역");
    XLSX.writeFile(wb, `정산내역_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleDelete = async () => {
    try {
      await deleteSettlements(selectedSettlements);
      setSettlements((prev) =>
        prev.filter((settlement) => !selectedSettlements.includes(settlement.id))
      );
      setSelectedSettlements([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete settlements:", error);
    }
  };

  const sortedAndFilteredSettlements = useMemo(() => {
    const filtered = settlements.filter((settlement) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        settlement.sellerName.toLowerCase().includes(searchLower) ||
        settlement.productName.toLowerCase().includes(searchLower)
      );
    });

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "amount":
          return (
            parseInt(b.amount.replace(/[^0-9]/g, "")) -
            parseInt(a.amount.replace(/[^0-9]/g, ""))
          );
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [settlements, searchTerm, sortOption]);

  const handleRowClick = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
        <>
          {/* Control Panel */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs w-[120px]">
                  정렬
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[120px] min-w-[120px]">
                <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("date")}>
                  날짜순
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("amount")}>
                  금액순
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("status")}>
                  상태순
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2 flex-1 w-full">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="판매자명 또는 상품명 검색"
                  className="text-xs pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white"
                onClick={handleExcelDownload}
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={selectedSettlements.length === 0}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-red-500">
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500 w-[30px]">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectedSettlements.length === settlements.length && settlements.length > 0}
                      onChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">No</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">판매자명</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">상품명</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">은행명</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">계좌번호</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">정산금액</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">정산일</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredSettlements.map((settlement) => (
                  <TableRow
                    key={settlement.id}
                    className="cursor-pointer"
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName !== 'INPUT') {
                        handleRowClick(settlement);
                      }
                    }}
                  >
                    <TableCell className="text-xs">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedSettlements.includes(settlement.id)}
                        onChange={() => handleSelectSettlement(settlement.id)}
                      />
                    </TableCell>
                    <TableCell className="text-xs">{settlement.id}</TableCell>
                    <TableCell className="text-xs">{settlement.sellerName}</TableCell>
                    <TableCell className="text-xs">{settlement.productName}</TableCell>
                    <TableCell className="text-xs">{settlement.bankName}</TableCell>
                    <TableCell className="text-xs">{settlement.accountNumber}</TableCell>
                    <TableCell className="text-xs">{settlement.amount}</TableCell>
                    <TableCell className="text-xs">{settlement.date}</TableCell>
                    <TableCell className="text-xs">{settlement.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <SettlementDetailsDialog
            open={isDetailsDialogOpen}
            settlement={selectedSettlement}
            onClose={() => setIsDetailsDialogOpen(false)}
          />
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                이 작업은 되돌릴 수 없습니다. 선택한 매출 데이터가 영구적으로 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                  삭제
                </AlertDialogAction>
                <AlertDialogCancel>취소</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
    </div>
  );
}
