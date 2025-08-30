'use client'

import { Battle } from '@/domain/entities/Battle'

interface SimpleMapViewerProps {
  battles: Battle[]
  onMarkerClick: (battle: Battle) => void
}

export default function SimpleMapViewer({ battles, onMarkerClick }: SimpleMapViewerProps) {
  // 맵 크기 설정 (실제: 5120x7740, 화면: 512x774으로 축소)
  const MAP_WIDTH = 512
  const MAP_HEIGHT = 774
  const SCALE_X = MAP_WIDTH / 5120
  const SCALE_Y = MAP_HEIGHT / 7740

  // 좌표 변환 함수
  const scaleX = (x: number) => x * SCALE_X
  const scaleY = (y: number) => y * SCALE_Y

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden" 
         style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
      {/* 맵 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700">
        {/* 그리드 라인 (선택사항) */}
        <svg className="absolute inset-0 w-full h-full">
          {/* 세로선 */}
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <line
              key={`v-${i}`}
              x1={i * 100}
              y1={0}
              x2={i * 100}
              y2={MAP_HEIGHT}
              stroke="#374151"
              strokeWidth="1"
            />
          ))}
          {/* 가로선 */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * 100}
              x2={MAP_WIDTH}
              y2={i * 100}
              stroke="#374151"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* 전투 마커들 */}
      {battles.map(battle => {
        const x = scaleX(battle.x)
        const y = scaleY(battle.y)
        const isPlayerBattle = battle.members.some(m => m.is_npc === 0)

        return (
          <button
            key={battle.id}
            className={`absolute w-3 h-3 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform cursor-pointer ${
              isPlayerBattle ? 'bg-blue-500' : 'bg-red-500'
            }`}
            style={{ left: x, top: y }}
            onClick={() => onMarkerClick(battle)}
            title={`Battle #${battle.id}\n위치: (${battle.x}, ${battle.y})`}
          />
        )
      })}

      {/* 범례 */}
      <div className="absolute top-2 right-2 bg-black/50 p-2 rounded text-xs text-white">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
          <span>플레이어 전투</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
          <span>몬스터 전투</span>
        </div>
      </div>
    </div>
  )
}
