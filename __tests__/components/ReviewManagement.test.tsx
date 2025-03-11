import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReviewManagement } from '@/components/ReviewManagement';

const mockReviews = [
  {
    id: 1,
    productName: '테스트 상품',
    rating: 5,
    content: '아주 좋은 상품입니다.',
    createdAt: '2024-01-28',
    images: ['review1.jpg']
  }
];

describe('ReviewManagement 컴포넌트', () => {
  beforeEach(() => {
    render(<ReviewManagement reviews={mockReviews} />);
  });

  it('리뷰 목록이 올바르게 표시되어야 합니다', () => {
    expect(screen.getByText('테스트 상품')).toBeInTheDocument();
    expect(screen.getByText('아주 좋은 상품입니다.')).toBeInTheDocument();
    expect(screen.getByText('2024-01-28')).toBeInTheDocument();
  });

  it('별점이 올바르게 표시되어야 합니다', () => {
    const stars = screen.getAllByRole('img', { name: /star/i });
    expect(stars).toHaveLength(5);
  });

  it('리뷰 이미지를 클릭하면 모달이 열려야 합니다', () => {
    const reviewImage = screen.getByAltText(/리뷰 이미지/i);
    fireEvent.click(reviewImage);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('리뷰 수정 버튼이 동작해야 합니다', () => {
    const editButton = screen.getByRole('button', { name: /수정/i });
    fireEvent.click(editButton);
    expect(screen.getByRole('textbox')).toHaveValue('아주 좋은 상품입니다.');
  });

  it('리뷰 삭제 버튼 클릭 시 확인 대화상자가 표시되어야 합니다', () => {
    const deleteButton = screen.getByRole('button', { name: /삭제/i });
    fireEvent.click(deleteButton);
    expect(screen.getByText(/정말로 삭제하시겠습니까?/i)).toBeInTheDocument();
  });
}); 