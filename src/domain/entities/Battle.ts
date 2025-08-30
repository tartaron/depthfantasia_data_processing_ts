export interface Battle {
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

export interface BattleMember {
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

export interface BattleAction {
  id: number;
  type: string;
  actor: number;
  target: number;
  value: number;
  timestamp: number;
}

export interface BattleResult {
  id: number;
  type: string;
  value: number;
  timestamp: number;
}

export interface BattleReward {
  exp: number;
  gold: number;
}
