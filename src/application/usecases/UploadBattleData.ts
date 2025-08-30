import { Battle } from '@/domain/entities/Battle';
import { IBattleRepository } from '@/domain/repositories/IBattleRepository';
import { BattleDataParser } from '../services/BattleDataParser';

export interface UploadResult {
  success: boolean;
  totalBattles: number;
  errors: string[];
}

export class UploadBattleDataUseCase {
  constructor(
    private repository: IBattleRepository,
    private parser: BattleDataParser
  ) {}

  async execute(files: File[]): Promise<UploadResult> {
    const battles: Battle[] = [];
    const errors: string[] = [];

    try {
      for (const file of files) {
        try {
          const fileBattles = await this.parser.parseBattleJSON(file);
          battles.push(...fileBattles);
        } catch (error) {
          errors.push(`파일 ${file.name} 처리 중 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
      }

      if (battles.length > 0) {
        // 청크 단위로 처리 (1000개씩)
        const chunks = this.chunkArray(battles, 1000);
        for (const chunk of chunks) {
          await this.repository.upload(chunk);
        }
      }

      return {
        success: errors.length === 0,
        totalBattles: battles.length,
        errors
      };
    } catch (error) {
      errors.push(`업로드 중 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      return {
        success: false,
        totalBattles: battles.length,
        errors
      };
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
