import React, { useState } from 'react';
import { Button } from '@/components/admin-ui/admin-button';
import { Input } from '@/components/admin-ui/admin-input';
import { Label } from '@/components/admin-ui/admin-label';
import { Textarea } from '@/components/admin-ui/admin-textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/admin-ui/admin-select';

interface DeliveryDetails {
    id: string;
    orderNumber: string;
    customerName: string;
    address: string;
    productType: string;
    courier: string;
    trackingNumber: string;
    deliveryDate: string;
    status: string;
    notes: string;
}

interface DeliveryEditFormProps {
    deliveryId: string;
    initialData: DeliveryDetails;
    onUpdate: (updatedInfo: DeliveryDetails) => Promise<void>;
    isUpdating: boolean;
}

export function DeliveryEditForm({
    initialData,
    onUpdate,
    isUpdating,
}: DeliveryEditFormProps) {
    const [formData, setFormData] = useState<DeliveryDetails>(initialData);

    const handleChange = (field: keyof DeliveryDetails, value: string) => {
    setFormData((prev) => ({
        ...prev,
        [field]: value,
    }));
};

    const handleSubmit = async () => {
    await onUpdate(formData);
};

    return (
    <div className="grid gap-6">
      {/* 주문번호 */}
        <div className="space-y-2">
        <Label htmlFor="orderNumber">주문번호</Label>
        <Input
            id="orderNumber"
            value={formData.orderNumber}
            onChange={(e) => handleChange('orderNumber', e.target.value)}
        />
        </div>

      {/* 기타 폼 필드 */}
      {/* 동일한 구조로 나머지 필드를 추가 */}

        <Button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600"
        disabled={isUpdating}
        >
        {isUpdating ? '수정 중...' : '수정'}
        </Button>
        </div>
    );
}
