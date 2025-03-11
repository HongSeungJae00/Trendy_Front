'use client'

import Layout from "@/components/layout"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function NoticePage() {
  return (
    <Layout showSidebar={false}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">이벤트/공지사항</h1>
        
        <Tabs defaultValue="notice" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="notice">공지사항</TabsTrigger>
            <TabsTrigger value="event">이벤트</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notice">
            <Card className="p-6">
              <div className="space-y-4">
                {/* 공지사항 목록 */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">서비스 업데이트 안내</h3>
                  <p className="text-sm text-gray-600">2024.03.15</p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">개인정보처리방침 개정 안내</h3>
                  <p className="text-sm text-gray-600">2024.03.10</p>
                </div>
                {/* ... 더 많은 공지사항 ... */}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="event">
            <Card className="p-6">
              <div className="space-y-4">
                {/* 이벤트 목록 */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">봄맞이 특별 할인 이벤트</h3>
                  <p className="text-sm text-gray-600">2024.03.01 - 2024.03.31</p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">신규 회원 가입 이벤트</h3>
                  <p className="text-sm text-gray-600">2024.03.15 - 2024.04.15</p>
                </div>
                {/* ... 더 많은 이벤트 ... */}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
} 