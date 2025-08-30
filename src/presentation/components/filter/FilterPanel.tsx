'use client'

import { useState, useEffect } from 'react'
import { Battle } from '@/domain/entities/Battle'

interface FilterPanelProps {
  battles: Battle[]
  onFilterChange: (filtered: Battle[]) => void
}

interface FilterState {
  mapId: string
  memberName: string
  minExp: string
  maxExp: string
  minGold: string
  maxGold: string
  minX: string
  maxX: string
  minY: string
  maxY: string
  showPlayerBattles: boolean
  showMonsterBattles: boolean
}

export default function FilterPanel({ battles, onFilterChange }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    mapId: '',
    memberName: '',
    minExp: '',
    maxExp: '',
    minGold: '',
    maxGold: '',
    minX: '',
    maxX: '',
    minY: '',
    maxY: '',
    showPlayerBattles: true,
    showMonsterBattles: true
  })

  const [isExpanded, setIsExpanded] = useState(false)
  const [filteredCount, setFilteredCount] = useState(battles.length)

  // 유니크 값들 추출
  const uniqueMaps = [...new Set(battles.map(b => b.map))].sort((a, b) => a - b)
  const uniqueMembers = [...new Set(battles.flatMap(b => b.members.map(m => m.name)))].sort()

  // 필터 적용
  useEffect(() => {
    let filtered = [...battles]

    // 맵 ID 필터
    if (filters.mapId) {
      filtered = filtered.filter(b => b.map === parseInt(filters.mapId))
    }

    // 멤버 이름 필터
    if (filters.memberName) {
      filtered = filtered.filter(b => 
        b.members.some(m => 
          m.name.toLowerCase().includes(filters.memberName.toLowerCase())
        )
      )
    }

    // 경험치 범위 필터
    if (filters.minExp || filters.maxExp) {
      filtered = filtered.filter(b => {
        if (!b.reward) return false
        const exp = b.reward.exp
        const min = filters.minExp ? parseInt(filters.minExp) : 0
        const max = filters.maxExp ? parseInt(filters.maxExp) : Infinity
        return exp >= min && exp <= max
      })
    }

    // 골드 범위 필터
    if (filters.minGold || filters.maxGold) {
      filtered = filtered.filter(b => {
        if (!b.reward) return false
        const gold = b.reward.gold
        const min = filters.minGold ? parseInt(filters.minGold) : 0
        const max = filters.maxGold ? parseInt(filters.maxGold) : Infinity
        return gold >= min && gold <= max
      })
    }

    // 좌표 범위 필터
    if (filters.minX || filters.maxX) {
      filtered = filtered.filter(b => {
        const min = filters.minX ? parseInt(filters.minX) : 0
        const max = filters.maxX ? parseInt(filters.maxX) : 5120
        return b.x >= min && b.x <= max
      })
    }

    if (filters.minY || filters.maxY) {
      filtered = filtered.filter(b => {
        const min = filters.minY ? parseInt(filters.minY) : 0
        const max = filters.maxY ? parseInt(filters.maxY) : 7740
        return b.y >= min && b.y <= max
      })
    }

    // 플레이어/몬스터 전투 필터
    if (!filters.showPlayerBattles || !filters.showMonsterBattles) {
      filtered = filtered.filter(b => {
        const hasPlayer = b.members.some(m => m.is_npc === 0)
        if (!filters.showPlayerBattles && hasPlayer) return false
        if (!filters.showMonsterBattles && !hasPlayer) return false
        return true
      })
    }

    setFilteredCount(filtered.length)
    onFilterChange(filtered)
  }, [filters, battles, onFilterChange])

  // 필터 리셋
  const resetFilters = () => {
    setFilters({
      mapId: '',
      memberName: '',
      minExp: '',
      maxExp: '',
      minGold: '',
      maxGold: '',
      minX: '',
      maxX: '',
      minY: '',
      maxY: '',
      showPlayerBattles: true,
      showMonsterBattles: true
    })
  }

  // 활성 필터 개수
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'showPlayerBattles' || key === 'showMonsterBattles') {
      return value === false
    }
    return value !== ''
  }).length

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">
            필터
            {activeFilterCount > 0 && (
              <span className="ml-2 text-sm bg-blue-600 px-2 py-1 rounded">
                {activeFilterCount}개 활성
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {filteredCount.toLocaleString()} / {battles.length.toLocaleString()} 전투 표시
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* 필터 컨트롤 */}
      <div className={`space-y-3 ${isExpanded ? '' : 'hidden'}`}>
        {/* 맵 선택 */}
        <div>
          <label className="text-sm text-gray-400">맵 ID</label>
          <select
            value={filters.mapId}
            onChange={(e) => setFilters({...filters, mapId: e.target.value})}
            className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
          >
            <option value="">전체 맵</option>
            {uniqueMaps.map(mapId => (
              <option key={mapId} value={mapId}>
                맵 {mapId} ({battles.filter(b => b.map === mapId).length}개)
              </option>
            ))}
          </select>
        </div>

        {/* 멤버 이름 검색 */}
        <div>
          <label className="text-sm text-gray-400">참가자 이름</label>
          <input
            type="text"
            value={filters.memberName}
            onChange={(e) => setFilters({...filters, memberName: e.target.value})}
            placeholder="이름으로 검색..."
            className="w-full mt-1 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
          />
          {filters.memberName && (
            <div className="mt-1 text-xs text-gray-500">
              예: {uniqueMembers.filter(m => 
                m.toLowerCase().includes(filters.memberName.toLowerCase())
              ).slice(0, 3).join(', ')}
            </div>
          )}
        </div>

        {/* 보상 범위 */}
        <div>
          <label className="text-sm text-gray-400">경험치 범위</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              value={filters.minExp}
              onChange={(e) => setFilters({...filters, minExp: e.target.value})}
              placeholder="최소"
              className="flex-1 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
            />
            <span className="text-gray-400 self-center">~</span>
            <input
              type="number"
              value={filters.maxExp}
              onChange={(e) => setFilters({...filters, maxExp: e.target.value})}
              placeholder="최대"
              className="flex-1 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">골드 범위</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              value={filters.minGold}
              onChange={(e) => setFilters({...filters, minGold: e.target.value})}
              placeholder="최소"
              className="flex-1 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
            />
            <span className="text-gray-400 self-center">~</span>
            <input
              type="number"
              value={filters.maxGold}
              onChange={(e) => setFilters({...filters, maxGold: e.target.value})}
              placeholder="최대"
              className="flex-1 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 좌표 범위 */}
        <div>
          <label className="text-sm text-gray-400">X 좌표 범위 (0 ~ 5120)</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              value={filters.minX}
              onChange={(e) => setFilters({...filters, minX: e.target.value})}
              placeholder="0"
              min="0"
              max="5120"
              className="flex-1 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
            />
            <span className="text-gray-400 self-center">~</span>
            <input
              type="number"
              value={filters.maxX}
              onChange={(e) => setFilters({...filters, maxX: e.target.value})}
              placeholder="5120"
              min="0"
              max="5120"
              className="flex-1 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Y 좌표 범위 (0 ~ 7740)</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              value={filters.minY}
              onChange={(e) => setFilters({...filters, minY: e.target.value})}
              placeholder="0"
              min="0"
              max="7740"
              className="flex-1 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
            />
            <span className="text-gray-400 self-center">~</span>
            <input
              type="number"
              value={filters.maxY}
              onChange={(e) => setFilters({...filters, maxY: e.target.value})}
              placeholder="7740"
              min="0"
              max="7740"
              className="flex-1 p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 전투 타입 필터 */}
        <div>
          <label className="text-sm text-gray-400">전투 타입</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.showPlayerBattles}
                onChange={(e) => setFilters({...filters, showPlayerBattles: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-blue-400">플레이어 전투</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.showMonsterBattles}
                onChange={(e) => setFilters({...filters, showMonsterBattles: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-red-400">몬스터 전투</span>
            </label>
          </div>
        </div>

        {/* 리셋 버튼 */}
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            🔄 필터 초기화
          </button>
        )}
      </div>

      {/* 간단 보기 (접혔을 때) */}
      {!isExpanded && activeFilterCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-sm text-gray-400">활성 필터:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.mapId && (
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                맵 {filters.mapId}
              </span>
            )}
            {filters.memberName && (
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                "{filters.memberName}"
              </span>
            )}
            {(filters.minExp || filters.maxExp) && (
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                EXP: {filters.minExp || '0'}~{filters.maxExp || '∞'}
              </span>
            )}
            {!filters.showPlayerBattles && (
              <span className="text-xs bg-gray-700 px-2 py-1 rounded line-through">
                플레이어
              </span>
            )}
            {!filters.showMonsterBattles && (
              <span className="text-xs bg-gray-700 px-2 py-1 rounded line-through">
                몬스터
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
