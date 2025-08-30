import { Battle } from '@/domain/entities/Battle';
import { FilterOptions } from '@/domain/entities/Filter';
import { IBattleRepository } from '@/domain/repositories/IBattleRepository';
import { MockBattleAPI } from '../api/mockApi';

export class BattleRepository implements IBattleRepository {
  private api: MockBattleAPI;

  constructor() {
    this.api = new MockBattleAPI();
  }

  async upload(data: Battle[]): Promise<void> {
    await this.api.uploadBattles(data);
  }

  async getAll(): Promise<Battle[]> {
    return await this.api.getBattles();
  }

  async getById(id: number): Promise<Battle | null> {
    return await this.api.getBattleById(id);
  }

  async filter(options: FilterOptions): Promise<Battle[]> {
    return await this.api.getBattles(options);
  }

  async getAvailableMaps(): Promise<number[]> {
    return await this.api.getAvailableMaps();
  }

  async getAvailableMembers(): Promise<string[]> {
    return await this.api.getAvailableMembers();
  }
}
