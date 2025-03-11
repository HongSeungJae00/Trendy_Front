const nextJest = require('next/jest'); // Next.js와 Jest 통합을 위한 패키지

// Next.js의 루트 디렉터리를 설정합니다.
const createJestConfig = nextJest({
  dir: './',
});

// Jest 설정
const customJestConfig = {
  // jsdom 환경을 사용하여 브라우저 환경 테스트를 지원합니다.
  testEnvironment: 'jest-environment-jsdom',

  // 테스트 실행 전 환경 설정 파일을 추가합니다 (Optional: 파일이 없으면 생략 가능).
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // 모듈 경로 별칭을 설정합니다 (Next.js에서 '@/파일경로' 같은 별칭을 사용하는 경우).
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // 테스트 결과 리포터 설정 (JUnit XML 출력 포함).
  reporters: [
    'default', // 기본 콘솔 출력
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/test-results', // XML 형식 결과 저장 디렉터리
        outputName: 'junit-report.xml', // 저장 파일 이름
      },
    ],
  ],

  // 테스트 파일 패턴 설정 (test, spec.js(x) 파일을 포함).
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)', // __tests__ 디렉터리 내부의 테스트 파일
    '**/?(*.)+(spec|test).[jt]s?(x)', // *.spec.js, *.test.js 파일 포함
  ],

  // 특정 파일과 디렉터리를 테스트에서 제외
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/', // node_modules 제외
    '<rootDir>/.next/', // .next 디렉터리 제외 (Next.js 빌드 결과물)
    '<rootDir>/out/', // 정적 빌드 결과물 제외
  ],

  // 확장자를 생략한 모듈을 처리
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  // 커버리지 보고서 설정 (Optional: 테스트 커버리지 필요 시 활성화)
  collectCoverage: true, // 커버리지 수집 활성화
  coverageDirectory: '<rootDir>/coverage', // 커버리지 결과 디렉터리
  coverageReporters: ['json', 'lcov', 'text', 'clover'], // 커버리지 출력 형식
};

// Jest 설정을 Next.js 설정과 결합하여 내보냅니다.
module.exports = createJestConfig(customJestConfig);
