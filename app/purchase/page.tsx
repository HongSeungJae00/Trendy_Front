'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import NaverMap from "@/components/NaverMap"

interface PurchaseItem {
  productCode: string
  name: string
  brand: string
  image: string
  size: string
  quantity: number
  price: number
}

// PortOne SDK 타입 선언
declare global {
  interface Window {
    IMP: any;  // v1 SDK는 IMP 객체를 사용
  }
}

// 매장 데이터
const stores = [
  {
    id: 1,
    name: 'Trendy 롯데월드몰',
    address: '서울 송파구 올림픽로 300 롯데월드몰',
    lat: 37.5125,
    lng: 127.1025,
    hours: '10:30 - 22:00',
  },
  {
    id: 2,
    name: 'Trendy 더현대서울',
    address: '서울 영등포구 여의대로 108 더현대 서울',
    lat: 37.5259,
    lng: 126.9284,
    hours: '10:30 - 20:00',
  },
  {
    id: 3,
    name: 'Trendy 신세계강남',
    address: '서울 서초구 신반포로 176 신세계백화점 강남점',
    lat: 37.5051,
    lng: 127.0244,
    hours: '10:30 - 20:00',
  },
];

export default function PurchasePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('delivery')
  const [selectedPayment, setSelectedPayment] = useState<string>('')
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([])
  const [selectedStore, setSelectedStore] = useState<number | null>(null)
  const [popupMessage, setPopupMessage] = useState<string | null>(null)
  const initialized = useRef(false)

  const showPopup = (message: string) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(null), 2000);
  };

  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      return false;
    }

    try {
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedPayload.exp <= currentTime) {
        localStorage.removeItem('jwtToken');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('jwtToken');
      return false;
    }
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!checkLoginStatus()) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }

    const purchaseData = localStorage.getItem('purchaseItems')
    if (!purchaseData) {
      router.push('/')
      return
    }
    setPurchaseItems(JSON.parse(purchaseData))

    // v1 SDK 초기화
    if (window.IMP) {
      window.IMP.init("imp55088383");
    } else {
      console.error("포트원 SDK가 로드되지 않았습니다.");
    }
  }, [router, checkLoginStatus])

  const total = purchaseItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const finalTotal = total + (activeTab === 'delivery' ? 3000 : 0)  // 배송비 3000원 추가

  // 결제 요청 함수
  const requestPayment = useCallback(async (paymentType: string) => {
    if (!purchaseItems.length) return;
    if (!window.IMP) {
      alert('결제 모듈이 로드되지 않았습니다.');
      return;
    }

    const totalAmount = purchaseItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    try {
        window.IMP.request_pay({
            pg: paymentType === 'kakaopay' ? 'kakaopay.TC0ONETIME' : 'tosspay',
            pay_method: 'card',
            merchant_uid: `mid_${Date.now()}`,
            name: `${purchaseItems[0].name} 외 ${purchaseItems.length - 1}건`,
            amount: totalAmount,
            buyer_email: 'test@test.com',
            buyer_name: '테스터',
            buyer_tel: '010-0000-0000',
            buyer_addr: '서울특별시 강남구 삼성동',
            buyer_postcode: '123-456'
        }, async function(rsp: any) {
            if (rsp.success) {
                // 결제 성공 시 서버에 결제 정보 저장
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
                const verifyResponse = await fetch(`${apiUrl}/payment/complete`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        imp_uid: rsp.imp_uid,
                        paymentType,
                        orderId: rsp.merchant_uid,
                        amount: totalAmount,
                        items: purchaseItems
                    }),
                });

                if (!verifyResponse.ok) {
                    throw new Error('결제 정보 저장 실패');
                }

                alert('결제가 완료되었습니다.');
                localStorage.removeItem('purchaseItems');
                router.push('/');
            } else {
                alert(`결제 실패: ${rsp.error_msg}`);
            }
        });

    } catch (error) {
        console.error('결제 오류:', error);
        alert('결제 중 오류가 발생했습니다.');
    }
  }, [purchaseItems, router]);

  if (!purchaseItems.length) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {popupMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-4 rounded shadow text-center z-50">
          {popupMessage}
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-bold mb-6">주문 상품</h2>
          {purchaseItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-4 mb-4 pb-4 border-b last:border-b-0">
              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.brand}</p>
                <p className="text-gray-600">{item.name}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>사이즈: {item.size}, 수량: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {(item.price * item.quantity).toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </Card>

        <div className="mt-8">
          <Tabs defaultValue="delivery" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 bg-gray-200 p-0">
              <TabsTrigger 
                value="delivery" 
                onClick={() => setActiveTab('delivery')}
                className="w-full py-3 data-[state=active]:bg-red-600 data-[state=active]:text-white transition-colors"
              >
                배송
              </TabsTrigger>
              <TabsTrigger 
                value="pickup" 
                onClick={() => setActiveTab('pickup')}
                className="w-full py-3 data-[state=active]:bg-red-600 data-[state=active]:text-white transition-colors"
              >
                픽업
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === 'delivery' && (
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">배송지</h2>
              <Button variant="outline" size="sm">배송지 목록</Button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="우편번호" className="w-32" readOnly />
                <Button variant="outline">주소 검색</Button>
              </div>
              <Input placeholder="기본주소" readOnly />
              <Input placeholder="상세주소를 입력하세요" />
              <div className="flex gap-4">
                <Input placeholder="받는 분" />
                <Input placeholder="연락처" />
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'pickup' && (
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">픽업 장소</h2>
            </div>
            <div className="h-[300px] bg-gray-100 rounded-lg mb-6">
              <NaverMap 
                stores={stores}
                onStoreSelect={(storeId) => {
                  setSelectedStore(storeId);
                  const store = stores.find(s => s.id === storeId);
                  if (store) {
                    showPopup(`${store.name}이(가) 선택되었습니다.`);
                  }
                }}
              />
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {stores.map((store) => (
                <div 
                  key={store.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedStore === store.id ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-900 border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedStore(store.id);
                    showPopup(`${store.name}이(가) 선택되었습니다.`);
                  }}
                >
                  <p className="font-semibold">{store.name}</p>
                  <p className={selectedStore === store.id ? 'text-white' : 'text-gray-900'}>{store.address}</p>
                  <p className={selectedStore === store.id ? 'text-white' : 'text-gray-900'}>영업시간: {store.hours}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-6 mb-8">
          <h2 className="text-lg font-bold mb-6">결제 수단</h2>
          <div className="space-y-4">
            <div 
              className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                selectedPayment === 'kakaopay' ? 'border-red-500 bg-red-50' : ''
              }`}
              onClick={() => setSelectedPayment('kakaopay')}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#FFE812"/>
                <path d="M12 5C8.13401 5 5 7.79761 5 11.2455C5 13.5646 6.42348 15.6106 8.5 16.7256V20L11.9133 17.7094C11.9422 17.7094 11.9711 17.7104 12 17.7104C15.866 17.7104 19 14.9128 19 11.4649C19 8.01704 15.866 5.21945 12 5Z" fill="black"/>
              </svg>
              <div>
                <p className="font-semibold">카카오페이</p>
                <p className="text-sm text-gray-500">카카오페이로 간편결제</p>
              </div>
            </div>
            <div 
              className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                selectedPayment === 'tosspay' ? 'border-red-500 bg-red-50' : ''
              }`}
              onClick={() => setSelectedPayment('tosspay')}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#0064FF"/>
                <path d="M7.81836 7.81836H16.1816V16.1816H7.81836V7.81836Z" fill="white"/>
                <path d="M12 7.81836L16.1816 12L12 16.1816L7.81836 12L12 7.81836Z" fill="#0064FF"/>
              </svg>
              <div>
                <p className="font-semibold">토스페이</p>
                <p className="text-sm text-gray-500">토스페이로 간편결제</p>
              </div>
            </div>
          </div>
        </Card>

        <Button 
          className="w-full h-16 text-lg bg-red-500 hover:bg-red-600 text-white"
          onClick={() => {
            if (!selectedPayment) {
              alert('결제 수단을 선택해주세요.');
              return;
            }
            if (activeTab === 'pickup' && !selectedStore) {
              alert('픽업 매장을 선택해주세요.');
              return;
            }
            requestPayment(selectedPayment);
          }}
          disabled={!selectedPayment || (activeTab === 'pickup' && !selectedStore)}
        >
          {activeTab === 'delivery' && (
            <span>
              상품 {total.toLocaleString()}원 + 배송비 3,000원 = {finalTotal.toLocaleString()}원
            </span>
          )}
          {activeTab === 'pickup' && (
            <span>
              상품 {total.toLocaleString()}원
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}

