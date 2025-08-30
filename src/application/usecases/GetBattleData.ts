import { Battle } from '@/domain/entities/Battle';
import { IBattleRepository } from '@/domain/repositories/IBattleRepository';

export class GetBattleDataUseCase {
  constructor(private repository: IBattleRepository) {}

  async getAll(): Promise<Battle[]> {
    return await this.repository.getAll();
  }

  async getById(id: number): Promise<Battle | null> {
    return await this.repository.getById(id);
  }

  async getAvailableMaps(): Promise<number[]> {
    return await this.repository.getAvailableMaps();
  }

  async getAvailableMembers(): Promise<string[]> {
    return await this.repository.getAvailableMembers();
  }
}
