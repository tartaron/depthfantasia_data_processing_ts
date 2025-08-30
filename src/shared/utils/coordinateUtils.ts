export class CoordinateConverter {
  // 게임 좌표를 Leaflet 좌표로 변환
  static gameToLeaflet(x: number, y: number): [number, number] {
    return [y, x]; // y를 lat, x를 lng로
  }
  
  // Leaflet 좌표를 게임 좌표로 변환
  static leafletToGame(lat: number, lng: number): [number, number] {
    return [lng, lat];
  }
  
  // 좌표 유효성 검증
  static validateCoordinates(x: number, y: number): boolean {
    return x >= 0 && x <= 6000 && y >= 0 && y <= 8000;
  }

  // 타일 좌표 계산
  static getTileCoordinates(x: number, y: number, zoom: number): { x: number; y: number } {
    const tileSize = 256;
    const scale = Math.pow(2, zoom);
    
    return {
      x: Math.floor((x * scale) / tileSize),
      y: Math.floor((y * scale) / tileSize)
    };
  }
}
