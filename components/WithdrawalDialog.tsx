'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface WithdrawalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WithdrawalDialog({ open, onOpenChange }: WithdrawalDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const router = useRouter()

  const handleWithdrawal = () => {
    if (isConfirmed) {
      onOpenChange(false)
      router.push('/withdrawal')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogTitle className="text-center text-lg font-medium">
            정말 탈퇴하시겠습니까?
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-sm text-center text-gray-600 leading-normal">
            탈퇴하기 클릭 시 바로 탈퇴 처리됩니다.<br />
            탈퇴 14일 이내 재가입할 수 없으며<br />
            재가입 시 동일 이메일을 사용할 수 없습니다.
          </p>
          <div className="flex items-center space-x-2 justify-center">
            <Checkbox 
              id="confirm" 
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
            />
            <label
              htmlFor="confirm"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Trendy 정말로 탈퇴하시겠습니까?
            </label>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button 
              className="w-full bg-[#F15746] hover:bg-[#F15746]/90 text-white"
              onClick={() => onOpenChange(false)}
            >
              탈퇴 안할래요
            </Button>
            <Button 
              variant="link"
              onClick={handleWithdrawal}
              className="text-sm text-gray-600 hover:underline"
            >
              탈퇴하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

