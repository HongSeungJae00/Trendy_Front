'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/admin-site-header';
import { MainNav } from '@/components/admin-main-nav';
import { ProductEditForm } from '@/components/admin-product-edit-form';
import { Button } from '@/components/admin-ui/admin-button';
import { toast } from 'react-hot-toast';

interface ProductData {
  id: string;
  brand: string;
  name: string;
  number: string;
  size: string;
  gender: string;
  stock: string;
  quantity: number;
  price: number;
  color: string;
  image: string | null;
}

export default function ProductEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [productDetails, setProductDetails] = useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/api/products/${params.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('상품 정보를 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setProductDetails(data);
        setError(null);
      } catch (error) {
        console.error('상품 정보 조회 오류:', error);
      }
    };

    fetchProductDetails();
  }, [params.id]);

  const handleUpdate = async (updatedInfo: ProductData) => {
    setIsUpdating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedInfo),
      });

      if (!response.ok) {
        throw new Error('상품 정보 업데이트에 실패했습니다.');
      }

      toast.success('상품 정보가 성공적으로 업데이트되었습니다.');
      router.push('/admin/products');
    } catch (error) {
      console.error('상품 정보 업데이트 오류:', error);
      toast.error('상품 정보 업데이트에 실패했습니다.');
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
          {productDetails ? (
            <>
              <div className="flex-grow">
                <h1 className="text-lg font-bold mb-6">상품 수정</h1>
                <ProductEditForm
                  productId={params.id}
                  initialData={productDetails}
                  onUpdate={handleUpdate}
                  updatedData={productDetails}
                />
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="w-24"
                  onClick={() => router.push('/admin/products')}
                >
                  닫기
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="text-red-500 mb-4">
                상품 정보를 불러오는데 실패했습니다.
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/admin/products')}
              >
                상품 목록으로 돌아가기
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}