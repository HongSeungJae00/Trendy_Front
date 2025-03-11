import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/button';

describe('Button 컴포넌트', () => {
  it('버튼이 정상적으로 렌더링되어야 합니다', () => {
    render(<Button>테스트 버튼</Button>);
    const buttonElement = screen.getByText('테스트 버튼');
    expect(buttonElement).toBeInTheDocument();
  });

  it('버튼이 disabled 상태일 때 비활성화되어야 합니다', () => {
    render(<Button disabled>비활성화 버튼</Button>);
    const buttonElement = screen.getByText('비활성화 버튼');
    expect(buttonElement).toBeDisabled();
  });
}); 