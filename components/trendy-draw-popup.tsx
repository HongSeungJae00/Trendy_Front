'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface TrendyDrawPopupProps {
  isOpen: boolean;
  onClose: (dontShowForWeek: boolean) => void;
}

export function TrendyDrawPopup({ isOpen, onClose }: TrendyDrawPopupProps) {
  const [dontShowForWeek, setDontShowForWeek] = useState(false);

  const handleClose = () => {
    onClose(dontShowForWeek);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-500 italic text-center">
            Trendy
          </DialogTitle>
          <p className="text-center text-gray-600">Nike X Dior Jordan 1</p>
          <p className="text-center text-gray-600">2025년 1월 Draw 이벤트</p>
          <p className="text-center text-red-500 font-bold mt-2">지금 응모하세요!</p>
        </DialogHeader>
        <div className="mt-4">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <Image
              src="/Nike X Dior Jodan 1.png"
              alt="Nike X Dior Jordan 1 Draw 이벤트"
              width={600}
              height={400}
              className="object-contain w-full h-full"
              priority
            />
          </div>
        </div>
        <div className="space-y-4">
          <Link 
            href="https://forms.gle/tdVzwBHPpXqJ6DtH7" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white"
              onClick={handleClose}
            >
              이벤트 내용 확인
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="noShow" 
                className="mr-2"
                checked={dontShowForWeek}
                onChange={(e) => setDontShowForWeek(e.target.checked)}
              />
              <label htmlFor="noShow" className="text-sm text-gray-500">7일 동안 보지 않기</label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 