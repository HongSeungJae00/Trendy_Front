import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Address {
  id?: number;
  name: string;
  phone: string;
  postalCode: string;
  address: string;
  detailAddress: string;
}

interface AddressFormProps {
  onClose: () => void;
  onSubmit: (address: Omit<Address, 'id'>) => void;
  initialAddress?: Address;
}

export function AddressForm({ onClose, onSubmit, initialAddress }: AddressFormProps) {
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    postalCode: '',
    address: '',
    detailAddress: '',
  });

  useEffect(() => {
    if (initialAddress) {
      setFormData(initialAddress);
    }
  }, [initialAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">이름</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="phone">전화번호</Label>
        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="postalCode">우편번호</Label>
        <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="address">주소</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="detailAddress">상세주소</Label>
        <Input id="detailAddress" name="detailAddress" value={formData.detailAddress} onChange={handleChange} />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onClose} variant="outline">취소</Button>
        <Button type="submit" className="bg-[#FF0000] hover:bg-[#FF0000]/90 text-white">
          {initialAddress ? '수정' : '저장'}
        </Button>
      </div>
    </form>
  );
}

