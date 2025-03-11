'use client'

import { useEffect, useState } from 'react'
import Layout from "@/components/layout"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Notice } from '@/types/notice'

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])

  useEffect(() => {
    // Fetch notices from API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    fetch(`${apiUrl}/api/notices`)
      .then(res => res.json())
      .then(data => setNotices(data))
  }, [])

  return (
    <Layout>
      <div className="max-w-[1000px] mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">공지사항</h1>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="notice">공지</TabsTrigger>
            <TabsTrigger value="event">이벤트</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {notices.map((notice) => (
                <Card key={notice.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{notice.type}</span>
                    <h3 className="flex-1 font-medium">{notice.title}</h3>
                    <span className="text-sm text-gray-500">{notice.date}</span>
                  </div>
                  <p className="mt-2 text-gray-600">{notice.content}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notice">
            <div className="space-y-4">
              {notices
                .filter(notice => notice.type === '공지')
                .map((notice) => (
                  <Card key={notice.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{notice.type}</span>
                      <h3 className="flex-1 font-medium">{notice.title}</h3>
                      <span className="text-sm text-gray-500">{notice.date}</span>
                    </div>
                    <p className="mt-2 text-gray-600">{notice.content}</p>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="event">
            <div className="space-y-4">
              {notices
                .filter(notice => notice.type === '이벤트')
                .map((notice) => (
                  <Card key={notice.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{notice.type}</span>
                      <h3 className="flex-1 font-medium">{notice.title}</h3>
                      <span className="text-sm text-gray-500">{notice.date}</span>
                    </div>
                    <p className="mt-2 text-gray-600">{notice.content}</p>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
} 