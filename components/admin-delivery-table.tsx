"use client"

import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin-ui/admin-table"
import { Button } from "@/components/admin-ui/admin-button"
import { Input } from "@/components/admin-ui/admin-input"
import * as XLSX from "xlsx"
import { RefreshCw, FileText, Trash, ChevronDown, Search } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/admin-ui/admin-dropdown-menu"
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/admin-ui/admin-alert-dialog"

type Delivery = {
  id: string;
  customer: string;
  address: string;
  courier: string;
  trackingNumber: string;
  deliveryDate: string;
  status: string;
  productType: string;
  pickupLocation: string;
  pickupDate: string;
  productName: string;
};

type SortOption = "id" | "newest" | "oldest" | "deliveryStatus" | "pickupStatus";

interface DeliveryTableProps {
  setPageTitle?: (title: string) => void;
  isResell?: boolean;
}

export function DeliveryTable({ setPageTitle, isResell = false }: DeliveryTableProps) {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDeliveries, setSelectedDeliveries] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // API 호출: 배송 데이터 가져오기
  const fetchDeliveries = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/delivery`);
      if (!response.ok) {
        throw new Error("배송 데이터를 가져오는 데 실패했습니다.");
      }
      const data = await response.json();
      setDeliveries(data);
    } catch (error) {
      console.error(error);
    }
  };

  // API 호출: 선택된 배송 데이터 삭제
  const deleteDeliveries = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/delivery`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedDeliveries }),
      });
      if (!response.ok) {
        throw new Error("배송 데이터를 삭제하는 데 실패했습니다.");
      }
      setDeliveries((prev) => prev.filter((delivery) => !selectedDeliveries.includes(delivery.id)));
      setSelectedDeliveries([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const sortedDeliveries = useMemo(() => {
    return [...deliveries]
      .filter(delivery => 
        delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.customer.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortOption) {
          case "id":
            return a.id.localeCompare(b.id);
          case "newest":
            return new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime();
          case "oldest":
            return new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime();
          case "deliveryStatus":
            return a.status.localeCompare(b.status);
          case "pickupStatus":
            return a.status.localeCompare(b.status);
          default:
            return 0;
        }
      });
  }, [deliveries, sortOption, searchTerm]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedDeliveries(sortedDeliveries.map(delivery => delivery.id));
    } else {
      setSelectedDeliveries([]);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      deliveries.map(({ id, ...rest }) => rest)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "배송 데이터");
    XLSX.writeFile(workbook, `배송내역_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleSelectDelivery = (e: React.MouseEvent, deliveryId: string) => {
    e.stopPropagation();
    setSelectedDeliveries((prev) =>
      prev.includes(deliveryId)
        ? prev.filter(id => id !== deliveryId)
        : [...prev, deliveryId]
    );
  };

  const handleNormalDelivery = () => {
    if (setPageTitle) {
      setPageTitle("배송 관리 [일반]");
    }
    router.push('/admin/delivery');
  };

  const handleResellDelivery = () => {
    if (setPageTitle) {
      setPageTitle("배송 관리 [리셀]");
    }
    router.push('/admin/delivery/iida');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs w-[120px]">
              정렬
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[120px] min-w-[120px]">
            <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("id")}>주문번호순</DropdownMenuItem>
            <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("newest")}>최신순</DropdownMenuItem>
            <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("oldest")}>오래된순</DropdownMenuItem>
            {isResell ? (
              <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("pickupStatus")}>픽업상태</DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-xs px-3 py-2" onClick={() => setSortOption("deliveryStatus")}>배송상태</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-2 flex-1 w-full">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="주문번호 또는 고객명 검색" 
              className="text-xs pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white flex-shrink-0"
              onClick={exportToExcel}
          >
              <FileText className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white flex-shrink-0 flex items-center gap-2"
            onClick={handleResellDelivery}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-xs">리셀</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white flex-shrink-0 flex items-center gap-2"
            onClick={handleNormalDelivery}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-xs">일반</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white flex-shrink-0"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={selectedDeliveries.length === 0}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-red-500">
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500 w-[30px]">
                <input 
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selectedDeliveries.length === sortedDeliveries.length && sortedDeliveries.length > 0}
                  onChange={handleSelectAll}
                />
              </TableHead>
              {isResell ? (
                <>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">주문번호</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">고객명</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">상품번호</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">상품명</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">픽업장소</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">픽업일</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">픽업상태</TableHead>
                </>
              ) : (
                <>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">주문번호</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">고객명</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">배송지</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">택배사</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">운송장번호</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">배송일</TableHead>
                  <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">배송상태</TableHead>
                </>
              )}
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">상품유형</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDeliveries.map((delivery) => (
              <TableRow 
                key={delivery.id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => isResell ? router.push(`/admin/delivery/pickup/${delivery.id}`) : router.push(`/admin/delivery/${delivery.id}`)}
              >
                <TableCell className="text-xs" onClick={(e) => handleSelectDelivery(e, delivery.id)}>
                  <input 
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedDeliveries.includes(delivery.id)}
                    readOnly
                  />
                </TableCell>
                {isResell ? (
                  <>
                    <TableCell className="text-xs">{delivery.id}</TableCell>
                    <TableCell className="text-xs">{delivery.customer}</TableCell>
                    <TableCell className="text-xs">{delivery.id}</TableCell>
                    <TableCell className="text-xs">{delivery.productName}</TableCell>
                    <TableCell className="text-xs">{delivery.pickupLocation}</TableCell>
                    <TableCell className="text-xs">{delivery.pickupDate}</TableCell>
                    <TableCell className="text-xs">{delivery.status}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="text-xs">{delivery.id}</TableCell>
                    <TableCell className="text-xs">{delivery.customer}</TableCell>
                    <TableCell className="text-xs">{delivery.address}</TableCell>
                    <TableCell className="text-xs">{delivery.courier}</TableCell>
                    <TableCell className="text-xs">{delivery.trackingNumber}</TableCell>
                    <TableCell className="text-xs">{delivery.deliveryDate}</TableCell>
                    <TableCell className="text-xs">{delivery.status}</TableCell>
                  </>
                )}
                <TableCell className="text-xs">{delivery.productType}</TableCell>
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
              이 작업은 되돌릴 수 없습니다. 선택한 배송 항목이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={deleteDeliveries} className="bg-red-500 hover:bg-red-600">삭제</AlertDialogAction>
            <AlertDialogCancel>취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
