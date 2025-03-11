'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import OrderDetailPopup from './OrderDetailPopup'
import { Order, OrderCardProps } from '@/types/order'

interface OrderListProps {
  type: 'buying' | 'selling'
  onOpenDetail: () => void
}

export default function OrderList({ type, onOpenDetail }: OrderListProps) {
  const orders: Order[] = [
    {
      id: 1,
      title: "Nike Air Force 1 '07",
      subtitle: "Size: US 9",
      price: "129,000원",
      date: "2024.01.05",
      status: type === 'buying' ? "배송완료" : "발송완료",
      image: "/placeholder.svg",
      buyerInfo: "서울특별시 강남구",
      shippingMethod: "택배배송"
    }
  ]

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} {...order} onOpenDetail={onOpenDetail} />
      ))}
    </div>
  )
}

function OrderCard({
  title,
  subtitle,
  price,
  date,
  status,
  image,
  buyerInfo,
  shippingMethod,
  onOpenDetail
}: OrderCardProps) {
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false)

  return (
    <Card>
      <CardContent
        className="p-4 cursor-pointer"
        onClick={() => setIsDetailPopupOpen(true)}
      >
        <div className="flex gap-4">
          <Image
            src={image}
            alt={title}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
            <p className="text-sm font-medium">{price}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="text-sm text-muted-foreground">{date}</div>
            <div className="text-sm font-medium">{status}</div>
          </div>
        </div>
      </CardContent>
      <OrderDetailPopup
        isOpen={isDetailPopupOpen}
        onClose={() => setIsDetailPopupOpen(false)}
        order={{
          title,
          image,
          price,
          size: subtitle.replace('Size: ', ''),
          date,
          status,
          paymentMethod: shippingMethod,
          totalAmount: price,
          address: buyerInfo
        }}
      />
    </Card>
  )
} 