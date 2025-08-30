'use client'

import { useCallback, useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Battle } from '@/domain/entities/Battle'

interface FileUploaderProps {
  onUpload: (battles: Battle[]) => void
}

export default function FileUploader({ onUpload }: FileUploaderProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  const [uploadedCount, setUploadedCount] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [currentFile, setCurrentFile] = useState<string>('')
  
  // useRef로 진행률 업데이트를 더 부드럽게
  const progressRef = useRef<number>(0)

  // 진행률 업데이트 함수
  const updateProgress = (value: number) => {
    progressRef.current = value
    setProgress(value)
  }

  const processFile = async (file: File) => {
    try {
      setUploadStatus('processing')
      setCurrentFile(file.name)
      updateProgress(0)
      
      // 파일 크기 표시
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2)
      setMessage(`파일 읽는 중: ${file.name} (${fileSizeMB}MB)`)
      
      // 약간의 지연을 주어 UI 업데이트
      await new Promise(resolve => setTimeout(resolve, 100))
      updateProgress(10)

      // 파일 읽기
      const text = await file.text()
      updateProgress(30)
      setMessage(`파싱 중: ${file.name}`)
      
      // UI 업데이트를 위한 짧은 대기
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // JSON 파싱
      let data
      try {
        data = JSON.parse(text)
        updateProgress(50)
      } catch (parseError) {
        throw new Error('JSON 파싱 실패: 올바른 JSON 형식이 아닙니다')
      }

      // 배열인지 확인
      const battles: Battle[] = Array.isArray(data) ? data : [data]
      const totalBattles = battles.length
      
      setMessage(`검증 중: ${totalBattles.toLocaleString()}개 전투 데이터`)
      
      // 대용량 데이터 처리를 위한 배치 처리
      const batchSize = 500 // 배치 크기 줄임
      const validBattles: Battle[] = []
      let processedCount = 0
      
      for (let i = 0; i < battles.length; i += batchSize) {
        const batch = battles.slice(i, i + batchSize)
        processedCount += batch.length
        
        // 진행률 업데이트 (50% ~ 90% 구간)
        const currentProgress = 50 + ((processedCount / totalBattles) * 40)
        updateProgress(Math.round(currentProgress))
        
        // 진행 상황 메시지 업데이트
        setMessage(`처리 중: ${processedCount.toLocaleString()} / ${totalBattles.toLocaleString()} 전투`)
        
        // 배치 검증
        const validBatch = batch.filter(battle => {
          try {
            return battle && 
                   battle.id !== undefined && 
                   typeof battle.x === 'number' && 
                   typeof battle.y === 'number' &&
                   battle.members && 
                   Array.isArray(battle.members)
          } catch {
            return false
          }
        })
        
        validBattles.push(...validBatch)
        
        // UI 업데이트를 위한 대기 (진행률이 보이도록)
        await new Promise(resolve => setTimeout(resolve, 10))
      }

      updateProgress(95)
      setMessage('데이터 최종 처리 중...')
      
      // 약간의 지연
      await new Promise(resolve => setTimeout(resolve, 100))

      if (validBattles.length === 0) {
        throw new Error('유효한 전투 데이터가 없습니다')
      }

      // 좌표 범위 체크
      let outOfBoundsCount = 0
      validBattles.forEach(battle => {
        if (battle.x < 0 || battle.x > 5120 || battle.y < 0 || battle.y > 7740) {
          outOfBoundsCount++
        }
      })

      updateProgress(100)
      setUploadedCount(validBattles.length)
      setUploadStatus('success')
      
      const invalidCount = battles.length - validBattles.length
      setMessage(
        `✅ ${validBattles.length.toLocaleString()}개 전투 로드 완료` +
        (invalidCount > 0 ? ` (${invalidCount.toLocaleString()}개 무효)` : '') +
        (outOfBoundsCount > 0 ? ` ⚠️ ${outOfBoundsCount}개 범위 초과` : '')
      )
      
      // 부모 컴포넌트로 데이터 전달
      onUpload(validBattles)

      // 성공 후 초기화
      setTimeout(() => {
        setUploadStatus('idle')
        setMessage('')
        setUploadedCount(0)
        updateProgress(0)
        setCurrentFile('')
      }, 5000)

    } catch (error) {
      console.error('파일 처리 오류:', error)
      setUploadStatus('error')
      updateProgress(0)
      
      if (error instanceof SyntaxError) {
        setMessage('❌ JSON 파일 형식이 올바르지 않습니다')
      } else if (error instanceof RangeError) {
        setMessage('❌ 파일이 너무 큽니다. 메모리 부족')
      } else {
        setMessage(`❌ ${error instanceof Error ? error.message : '파일 처리 중 오류가 발생했습니다'}`)
      }
      
      setTimeout(() => {
        setUploadStatus('idle')
        setMessage('')
        setCurrentFile('')
      }, 5000)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // 거부된 파일 처리
    if (rejectedFiles.length > 0) {
      const rejected = rejectedFiles[0]
      if (rejected.file.size > 500 * 1024 * 1024) {
        setUploadStatus('error')
        setMessage(`❌ 파일이 너무 큽니다: ${(rejected.file.size / 1024 / 1024).toFixed(2)}MB (최대 500MB)`)
      } else {
        setUploadStatus('error')
        setMessage(`❌ ${rejected.file.name}은 지원하지 않는 파일 형식입니다`)
      }
      return
    }

    if (acceptedFiles.length === 0) return

    // 여러 파일 순차 처리
    for (const file of acceptedFiles) {
      if (!file.name.endsWith('.json')) {
        setUploadStatus('error')
        setMessage(`❌ ${file.name}은 JSON 파일이 아닙니다`)
        continue
      }

      await processFile(file)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    multiple: true,
    maxSize: 500 * 1024 * 1024  // 500MB
  })

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-white mb-3">데이터 업로드</h3>
      
      {/* 드롭존 */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-blue-500 bg-blue-500/10' 
            : uploadStatus === 'success'
            ? 'border-green-500 bg-green-500/10'
            : uploadStatus === 'error'
            ? 'border-red-500 bg-red-500/10'
            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        {/* 아이콘 */}
        <div className="text-4xl mb-3">
          {uploadStatus === 'processing' ? '⏳' : 
           uploadStatus === 'success' ? '✅' :
           uploadStatus === 'error' ? '❌' :
           isDragActive ? '📥' : '📁'}
        </div>

        {/* 진행률 바 - 더 눈에 띄게 */}
        {uploadStatus === 'processing' && (
          <>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-blue-400 mb-2">{progress}%</p>
          </>
        )}

        {/* 메시지 */}
        <p className={`
          text-sm
          ${uploadStatus === 'success' ? 'text-green-400' :
            uploadStatus === 'error' ? 'text-red-400' :
            uploadStatus === 'processing' ? 'text-blue-400' :
            'text-gray-400'}
        `}>
          {message || 
           (isDragActive ? '파일을 놓으세요' : 
            'JSON 파일을 드래그하거나 클릭하여 선택')}
        </p>

        {/* 현재 처리 중인 파일 */}
        {currentFile && uploadStatus === 'processing' && (
          <p className="text-xs text-gray-500 mt-1">
            파일: {currentFile}
          </p>
        )}

        {/* 업로드 카운트 */}
        {uploadedCount > 0 && uploadStatus === 'success' && (
          <p className="text-sm text-blue-400 mt-2 font-semibold">
            🎉 {uploadedCount.toLocaleString()}개 전투 데이터 추가됨
          </p>
        )}
      </div>

      {/* 도움말 */}
      <div className="mt-3 text-xs text-gray-500">
        <p>• JSON 배열 형식의 전투 데이터</p>
        <p>• 최대 파일 크기: 500MB</p>
        <p>• 여러 파일 동시 업로드 가능</p>
        {uploadStatus === 'processing' && (
          <p className="text-yellow-400 mt-1">
            💡 대용량 파일은 처리 시간이 걸립니다. 잠시만 기다려주세요...
          </p>
        )}
      </div>

      {/* 백엔드 연동 안내 */}
      <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded text-xs text-blue-300">
        <p className="font-semibold mb-1">💡 백엔드 연동 예정</p>
        <p>• API를 통한 실시간 데이터 로드</p>
        <p>• 페이지네이션으로 대용량 처리</p>
        <p>• 서버 사이드 필터링 지원</p>
      </div>
    </div>
  )
}
