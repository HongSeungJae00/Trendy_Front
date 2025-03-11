'use client'
import { SiteHeader } from "@/components/admin-site-header"
import { MainNav } from "@/components/admin-main-nav"
import { DeliveryTable } from "@/components/admin-delivery-table"

export default function DeliveryPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="flex">
        <aside className="w-64 border-r min-h-[calc(100vh-3.5rem)] p-4">
          <MainNav />
        </aside>
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-lg font-bold mb-4">배송 관리 [일반]</h1>
          <DeliveryTable />
        </main>
      </div>
    </div>
  )
}

