import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let userConfig = undefined;
try {
  userConfig = await import(`${__dirname}/v0-user-next.config`);
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
  },
  swcMinify: process.env.BUILD_ENV !== 'local', // 로컬 환경에서는 SWC 사용 중단
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve(__dirname, '.'),  // ✅ 절대 경로 매핑 (컴파일 오류 방지)
      '@/components': resolve(__dirname, 'components'),  // ✅ 추가: components alias 직접 매핑
    };
    return config;
  }
};

// 병합: 사용자 정의 설정 반영
mergeConfig(nextConfig, userConfig);

/**
 * 사용자 구성 병합
 * @param {object} nextConfig 기본 Next.js 구성
 * @param {object} userConfig 사용자 구성
 */
function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return;
  }

  for (const key in userConfig) {
    if (typeof nextConfig[key] === 'object' && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = { ...nextConfig[key], ...userConfig[key] };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

export default nextConfig;
