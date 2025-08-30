# 데이터 업로드 모듈

## 업로드 컴포넌트

### presentation/components/upload/FileUploader.tsx
interface FileUploaderProps {
  onUpload: (files: File[]) => void;
  accept: {
    'application/json': ['.json']
  };
  maxSize: 100 * 1024 * 1024; // 100MB
  multiple: true;
}

## 업로드 상태 관리

### presentation/store/uploadStore.ts
interface UploadState {
  files: UploadFile[];
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  errors: UploadError[];
}

interface UploadFile {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

## JSON 파서

### application/services/BattleDataParser.ts
class BattleDataParser {
  parseBattleJSON(file: File): Promise<Battle[]> {
    // JSON 파일 읽기
    // Battle[] 형태로 파싱
    // 데이터 검증
  }
  
  validateBattle(data: unknown): ValidationResult {
    // 필수 필드 확인
    // 좌표 범위 검증
    // 데이터 타입 검증
  }
  
  extractBattleInfo(rawData: any): Battle {
    return {
      id: rawData.id,
      map: rawData.map,
      x: rawData.x,
      y: rawData.y,
      // ... 나머지 필드 매핑
    };
  }
}

## 배치 처리

### application/usecases/UploadBattleData.ts
class UploadBattleDataUseCase {
  async execute(files: File[]): Promise<UploadResult> {
    const battles: Battle[] = [];
    
    for (const file of files) {
      const fileBattles = await this.parser.parseBattleJSON(file);
      battles.push(...fileBattles);
    }
    
    // 청크 단위로 처리 (1000개씩)
    const chunks = this.chunkArray(battles, 1000);
    for (const chunk of chunks) {
      await this.repository.upload(chunk);
    }
  }
}

## 에러 처리

### domain/errors/UploadErrors.ts
class InvalidFileFormatError extends Error {}
class FileSizeExceededError extends Error {}
class SchemaValidationError extends Error {}
