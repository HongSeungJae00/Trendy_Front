'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TopButton } from "@/components/TopButton"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FormData {
  bank: string;
  accountNumber: string;
  accountHolder: string;
}

export function PaymentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [newAccountData, setNewAccountData] = useState<FormData>({
    bank: '',
    accountNumber: '',
    accountHolder: ''
  });
  const [currentAccountData, setCurrentAccountData] = useState<FormData>({
    bank: '',
    accountNumber: '',
    accountHolder: ''
  });
  const [hasExistingAccount, setHasExistingAccount] = useState(false);

  const handleNewAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountData.bank || !newAccountData.accountNumber || !newAccountData.accountHolder) {
      alert('모든 정보를 입력해주세요.');
      return;
    }
    setIsConfirmDialogOpen(true);
  };

  const confirmChange = async () => {
    setIsLoading(true);
    try {
      // Here you would typically send the data to your backend
      // For now, we'll simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setHasExistingAccount(true);
      setCurrentAccountData(newAccountData);
      alert('계좌 정보가 성공적으로 변경되었습니다.');
      setIsDialogOpen(false);
      setIsConfirmDialogOpen(false);
    } catch (error) {
      console.error('에러 발생:', error);
      alert('계좌 정보 변경 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">판매 정산 계좌</h1>
      
      {hasExistingAccount ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">은행명</label>
            <p className="text-base font-medium">{currentAccountData.bank}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">계좌번호</label>
            <p className="text-base font-medium">{currentAccountData.accountNumber}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">예금주</label>
            <p className="text-base font-medium">{currentAccountData.accountHolder}</p>
          </div>

          <Button 
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            판매 정산 계좌 변경하기
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-base">현재 등록된 판매 정산 계좌가 없습니다. 판매 정산 계좌를 등록해주세요.</p>
          <Button 
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            판매 정산 계좌 등록하기
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {hasExistingAccount ? "판매 정산 계좌 변경" : "판매 정산 계좌 등록"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewAccountSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">은행명</label>
              <Select 
                onValueChange={(value) => setNewAccountData(prev => ({ ...prev, bank: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KB국민은행">KB국민은행</SelectItem>
                  <SelectItem value="신한은행">신한은행</SelectItem>
                  <SelectItem value="하나은행">하나은행</SelectItem>
                  <SelectItem value="우리은행">우리은행</SelectItem>
                  <SelectItem value="IBK기업은행">IBK기업은행</SelectItem>
                  <SelectItem value="NH농협은행">NH농협은행</SelectItem>
                  <SelectItem value="수협은행">수협은행</SelectItem>
                  <SelectItem value="한국산업은행">한국산업은행</SelectItem>
                  <SelectItem value="부산은행">부산은행</SelectItem>
                  <SelectItem value="경남은행">경남은행</SelectItem>
                  <SelectItem value="대구은행">대구은행</SelectItem>
                  <SelectItem value="광주은행">광주은행</SelectItem>
                  <SelectItem value="전북은행">전북은행</SelectItem>
                  <SelectItem value="제주은행">제주은행</SelectItem>
                  <SelectItem value="케이뱅크">케이뱅크</SelectItem>
                  <SelectItem value="카카오뱅크">카카오뱅크</SelectItem>
                  <SelectItem value="토스뱅크">토스뱅크</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">계좌번호</label>
              <Input 
                placeholder="- 없이 입력하세요"
                value={newAccountData.accountNumber}
                onChange={(e) => setNewAccountData(prev => ({ ...prev, accountNumber: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">예금주</label>
              <Input 
                placeholder="예금주명을 정확히 입력하세요"
                value={newAccountData.accountHolder}
                onChange={(e) => setNewAccountData(prev => ({ ...prev, accountHolder: e.target.value }))}
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-[#F15746] hover:bg-[#F15746]/90 text-white"
              disabled={isLoading || !newAccountData.bank || !newAccountData.accountNumber || !newAccountData.accountHolder}
            >
              저장하기
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">판매 정산 계좌 변경</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">현재 등록된 계좌 정보:</h3>
              <p>은행명: {currentAccountData.bank}</p>
              <p>계좌번호: {currentAccountData.accountNumber}</p>
              <p>예금주: {currentAccountData.accountHolder}</p>
            </div>
            <div>
              <h3 className="font-medium">변경할 계좌 정보:</h3>
              <p>은행명: {newAccountData.bank}</p>
              <p>계좌번호: {newAccountData.accountNumber}</p>
              <p>예금주: {newAccountData.accountHolder}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsConfirmDialogOpen(false)}>취소</Button>
            <Button onClick={confirmChange} className="bg-[#F15746] hover:bg-[#F15746]/90 text-white">
              저장하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TopButton />
    </div>
  )
}

