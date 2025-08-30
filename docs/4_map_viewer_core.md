# 맵 뷰어 핵심 기능

## 맵 컴포넌트 Props

### presentation/components/map/MapViewer.tsx
interface MapViewerProps {
  battles: Battle[];
  onMarkerClick: (battle: Battle) => void;
  filterOptions?: FilterOptions;
}

## Leaflet 설정

### presentation/components/map/LeafletMap.tsx
const mapConfig = {
  crs: L.CRS.Simple,
  minZoom: 10,
  maxZoom: 18,
  zoomControl: true,
  attributionControl: false,
  maxBounds: [[0, 0], [8000, 6000]]
};

## 마커 시스템

### presentation/components/map/BattleMarker.tsx
interface BattleMarkerProps {
  battle: Battle;
  onClick: (battle: Battle) => void;
}

// 몬스터/플레이어 구분 마커
const createMarkerIcon = (battle: Battle) => {
  const isPlayerBattle = battle.members.some(m => m.is_npc === 0);
  return L.divIcon({
    className: isPlayerBattle ? 'player-marker' : 'monster-marker',
    html: `<div class="marker-${battle.field}"></div>`,
    iconSize: [20, 20]
  });
};

## 좌표계 변환

### shared/utils/coordinateUtils.ts
class CoordinateConverter {
  // 게임 좌표를 Leaflet 좌표로 변환
  gameToLeaflet(x: number, y: number): [number, number] {
    return [y, x]; // y를 lat, x를 lng로
  }
  
  leafletToGame(lat: number, lng: number): [number, number] {
    return [lng, lat];
  }
  
  validateCoordinates(x: number, y: number): boolean {
    return x >= 0 && x <= 6000 && y >= 0 && y <= 8000;
  }
}

## 미니맵

### presentation/components/map/MiniMap.tsx
interface MiniMapProps {
  position: 'topright' | 'topleft' | 'bottomright' | 'bottomleft';
  width: 150;
  height: 200;
}
