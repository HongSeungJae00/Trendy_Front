import { Input } from "@/components/admin-ui/admin-input"
import { Label } from "@/components/admin-ui/admin-label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin-ui/admin-card"

export function OrderForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>주문 관리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orderNumber">주문번호</Label>
          <Input id="orderNumber" placeholder="주문번호를 입력하세요" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="productName">상품명</Label>
          <Input id="productName" placeholder="상품명을 입력하세요" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="productNumber">상품번호</Label>
          <Input id="productNumber" placeholder="상품번호를 입력하세요" />
        </div>
      </CardContent>
    </Card>
  )
}

