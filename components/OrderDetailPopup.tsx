import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface OrderDetailPopupProps {
  isOpen: boolean
  onClose: () => void
  order: {
    title: string
    image: string
    price: string
    size: string
    date: string
    status: string
    paymentMethod: string
    totalAmount: string
    address: string
  }
}

export function OrderDetailPopup({ isOpen, onClose, order }: OrderDetailPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>주문 상세 정보</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h3 className="font-semibold text-lg">{order.title}</h3>
          <div className="flex justify-center">
            <Image
              src={order.image}
              alt={order.title}
              width={200}
              height={200}
              className="rounded-md object-cover"
            />
          </div>
          <div className="space-y-2 text-sm text-left">
  {[
    { label: "가격", value: order.price },
    { label: "사이즈", value: order.size },
    { label: "결제일", value: order.date },
    { label: "상태", value: order.status },
    { label: "결제 방법", value: "현금" },
    { label: "결제 금액", value: order.totalAmount },
  ].map(({ label, value }) => (
    <div key={label} className="flex">
      <span className="font-medium w-24">{label}:</span>
      <span>{value}</span>
    </div>
  ))}
</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

