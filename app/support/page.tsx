import Layout from "@/components/layout"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function SupportPage() {
  return (
    <Layout>
      <div className="max-w-[1000px] mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">자주 묻는 질문</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Input 
            type="search" 
            placeholder="검색" 
            className="w-full pl-10 bg-gray-50"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>


        {/* Main Tabs */}
        <Tabs defaultValue="전체" className="w-full">
          <TabsList className="w-full justify-start h-auto border-b rounded-none bg-transparent p-0 mb-4">
            <TabsTrigger 
              value="전체"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent"
            >
              전체
            </TabsTrigger>
            <TabsTrigger 
              value="이용정책"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent"
            >
              이용정책
            </TabsTrigger>
            <TabsTrigger 
              value="공통"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent"
            >
              공통
            </TabsTrigger>
            <TabsTrigger 
              value="구매"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent"
            >
              구매
            </TabsTrigger>
            <TabsTrigger 
              value="판매"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent"
            >
              판매
            </TabsTrigger>
          </TabsList>

          <TabsContent value="전체">
            <Accordion type="single" collapsible className="w-full">
              {/* 이용정책 items */}
              <AccordionItem value="item-1" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>페널티 정책</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  페널티 정책에 대한 상세 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>기품 · 사용감 있는 상품 판매에 대한 제재</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  사용감 있는 상품 판매에 대한 제재 정책 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>검수 기준 약관에 대한 제재</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  검수 기준 약관에 대한 제재 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>거래 실패 시 반송 운임 기준</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  거래 실패 시 반송 운임 기준에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>부적절발뮤 금지</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  부적절발뮤 금지에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>이상시세 입찰/거래 취소 정책</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  이상시세 입찰 및 거래 취소에 대한 정책 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>커뮤니티 가이드라인</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  커뮤니티 가이드라인에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8" className="border-t border-b">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>검수 및 품질 보증 관련 주의사항</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  검수 및 품질 보증 관련 주의사항에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>

              {/* 공통 items */}
              <AccordionItem value="common-1" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">공통</span>
                    <span>공통 FAQ 항목</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  공통 FAQ 항목에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              
              {/* 구매 items */}
              <AccordionItem value="purchase-1" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">구매</span>
                    <span>구매 관련 FAQ 항목</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  구매 관련 FAQ 항목에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              
              {/* 판매 items */}
              <AccordionItem value="sale-1" className="border-t border-b">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">판매</span>
                    <span>판매 관련 FAQ 항목</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  판매 관련 FAQ 항목에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="이용정책">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>페널티 정책</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  페널티 정책에 대한 상세 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>기품 · 사용감 있는 상품 판매에 대한 제재</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  사용감 있는 상품 판매에 대한 제재 정책 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>검수 기준 약관에 대한 제재</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  검수 기준 약관에 대한 제재 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>거래 실패 시 반송 운임 기준</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  거래 실패 시 반송 운임 기준에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>부적절발뮤 금지</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  부적절발뮤 금지에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>이상시세 입찰/거래 취소 정책</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  이상시세 입찰 및 거래 취소에 대한 정책 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7" className="border-t">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>커뮤니티 가이드라인</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  커뮤니티 가이드라인에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8" className="border-t border-b">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">이용정책</span>
                    <span>검수 및 품질 보증 관련 주의사항</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  검수 및 품질 보증 관련 주의사항에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="공통">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="common-1" className="border-t border-b">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">공통</span>
                    <span>공통 FAQ 항목</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  공통 FAQ 항목에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          <TabsContent value="구매">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="purchase-1" className="border-t border-b">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">구매</span>
                    <span>구매 관련 FAQ 항목</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  구매 관련 FAQ 항목에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          <TabsContent value="판매">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="sale-1" className="border-t border-b">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">판매</span>
                    <span>판매 관련 FAQ 항목</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  판매 관련 FAQ 항목에 대한 내용이 여기에 표시됩니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

