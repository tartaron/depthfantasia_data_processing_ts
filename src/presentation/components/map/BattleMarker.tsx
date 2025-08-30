'use client';

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Battle } from '@/domain/entities/Battle';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet 아이콘 문제 해결
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface BattleMarkerProps {
  battle: Battle;
  position: [number, number];
  onClick: () => void;
}

export const BattleMarker: React.FC<BattleMarkerProps> = ({ 
  battle, 
  position, 
  onClick 
}) => {
  const createMarkerIcon = (battle: Battle) => {
    const isPlayerBattle = battle.members.some(m => m.is_npc === 0);
    const className = isPlayerBattle ? 'player-marker' : 'monster-marker';
    
    return L.divIcon({
      className: `marker ${className}`,
      html: `<div class="marker-${battle.field}"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <Marker
      position={position}
      icon={createMarkerIcon(battle)}
      eventHandlers={{
        click: onClick
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-bold text-sm">전투 #{battle.id}</h3>
          <p className="text-xs text-gray-600">맵: {battle.map}</p>
          <p className="text-xs text-gray-600">좌표: ({battle.x}, {battle.y})</p>
          <p className="text-xs text-gray-600">멤버: {battle.num_member}명</p>
          {battle.reward && (
            <div className="mt-1">
              <p className="text-xs text-green-600">경험치: {battle.reward.exp}</p>
              <p className="text-xs text-yellow-600">골드: {battle.reward.gold}</p>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};
