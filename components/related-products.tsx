import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface RelatedProduct {
  id: string
  name: string
  brand: string
  price: number
  imageUrl: string
}

interface RelatedProductsProps {
  products: RelatedProduct[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">연관 제품</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold">{product.brand}</h3>
                <p className="text-sm text-gray-600 truncate">{product.name}</p>
                <div className="mt-2">
                  <span className="font-bold">{product.price.toLocaleString()}원</span>
                  <span className="text-sm text-gray-500 ml-2">즉시 구매가</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

