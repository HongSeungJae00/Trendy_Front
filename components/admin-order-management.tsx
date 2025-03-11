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

interface Order {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  amount: string;
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortOption, setSortOption] = useState<"최신순" | "오래된순" | "정렬">("정렬");
  const [error, setError] = useState<string | null>(null);

  // API 호출: 주문 데이터 가져오기
  const fetchOrders = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/orders`);
      if (!response.ok) {
        throw new Error("주문 데이터를 불러오는데 실패했습니다.");
      }
      const data = await response.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "데이터 로드 중 문제가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 정렬 함수
  const sortOrders = (orderType: "최신순" | "오래된순") => {
    const sorted = [...orders].sort((a, b) => {
      if (orderType === "최신순") {
        return a.id.localeCompare(b.id); // id 오름차순
      } else if (orderType === "오래된순") {
        return b.id.localeCompare(a.id); // id 내림차순
      }
      return 0;
    });
    setOrders(sorted);
    setSortOption(orderType);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold">주문 및 결제 관리</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="text-xs">
              {sortOption}
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="text-xs px-3 py-2"
              onClick={(e) => {
                e.preventDefault();
                sortOrders("최신순");
              }}
            >
              최신순
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs px-3 py-2"
              onClick={(e) => {
                e.preventDefault();
                sortOrders("오래된순");
              }}
            >
              오래된순
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-red-500 text-sm">에러: {error}</p>
        ) : (
          <Table className="border-l border-r border-b border-gray-200 rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="bg-red-500">
                <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">주문번호</TableHead>
                <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">고객명</TableHead>
                <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">상품명</TableHead>
                <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">수량</TableHead>
                <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">총액</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-b border-gray-200 last:border-b-0">
                  <TableCell className="text-xs">{order.id}</TableCell>
                  <TableCell className="text-xs">{order.customer}</TableCell>
                  <TableCell className="text-xs">{order.product}</TableCell>
                  <TableCell className="text-xs">{order.quantity}</TableCell>
                  <TableCell className="text-xs">{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
