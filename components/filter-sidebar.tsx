// App.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterData {
  brand?: string[];
  color?: string[];
  price?: string[];
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilter: string;
  currentFilters: {
    brand: string[];
    color: string[];
    size: string[];
    price: string[];
  };
  onApplyFilter: (filterType: string, selectedOptions: FilterData) => void;
  onResetFilters: () => void;
}

export function FilterSidebar({ isOpen, onClose, activeFilter, currentFilters, onApplyFilter, onResetFilters }: FilterSidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(currentFilters.brand);
  const [selectedColors, setSelectedColors] = useState<string[]>(currentFilters.color);
  const [selectedPrices, setSelectedPrices] = useState<string[]>(currentFilters.price);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setSelectedBrands(currentFilters.brand);
    setSelectedColors(currentFilters.color);
    setSelectedPrices(currentFilters.price);
  }, [currentFilters]);

  useEffect(() => {
    if (activeFilter) {
      setActiveSection(activeFilter);
    }
  }, [activeFilter]);

  const toggleSection = (section: string) => {
    setActiveSection((prev) => (prev === section ? null : section));
  };

  const toggleSelection = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setList((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const getSelectedFilterCount = () => {
    return selectedBrands.length + selectedColors.length + selectedPrices.length;
  };

  const handleApplyFilter = () => {
    const filterData: FilterData = {};

    // 브랜드 필터
    if (selectedBrands.length > 0) {
      filterData.brand = selectedBrands.map(brand => 
        brand === '나이키' ? 'Nike' :
        brand === '아디다스' ? 'Adidas' :
        brand === '리복' ? 'Reebok' :
        brand === '뉴발란스' ? 'New_Balance' :
        brand === '아식스' ? 'Asics' : 'Others'
      );
    }

    // 색상 필터
    if (selectedColors.length > 0) {
      filterData.color = selectedColors.map(color => 
        color === '화이트' ? 'WHITE' :
        color === '블랙' ? 'BLACK' :
        color === '그레이' ? 'GRAY' :
        color === '블루' ? 'BLUE' :
        color === '레드' ? 'RED' :
        color === '퍼플' ? 'PURPLE' :
        color === '브라운' ? 'BROWN' : color.toUpperCase()
      );
    }

    // 가격 필터
    if (selectedPrices.length > 0) {
      filterData.price = selectedPrices.map(price => 
        price === '10만원 이하' ? '10만원 이하' :
        price === '10만원~20만원' ? '10만원 - 20만원' :
        price === '20만원~30만원' ? '20만원 - 30만원' :
        price === '30만원 이상' ? '30만원 이상' : price
      );
    }

    onApplyFilter(activeFilter, filterData);
    onClose();
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-1/5 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } z-50`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">필터</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-64px)]">
        {/* 브랜드 섹션 */}
        <div className="border-b">
          <button
            className="flex items-center justify-between w-full p-4"
            onClick={() => toggleSection('브랜드')}
          >
            <span className="font-medium">브랜드</span>
            {activeSection === '브랜드' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {activeSection === '브랜드' && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                {['나이키', '아디다스', '리복', '뉴발란스', '아식스', 'Others'].map((brand) => (
                  <button
                    key={brand}
                    className={`w-full px-4 py-2 text-sm rounded-lg ${
                      selectedBrands.includes(brand) ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    } text-center`}
                    onClick={() => toggleSelection(selectedBrands, setSelectedBrands, brand)}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 색상 섹션 */}
        <div className="border-b">
          <button
            className="flex items-center justify-between w-full p-4"
            onClick={() => toggleSection('색상')}
          >
            <span className="font-medium">색상</span>
            {activeSection === '색상' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {activeSection === '색상' && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                {[
                  { color: 'bg-black', text: '블랙' },
                  { color: 'bg-white', text: '화이트' },
                  { color: 'bg-gray-500', text: '그레이' },
                  { color: 'bg-blue-500', text: '블루' },
                  { color: 'bg-red-500', text: '레드' },
                  { color: 'bg-purple-500', text: '퍼플' },
                  { color: 'bg-yellow-800', text: '브라운' },
                  { color: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500', text: 'Other' },
                ].map(({ color, text }) => (
                  <button
                    key={text}
                    className={`flex items-center space-x-2 w-full px-3 py-2 text-sm rounded-lg ${
                      selectedColors.includes(text) ? 'bg-red-500 text-white' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => toggleSelection(selectedColors, setSelectedColors, text)}
                  >
                    <span
                      className={`w-6 h-6 rounded-full ${color} ${
                        text === '화이트' ? 'border border-gray-300' : ''
                      }`}
                    ></span>
                    <span className="flex-grow text-center">{text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 가격 섹션 */}
        <div className="border-b">
          <button
            className="flex items-center justify-between w-full p-4"
            onClick={() => toggleSection('가격')}
          >
            <span className="font-medium">가격</span>
            {activeSection === '가격' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {activeSection === '가격' && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                {[
                  '10만원 이하',
                  '10만원 - 20만원',
                  '20만원 - 30만원',
                  '30만원 이상',
                ].map((priceRange) => (
                  <button
                    key={priceRange}
                    className={`w-full px-4 py-2 text-sm rounded-lg ${
                      selectedPrices.includes(priceRange)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    } text-center`}
                    onClick={() => toggleSelection(selectedPrices, setSelectedPrices, priceRange)}
                  >
                    {priceRange}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 정렬 섹션 */}
        <div className="border-b">
          <button
            className="flex items-center justify-between w-full p-4"
            onClick={() => toggleSection('정렬')}
          >
            <span className="font-medium">정렬</span>
            {activeSection === '정렬' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {activeSection === '정렬' && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                {['이름', '좋아요', '가격', '판매량'].map((option) => (
                  <div key={option} className="flex items-center justify-between">
                    <button
                      className={`px-3 py-1 text-sm rounded-full ${
                        sortBy === option ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => setSortBy(option)}
                    >
                      {option}
                    </button>
                    <div className="flex space-x-2">
                      <button
                        className={`px-2 py-1 text-xs rounded-full ${
                          sortBy === option && sortOrder === 'asc'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                          setSortBy(option);
                          setSortOrder('asc');
                        }}
                      >
                        ▲
                      </button>
                      <button
                        className={`px-2 py-1 text-xs rounded-full ${
                          sortBy === option && sortOrder === 'desc'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => {
                          setSortBy(option);
                          setSortOrder('desc');
                        }}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            onClick={handleApplyFilter}
          >
            필터 적용
          </Button>
          {getSelectedFilterCount() > 0 && (
            <Button
              variant="outline"
              className="w-full text-red-500 border-red-500 hover:bg-red-50"
              onClick={() => {
                onResetFilters();
                onClose();
              }}
            >
              필터 해제
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filteredItemCount, setFilteredItemCount] = useState(0);

  const handleApplyFilter = (filterType: string, selectedOptions: FilterData) => {
    // 필터 적용 로직을 여기에 구현
    // 임시로 선택된 필터의 총 개수를 계산
    const totalCount = Object.values(selectedOptions).reduce((sum, arr) => sum + (arr?.length || 0), 0);
    setFilteredItemCount(totalCount);
  };

  return (
    <div className="p-4">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={() => setFilterOpen(true)}
      >
        필터 열기 ({filteredItemCount}개)
      </button>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setFilterOpen(false)}
        activeFilter="브랜드"
        currentFilters={{
          brand: [],
          color: [],
          size: [],
          price: []
        }}
        onApplyFilter={handleApplyFilter}
        onResetFilters={() => {
          setFilteredItemCount(0);
        }}
      />
    </div>
  );
}