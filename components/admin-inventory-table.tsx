"use client";

import { useState, useMemo, useEffect } from "react";
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

interface InventoryItem {
  id: string;
  brand: string;
  name: string;
  productNumber: string;
  location: string;
  quantity: number;
  size: string;
  stockStatus: string;
  status: string;
}

export function InventoryTable() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string | null>(null);

  // API 호출: 재고 데이터 불러오기
  const fetchInventory = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/inventory`);
      if (!response.ok) {
        throw new Error("재고 데이터를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      console.error("재고 데이터를 불러오는데 실패했습니다.", error);
    }
  };

  // API 호출: 선택된 재고 삭제
  const deleteInventoryItems = async (itemIds: string[]) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/inventory`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: itemIds }),
      });
      if (!response.ok) {
        throw new Error("재고 데이터를 삭제하는데 실패했습니다.");
      }
      setInventory((prev) => prev.filter((item) => !itemIds.includes(item.id)));
      setSelectedItems([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("재고 데이터를 삭제하는데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      inventory.map(({ id, ...rest }) => rest) // `id` 제외
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "재고 데이터");
    XLSX.writeFile(workbook, `재고내역_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(inventory.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSort = (option: string) => {
    const sortedInventory = [...inventory];
    if (option === "productNumber") {
      sortedInventory.sort((a, b) => a.productNumber.localeCompare(b.productNumber));
    } else if (option === "quantity") {
      sortedInventory.sort((a, b) => a.quantity - b.quantity);
    }
    setInventory(sortedInventory);
    setSortOption(option);
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

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
            <DropdownMenuItem onClick={() => handleSort("productNumber")} className="text-xs px-3 py-2">
              상품번호순
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("quantity")} className="text-xs px-3 py-2">
              재고량순
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="상품명 또는 SKU 검색"
            className="pl-8 text-xs"
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
          onClick={() => router.push("/admin/inventory/register/")}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={selectedItems.length === 0}
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
                  checked={selectedItems.length === inventory.length && inventory.length > 0}
                />
              </TableHead>
              <TableHead className="text-white text-xs">브랜드명</TableHead>
              <TableHead className="text-white text-xs">상품명</TableHead>
              <TableHead className="text-white text-xs">상품번호</TableHead>
              <TableHead className="text-white text-xs">위치</TableHead>
              <TableHead className="text-white text-xs">수량</TableHead>
              <TableHead className="text-white text-xs">사이즈</TableHead>
              <TableHead className="text-white text-xs">품절여부</TableHead>
              <TableHead className="text-white text-xs">상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push(`/admin/inventory/edit/${item.id}`)}
              >
                <TableCell className="text-xs">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                  />
                </TableCell>
                <TableCell className="text-xs">{item.brand}</TableCell>
                <TableCell className="text-xs">{item.name}</TableCell>
                <TableCell className="text-xs">{item.productNumber}</TableCell>
                <TableCell className="text-xs">{item.location}</TableCell>
                <TableCell className="text-xs">{item.quantity}</TableCell>
                <TableCell className="text-xs">{item.size}</TableCell>
                <TableCell className="text-xs">{item.stockStatus}</TableCell>
                <TableCell className="text-xs">{item.status}</TableCell>
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
              이 작업은 되돌릴 수 없습니다. 선택한 재고 항목이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => deleteInventoryItems(selectedItems)} className="bg-red-500 hover:bg-red-600">
              삭제
            </AlertDialogAction>
            <AlertDialogCancel>취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}