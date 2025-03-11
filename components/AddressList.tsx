'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { AddressForm } from "./AddressForm"

const MAX_ADDRESSES = 2;

interface Address {
  id: number;
  name: string;
  phone: string;
  postalCode: string;
  address: string;
  detailAddress: string;
}

// 개발 환경에서 사용할 더미 데이터
const dummyAddresses: Address[] = [
  {
    id: 1,
    name: "김동근",
    phone: "010-8814-1260",
    postalCode: "10578",
    address: "경기 고양시 덕양구 오금로 41 (오금동)",
    detailAddress: "위온하우스 101호"
  },
  {
    id: 2,
    name: "김동근",
    phone: "010-8814-1260",
    postalCode: "13612",
    address: "경기 성남시 분당구 내정로11번길 13 (정자동)",
    detailAddress: "2층 202호"
  },
  {
    id: 3,
    name: "김동근",
    phone: "010-8814-1260",
    postalCode: "13167",
    address: "경기 성남시 중원구 금광동 3362",
    detailAddress: "3층"
  }
];

export function AddressList() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    console.log('AddressList component mounted');
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      // First, try to get addresses from local storage
      const storedAddresses = localStorage.getItem('addresses');
      if (storedAddresses) {
        setAddresses(JSON.parse(storedAddresses));
        console.log('Addresses loaded from local storage');
        return;
      }

      // If not in local storage, try to fetch from API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/addresses`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("서버로부터 유효한 응답을 받지 못했습니다.");
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from API');
      }
      setAddresses(data);
      // Save to local storage for future use
      localStorage.setItem('addresses', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching addresses:', error);
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      setError('주소를 불러오는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
      // Use dummy data in development environment
      if (process.env.NODE_ENV === 'development') {
        console.log('Using dummy data in development environment');
        setAddresses(dummyAddresses);
        localStorage.setItem('addresses', JSON.stringify(dummyAddresses));
      } else {
        // Use empty array in production
        setAddresses([]);
      }
    }
  };

  useEffect(() => {
    console.log('Addresses updated:', addresses);
  }, [addresses]);

  useEffect(() => {
    if (selectedAddressId !== null) {
      console.log(`Address ${selectedAddressId} set as default`);
    }
  }, [selectedAddressId]);

  const openAddDialog = () => setIsAddDialogOpen(true);
  const closeAddDialog = () => setIsAddDialogOpen(false);

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setIsEditDialogOpen(true);
  };
  const closeEditDialog = () => {
    setEditingAddress(null);
    setIsEditDialogOpen(false);
  };

  const handleAddressSubmit = async (newAddress: Omit<Address, 'id'>) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddress),
      });
      if (!response.ok) {
        throw new Error('Failed to add address');
      }
      await fetchAddresses();
      closeAddDialog();
    } catch (error) {
      console.error('Error adding address:', error);
      // API 호출 실패 시 로컬에서 처리
      const newId = Math.max(...addresses.map(a => a.id), 0) + 1;
      const newAddressWithId = { ...newAddress, id: newId };
      const updatedAddresses = [...addresses, newAddressWithId];
      setAddresses(updatedAddresses);
      localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
      closeAddDialog();
    }
  };

  const handleAddressEdit = async (editedAddress: Omit<Address, 'id'>) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/addresses/${selectedAddress?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedAddress),
      });

      if (!response.ok) {
        throw new Error('Failed to update address');
      }

      setAddresses(prevAddresses =>
        prevAddresses.map(addr =>
          addr.id === selectedAddress?.id
            ? { ...editedAddress, id: selectedAddress.id }
            : addr
        )
      );
      closeEditDialog();
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const openDeleteDialog = (id: number) => {
    setDeletingAddressId(id);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeletingAddressId(null);
    setIsDeleteDialogOpen(false);
  };

  const handleAddressDelete = async () => {
    if (deletingAddressId) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const response = await fetch(`${apiUrl}/api/addresses/${deletingAddressId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete address');
        }
        await fetchAddresses();
        closeDeleteDialog();
      } catch (error) {
        console.error('Error deleting address:', error);
        // API 호출 실패 시 로컬에서 처리
        const updatedAddresses = addresses.filter(a => a.id !== deletingAddressId);
        setAddresses(updatedAddresses);
        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
        closeDeleteDialog();
      }
    }
  };

  const handleCheckboxChange = (address: Address) => {
    setSelectedAddressId(address.id);
    setSelectedAddress(address);
    setIsPopupVisible(true);
    setTimeout(() => setIsPopupVisible(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">주소록</h1>
        <Button variant="default" size="sm" className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed" onClick={openAddDialog} disabled={addresses.length >= MAX_ADDRESSES} title={addresses.length >= MAX_ADDRESSES ? "최대 주소 개수에 도달했습니다" : "새 배송지 추가"}>
          + 새 배송지 추가
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">오류!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="space-y-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardContent className="p-4 flex flex-col">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold">{address.name}</span>
                </div>
                <div className="text-sm mb-1">{address.phone}</div>
                <div className="text-sm text-gray-600">
                  ({address.postalCode}){address.address} {address.detailAddress}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white"
                    onClick={() => openEditDialog(address)}
                  >
                    수정
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-[#FF0000] hover:bg-[#FF0000]/10 border-[#FF0000]"
                    onClick={() => openDeleteDialog(address.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <Checkbox
                  id={`address-${address.id}`}
                  className="mr-2 rounded-full border-blue-500 text-blue-500 focus:ring-blue-500"
                  checked={selectedAddressId === address.id}
                  onCheckedChange={() => handleCheckboxChange(address)}
                />
                <label
                  htmlFor={`address-${address.id}`}
                  className="text-sm text-gray-600"
                >
                  기본 배송지로 설정
                </label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-red-500 mt-2">기본주소 제외 최대 {MAX_ADDRESSES}개의 주소만 추가할 수 있습니다.</p>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 배송지 추가</DialogTitle>
          </DialogHeader>
          <AddressForm onClose={closeAddDialog} onSubmit={handleAddressSubmit} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>배송지 수정</DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <AddressForm 
              onClose={closeEditDialog} 
              onSubmit={handleAddressEdit} 
              initialAddress={editingAddress}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>주소 삭제</DialogTitle>
          </DialogHeader>
          <p>정말로 이 주소를 삭제하시겠습니까?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={closeDeleteDialog} variant="outline">취소</Button>
            <Button onClick={handleAddressDelete} className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white">삭제</Button>
          </div>
        </DialogContent>
      </Dialog>

      {isPopupVisible && selectedAddress && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg">
          {selectedAddress.address}가 기본 배송지로 선택되었습니다.
        </div>
      )}
    </div>
  )
}

