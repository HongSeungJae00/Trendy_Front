"use client";

import { useState } from "react";
import { Input } from "@/components/admin-ui/admin-input";
import { Label } from "@/components/admin-ui/admin-label";
import { Textarea } from "@/components/admin-ui/admin-textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/admin-ui/admin-select";
import { Button } from "@/components/admin-ui/admin-button";

interface InspectionDetails {
    productNumber: string;
    productName: string;
    color: string;
    size: string;
    status: string;
    result: string;
    inspectionDate: string;
    inspector: string;
    notes: string;
}

interface InspectionEditFormProps {
    inspectionId: string;
    initialData: InspectionDetails;
    onUpdate: (updatedData: InspectionDetails) => Promise<void>;
    isUpdating: boolean;
}

export function InspectionEditForm({
    inspectionId,
    initialData,
    onUpdate,
    isUpdating,
}: InspectionEditFormProps) {
    const [formData, setFormData] = useState<InspectionDetails>(initialData);

    const handleChange = (field: keyof InspectionDetails, value: string) => {
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
            <Label htmlFor="productNumber">상품번호</Label>
            <Input
                id="productNumber"
                value={formData.productNumber}
                onChange={(e) => handleChange("productNumber", e.target.value)}
            />
            </div>
            <div>
            <Label htmlFor="productName">상품명</Label>
            <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => handleChange("productName", e.target.value)}
            />
            </div>
            <div>
            <Label htmlFor="color">컬러</Label>
            <Select
                value={formData.color}
                onValueChange={(value) => handleChange("color", value)}
            >
                <SelectTrigger id="color">
                <SelectValue placeholder="컬러 선택" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="black">블랙</SelectItem>
                <SelectItem value="white">화이트</SelectItem>
                <SelectItem value="gray">그레이</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div>
            <Label htmlFor="size">사이즈</Label>
            <Select
                value={formData.size}
                onValueChange={(value) => handleChange("size", value)}
            >
                <SelectTrigger id="size">
                <SelectValue placeholder="사이즈 선택" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="230">230</SelectItem>
                <SelectItem value="240">240</SelectItem>
                <SelectItem value="250">250</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div>
            <Label htmlFor="status">상태</Label>
            <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
            >
                <SelectTrigger id="status">
                <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="waiting">검수대기</SelectItem>
                <SelectItem value="completed">검수완료</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div>
            <Label htmlFor="result">결과</Label>
            <Select
                value={formData.result}
                onValueChange={(value) => handleChange("result", value)}
            >
                <SelectTrigger id="result">
                <SelectValue placeholder="결과 선택" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="pass">합격</SelectItem>
                <SelectItem value="fail">불합격</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <div>
            <Label htmlFor="inspectionDate">검수일</Label>
            <Input
                id="inspectionDate"
                type="date"
                value={formData.inspectionDate}
                onChange={(e) => handleChange("inspectionDate", e.target.value)}
            />
            </div>
            <div>
            <Label htmlFor="inspector">검수자</Label>
            <Input
                id="inspector"
                value={formData.inspector}
                onChange={(e) => handleChange("inspector", e.target.value)}
            />
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
            <Button type="submit" className="bg-red-500 hover:bg-red-600">
            {isUpdating ? "수정 중..." : "수정"}
            </Button>
        </div>
        </form>
    );
}
