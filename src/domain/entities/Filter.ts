export interface FilterOptions {
  mapId?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
  memberNames?: string[];
  rewardRange?: {
    minExp?: number;
    maxExp?: number;
    minGold?: number;
    maxGold?: number;
  };
}

export interface FilterState {
  filters: FilterOptions;
  isActive: boolean;
  totalCount: number;
  filteredCount: number;
}
