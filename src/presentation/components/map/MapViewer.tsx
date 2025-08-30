'use client';

import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Battle } from '@/domain/entities/Battle';
import { BattleMarker } from './BattleMarker';
import { CoordinateConverter } from '@/shared/utils/coordinateUtils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewerProps {
  battles: Battle[];
  onMarkerClick: (battle: Battle) => void;
  filterOptions?: any;
}

export const MapViewer: React.FC<MapViewerProps> = ({ 
  battles, 
  onMarkerClick 
}) => {
  return (
    <div className="w-full h-full">
      <MapContainer
        center={[4000, 3000]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        crs={L.CRS.Simple}
        minZoom={10}
        maxZoom={18}
        zoomControl={true}
        attributionControl={false}
        maxBounds={[[0, 0], [8000, 6000]]}
      >
        {/* 기본 배경색으로 맵 영역 표시 */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f8fafc',
            zIndex: -1
          }}
        />
        
        {battles.map((battle) => {
          const [lat, lng] = CoordinateConverter.gameToLeaflet(battle.x, battle.y);
          return (
            <BattleMarker
              key={battle.id}
              battle={battle}
              position={[lat, lng]}
              onClick={() => onMarkerClick(battle)}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};
