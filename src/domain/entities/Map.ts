export interface MapConfig {
  imageUrl: string;
  width: 6000;
  height: 8000;
  bounds: [[0, 0], [8000, 6000]];
  zoom: {
    min: 10;
    max: 18;
    default: 14;
  };
}

export interface MapMetadata {
  name: string;
  width: number;
  height: number;
  tileSize: number;
  zoomLevels: number[];
  bounds: [[number, number], [number, number]];
}

export interface TileGrid {
  x: number;
  y: number;
  zoom: number;
  url: string;
}
