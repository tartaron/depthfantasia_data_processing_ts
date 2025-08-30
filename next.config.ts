/** @type {import('next').NextConfig} */
const nextConfig = {
  // 클라이언트 사이드 청크 크기 증가
  webpack: (config) => {
    config.performance = {
      ...config.performance,
      maxAssetSize: 100000000,  // 100MB
      maxEntrypointSize: 100000000,  // 100MB
    }
    return config
  },
  
  // 실험적 기능: 큰 페이지 데이터 허용
  experimental: {
    largePageDataBytes: 128 * 100000, // 128MB
  },
}

module.exports = nextConfig