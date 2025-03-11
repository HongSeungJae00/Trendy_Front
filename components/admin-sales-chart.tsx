'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin-ui/admin-card";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { Dialog, DialogContent } from "@/components/admin-ui/admin-dialog";

const initialData = [
  { name: "나이키", value: 30, details: { sales: "3,500,000원", items: 150, growth: "+12%" }, link: "/nike" },
  { name: "아디다스", value: 25, details: { sales: "2,800,000원", items: 120, growth: "+8%" }, link: "/adidas" },
  { name: "뉴발란스", value: 20, details: { sales: "2,300,000원", items: 100, growth: "+15%" }, link: "/newbalance" },
  { name: "아식스", value: 15, details: { sales: "1,800,000원", items: 80, growth: "+5%" }, link: "/asics" },
  { name: "리복", value: 10, details: { sales: "1,200,000원", items: 50, growth: "-2%" }, link: "/reebok" },
];

const COLORS = ["#FFE5E5", "#FFB5B5", "#FF8C8C", "#FF6666", "#FF4040"];

export function SalesChart() {
  const [data, setData] = useState(initialData);
  const [selectedBrand, setSelectedBrand] = useState<(typeof initialData)[0] | null>(null);

  // API 통신: 매출 데이터 가져오기
  const fetchChartData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/sales`);
      if (!response.ok) {
        throw new Error("매출 데이터를 불러오는데 실패했습니다.");
      }
      const fetchedData = await response.json();

      // API 데이터 형식을 initialData와 맞게 변환
      const formattedData = fetchedData.map((item: any) => ({
        name: item.name,
        value: item.value,
        details: {
          sales: item.details.sales,
          items: item.details.items,
          growth: item.details.growth,
        },
        link: item.link,
      }));

      setData(formattedData);
    } catch (error) {
      console.error("매출 데이터를 불러오는데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const handleClick = (entry: (typeof initialData)[0], event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedBrand(entry);
  };

  const handleCloseDialog = () => {
    setSelectedBrand(null);
    window.location.href = "/admin";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-bold">매출 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
                className="cursor-pointer"
                onClick={(entry, index, event) => handleClick(entry.payload, event)}
                style={{ outline: "none" }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                fontSize={8}
                iconSize={6}
                formatter={(value) => <span style={{ color: "#000000" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 팝업 창 */}
        <Dialog open={!!selectedBrand}>
          <DialogContent className="sm:max-w-[425px]">
            <div className="space-y-6"> {/* 제목과 내용 사이에 여백 추가 */}
              <h2 className="text-lg font-bold text-black">
                {selectedBrand?.name} 매출 상세 정보
              </h2>
              <hr className="border-t border-gray-300" /> {/* 한 줄 구분선 추가 */}
              <div className="space-y-2">
                <div>
                  <span className="block font-semibold text-sm text-gray-700">총 매출액</span>
                  <div className="bg-gray-100 p-4 rounded-md text-gray-800">{selectedBrand?.details.sales}</div>
                </div>
                <div>
                  <span className="block font-semibold text-sm text-gray-700">판매 수량</span>
                  <div className="bg-gray-100 p-4 rounded-md text-gray-800">{selectedBrand?.details.items}개</div>
                </div>
                <div>
                  <span className="block font-semibold text-sm text-gray-700">전월 대비 성장률</span>
                  <div
                    className={`bg-gray-100 p-4 rounded-md ${
                      selectedBrand?.details.growth.startsWith("+") ? "text-red-500" : "text-blue-500"
                    }`}
                  >
                    {selectedBrand?.details.growth}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={handleCloseDialog}
                className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600"
              >
                닫기
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
