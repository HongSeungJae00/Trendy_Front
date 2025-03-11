"use client"

import { useState } from "react"
import { Input } from "@/components/admin-ui/admin-input"
import { Label } from "@/components/admin-ui/admin-label"
import { Textarea } from "@/components/admin-ui/admin-textarea"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/admin-ui/admin-select"
import { ChevronDown } from 'lucide-react'

interface MemberInfo {
  name: string;
  id: string;
  password: string;
  nickname: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  gender: string;
  status: string;
  purchaseInfo: string;
  salesInfo: string;
  profileImage: string | null;
}

interface MemberDetails {  // MemberDetails 인터페이스 추가
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface MemberInfoFormProps {
  initialData: MemberDetails;
  onUpdate: (updatedInfo: MemberDetails) => Promise<void>;
}

export function MemberInfoForm({ initialData, onUpdate }: MemberInfoFormProps): JSX.Element {
  const [memberInfo, setMemberInfo] = useState<MemberInfo>({
    name: initialData.name,
    id: initialData.id,
    email: initialData.email,
    status: initialData.status,
    password: "******",
    nickname: "",
    phone: "",
    address: "",
    joinDate: "",
    gender: "",
    purchaseInfo: "",
    salesInfo: "",
    profileImage: null
  })

  const handleStatusChange = (value: string) => {
    const updatedInfo = {
      ...memberInfo,
      status: value
    };
    setMemberInfo(updatedInfo);
    onUpdate({
      id: updatedInfo.id,
      name: updatedInfo.name,
      email: updatedInfo.email,
      role: initialData.role,
      status: value
    });
  };

  return (
    <div className="flex gap-6">
      <div className="w-64 flex flex-col items-center">
        <div className="w-56 h-56 border rounded-lg overflow-hidden">
          {memberInfo.profileImage ? (
            <img src={memberInfo.profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <img src="/images/manager.png" alt="Default Profile" className="w-full h-full object-cover" />
          )}
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="name" className="text-xs">이름</Label>
            <Input id="name" name="name" value={memberInfo.name} readOnly className="mt-1 text-xs h-8" />
          </div>
          <div>
            <Label htmlFor="phone" className="text-xs">휴대폰번호</Label>
            <Input id="phone" name="phone" value={memberInfo.phone} readOnly className="mt-1 text-xs h-8" />
          </div>
          <div>
            <Label htmlFor="id" className="text-xs">아이디</Label>
            <Input id="id" name="id" value={memberInfo.id} readOnly className="mt-1 text-xs h-8" />
          </div>
          <div>
            <Label htmlFor="email" className="text-xs">이메일</Label>
            <Input id="email" name="email" value={memberInfo.email} readOnly className="mt-1 text-xs h-8" />
          </div>
          <div>
            <Label htmlFor="password" className="text-xs">비밀번호</Label>
            <Input id="password" name="password" type="password" value={memberInfo.password} readOnly className="mt-1 text-xs h-8" />
          </div>
          <div>
            <Label htmlFor="address" className="text-xs">주소</Label>
            <Input id="address" name="address" value={memberInfo.address} readOnly className="mt-1 text-xs h-8" />
          </div>
          <div>
            <Label htmlFor="nickname" className="text-xs">닉네임</Label>
            <Input id="nickname" name="nickname" value={memberInfo.nickname} readOnly className="mt-1 text-xs h-8" />
          </div>
          <div>
            <Label htmlFor="joinDate" className="text-xs">가입일</Label>
            <Input id="joinDate" name="joinDate" value={memberInfo.joinDate} readOnly className="mt-1 text-xs h-8" />
          </div>
          <div>
            <Label htmlFor="gender" className="text-xs">성별</Label>
            <Input id="gender" name="gender" value={memberInfo.gender} readOnly className="mt-1 text-xs h-8" />
          </div>
          <div>
            <Label htmlFor="status" className="text-xs">상태</Label>
            <div className="relative mt-1">
              <Select 
                defaultValue={memberInfo.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full text-xs h-8">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="활성" className="text-xs">활성</SelectItem>
                  <SelectItem value="비활성" className="text-xs">비활성</SelectItem>
                </SelectContent>
              </Select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="purchaseInfo" className="text-xs">구매정보</Label>
          <Textarea id="purchaseInfo" value={memberInfo.purchaseInfo} readOnly className="mt-1 text-xs h-20" />
        </div>
        <div>
          <Label htmlFor="salesInfo" className="text-xs">판매정보</Label>
          <Textarea id="salesInfo" value={memberInfo.salesInfo} readOnly className="mt-1 text-xs h-20" />
        </div>
      </div>
    </div>
  )
}

