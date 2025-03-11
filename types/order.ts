export interface Order {
  id: number
  title: string
  subtitle: string
  price: string
  date: string
  status: string
  image: string
  buyerInfo: string
  shippingMethod: string
}

export interface OrderCardProps extends Order {
  onOpenDetail: () => void
} 

