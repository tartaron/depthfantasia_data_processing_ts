import { MapMetadata } from '@/domain/entities/Map';

export class TileService {
  getTileUrl(x: number, y: number, z: number): string {
    return `/maps/depthfantasia/tiles/${z}/${x}/${y}.png`;
  }

  async getMetadata(): Promise<MapMetadata> {
    try {
      const response = await fetch('/maps/depthfantasia/metadata.json');
      return await response.json();
    } catch (error) {
      // 기본 메타데이터 반환
      return {
        name: 'DepthFantasia',
        width: 6000,
        height: 8000,
        tileSize: 256,
        zoomLevels: [10, 11, 12, 13, 14, 15, 16, 17, 18],
        bounds: [[0, 0], [8000, 6000]]
      };
    }
  }

  calculateTileGrid(zoom: number): { x: number; y: number }[] {
    const tiles: { x: number; y: number }[] = [];
    const maxTile = Math.pow(2, zoom);
    
    for (let x = 0; x < maxTile; x++) {
      for (let y = 0; y < maxTile; y++) {
        tiles.push({ x, y });
      }
    }
    
    return tiles;
  }
}
