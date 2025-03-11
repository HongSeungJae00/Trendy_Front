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
import { SaleDetailsDialog } from "@/components/admin-sales-details-dialog";
import { useRouter } from "next/navigation";

interface SaleData {
  id: number;
  rank: number;
  productName: string;
  category: string;
  price: string;
  quantity: number;
  monthlyRevenue: string;
  totalSales: string;
}

type SortOption = "productName" | "quantity" | "totalSales";

export function SalesTable() {
  const [sales, setSales] = useState<SaleData[]>([]);
  const [selectedSales, setSelectedSales] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("totalSales");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleData | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const router = useRouter();

  // API: 매출 데이터 가져오기
  const fetchSalesData = async () => {
    try {
      const response = await fetch("/api/sales");
      if (!response.ok) throw new Error("Failed to fetch sales data");
      const data: SaleData[] = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  // API: 선택한 매출 데이터 삭제
  const deleteSalesData = async (ids: number[]) => {
    try {
      const response = await fetch("/api/sales", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) throw new Error("Failed to delete sales data");
      // 성공 시 로컬 상태 업데이트
      setSales((prev) => prev.filter((sale) => !ids.includes(sale.id)));
      setSelectedSales([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting sales data:", error);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedSales(sales.map((sale) => sale.id));
    } else {
      setSelectedSales([]);
    }
  };

  const exportTableToExcel = () => {
    const excelData = sales.map((sale) => ({
      순위: sale.rank,
      상품명: sale.productName,
      카테고리: sale.category,
      상품금액: sale.price,
      판매수량: sale.quantity,
      월매출: sale.monthlyRevenue,
      총매출: sale.totalSales,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "매출내역");

    XLSX.writeFile(wb, `매출내역_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleSelectSale = (saleId: number) => {
    setSelectedSales((prev) =>
      prev.includes(saleId) ? prev.filter((id) => id !== saleId) : [...prev, saleId]
    );
  };

  const handleRowClick = (sale: SaleData) => {
    setSelectedSale(sale);
    setIsDetailsDialogOpen(true);
  };

  const filteredSales = sales.filter((sale) =>
    sale.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAndFilteredSales = filteredSales.sort((a, b) => {
    switch (sortOption) {
      case "productName":
        return a.productName.localeCompare(b.productName);
      case "quantity":
        return b.quantity - a.quantity;
      case "totalSales":
        return (
          parseInt(b.totalSales.replace(/[^0-9]/g, ""), 10) -
          parseInt(a.totalSales.replace(/[^0-9]/g, ""), 10)
        );
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      {/* Control Panel */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs w-[120px]">
              정렬
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[120px] min-w-[120px]">
            <DropdownMenuItem
              className="text-xs px-3 py-2"
              onClick={() => setSortOption("productName")}
            >
              상품명순
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs px-3 py-2"
              onClick={() => setSortOption("quantity")}
            >
              판매수량순
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs px-3 py-2"
              onClick={() => setSortOption("totalSales")}
            >
              매출액순
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="상품명 검색"
            className="pl-8 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white"
          onClick={exportTableToExcel}
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={selectedSales.length === 0}
        >
          <Trash className="h-4 w-4" />
        </Button>
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
                  checked={
                    selectedSales.length === sales.length && sales.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">
                순위
              </TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">
                상품명
              </TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">
                카테고리
              </TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">
                상품금액
              </TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">
                판매 수량
              </TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">
                총 매출금액
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredSales.map((sale, index) => (
              <TableRow
                key={sale.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(sale)}
              >
                <TableCell className="text-xs">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedSales.includes(sale.id)}
                    onChange={() => handleSelectSale(sale.id)}
                  />
                </TableCell>
                <TableCell className="text-xs">{index + 1}</TableCell>
                <TableCell className="text-xs">{sale.productName}</TableCell>
                <TableCell className="text-xs">{sale.category}</TableCell>
                <TableCell className="text-xs">{sale.price}</TableCell>
                <TableCell className="text-xs">{sale.quantity}</TableCell>
                <TableCell className="text-xs">{sale.totalSales}</TableCell>
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
              이 작업은 되돌릴 수 없습니다. 선택한 매출 데이터가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => deleteSalesData(selectedSales)}
              className="bg-red-500 hover:bg-red-600"
            >
              삭제
            </AlertDialogAction>
            <AlertDialogCancel>취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <SaleDetailsDialog
        sale={selectedSale}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />
    </div>
  );
}
