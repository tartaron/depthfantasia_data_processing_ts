# 타입 정의 및 도메인 모델

## Battle Entity

### domain/entities/Battle.ts
interface Battle {
  id: number;
  map: number;
  x: number;
  y: number;
  floor: number;
  field: number;
  num_member: number;
  members: BattleMember[];
  actions: BattleAction[];
  results: BattleResult[];
  is_event: boolean;
  from: string;
  reward?: BattleReward;
}

interface BattleMember {
  id: number;
  x: number;
  y: number;
  name: string;
  current_hp: number;
  max_hp: number;
  job: number;
  is_npc: number;
  guild_name?: string;
}

interface BattleReward {
  exp: number;
  gold: number;
}

## Map Configuration

### domain/entities/Map.ts
interface MapConfig {
  imageUrl: string;
  width: 6000;
  height: 8000;
  bounds: [[0, 0], [8000, 6000]];
  zoom: {
    min: 10;
    max: 18;
    default: 14;
  };
}

## Filter Types

### domain/entities/Filter.ts
interface FilterOptions {
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

## Repository Interface

### domain/repositories/IBattleRepository.ts
interface IBattleRepository {
  upload(data: Battle[]): Promise<void>;
  getAll(): Promise<Battle[]>;
  getById(id: number): Promise<Battle | null>;
  filter(options: FilterOptions): Promise<Battle[]>;
}
