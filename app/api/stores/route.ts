import { NextResponse } from 'next/server'

const stores = [
  {
    id: 1,
    name: 'Trendy 롯데월드몰',
    address: '서울 송파구 올림픽로 300 롯데월드몰',
    lat: 37.5125,
    lng: 127.1025,
    hours: '10:30 - 22:00'
  },
  {
    id: 2,
    name: 'Trendy 더현대서울',
    address: '서울 영등포구 여의대로 108 더현대 서울',
    lat: 37.5259,
    lng: 126.9284,
    hours: '10:30 - 20:00'
  },
  {
    id: 3,
    name: 'Trendy 신세계강남',
    address: '서울 서초구 신반포로 176 신세계백화점 강남점',
    lat: 37.5051,
    lng: 127.0244,
    hours: '10:30 - 20:00'
  }
]

export async function GET() {
  return NextResponse.json(stores)
}

