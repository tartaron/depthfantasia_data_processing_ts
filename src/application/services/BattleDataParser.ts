import { Battle } from '@/domain/entities/Battle';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class BattleDataParser {
  async parseBattleJSON(file: File): Promise<Battle[]> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!Array.isArray(data)) {
        throw new Error('JSON 데이터가 배열 형태가 아닙니다.');
      }

      const battles: Battle[] = [];
      const errors: string[] = [];

      for (let i = 0; i < data.length; i++) {
        try {
          const battle = this.extractBattleInfo(data[i]);
          const validation = this.validateBattle(battle);
          
          if (validation.isValid) {
            battles.push(battle);
          } else {
            errors.push(`인덱스 ${i}: ${validation.errors.join(', ')}`);
          }
        } catch (error) {
          errors.push(`인덱스 ${i}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
      }

      if (errors.length > 0) {
        console.warn('파싱 중 일부 오류 발생:', errors);
      }

      return battles;
    } catch (error) {
      throw new Error(`JSON 파싱 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  validateBattle(data: unknown): ValidationResult {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
      errors.push('데이터가 객체가 아닙니다.');
      return { isValid: false, errors };
    }

    const battle = data as any;

    // 필수 필드 확인
    if (typeof battle.id !== 'number') errors.push('id가 숫자가 아닙니다.');
    if (typeof battle.map !== 'number') errors.push('map이 숫자가 아닙니다.');
    if (typeof battle.x !== 'number') errors.push('x가 숫자가 아닙니다.');
    if (typeof battle.y !== 'number') errors.push('y가 숫자가 아닙니다.');
    if (typeof battle.floor !== 'number') errors.push('floor가 숫자가 아닙니다.');
    if (typeof battle.field !== 'number') errors.push('field가 숫자가 아닙니다.');
    if (typeof battle.num_member !== 'number') errors.push('num_member가 숫자가 아닙니다.');
    if (!Array.isArray(battle.members)) errors.push('members가 배열이 아닙니다.');
    if (typeof battle.is_event !== 'boolean') errors.push('is_event가 불린이 아닙니다.');
    if (typeof battle.from !== 'string') errors.push('from이 문자열이 아닙니다.');

    // 좌표 범위 검증
    if (battle.x < 0 || battle.x > 6000) errors.push('x 좌표가 범위를 벗어났습니다.');
    if (battle.y < 0 || battle.y > 8000) errors.push('y 좌표가 범위를 벗어났습니다.');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  extractBattleInfo(rawData: any): Battle {
    return {
      id: rawData.id,
      map: rawData.map,
      x: rawData.x,
      y: rawData.y,
      floor: rawData.floor,
      field: rawData.field,
      num_member: rawData.num_member,
      members: rawData.members || [],
      actions: rawData.actions || [],
      results: rawData.results || [],
      is_event: rawData.is_event,
      from: rawData.from,
      reward: rawData.reward
    };
  }
}
