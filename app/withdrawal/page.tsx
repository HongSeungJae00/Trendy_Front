'use client'

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function WithdrawalPage() {
  const [agreements, setAgreements] = useState({
    serviceTermination: false,
    restrictions: false,
    finalConfirmation: false,
  })
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const router = useRouter()

  const allChecked = Object.values(agreements).every(Boolean)

  const handleCancel = () => {
    router.back()
  }

  const handleWithdrawal = () => {
    if (allChecked) {
      setShowCompletionDialog(true)
      setTimeout(() => {
        setShowCompletionDialog(false)
        // Implement logout and redirect
        localStorage.clear() // Clear any stored user data
        window.location.href = '/' // Redirect to home page
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">회원탈퇴</h1>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms1"
                checked={agreements.serviceTermination}
                onCheckedChange={(checked) => 
                  setAgreements(prev => ({ ...prev, serviceTermination: checked as boolean }))
                }
              />
              <label 
                htmlFor="terms1" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Trendy을 탈퇴하면 회원 정보 및 서비스 이용 기록이 삭제됩니다.
              </label>
            </div>
            <div className="ml-6 bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2">
              <p>• 내 프로필, 거래내역(구매/판매), 관심상품, 보유상품, STYLE 게시물(게시물/댓글), 미사용 보유 포인트 등 사용자의 모든 정보가 사라지며 재가입 하더라도 복구가 불가능합니다.</p>
              <p>• 탈퇴 14일 이내 재가입할 수 없으며, 탈퇴 후 동일 이메일로 재가입할 수 없습니다</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms2"
                checked={agreements.restrictions}
                onCheckedChange={(checked) => 
                  setAgreements(prev => ({ ...prev, restrictions: checked as boolean }))
                }
              />
              <label 
                htmlFor="terms2" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Trendy 탈퇴가 제한된 경우에는 아래 내용을 참고하시기 바랍니다.
              </label>
            </div>
            <div className="ml-6 bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2">
              <p>• 진행 중인 거래(판매/구매)가 있을 경우: 해당 거래 종료 후 탈퇴 가능</p>
              <p>• 진행 중인 입찰(판매/구매)가 있을 경우: 해당 입찰 삭제 후 탈퇴 가능</p>
              <p>• 미납 수수료(착불 발송비/페널티)가 있을 경우: 해당 결제 완료 후 탈퇴 가능</p>
              <p>• 이용 정지 상태인 경우: 이용 정지 해제 후 탈퇴 가능</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms3"
              checked={agreements.finalConfirmation}
              onCheckedChange={(checked) => 
                setAgreements(prev => ({ ...prev, finalConfirmation: checked as boolean }))
              }
            />
            <label 
              htmlFor="terms3" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              회원탈퇴 안내를 모두 확인하였으며 탈퇴에 동의합니다.
            </label>
          </div>

          <div className="flex justify-center space-x-4 pt-6">
            <Button 
              variant="outline"
              onClick={handleCancel}
              className="px-6"
            >
              취소하기
            </Button>
            <Button 
              onClick={handleWithdrawal}
              disabled={!allChecked}
              className="px-6 bg-[#F15746] hover:bg-[#F15746]/90 text-white"
            >
              탈퇴하기
            </Button>
          </div>
        </div>
        <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">탈퇴가 완료되었습니다</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

