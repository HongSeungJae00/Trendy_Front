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

type SortOption = "date" | "amount" | "status";

interface Order {
  id: string;
  date: string;
  customer: string;
  productType: string;
  productName: string;
  quantity: number;
  amount: number;
  paymentStatus: string;
  approvalStatus: string;
}

export function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("date");
  const router = useRouter();

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
    } catch (error) {
      console.error("주문 데이터를 불러오는데 실패했습니다.", error);
    }
  };

  // API 호출: 주문 삭제
  const deleteOrders = async (orderIds: string[]) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: orderIds }),
      });
      if (!response.ok) {
        throw new Error("주문 데이터를 삭제하는데 실패했습니다.");
      }
      setOrders((prev) => prev.filter((order) => !orderIds.includes(order.id)));
      setSelectedOrders([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("주문 데이터를 삭제하는데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      orders.map(({ id, date, customer, productType, productName, quantity, amount, paymentStatus, approvalStatus }) => ({
        주문번호: id,
        주문일: date,
        고객명: customer,
        상품유형: productType,
        상품명: productName,
        수량: quantity,
        총액: `${amount.toLocaleString()}원`,
        결제상태: paymentStatus,
        승인상태: approvalStatus,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "주문 데이터");
    XLSX.writeFile(workbook, `주문내역_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const filteredOrders = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return orders
      .filter(
        (order) =>
          order.id.toLowerCase().includes(lowerSearchTerm) ||
          order.customer.toLowerCase().includes(lowerSearchTerm)
      )
      .sort((a, b) => {
        if (sortOption === "date") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortOption === "amount") {
          return b.amount - a.amount;
        }
        if (sortOption === "status") {
          return a.paymentStatus.localeCompare(b.paymentStatus);
        }
        return 0;
      });
  }, [orders, searchTerm, sortOption]);

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
            <DropdownMenuItem onClick={() => setSortOption("date")} className="text-xs px-3 py-2">
              주문일순
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("amount")} className="text-xs px-3 py-2">
              금액순
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("status")} className="text-xs px-3 py-2">
              상태순
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="주문번호 또는 고객명 검색"
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
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={selectedOrders.length === 0}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-red-500 hover:bg-red-500">
              <TableHead className="text-white text-xs w-[30px]">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-white text-xs hover:bg-red-500">주문일</TableHead>
              <TableHead className="text-white text-xs hover:bg-red-500">주문번호</TableHead>
              <TableHead className="text-white text-xs hover:bg-red-500">고객명</TableHead>
              <TableHead className="text-white text-xs hover:bg-red-500">상품유형</TableHead>
              <TableHead className="text-white text-xs hover:bg-red-500">상품명</TableHead>
              <TableHead className="text-white text-xs hover:bg-red-500">수량</TableHead>
              <TableHead className="text-white text-xs hover:bg-red-500">총액</TableHead>
              <TableHead className="text-white text-xs hover:bg-red-500">결제상태</TableHead>
              <TableHead className="text-white text-xs hover:bg-red-500">승인상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push(`/admin/orders/${order.id}`)}
              >
                <TableCell className="text-xs" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                  />
                </TableCell>
                <TableCell className="text-xs">{order.date}</TableCell>
                <TableCell className="text-xs">{order.id}</TableCell>
                <TableCell className="text-xs">{order.customer}</TableCell>
                <TableCell className="text-xs">{order.productType}</TableCell>
                <TableCell className="text-xs">{order.productName}</TableCell>
                <TableCell className="text-xs">{order.quantity}</TableCell>
                <TableCell className="text-xs">{`${order.amount.toLocaleString()}원`}</TableCell>
                <TableCell className="text-xs">{order.paymentStatus}</TableCell>
                <TableCell className="text-xs">{order.approvalStatus}</TableCell>
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
              이 작업은 되돌릴 수 없습니다. 선택한 주문이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => deleteOrders(selectedOrders)} className="bg-red-500 hover:bg-red-600">
              삭제
            </AlertDialogAction>
            <AlertDialogCancel>취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
