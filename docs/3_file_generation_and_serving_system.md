# 파일 생성 및 서빙 시스템

## 타일 생성 전략
- 원본 이미지: 6000x8000px
- 타일 크기: 256x256px
- 줌 레벨: 10-18
- 포맷: PNG/WebP

## 타일 생성 서비스

### infrastructure/services/TileGenerator.ts
interface TileGeneratorConfig {
  sourceImage: string;
  outputDir: string;
  tileSize: 256;
  zoomLevels: number[];
}

class TileGenerator {
  generate(config: TileGeneratorConfig): Promise<void>;
  calculateTileGrid(zoom: number): TileGrid;
  processTile(x: number, y: number, zoom: number): Promise<void>;
}

## 정적 파일 구조
public/
├── maps/
│   ├── depthfantasia/
│   │   ├── tiles/
│   │   │   ├── 10/
│   │   │   ├── 11/
│   │   │   └── ...
│   │   └── metadata.json
└── assets/
    └── markers/

## 타일 서비스

### infrastructure/services/TileService.ts
class TileService {
  getTileUrl(x: number, y: number, z: number): string {
    return `/maps/depthfantasia/tiles/${z}/${x}/${y}.png`;
  }
  
  getMetadata(): Promise<MapMetadata>;
}

## 성능 최적화
- Lazy loading
- Progressive loading
- 타일 프리페칭
- 메모리 캐싱
