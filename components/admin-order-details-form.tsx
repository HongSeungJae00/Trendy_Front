"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/admin-ui/admin-input"
import { Label } from "@/components/admin-ui/admin-label"
import { Textarea } from "@/components/admin-ui/admin-textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin-ui/admin-select"

interface OrderDetails {
  id: string;
  productNumber: string;
  productName: string;
  date: string;
  customer: string;
  productType: string;
  quantity: number;
  amount: string;
  paymentStatus: string;
  approvalStatus: string;
  imageUrl: string;
  notes: string;
  rejectionReason: string;
  size: string;
  color: string;
  bankName: string;
  accountNumber: string;
}

const fetchOrderData = async (id: string): Promise<OrderDetails> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id,
    productNumber: "",
    productName: "",
    date: "",
    customer: "",
    productType: "",
    quantity: 0,
    amount: "0원",
    paymentStatus: "",
    approvalStatus: "",
    imageUrl: "/placeholder.svg?height=400&width=400",
    notes: "",
    rejectionReason: "",
    size: "0",
    color: "",
    bankName: "",
    accountNumber: "0",
  }
}

export function OrderDetailsForm({ orderId }: { orderId: string }) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  useEffect(() => {
    fetchOrderData(orderId).then(setOrderDetails)
  }, [orderId])

  if (!orderDetails) return <div>Loading...</div>

  return (
    <div className="flex gap-6">
      <div className="w-1/3">
        <img 
          src={orderDetails.imageUrl} 
          alt={orderDetails.productName} 
          className="w-full h-auto object-cover rounded-lg shadow-md"
        />
      </div>
      <div className="w-2/3 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="productNumber" className="text-xs">상품번호</Label>
            <Input id="productNumber" value={orderDetails.productNumber} readOnly className="mt-1 text-xs" />
          </div>
          <div>
            <Label htmlFor="productName" className="text-xs">상품명</Label>
            <Input id="productName" value={orderDetails.productName} readOnly className="mt-1 text-xs" />
          </div>
          <div>
            <Label htmlFor="id" className="text-xs">주문번호</Label>
            <Input id="id" value={orderDetails.id} readOnly className="mt-1 text-xs" />
          </div>
          <div>
            <Label htmlFor="date" className="text-xs">주문일</Label>
            <Input id="date" value={orderDetails.date} readOnly className="mt-1 text-xs" />
          </div>
          <div>
            <Label htmlFor="customer" className="text-xs">고객명</Label>
            <Input id="customer" value={orderDetails.customer} readOnly className="mt-1 text-xs" />
          </div>
          <div>
            <Label htmlFor="productType" className="text-xs">상품유형</Label>
            <Input id="productType" value={orderDetails.productType} readOnly className="mt-1 text-xs" />
          </div>
          <div>
            <Label htmlFor="bankName" className="text-xs">은행명</Label>
            <Input id="bankName" value={orderDetails.bankName} readOnly className="mt-1 text-xs" />
          </div>
          <div>
            <Label htmlFor="accountNumber" className="text-xs">계좌번호</Label>
            <Input id="accountNumber" value={orderDetails.accountNumber} readOnly className="mt-1 text-xs" />
          </div>
          <div>
            <Label htmlFor="quantity" className="text-xs">수량</Label>
            <Input id="quantity" value={orderDetails.quantity} readOnly className="mt-1 text-xs" />
          </div>
          <div>
            <Label htmlFor="size" className="text-xs">사이즈</Label>
            <Input id="size" value={orderDetails.size} readOnly className="mt-1 text-xs" />
          </div>
          <div>
            <Label htmlFor="color" className="text-xs">컬러</Label>
            <Input id="color" value={orderDetails.color} readOnly className="mt-1 text-xs" />
          </div>
          <div>
            <Label htmlFor="paymentStatus" className="text-xs">결제상태</Label>
            <Select defaultValue={orderDetails.paymentStatus}>
              <SelectTrigger id="paymentStatus" className="mt-1 text-xs">
                <SelectValue placeholder="결제상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="결제완료" className="text-xs">결제완료</SelectItem>
                <SelectItem value="결제대기중" className="text-xs">결제대기중</SelectItem>
                <SelectItem value="결제취소" className="text-xs">결제취소</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount" className="text-xs">총액</Label>
            <Input id="amount" value={orderDetails.amount} readOnly className="mt-1 text-xs" />
          </div>
          <div>
            <Label htmlFor="approvalStatus" className="text-xs">승인상태</Label>
            <Select defaultValue={orderDetails.approvalStatus}>
              <SelectTrigger id="approvalStatus" className="mt-1 text-xs">
                <SelectValue placeholder="승인상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="승인완료" className="text-xs">승인완료</SelectItem>
                <SelectItem value="승인대기" className="text-xs">승인대기</SelectItem>
                <SelectItem value="승인거절" className="text-xs">승인거절</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="notes" className="text-xs">비고</Label>
          <Textarea 
            id="notes" 
            value={orderDetails.notes}
            onChange={(e) => setOrderDetails({...orderDetails, notes: e.target.value})}
            placeholder="추가 정보를 입력하세요" 
            className="mt-1 text-xs resize-none"
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="rejectionReason" className="text-xs">주문 반려 사유</Label>
          <Textarea 
            id="rejectionReason" 
            value={orderDetails.rejectionReason}
            onChange={(e) => setOrderDetails({...orderDetails, rejectionReason: e.target.value})}
            placeholder="주문 반려 사유를 입력하세요" 
            className="mt-1 text-xs resize-none"
            rows={4}
          />
        </div>
      </div>
    </div>
  )
}

