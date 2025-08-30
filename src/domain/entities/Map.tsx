// 맵 설정 정보
export interface MapConfig {
  imageUrl: string              // 맵 이미지 경로
  width: number                 // 맵 너비 (6000px)
  height: number                // 맵 높이 (8000px)
  bounds: [[number, number], [number, number]]  // 맵 경계
  zoom: {
    min: number                 // 최소 줌 레벨
    max: number                 // 최대 줌 레벨
    default: number             // 기본 줌 레벨
  }
}

// 맵 메타데이터
export interface MapMetadata {
  id: number                    // 맵 ID
  name: string                  // 맵 이름
  description?: string          // 맵 설명
}
