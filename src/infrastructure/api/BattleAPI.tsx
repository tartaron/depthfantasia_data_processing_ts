import axios from 'axios'
import { Battle } from '@/domain/entities/Battle'

// 백엔드 API 클래스 (준비)
export class BattleAPI {
  private baseURL: string
  
  constructor() {
    // 환경 변수로 관리
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
  }

  // 전투 데이터 가져오기 (페이지네이션)
  async getBattles(page: number = 1, limit: number = 1000): Promise<{
    data: Battle[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const response = await axios.get(`${this.baseURL}/battles`, {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      console.error('API 호출 실패:', error)
      throw error
    }
  }

  // 전투 데이터 필터링
  async filterBattles(filters: any): Promise<Battle[]> {
    try {
      const response = await axios.post(`${this.baseURL}/battles/filter`, filters)
      return response.data
    } catch (error) {
      console.error('필터링 실패:', error)
      throw error
    }
  }

  // 전투 데이터 업로드
  async uploadBattles(battles: Battle[]): Promise<void> {
    try {
      // 대용량 데이터는 청크로 나누어 전송
      const chunkSize = 500
      for (let i = 0; i < battles.length; i += chunkSize) {
        const chunk = battles.slice(i, i + chunkSize)
        await axios.post(`${this.baseURL}/battles/upload`, chunk)
      }
    } catch (error) {
      console.error('업로드 실패:', error)
      throw error
    }
  }
}

// 싱글톤 인스턴스
export const battleAPI = new BattleAPI()
