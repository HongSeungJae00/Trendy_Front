"use client";

import { useState } from "react";
import { Input } from "@/components/admin-ui/admin-input";
import { Label } from "@/components/admin-ui/admin-label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/admin-ui/admin-select";
import { ImagePlus } from 'lucide-react';
import { Button } from "@/components/admin-ui/admin-button";

interface InventoryForm {
    name: string;
    productNumber: string;
    quantity: number;
    warehouseLocation: string;
    stockStatus: string;
    inventoryLocation: string;
    inventoryStatus: string;
    brand: string;
    color: string;
    size: string;
    }

interface InventoryRegistrationFormProps {
    onRegister: (inventoryData: InventoryForm) => void;
}

export function InventoryRegistrationForm({ onRegister }: InventoryRegistrationFormProps) {
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [inventoryData, setInventoryData] = useState<InventoryForm>({
        name: "",
        productNumber: "",
        quantity: 0,
        warehouseLocation: "",
        stockStatus: "",
        inventoryLocation: "",
        inventoryStatus: "",
        brand: "",
        color: "",
        size: "",
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setMainImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInventoryData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof InventoryForm, value: string) => {
        setInventoryData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister(inventoryData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
            <div className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center relative max-w-[300px] max-h-[300px]">
            {mainImage ? (
                <div className="relative w-full h-full">
                <img src={mainImage} alt="Main inventory" className="w-full h-full object-contain" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setMainImage(null)}
                >
                    삭제
                </Button>
                </div>
            ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                <ImagePlus className="h-8 w-8 mb-2 text-gray-400" />
                <span className="text-sm text-gray-500">이미지 등록</span>
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                </label>
            )}
            </div>

            <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="name">상품명</Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="상품명을 입력하세요"
                    className="text-sm"
                    onChange={handleInputChange}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="productNumber">상품번호</Label>
                <Input
                    id="productNumber"
                    name="productNumber"
                    placeholder="상품번호를 입력하세요"
                    className="text-sm"
                    onChange={handleInputChange}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="quantity">수량</Label>
                <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    defaultValue="0"
                    className="text-sm"
                    onChange={handleInputChange}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="warehouseLocation">창고 위치</Label>
                <Input
                    id="warehouseLocation"
                    name="warehouseLocation"
                    placeholder="창고 위치를 입력하세요"
                    className="text-sm"
                    onChange={handleInputChange}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="brand">브랜드명</Label>
                <Select
                    onValueChange={(value) => handleSelectChange("brand", value)}
                >
                    <SelectTrigger id="brand" className="text-sm">
                    <SelectValue placeholder="브랜드 선택" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="nike">나이키</SelectItem>
                    <SelectItem value="adidas">아디다스</SelectItem>
                    <SelectItem value="newbalance">뉴발란스</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className="space-y-2">
                <Label htmlFor="color">컬러</Label>
                <Select
                    onValueChange={(value) => handleSelectChange("color", value)}
                >
                    <SelectTrigger id="color" className="text-sm">
                    <SelectValue placeholder="컬러 선택" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="black">블랙</SelectItem>
                    <SelectItem value="white">화이트</SelectItem>
                    <SelectItem value="gray">그레이</SelectItem>
                    <SelectItem value="blue">블루</SelectItem>
                    <SelectItem value="red">레드</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className="space-y-2">
                <Label htmlFor="size">사이즈</Label>
                <Select
                    onValueChange={(value) => handleSelectChange("size", value)}
                >
                    <SelectTrigger id="size" className="text-sm">
                    <SelectValue placeholder="사이즈 선택" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="230">230</SelectItem>
                    <SelectItem value="240">240</SelectItem>
                    <SelectItem value="250">250</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className="space-y-2">
                <Label htmlFor="stockStatus">품절 여부</Label>
                <Select
                    onValueChange={(value) => handleSelectChange("stockStatus", value)}
                >
                    <SelectTrigger id="stockStatus" className="text-sm">
                    <SelectValue placeholder="재고 상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="in-stock">재고 있음</SelectItem>
                    <SelectItem value="out-of-stock">품절</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className="space-y-2">
                <Label htmlFor="inventoryLocation">재고 위치</Label>
                <Input
                    id="inventoryLocation"
                    name="inventoryLocation"
                    placeholder="재고 위치를 입력하세요"
                    className="text-sm"
                    onChange={handleInputChange}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="inventoryStatus">재고 상태</Label>
                <Select
                    onValueChange={(value) => handleSelectChange("inventoryStatus", value)}
                >
                    <SelectTrigger id="inventoryStatus" className="text-sm">
                    <SelectValue placeholder="재고 상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="normal">정상</SelectItem>
                    <SelectItem value="damaged">손상됨</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>
            </div>
        </div>
        </form>
    );
}
