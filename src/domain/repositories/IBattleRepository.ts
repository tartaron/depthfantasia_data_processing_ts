import { Battle } from '../entities/Battle';
import { FilterOptions } from '../entities/Filter';

export interface IBattleRepository {
  upload(data: Battle[]): Promise<void>;
  getAll(): Promise<Battle[]>;
  getById(id: number): Promise<Battle | null>;
  filter(options: FilterOptions): Promise<Battle[]>;
  getAvailableMaps(): Promise<number[]>;
  getAvailableMembers(): Promise<string[]>;
}
