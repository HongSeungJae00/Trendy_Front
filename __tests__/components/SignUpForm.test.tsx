import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SignUpForm } from '@/components/SignUpForm';

describe('SignUpForm 컴포넌트', () => {
  beforeEach(() => {
    render(<SignUpForm />);
  });

  it('회원가입 폼이 렌더링되어야 합니다', () => {
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호 확인/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/이름/i)).toBeInTheDocument();
  });

  it('필수 입력 필드가 비어있을 때 유효성 검사 메시지가 표시되어야 합니다', async () => {
    const submitButton = screen.getByRole('button', { name: /가입하기/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/이메일을 입력해주세요/i)).toBeInTheDocument();
    expect(await screen.findByText(/비밀번호를 입력해주세요/i)).toBeInTheDocument();
  });

  it('이메일 형식이 올바르지 않을 때 에러 메시지가 표시되어야 합니다', async () => {
    const emailInput = screen.getByLabelText(/이메일/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    expect(await screen.findByText(/올바른 이메일 형식이 아닙니다/i)).toBeInTheDocument();
  });

  it('비밀번호와 비밀번호 확인이 일치하지 않을 때 에러 메시지가 표시되어야 합니다', async () => {
    const passwordInput = screen.getByLabelText(/비밀번호/i);
    const confirmPasswordInput = screen.getByLabelText(/비밀번호 확인/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.blur(confirmPasswordInput);

    expect(await screen.findByText(/비밀번호가 일치하지 않습니다/i)).toBeInTheDocument();
  });
}); 