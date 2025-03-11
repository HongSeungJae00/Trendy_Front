'use client'

import { useState, useRef, useEffect } from 'react'
import CenterSidebar from "@/components/center_sidebar"
import NaverMap from "@/components/NaverMap"
import TopButton from "@/components/top-button"
import { Card } from "@/components/ui/card"

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

export default function StoreLocatorPage() {
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  const showPopup = (message: string) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(null), 2000);
  };

  useEffect(() => {
    if (mapRef.current) {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=m0thdgetno`;
      script.async = true;
      script.onload = () => {
        const { naver } = window as any;
        const mapOptions = {
          center: new naver.maps.LatLng(37.5665, 126.9780),
          zoom: 13,
          zoomControl: true,
          zoomControlOptions: {
            position: naver.maps.Position.TOP_LEFT
          }
        };
        const newMap = new naver.maps.Map(mapRef.current, mapOptions);
        setMap(newMap);

        // 모든 매장에 대한 마커 생성
        const newMarkers = stores.map(store => {
          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(store.lat, store.lng),
            map: newMap,
            title: store.name,
          });

          const infoWindow = new naver.maps.InfoWindow({
            content: `
              <div style="padding:10px; font-size:14px;">
                <strong>${store.name}</strong><br />
                ${store.address}<br />
                영업시간: ${store.hours}
              </div>
            `,
            backgroundColor: "#fff",
            borderColor: "#ccc",
            borderWidth: 1,
          });

          naver.maps.Event.addListener(marker, 'click', () => {
            setSelectedStore(store.id);
            showPopup(`${store.name}이(가) 선택되었습니다.`);
          });

          naver.maps.Event.addListener(marker, 'mouseover', () => {
            infoWindow.open(newMap, marker);
          });

          naver.maps.Event.addListener(marker, 'mouseout', () => {
            infoWindow.close();
          });

          return { marker, infoWindow };
        });

        setMarkers(newMarkers);
      };
      document.head.appendChild(script);
    }
  }, []);

  // 선택된 매장이 변경될 때 지도 중심 이동 (줌 레벨 유지)
  useEffect(() => {
    if (map && selectedStore) {
      const store = stores.find(s => s.id === selectedStore);
      if (store) {
        const { naver } = window as any;
        const position = new naver.maps.LatLng(store.lat, store.lng);
        map.setCenter(position); // 줌 레벨 변경 없이 중심점만 이동
      }
    }
  }, [selectedStore, map]);

  return (
    <div className="min-h-screen">
      {popupMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-4 rounded shadow text-center z-50">
          {popupMessage}
        </div>
      )}
      <div className="flex">
        <CenterSidebar />
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">매장위치 안내</h2>
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">매장 선택</h2>
            </div>
            <div className="h-[500px] bg-gray-100 rounded-lg mb-6" ref={mapRef}>
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
        </div>
      </div>
      <TopButton />
    </div>
  )
}

