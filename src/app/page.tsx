'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { mockBattles } from '@/infrastructure/mock/mockData'
import { Battle } from '@/domain/entities/Battle'
import FileUploader from '@/presentation/components/upload/FileUploader'
import FilterPanel from '@/presentation/components/filter/FilterPanel'

const MapViewer = dynamic(
  () => import('@/presentation/components/map/MapViewer'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[800px] bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-white">맵 로딩중...</p>
      </div>
    )
  }
)

export default function Home() {
  const [battles, setBattles] = useState<Battle[]>(mockBattles)
  const [filteredBattles, setFilteredBattles] = useState<Battle[]>(mockBattles)
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null)
  const [dataSource, setDataSource] = useState<'mock' | 'uploaded'>('mock')

  // 통계 계산 (필터된 데이터 기준)
  const totalBattles = filteredBattles.length
  const totalExp = filteredBattles.reduce((sum, b) => sum + (b.reward?.exp || 0), 0)
  const totalGold = filteredBattles.reduce((sum, b) => sum + (b.reward?.gold || 0), 0)
  
  // 맵별 전투 수
  const battlesByMap = filteredBattles.reduce((acc, battle) => {
    acc[battle.map] = (acc[battle.map] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const handleMarkerClick = (battle: Battle) => {
    setSelectedBattle(battle)
  }

  // 파일 업로드 핸들러
  const handleFileUpload = (uploadedBattles: Battle[]) => {
    setBattles(uploadedBattles)
    setFilteredBattles(uploadedBattles)
    setDataSource('uploaded')
    setSelectedBattle(null)
  }

  // 필터 변경 핸들러
  const handleFilterChange = useCallback((filtered: Battle[]) => {
    setFilteredBattles(filtered)
    // 선택된 전투가 필터에서 제외되면 선택 해제
    if (selectedBattle && !filtered.find(b => b.id === selectedBattle.id)) {
      setSelectedBattle(null)
    }
  }, [selectedBattle])

  // 데이터 리셋
  const handleReset = () => {
    setBattles(mockBattles)
    setFilteredBattles(mockBattles)
    setDataSource('mock')
    setSelectedBattle(null)
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 lg:p-8">
      <div className="max-w-[1920px] mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          DepthFantasia Battle Viewer
        </h1>
        
        {/* 레이아웃: 사이드바 + 메인 콘텐츠 */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 왼쪽 사이드바 */}
          <div className="lg:w-80 space-y-4">
            {/* 파일 업로더 */}
            <FileUploader onUpload={handleFileUpload} />
            
            {/* 데이터 소스 */}
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">현재 데이터</p>
              <p className="font-semibold mt-1">
                {dataSource === 'mock' ? '📦 샘플 데이터' : '📁 업로드된 데이터'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                전체: {battles.length.toLocaleString()}개 전투
              </p>
              {dataSource === 'uploaded' && (
                <button
                  onClick={handleReset}
                  className="mt-3 text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors w-full"
                >
                  샘플 데이터로 복원
                </button>
              )}
            </div>

            {/* 필터 패널 */}
            <FilterPanel 
              battles={battles}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1 space-y-6">
            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-gray-400 text-sm">표시된 전투</h2>
                <p className="text-2xl font-bold">
                  {totalBattles.toLocaleString()}
                  <span className="text-sm text-gray-500 ml-2">
                    / {battles.length.toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-gray-400 text-sm">총 경험치</h2>
                <p className="text-2xl font-bold text-yellow-500">
                  {totalExp.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-gray-400 text-sm">총 골드</h2>
                <p className="text-2xl font-bold text-yellow-500">
                  {totalGold.toLocaleString()}
                </p>
              </div>
            </div>

            {/* 맵별 분포 */}
            {Object.keys(battlesByMap).length > 0 && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm text-gray-400 mb-2">맵별 전투 분포</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(battlesByMap).map(([mapId, count]) => (
                    <span key={mapId} className="bg-gray-700 px-3 py-1 rounded text-sm">
                      맵 {mapId}: {count}개
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 맵 뷰어 */}
            <div>
              <h2 className="text-xl font-bold mb-4">
                전투 맵
                {filteredBattles.length === 0 && (
                  <span className="text-sm font-normal text-red-400 ml-2">
                    (필터 조건에 맞는 전투가 없습니다)
                  </span>
                )}
              </h2>
              <MapViewer 
                battles={filteredBattles}
                onMarkerClick={handleMarkerClick}
              />
            </div>

            {/* 선택된 전투 정보 */}
            {selectedBattle && (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">
                    Battle #{selectedBattle.id}
                  </h3>
                  <button 
                    onClick={() => setSelectedBattle(null)}
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">위치</p>
                    <p className="font-semibold">({selectedBattle.x}, {selectedBattle.y})</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">맵 ID</p>
                    <p className="font-semibold">{selectedBattle.map}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">참가자</p>
                    <p className="font-semibold">{selectedBattle.num_member}명</p>
                  </div>
                  {selectedBattle.reward && (
                    <div>
                      <p className="text-gray-400 text-sm">보상</p>
                      <p className="font-semibold text-yellow-500">
                        EXP: {selectedBattle.reward.exp} / Gold: {selectedBattle.reward.gold}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-gray-400 text-sm mb-2">참가자 목록</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBattle.members.map(member => (
                      <div 
                        key={member.id}
                        className={`px-3 py-1 rounded text-sm ${
                          member.is_npc === 0 
                            ? 'bg-blue-600' 
                            : 'bg-red-600'
                        }`}
                      >
                        <span className="font-semibold">{member.name}</span>
                        <span className="text-xs ml-2 opacity-75">
                          HP: {member.current_hp}/{member.max_hp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  <p>출처: {selectedBattle.from}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
