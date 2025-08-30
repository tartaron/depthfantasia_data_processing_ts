import axios from 'axios';
import { Battle } from '@/domain/entities/Battle';
import { FilterOptions } from '@/domain/entities/Filter';

export class BattleAPI {
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  async uploadBattles(data: Battle[]): Promise<void> {
    await axios.post(`${this.baseURL}/battles/upload`, data);
  }

  async getBattles(filters?: FilterOptions): Promise<Battle[]> {
    const response = await axios.get(`${this.baseURL}/battles`, {
      params: filters
    });
    return response.data;
  }

  async getBattleById(id: number): Promise<Battle | null> {
    try {
      const response = await axios.get(`${this.baseURL}/battles/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getAvailableMaps(): Promise<number[]> {
    const response = await axios.get(`${this.baseURL}/battles/maps`);
    return response.data;
  }

  async getAvailableMembers(): Promise<string[]> {
    const response = await axios.get(`${this.baseURL}/battles/members`);
    return response.data;
  }
}
