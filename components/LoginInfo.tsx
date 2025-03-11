'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from 'lucide-react'
import { WithdrawalDialog } from "@/components/WithdrawalDialog"

export function LoginInfo() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false)
  const [isPrivacyDialogOpen, setIsPrivacyDialogOpen] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(true)
  const [textConsent, setTextConsent] = useState(false)
  const [emailConsent, setEmailConsent] = useState(true)
  const [shoeSize, setShoeSize] = useState("270")
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false)

  // Generate shoe sizes from 220mm to 300mm in 10mm increments
  const shoeSizes = Array.from({ length: 9 }, (_, i) => ((22 + i) * 10).toString())

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">내 계정</h1>
      
      {/* 이메일 주소 */}
      <div className="mb-6">
        <Label className="text-sm text-gray-600">이메일 주소</Label>
        <div className="flex gap-2 mt-1">
          <Input 
            type="email" 
            value="user@example.com" 
            disabled 
            className="bg-gray-50"
          />
          <Button 
            variant="destructive" 
            size="sm"
            className="px-4 bg-[#FF4747] hover:bg-[#FF4747]/90"
            onClick={() => setIsDialogOpen(true)}
          >
            변경
          </Button>
        </div>
      </div>

      {/* 비밀번호 */}
      <div className="mb-8">
        <Label className="text-sm text-gray-600">비밀번호</Label>
        <div className="flex gap-2 mt-1">
          <Input 
            type="password" 
            value="••••••••" 
            disabled 
            className="bg-gray-50"
          />
          <Button 
            variant="destructive" 
            size="sm"
            className="px-4 bg-[#FF4747] hover:bg-[#FF4747]/90"
            onClick={() => setIsDialogOpen(true)}
          >
            변경
          </Button>
        </div>
      </div>

      {/* 개인 정보 */}
      <h2 className="text-xl font-bold mb-6">개인 정보</h2>
      
      {/* 휴대폰 번호 */}
      <div className="mb-6">
        <Label className="text-sm text-gray-600">휴대폰 번호</Label>
        <div className="flex gap-2 mt-1">
          <Input 
            type="tel" 
            value="010-1234-5678" 
            disabled 
            className="bg-gray-50"
          />
          <Button 
            variant="destructive" 
            size="sm"
            className="px-4 bg-[#FF4747] hover:bg-[#FF4747]/90"
            onClick={() => setIsDialogOpen(true)}
          >
            변경
          </Button>
        </div>
      </div>

      {/* 신발 사이즈 */}
      <div className="mb-8">
        <Label className="text-sm text-gray-600">신발 사이즈</Label>
        <div className="flex gap-2 mt-1">
          <Input 
            type="text" 
            value={`${shoeSize}mm`}
            disabled 
            className="bg-gray-50"
          />
          <Button 
            variant="destructive" 
            size="sm"
            className="px-4 bg-[#FF4747] hover:bg-[#FF4747]/90"
            onClick={() => setIsSizeDialogOpen(true)}
          >
            변경
          </Button>
        </div>
      </div>

      {/* 광고성 정보 수신 */}
      <h2 className="text-xl font-bold mb-6">광고성 정보 수신</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">개인 정보 수신 및 이용 동의</span>
            <button 
              className="text-xs text-[#FF4747]"
              onClick={() => setIsPrivacyDialogOpen(true)}
            >
              자세히 보기
            </button>
          </div>
          <Switch 
            checked={marketingConsent}
            onCheckedChange={setMarketingConsent}
            className="data-[state=checked]:bg-green-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">문자 메시지</span>
          <Switch 
            checked={textConsent}
            onCheckedChange={setTextConsent}
            className="data-[state=checked]:bg-green-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">이메일</span>
          <Switch 
            checked={emailConsent}
            onCheckedChange={setEmailConsent}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </div>

      <div className="mt-8">
        <button 
          className="text-xs text-gray-500 hover:underline"
          onClick={() => setIsWithdrawalDialogOpen(true)}
        >
          회원탈퇴
        </button>
      </div>

      {/* Privacy Policy Dialog */}
      <Dialog open={isPrivacyDialogOpen} onOpenChange={setIsPrivacyDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle>개인 정보 수집 및 이용 동의</DialogTitle>
            </div>
            <p className="text-sm text-gray-600">
              Trendy(이하 회사)는 마케팅 정보 전송 및 개인 맞춤형 광고 제공을 위하여 아래와 같이 개인정보를 수집 · 이용 및 제공합니다.
            </p>
          </DialogHeader>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">개인정보 수집 및 이용 내역</h3>
            <div className="border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left border-r">항목</th>
                    <th className="p-3 text-left border-r">수집 및 이용 목적</th>
                    <th className="p-3 text-left border-r">필수여부</th>
                    <th className="p-3 text-left">보유 및 이용기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-r align-top">
                      ID/성명, 생년월일, 성별, 휴대폰 번호, 이메일 주소, 서비스 이용 기기정보(기기 고유값, 모델 기종, 언어 기록)
                    </td>
                    <td className="p-3 border-r align-top">
                      마케팅 정보 전송, 개인 맞춤형 광고 제공 - 서비스 혜택 정보 제공
                    </td>
                    <td className="p-3 border-r text-center align-top">선택</td>
                    <td className="p-3 align-top">
                      회원 탈퇴시까지 수집/이용거부시까지
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>개인정보의 수집 및 이용에 대한 동의를 거부하시더라도 서비스의 이용은 가능합니다.</p>
            <p>다만, 동의 전까지 정보를 통한 마케팅 정보 수신 및 개인 맞춤형 광고를 제공 받을 수 없습니다.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* 변경 불가 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>변경 불가</DialogTitle>
            <p className="text-sm text-gray-500">
              간편로그인으로 인하여 변경이 불가합니다.
            </p>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* 신발 사이즈 선택 다이얼로그 */}
      <Dialog open={isSizeDialogOpen} onOpenChange={setIsSizeDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>신발 사이즈 선택</DialogTitle>
            <p className="text-sm text-gray-500">
              원하시는 신발 사이즈를 선택해주세요.
            </p>
          </DialogHeader>
          <Select
            value={shoeSize}
            onValueChange={(value) => {
              setShoeSize(value);
              setIsSizeDialogOpen(false);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={`${shoeSize}mm`} />
            </SelectTrigger>
            <SelectContent>
              {shoeSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}mm
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>
      <WithdrawalDialog 
        open={isWithdrawalDialogOpen} 
        onOpenChange={setIsWithdrawalDialogOpen}
      />
    </div>
  )
}

