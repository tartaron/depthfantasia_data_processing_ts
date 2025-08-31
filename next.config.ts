// next.config.ts

// 1. 필요한 타입을 import 합니다. (TypeScript 스타일)
import type { NextConfig } from 'next'
import type { Configuration as WebpackConfiguration } from 'webpack'

// 2. nextConfig 변수에 NextConfig 타입을 명시적으로 지정합니다.
const nextConfig: NextConfig = {
  // 클라이언트 사이드 청크 크기 증가
  webpack: (
    config: WebpackConfiguration, // 3. 파라미터에 직접 타입을 지정합니다.
  ) => {
    config.performance = {
      ...config.performance,
      maxAssetSize: 100000000,      // 100MB
      maxEntrypointSize: 100000000, // 100MB
    }
    
    // 4. 수정된 config 객체를 반환합니다.
    return config
  },
  
  // 실험적 기능: 큰 페이지 데이터 허용
  experimental: {
    largePageDataBytes: 128 * 100000, // 128MB
  },
}

// 5. 'module.exports' 대신 'export default'를 사용합니다. (ES 모듈 스타일)
export default nextConfig
