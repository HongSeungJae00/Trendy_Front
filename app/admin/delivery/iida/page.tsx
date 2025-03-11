'use client'

import { SiteHeader } from "@/components/admin-site-header"
import { MainNav } from "@/components/admin-main-nav"
import { DeliveryTable } from "@/components/admin-delivery-table"
import { useState } from "react"

export default function DeliveryIidaPage() {
  const [pageTitle, setPageTitle] = useState("배송 관리 [리셀]")

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="flex">
        <aside className="w-64 border-r min-h-[calc(100vh-3.5rem)] p-4">
          <MainNav />
        </aside>
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-lg font-bold mb-4">{pageTitle}</h1>
          <DeliveryTable setPageTitle={setPageTitle} isResell={true} />
        </main>
      </div>
    </div>
  )
}

