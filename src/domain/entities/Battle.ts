// 전투 데이터의 "설계도"
// 샘플 데이터를 보고 만든 타입 정의입니다

export interface Battle {
    id: number                    // 전투 고유 ID
    map: number                   // 맵 번호 (0, 6003000, 7001000 등)
    x: number                     // X 좌표
    y: number                     // Y 좌표
    floor: number                 // 층 정보
    field: number                 // 필드 타입
    num_member: number            // 참가자 수
    members: BattleMember[]       // 참가자 목록
    actions: BattleAction[]       // 전투 액션
    results: BattleResult[]       // 전투 결과
    is_event: boolean             // 이벤트 전투 여부
    from: string                  // 데이터 출처 (패킷 파일 경로)
    reward?: BattleReward         // 보상 (있을 수도 없을 수도)
  }
  
  // 전투 참가자 (플레이어 or 몬스터)
  export interface BattleMember {
    id: number
    x: number                     // 전투 필드 내 X 위치
    y: number                     // 전투 필드 내 Y 위치
    name: string                  // 이름 (Grute, 龍牙兵 등)
    current_hp: number
    max_hp: number
    current_sp: number
    max_sp: number
    job: number                   // 직업 코드
    sex: number                   // 성별
    color: number                 // 색상 코드
    is_npc: number               // 0 = 플레이어, 4294967295 = NPC/몬스터
    guild_name?: string          // 길드명 (플레이어만)
    role?: number
  }
  
  // 전투 액션
  export interface BattleAction {
    id: number
    type: number                  // 액션 타입 (0~6)
    value: number                 // 액션 값 (스킬 ID 등)
  }
  
  // 전투 결과
  export interface BattleResult {
    type: string                  // "status_change", "skill_result", "battle_end" 등
    from?: number
    skill?: number
    message: string
    unknown_000?: number
    id?: number
  }
  
  // 전투 보상
  export interface BattleReward {
    exp: number                   // 경험치
    gold: number                  // 골드
    unknown_000?: number
    unknown_001?: number
    unknown_002?: number
  }
  