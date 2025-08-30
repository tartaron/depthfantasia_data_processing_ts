// 필터 옵션
export interface FilterOptions {
  mapId?: number                // 특정 맵만 보기
  
  dateRange?: {                 // 날짜 범위
    start: Date
    end: Date
  }
  
  memberNames?: string[]        // 특정 캐릭터가 참여한 전투
  
  rewardRange?: {               // 보상 범위
    minExp?: number
    maxExp?: number
    minGold?: number
    maxGold?: number
  }
  
  monsterTypes?: string[]       // 특정 몬스터가 있는 전투
  
  status?: ('verified' | 'unverified' | 'error')[]  // 데이터 상태
}
