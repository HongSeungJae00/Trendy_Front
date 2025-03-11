import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductDetail } from '@/components/product-detail';

const mockProduct = {
  id: 1,
  name: '테스트 상품',
  price: 10000,
  description: '테스트 상품 설명',
  images: ['test-image.jpg'],
  stock: 10
};

describe('ProductDetail 컴포넌트', () => {
  beforeEach(() => {
    render(<ProductDetail product={mockProduct} />);
  });

  it('상품 정보가 올바르게 렌더링되어야 합니다', () => {
    expect(screen.getByText('테스트 상품')).toBeInTheDocument();
    expect(screen.getByText('10,000원')).toBeInTheDocument();
    expect(screen.getByText('테스트 상품 설명')).toBeInTheDocument();
  });

  it('수량 선택이 가능해야 합니다', () => {
    const quantityInput = screen.getByRole('spinbutton');
    fireEvent.change(quantityInput, { target: { value: '2' } });
    expect(quantityInput).toHaveValue(2);
  });

  it('재고보다 많은 수량을 선택할 수 없어야 합니다', () => {
    const quantityInput = screen.getByRole('spinbutton');
    fireEvent.change(quantityInput, { target: { value: '11' } });
    expect(screen.getByText(/재고가 부족합니다/i)).toBeInTheDocument();
  });

  it('장바구니 담기 버튼이 동작해야 합니다', () => {
    const addToCartButton = screen.getByRole('button', { name: /장바구니/i });
    fireEvent.click(addToCartButton);
    expect(screen.getByText(/장바구니에 추가되었습니다/i)).toBeInTheDocument();
  });
}); 