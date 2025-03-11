"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/admin-site-header";
import { MainNav } from "@/components/admin-main-nav";
import { InventoryRegistrationForm } from "@/components/admin-inventory-regisration-form";
import { Button } from "@/components/admin-ui/admin-button";

interface InventoryForm {
  brand: string;
  name: string;
  productNumber: string;
  color: string;
  size: string;
  quantity: number;
  warehouseLocation: string;
  stockStatus: string;
  inventoryLocation: string;
  inventoryStatus: string;
}

export default function RegisterInventoryPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState<InventoryForm>({
    brand: "",
    name: "",
    productNumber: "",
    color: "",
    size: "",
    quantity: 0,
    warehouseLocation: "",
    stockStatus: "",
    inventoryLocation: "",
    inventoryStatus: "",
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setPreview(result);
        }
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/inventory/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("이미지 업로드에 실패했습니다");

      const data = await response.json();
      setFormData((prev) => ({ ...prev, image: data.imageUrl }));
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      alert("이미지 업로드에 실패했습니다");
    }
  };

  const handleRegister = async (inventoryData: InventoryForm) => {
    setIsRegistering(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inventoryData),
      });

      if (!response.ok) throw new Error("재고 등록에 실패했습니다");

      alert("재고가 성공적으로 등록되었습니다");
      router.push("/admin/inventory");
    } catch (error) {
      console.error("재고 등록 오류:", error);
      alert("재고 등록에 실패했습니다");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="flex">
        <aside className="w-64 border-r min-h-[calc(100vh-3.5rem)] p-4">
          <MainNav />
        </aside>
        <main className="flex-1 p-6 bg-gray-50 flex flex-col">
          <div className="flex-grow">
            <h1 className="text-lg font-bold mb-6">재고 항목 등록</h1>
            <InventoryRegistrationForm 
              onRegister={(inventoryData) => handleRegister(inventoryData)} 
            />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button 
              className="w-24 bg-red-500 hover:bg-red-600" 
              onClick={() => handleRegister(formData)}
              disabled={isRegistering}
            >
              {isRegistering ? "등록 중..." : "등록"}
            </Button>
            <Button 
              variant="outline" 
              className="w-24"
              onClick={() => router.push("/admin/inventory")}
            >
              닫기
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
