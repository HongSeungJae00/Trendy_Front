import { SiteHeader } from "@/components/admin-site-header"
import { MainNav } from "@/components/admin-main-nav"
import { InventoryTable } from "@/components/admin-inventory-table"

export default function InventoryPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="flex">
        <aside className="w-64 border-r min-h-[calc(100vh-3.5rem)] p-4">
          <MainNav />
        </aside>
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-lg font-bold mb-4">창고 및 재고 관리</h1>
          <InventoryTable />
        </main>
      </div>
    </div>
  )
}

