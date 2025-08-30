# DepthFantasia Data Processing Frontend

맵 기반 전투 데이터 시각화 플랫폼의 프론트엔드 MVP입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Map Library**: Leaflet.js
- **State Management**: Zustand + React Query
- **HTTP Client**: Axios
- **File Upload**: React Dropzone

## 프로젝트 구조

```
src/
├── domain/          # 비즈니스 로직, 엔티티
│   ├── entities/
│   │   ├── Battle.ts
│   │   ├── Map.ts
│   │   └── Filter.ts
│   └── repositories/
│       └── IBattleRepository.ts
├── application/     # 유스케이스, 서비스
│   ├── usecases/
│   │   ├── UploadBattleData.ts
│   │   ├── GetBattleData.ts
│   │   └── FilterBattleData.ts
│   └── services/
│       └── BattleDataParser.ts
├── infrastructure/  # 외부 서비스, API
│   ├── api/
│   │   ├── BattleAPI.ts
│   │   └── mockApi.ts
│   ├── repositories/
│   │   └── BattleRepository.ts
│   └── services/
│       └── TileService.ts
├── presentation/    # UI 컴포넌트, 페이지
│   ├── components/
│   │   ├── map/
│   │   ├── upload/
│   │   ├── filter/
│   │   └── battle/
│   ├── store/
│   │   ├── battleStore.ts
│   │   ├── filterStore.ts
│   │   └── uploadStore.ts
│   └── hooks/
└── shared/         # 공통 유틸리티
    ├── constants/
    ├── types/
    └── utils/
```

## 주요 기능

### 1. 데이터 업로드
- JSON 파일 드래그 앤 드롭 업로드
- 대용량 파일 처리 (최대 100MB)
- 실시간 업로드 진행률 표시
- 데이터 검증 및 오류 처리

### 2. 맵 뷰어
- 6000x8000px 고해상도 맵 표시
- Leaflet.js 기반 인터랙티브 맵
- 줌 레벨 10-18 지원
- 타일 기반 렌더링으로 성능 최적화

### 3. 전투 마커
- 플레이어/몬스터 구분 마커
- 필드별 색상 구분
- 클릭 시 상세정보 팝업
- 실시간 필터링 적용

### 4. 필터 시스템
- 맵별 필터링
- 멤버 이름 검색
- 보상 범위 설정 (경험치/골드)
- 실시간 필터 결과 표시

### 5. 전투 상세정보
- 전투 기본 정보
- 참여 멤버 목록
- 보상 정보
- 액션/결과 로그

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

### 4. 프로덕션 실행
```bash
npm start
```

## 문제 해결

### PowerShell 실행 정책 오류
Windows PowerShell에서 스크립트 실행이 차단된 경우:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 포트 3000이 이미 사용 중인 경우
다른 포트로 실행:
```bash
npm run dev -- -p 3001
```

### Leaflet 관련 오류
- 브라우저 캐시를 지우고 새로고침
- 개발자 도구에서 콘솔 오류 확인

## 환경 설정

### 타일 이미지 설정
맵 타일 이미지를 `public/maps/depthfantasia/tiles/` 디렉토리에 다음과 같은 구조로 배치하세요:

```
public/maps/depthfantasia/
├── tiles/
│   ├── 10/
│   ├── 11/
│   ├── 12/
│   └── ...
└── metadata.json
```

### API 설정
현재는 Mock API를 사용하고 있습니다. 실제 백엔드 API로 전환하려면:

1. `src/infrastructure/api/BattleAPI.ts`에서 실제 API 엔드포인트로 변경
2. `src/infrastructure/repositories/BattleRepository.ts`에서 실제 API 클라이언트 사용

## 데이터 형식

### Battle JSON 형식
```json
[
  {
    "id": 1,
    "map": 1000,
    "x": 1000,
    "y": 1500,
    "floor": 1,
    "field": 1,
    "num_member": 4,
    "members": [
      {
        "id": 1,
        "x": 1000,
        "y": 1500,
        "name": "Player1",
        "current_hp": 100,
        "max_hp": 100,
        "job": 1,
        "is_npc": 0,
        "guild_name": "TestGuild"
      }
    ],
    "actions": [],
    "results": [],
    "is_event": false,
    "from": "2024-01-01T00:00:00Z",
    "reward": {
      "exp": 100,
      "gold": 50
    }
  }
]
```

## 성능 최적화

- **타일 기반 렌더링**: 대용량 맵 이미지를 타일로 분할하여 로딩
- **마커 클러스터링**: 1000개 이상의 마커 시 클러스터링 적용
- **필터 디바운싱**: 실시간 필터링 시 성능 최적화
- **메모리 관리**: 불필요한 데이터 정리 및 캐싱

## 개발 가이드

### 클린 아키텍처
이 프로젝트는 클린 아키텍처 패턴을 따릅니다:

- **Domain Layer**: 비즈니스 엔티티와 규칙
- **Application Layer**: 유스케이스와 서비스
- **Infrastructure Layer**: 외부 시스템과의 인터페이스
- **Presentation Layer**: UI 컴포넌트와 상태 관리

### 상태 관리
- **Zustand**: 전역 상태 관리
- **React Query**: 서버 상태 관리 및 캐싱
- **Local State**: 컴포넌트별 로컬 상태

## 현재 상태

✅ **완료된 기능**
- 기본 프로젝트 구조
- 클린 아키텍처 구현
- 맵 뷰어 (기본 배경)
- 전투 마커 시스템
- 파일 업로드 컴포넌트
- 필터 시스템
- 전투 상세정보 패널
- Mock API 구현

🔄 **개선 필요**
- 실제 맵 타일 이미지 추가
- 마커 클러스터링 구현
- 성능 최적화
- 실제 백엔드 API 연동

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
