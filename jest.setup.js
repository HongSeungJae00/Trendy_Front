// jest.setup.js

// Jest DOM 커스텀 매처 설정 (예: toHaveTextContent 사용 가능)
import '@testing-library/jest-dom';
import 'jest-fetch-mock';

beforeAll(() => {
  // fetch mock 설정
  global.fetch = require('jest-fetch-mock');
});

// 테스트 환경에서 사용할 전역 설정
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
