import { Battle } from '../entities/Battle'
import { FilterOptions } from '../entities/Filter'

// Repository는 데이터를 어떻게 저장/조회할지 "약속"만 정의
// 실제 구현은 infrastructure 레이어에서 합니다
export interface IBattleRepository {
  // 전투 데이터 업로드
  upload(battles: Battle[]): Promise<void>
  
  // 모든 전투 조회
  getAll(): Promise<Battle[]>
  
  // ID로 특정 전투 조회
  getById(id: number): Promise<Battle | null>
  
  // 필터링된 전투 조회
  filter(options: FilterOptions): Promise<Battle[]>
  
  // 전투 데이터 업데이트
  update(id: number, data: Partial<Battle>): Promise<void>
  
  // 전투 데이터 삭제
  delete(id: number): Promise<void>
}
