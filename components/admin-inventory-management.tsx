'use client';

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin-ui/admin-table";
import { Button } from "@/components/admin-ui/admin-button";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin-ui/admin-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/admin-ui/admin-dropdown-menu";

// 인터페이스 정의 추가
interface InventoryItem {
  code: string;
  name: string;
  location: string;
  size: string;
  stock: number;
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]); // 타입 지정
  const [sortOption, setSortOption] = useState<"최신순" | "오래된순" | "정렬">("정렬");

  // API 호출: 재고 데이터 가져오기
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

  useEffect(() => {
    fetchInventory();
  }, []);

  const sortInventory = (order: "최신순" | "오래된순") => {
    const sorted = [...inventory].sort((a: InventoryItem, b: InventoryItem) => {
      if (order === "최신순") {
        return a.code.localeCompare(b.code);
      } else if (order === "오래된순") {
        return b.code.localeCompare(a.code);
      }
      return 0;
    });
    setInventory(sorted);
    setSortOption(order);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold">재고 관리</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              {sortOption} {/* 버튼 텍스트를 선택한 정렬 옵션으로 표시 */}
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="text-xs px-3 py-2"
              onClick={(event) => {
                event.preventDefault(); // 기본 동작 방지
                sortInventory("최신순");
              }}
            >
              최신순
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs px-3 py-2"
              onClick={(event) => {
                event.preventDefault(); // 기본 동작 방지
                sortInventory("오래된순");
              }}
            >
              오래된순
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="h-[300px] overflow-auto">
        <Table className="border-l border-r border-b border-gray-200 rounded-lg overflow-hidden">
          <TableHeader>
            <TableRow className="bg-red-500">
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">상품번호</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">상품명</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">위치</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">사이즈</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">수량</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item: InventoryItem) => (
              <TableRow key={item.code} className="border-b border-gray-200 last:border-b-0">
                <TableCell className="text-xs">{item.code}</TableCell>
                <TableCell className="text-xs">{item.name}</TableCell>
                <TableCell className="text-xs">{item.location}</TableCell>
                <TableCell className="text-xs">{item.size}</TableCell>
                <TableCell className="text-xs">{item.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
