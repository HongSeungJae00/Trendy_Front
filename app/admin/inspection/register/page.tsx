"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/admin-site-header";
import { MainNav } from "@/components/admin-main-nav";
import { Button } from "@/components/admin-ui/admin-button";
import { Input } from "@/components/admin-ui/admin-input";
import { Label } from "@/components/admin-ui/admin-label";
import { Textarea } from "@/components/admin-ui/admin-textarea";
import { Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin-ui/admin-select";

interface InspectionForm {
  productNumber: string;
  productName: string;
  color: string;
  size: string;
  status: string;
  result: string;
  inspectionDate: string;
  inspector: string;
  notes: string;
  image: string | null;
}

export default function RegisterInspectionPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState<InspectionForm>({
    productNumber: "",
    productName: "",
    color: "",
    size: "",
    status: "",
    result: "",
    inspectionDate: "",
    inspector: "",
    notes: "",
    image: null,
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
      const response = await fetch(`${apiUrl}/api/inspections/upload-image`, {
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

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/inspections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("검수 등록에 실패했습니다");

      alert("검수가 성공적으로 등록되었습니다");
      router.push("/admin/inspection");
    } catch (error) {
      console.error("검수 등록 오류:", error);
      alert("검수 등록에 실패했습니다");
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
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-lg font-semibold mb-6">검수 항목 등록</h1>
          <div className="max-w-5xl mx-auto min-h-[800px]">
            <form
              id="inspectionForm"
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                handleRegister();
              }}
            >
              <div className="grid grid-cols-[300px_1fr] gap-8">
                <div className="border border-dashed rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors relative bg-white">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="mb-2">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-auto"
                        >
                          <path
                            d="M21 15V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V15M17 8L12 3M12 3L7 8M12 3V15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="text-sm">상품 이미지 추가</div>
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-start w-full space-y-2">
                      <Label htmlFor="productNumber">상품번호</Label>
                      <Input
                        id="productNumber"
                        value={formData.productNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            productNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col items-start w-full space-y-2">
                      <Label htmlFor="productName">상품명</Label>
                      <Input
                        id="productName"
                        value={formData.productName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            productName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-col items-start w-full space-y-2">
                      <Label htmlFor="color">컬러</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, color: value }))
                        }
                      >
                        <SelectTrigger id="color">
                          <SelectValue placeholder="컬러 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="black">블랙</SelectItem>
                          <SelectItem value="white">화이트</SelectItem>
                          <SelectItem value="gray">그레이</SelectItem>
                          <SelectItem value="blue">블루</SelectItem>
                          <SelectItem value="red">레드</SelectItem>
                          <SelectItem value="purple">퍼플</SelectItem>
                          <SelectItem value="yellow">옐로우</SelectItem>
                          <SelectItem value="brown">브라운</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col items-start w-full space-y-2">
                      <Label htmlFor="size">사이즈</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, size: value }))
                        }
                      >
                        <SelectTrigger id="size">
                          <SelectValue placeholder="사이즈 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="230">230</SelectItem>
                          <SelectItem value="240">240</SelectItem>
                          <SelectItem value="250">250</SelectItem>
                          <SelectItem value="260">260</SelectItem>
                          <SelectItem value="270">270</SelectItem>
                          <SelectItem value="280">280</SelectItem>
                          <SelectItem value="290">290</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col items-start w-full space-y-2">
                      <Label htmlFor="status">상태</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="waiting">검수대기</SelectItem>
                          <SelectItem value="in_progress">검수중</SelectItem>
                          <SelectItem value="completed">검수완료</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col items-start w-full space-y-2">
                      <Label htmlFor="result">결과</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, result: value }))
                        }
                      >
                        <SelectTrigger id="result">
                          <SelectValue placeholder="결과 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pass">합격</SelectItem>
                          <SelectItem value="fail">불합격</SelectItem>
                          <SelectItem value="pending">보류</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col items-start w-full space-y-2">
                      <Label htmlFor="inspectionDate">검수일</Label>
                      <div className="relative w-full">
                        <Input
                          id="inspectionDate"
                          value={formData.inspectionDate}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              inspectionDate: e.target.value,
                            }))
                          }
                          placeholder="년-월-일"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start w-full space-y-2">
                      <Label htmlFor="inspector">검수자</Label>
                      <Input
                        id="inspector"
                        value={formData.inspector}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            inspector: e.target.value,
                          }))
                        }
                        placeholder="검수자 이름을 입력하세요"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start w-full space-y-2">
                    <Label htmlFor="notes">비고</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="추가 정보를 입력하세요"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6 pb-20">
                <Button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 px-8 py-2 rounded-md"
                  disabled={isRegistering}
                >
                  {isRegistering ? "등록 중..." : "등록"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/admin/inspection")}
                  className="px-8 py-2 rounded-md"
                >
                  닫기
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
