"use client";

import { useState } from "react";
import { Input } from "@/components/admin-ui/admin-input";
import { Label } from "@/components/admin-ui/admin-label";
import { Textarea } from "@/components/admin-ui/admin-textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin-ui/admin-select";
import { Button } from "@/components/admin-ui/admin-button";

interface InventoryEditFormProps {
    inventoryId: string;
    initialData: {
        brand: string;
        name: string;
        productNumber: string;
        color: string;
        size: string;
        quantity: number;
        warehouseLocation: string;
        stockStatus: string;
        inventoryLocation: string;
        inventoryStatus: string;
        notes: string;
};
    onUpdate: (updatedInfo: any) => void;
    isUpdating: boolean;
}

export function InventoryEditForm({
    inventoryId,
    initialData,
    onUpdate,
    isUpdating,
}: InventoryEditFormProps) {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
};

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
};

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <div>
            <Label htmlFor="brand">브랜드명</Label>
            <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
            />
            </div>
            <div>
            <Label htmlFor="name">상품명</Label>
            <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
            />
            </div>
            <div>
            <Label htmlFor="productNumber">상품번호</Label>
            <Input
                id="productNumber"
                value={formData.productNumber}
                onChange={(e) => handleChange("productNumber", e.target.value)}
            />
            </div>
            <div>
            <Label htmlFor="color">색상</Label>
            <Select
                value={formData.color}
                onValueChange={(value) => handleChange("color", value)}
            >
                <SelectTrigger id="color">
                <SelectValue placeholder="색상 선택" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="black">블랙</SelectItem>
                <SelectItem value="white">화이트</SelectItem>
                <SelectItem value="gray">그레이</SelectItem>
                <SelectItem value="blue">블루</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div>
            <Label htmlFor="size">사이즈</Label>
            <Input
                id="size"
                value={formData.size}
                onChange={(e) => handleChange("size", e.target.value)}
            />
            </div>
            <div>
            <Label htmlFor="quantity">수량</Label>
            <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", parseInt(e.target.value))}
            />
            </div>
            <div>
            <Label htmlFor="warehouseLocation">창고 위치</Label>
            <Input
                id="warehouseLocation"
                value={formData.warehouseLocation}
                onChange={(e) => handleChange("warehouseLocation", e.target.value)}
            />
            </div>
            <div>
            <Label htmlFor="stockStatus">재고 상태</Label>
            <Select
                value={formData.stockStatus}
                onValueChange={(value) => handleChange("stockStatus", value)}
            >
                <SelectTrigger id="stockStatus">
                <SelectValue placeholder="재고 상태 선택" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="in-stock">재고 있음</SelectItem>
                <SelectItem value="out-of-stock">품절</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div>
            <Label htmlFor="inventoryLocation">재고 위치</Label>
            <Input
                id="inventoryLocation"
                value={formData.inventoryLocation}
                onChange={(e) => handleChange("inventoryLocation", e.target.value)}
            />
            </div>
            <div>
            <Label htmlFor="inventoryStatus">재고 상태</Label>
            <Select
                value={formData.inventoryStatus}
                onValueChange={(value) => handleChange("inventoryStatus", value)}
            >
                <SelectTrigger id="inventoryStatus">
                <SelectValue placeholder="재고 상태 선택" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="normal">정상</SelectItem>
                <SelectItem value="damaged">손상됨</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>
        <div>
            <Label htmlFor="notes">비고</Label>
            <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            />
        </div>
        <div className="flex justify-end gap-2">
            <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 w-24"
            disabled={isUpdating}
            >
            {isUpdating ? "수정 중..." : "수정"}
            </Button>
        </div>
        </form>
    );
}
