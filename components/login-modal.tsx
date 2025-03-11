'use client'

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <div className="flex flex-col items-center p-6">
          <Link href="/" className="text-2xl font-bold text-red-500 italic mb-6">
            Trendy
          </Link>
          
          <div className="bg-gray-900 rounded-lg overflow-hidden mb-6 w-full">
            <div className="grid grid-cols-2 gap-1">
              <Image
                src="/placeholder.svg?height=150&width=200"
                alt="Promotional Image 1"
                width={200}
                height={150}
                className="w-full h-[150px] object-cover"
              />
              <Image
                src="/placeholder.svg?height=150&width=200"
                alt="Promotional Image 2"
                width={200}
                height={150}
                className="w-full h-[150px] object-cover"
              />
            </div>
          </div>

          <div className="space-y-3 w-full">
            <Button 
              className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black h-12"
              variant="ghost"
            >
              <Image
                src="/kakao-icon.svg"
                alt="Kakao"
                width={20}
                height={20}
                className="mr-2"
              />
              카카오로 시작하기
            </Button>

            <Button 
              className="w-full bg-white hover:bg-gray-50 text-black border h-12"
              variant="ghost"
            >
              <Image
                src="/google-icon.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              Google로 시작하기
            </Button>

            <Button 
              className="w-full bg-[#03C75A] hover:bg-[#03C75A]/90 text-white h-12"
              variant="ghost"
            >
              <span className="font-bold mr-2">N</span>
              네이버로 시작하기
            </Button>

            <Button 
              className="w-full bg-red-500 hover:bg-red-600 text-white h-12"
            >
              로그인
            </Button>

            <Button 
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 h-12"
              variant="ghost"
            >
              회원가입
            </Button>
          </div>

          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600">
            <button className="hover:text-gray-900">아이디 찾기</button>
            <div className="text-gray-300">|</div>
            <button className="hover:text-gray-900">비밀번호 찾기</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

