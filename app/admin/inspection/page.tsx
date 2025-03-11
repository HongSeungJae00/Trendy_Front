import { SiteHeader } from "@/components/admin-site-header"
import { MainNav } from "@/components/admin-main-nav"
import { InspectionTable } from "@/components/admin-inspection-table"

export default function InspectionPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="flex">
        <aside className="w-64 border-r min-h-[calc(100vh-3.5rem)] p-4">
          <MainNav />
        </aside>
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-lg font-bold mb-4">검수 관리</h1>
          <InspectionTable />
        </main>
      </div>
    </div>
  )
}

