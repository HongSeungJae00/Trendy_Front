"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin-ui/admin-table";
import { Button } from "@/components/admin-ui/admin-button";
import { Input } from "@/components/admin-ui/admin-input";
import { ChevronDown, Plus, FileText, Trash, Search } from "lucide-react";
import { useRouter } from "next/navigation";
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

const brandOptions = ["전체", "나이키", "뉴발란스", "리복", "아식스", "아디다스"];

// 상품 타입 정의 추가
interface Product {
  id: string;
  brand: string;
  name: string;
  number: string;
  size: string;
  gender: string;
  stock: string;
  quantity: number;
  price: number;
}

export function ProductTable() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<string>("전체");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 상품 데이터 불러오기
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/admin/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) throw new Error("상품 데이터를 불러오는데 실패했습니다.");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("상품 데이터를 불러오는데 실패했습니다.", error);
    }
  };

  // 상품 데이터 삭제
  const deleteProducts = async (productIds: string[]) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/products`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: productIds }),
      });
      if (!response.ok) throw new Error("상품 데이터를 삭제하는데 실패했습니다.");
      setProducts((prev) => prev.filter((product) => !productIds.includes(product.id)));
      setSelectedProducts([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("상품 데이터를 삭제하는데 실패했습니다.", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      products.map(({ id, ...rest }: Product) => rest)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "상품 데이터");
    XLSX.writeFile(workbook, `상품내역_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleCheckboxChange = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedProducts(products.map((product: any) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const filteredProducts = products
    .filter(
      (product: any) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.number.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product: any) => sortOption === "전체" || product.brand === sortOption);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs w-[120px]">
              {sortOption}
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[120px] min-w-[120px]">
            {brandOptions.map((brand) => (
              <DropdownMenuItem
                key={brand}
                className="text-xs px-3 py-2"
                onClick={() => setSortOption(brand)}
              >
                {brand}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="상품명 또는 상품번호 검색"
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
          onClick={() => router.push("/admin/products/register")}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={selectedProducts.length === 0}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-red-500">
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  onChange={handleSelectAll}
                  checked={selectedProducts.length === products.length && products.length > 0}
                />
              </TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">브랜드명</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">상품명</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">상품번호</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">사이즈</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">성별</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">품절여부</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">수량</TableHead>
              <TableHead className="text-white text-xs bg-red-500 hover:bg-red-500">판매 금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product: any) => (
              <TableRow
                key={product.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => router.push(`/admin/products/edit/${product.id}`)}
              >
                <TableCell className="text-xs" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                </TableCell>
                <TableCell className="text-xs">{product.brand}</TableCell>
                <TableCell className="text-xs">{product.name}</TableCell>
                <TableCell className="text-xs">{product.number}</TableCell>
                <TableCell className="text-xs">{product.size}</TableCell>
                <TableCell className="text-xs">{product.gender}</TableCell>
                <TableCell className="text-xs">{product.stock}</TableCell>
                <TableCell className="text-xs">{product.quantity}</TableCell>
                <TableCell className="text-xs">{product.price}</TableCell>
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
              이 작업은 되돌릴 수 없습니다. 선택한 상품이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => deleteProducts(selectedProducts)} className="bg-red-500 hover:bg-red-600">
              삭제
            </AlertDialogAction>
            <AlertDialogCancel>취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
