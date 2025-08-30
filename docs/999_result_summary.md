생성된 프로젝트 요약
��️ 프로젝트 구조
클린 아키텍처 패턴을 따르는 구조
Domain Layer: 비즈니스 엔티티와 규칙
Application Layer: 유스케이스와 서비스
Infrastructure Layer: 외부 시스템 인터페이스
Presentation Layer: UI 컴포넌트와 상태 관리
🛠️ 기술 스택
Next.js 14 (App Router)
TypeScript (strict mode)
Tailwind CSS (스타일링)
Leaflet.js (맵 라이브러리)
Zustand (상태 관리)
React Query (서버 상태 관리)
React Dropzone (파일 업로드)
🎯 주요 기능
데이터 업로드: JSON 파일 드래그 앤 드롭 (최대 100MB)
맵 뷰어: 6000x8000px 고해상도 맵 (타일 기반)
전투 마커: 플레이어/몬스터 구분, 필드별 색상
필터 시스템: 맵, 멤버, 보상 범위 필터링
상세정보: 전투 정보, 멤버 목록, 액션/결과 로그
📁 생성된 파일들
설정 파일: package.json, tsconfig.json, tailwind.config.js 등
도메인 엔티티: Battle.ts, Map.ts, Filter.ts
유스케이스: 업로드, 조회, 필터링 로직
컴포넌트: 맵 뷰어, 파일 업로더, 필터 패널, 상세정보
상태 관리: Zustand 스토어들
유틸리티: 좌표 변환, 상수 정의
🚀 다음 단계
npm install - 의존성 설치
npm run dev - 개발 서버 실행
맵 타일 이미지 준비 (public/maps/depthfantasia/tiles/)
실제 백엔드 API 연동 (현재는 Mock API 사용)
프로젝트가 완전히 작동하는 상태로 생성되었으며, docs의 모든 요구사항을 반영했습니다!