'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Layout from "@/components/layout"
import Link from "next/link"
import { toast } from 'react-hot-toast'

interface CartItem {
  id: number
  productId: number
  optionId: number
  name: string
  brand: string
  price: number
  image: string
  size: string
  quantity: number
  stockQuantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setCartItems([]);
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const response = await fetch(`${apiUrl}/api/cart`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('jwtToken');
            toast.error('로그인이 만료되었습니다. 다시 로그인해주세요.');
            return;
          }
          throw new Error('장바구니 조회에 실패했습니다');
        }

        const data = await response.json();
        setCartItems(data.items || []);
        setTotalPrice(data.items.reduce((sum: number, item: CartItem) => 
          sum + (item.price * item.quantity), 0
        ));
      } catch (error) {
        console.error('장바구니 조회 오류:', error);
        toast.error('장바구니 조회에 실패했습니다');
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = async (optionId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        toast.error('로그인이 필요한 서비스입니다.');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          optionId: optionId,
          quantity: newQuantity
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '수량 변경에 실패했습니다');
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart.items);
      setTotalPrice(updatedCart.items.reduce((sum: number, item: CartItem) => 
        sum + (item.price * item.quantity), 0
      ));
    } catch (error) {
      console.error('수량 변경 오류:', error);
      toast.error(error instanceof Error ? error.message : '수량 변경에 실패했습니다');
    }
  };

  const removeItem = async (optionId: number) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        toast.error('로그인이 필요한 서비스입니다.');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          optionId: optionId
        })
      });

      if (!response.ok) {
        throw new Error('상품 삭제에 실패했습니다');
      }

      const updatedCart = await response.json();
      setCartItems(updatedCart.items);
      setTotalPrice(updatedCart.items.reduce((sum: number, item: CartItem) => 
        sum + (item.price * item.quantity), 0
      ));
      toast.success('상품이 삭제되었습니다');
    } catch (error) {
      console.error('상품 삭제 오류:', error);
      toast.error('상품 삭제에 실패했습니다');
    }
  };

  return (
    <Layout showSidebar={false}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">장바구니</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">장바구니가 비어있습니다</p>
            <Link href="/">
              <Button>쇼핑 계속하기</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <Card key={`${item.id}-${item.size}`} className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.brand}</p>
                          <p className="text-sm text-gray-500">사이즈: {item.size}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.optionId)}
                          className="text-red-500 text-sm"
                        >
                          삭제
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.optionId, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.optionId, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <p className="font-bold">
                          {(item.price * item.quantity).toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Card className="p-4">
                <h2 className="font-bold mb-4">주문 요약</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>상품 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span>무료</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>총 결제 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  구매하기
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

