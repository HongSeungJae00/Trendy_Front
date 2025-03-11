"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/admin-site-header";
import { MainNav } from "@/components/admin-main-nav";
import { MemberInfoForm } from "@/components/admin-member-info-form";
import { Button } from "@/components/admin-ui/admin-button";
import { toast } from "react-hot-toast";

interface MemberDetails {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function MemberInfoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [memberDetails, setMemberDetails] = useState<MemberDetails | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const response = await fetch(`${apiUrl}/api/members/${params.id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("회원 정보를 불러오는데 실패했습니다.");
        }

        const data = await response.json();
        setMemberDetails(data);
        setError(null);
      } catch (error) {
        console.error("회원 정보 조회 오류:", error);
      }
    };

    fetchMemberDetails();
  }, [params.id]);

  const handleUpdate = async (updatedInfo: MemberDetails) => {
    setIsUpdating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/members/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedInfo),
      });

      if (!response.ok) {
        throw new Error("회원 정보 업데이트에 실패했습니다.");
      }

      toast.success("회원 정보가 성공적으로 업데이트되었습니다.");
      router.push("/admin/members");
    } catch (error) {
      console.error("회원 정보 업데이트 오류:", error);
      toast.error("회원 정보 업데이트에 실패했습니다.");
    } finally {
      setIsUpdating(false);
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
          {error && (
            <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          {memberDetails ? (
            <>
              <div className="flex-grow">
                <h1 className="text-lg font-bold mb-6">회원 상세 정보</h1>
                <MemberInfoForm
                  initialData={memberDetails}
                  onUpdate={handleUpdate}
                />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  className="w-24 bg-red-500 hover:bg-red-600"
                  onClick={() => handleUpdate(memberDetails)}
                  disabled={isUpdating}
                >
                  {isUpdating ? "수정 중..." : "수정"}
                </Button>
                <Button
                  variant="outline"
                  className="w-24"
                  onClick={() => router.push("/admin/members")}
                >
                  닫기
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="text-red-500 mb-4">
                회원 정보를 불러오는데 실패했습니다.
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/members")}
              >
                회원 목록으로 돌아가기
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
