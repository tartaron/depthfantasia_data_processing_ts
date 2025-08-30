export const MAP_CONSTANTS = {
  WIDTH: 6000,
  HEIGHT: 8000,
  TILE_SIZE: 256,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
  DEFAULT_ZOOM: 14,
  BOUNDS: [[0, 0], [8000, 6000]] as [[number, number], [number, number]],
  CENTER: [4000, 3000] as [number, number]
} as const;

export const MARKER_STYLES = {
  PLAYER: {
    className: 'player-marker',
    color: '#3b82f6',
    size: 20
  },
  MONSTER: {
    className: 'monster-marker',
    color: '#ef4444',
    size: 20
  }
} as const;
