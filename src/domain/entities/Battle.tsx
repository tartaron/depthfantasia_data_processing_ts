// 전투 데이터의 "설계도"를 만드는 것
// 이것이 우리 앱의 핵심 데이터 구조입니다

export interface Battle {
  id: number
  map: number
  x: number      // 가로 좌표
  y: number      // 세로 좌표
  floor: number
  field: number
  num_member: number
  members: BattleMember[]
  actions: BattleAction[]
  results: BattleResult[]
  is_event: boolean
  from: string
  reward?: BattleReward
}

export interface BattleMember {
  id: number
  x: number
  y: number
  name: string
  current_hp: number
  max_hp: number
  job: number
  is_npc: number  // 0이면 플레이어, 아니면 NPC
  guild_name?: string
}

export interface BattleReward {
  exp: number
  gold: number
}

export interface BattleAction {
  id: number
  type: number
  value: number
}

export interface BattleResult {
  type: string
  from?: number
  skill?: number
  message: string
}