/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminMemberTable } from '@/components/admin-member-table';

// 모든 외부 의존성 모킹
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

// XLSX 모듈 모킹
jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(),
    book_new: jest.fn(),
    book_append_sheet: jest.fn()
  },
  writeFile: jest.fn()
}));

describe('AdminMemberTable', () => {
  it('renders without crashing', () => {
    const mockData = [{
      id: "user1",
      name: "테스트",
      password: "****",
      nickname: "test",
      phone: "010-0000-0000",
      email: "test@test.com",
      address: "서울",
      joinDate: "2024-01-01",
      status: "활성"
    }];

    expect(() => {
      render(<AdminMemberTable data={mockData} />);
    }).not.toThrow();
  });
}); 