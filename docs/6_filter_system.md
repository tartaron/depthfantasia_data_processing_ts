# 필터 시스템

## 필터 패널

### presentation/components/filter/FilterPanel.tsx
interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  availableMaps: number[];
  availableMembers: string[];
}

## 필터 컨트롤
- 맵 선택 (드롭다운)
- 멤버 이름 검색 (자동완성)
- 보상 범위 슬라이더 (경험치/골드)
- 날짜 범위 선택

## 필터 상태 관리

### presentation/store/filterStore.ts
interface FilterStore {
  filters: FilterOptions;
  setFilter: (key: keyof FilterOptions, value: any) => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

## 필터 로직

### application/usecases/FilterBattleData.ts
class FilterBattleDataUseCase {
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
    
    return filtered;
  }
}

## 필터 결과 표시

### presentation/components/filter/FilterResults.tsx
interface FilterResultsProps {
  totalCount: number;
  filteredCount: number;
  activeFilters: string[];
}
