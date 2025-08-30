# 프로젝트 초기 설정

## 필요 패키지

### package.json
{
  "dependencies": {
    "next": "14.x",
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5",
    "leaflet": "^1.9",
    "react-leaflet": "^4.2",
    "@types/leaflet": "^1.9",
    "zustand": "^4.5",
    "@tanstack/react-query": "^5",
    "axios": "^1.6",
    "tailwindcss": "^3.4",
    "react-dropzone": "^14.2"
  }
}

## 프로젝트 구조
src/
├── domain/
│   ├── entities/
│   │   ├── Battle.ts
│   │   ├── Map.ts
│   │   └── Filter.ts
│   └── repositories/
│       └── IBattleRepository.ts
├── application/
│   ├── usecases/
│   │   ├── UploadBattleData.ts
│   │   ├── GetBattleData.ts
│   │   └── FilterBattleData.ts
│   └── services/
│       └── ValidationService.ts
├── infrastructure/
│   ├── api/
│   │   └── BattleAPI.ts
│   ├── repositories/
│   │   └── BattleRepository.ts
│   └── storage/
│       └── LocalStorage.ts
├── presentation/
│   ├── components/
│   │   ├── map/
│   │   ├── upload/
│   │   └── filter/
│   ├── hooks/
│   └── store/
└── shared/
    ├── constants/
    ├── types/
    └── utils/

## 환경 설정
- TypeScript strict mode 활성화
- ESLint 설정
- Prettier 설정
- Tailwind CSS 설정
- 절대 경로 import 설정
