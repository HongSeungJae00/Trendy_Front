'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ProductDetailProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: number
    name: string
    brand: string
    price: number
    image: string
  }
}

export default function ProductDetail({ isOpen, onClose, product }: ProductDetailProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-gray-500">{product.brand}</p>
            </div>
            <div>
              <p className="text-xl font-bold">
                {product.price.toLocaleString()}원
              </p>
            </div>
            <div className="space-y-2">
              <Button className="w-full">구매하기</Button>
              <Button variant="outline" className="w-full">장바구니</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 