'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterSidebar } from "@/components/filter-sidebar";
import { TrendyDrawPopup } from "@/components/trendy-draw-popup";
import Layout from "@/components/layout";
import ProductDetail from "@/components/product-detail";
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';


interface Product {
  id: number;
  name: string;
  modelId: string;
  brand: string;
  price: number;
  imageUrl: string;
  image: string;
  likeCount: number;
}

// TrendyDrawPopup 컴포넌트에 props 타입 추가
interface TrendyDrawPopupProps {
  isOpen: boolean;
  onClose: () => void
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    brand: [],
    color: [],
    size: [],
    price: []
  });
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isDrawPopupOpen, setIsDrawPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('전체');

  const changeSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
  };

  const handleFilterClick = (filter: string) => {
    if (filter === '전체') {
      resetFilters();
      setSidebarOpen(false);
      setFilteredProducts(products);
    } else {
      setActiveFilter(filter);
      setActiveTab(filter);
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % products.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [products.length]);

  const addToCart = async (product: Product) => {
    // 로그인 상태 체크
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success('장바구니에 추가되었습니다.');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('장바구니에 추가하는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // 전체 상품 불러오기
  const fetchProducts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('상품 데이터를 가져오는 데 실패했습니다.');
    }
  };

  // 검색 필터
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  // 컴포넌트 마운트 시 전체 상품 로드
  useEffect(() => {
    fetchProducts();
  }, []);

  // 정렬 함수
  const sortProducts = (products: Product[], sortType: string, order: 'asc' | 'desc') => {
    const sortedProducts = [...products];
    
    switch (sortType) {
      case '이름':
        return sortedProducts.sort((a, b) => {
          return order === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        });
      
      case '좋아요':
        return sortedProducts.sort((a, b) => {
          return order === 'asc'
            ? (a.likeCount || 0) - (b.likeCount || 0)
            : (b.likeCount || 0) - (a.likeCount || 0);
        });
      
      case '가격':
        return sortedProducts.sort((a, b) => {
          return order === 'asc'
            ? a.price - b.price
            : b.price - a.price;
        });
      
      default:
        return sortedProducts;
    }
  };

  // 필터 적용
  const applyFilters = async (filterType: string, selectedOptions: any) => {
    try {
      // 정렬 필터 처리
      if (filterType === '정렬') {
        const { sortBy, sortOrder } = selectedOptions;
        setSortBy(sortBy);
        setSortOrder(sortOrder);
        
        const sortedProducts = sortProducts(
          filteredProducts,
          sortBy,
          sortOrder
        );
        
        setFilteredProducts(sortedProducts);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const updatedFilterOptions = {
        ...filterOptions,
        ...selectedOptions
      };
      
      setFilterOptions(updatedFilterOptions);

      // 필터 데이터 형식 수정
      const filterData: Record<string, string[]> = {};
      
      // 유효한 필터만 포함
      Object.entries(updatedFilterOptions).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          // 빈 문자열이나 null/undefined 값 제외
          const validValues = value
            .map(String)
            .filter(v => v && v.trim().length > 0);
          
          if (validValues.length > 0) {
            filterData[key] = validValues;
          }
        }
      });

      // 필터가 비어있는 경우 전체 상품 반환
      if (Object.keys(filterData).length === 0) {
        setFilteredProducts(products);
        return;
      }

      console.log('필터 요청 데이터:', JSON.stringify(filterData, null, 2));

      try {
        const response = await fetch(`${apiUrl}/api/products/filter`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(filterData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('서버 오류 응답:', errorText);
          throw new Error('서버에서 오류가 발생했습니다.');
        }

        const responseText = await response.text();
        
        if (!responseText.trim()) {
          setFilteredProducts([]);
          toast.info('검색 결과가 없습니다.');
          return;
        }

        const filteredData = JSON.parse(responseText);
        
        if (!Array.isArray(filteredData)) {
          console.error('잘못된 응답 형식:', filteredData);
          throw new Error('서버에서 잘못된 형식의 데이터를 반환했습니다.');
        }

        if (filteredData.length === 0) {
          toast.info('검색 결과가 없습니다.');
          setFilteredProducts([]);
        } else {
          const finalData = sortBy 
            ? sortProducts(filteredData, sortBy, sortOrder)
            : filteredData;
          
          setFilteredProducts(finalData);
          toast.success(`${finalData.length}개의 상품이 검색되었습니다.`);
        }
      } catch (error) {
        console.error('필터 처리 중 오류:', error);
        setFilteredProducts(products);
        throw error;
      }
    } catch (error) {
      console.error('최종 오류:', error);
      toast.error(error instanceof Error ? error.message : '필터 적용 중 오류가 발생했습니다.');
    }
  };

  // 필터 초기화
  const resetFilters = async () => {
    try {
      // 모든 필터 상태 초기화
      setFilterOptions({
        brand: [],
        color: [],
        size: [],
        price: []
      });
      setSortBy('');
      setSortOrder('asc');
      setActiveTab('전체');
      setActiveFilter('');
      setSearchTerm('');
      
      // 전체 상품 다시 로드
      await fetchProducts();
      setFilteredProducts(products);
      toast.success('필터가 초기화되었습니다.');
    } catch (error) {
      console.error('필터 초기화 중 오류 발생:', error);
      toast.error('필터 초기화에 실패했습니다.');
    }
  };

  // 팝업 표시를 위한 useEffect 추가
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('noShowPopup');
    const noShowUntil = localStorage.getItem('noShowUntilDate');
    const currentDate = new Date().getTime();

    if (hasSeenPopup && noShowUntil && currentDate < parseInt(noShowUntil)) {
      return;
    }

    setIsDrawPopupOpen(true);
  }, []);

  // 팝업 닫기 핸들러 추가
  const handleClosePopup = (dontShowForWeek: boolean) => {
    if (dontShowForWeek) {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      localStorage.setItem('noShowPopup', 'true');
      localStorage.setItem('noShowUntilDate', sevenDaysFromNow.getTime().toString());
    }
    setIsDrawPopupOpen(false);
  };

  return (
    <Layout showSidebar={false}>
      <TrendyDrawPopup 
        isOpen={isDrawPopupOpen}
        onClose={handleClosePopup}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-[95%]">
        <div className="relative overflow-hidden max-w-[1200px] mx-auto">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {products.map((product) => (
              <div 
                key={product.id}
                className="w-full flex-shrink-0 grid md:grid-cols-2 gap-8"
              >
                {/* Product Info */}
                <div className="flex flex-col justify-center space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold">{product.name}</h2>
                    <p className="text-gray-600">{product.brand}</p>
                  </div>
                  <div className="text-2xl font-bold">₩{product.price.toLocaleString()}</div>
                  <Button className="w-48 bg-red-500 hover:bg-red-600 text-white" onClick={() => addToCart(product)}>장바구니에 담기</Button>
                </div>

                {/* Product Image */}
                <Card className="overflow-hidden bg-gray-50 p-6 flex items-center justify-center aspect-square w-3/4 mx-auto">
                  <div className="relative w-[98%] h-[98%] flex items-center justify-center">
                    <Image
                      src={product.imageUrl || product.image}
                      alt={product.name}
                      width={450}
                      height={450}
                      className="object-contain max-w-full max-h-full"
                      priority
                    />
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-4 mb-8">
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full mx-1 transition-colors ${
                  currentSlide === index ? 'bg-red-500' : 'bg-red-200'
                }`}
                onClick={() => changeSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* 검색바 */}
        <div className="py-6 flex justify-center max-w-[1200px] mx-auto">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="search" 
              placeholder="원하시는 신발을 검색해보세요" 
              className="w-full pl-10 pr-4 py-2 rounded-full border-gray-200"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* 필터 */}
        <div className="py-6 flex justify-center max-w-[1200px] mx-auto">
          <Tabs value={activeTab} defaultValue="전체" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap justify-center items-center w-full bg-red-500 text-white data-[state=active]:bg-red-600 space-x-4">
              <TabsTrigger 
                value="전체"
                className="rounded-full px-6 py-2"
                onClick={() => handleFilterClick('전체')}
              >
                전체
              </TabsTrigger>
              <TabsTrigger 
                value="브랜드" 
                className="rounded-full px-6 py-2"
                onClick={() => handleFilterClick('브랜드')}
              >
                브랜드
              </TabsTrigger>
              <TabsTrigger 
                value="색상" 
                className="rounded-full px-6 py-2"
                onClick={() => handleFilterClick('색상')}
              >
                색상
              </TabsTrigger>
              <TabsTrigger 
                value="가격" 
                className="rounded-full px-6 py-2"
                onClick={() => handleFilterClick('가격')}
              >
                가격
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center max-w-[1200px] mx-auto">
          {(filteredProducts.length > 0 ? filteredProducts : products).map((product) => (
            <Link 
              href={`/products/${product.id}`} 
              key={product.id}
              className="cursor-pointer"
            >
              <Card className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="aspect-square relative w-full h-64">
                  <Image
                    src={product.imageUrl || product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="font-semibold">{product.brand}</div>
                  <div className="text-sm text-gray-600 mt-1">{product.name}</div>
                  <div className="mt-2 font-bold">{product.price.toLocaleString()}원</div>
                  <div className="text-xs text-gray-500 mt-1">즉시 구매가</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeFilter={activeFilter}
        currentFilters={filterOptions}
        onApplyFilter={(filterType, selectedOptions) => {
          applyFilters(filterType, selectedOptions);
        }}
        onResetFilters={resetFilters}
      />
      {selectedProduct && (
        <ProductDetail
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )} 
      <Toaster />
    </Layout>
  );
}
