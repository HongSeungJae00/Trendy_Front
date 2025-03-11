"use client";

import { Button } from "@/components/admin-ui/admin-button";
import { Dialog, DialogContent } from "@/components/admin-ui/admin-dialog";
import { Input } from "@/components/admin-ui/admin-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin-ui/admin-select";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

interface SettlementDetailsDialogProps {
  open: boolean; // open으로 수정
  settlement: Settlement | null;
  onClose: () => void;
}

// API 호출 함수
const updateSettlement = async (settlement: Settlement): Promise<void> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const response = await fetch(`${apiUrl}/api/settlements/${settlement.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settlement),
  });
  if (!response.ok) {
    throw new Error("정산 데이터를 수정하는데 실패했습니다.");
  }
};

export function SettlementDetailsDialog({ open, settlement, onClose }: SettlementDetailsDialogProps) {
  if (!settlement) return null;

  const router = useRouter();
  const [editedSettlement, setEditedSettlement] = useState<Settlement | null>(settlement);
  const [isModified, setIsModified] = useState(false);

  const handleInputChange = (field: keyof Settlement, value: string) => {
    if (editedSettlement) {
      setEditedSettlement({ ...editedSettlement, [field]: value });
      setIsModified(true); // 수정 상태로 변경
    }
  };

  const handleEdit = async () => {
    if (editedSettlement) {
      try {
        await updateSettlement(editedSettlement);
        console.log("Changes saved:", editedSettlement);
        onClose();
        router.push("/admin/settlements");
      } catch (error) {
        console.error("정산 데이터를 수정하는데 실패했습니다.", error);
      }
    }
  };

  const handleClose = () => {
    if (!isModified) {
      console.log("변경 사항이 없습니다.");
    }
    onClose();
    router.push("/admin/settlements"); // 수정 여부와 상관없이 페이지 이동
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">정산 상세 정보</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm">판매자명</div>
            <Input
              value={editedSettlement?.sellerName || ""}
              onChange={(e) => handleInputChange("sellerName", e.target.value)}
              className="bg-gray-100 border-0"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm">상품명</div>
            <Input
              value={editedSettlement?.productName || ""}
              onChange={(e) => handleInputChange("productName", e.target.value)}
              className="bg-gray-100 border-0"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm">은행명</div>
            <Input
              value={editedSettlement?.bankName || ""}
              onChange={(e) => handleInputChange("bankName", e.target.value)}
              className="bg-gray-100 border-0"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm">계좌번호</div>
            <Input
              value={editedSettlement?.accountNumber || ""}
              onChange={(e) => handleInputChange("accountNumber", e.target.value)}
              className="bg-gray-100 border-0"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm">정산금액</div>
            <Input
              value={editedSettlement?.amount || ""}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              className="bg-gray-100 border-0"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm">정산일</div>
            <Input
              value={editedSettlement?.date || ""}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="bg-gray-100 border-0"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm">상태</div>
            <Select
              value={editedSettlement?.status || ""}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger className="bg-gray-100 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="정산완료">정산완료</SelectItem>
                <SelectItem value="정산대기">정산대기</SelectItem>
                <SelectItem value="정산중">정산중</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button
            onClick={handleEdit}
            className="w-20 bg-red-500 hover:bg-red-600 text-white"
          >
            수정
          </Button>
          <Button
            onClick={handleClose}
            className="w-20 bg-red-500 hover:bg-red-600 text-white"
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
