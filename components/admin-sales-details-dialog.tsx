import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/admin-ui/admin-dialog";
import { Button } from "@/components/admin-ui/admin-button";
import { Input } from "@/components/admin-ui/admin-input";
import { Label } from "@/components/admin-ui/admin-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin-ui/admin-select";
import { useEffect, useState } from "react";

interface SalesData {
  id: number;
  rank: number;
  productName: string;
  category: string;
  price: string;
  quantity: number;
  monthlyRevenue: string;
  totalSales: string;
}

interface SaleDetailsDialogProps {
  sale: SalesData | null;
  isOpen: boolean;
  onClose: () => void;
}

const fetchSaleDetails = async (saleId: number): Promise<SalesData> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const response = await fetch(`${apiUrl}/api/sales/${saleId}`);
  if (!response.ok) {
    throw new Error("매출 데이터를 불러오는데 실패했습니다.");
  }
  return response.json();
};

export function SaleDetailsDialog({ sale, isOpen, onClose }: SaleDetailsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sale && isOpen) {
      const loadSaleDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          await fetchSaleDetails(sale.id);
        } catch (err) {
          setError("매출 데이터를 불러오는데 실패했습니다.");
        } finally {
          setLoading(false);
        }
      };
      loadSaleDetails();
    }
  }, [sale, isOpen]);

  if (!isOpen || !sale) return null;

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-500">Error</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-red-500">{error}</div>
          <DialogFooter className="flex justify-end gap-2 mt-6">
            <Button
              onClick={onClose}
              className="w-20 bg-red-500 hover:bg-red-600 text-white"
            >
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-black">매출 상세 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rank" className="text-sm">순위</Label>
            <Input id="rank" value={sale.rank} readOnly className="bg-gray-100 border-0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-sm">상품명</Label>
            <Input id="productName" value={sale.productName} readOnly className="bg-gray-100 border-0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">카테고리</Label>
            <Input id="category" value={sale.category} readOnly className="bg-gray-100 border-0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm">상품금액</Label>
            <Input id="price" value={sale.price} readOnly className="bg-gray-100 border-0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm">판매 수량</Label>
            <Input id="quantity" value={sale.quantity.toString()} readOnly className="bg-gray-100 border-0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyRevenue" className="text-sm">월 매출금액</Label>
            <Input id="monthlyRevenue" value={sale.monthlyRevenue} readOnly className="bg-gray-100 border-0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalSales" className="text-sm">총 매출금액</Label>
            <Input id="totalSales" value={sale.totalSales} readOnly className="bg-gray-100 border-0" />
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2 mt-6">
          <Button
            onClick={onClose}
            className="w-20 bg-red-500 hover:bg-red-600 text-white"
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
