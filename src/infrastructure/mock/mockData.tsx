import { Battle } from '@/domain/entities/Battle'

// 실제 샘플 데이터를 기반으로 한 Mock 데이터
export const mockBattles: Battle[] = [
  {
    id: 258758,
    map: 7001000,
    x: 837,
    y: 7440,
    floor: 0,
    field: 30,
    num_member: 5,
    members: [
      {
        id: 1,
        x: 5,
        y: 6,
        name: "Grute",
        current_hp: 4626,
        max_hp: 5189,
        current_sp: 1715,
        max_sp: 1715,
        job: 13,
        sex: 2,
        color: 13,
        is_npc: 0,  // 플레이어
        guild_name: "I'm",
        role: 16410
      },
      {
        id: 2,
        x: 6,
        y: 7,
        name: "龍牙兵",
        current_hp: 2000,
        max_hp: 10079,
        current_sp: 19998,
        max_sp: 19998,
        job: 300003,
        sex: 0,
        color: 4,
        is_npc: 4294967295,  // NPC/몬스터
        guild_name: "",
        role: 0
      },
      {
        id: 3,
        x: 5,
        y: 8,
        name: "龍牙兵",
        current_hp: 2000,
        max_hp: 10079,
        current_sp: 19998,
        max_sp: 19998,
        job: 300003,
        sex: 0,
        color: 4,
        is_npc: 4294967295,
        guild_name: "",
        role: 0
      }
    ],
    actions: [
      { id: 2, type: 5, value: 27 },
      { id: 3, type: 5, value: 32 }
    ],
    results: [
      {
        type: "status_change",
        unknown_000: 0,
        id: 2,
        message: "(2,stnw=1073741824)"
      },
      {
        type: "battle_end",
        message: "battle_end"
      }
    ],
    is_event: false,
    from: "packets/sample_001.bin",
    reward: {
      exp: 2199,
      gold: 24,
      unknown_000: 3,
      unknown_001: 0,
      unknown_002: 128
    }
  },
  {
    id: 452104,
    map: 0,
    x: 2190,
    y: 3197,
    floor: 0,
    field: 0,
    num_member: 3,
    members: [
      {
        id: 1,
        x: 5,
        y: 1,
        name: "Mantis",
        current_hp: 2674,
        max_hp: 3266,
        current_sp: 625,
        max_sp: 625,
        job: 13,
        sex: 2,
        color: 4,
        is_npc: 0,
        guild_name: "I'm",
        role: 16394
      },
      {
        id: 5,
        x: 7,
        y: 6,
        name: "狼人戰士",
        current_hp: 34,
        max_hp: 34,
        current_sp: 9999,
        max_sp: 9999,
        job: 400001,
        sex: 0,
        color: 0,
        is_npc: 4294967295,
        guild_name: "",
        role: 0
      }
    ],
    actions: [],
    results: [],
    is_event: false,
    from: "packets/sample_002.bin",
    reward: {
      exp: 45,
      gold: 15,
      unknown_000: 1,
      unknown_001: 0,
      unknown_002: 128
    }
  },
  {
    id: 715818,
    map: 0,
    x: 2305,
    y: 3327,
    floor: 0,
    field: 1,
    num_member: 2,
    members: [
      {
        id: 1,
        x: 5,
        y: 6,
        name: "Grute",
        current_hp: 4147,
        max_hp: 5189,
        current_sp: 1644,
        max_sp: 1715,
        job: 13,
        sex: 2,
        color: 13,
        is_npc: 0,
        guild_name: "I'm",
        role: 16410
      },
      {
        id: 5,
        x: 7,
        y: 4,
        name: "狼人戰士",
        current_hp: 38,
        max_hp: 38,
        current_sp: 9999,
        max_sp: 9999,
        job: 400001,
        sex: 0,
        color: 0,
        is_npc: 4294967295,
        guild_name: "",
        role: 0
      }
    ],
    actions: [],
    results: [],
    is_event: false,
    from: "packets/sample_003.bin",
    reward: {
      exp: 23,
      gold: 10,
      unknown_000: 1,
      unknown_001: 0,
      unknown_002: 128
    }
  }
]

export function getMockBattleById(id: number): Battle | undefined {
  return mockBattles.find(battle => battle.id === id)
}

export function getMockBattlesByMap(mapId: number): Battle[] {
  return mockBattles.filter(battle => battle.map === mapId)
}

export function getUniqueMapIds(): number[] {
  return [...new Set(mockBattles.map(battle => battle.map))]
}

export function getUniqueMemberNames(): string[] {
  const names = new Set<string>()
  mockBattles.forEach(battle => {
    battle.members.forEach(member => {
      names.add(member.name)
    })
  })
  return Array.from(names)
}