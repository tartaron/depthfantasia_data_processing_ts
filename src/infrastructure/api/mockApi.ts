import { Battle } from '@/domain/entities/Battle';
import { FilterOptions } from '@/domain/entities/Filter';

// 샘플 데이터
const sampleBattles: Battle[] = [
  {
    id: 1,
    map: 1000,
    x: 1000,
    y: 1500,
    floor: 1,
    field: 1,
    num_member: 4,
    members: [
      {
        id: 1,
        x: 1000,
        y: 1500,
        name: "Player1",
        current_hp: 100,
        max_hp: 100,
        job: 1,
        is_npc: 0,
        guild_name: "TestGuild"
      },
      {
        id: 2,
        x: 1000,
        y: 1500,
        name: "Monster1",
        current_hp: 50,
        max_hp: 100,
        job: 2,
        is_npc: 1
      }
    ],
    actions: [],
    results: [],
    is_event: false,
    from: "2024-01-01T00:00:00Z",
    reward: {
      exp: 100,
      gold: 50
    }
  }
];

export class MockBattleAPI {
  private battles: Battle[] = [...sampleBattles];

  async uploadBattles(data: Battle[]): Promise<void> {
    this.battles.push(...data);
  }

  async getBattles(filters?: FilterOptions): Promise<Battle[]> {
    return this.filterBattles(this.battles, filters);
  }

  async getBattleById(id: number): Promise<Battle | null> {
    return this.battles.find(b => b.id === id) || null;
  }

  async getAvailableMaps(): Promise<number[]> {
    const maps = new Set(this.battles.map(b => b.map));
    return Array.from(maps).sort();
  }

  async getAvailableMembers(): Promise<string[]> {
    const members = new Set();
    this.battles.forEach(b => {
      b.members.forEach(m => members.add(m.name));
    });
    return Array.from(members).sort();
  }

  private filterBattles(battles: Battle[], filters?: FilterOptions): Battle[] {
    if (!filters) return battles;

    let filtered = [...battles];

    if (filters.mapId !== undefined) {
      filtered = filtered.filter(b => b.map === filters.mapId);
    }

    if (filters.memberNames?.length) {
      filtered = filtered.filter(b => 
        b.members.some(m => filters.memberNames!.includes(m.name))
      );
    }

    if (filters.rewardRange) {
      filtered = filtered.filter(b => {
        if (!b.reward) return false;
        const { minExp, maxExp, minGold, maxGold } = filters.rewardRange!;
        return (!minExp || b.reward.exp >= minExp) &&
               (!maxExp || b.reward.exp <= maxExp) &&
               (!minGold || b.reward.gold >= minGold) &&
               (!maxGold || b.reward.gold <= maxGold);
      });
    }

    if (filters.dateRange) {
      filtered = filtered.filter(b => {
        const battleDate = new Date(b.from);
        return battleDate >= filters.dateRange!.start && 
               battleDate <= filters.dateRange!.end;
      });
    }

    return filtered;
  }
}
