"use client";

import { useState } from "react";
import { Input } from "@/components/admin-ui/admin-input";
import { Label } from "@/components/admin-ui/admin-label";
import { Textarea } from "@/components/admin-ui/admin-textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin-ui/admin-select";
import { Button } from "@/components/admin-ui/admin-button";

interface PickupEditFormProps {
    pickupId: string;
    initialData: {
    orderNumber: string;
    customerName: string;
    productNumber: string;
    productName: string;
    productType: string;
    pickupLocation: string;
    pickupDate: string;
    status: string;
    notes: string;
};
    onUpdate: (updatedInfo: any) => void;
    isUpdating: boolean;
}

export function PickupEditForm({ pickupId, initialData, onUpdate, isUpdating }: PickupEditFormProps) {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
};

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
};

    return (
        <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label htmlFor="orderNumber">주문번호</Label>
            <Input id="orderNumber" value={formData.orderNumber} readOnly />
            </div>
            <div className="space-y-2">
            <Label htmlFor="customerName">고객명</Label>
            <Input id="customerName" value={formData.customerName} readOnly />
            </div>
            <div className="space-y-2">
            <Label htmlFor="productNumber">상품번호</Label>
            <Input id="productNumber" value={formData.productNumber} readOnly />
            </div>
            <div className="space-y-2">
            <Label htmlFor="productName">상품명</Label>
            <Input id="productName" value={formData.productName} readOnly />
            </div>
            <div className="space-y-2">
            <Label htmlFor="productType">상품유형</Label>
            <Select value={formData.productType} onValueChange={(value) => handleChange("productType", value)}>
                <SelectTrigger id="productType">
                <SelectValue placeholder="상품유형 선택" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="일반상품">일반상품</SelectItem>
                <SelectItem value="리셀상품">리셀상품</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div className="space-y-2">
            <Label htmlFor="pickupLocation">픽업장소</Label>
            <Input
                id="pickupLocation"
                value={formData.pickupLocation}
                onChange={(e) => handleChange("pickupLocation", e.target.value)}
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="pickupDate">픽업일</Label>
            <Input
                id="pickupDate"
                type="date"
                value={formData.pickupDate}
                onChange={(e) => handleChange("pickupDate", e.target.value)}
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="status">픽업상태</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status">
                <SelectValue placeholder="픽업상태 선택" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="픽업대기">픽업대기</SelectItem>
                <SelectItem value="픽업중">픽업중</SelectItem>
                <SelectItem value="픽업완료">픽업완료</SelectItem>
                <SelectItem value="픽업취소">픽업취소</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="notes">비고</Label>
            <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="추가 정보를 입력하세요"
            className="min-h-[100px]"
            />
        </div>
        <div className="flex justify-end gap-2">
            <Button type="submit" className="bg-red-500 hover:bg-red-600 w-24" disabled={isUpdating}>
            {isUpdating ? "수정 중..." : "수정"}
            </Button>
        </div>
        </form>
    );
}
