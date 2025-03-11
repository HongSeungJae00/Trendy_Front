export interface Notice {
  id: number
  type: '이벤트' | '공지'
  title: string
  date: string
  content: string
}

const notices: Notice[] = [
  {
    id: 1,
    type: '이벤트',
    title: '[안내] Trendy - 12월 2주차 DRAW',
    date: '2024.12.15',
    content: '12월 2주차 DRAW 이벤트에 대한 상세 내용입니다. 많은 참여 부탁드립니다.'
  },
  {
    id: 2,
    type: '공지',
    title: '공휴일 배송 안내',
    date: '2024.12.11',
    content: '공휴일 기간 동안의 배송 일정을 안내드립니다. 배송 지연이 있을 수 있습니다.'
  },
  {
    id: 3,
    type: '이벤트',
    title: '[안내] Trendy 신규가입 이벤트 안내',
    date: '2024.12.01',
    content: '신규 가입 고객을 위한 특별 이벤트를 안내드립니다. 다양한 혜택을 놓치지 마세요.'
  },
  {
    id: 4,
    type: '공지',
    title: '성탄절 운영 안내',
    date: '2024.12.11',
    content: '성탄절 기간 동안의 고객센터 운영 시간을 안내드립니다.'
  },
  {
    id: 5,
    type: '이벤트',
    title: '[안내] Trendy 세일 상품 안내',
    date: '2024.12.10',
    content: '연말 세일 상품에 대한 자세한 안내입니다. 특별 할인 혜택을 확인하세요.'
  }
]

export async function fetchNotices(): Promise<Notice[]> {
  return new Promise((resolve) => setTimeout(() => resolve(notices), 500))
}

