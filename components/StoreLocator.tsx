'use client'

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

export default function StoreLocator() {
  return (
    <Card className="p-6">
      <div className="flex gap-4 mb-6">
        <Input 
          placeholder="매장명 또는 지역을 검색하세요" 
          className="flex-1"
        />
        <Button variant="outline">
          <Search className="h-4 w-4 mr-2" />
          검색
        </Button>
      </div>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <h3 className="font-medium">강남 플래그십 스토어</h3>
          <p className="text-sm text-gray-600 mt-1">서울특별시 강남구 강남대로 123</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">영업시간: 10:30 - 22:00</p>
            <Button variant="link" size="sm">상세정보</Button>
          </div>
        </div>
        {/* 더 많은 매장 정보... */}
      </div>
    </Card>
  )
}

