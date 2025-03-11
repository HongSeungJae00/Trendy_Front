import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PaymentForm } from '@/components/PaymentForm';

const mockOrder = {
  totalAmount: 50000,
  items: [
    { id: 1, name: '테스트 상품', quantity: 2, price: 25000 }
  ]
};

describe('PaymentForm 컴포넌트', () => {
  beforeEach(() => {
    render(<PaymentForm order={mockOrder} />);
  });

  it('주문 정보가 올바르게 표시되어야 합니다', () => {
    expect(screen.getByText('총 결제금액: 50,000원')).toBeInTheDocument();
    expect(screen.getByText('테스트 상품')).toBeInTheDocument();
    expect(screen.getByText('2개')).toBeInTheDocument();
  });

  it('배송지 정보 입력이 가능해야 합니다', () => {
    const nameInput = screen.getByLabelText(/받는 분/i);
    const addressInput = screen.getByLabelText(/주소/i);
    const phoneInput = screen.getByLabelText(/연락처/i);

    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    fireEvent.change(addressInput, { target: { value: '서울시 강남구' } });
    fireEvent.change(phoneInput, { target: { value: '010-1234-5678' } });

    expect(nameInput).toHaveValue('홍길동');
    expect(addressInput).toHaveValue('서울시 강남구');
    expect(phoneInput).toHaveValue('010-1234-5678');
  });

  it('결제 수단 선택이 가능해야 합니다', () => {
    const creditCardRadio = screen.getByLabelText(/신용카드/i);
    const bankTransferRadio = screen.getByLabelText(/계좌이체/i);

    fireEvent.click(creditCardRadio);
    expect(creditCardRadio).toBeChecked();

    fireEvent.click(bankTransferRadio);
    expect(bankTransferRadio).toBeChecked();
    expect(creditCardRadio).not.toBeChecked();
  });

  it('필수 정보 미입력 시 결제 버튼이 비활성화되어야 합니다', () => {
    const paymentButton = screen.getByRole('button', { name: /결제하기/i });
    expect(paymentButton).toBeDisabled();

    // 필수 정보 입력
    const nameInput = screen.getByLabelText(/받는 분/i);
    const addressInput = screen.getByLabelText(/주소/i);
    const phoneInput = screen.getByLabelText(/연락처/i);
    const creditCardRadio = screen.getByLabelText(/신용카드/i);

    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    fireEvent.change(addressInput, { target: { value: '서울시 강남구' } });
    fireEvent.change(phoneInput, { target: { value: '010-1234-5678' } });
    fireEvent.click(creditCardRadio);

    expect(paymentButton).toBeEnabled();
  });
}); 