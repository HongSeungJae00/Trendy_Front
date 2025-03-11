'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search } from 'lucide-react'

interface Notice {
  type: string
  title: string
  date: string
  content: string
}

export function NoticeBoard() {
  const [notices] = useState<Notice[]>([
    {
      type: "이벤트",
      title: "[안내] DRAW - 아기 볼캡 & 팜파 단독 응모",
      date: "2024.12.15",
      content: "12월 2주차 DRAW 이벤트에 대한 상세 내용입니다. 많은 참여 부탁드립니다."
    },
    {
      type: "공지",
      title: "신정 거래 관련 일정 안내",
      date: "2024.12.11",
      content: "신정 연휴 기간 거래 일정에 대해 안내드립니다."
    },
    {
      type: "공지",
      title: "성탄절 거래 관련 일정 안내",
      date: "2024.12.10",
      content: "성탄절 연휴 기간 거래 일정에 대해 안내드립니다."
    },
    {
      type: "이벤트",
      title: "[안내] KREAM DRAW - 12월 2주차 서프라이즈, 신규 회원, KREAM 카드 전용 응모 안내",
      date: "2024.12.08",
      content: "12월 2주차 KREAM DRAW 이벤트에 대한 상세 내용입니다. 많은 참여 부탁드립니다."
    },
    {
      type: "이벤트",
      title: "[안내] KREAM DRAW - 12월 1주차 서프라이즈, 신규 회원, KREAM 카드 전용 응모 안내",
      date: "2024.12.01",
      content: "12월 1주차 KREAM DRAW 이벤트에 대한 상세 내용입니다. 많은 참여 부탁드립니다."
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="relative mb-4">
        <Input 
          type="search" 
          placeholder="검색" 
          className="w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>

      <Tabs defaultValue="전체" className="w-full">
        <TabsList className="border-b w-full justify-start h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="전체"
            className="border-b-2 border-transparent data-[state=active]:border-black rounded-none px-4 py-2 text-sm"
          >
            전체
          </TabsTrigger>
          <TabsTrigger 
            value="이용정책"
            className="border-b-2 border-transparent data-[state=active]:border-black rounded-none px-4 py-2 text-sm"
          >
            이용정책
          </TabsTrigger>
          <TabsTrigger 
            value="공통"
            className="border-b-2 border-transparent data-[state=active]:border-black rounded-none px-4 py-2 text-sm"
          >
            공통
          </TabsTrigger>
          <TabsTrigger 
            value="구매"
            className="border-b-2 border-transparent data-[state=active]:border-black rounded-none px-4 py-2 text-sm"
          >
            구매
          </TabsTrigger>
          <TabsTrigger 
            value="판매"
            className="border-b-2 border-transparent data-[state=active]:border-black rounded-none px-4 py-2 text-sm"
          >
            판매
          </TabsTrigger>
        </TabsList>

        <TabsContent value="전체" className="mt-0">
          <div className="divide-y">
            {filteredNotices.map((notice, index) => (
              <div 
                key={index}
                className="flex items-center py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedNotice(notice)}
              >
                <span className="text-gray-600 w-20">{notice.type}</span>
                <span className="flex-1 text-gray-900">{notice.title}</span>
                <span className="text-gray-500 text-sm">{notice.date}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="이용정책" className="mt-0">
          <div className="text-center py-8 text-gray-500">
            이용정책 관련 공지사항이 없습니다.
          </div>
        </TabsContent>
        <TabsContent value="공통" className="mt-0">
          <div className="divide-y">
            {filteredNotices
              .filter(notice => notice.type === "공지")
              .map((notice, index) => (
                <div 
                  key={index}
                  className="flex items-center py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedNotice(notice)}
                >
                  <span className="text-gray-600 w-20">{notice.type}</span>
                  <span className="flex-1 text-gray-900">{notice.title}</span>
                  <span className="text-gray-500 text-sm">{notice.date}</span>
                </div>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="구매" className="mt-0">
          <div className="text-center py-8 text-gray-500">
            구매 관련 공지사항이 없습니다.
          </div>
        </TabsContent>
        <TabsContent value="판매" className="mt-0">
          <div className="text-center py-8 text-gray-500">
            판매 관련 공지사항이 없습니다.
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div>
              <DialogTitle className="text-xl font-medium mb-2">
                {selectedNotice?.title}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{selectedNotice?.type}</span>
                <span>{selectedNotice?.date}</span>
              </div>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-700 leading-relaxed">
              {selectedNotice?.content}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

