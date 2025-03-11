'use client'

import { useEffect, useRef, useState } from 'react'

interface Store {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  hours: string;
}

interface NaverMapProps {
  stores: Store[];
  onStoreSelect?: (storeId: number) => void;
  onMapLoad?: (map: any) => void;
}

export default function NaverMap({ stores, onStoreSelect, onMapLoad }: NaverMapProps) {
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 현재 위치로 이동하는 함수
  const moveToCurrentLocation = () => {
    const { naver } = window as any;
    if (!mapRef.current) return;

    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = new naver.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          const zoom = mapRef.current.getZoom();
          mapRef.current.setZoom(zoom, false);
          mapRef.current.panTo(currentLocation);
          setIsLocating(false);
        },
        (error) => {
          console.error('위치 정보를 가져오는데 실패했습니다:', error);
          setIsLocating(false);
          alert('위치 정보를 가져오는데 실패했습니다.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      alert('이 브라우저에서는 위치 정보를 사용할 수 없습니다.');
      setIsLocating(false);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=m0thdgetno`;
    script.async = true;
    script.onload = () => {
      const { naver } = window as any;
      const mapOptions = {
        center: new naver.maps.LatLng(37.5665, 126.9780),
        zoom: 11,
        zoomControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_LEFT
        }
      };
      const map = new naver.maps.Map('map', mapOptions);
      mapRef.current = map;
      
      // 지도 인스턴스를 상위 컴포넌트로 전달
      if (onMapLoad) {
        onMapLoad(map);
      }

      // 현재 위치 버튼 추가
      const locationBtnHtml = `
        <button type="button" class="btn_mylct" style="position:absolute;bottom:30px;right:10px;width:40px;height:40px;border-radius:2px;background-color:white;border:1px solid #ddd;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
          <div style="width:20px;height:20px;background-size:contain;background-repeat:no-repeat;background-image:url('data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"/><circle cx=\\"12\\" cy=\\"12\\" r=\\"3\\"/></svg>');">
            ${isLocating ? '<div class="spinner"></div>' : ''}
          </div>
        </button>
      `;

      const customControl = new naver.maps.CustomControl(locationBtnHtml, {
        position: naver.maps.Position.BOTTOM_RIGHT
      });

      customControl.setMap(map);

      naver.maps.Event.addDOMListener(
        customControl.getElement(),
        'click',
        moveToCurrentLocation
      );

      // 매장 마커 생성
      markersRef.current = stores.map(store => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(store.lat, store.lng),
          map,
          title: store.name,
          clickable: true
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
          anchorSize: new naver.maps.Size(10, 10),
        });

        naver.maps.Event.addListener(marker, 'mouseover', () => {
          infoWindow.open(map, marker);
        });

        naver.maps.Event.addListener(marker, 'mouseout', () => {
          infoWindow.close();
        });

        if (onStoreSelect) {
          naver.maps.Event.addListener(marker, 'click', () => {
            const zoom = map.getZoom();
            const position = marker.getPosition();
            map.setZoom(zoom, false);
            map.panTo(position);
            onStoreSelect(store.id);
          });
        }

        return { marker, infoWindow, storeId: store.id };
      });
    };
    document.body.appendChild(script);

    return () => {
      const mapScript = document.querySelector('script[src*="maps.js"]');
      if (mapScript) {
        document.body.removeChild(mapScript);
      }
      // 마커와 정보창 제거
      markersRef.current.forEach(({ marker, infoWindow }) => {
        if (marker) marker.setMap(null);
        if (infoWindow) infoWindow.close();
      });
      markersRef.current = [];
    };
  }, [stores, onStoreSelect, onMapLoad, isLocating]);

  // 스타일 추가
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        position: absolute;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .btn_mylct:hover {
        background-color: #f8f8f8;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div id="map" style={{ width: '100%', height: '100%' }} />
  );
}

