'use client'

import { useState, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImagePlus } from 'lucide-react'
import { Popup } from './Popup'

interface ProductFormData {
  productName: string;
  productNumber: string;
  brand: string;
  gender: string;
  color: string;
  size: string;
  price: string;
}

export function ProductForm() {
  const [isInitialPopupOpen, setIsInitialPopupOpen] = useState(true)
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false)
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    productNumber: '',
    brand: '',
    gender: '',
    color: '',
    size: '',
    price: '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegisterPopupOpen(true)
  }

  const handleRegisterConfirm = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/register-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('상품 등록에 실패했습니다.')
      }

      const result = await response.json()
      console.log('상품이 성공적으로 등록되었습니다:', result)
      setIsRegisterPopupOpen(false)
      // 여기에 성공 후 로직 (예: 폼 초기화, 성공 메시지 표시 등)
    } catch (error) {
      console.error('상품 등록 중 오류 발생:', error)
      // 여기에 오류 처리 로직
    }
  }

  const handleCancelClick = () => {
    setIsCancelPopupOpen(true)
  }

  const handleCancelConfirm = () => {
    setFormData({
      productName: '',
      productNumber: '',
      brand: '',
      gender: '',
      color: '',
      size: '',
      price: '',
    })
    setIsCancelPopupOpen(false)
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle the selected file here
      console.log('Selected file:', file.name);
      // You can add more logic here, such as uploading the file or updating the UI
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4">
              <div 
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 h-[200px] cursor-pointer"
                onClick={handleImageClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">이미지 등록</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div 
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 h-[200px] cursor-pointer"
                onClick={handleImageClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
                <div className="text-center">
                  <p className="text-sm text-gray-600">이미지 등록</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="productName" className="font-bold">상품명</Label>
            <Input 
              id="productName" 
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder="상품명을 입력하세요" 
            />
          </div>

          <div>
            <Label htmlFor="productNumber" className="font-bold">상품번호</Label>
            <Input 
              id="productNumber" 
              name="productNumber"
              value={formData.productNumber}
              onChange={handleInputChange}
              placeholder="상품번호를 입력하세요" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-bold">브랜드명</Label>
              <Select onValueChange={handleSelectChange('brand')}>
                <SelectTrigger>
                  <SelectValue placeholder="브랜드 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nike">나이키</SelectItem>
                  <SelectItem value="adidas">아디다스</SelectItem>
                  <SelectItem value="newbalance">뉴발란스</SelectItem>
                  <SelectItem value="asics">아식스</SelectItem>
                  <SelectItem value="reebok">리복</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-bold">성별</Label>
              <Select onValueChange={handleSelectChange('gender')}>
                <SelectTrigger>
                  <SelectValue placeholder="성별 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                  <SelectItem value="unisex">공용</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="font-bold">컬러</Label>
              <Select onValueChange={handleSelectChange('color')}>
                <SelectTrigger>
                  <SelectValue placeholder="컬러 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-black" />
                      블랙
                    </div>
                  </SelectItem>
                  <SelectItem value="white">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-white border border-gray-200" />
                      화이트
                    </div>
                  </SelectItem>
                  <SelectItem value="grey">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-500" />
                      그레이
                    </div>
                  </SelectItem>
                  <SelectItem value="blue">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      블루
                    </div>
                  </SelectItem>
                  <SelectItem value="red">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-500" />
                      레드
                    </div>
                  </SelectItem>
                  <SelectItem value="purple">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-500" />
                      퍼플
                    </div>
                  </SelectItem>
                  <SelectItem value="brown">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-800" />
                      브라운
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-white" />
                      기타
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="font-bold">사이즈</Label>
            <Select onValueChange={handleSelectChange('size')}>
              <SelectTrigger>
                <SelectValue placeholder="사이즈 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="230">230mm</SelectItem>
                <SelectItem value="240">240mm</SelectItem>
                <SelectItem value="250">250mm</SelectItem>
                <SelectItem value="260">260mm</SelectItem>
                <SelectItem value="270">270mm</SelectItem>
                <SelectItem value="280">280mm</SelectItem>
                <SelectItem value="290">290mm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price" className="font-bold">판매금액</Label>
            <Input 
              id="price" 
              name="price"
              type="number" 
              value={formData.price}
              onChange={handleInputChange}
              placeholder="판매금액을 입력하세요" 
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50" onClick={handleCancelClick}>취소</Button>
          <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">등록</Button>
        </div>
      </form>

      <Popup 
        isOpen={isInitialPopupOpen} 
        onClose={() => setIsInitialPopupOpen(false)}
        onConfirm={() => setIsInitialPopupOpen(false)}
        title="상품 등록 시 주의사항"
        confirmText="확인"
        cancelText="닫기"
      >
        <div className="text-sm text-muted-foreground">
          <ul className="list-disc pl-5 space-y-2">
            <li>모든 필수 항목을 빠짐없이 입력해주세요.</li>
            <li>상품 이미지는 정확하고 선명한 사진을 사용해주세요.</li>
            <li>상품 설명은 정확하고 상세하게 작성해주세요.</li>
            <li>가격 정보를 정확히 입력해주세요.</li>
            <li>재고 수량을 정확히 입력해주세요.</li>
            <li>브랜드 정보가 있다면 반드시 입력해주세요.</li>
            <li>상품의 사이즈와 색상 정보를 정확히 입력해주세요.</li>
            <li>허위 정보 입력 시 불이익이 있을 수 있습니다.</li>
          </ul>
        </div>
      </Popup>

      <Popup 
        isOpen={isRegisterPopupOpen} 
        onClose={() => setIsRegisterPopupOpen(false)}
        onConfirm={handleRegisterConfirm}
        title="상품 등록 확인"
        confirmText="등록"
        cancelText="취소"
      >
        <div className="text-sm text-muted-foreground">
          <p>입력하신 정보로 상품을 등록하시겠습니까?</p>
        </div>
      </Popup>

      <Popup 
        isOpen={isCancelPopupOpen} 
        onClose={() => setIsCancelPopupOpen(false)}
        onConfirm={handleCancelConfirm}
        title="상품 등록 취소"
        confirmText="확인"
        cancelText="돌아가기"
      >
        <div className="text-sm text-muted-foreground">
          <p>상품 등록을 취소하시겠습니까? 입력한 정보는 저장되지 않습니다.</p>
        </div>
      </Popup>
    </div>
  )
}

