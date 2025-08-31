'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Battle } from '@/domain/entities/Battle'

// Leaflet 기본 마커 아이콘 설정
const createIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  })
}

interface MapViewerProps {
  battles: Battle[]
  onMarkerClick: (battle: Battle) => void
}

export default function MapViewer({ battles, onMarkerClick }: MapViewerProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markersLayer = useRef<L.LayerGroup | null>(null)

  // 맵 초기화
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    // Leaflet 맵 생성
    const map = L.map(mapContainer.current, {
      crs: L.CRS.Simple,
      minZoom: -5,  // 🔧 더 축소 가능하도록 -2에서 -5로 변경
      maxZoom: 2,
      zoomControl: true,
      attributionControl: false,
      zoomSnap: 0.5,  // 🔧 줌 단계를 더 세밀하게
      zoomDelta: 0.5   // 🔧 줌 변화량을 더 작게
    })

    // 맵 경계 설정
    const bounds: L.LatLngBoundsExpression = [[0, 0], [7740, 5120]]
    
    // 1. 기존 배경 및 그리드 코드 삭제

    // 배경 사각형 -> 이 블록을 삭제합니다.
    // L.rectangle(bounds, {
    //   color: '#4a5568',
    //   fillColor: '#2d3748',
    //   fillOpacity: 0.8,
    //   weight: 2
    // }).addTo(map)

    // 그리드 추가 (1000 단위) -> 이 블록을 삭제합니다.
    // 세로선 (X축)
    for (let x = 0; x <= 5120; x += 1000) {
      L.polyline([[0, x], [7740, x]], { 
        color: '#94a3b8', 
        weight: 0.5,
        opacity: 0.6 
      }).addTo(map)
    }
    
    // 가로선 (Y축)
    for (let y = 0; y <= 7740; y += 1000) {
      L.polyline([[y, 0], [y, 5120]], { 
        color: '#94a3b8', 
        weight: 0.5,
        opacity: 0.6 
      }).addTo(map)
    }


    // 2. 삭제한 위치에 이미지 레이어 코드를 추가합니다.
    // public 폴더 기준의 경로를 사용합니다.
    const imageUrl = '/images/world_map.png'; // 1단계에서 넣은 이미지 경로
    L.imageOverlay(imageUrl, bounds).addTo(map);

    // 좌표 라벨 표시 (주요 지점만)
    const coordinatePoints = [
      { x: 0, y: 0, label: '(0, 0)' },
      { x: 5120, y: 0, label: '(5120, 0)' },
      { x: 0, y: 7740, label: '(0, 7740)' },
      { x: 5120, y: 7740, label: '(5120, 7740)' },
      { x: 2560, y: 3870, label: '(2560, 3870)' },
    ]

    coordinatePoints.forEach(point => {
      const leafletY = 7740 - point.y
      
      L.marker([leafletY, point.x], {
        icon: L.divIcon({
          className: 'coordinate-label',
          html: `<div style="
            color: #cbd5e0;
            font-size: 11px;
            font-weight: bold;
            background: rgba(0,0,0,0.7);
            padding: 2px 6px;
            border-radius: 3px;
            border: 1px solid #4a5568;
            white-space: nowrap;
          ">${point.label}</div>`,
          iconSize: [80, 20],
          iconAnchor: [40, 10]
        })
      }).addTo(map)
    })

    // 🔧 초기 뷰를 전체 맵이 보이도록 설정 (패딩 추가로 여유 공간 확보)
    map.fitBounds(bounds, {
      padding: [50, 50]  // 상하좌우 50px 여유
    })
    
    // 마커 레이어 그룹 생성
    markersLayer.current = L.layerGroup().addTo(map)
    
    mapInstance.current = map

    // 클린업
    return () => {
      map.remove()
      mapInstance.current = null
      markersLayer.current = null
    }
  }, [])

  // 마커 업데이트
  useEffect(() => {
    if (!mapInstance.current || !markersLayer.current) return

    // 기존 마커 제거
    markersLayer.current.clearLayers()

    // 새 마커 추가
    battles.forEach(battle => {
      if (battle.x < 0 || battle.x > 5120 || battle.y < 0 || battle.y > 7740) {
        console.warn(`Battle #${battle.id} 좌표가 맵 범위를 벗어남:`, battle.x, battle.y)
        return
      }

      const isPlayerBattle = battle.members.some(m => m.is_npc === 0)
      const icon = createIcon(isPlayerBattle ? '#3b82f6' : '#ef4444')
      
      const leafletY = 7740 - battle.y
      const leafletX = battle.x
      
      const marker = L.marker([leafletY, leafletX], { icon })
      
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">
            Battle #${battle.id}
          </h3>
          <p style="margin: 4px 0; color: #666;">
            게임 좌표: (${battle.x}, ${battle.y})
          </p>
          <p style="margin: 4px 0; color: #666;">
            맵 ID: ${battle.map}
          </p>
          <p style="margin: 4px 0; color: #666;">
            참가자: ${battle.num_member}명
          </p>
          ${battle.reward ? `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd;">
              <p style="margin: 2px 0; color: #f59e0b;">
                EXP: ${battle.reward.exp} | Gold: ${battle.reward.gold}
              </p>
            </div>
          ` : ''}
        </div>
      `
      
      marker.bindPopup(popupContent)
      
      marker.on('click', () => {
        onMarkerClick(battle)
      })
      
      markersLayer.current!.addLayer(marker)
    })

    console.log('전투 좌표 확인:')
    battles.forEach(b => {
      console.log(`Battle #${b.id}: (${b.x}, ${b.y})`)
    })
  }, [battles, onMarkerClick])

  return (
    <div className="relative">
      <div 
        ref={mapContainer}
        className="w-full h-[800px] rounded-lg overflow-hidden border-2 border-gray-700"  // 🔧 600px → 800px로 변경
        style={{ background: '#1a202c' }}
      />
      
      {/* 맵 컨트롤 정보 */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs p-2 rounded">
        <p>🖱️ 드래그: 이동 | 스크롤: 줌</p>
        <p>📍 마커 클릭: 상세 정보</p>
        <p>📐 맵 범위: (0,0) ~ (5120,7740)</p>
      </div>

      {/* 범례 */}
      <div className="absolute top-4 right-4 bg-black/70 text-white text-xs p-3 rounded">
        <p className="font-bold mb-2">범례</p>
        <div className="flex items-center gap-2 mb-1">
          <div style={{
            backgroundColor: '#3b82f6',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: '2px solid white'
          }}></div>
          <span>플레이어 전투</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{
            backgroundColor: '#ef4444',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: '2px solid white'
          }}></div>
          <span>몬스터 전투</span>
        </div>
      </div>

      {/* 🔧 줌 리셋 버튼 추가 */}
      <button
        onClick={() => {
          if (mapInstance.current) {
            mapInstance.current.fitBounds([[0, 0], [7740, 5120]], {
              padding: [50, 50]
            })
          }
        }}
        className="absolute top-20 left-3 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded shadow-lg transition-colors"
      >
        🔄 줌 리셋
      </button>
    </div>
  )
}
