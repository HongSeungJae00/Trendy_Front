'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import Image from "next/image"

interface ReviewImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  caption: string
}

export function ReviewImageModal({ isOpen, onClose, imageUrl, caption }: ReviewImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="sr-only">리뷰 이미지</DialogTitle>
          <DialogDescription className="sr-only">
            사용자가 업로드한 제품 리뷰 이미지입니다.
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-square">
          <Image
            src={imageUrl}
            alt={caption}
            fill
            className="object-contain"
          />
        </div>
        <p className="text-center mt-2">{caption}</p>
      </DialogContent>
    </Dialog>
  )
}

