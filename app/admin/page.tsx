import { SiteHeader } from "@/components/admin-site-header"
import { MainNav } from "@/components/admin-main-nav"
import { OrderManagement } from "@/components/admin-order-management"
import { SalesChart } from "@/components/admin-sales-chart"
import { InventoryManagement } from "@/components/admin-inventory-management"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="flex">
        <aside className="w-64 border-r min-h-[calc(100vh-3.5rem)] p-4">
          <MainNav />
        </aside>
        <main className="flex-1 p-6 bg-gray-50">
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-6">
              <Link href="/admin/orders" className="contents">
                <OrderManagement />
              </Link>
              <div className="space-y-6">
                <Link href="/admin/sales" className="contents">
                  <SalesChart />
                </Link>
                <Link href="/admin/inventory" className="contents">
                  <InventoryManagement />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

