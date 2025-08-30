# 프로젝트 개요

## 개요
맵 기반 전투 데이터 시각화 플랫폼 - Frontend MVP

## 기술 제약사항
- 맵 이미지: 6000x8000px PNG (약 50MB)
- 데이터 형식: 배열 형태의 JSON (전투당 1개 객체)
- 백엔드: 별도 API 서버 예정

## 기술 스택
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Map Library: Leaflet.js
- State Management: Zustand + React Query
- HTTP Client: Axios

## MVP 핵심 기능
1. 기본 업로드 기능
2. 단순 맵 뷰어
3. 점 마커 표시
4. 기본 필터링

## 클린 아키텍처 구조
src/
├── domain/          # 비즈니스 로직, 엔티티
├── application/     # 유스케이스, 서비스
├── infrastructure/  # 외부 서비스, API
├── presentation/    # UI 컴포넌트, 페이지
└── shared/         # 공통 유틸리티
