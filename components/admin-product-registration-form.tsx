"use client"

import { useState } from "react"
import { Input } from "@/components/admin-ui/admin-input"
import { Label } from "@/components/admin-ui/admin-label"
import { Card } from "@/components/admin-ui/admin-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin-ui/admin-select"
import { ImagePlus } from 'lucide-react'
import { Button } from "@/components/admin-ui/admin-button"

interface ProductData {
  name: string;
  number: string;
  quantity: number;
  price: number;
  brand: string;
  gender: string;
  color: string;
  size: string;
}

interface ProductRegistrationFormProps {
  onRegister: (productData: ProductData) => void;
}

export function ProductRegistrationForm({ onRegister }: ProductRegistrationFormProps) {
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    number: "",
    quantity: 0,
    price: 0,
    brand: "",
    gender: "",
    color: "",
    size: "",
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRegister(productData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center relative max-w-[300px] max-h-[300px]">
          {mainImage ? (
            <div className="relative w-full h-full">
              <img src={mainImage} alt="Main product" className="w-full h-full object-contain" />
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
              <Input id="name" name="name" placeholder="상품명을 입력하세요" className="text-sm" onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">상품번호</Label>
              <Input id="number" name="number" placeholder="상품번호를 입력하세요" className="text-sm" onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">수량</Label>
              <Input id="quantity" name="quantity" type="number" defaultValue="0" className="text-sm" onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">판매금액</Label>
              <Input id="price" name="price" type="number" defaultValue="0" className="text-sm" onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">브랜드명</Label>
              <Select onValueChange={(value) => handleSelectChange("brand", value)}>
                <SelectTrigger id="brand" className="text-sm">
                  <SelectValue placeholder="브랜드 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nike">나이키</SelectItem>
                  <SelectItem value="adidas">아디다스</SelectItem>
                  <SelectItem value="newbalance">뉴발란스</SelectItem>
                  <SelectItem value="asics">아식스</SelectItem>
                  <SelectItem value="reebok">리복</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">성별</Label>
              <Select onValueChange={(value) => handleSelectChange("gender", value)}>
                <SelectTrigger id="gender" className="text-sm">
                  <SelectValue placeholder="성별 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                  <SelectItem value="unisex">공용</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">컬러</Label>
              <Select onValueChange={(value) => handleSelectChange("color", value)}>
                <SelectTrigger id="color" className="text-sm">
                  <SelectValue placeholder="컬러 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="블랙">블랙</SelectItem>
                  <SelectItem value="화이트">화이트</SelectItem>
                  <SelectItem value="그레이">그레이</SelectItem>
                  <SelectItem value="블루">블루</SelectItem>
                  <SelectItem value="레드">레드</SelectItem>
                  <SelectItem value="퍼플">퍼플</SelectItem>
                  <SelectItem value="브라운">브라운</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">사이즈</Label>
              <Select onValueChange={(value) => handleSelectChange("size", value)}>
                <SelectTrigger id="size" className="text-sm">
                  <SelectValue placeholder="사이즈 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="230">230</SelectItem>
                  <SelectItem value="240">240</SelectItem>
                  <SelectItem value="250">250</SelectItem>
                  <SelectItem value="260">260</SelectItem>
                  <SelectItem value="270">270</SelectItem>
                  <SelectItem value="280">280</SelectItem>
                  <SelectItem value="290">290</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

