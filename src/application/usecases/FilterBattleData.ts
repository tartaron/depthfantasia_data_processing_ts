import { Battle } from '@/domain/entities/Battle';
import { FilterOptions } from '@/domain/entities/Filter';

export class FilterBattleDataUseCase {
  execute(battles: Battle[], filters: FilterOptions): Battle[] {
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
