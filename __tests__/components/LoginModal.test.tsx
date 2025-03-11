import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginModal } from '@/components/login-modal';

describe('LoginModal 컴포넌트', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    render(<LoginModal isOpen={true} onClose={mockOnClose} />);
  });

  it('로그인 폼이 렌더링되어야 합니다', () => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
  });

  it('이메일과 비밀번호 입력이 가능해야 합니다', () => {
    const emailInput = screen.getByLabelText(/이메일/i);
    const passwordInput = screen.getByLabelText(/비밀번호/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('닫기 버튼 클릭 시 onClose가 호출되어야 합니다', () => {
    const closeButton = screen.getByRole('button', { name: /닫기/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
}); 