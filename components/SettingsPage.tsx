'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TopButton } from './TopButton'
import { WithdrawalDialog } from '@/components/WithdrawalDialog'

// Mock data for development
const mockUserSettings: UserSettings = {
  email: "user@example.com",
  phoneNumber: "010-1234-5678",
  shoeSize: "270",
  marketingConsent: true,
  smsConsent: false,
  emailConsent: true,
};

interface UserSettings {
  email: string;
  phoneNumber: string;
  shoeSize: string;
  marketingConsent: boolean;
  smsConsent: boolean;
  emailConsent: boolean;
}

export function SettingsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isShoeSizeDialogOpen, setIsShoeSizeDialogOpen] = useState(false)
  const [isPrivacyDialogOpen, setIsPrivacyDialogOpen] = useState(false)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false)

  const shoeSizes = Array.from({ length: 7 }, (_, i) => (230 + i * 10).toString())

  useEffect(() => {
    fetchUserSettings()
  }, [])

  const fetchUserSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(mockUserSettings);
    } catch (err) {
      setError('Error fetching user settings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserSetting = async (key: keyof UserSettings, value: string | boolean) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSettings(prev => prev ? { ...prev, [key]: value } : null);
    } catch (err) {
      setError('Error updating setting. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!settings) {
    return <div>No settings found.</div>
  }

  return (
    <div className="w-full">
      <section className="mb-8">
        <h2 className="font-bold text-lg mb-4">내 계정</h2>
        <div className="space-y-4">
          <div>
            <Label>이메일 주소</Label>
            <div className="flex gap-2">
              <Input 
                type="email" 
                value={settings.email} 
                disabled 
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => setIsDialogOpen(true)}
              >
                변경
              </Button>
            </div>
          </div>
          <div>
            <Label>비밀번호</Label>
            <div className="flex gap-2">
              <Input 
                type="password" 
                value="••••••••••" 
                disabled 
              />
              <Button 
                variant="outline" 
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => setIsDialogOpen(true)}
              >
                변경
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="font-bold text-lg mb-4">개인 정보</h2>
        <div className="space-y-4">
          <div>
            <Label>휴대폰 번호</Label>
            <div className="flex gap-2">
              <Input 
                type="tel" 
                value={settings.phoneNumber} 
                disabled 
              />
              <Button 
                variant="outline" 
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => setIsDialogOpen(true)}
              >
                변경
              </Button>
            </div>
          </div>
          <div>
            <Label>신발 사이즈</Label>
            <div className="flex gap-2">
              <Input 
                type="text" 
                value={`${settings.shoeSize}mm`}
                disabled 
              />
              <Button 
                variant="outline" 
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => setIsShoeSizeDialogOpen(true)}
              >
                변경
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-4">광고성 정보 수신</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Label className="cursor-pointer" onClick={() => setIsPrivacyDialogOpen(true)}>
                개인 정보 수집 및 이용 동의
              </Label>
              <span 
                className="ml-2 text-xs text-red-500 cursor-pointer" 
                onClick={() => setIsPrivacyDialogOpen(true)}
              >
                자세히 보기
              </span>
            </div>
            <Switch 
              checked={settings.marketingConsent}
              onCheckedChange={(checked) => updateUserSetting('marketingConsent', checked)}
              className="data-[state=checked]:bg-green-500" 
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>문자 메시지</Label>
            <Switch 
              checked={settings.smsConsent}
              onCheckedChange={(checked) => updateUserSetting('smsConsent', checked)}
              className="data-[state=checked]:bg-green-500" 
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>이메일</Label>
            <Switch 
              checked={settings.emailConsent}
              onCheckedChange={(checked) => updateUserSetting('emailConsent', checked)}
              className="data-[state=checked]:bg-green-500" 
            />
          </div>
        </div>
        <a href="#" 
          className="block text-xs text-gray-500 mt-8" 
          onClick={(e) => {
            e.preventDefault();
            setIsWithdrawalDialogOpen(true);
          }}
        >
          회원탈퇴
        </a>
      </section>

      <TopButton />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>변경 불가</DialogTitle>
            <DialogDescription>
              간편로그인으로 인하여 변경이 불가합니다.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={isShoeSizeDialogOpen} onOpenChange={setIsShoeSizeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>신발 사이즈 선택</DialogTitle>
            <DialogDescription>
              원하시는 신발 사이즈를 선택해주세요.
            </DialogDescription>
          </DialogHeader>
          <Select
            value={settings.shoeSize}
            onValueChange={(value) => {
              updateUserSetting('shoeSize', value)
              setIsShoeSizeDialogOpen(false)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="신발 사이즈 선택" />
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

      <Dialog open={isPrivacyDialogOpen} onOpenChange={setIsPrivacyDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle>개인 정보 수집 및 이용 동의</DialogTitle>
            </div>
            <div className="text-sm leading-6 space-y-4 text-muted-foreground">
              <DialogDescription asChild>
                <p>Trendy(이하 회사)는 마케팅 정보 전송 및 개인 맞춤형 광고 제공을 위하여 아래와 같이 개인정보를 수집 · 이용 및 제공합니다.</p>
              </DialogDescription>
              
              <div className="space-y-2">
                <h3 className="font-medium">개인정보 수집 및 이용 내역</h3>
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
                          회원 탈퇴시까지 수집/이용거부시까
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <DialogDescription asChild>
                <p>개인정보의 수집 및 이용에 대한 동의를 거부하시더라도 서비스의 이용은 가능합니다.</p>
              </DialogDescription>
              
              <DialogDescription asChild>
                <p>다만, 동의 전까지 적 정보를 통한 마케팅 정보 수신 및 개인 맞춤형 광고를 제공 받을 수 없습니다.</p>
              </DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <WithdrawalDialog 
        open={isWithdrawalDialogOpen} 
        onOpenChange={setIsWithdrawalDialogOpen}
      />
    </div>
  )
}

